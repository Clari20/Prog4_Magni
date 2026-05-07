from pydantic import BaseModel
from typing import List

class ParticipanteBase(BaseModel):
    id: str
    nombre: str
    email: str
    edad: int
    pais: str
    modalidad: str
    tecnologias: List[str]
    nivel: str
    aceptaTerminos: bool

class ParticipanteCreate(ParticipanteBase):
    pass

class Participante(ParticipanteBase):
    class Config:
        from_attributes = True
