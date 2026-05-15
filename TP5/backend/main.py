from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import jwt
import bcrypt

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
