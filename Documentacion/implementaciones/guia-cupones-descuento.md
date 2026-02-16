# Guia: Cupones de descuento

## Que implementacion vamos a hacer
Implementacion propuesta: **Cupones de descuento**.
El vendedor crea cupones y el comprador los aplica al reservar un producto.

## Parte 1 — Cambios en la Base de Datos
- Archivo: `backend/database/init.sql`.
- Tipo de cambio: crear tabla `cupones` con `codigo`, `id_vendedor`, `porcentaje`, `activo`, `fecha_expiracion`.
- Por que: necesitamos guardar cupones por vendedor.
- Relacion con tablas existentes: `id_vendedor` referencia `usuarios.id`.  
Opcional: si quieres registrar uso, crea tabla `cupones_uso` con `id_usuario`, `id_cupon`, `id_reserva`.

## Parte 2 — Cambios en el Backend
1) Dondе crear el modelo o acceso a datos  
Crear `cuponesModel.js` en `backend/api/models`.

2) Dondе crear el controlador  
Crear `cuponesController.js` en `backend/api/controllers` con acciones: crear cupon, listar cupones propios, validar cupon.

3) Dondе crear las rutas  
Crear `cuponesRoutes.js` en `backend/api/routes` con `requireAuth`.

4) Dondе registrar esas rutas  
Registrar en `backend/api/app.js` con prefijo `/api/cupones`.

5) Que archivos existentes hay que tocar para integrar todo  
En `backend/api/controllers/reservaController.js` aplicar el descuento si llega un cupon valido.

## Parte 3 — Cambios en el Frontend
- Que vista hay que modificar  
`frontend/src/views/VenderView.vue` para crear cupones.  
`frontend/src/views/ProductoView.vue` o `frontend/src/views/ComprarView.vue` para aplicar cupon en la reserva.
- Que componente tocar  
Formulario simple en la vista correspondiente.
- Donde llamar al backend  
Usa `axios` o un store `frontend/src/stores/cuponesStore.js`.
- Como integrar la nueva funcionalidad visualmente  
Mostrar el precio con descuento antes de confirmar la reserva.

## Parte 4 — Como se conecta todo
Vendedor crea cupon -> Backend lo guarda -> Comprador aplica cupon al reservar ->  
Backend valida y calcula descuento -> Reserva se guarda -> Frontend muestra precio final.

## Parte 5 — Como usar esta guia para cualquier otra implementacion
Define bien el dato en BD, crea endpoints claros y actualiza las vistas donde se usa el dato.
