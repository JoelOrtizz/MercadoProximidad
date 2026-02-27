# 05. Frontend

## 5.1 Stack
- Vue 3 (Composition API)
- Vue Router
- Pinia
- Axios
- Bootstrap + Bootstrap Icons
- Leaflet (mapas)

## 5.2 Estructura
- Codigo principal: `frontend/src/`
- Vistas: `frontend/src/views/`
- Componentes: `frontend/src/components/`
- Stores: `frontend/src/stores/`
- Estilos por ruta: `frontend/public/css/`

## 5.3 Comunicacion con backend
Configuracion en `frontend/src/main.js`:
- `axios.defaults.baseURL = '/api'`
- `axios.defaults.withCredentials = true`

En desarrollo, `vite.config.js` proxya:
- `/api` -> backend local
- `/uploads` -> backend local

## 5.4 Rutas actuales
Definidas en `frontend/src/router.js`:
- `/` (Landing)
- `/comprar`
- `/vender`
- `/perfil`
- `/login`
- `/registro`
- `/coords`
- `/puntos-entrega`
- `/reservas`
- `/mensajes` y `/mensajes/:id`
- `/valoraciones`
- `/notificaciones`
- `/usuario/:id`
- `/producto/:id`
- `/legal`
- `/contacto`

## 5.5 Estado global
Stores relevantes:
- `auth.js`: sesion, login/logout, recuperacion de usuario.
- `toastStore.js`: mensajes de feedback.
- `modal.js`: confirmaciones.
- `notificacionesStore.js`: listado y conteo de no leidas.

## 5.6 Flujo funcional principal
- Comprar: filtros, lista/mapa, reserva con cantidad + punto de entrega.
- Vender: publicacion de producto con imagen, unidad, precio, stock.
- Perfil: gestion de datos personales, productos, puntos y resumen de actividad.
- Reservas: tabs por estado, acciones por rol y acceso a chat/ruta.
- Mensajes: lista de chats + conversacion con polling controlado.
- Valoraciones: pendientes, hechas y sobre mi.
- Notificaciones: listado, marcar leidas, acciones masivas.

## 5.7 Reglas de UX activas
- Si no hay sesion, las vistas privadas muestran estado comun (`GuestState`).
- Si hay sesion pero faltan coordenadas, redireccion a `/coords`.
- Carga de CSS por ruta desde `App.vue` usando `meta.css`.

## 5.8 Produccion frontend
- Build con Vite.
- Servido por Nginx en contenedor (`frontend/Dockerfile` + `frontend/nginx.conf`).
- Router en modo history soportado con `try_files ... /index.html`.

