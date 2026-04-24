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
