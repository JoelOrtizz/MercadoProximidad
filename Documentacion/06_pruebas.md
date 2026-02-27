# 06. Pruebas

## 6.1 Objetivo
Validar que los flujos criticos de TerretaShop funcionan de extremo a extremo:
- Autenticacion
- Publicacion y reserva
- Estados de reserva
- Chat, valoraciones y notificaciones
- Puntos de entrega y ubicacion

## 6.2 Alcance actual
Actualmente el proyecto dispone sobre todo de pruebas manuales guiadas:
- Coleccion REST en `backend/api/tests/test.rest`
- Verificacion funcional desde interfaz web

No hay suite automatica consolidada (unitaria/integracion/e2e) en el repo principal.

## 6.3 Entorno de prueba recomendado
- Levantar stack completo (backend, frontend, db).
- Base inicial recreada con `backend/database/init.sql`.
- Navegador con cookies habilitadas.

## 6.4 Casos de prueba manuales (checklist)

### A. Sesion y usuario
1. Registro de usuario nuevo.
2. Login correcto / login incorrecto.
3. Persistencia de sesion al recargar.
4. Logout y proteccion de vistas privadas.

### B. Ubicacion y puntos de entrega
1. Guardar ubicacion en `/coords`.
2. Crear varios puntos de entrega.
3. Reemplazo bulk de puntos.
4. Intentar eliminar punto con reserva activa:
- Debe mantenerse bloqueado.
- Debe informarse guardado parcial.
- Debe verse badge de reservas activas.

### C. Productos
1. Crear producto con imagen.
2. Editar producto (con y sin nueva imagen).
3. Eliminar producto sin reservas activas.
4. Intentar eliminar producto con reservas activas (debe fallar).

### D. Comprar y reservar
1. Filtrar productos por categoria y texto.
2. Reservar producto de otro usuario.
3. Verificar descuento de stock.
4. Intentar reservar producto propio (debe bloquear).

### E. Reservas
1. Comprador cancela reserva pendiente.
2. Vendedor acepta/rechaza/completa.
3. Solicitud de cancelacion en aceptada.
4. Vendedor acepta/rechaza solicitud de cancelacion.
5. Boton "Como llegar" abre ruta a punto de entrega.

### F. Mensajes
1. Crear/abrir chat desde reserva.
2. Enviar y recibir mensajes.
3. Polling actualiza sin perder contexto de lectura.

### G. Valoraciones y notificaciones
1. Valorar reserva completada.
2. Ver valoracion recibida/media.
3. Notificaciones por eventos de reserva/chat/valoracion.
4. Marcar notificaciones como leidas y leidas-todas.

## 6.5 Criterios de aceptacion
- Ningun flujo critico rompe por error 500.
- Errores de validacion devuelven mensaje claro al usuario.
- Estado frontend y backend quedan sincronizados tras cada accion.
- No hay regresiones visibles en vistas principales.

## 6.6 Mejoras recomendadas
- Automatizar API tests (supertest o similar).
- Añadir e2e de flujos clave (Playwright/Cypress).
- Integrar pruebas en pipeline CI para cada merge.
