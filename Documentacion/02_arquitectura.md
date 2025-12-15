# 02. Arquitectura del Sistema

## 2.1 Visión general de la arquitectura

La aplicación **TerretaShop** se ha diseñado siguiendo una arquitectura web basada en la separación de responsabilidades, con el objetivo de facilitar el mantenimiento, la escalabilidad y la comprensión del sistema.  
El proyecto se estructura en tres grandes capas principales:

- **Frontend (cliente)**  
- **Backend (servidor / API REST)**  
- **Base de datos**

Esta organización permite desarrollar y evolucionar cada parte del sistema de forma independiente, manteniendo una comunicación clara entre ellas mediante peticiones HTTP y formatos de intercambio de datos estandarizados.

---

## 2.2 Arquitectura cliente–servidor

TerretaShop sigue un modelo clásico de **arquitectura cliente–servidor**:

- El **frontend** se ejecuta en el navegador del usuario y se encarga de la interfaz gráfica, la interacción con el usuario y la visualización de la información (mapas, listados, filtros, etc.).
- El **backend** actúa como intermediario entre el frontend y la base de datos, gestionando la lógica de negocio, la validación de datos, la seguridad y el acceso a la información.
- La **base de datos** almacena de forma persistente toda la información relacionada con usuarios, productos, reservas, mensajes y demás entidades del sistema.

La comunicación entre frontend y backend se realiza mediante una **API REST**, utilizando peticiones HTTP y respuestas en formato JSON.

---

## 2.3 Capa de frontend

La capa de frontend es responsable de:

- Mostrar la interfaz de usuario de forma clara y accesible.
- Permitir la interacción del usuario con la aplicación (registro, búsqueda, reservas, mensajes).
- Representar la información geográfica mediante mapas y filtros de proximidad.
- Consumir los endpoints expuestos por la API REST.

El diseño de la interfaz se plantea de forma **responsive**, adaptándose a distintos tamaños de pantalla, y siguiendo criterios de usabilidad y coherencia visual definidos en la imagen corporativa del proyecto.

---

## 2.4 Capa de backend (API REST)

El backend de TerretaShop se implementa como una **API REST**, encargada de centralizar toda la lógica del sistema. Sus principales responsabilidades son:

- Gestión de usuarios y roles (comprador, vendedor, administrador).
- Gestión de productos y categorías.
- Gestión de reservas y estados de las mismas.
- Gestión de puntos de entrega.
- Comunicación entre comprador y vendedor mediante mensajes.
- Generación de notificaciones asociadas a eventos del sistema.

La API actúa como única vía de acceso a la base de datos, garantizando la integridad de los datos y evitando accesos directos desde el cliente.

---

## 2.5 Capa de datos

La capa de datos está basada en una **base de datos relacional**, diseñada para reflejar las relaciones entre las distintas entidades del sistema.  
El modelo de datos se ha definido siguiendo principios de normalización, evitando redundancias y asegurando la integridad referencial mediante claves primarias y foráneas.

La base de datos almacena, entre otros, los siguientes elementos:
- usuarios y sus roles,
- productos y categorías,
- reservas y puntos de entrega,
- mensajes y notificaciones,
- valoraciones asociadas a las reservas.

El diseño detallado del modelo entidad–relación se desarrolla en el apartado correspondiente a la base de datos.

---

## 2.6 Integración de geolocalización

La arquitectura contempla la integración con servicios de **geolocalización y mapas**, permitiendo:

- almacenar coordenadas geográficas (latitud y longitud),
- mostrar productos y vendedores cercanos al usuario,
- filtrar resultados por proximidad.

La arquitectura se mantiene independiente de la API concreta utilizada, lo que permite flexibilidad en la elección del proveedor de mapas.

---

## 2.7 Entornos de ejecución

El proyecto se plantea para funcionar en dos entornos diferenciados:

- **Entorno de desarrollo**, utilizando contenedores Docker para facilitar la reproducción del entorno local.
- **Entorno de producción**, desplegado en un servidor con acceso público, comunicación segura mediante HTTPS y configuración adecuada de servicios.

Esta separación permite un desarrollo controlado y un despliegue final acorde a los requisitos del módulo de Despliegue de Aplicaciones Web.

---

## 2.8 Justificación de la arquitectura

La arquitectura adoptada en TerretaShop permite:

- una clara separación de responsabilidades,
- facilidad de mantenimiento y ampliación,
- reutilización de componentes,
- alineación con buenas prácticas del desarrollo web moderno.

Además, se adapta al contexto académico del proyecto, permitiendo al equipo aplicar de forma integrada los conocimientos adquiridos en los distintos módulos del ciclo formativo.
