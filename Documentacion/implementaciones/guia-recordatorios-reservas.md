# Guia: Recordatorios de reservas

## Mapa del proyecto (rapido)
- Base de datos: `backend/database/init.sql` y diagrama en `Documentacion/diagrama_terretashop_db.png`.
- Backend: `backend/api/app.js`, rutas en `backend/api/routes`, controladores en `backend/api/controllers`, modelos en `backend/api/models`, conexion en `backend/api/config/db.js`.
- Frontend: `frontend/src/main.js`, layout global `frontend/src/App.vue`, vistas en `frontend/src/views`, componentes en `frontend/src/components`, estado en `frontend/src/stores`, rutas en `frontend/src/router.js`.
- CSS por pagina: `frontend/public/css` (se inyecta desde `frontend/src/App.vue`).
- Comunicacion: `axios` con base `/api` en `frontend/src/main.js` y proxy en `frontend/vite.config.js`.

## Que implementacion vamos a hacer
Implementacion propuesta: recordatorios de reservas. Se envia aviso antes de la entrega.
Objetivo: recordar a comprador y vendedor una reserva cercana.

Impacto esperado:
- Tabla nueva `recordatorios_reservas`.
- Endpoints para crear y consultar recordatorios.
- Notificaciones programadas.

## Parte 1 — Cambios en la Base de Datos
- Archivo: `backend/database/init.sql`.
- Tipo de cambio: tabla `recordatorios_reservas` con `id_reserva`, `fecha_recordatorio`, `enviado`.
- Por que: guardar recordatorios y evitar duplicados.
- Relacion: `id_reserva` -> `reservas.id`.

Ejemplo (fragmento de SQL):
```sql
CREATE TABLE recordatorios_reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_reserva INT NOT NULL,
  fecha_recordatorio DATETIME NOT NULL,
  enviado TINYINT(1) DEFAULT 0,
  FOREIGN KEY (id_reserva) REFERENCES reservas(id) ON DELETE CASCADE
);
```

## Parte 2 — Cambios en el Backend
1) Modelo
Crear `recordatoriosReservasModel.js` con funciones para:
- Crear recordatorio.
- Listar recordatorios del usuario.
- Marcar como enviado.

2) Controlador
Crear `recordatoriosReservasController.js`.

3) Rutas
Crear `recordatoriosReservasRoutes.js` con `requireAuth`.

4) Registro de rutas
Registrar en `backend/api/app.js` con prefijo `/api/recordatorios-reservas`.

5) Endpoints minimos (en texto)
- Crear recordatorio.
- Listar recordatorios propios.

6) Auth y permisos
- Requiere `requireAuth`.

7) Archivos existentes a tocar
- `backend/api/controllers/reservaController.js` para crear recordatorio cuando se acepta reserva.
- `backend/api/models/notificacionModel.js` para enviar notificacion.

## Parte 3 — Cambios en el Frontend
1) Vista
Modificar `frontend/src/views/ReservasView.vue` para activar recordatorio.

2) Store
Crear `frontend/src/stores/recordatoriosStore.js` con:
- `items` y `loading`.
- `actions`: `load`, `crear`.

Ejemplo de uso:
```js
import { useRecordatoriosStore } from "../stores/recordatoriosStore.js";
const r = useRecordatoriosStore();
await r.load();
```

3) Notificaciones
`frontend/src/views/NotificacionesView.vue` ya muestra los recordatorios.

4) CSS
Si es necesario, ajustar estilos en `frontend/public/css/reservas.css`.

## Parte 4 — Como se conecta todo
Usuario activa recordatorio -> Front llama a `/api/recordatorios-reservas` -> Backend guarda ->
En la fecha se crea notificacion -> Front la muestra.

## Parte 5 — Checklist final
- Tabla `recordatorios_reservas` creada.
- Modelo, controlador y rutas creadas.
- Boton visible en reservas.

## Parte 6 — Como usar esta guia para cualquier otra implementacion
Definir el evento y conectar con notificaciones.
