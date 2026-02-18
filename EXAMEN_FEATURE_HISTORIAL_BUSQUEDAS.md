# Examen: Implementar Historial de Búsquedas

**Duración**: 1.5 horas  
**Módulos**: DWES, DWEC

---

## **Descripción**

El usuario autenticado debe tener un historial de búsquedas (filtros aplicados) que puede reutilizar rápidamente. Cuando el usuario aplica filtros, estas búsquedas se guardan y puede verlas en un dropdown para repetirlas sin escribir de nuevo.

---

## **Parte 1: Backend – 40 puntos**

### **Tarea 1: Base de Datos (6 puntos)**

Crear una tabla `historial_busquedas` que almacene:

- Id de historial, id de usuario, texto de búsqueda (opcional), id de categoría (opcional), fecha de creación.
- Relación: usuario debe existir. Categoría es opcional (si existe, guardar su id).
- Si se elimina usuario, eliminar su historial automáticamente.
- Si se elimina categoría, poner a NULL en registros que la referenciaban.
- Incluir índice para búsquedas rápidas por usuario y fecha.

---

### **Tarea 2: Modelo de Datos (10 puntos)**

Crear archivo `historialBusquedasModel.js` con funciones para:

- Guardar una búsqueda: insertar texto y categoría (ambos opcionales pero al menos uno debe existir).
- Obtener historial de un usuario: retornar últimas búsquedas (máximo 20), con nombre de categoría si existe.
- Eliminar una búsqueda del historial: solo el usuario propietario puede eliminarla.
- Verificar si una búsqueda exacta ya existe: si existe, actualizar fecha en lugar de duplicar.

---

### **Tarea 3: Controlador (12 puntos)**

Crear `historialBusquedasController.js` con endpoints que:

- Guarden una búsqueda cuando el usuario filtra (POST): validar datos, llamar al modelo.
- Retornen el historial del usuario autenticado (GET): requiere autenticación.
- Eliminen una búsqueda del historial (DELETE): solo el propietario puede eliminar, validar pertenencia.

---

### **Tarea 4: Rutas (12 puntos)**

Crear `historialBusquedasRoutes.js` con:

- GET para obtener mi historial de búsquedas (requiere autenticación).
- POST para guardar una búsqueda (requiere autenticación).
- DELETE para eliminar una búsqueda del historial (requiere autenticación).

Registrar en aplicación con prefijo `/api/historial-busquedas`.

---

## **Parte 2: Frontend – 60 puntos**

---

### **Tarea 1: Estado Global (12 puntos)**

Crear store Pinia `historialStore.js` que:

- Almacene lista de búsquedas del usuario.
- Almacene estado de carga.
- Implemente acciones para cargar historial, guardar búsqueda, eliminar búsqueda.
- Implemente getter para obtener últimas 5 búsquedas (para dropdown).

---

### **Tarea 2: Integración en Vista de Compra (18 puntos)**

Modificar `ComprarView.vue` para:

- **Guardar búsquedas**: cuando usuario aplica filtros (texto, categoría), guardar automáticamente en el store y enviar al backend.

- **Mostrar dropdown**: en el input de búsqueda, al hacer focus mostrar dropdown con últimas búsquedas.
  - Mostrar: texto de búsqueda, categoría (si existe), fecha aproximada (ej: "hace 2 horas").
  - Click en una búsqueda anterior: restaurar todos los filtros y cargar resultados correspondientes.
  - Icono X para eliminar búsqueda del historial.

- **Sincronización**: el estado del store debe estar sincronizado con lo que se muestra.

---

### **Tarea 3: Componente de Dropdown (20 puntos)**

Crear componente `HistorialBusquedas.vue` (o dropdown reutilizable) que:

- Reciba lista de búsquedas como prop.
- Muestre último texto + categoría + fecha.
- Permita hacer click para seleccionar una búsqueda (emitir evento al padre).
- Permita eliminar búsqueda con icono X (emitir segundo evento).
- Sea responsive y se adapte bien en mobile.
- La integración en `ComprarView` debe cargar store al montar y pasar datos al componente.

---

### **Tarea 4: Restauración de Filtros (10 puntos)**

Cuando usuario selecciona una búsqueda anterior:

- Restaurar el texto de búsqueda en el input.
- Seleccionar la categoría (si la búsqueda tenía).
- Limpiar otros filtros (distancia, rango de precios) o mantenerlos según diseño.
- Ejecutar búsqueda automáticamente con los filtros restaurados.
- Mostrar resultados de productos correspondientes.

---

## **Requisitos Generales**

- **Validaciones**: al menos texto O categoría debe existir (1 punto).
- **No duplicados**: si búsqueda exacta existe, actualizar fecha en lugar de duplicar (2 puntos).
- **Límite de almacenamiento**: guardar últimas 50 búsquedas por usuario (1 punto).

---

## **Criterios de Evaluación**

✅ Tabla `historial_busquedas` creada correctamente.  
✅ Búsquedas se guardan automáticamente al filtrar.  
✅ Dropdown muestra últimas búsquedas del usuario.  
✅ Click en búsqueda anterior restaura filtros y ejecuta búsqueda.  
✅ Eliminar búsqueda funciona en BD y UI.  
✅ No hay búsquedas duplicadas (mismo texto+categoría).  
✅ Solo usuarios autenticados ven su historial.  
✅ Interfaz es limpia y responsive.
