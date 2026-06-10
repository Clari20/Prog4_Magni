
Este proyecto es una aplicación Full-Stack que incluye una API en Python (FastAPI) y un Frontend en React (Vite). Cuenta con un sistema de autenticación por JWT, roles de usuario, y funcionalidades avanzadas de React (Custom Hooks, useRef, useId, etc.).

## 🚀 Requisitos Previos
- [Node.js](https://nodejs.org/) (versión 16+ recomendada)
- [Python](https://www.python.org/) (versión 3.9+ recomendada)

---

## ⚙️ 1. Levantar el Backend (API FastAPI)

La base de datos SQLite se crea y administra automáticamente en el archivo `sql_app.db`.

1. Abrí una terminal y navegá a la carpeta del backend:
   ```bash
   cd TP5/backend
   ```
2. Instalá las dependencias requeridas:
   ```bash
   pip install -r requirements.txt
   ```
3. Levantá el servidor de desarrollo:
   ```bash
   uvicorn main:app --reload
   ```
   > La API estará corriendo en `http://localhost:8000`. Podés acceder a la documentación interactiva (Swagger) entrando a `http://localhost:8000/docs`.

---

## 🎨 2. Levantar el Frontend (React + Vite)

Asegurate de dejar la terminal del backend corriendo y abrí una terminal **nueva**.

1. Navegá a la carpeta del frontend:
   ```bash
   cd TP5/frontend
   ```
2. Instalá las dependencias de NPM:
   ```bash
   npm install
   ```
3. Ejecutá el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   > La aplicación web estará disponible en `http://localhost:5173`. Hacé Ctrl+Clic en el link de la consola para abrirla en el navegador.

---

## 🔐 3. Credenciales de Acceso

El sistema maneja dos roles con diferentes permisos. Si al entrar te pide login y la base de datos está vacía, debés inicializar los usuarios.

**Para crear los usuarios iniciales:**  
Con el backend corriendo, abrí tu navegador e ingresá a esta URL para disparar la creación de datos de prueba:  
👉 `http://localhost:8000/seed` (o ejecutá `curl -X POST http://localhost:8000/seed` en tu terminal).

### Usuarios disponibles:

| Rol | Usuario | Contraseña | Permisos |
|-----|---------|------------|----------|
| **Administrador** | `admin` | `admin123` | Puede ver, crear, editar y eliminar participantes. |
| **Consulta** | `consulta` | `consulta123` | Solo puede ver y filtrar la lista de participantes. |

---

## 🛠️ Características Principales (TP8)

- **Accesibilidad:** Implementación de `useId` para garantizar IDs únicos y accesibles en los componentes del formulario.
- **Manejo del DOM:** Uso de `useRef` para enfocar automáticamente el campo "Nombre" al registrar un participante.
- **Custom Hooks:** 
  - `useKeyboardShortcut`: Permite enfocar la barra de búsqueda rápidamente presionando `Ctrl + B`.
  - `useDebounce`: Retrasa la evaluación de los filtros de búsqueda (300ms) para mejorar drásticamente el rendimiento y la experiencia de usuario.

---

## 🛒 4. Integración con MercadoPago (Compras por Usuario)

Se implementó un flujo completo para procesar pagos con MercadoPago, asociando estrictamente cada compra al usuario correspondiente:

- **Protección de rutas:** El endpoint de creación de preferencias (`/api/pagos/create-preference`) exige un token JWT válido.
- **Trazabilidad de Usuarios:** Se inyecta el ID del usuario en MercadoPago utilizando el campo `external_reference`.
- **Webhook Inteligente:** Al aprobarse el pago, MercadoPago notifica al webhook (`/api/pagos/webhook`), el backend extrae el `external_reference` y asienta la compra en la base de datos con su respectivo `usuario_id`.
- **Proxy Ngrok para Auto-Return:** Como MercadoPago prohíbe usar `localhost` para la redirección automática (`auto_return`), se armó una arquitectura proxy. El backend expone endpoints intermediarios (ej. `/api/pagos/success`) accesibles vía Ngrok (HTTPS), los cuales devuelven un **302 Redirect** transparente hacia el frontend local.
- **Renderizado Dinámico:** El Home consume la ruta autenticada `/api/compras/me` para renderizar únicamente los cursos que pertenecen al usuario logueado.
