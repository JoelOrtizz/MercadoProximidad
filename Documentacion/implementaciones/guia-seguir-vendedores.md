# Guia: Seguir vendedores

## Mapa del proyecto (rapido)
- Base de datos: `backend/database/init.sql` y diagrama en `Documentacion/diagrama_terretashop_db.png`.
- Backend: `backend/api/app.js`, rutas en `backend/api/routes`, controladores en `backend/api/controllers`, modelos en `backend/api/models`, conexion en `backend/api/config/db.js`.
- Frontend: `frontend/src/main.js`, layout global `frontend/src/App.vue`, vistas en `frontend/src/views`, componentes en `frontend/src/components`, estado en `frontend/src/stores`, rutas en `frontend/src/router.js`.
- CSS por pagina: `frontend/public/css` (se inyecta desde `frontend/src/App.vue`).
- Comunicacion: `axios` con base `/api` en `frontend/src/main.js` y proxy en `frontend/vite.config.js`.

## Que implementacion vamos a hacer
Implementacion propuesta: seguir vendedores. Un usuario sigue a vendedores y ve sus productos recientes.
Objetivo: crear una relacion usuario -> vendedor y un listado de seguidos.

Impacto esperado:
- Tabla nueva `seguimientos`.
- Endpoints para seguir, dejar de seguir y listar seguidos.
- Boton de seguir en perfil publico.

## Parte 1 - Cambios en la Base de Datos
- Archivo: `backend/database/init.sql`.
- Tipo de cambio: tabla `seguimientos` con `id_seguidor`, `id_vendedor`, `fecha_creacion` y `UNIQUE`.
- Por que: no permitir duplicados y guardar relaciones.
- Relacion: ambos campos referencian `usuarios.id`.

Ejemplo (fragmento de SQL):
```sql
CREATE TABLE seguimientos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_seguidor INT NOT NULL,
  id_vendedor INT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_seguimiento (id_seguidor, id_vendedor),
  FOREIGN KEY (id_seguidor) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (id_vendedor) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

## Parte 2 - Cambios en el Backend
1) Modelo
Crear `seguimientosModel.js` en `backend/api/models` con funciones para:
- Crear seguimiento.
- Eliminar seguimiento.
- Listar seguidos por usuario.

2) Controlador
Crear `seguimientosController.js` en `backend/api/controllers`.
Validar que el usuario no se siga a si mismo.

3) Rutas
Crear `seguimientosRoutes.js` en `backend/api/routes` con `requireAuth`.

4) Registro de rutas
Registrar en `backend/api/app.js` con prefijo `/api/seguimientos`.

5) Endpoints minimos (en texto)
- Seguir vendedor.
- Dejar de seguir.
- Listar seguidos.

6) Auth y permisos
- Requiere `requireAuth`.
- Solo el usuario autenticado puede gestionar sus seguidos.

7) Archivos existentes a tocar
- `frontend/src/views/PerfilUsuarioView.vue` para el boton Seguir.
- Opcional: endpoint para productos de seguidos.

## Parte 3 - Cambios en el Frontend
1) Boton en perfil publico
Modificar `frontend/src/views/PerfilUsuarioView.vue` para mostrar Seguir/Dejar de seguir.

2) Vista opcional de seguidos
Crear `frontend/src/views/SeguidosView.vue` si quieres un listado dedicado.

3) Router y CSS
Si hay vista nueva, registrar en `frontend/src/router.js` con `meta.css` y crear CSS en `frontend/public/css`.

4) Store
Crear `frontend/src/stores/seguimientosStore.js` con:
- `items` (lista de seguidos).
- `actions` para `follow`, `unfollow`, `load`.
- `getters` para saber si ya sigue a un vendedor.

Ejemplo de uso:
```js
import { useSeguimientosStore } from "../stores/seguimientosStore.js";
const s = useSeguimientosStore();
await s.load();
const siguiendo = s.isSiguiendo(vendedorId);
```

## Parte 4 - Como se conecta todo
Usuario sigue -> Front llama a `/api/seguimientos` -> Backend guarda -> Front actualiza estado.

## Parte 5 - Checklist final
- Tabla `seguimientos` creada.
- Modelo, controlador y rutas creadas.
- Boton visible en perfil publico.
- Store conecta estado.

## Parte 6 - Como usar esta guia para cualquier otra implementacion
Repetir flujo de datos y conexiones entre vistas y store.

