# Sistema de cursos
# TP7 - Sistema de Gestión de Participantes

Este proyecto es una aplicación web full-stack para la gestión de participantes, desarrollada como parte del Cuarto Semestre de la carrera.

## 🚀 Arquitectura
- **Backend**: FastAPI (Python) con SQLAlchemy y SQLite.
- **Frontend**: React + Vite con TypeScript y React Router.
- **Autenticación**: JWT (JSON Web Tokens) con roles diferenciados.

---

## 🛠️ Instalación y Ejecución

### 1. Backend (Servidor API)
Desde la carpeta raíz del proyecto (`TP5`):

```powershell
cd TP5
cd backend
# Crear entorno virtual (solo la primera vez)
python -m venv venv
# Activar entorno virtual
.\venv\Scripts\activate
# Instalar dependencias
pip install -r requirements.txt
# Iniciar servidor
uvicorn main:app --reload
```
La API estará disponible en `http://127.0.0.1:8000`.

### 2. Frontend (Interfaz Web)
Desde la carpeta raíz del proyecto (`TP5`) en otra terminal:

```powershell
cd TP5
cd frontend
# Instalar dependencias
npm install
# Iniciar servidor de desarrollo
npm run dev
```
La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique la consola).

---

## 🔐 Usuarios y Accesos

El sistema cuenta con usuarios ya precargados en la base de datos (`sql_app.db`):

| Usuario | Contraseña | Rol | Permisos |
| :--- | :--- | :--- | :--- |
| **admin** | `admin123` | **ADMIN** | Lectura, Creación, Edición y Eliminación. |
| **consulta** | `consulta123` | **CONSULTA** | Solo Lectura. |

---

## 📚 Documentación de la API
Una vez que el backend esté corriendo, podés acceder a la documentación interactiva (Swagger) en:
- [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---
*Desarrollado para Programación 4 - UTN.*
