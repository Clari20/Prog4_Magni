from sqlalchemy import Column, String, Integer, Boolean, Float, DateTime
from datetime import datetime
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

class Compra(Base):
    __tablename__ = "compras"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    payment_id = Column(String, unique=True, index=True)
    curso_titulo = Column(String)
    curso_precio = Column(Float)
    status = Column(String)
    fecha = Column(DateTime, default=datetime.utcnow)
    usuario_id = Column(Integer)
