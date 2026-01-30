# 02. Arquitectura del Sistema

## 2.1 Visión general de la arquitectura

La aplicación **TerretaShop** sigue una arquitectura web basada en separación de responsabilidades, con tres capas principales:

- **Frontend (cliente)**: interfaz y experiencia de usuario.
- **Backend (servidor / API REST)**: lógica de negocio y acceso a datos.
- **Base de datos**: persistencia e integridad de la información.

La comunicación entre frontend y backend se realiza mediante una **API REST** usando HTTP y JSON (y `multipart/form-data` para subida de imágenes).

---

## 2.2 Arquitectura cliente-servidor

- El **frontend** se ejecuta en el navegador y consume la API.
- El **backend** valida datos, aplica reglas de negocio y gestiona autenticación/autorización.
- La **base de datos** almacena usuarios, productos, reservas, puntos de entrega y el resto de entidades.

---

## 2.3 Capa de frontend

Responsabilidades principales:

- Interfaz y navegación (Vue + Router).
- Gestión de estado (Pinia), especialmente la sesión del usuario.
- Consumo de la API (`axios`) y renderizado de listados.
- Integración de mapas (Leaflet) y reverse geocoding (Nominatim) para mostrar direcciones.

Nota: actualmente el frontend redirige a **selección de coordenadas** cuando el usuario está autenticado pero no tiene `lat/lng` guardados.

---

## 2.4 Capa de backend (API REST)

El backend es una API REST (Node/Express) con estas responsabilidades:

- Autenticación mediante **JWT en cookie** (cookie `access_token` firmada) y middleware `requireAuth`.
- Gestión de usuarios (`/api/usuarios`) y sesión (`/api/login`).
- Gestión de productos (`/api/productos`) y catálogos (`/api/categorias`, `/api/unidades`).
- Gestión de coordenadas del usuario (`/api/map/me`).
- Gestión de puntos de entrega (`/api/puntos-entrega`).
- Gestión de reservas (`/api/reservas`) y cambio de estado con permisos básicos (comprador/vendedor por contexto).

Pendiente de integrar (próximo sprint):

- **Chat/mensajes**.
- **Valoraciones**.

---

## 2.5 Capa de datos

Base de datos relacional con claves primarias y foráneas para integridad referencial.

Cambios relevantes actuales:

- Los productos ya **no** usan un campo de texto para la unidad. En su lugar usan `id_unidad` con relación a la tabla `unidades`.

---

## 2.6 Integración de geolocalización

El sistema contempla:

- Almacenar coordenadas (`lat`, `lng`) en `usuarios`.
- Selección de ubicación desde el frontend (mapa).
- Uso de esa ubicación para funcionalidades futuras (proximidad, filtros, etc.).

---

## 2.7 Entornos de ejecución

- **Desarrollo**: ejecución local (Vite para frontend y Node para backend) y base de datos recreable con `init.sql`.
- **Producción (planificado)**: despliegue con configuración de HTTPS y variables de entorno.

---

## 2.8 Justificación de la arquitectura

Esta arquitectura permite:

- Separación clara de responsabilidades.
- Facilidad de mantenimiento y ampliación por sprint.
- Consistencia entre frontend/backend mediante contratos de API.

