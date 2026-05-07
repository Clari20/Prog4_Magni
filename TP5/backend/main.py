from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

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

@app.get("/participantes", response_model=List[schemas.Participante])
def read_participantes(db: Session = Depends(get_db)):
    return crud.get_participantes(db)

@app.post("/participantes", response_model=schemas.Participante)
def create_participante(participante: schemas.ParticipanteCreate, db: Session = Depends(get_db)):
    return crud.create_participante(db=db, participante=participante)

@app.delete("/participantes/{participante_id}")
def delete_participante(participante_id: str, db: Session = Depends(get_db)):
    success = crud.delete_participante(db, participante_id)
    if not success:
        raise HTTPException(status_code=404, detail="Participante no encontrado")
    return {"message": "Eliminado exitosamente"}

@app.put("/participantes/{participante_id}", response_model=schemas.Participante)
def update_participante(participante_id: str, participante: schemas.ParticipanteCreate, db: Session = Depends(get_db)):
    db_participante = crud.update_participante(db, participante_id, participante)
    if not db_participante:
        raise HTTPException(status_code=404, detail="Participante no encontrado")
    return db_participante
