from sqlalchemy import Column, String, Integer, Boolean
from database import Base

class Participante(Base):
    __tablename__ = "participantes"

    id = Column(String, primary_key=True, index=True)
    nombre = Column(String, index=True)
    email = Column(String)
    edad = Column(Integer)
    pais = Column(String)
    modalidad = Column(String)
    tecnologias = Column(String)  # JSON encoded list
    nivel = Column(String)
    aceptaTerminos = Column(Boolean)

class Usuario(Base):
    __tablename__ = "usuarios_db"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    rol = Column(String)
