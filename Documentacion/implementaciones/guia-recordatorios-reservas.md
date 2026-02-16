# Guia: Recordatorios de reservas

## Que implementacion vamos a hacer
Implementacion propuesta: **Recordatorios de reservas**.
El sistema envia un recordatorio al comprador y vendedor antes de la entrega.

## Parte 1 — Cambios en la Base de Datos
- Archivo: `backend/database/init.sql`.
- Tipo de cambio: crear tabla `recordatorios_reservas` con `id_reserva`, `fecha_recordatorio`, `enviado`.
- Por que: necesitamos programar recordatorios y evitar duplicados.
- Relacion con tablas existentes: `id_reserva` referencia `reservas.id`.

## Parte 2 — Cambios en el Backend
1) Dondе crear el modelo o acceso a datos  
Crear `recordatoriosReservasModel.js` en `backend/api/models`.

2) Dondе crear el controlador  
Crear `recordatoriosReservasController.js` en `backend/api/controllers` para crear y consultar recordatorios.

3) Dondе crear las rutas  
Crear `recordatoriosReservasRoutes.js` en `backend/api/routes` con `requireAuth`.

4) Dondе registrar esas rutas  
Registrar en `backend/api/app.js` con prefijo `/api/recordatorios-reservas`.

5) Que archivos existentes hay que tocar para integrar todo  
En `backend/api/controllers/reservaController.js` puedes crear un recordatorio al aceptar una reserva.  
Para el envio, reutiliza `backend/api/models/notificacionModel.js`.

## Parte 3 — Cambios en el Frontend
- Que vista hay que modificar  
`frontend/src/views/ReservasView.vue` para activar o ver recordatorios.  
`frontend/src/views/NotificacionesView.vue` mostrara los recordatorios.
- Que componente tocar  
Boton o switch simple en la reserva.
- Donde llamar al backend  
Usa `axios` o un store `frontend/src/stores/recordatoriosStore.js`.
- Como integrar la nueva funcionalidad visualmente  
Mostrar un estado "Recordatorio activado" en cada reserva.

## Parte 4 — Como se conecta todo
Usuario activa recordatorio -> Frontend llama a `/api/recordatorios-reservas` ->  
Backend guarda en BD -> Al llegar la fecha se crea una notificacion ->  
Frontend muestra la notificacion.

## Parte 5 — Como usar esta guia para cualquier otra implementacion
Define la tabla, expone la API y conecta la vista donde el usuario activa la funcionalidad.
