# 02. Arquitectura del Sistema

## 2.1 Vision general
TerretaShop sigue una arquitectura en 3 capas:
- Frontend SPA (Vue 3).
- Backend API REST (Node.js + Express).
- Base de datos relacional (MySQL 8).

En produccion, el acceso externo entra por Traefik (HTTPS) y se enruta a frontend o backend.

## 2.2 Frontend
Ubicacion: `frontend/`

Responsabilidades:
- Render de vistas y navegacion (`vue-router`).
- Estado global (`pinia`).
- Consumo de API (`axios`, base `'/api'`, cookies activadas).
- Interaccion de mapas con Leaflet (coords y puntos de entrega).

Patrones activos:
- Carga de CSS por ruta usando `route.meta.css` desde `App.vue`.
- Estado "no logueado" reutilizable con `GuestState`.
- Redireccion a `/coords` si hay sesion sin lat/lng.

## 2.3 Backend
Ubicacion: `backend/api/`

Responsabilidades:
- Exponer endpoints REST bajo `/api`.
- Validar entradas y permisos.
- Aplicar reglas de negocio de reservas, puntos de entrega, chat, valoraciones y notificaciones.
- Gestionar autenticacion por cookie JWT firmada.
- Servir imagenes desde `/uploads`.

Estructura:
- `routes/`: definicion de endpoints.
- `controllers/`: flujo HTTP y respuestas.
- `models/`: consultas SQL y logica de datos.
- `middlewares/`: auth, upload, etc.

## 2.4 Base de datos
Ubicacion: `backend/database/init.sql`

Caracteristicas:
- Esquema relacional con claves foraneas.
- Datos semilla para usuarios, productos, reservas y otros casos de uso.
- Soporte de estados de reserva y relaciones entre modulos (chat/notificacion/valoracion).

## 2.5 Comunicacion entre capas
Flujo principal:
1. Usuario interactua en frontend.
2. Frontend llama API REST.
3. Backend valida, ejecuta SQL y responde JSON.
4. Frontend actualiza estado y UI.

Subidas de imagen:
- Frontend envia `multipart/form-data`.
- Backend guarda archivo en `backend/uploads`.
- Frontend muestra imagen via `/uploads/<filename>`.

## 2.6 Despliegue logico
En produccion:
- Traefik termina TLS y enruta por host/path.
- Frontend se sirve con Nginx (contenedor propio).
- Backend y MySQL corren en red interna de Docker.
- Backend expone API y uploads a traves de Traefik.

## 2.7 Razones de esta arquitectura
- Separacion clara de responsabilidades.
- Mantenibilidad para trabajo en equipo.
- Escalabilidad por servicio.
- Facil reproduccion de entorno con Docker Compose.

