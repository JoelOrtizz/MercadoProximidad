erDiagram

    USUARIOS {
        int id PK
        string nombre
        string nickname
        string email
        string contrasena
        enum tipo
        decimal lat
        decimal lng
        timestamp fecha_creacion
    }

    CATEGORIAS {
        int id PK
        string nombre
        string descripcion
    }

    PRODUCTOS {
        int id PK
        string nombre
        int id_categoria FK
        string tipo
        decimal stock
        decimal precio
        string descripcion
        string imagen
        int id_vendedor FK
        timestamp fecha_creacion
        int duracion_producto
    }

    PUNTOS_ENTREGA {
        int id PK
        int id_vendedor FK
        decimal lat
        decimal lng
        string descripcion
    }

    RESERVAS {
        int id PK
        int id_vendedor FK
        int id_comprador FK
        int id_producto FK
        decimal cantidad
        int id_punto_entrega FK
        enum estado
        timestamp fecha_creacion
        date fecha_entrega
    }

    MENSAJES {
        int id PK
        int id_reserva FK
        int id_comprador FK
        int id_vendedor FK
        enum autor
        string mensaje
        timestamp fecha_creacion
    }

    VALORACIONES {
        int id PK
        int id_reserva FK
        int id_autor FK
        int id_destinatario FK
        enum rol_autor
        int nota_producto
        int nota_entrega
        int nota_negociacion
        string comentario
        timestamp fecha_creacion
    }

    NOTIFICACIONES {
        int id PK
        int id_reserva FK
        int id_usuario FK
        enum tipo
        boolean leida
        timestamp fecha_creacion
    }

    USUARIOS ||--o{ PRODUCTOS : vende
    USUARIOS ||--o{ PUNTOS_ENTREGA : define
    USUARIOS ||--o{ RESERVAS : compra
    USUARIOS ||--o{ RESERVAS : vende
    USUARIOS ||--o{ MENSAJES : participa
    USUARIOS ||--o{ VALORACIONES : escribe
    USUARIOS ||--o{ NOTIFICACIONES : recibe

    CATEGORIAS ||--o{ PRODUCTOS : clasifica

    PRODUCTOS ||--o{ RESERVAS : reservado_en

    PUNTOS_ENTREGA ||--o{ RESERVAS : elegido_en

    RESERVAS ||--o{ MENSAJES : tiene
    RESERVAS ||--o{ VALORACIONES : genera
    RESERVAS ||--o{ NOTIFICACIONES : provoca
