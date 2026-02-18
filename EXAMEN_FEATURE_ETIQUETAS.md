# Examen: Implementar Etiquetas en Productos

**Duración**: 1.5 horas  
**Módulos**: DWES, DWEC

---

## **Descripción**

Los vendedores pueden etiquetar sus productos (ej: "Ecológico", "Local", "Recién cosechado") para que compradores las vean. Similar a tags.

---

## **Parte 1: Backend – 40 puntos**

### **Tarea 1: Base de Datos (6 puntos)**

Crear dos tablas en `backend/database/init.sql`:

- **Tabla `etiquetas`**: almacenar etiquetas disponibles (Ecologico, Local, Recien cosechado, etc.)
  - Campos: id, nombre (unico), color (codigo hex), descripcion, fecha creacion.

- **Tabla `producto_etiquetas`**: relacion N:M entre productos y etiquetas.
  - Campos: id, id_producto, id_etiqueta, fecha creacion.
  - Impedir duplicados: un producto solo puede tener cada etiqueta una vez.
  - Eliminar en cascada: si producto o etiqueta se elimina, eliminar relacion automaticamente.

- **Datos iniciales**: insertar 5 etiquetas por defecto (Ecologico, Local, Recien cosechado, Certificado, Oferta) con sus colores.

---

### **Tarea 2: Modelo de Datos (10 puntos)**

Crear archivo `etiquetasModel.js` con funciones para:

- Obtener listado de todas las etiquetas disponibles: retornar id, nombre, color, descripcion.
- Anadir etiqueta a un producto: insertar relacion (validar que no existe ya).
- Eliminar etiqueta de un producto: borrar relacion.
- Obtener etiquetas de un producto especifico: retornar array con id, nombre, color.

---

### **Tarea 3: Controlador en `backend/api/controllers/etiquetasController.js` (12 puntos)**

- **`getEtiquetas(req, res, next)`** (3 puntos):
  - GET `/api/etiquetas`.
  - Sin auth requerida.
  - Retornar 200 con todas las etiquetas disponibles.

- **`addEtiquetaAProducto(req, res, next)`** (4 puntos):
  - POST `/api/productos/:i(12 puntos)**

Crear `etiquetasController.js` con endpoints que:

- Retornen listado de todas las etiquetas disponibles (GET, sin autenticacion requerida).
- Anadir una etiqueta a un producto (POST): validar que usuario es dueno del producto.
- Eliminar una etiqueta de un producto (DELETE): validar propiedad del producto.
- Retornen etiquetas de un producto especifico (GET, sin autenticacion)as`.
  - No debe duplicar filas; usar GROUP_CONCAT o agrupar en aplicación.

- **Modified `getProductById(id)`** (6 puntos):
  - Retornar producto con array de etiquetas anidado.
  - Ejemplo JSON:
    ```json
    {
      "id": 1,
      "nombre": "Tomate",
      "etiquetas": [
        { "id": 1, "nombre": "Ecológico", "color": "#27ae60" },
        { "id": 3, "nombre": "Recién cosechado", "color": "#e74c3c" }
      ]
    }
    ```

---

## **Parte 2: Frontend – 60 puntos**

---

### **Tarea 1: Estado Global (10 puntos)**

Crear store Pinia `etiquetasStore.js` que:

- Almacene listado de todas las etiquetas disponibles.
- Implemente accion para cargar etiquetas desde backend.
- Implemente getter para obtener una etiqueta especifica por id.

---

### **Tarea 2: Selector en Formulario de Producto (25 puntos)**

Modificar `FormularioProducto.vue` para:

- **Anadir seccion de seleccion de etiquetas**: mostrar checkboxes con todas las etiquetas disponibles (nombre y color visual).

- **Modo crear/editar**:
  - Al crear: ninguna etiqueta seleccionada por defecto.
  - Al editar: cargar etiquetas actuales y marcar checkboxes correspondientes.
  - Guardar seleccion en estado local.

- **Al guardar producto**: despues de crear/editar el producto,
  - Anadir POST requests para cada etiqueta seleccionada.
  - Enviar DELETE requests para etiquetas previamente asignadas pero ahora deseleccionadas.
  - Mostrar estado de carga mientras se procesan cambios.

---

### **Tarea 3: Mostrar Etiquetas en Tarjeta de Producto (15 puntos)**

Modificar componente `ProductCard.vue` o donde se muestre producto:

- **Mostrar etiVisualizacion en Tarjeta de Producto (15 puntos)**

Modificar componente `ProductCard.vue` para:

- **Mostrar badges/chips de etiquetas**: mostrar etiquetas como badges visuales con color de la etiqueta.
  - Maximo 3 etiquetas visibles; si hay mas, mostrar "+N" para indicar cantidad restante.
  - Si producto no tiene etiquetas, no mostrar nada.

- **Diseno responsive**: etiquetas se adaptan bien en dispositivos moviles (tamaño de letra, espaciado reducido

En `ComprarView.vue`:

- **Añadir filtro de etiquetas** (6 puntos):
  - Checkboxes o dropdown multi-select con todas las etiquetas.
  - Al seleccionar: filtrar productos que tengan TODAS esas etiquetas (AND logic).
  - Si vacío: mostrar todos.en Busqueda (10 puntos)**

Modificar `ComprarView.vue` para:

- **Anadir seleccion de filtros por etiquetas**: checkboxes o dropdown multi-select que muestre todas las etiquetas disponibles.
  - Al seleccionar etiquetas: filtrar productos que tengan TODAS las etiquetas seleccionadas (logica AND).
  - Si no hay etiquetas seleccionadas: no filtrar por etiquetas.

- **Integracion con otros filtros**: el filtro de etiquetas debe combinarse con categoria, texto y otros existentes.
  - Backend debe aceptar parametro de etiquetas (como CSV) y filtrar correctamente en la queryina producto, sus etiquetas se desvinculan (CASCADE) (1 punto).

---

## **Evaluación**

- Etiquetas se crean/asignan/eliminan correctamente.
- Tarjeta de producto muestra etiquetas con colores.
- Formulario permite seleccionar etiquetas al crear/editar.
- Producto no puede tener duplicados de la misma etiqueta (UNIQUE constraint) (1 punto).
- Si se elimina producto o etiqueta, eliminar relacion automaticamente (CASCADE) (1 punto).

---

## **Criterios de Evaluacion**

✓ Tablas `etiquetas` y `producto_etiquetas` creadas correctamente.  
✓ Etiquetas se pueden asignar/desasignar en formulario de producto.  
✓ Tarjeta muestra badges de etiquetas con colores visuales.  
✓ Filtro de etiquetas funciona en ComprarView.  
✓ Filtro combina correctamente con otros (categoria, texto, etc).  
✓ No hay duplicados de etiqueta por producto.  
✓ API retorna etiquetas anidadas en objetos de producto.  
✓ Interfaz es intuitiva y responsive