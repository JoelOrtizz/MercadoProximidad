# 05. Frontend

## 5.1 Tecnologías

- Vue 3 (Composition API)
- Vue Router
- Pinia (store)
- Axios (cliente HTTP)
- Leaflet (mapas) + Nominatim (reverse geocoding)

## 5.2 Configuración de comunicación con backend

- `frontend/src/main.js` configura:
  - `axios.defaults.baseURL = '/api'`
  - `axios.defaults.withCredentials = true` (cookies)
- `frontend/vite.config.js` incluye proxy de `/api` y `/uploads` a `http://localhost:3000` en desarrollo.

## 5.3 Estado de autenticación

- Store principal: `frontend/src/stores/auth.js`
  - `login`, `logout`, `fetchMe`, `register`
- Al iniciar la app se recupera sesión con `fetchMe()`.
- Si el usuario está autenticado pero **no tiene coordenadas** (`lat/lng`), se redirige automáticamente a `/coords` para configurarlas.

## 5.4 Vistas principales (estado actual)

- `LoginView`: login y redirección a `/coords` si no hay coordenadas.
- `RegistroView`: (pendiente de completar en UI; el store soporta registro).
- `PerfilView`:
  - Muestra datos del usuario, permite editar `nombre/email`.
  - Muestra “Mis productos”, permite editar/eliminar productos.
  - Muestra dirección de ubicación mediante reverse geocoding.
- `CoordsView`:
  - Selección de coordenadas en mapa (Leaflet) y guardado en backend.
- `VenderView`:
  - Publicación de producto con imagen.
  - La unidad se selecciona desde `/api/unidades` (envía `id_unidad`).
- `PuntosEntregaView`:
  - Gestión de puntos de entrega en mapa y guardado en bulk.
- `ReservasView`:
  - Listado por pestañas: pendientes/aceptadas/finalizadas.
  - Chat deshabilitado (próximo sprint).

## 5.5 Funcionalidades pendientes

- **Chat/mensajes**: no integrado aún (próximo sprint).
- **Valoraciones**: no integrado aún (próximo sprint).
