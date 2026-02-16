# Guia: Cupones de descuento

## Mapa del proyecto (rapido)
- Base de datos: `backend/database/init.sql` y diagrama en `Documentacion/diagrama_terretashop_db.png`.
- Backend: `backend/api/app.js`, rutas en `backend/api/routes`, controladores en `backend/api/controllers`, modelos en `backend/api/models`, conexion en `backend/api/config/db.js`.
- Frontend: `frontend/src/main.js`, layout global `frontend/src/App.vue`, vistas en `frontend/src/views`, componentes en `frontend/src/components`, estado en `frontend/src/stores`, rutas en `frontend/src/router.js`.
- CSS por pagina: `frontend/public/css` (se inyecta desde `frontend/src/App.vue`).
- Comunicacion: `axios` con base `/api` en `frontend/src/main.js` y proxy en `frontend/vite.config.js`.

## Que implementacion vamos a hacer
Implementacion propuesta: cupones de descuento. El vendedor crea cupones y el comprador los aplica en la reserva.
Objetivo: permitir descuentos controlados por el vendedor.

Impacto esperado:
- Tabla nueva `cupones`.
- Endpoints para crear y validar cupon.
- Ajuste del precio en reserva.

## Parte 1 - Cambios en la Base de Datos
- Archivo: `backend/database/init.sql`.
- Tipo de cambio: tabla `cupones` con `codigo`, `id_vendedor`, `porcentaje`, `activo`, `fecha_expiracion`.
- Por que: guardar cupones por vendedor.
- Relacion: `id_vendedor` -> `usuarios.id`.
- Opcional: tabla `cupones_uso` para registrar uso.

Ejemplo (fragmento de SQL):
```sql
CREATE TABLE cupones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  id_vendedor INT NOT NULL,
  porcentaje TINYINT NOT NULL,
  activo TINYINT(1) DEFAULT 1,
  fecha_expiracion DATE NULL,
  FOREIGN KEY (id_vendedor) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

## Parte 2 - Cambios en el Backend
1) Modelo
Crear `cuponesModel.js` con funciones para:
- Crear cupon.
- Listar cupones del vendedor.
- Validar cupon.

2) Controlador
Crear `cuponesController.js`.
Validar que el vendedor solo gestione sus propios cupones.

3) Rutas
Crear `cuponesRoutes.js` con `requireAuth`.

4) Registro de rutas
Registrar en `backend/api/app.js` con prefijo `/api/cupones`.

5) Endpoints minimos (en texto)
- Crear cupon.
- Listar cupones del vendedor.
- Validar cupon.

6) Auth y permisos
- Requiere `requireAuth`.
- Validar rol comprador para aplicar cupon (si se decide).

7) Archivos existentes a tocar
- `backend/api/controllers/reservaController.js` para aplicar descuento en la reserva.

## Parte 3 - Cambios en el Frontend
1) Vista vendedor
Modificar `frontend/src/views/VenderView.vue` para crear cupones.

2) Vista compra
En `frontend/src/views/ProductoView.vue` o `frontend/src/views/ComprarView.vue` permitir aplicar cupon.

3) Store
Crear `frontend/src/stores/cuponesStore.js` con:
- `items` (cupones del vendedor).
- `actions`: `crear`, `load`, `validar`.

Ejemplo de uso:
```js
import { useCuponesStore } from "../stores/cuponesStore.js";
const c = useCuponesStore();
await c.load();
```

4) Router y CSS
Si hay una vista nueva, registrar en `frontend/src/router.js` y crear CSS en `frontend/public/css`.

## Parte 4 - Como se conecta todo
Vendedor crea cupon -> Backend guarda -> Comprador aplica cupon -> Backend valida ->
Reserva se guarda con descuento -> Front muestra precio final.

## Parte 5 - Checklist final
- Tabla `cupones` creada.
- Modelo, controlador y rutas creadas.
- Descuento aplicado en reservas.

## Parte 6 - Como usar esta guia para cualquier otra implementacion
Definir bien el flujo de validacion y replicar el patron.

