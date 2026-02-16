# Guia: Reportar productos

## Mapa del proyecto (rapido)
- Base de datos: `backend/database/init.sql` y diagrama en `Documentacion/diagrama_terretashop_db.png`.
- Backend: `backend/api/app.js`, rutas en `backend/api/routes`, controladores en `backend/api/controllers`, modelos en `backend/api/models`, conexion en `backend/api/config/db.js`.
- Frontend: `frontend/src/main.js`, layout global `frontend/src/App.vue`, vistas en `frontend/src/views`, componentes en `frontend/src/components`, estado en `frontend/src/stores`, rutas en `frontend/src/router.js`.
- CSS por pagina: `frontend/public/css` (se inyecta desde `frontend/src/App.vue`).
- Comunicacion: `axios` con base `/api` en `frontend/src/main.js` y proxy en `frontend/vite.config.js`.

## Que implementacion vamos a hacer
Implementacion propuesta: reportar productos. Un usuario reporta un producto y un admin lo revisa.
Objetivo: permitir reportes y gestionarlos por rol.

Impacto esperado:
- Tabla nueva `reportes_productos`.
- Endpoints para crear y revisar reportes.
- Vista de reportes para admin.

## Parte 1 — Cambios en la Base de Datos
- Archivo: `backend/database/init.sql`.
- Tipo de cambio: tabla `reportes_productos` con `id_producto`, `id_usuario`, `motivo`, `descripcion`, `estado`, `fecha_creacion`.
- Por que: registrar reportes para revision.
- Relacion: `id_producto` -> `productos.id`, `id_usuario` -> `usuarios.id`.

Ejemplo (fragmento de SQL):
```sql
CREATE TABLE reportes_productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_producto INT NOT NULL,
  id_usuario INT NOT NULL,
  motivo VARCHAR(100) NOT NULL,
  descripcion TEXT NULL,
  estado ENUM('pendiente','revisado','rechazado') DEFAULT 'pendiente',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

## Parte 2 — Cambios en el Backend
1) Modelo
Crear `reportesProductosModel.js` con funciones para:
- Crear reporte.
- Listar reportes.
- Cambiar estado.

2) Controlador
Crear `reportesProductosController.js`.
Validar rol admin para listar y cambiar estado.

3) Rutas
Crear `reportesProductosRoutes.js` con `requireAuth`.

4) Registro de rutas
Registrar en `backend/api/app.js` con prefijo `/api/reportes-productos`.

5) Endpoints minimos (en texto)
- Crear reporte.
- Listar reportes (admin).
- Cambiar estado (admin).

6) Auth y permisos
- Requiere `requireAuth`.
- Validar `tipo` de usuario para admin.

7) Archivos existentes a tocar
- Si hay logica de rol, reutilizarla desde `userModel` o `authController`.

## Parte 3 — Cambios en el Frontend
1) Boton en producto
Modificar `frontend/src/views/ProductoView.vue` para abrir formulario de reporte.

2) Vista admin
Crear `frontend/src/views/ReportesView.vue`.
Registrar en `frontend/src/router.js` con `meta.css`.

3) Store
Crear `frontend/src/stores/reportesProductosStore.js` con:
- `items` (lista de reportes).
- `actions`: `crear`, `load`, `actualizarEstado`.

Ejemplo de uso:
```js
import { useReportesProductosStore } from "../stores/reportesProductosStore.js";
const r = useReportesProductosStore();
await r.load();
```

4) CSS
Crear `frontend/public/css/reportes.css` si hay vista nueva.

## Parte 4 — Como se conecta todo
Usuario reporta -> Front llama a `/api/reportes-productos` -> Backend guarda ->
Admin revisa en su vista -> Backend actualiza estado -> Front refleja cambios.

## Parte 5 — Checklist final
- Tabla `reportes_productos` creada.
- Modelo, controlador y rutas creadas.
- Vista admin disponible y protegida.

## Parte 6 — Como usar esta guia para cualquier otra implementacion
Definir roles y replicar el patron de rutas y vistas.
