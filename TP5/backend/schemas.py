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

class UsuarioBase(BaseModel):
    username: str
    rol: str

class UsuarioCreate(UsuarioBase):
    password: str

class UsuarioLogin(BaseModel):
    username: str
    password: str

class Usuario(UsuarioBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Usuario

class PagoRequest(BaseModel):
    titulo: str
    precio: float

class PagoResponse(BaseModel):
    init_point: str

class CompraResponse(BaseModel):
    id: int
    payment_id: str
    curso_titulo: str
    curso_precio: float
    status: str
    fecha: str

    class Config:
        from_attributes = True
