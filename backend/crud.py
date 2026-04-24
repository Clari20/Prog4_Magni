import json
from sqlalchemy.orm import Session
import models, schemas

def get_participantes(db: Session):
    db_participantes = db.query(models.Participante).all()
    for p in db_participantes:
        if isinstance(p.tecnologias, str):
            p.tecnologias = json.loads(p.tecnologias)
    return db_participantes

def create_participante(db: Session, participante: schemas.ParticipanteCreate):
    db_participante = models.Participante(
        id=participante.id,
        nombre=participante.nombre,
        email=participante.email,
        edad=participante.edad,
        pais=participante.pais,
        modalidad=participante.modalidad,
        tecnologias=json.dumps(participante.tecnologias),
        nivel=participante.nivel,
        aceptaTerminos=participante.aceptaTerminos
    )
    db.add(db_participante)
    db.commit()
    db.refresh(db_participante)
    db_participante.tecnologias = json.loads(db_participante.tecnologias)
    return db_participante

def delete_participante(db: Session, participante_id: str):
    db_participante = db.query(models.Participante).filter(models.Participante.id == participante_id).first()
    if db_participante:
        db.delete(db_participante)
        db.commit()
        return True
    return False

def update_participante(db: Session, participante_id: str, participante: schemas.ParticipanteCreate):
    db_participante = db.query(models.Participante).filter(models.Participante.id == participante_id).first()
    if db_participante:
        db_participante.nombre = participante.nombre
        db_participante.email = participante.email
        db_participante.edad = participante.edad
        db_participante.pais = participante.pais
        db_participante.modalidad = participante.modalidad
        db_participante.tecnologias = json.dumps(participante.tecnologias)
        db_participante.nivel = participante.nivel
        db_participante.aceptaTerminos = participante.aceptaTerminos
        db.commit()
        db.refresh(db_participante)
        db_participante.tecnologias = json.loads(db_participante.tecnologias)
        return db_participante
    return None
