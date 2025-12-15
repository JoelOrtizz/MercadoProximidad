-- ======================================
-- BASE DE DATOS
-- ======================================
CREATE DATABASE IF NOT EXISTS terretashop_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE terretashop_db;

-- ======================================
-- USUARIOS
-- ======================================
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  nickname VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  tipo ENUM('comprador', 'vendedor', 'admin') NOT NULL,
  lat DECIMAL(10,8) DEFAULT NULL,
  lng DECIMAL(11,8) DEFAULT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================
-- CATEGORIAS
-- ======================================
CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT
);

-- ======================================
-- PRODUCTOS
-- ======================================
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  id_categoria INT,
  tipo VARCHAR(50), -- kg, litros, unidades...
  stock DECIMAL(10,2) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  imagen VARCHAR(255),
  id_vendedor INT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  duracion_producto INT, -- días

  CONSTRAINT fk_producto_vendedor
    FOREIGN KEY (id_vendedor) REFERENCES usuarios(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_producto_categoria
    FOREIGN KEY (id_categoria) REFERENCES categorias(id)
    ON DELETE SET NULL
);

-- ======================================
-- PUNTOS DE ENTREGA
-- ======================================
CREATE TABLE puntos_entrega (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_vendedor INT NOT NULL,
  lat DECIMAL(10,8) NOT NULL,
  lng DECIMAL(11,8) NOT NULL,
  descripcion VARCHAR(255),

  CONSTRAINT fk_punto_vendedor
    FOREIGN KEY (id_vendedor) REFERENCES usuarios(id)
    ON DELETE CASCADE
);

-- ======================================
-- RESERVAS
-- ======================================
CREATE TABLE reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_vendedor INT NOT NULL,
  id_comprador INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad DECIMAL(10,2) NOT NULL,
  id_punto_entrega INT NOT NULL,
  estado ENUM('pendiente', 'aceptada', 'rechazada', 'cancelada', 'completada')
    DEFAULT 'pendiente',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_entrega DATE,

  CONSTRAINT fk_reserva_vendedor
    FOREIGN KEY (id_vendedor) REFERENCES usuarios(id),

  CONSTRAINT fk_reserva_comprador
    FOREIGN KEY (id_comprador) REFERENCES usuarios(id),

  CONSTRAINT fk_reserva_producto
    FOREIGN KEY (id_producto) REFERENCES productos(id),

  CONSTRAINT fk_reserva_punto
    FOREIGN KEY (id_punto_entrega) REFERENCES puntos_entrega(id)
);

-- ======================================
-- VALORACIONES
-- ======================================
CREATE TABLE valoraciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_reserva INT NOT NULL,
  id_autor INT NOT NULL,
  id_destinatario INT NOT NULL,
  rol_autor ENUM('comprador', 'vendedor') NOT NULL,
  nota_producto TINYINT CHECK (nota_producto BETWEEN 1 AND 5),
  nota_entrega TINYINT CHECK (nota_entrega BETWEEN 1 AND 5),
  nota_negociacion TINYINT CHECK (nota_negociacion BETWEEN 1 AND 5),
  comentario TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_valoracion_reserva
    FOREIGN KEY (id_reserva) REFERENCES reservas(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_valoracion_autor
    FOREIGN KEY (id_autor) REFERENCES usuarios(id),

  CONSTRAINT fk_valoracion_destinatario
    FOREIGN KEY (id_destinatario) REFERENCES usuarios(id)
);

-- ======================================
-- NOTIFICACIONES
-- ======================================
CREATE TABLE notificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_reserva INT NOT NULL,
  id_usuario INT NOT NULL,
  tipo ENUM('aceptada', 'recibido', 'cancelacion', 'para_recoger') NOT NULL,
  leida BOOLEAN DEFAULT FALSE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_notificacion_reserva
    FOREIGN KEY (id_reserva) REFERENCES reservas(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_notificacion_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
    ON DELETE CASCADE
);


-- ======================================
-- MENSAJES
-- ======================================
CREATE TABLE mensajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_reserva INT NOT NULL,
  id_comprador INT NOT NULL,
  id_vendedor INT NOT NULL,
  autor ENUM('comprador', 'vendedor') NOT NULL,
  mensaje TEXT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_mensaje_reserva
    FOREIGN KEY (id_reserva) REFERENCES reservas(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_mensaje_comprador
    FOREIGN KEY (id_comprador) REFERENCES usuarios(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_mensaje_vendedor
    FOREIGN KEY (id_vendedor) REFERENCES usuarios(id)
    ON DELETE CASCADE
);
