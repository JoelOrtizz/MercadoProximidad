# 03. Diseño de la Base de Datos

## 3.1 Introducción

La base de datos de **TerretaShop** constituye el núcleo del sistema, ya que almacena de forma persistente toda la información necesaria para el correcto funcionamiento de la aplicación. Su diseño se ha realizado teniendo en cuenta los requisitos funcionales del proyecto, así como criterios de normalización, escalabilidad y claridad en las relaciones entre entidades.

El modelo de datos está orientado a reflejar de manera fiel las interacciones entre los distintos actores del sistema (compradores y vendedores), los productos ofrecidos, las reservas realizadas y la comunicación asociada a cada transacción.

---

## 3.2 Modelo entidad–relación

El diseño de la base de datos se representa mediante un **diagrama entidad–relación (ER)**, donde se muestran las principales entidades del sistema y las relaciones existentes entre ellas.

El diagrama permite visualizar de forma clara:
- las entidades principales,
- sus atributos más relevantes,
- las relaciones entre tablas,
- y las cardinalidades asociadas.

<img src="./diagrama_terretashop_db.png" alt="Diagrama ER de TerretaShop" width="700">


---

## 3.3 Entidad Usuarios

La entidad **Usuarios** representa a todas las personas que interactúan con la plataforma. Un usuario puede tener distintos roles dentro del sistema: comprador, vendedor o administrador.

Esta entidad almacena información básica de identificación, autenticación y ubicación geográfica, permitiendo tanto la gestión de accesos como la funcionalidad de búsqueda por proximidad.

**Relaciones principales:**
- Un usuario puede vender varios productos.
- Un usuario puede realizar y recibir reservas.
- Un usuario puede enviar y recibir mensajes.
- Un usuario puede generar y recibir valoraciones.
- Un usuario puede recibir notificaciones.

---

## 3.4 Entidad Categorías

La entidad **Categorías** permite clasificar los productos ofrecidos en la plataforma.  
Se ha definido como una tabla independiente para facilitar la escalabilidad del sistema y evitar la duplicación de datos.

Esta estructura permite añadir, modificar o eliminar categorías sin afectar directamente a los productos existentes.

**Relación principal:**
- Una categoría puede estar asociada a múltiples productos.

---

## 3.5 Entidad Productos

La entidad **Productos** almacena la información relativa a los productos ofrecidos por los vendedores, incluyendo su descripción, precio, stock y duración estimada.

Cada producto pertenece a un único vendedor y puede estar asociado a una categoría determinada, lo que facilita la búsqueda y el filtrado desde el frontend.

**Relaciones principales:**
- Un vendedor puede publicar varios productos.
- Un producto puede formar parte de varias reservas a lo largo del tiempo.
- Un producto pertenece a una única categoría.

---

## 3.6 Entidad Puntos de Entrega

La entidad **Puntos de Entrega** representa las ubicaciones donde el vendedor puede realizar la entrega de los productos.  
Cada vendedor puede definir uno o varios puntos de entrega, los cuales se almacenan mediante coordenadas geográficas para su integración con servicios de mapas.

Los productos no tienen puntos de entrega propios, sino que heredan los puntos definidos por su vendedor. La elección del punto de entrega se realiza en el momento de la reserva.

**Relación principal:**
- Un vendedor puede definir múltiples puntos de entrega.

---

## 3.7 Entidad Reservas

La entidad **Reservas** representa la transacción principal del sistema. Cada reserva relaciona a un comprador, un vendedor y un producto concreto, junto con la cantidad solicitada y el punto de entrega seleccionado.

La reserva actúa además como contexto para otros elementos del sistema, como los mensajes, las notificaciones y las valoraciones.

**Relaciones principales:**
- Un comprador puede realizar múltiples reservas.
- Un vendedor puede recibir múltiples reservas.
- Una reserva está asociada a un único producto.
- Una reserva selecciona un punto de entrega concreto.

---

## 3.8 Entidad Mensajes

La entidad **Mensajes** permite la comunicación directa entre comprador y vendedor en el contexto de una reserva concreta.  
Cada reserva dispone de su propio hilo de mensajes, lo que garantiza que la comunicación esté siempre vinculada a una transacción específica.

Esta decisión de diseño evita la existencia de chats globales y facilita la trazabilidad de la información.

**Relación principal:**
- Una reserva puede tener múltiples mensajes asociados.

---

## 3.9 Entidad Valoraciones

La entidad **Valoraciones** permite evaluar la experiencia de la transacción una vez finalizada la reserva.  
Por cada reserva pueden existir dos valoraciones:
- una realizada por el comprador hacia el vendedor,
- otra realizada por el vendedor hacia el comprador.

Las valoraciones incluyen distintos criterios (producto, entrega y negociación) y permiten calcular métricas agregadas sin almacenar valores derivados en la base de datos.

**Relación principal:**
- Una reserva puede generar varias valoraciones.

---

## 3.10 Entidad Notificaciones

La entidad **Notificaciones** gestiona los avisos generados por eventos relevantes del sistema, como cambios de estado en las reservas o acciones importantes para el usuario.

Cada notificación está asociada a una reserva y a un usuario destinatario, permitiendo mostrar información personalizada y controlar el estado de lectura.

**Relación principal:**
- Un usuario puede recibir múltiples notificaciones.

---

## 3.11 Justificación del diseño

El diseño de la base de datos de TerretaShop se ha realizado priorizando:
- la claridad del modelo,
- la integridad de los datos,
- la escalabilidad futura,
- y la coherencia con los flujos funcionales de la aplicación.

Este enfoque permite una implementación robusta del sistema y facilita tanto el desarrollo del backend como la comprensión global del proyecto desde un punto de vista técnico y académico.
