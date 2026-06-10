from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import jwt
import bcrypt
import os
from dotenv import load_dotenv
import mercadopago
import requests

load_dotenv(override=True)
import crud, models, schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Autenticación y JWT Config ---
SECRET_KEY = "mi_clave_super_secreta" # En un proyecto real esto va en .env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def verify_password(plain_password: str, hashed_password: str):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    user = crud.get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception
    return user

# --- Rutas Auth ---
@app.post("/login", response_model=schemas.Token)
def login_for_access_token(user_login: schemas.UsuarioLogin, db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=user_login.username)
    if not user or not verify_password(user_login.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "rol": user.rol}, expires_delta=access_token_expires
    )
    # Convertimos a schemas.Usuario para que calce en Token.user
    user_schema = schemas.Usuario(id=user.id, username=user.username, rol=user.rol)
    return {"access_token": access_token, "token_type": "bearer", "user": user_schema}

@app.post("/seed")
def seed_users(db: Session = Depends(get_db)):
    """ Endpoint temporal para crear usuarios de prueba """
    admin = crud.get_user_by_username(db, "admin")
    if not admin:
        crud.create_user(db, schemas.UsuarioCreate(username="admin", password=get_password_hash("admin123"), rol="ADMIN"))
    consulta = crud.get_user_by_username(db, "consulta")
    if not consulta:
        crud.create_user(db, schemas.UsuarioCreate(username="consulta", password=get_password_hash("consulta123"), rol="CONSULTA"))
    return {"msg": "Usuarios creados: admin/admin123 (ADMIN), consulta/consulta123 (CONSULTA)"}

# --- Rutas de Participantes (Protegidas) ---
@app.get("/participantes", response_model=List[schemas.Participante])
def read_participantes(db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_user)):
    return crud.get_participantes(db)

@app.post("/participantes", response_model=schemas.Participante)
def create_participante(participante: schemas.ParticipanteCreate, db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_user)):
    if current_user.rol != "ADMIN":
        raise HTTPException(status_code=403, detail="No tienes permisos para crear")
    return crud.create_participante(db=db, participante=participante)

@app.delete("/participantes/{participante_id}")
def delete_participante(participante_id: str, db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_user)):
    if current_user.rol != "ADMIN":
        raise HTTPException(status_code=403, detail="No tienes permisos para eliminar")
    success = crud.delete_participante(db, participante_id)
    if not success:
        raise HTTPException(status_code=404, detail="Participante no encontrado")
    return {"message": "Eliminado exitosamente"}

@app.put("/participantes/{participante_id}", response_model=schemas.Participante)
def update_participante(participante_id: str, participante: schemas.ParticipanteCreate, db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_user)):
    if current_user.rol != "ADMIN":
        raise HTTPException(status_code=403, detail="No tienes permisos para actualizar")
    db_participante = crud.update_participante(db, participante_id, participante)
    if not db_participante:
        raise HTTPException(status_code=404, detail="Participante no encontrado")
    return db_participante

from fastapi.responses import RedirectResponse

@app.get("/api/pagos/success")
def pago_success():
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    return RedirectResponse(url=f"{frontend_url}/cursos?status=success")

@app.get("/api/pagos/failure")
def pago_failure():
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    return RedirectResponse(url=f"{frontend_url}/cursos?status=failure")

@app.get("/api/pagos/pending")
def pago_pending():
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    return RedirectResponse(url=f"{frontend_url}/cursos?status=pending")

@app.post("/api/pagos/create-preference", response_model=schemas.PagoResponse)
def create_preference(pago_req: schemas.PagoRequest, current_user: models.Usuario = Depends(get_current_user)):
    mp_access_token = os.getenv("MP_ACCESS_TOKEN")
    if not mp_access_token:
        raise HTTPException(status_code=500, detail="MercadoPago access token no configurado en el .env")

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")
    print(f"[MP] FRONTEND_URL={frontend_url}")
    print(f"[MP] BACKEND_URL={backend_url}")

    try:
        sdk = mercadopago.SDK(mp_access_token)
        preference_data = {
            "items": [{
                "title": pago_req.titulo,
                "quantity": 1,
                "unit_price": float(pago_req.precio),
                "currency_id": "ARS",
            }],
            "external_reference": str(current_user.id),
            "back_urls": {
                "success": f"{backend_url}/api/pagos/success",
                "failure": f"{backend_url}/api/pagos/failure",
                "pending": f"{backend_url}/api/pagos/pending",
            },
            "auto_return": "approved",
            "notification_url": f"{backend_url}/api/pagos/webhook",
        }

        result = sdk.preference().create(preference_data)

        if result.get("status") not in (200, 201):
            print(f"[MERCADOPAGO ERROR] => {result}")
            raise HTTPException(status_code=500, detail=f"Error de MercadoPago: {result}")

        init_point = result.get("response", {}).get("init_point")
        if not init_point:
             raise HTTPException(status_code=500, detail="Punto de inicio no devuelto")

        return {"init_point": init_point}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/pagos/webhook")
async def mercadopago_webhook(request: Request, db: Session = Depends(get_db)):
    try:
        body = await request.json()
    except Exception:
        return {"status": "ignored"}

    if body.get("type") != "payment":
        return {"status": "ignored"}

    payment_id = body.get("data", {}).get("id")
    if not payment_id:
        return {"status": "ignored"}

    mp_access_token = os.getenv("MP_ACCESS_TOKEN")
    headers = {"Authorization": f"Bearer {mp_access_token}"}
    response = requests.get(f"https://api.mercadopago.com/v1/payments/{payment_id}", headers=headers)

    if response.status_code != 200:
        print(f"[WEBHOOK] Error al consultar pago {payment_id}: {response.status_code}")
        return {"status": "error"}

    payment_info = response.json()
    payment_status = payment_info.get("status")
    item_title = payment_info.get("additional_info", {}).get("items", [{}])[0].get("title", "Curso desconocido")
    item_price = payment_info.get("transaction_amount", 0)
    usuario_id_str = payment_info.get("external_reference")
    usuario_id = int(usuario_id_str) if usuario_id_str and usuario_id_str.isdigit() else None

    existing = db.query(models.Compra).filter(models.Compra.payment_id == str(payment_id)).first()
    if existing:
        existing.status = payment_status
        db.commit()
        print(f"[WEBHOOK] Pago {payment_id} actualizado a: {payment_status}")
    else:
        nueva_compra = models.Compra(
            payment_id=str(payment_id),
            curso_titulo=item_title,
            curso_precio=item_price,
            status=payment_status,
            usuario_id=usuario_id
        )
        db.add(nueva_compra)
        db.commit()
        print(f"[WEBHOOK] Compra registrada: {item_title} - ${item_price} - Estado: {payment_status} - Usuario: {usuario_id}")

    return {"status": "ok"}

@app.get("/api/compras", response_model=List[schemas.CompraResponse])
def get_compras(db: Session = Depends(get_db)):
    compras = db.query(models.Compra).order_by(models.Compra.fecha.desc()).all()
    for c in compras:
        c.fecha = str(c.fecha)
    return compras

@app.get("/api/compras/me", response_model=List[schemas.CompraResponse])
def get_compras_me(db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_user)):
    return crud.get_compras_by_user(db, current_user.id)
