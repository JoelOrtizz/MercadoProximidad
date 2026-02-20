# 01. Introduccion

TerretaShop es el proyecto intermodular de 2o de DAW orientado a resolver un caso real: facilitar la compra y venta de producto local entre personas cercanas.

El sistema cubre el flujo completo:
- Registro e inicio de sesion.
- Configuracion de ubicacion y puntos de entrega.
- Publicacion y gestion de productos.
- Reserva de productos.
- Seguimiento de reservas por estado.
- Mensajeria entre usuarios.
- Valoraciones y notificaciones.

## Objetivo tecnico
Aplicar de forma integrada conocimientos de:
- Frontend SPA con Vue 3.
- API REST con Node.js y Express.
- Persistencia relacional con MySQL.
- Despliegue con Docker + Traefik + HTTPS.

## Objetivo funcional
Entregar una aplicacion usable y mantenible donde:
- El vendedor gestiona su oferta y sus puntos de entrega.
- El comprador filtra, reserva y coordina la recogida.
- Ambas partes disponen de trazabilidad (reservas, mensajes, valoraciones, notificaciones).

## Enfoque del proyecto
- Arquitectura separada por capas (frontend, backend, base de datos).
- Contratos de API claros.
- Iteraciones cortas y mejoras continuas.
- Documentacion alineada con el estado real del codigo.

