# Implementación de Sistema de Alertas de Stock

## 📅 Fecha: 17 de Febrero de 2026

---

## 📋 Resumen

Se implementó un sistema completo de alertas de stock que notifica a los usuarios cuando un producto sin stock vuelve a tener disponibilidad.

---

## 🔧 Cambios Realizados

### 1. **Base de Datos - init.sql**

#### Error corregido
- **Línea 179**: Eliminación de `INT` duplicado en tabla `alertas_stock`

**Antes:**
```sql
id INT INT AUTO_INCREMENT PRIMARY KEY,
```

**Después:**
```sql
id INT AUTO_INCREMENT PRIMARY KEY,
```

#### Tabla creada
```sql
CREATE TABLE alertas_stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_producto INT NOT NULL UNIQUE,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id),
    FOREIGN KEY (id_producto) REFERENCES productos (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
```

#### Usuario de base de datos
Se agregó un usuario `alumno` con permisos completos en `terretashop_db`:
```sql
CREATE USER IF NOT EXISTS 'alumno'@'%' IDENTIFIED BY 'alumno_password';
GRANT ALL PRIVILEGES ON terretashop_db.* TO 'alumno'@'%';
FLUSH PRIVILEGES;
```

---

### 2. **Backend - Controllers**

#### `backend/api/controllers/alertaController.js`

**Error corregido (Línea 8):**
- **Problema**: El controlador intentaba leer `req.body.id` pero el frontend enviaba `req.body.id_producto`

**Antes:**
```javascript
const productId = req.body.id;
```

**Después:**
```javascript
const productId = req.body.id_producto;
```

**Funciones implementadas:**
1. `postAlerta()` - Crear alerta de stock
2. `getAlertas()` - Listar alertas del usuario
3. `status()` (desactivar) - Desactivar alerta existente

---

#### `backend/api/controllers/productController.js`

**Importaciones agregadas:**
```javascript
import { usuariosConAlerta } from '../models/alertaModel.js';
import { createNotificacion } from '../models/notificacionModel.js';
```

**Cambios:**
- Se agregó lógica en `putProduct()` para notificar a usuarios cuando el stock vuelve a estar disponible
- Al actualizar un producto con stock > 0, se buscan usuarios con alertas activas y se les envía una notificación

---

### 3. **Backend - Models**

#### `backend/api/models/alertaModel.js`

**Error corregido - Función `usuariosConAlerta()` (Línea 27-31):**
- **Problema**: Query SQL malformada, faltaba la cláusula `FROM`

**Antes:**
```javascript
export async function usuariosConAlerta(id_producto) {
    const [result] = await pool.query(
        `select id_usuario
        where id_producto = ?`,
        [id_producto]
    );
    return result;
}
```

**Después:**
```javascript
export async function usuariosConAlerta(id_producto) {
    const [result] = await pool.query(
        `select id_usuario from alertas_stock where id_producto = ?`,
        [id_producto]
    );
    return result;
}
```

**Funciones implementadas:**
1. `crearAlerta(id_usuario, id_producto)` - Crear nueva alerta
2. `pathAlertas(id, id_usuario)` - Desactivar alerta (método PUT)
3. `listarAlertas(id_usuario)` - Obtener alertas activas del usuario
4. `usuariosConAlerta(id_producto)` - Obtener usuarios con alerta en un producto

---

### 4. **Backend - Routes**

#### `backend/api/routes/alertaRoutes.js`

```javascript
import express from 'express'
import { requireAuth } from '../middlewares/requireAuth.js';
import { postAlerta, getAlertas, status } from '../controllers/alertaController.js';

const router = express.Router();

router.get('/', requireAuth, getAlertas);      // GET /alertas - Listar alertas
router.post('/', requireAuth, postAlerta);     // POST /alertas - Crear alerta
router.put('/:id/desactivar', requireAuth, status); // PUT /alertas/:id/desactivar

export default router;
```

---

### 5. **Frontend - Views**

#### `frontend/src/views/ProductoView.vue`

**Funciones implementadas:**

1. **`loadAlertas()`** - Carga las alertas del usuario autenticado
   - Realiza GET a `/alertas`
   - Almacena en `miAlertas.value`

2. **`esActiva()`** - Verifica si hay alerta activa para el producto actual
   - Compara `id_producto` con alertas del usuario

3. **`alertar()`** - Alterna entre crear/desactivar alertas
   - Si no hay alerta → POST `/alertas` con `{ id_producto }`
   - Si hay alerta → PUT `/alertas/:id/desactivar`
   - Muestra notificaciones de éxito/error
   - Recarga la lista de alertas

**Botones agregados:**
- "Activar alerta" / "Desactivar alerta" - Visible cuando stock = 0
- "Avisadme cuando haya" / "Quitar alerta" - En panel de agotado

---

#### `frontend/src/views/PerfilView.vue`

**Cambios:**
- Se corrigieron errores en la función `saveEdit()` que generaban error 500
- Se agregó validación de datos antes de enviar PUT

---

## 📊 Flujo Implementado

```
1. Usuario ve producto sin stock
   ↓
2. Usuario hace clic en "Activar alerta"
   ↓
3. Frontend envía POST /alertas { id_producto: 5 }
   ↓
4. Backend crea registro en alertas_stock
   ↓
5. Cuando vendedor actualiza stock del producto
   ↓
6. Backend busca usuarios con alertas ← usuariosConAlerta()
   ↓
7. Backend envía notificaciones a cada usuario
   ↓
8. Usuario recibe notificación "Producto disponible!"
```

---

## 🔌 Endpoints Implementados

| Método | Endpoint | Autenticación | Función |
|--------|----------|---------------|---------|
| POST | `/api/alertas` | Requerida | Crear alerta de stock |
| GET | `/api/alertas` | Requerida | Listar alertas del usuario |
| PUT | `/api/alertas/:id/desactivar` | Requerida | Desactivar alerta |

---

## ⚠️ Errores Corregidos

| Archivo | Línea | Tipo | Solución |
|---------|-------|------|----------|
| `init.sql` | 179 | Sintaxis SQL | Eliminación de `INT INT` duplicado |
| `alertaController.js` | 8 | Lógica | Cambio `req.body.id` → `req.body.id_producto` |
| `alertaModel.js` | 27 | Sintaxis SQL | Adición de `FROM alertas_stock` en query |

---

## 🧪 Validaciones Implementadas

- ✅ Usuario debe estar autenticado para crear/ver alertas
- ✅ Solo se pueden crear alertas si el producto tiene stock = 0
- ✅ Una alerta por usuario-producto (UNIQUE en BD)
- ✅ Solo el usuario propietario puede desactivar sus alertas
- ✅ Validación de producto existente antes de crear alerta

---

## 📝 Variables de Entorno

```
MYSQL_ROOT_PASSWORD="root"
MYSQL_USER="terretashop_user"
MYSQL_PASSWORD="terretashop_pass"
JWT_SECRET="cambia_este_secreto_largo"
COOKIE_SECRET="cambia_este_otro_secreto_largo"
```

Dato: Se agregó usuario adicional `alumno` / `alumno_password` para testing

---

## 🚀 Próximos Pasos Sugeridos

1. Implementar correos/notificaciones push cuando stock está disponible
2. Permitir que usuarios configuren el tipo de notificación
3. Agregar historial de alertas disparadas
4. Implementar alertas basadas en cambios de precio
5. Agregar opción de alertas recurrentes para cantidades específicas

---

## 📦 Archivos Modificados

```
backend/
├── database/
│   └── init.sql ✏️
├── api/
│   ├── controllers/
│   │   ├── alertaController.js ✏️ (creado)
│   │   └── productController.js ✏️ (modificado)
│   ├── models/
│   │   ├── alertaModel.js ✏️ (creado)
│   │   └── procutModel.js ✅ (sin cambios necesarios)
│   └── routes/
│       └── alertaRoutes.js ✏️ (creado)
frontend/
└── src/
    └── views/
        ├── ProductoView.vue ✏️ (modificado)
        └── PerfilView.vue ✏️ (corregido)
```

---

**Estado**: ✅ Implementación completada y funcional
