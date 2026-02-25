-- Active: 1762442615612@@127.0.0.1@3306@terretashop_db
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
  tlf VARCHAR(20) DEFAULT NULL,
  contrasena VARCHAR(255) NOT NULL,
  tipo ENUM('miembro', 'admin') NOT NULL DEFAULT 'miembro',
  lat DECIMAL(10,8) DEFAULT NULL,
  lng DECIMAL(11,8) DEFAULT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================
-- CATEGORIAS
-- ======================================
CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================
-- UNIDADES
-- ======================================
CREATE TABLE unidades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  simbolo VARCHAR(10) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================
-- PRODUCTOS
-- ======================================
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  id_categoria INT,
  id_unidad INT NOT NULL,
  stock DECIMAL(10,2) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  imagen VARCHAR(255),
  id_vendedor INT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  duracion_producto INT, -- dÇðas

  CONSTRAINT fk_producto_vendedor
    FOREIGN KEY (id_vendedor) REFERENCES usuarios(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_producto_categoria
    FOREIGN KEY (id_categoria) REFERENCES categorias(id)
    ON DELETE SET NULL,

  CONSTRAINT fk_producto_unidad
    FOREIGN KEY (id_unidad) REFERENCES unidades(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================
-- RESERVAS
-- ======================================
CREATE TABLE reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_vendedor INT NOT NULL,
  id_comprador INT NOT NULL,
  -- Si el producto se borra, queremos conservar la reserva (historial),
  -- pero sin depender de un producto que ya no existe.
  id_producto INT NULL,
  cantidad DECIMAL(10,2) NOT NULL,
  -- Cuando una reserva se cancela / se completa, ya no nos importa mantener el punto "congelado".
  -- Por eso permitimos NULL: asi el vendedor puede reemplazar sus puntos de entrega sin romper reservas antiguas.
  id_punto_entrega INT NULL,
  estado ENUM('pendiente', 'aceptada', 'rechazada', 'cancelada', 'completada', 'cancelacion_solicitada')
    DEFAULT 'pendiente',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_reserva_vendedor
    FOREIGN KEY (id_vendedor) REFERENCES usuarios(id),

  CONSTRAINT fk_reserva_comprador
    FOREIGN KEY (id_comprador) REFERENCES usuarios(id),

  CONSTRAINT fk_reserva_producto
    FOREIGN KEY (id_producto) REFERENCES productos(id)
    ON DELETE SET NULL,

  CONSTRAINT fk_reserva_punto
    FOREIGN KEY (id_punto_entrega) REFERENCES puntos_entrega(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================
-- VALORACIONES
-- ======================================
CREATE TABLE valoraciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_reserva INT NOT NULL,
  id_autor INT NOT NULL,
  id_destinatario INT NOT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================
-- NOTIFICACIONES
-- ======================================
CREATE TABLE notificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  tipo ENUM(
    'reserva_pendiente',
    'reserva_aceptada',
    'reserva_cancelada',
    'mensaje_nuevo',
    'valoracion_pendiente',
    'info'
  ) NOT NULL,
  titulo VARCHAR(120) NULL,
  mensaje VARCHAR(255) NULL,
  url VARCHAR(255) NULL,
  id_reserva INT NULL,
  leida TINYINT(1) DEFAULT 0,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_notificacion_reserva
    FOREIGN KEY (id_reserva) REFERENCES reservas(id)
    ON DELETE SET NULL,

  CONSTRAINT fk_notificacion_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
    ON DELETE CASCADE

  ,INDEX idx_notificaciones_usuario_fecha (id_usuario, fecha_creacion)
  ,INDEX idx_notificaciones_usuario_leida (id_usuario, leida)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ======================================
-- CHAT
-- ======================================
CREATE TABLE chats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario_1 INT NOT NULL,
  id_usuario_2 INT NOT NULL,
  -- Guardamos también el par "ordenado" para poder tener 1 chat por pareja (1,2) == (2,1).
  -- OJO: NO son columnas generadas porque en MySQL 8 puede dar problemas con foreign keys.
  id_usuario_min INT NOT NULL,
  id_usuario_max INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario_1) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario_2) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE KEY unique_chat (id_usuario_min, id_usuario_max),
  CHECK (id_usuario_1 <> id_usuario_2),
  CHECK (id_usuario_min = LEAST(id_usuario_1, id_usuario_2)),
  CHECK (id_usuario_max = GREATEST(id_usuario_1, id_usuario_2))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE mensajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_chat INT NOT NULL,
  id_usuario INT NOT NULL,
  mensaje TEXT NOT NULL,
  id_reserva INT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (id_chat) REFERENCES chats(id) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
  -- Como el chat NO es por reserva, esto es opcional; si se borra una reserva, el mensaje queda sin id_reserva.
  FOREIGN KEY (id_reserva) REFERENCES reservas(id) ON DELETE SET NULL,

  INDEX idx_mensajes_chat_fecha (id_chat, fecha_creacion),
  INDEX idx_mensajes_usuario_fecha (id_usuario, fecha_creacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ======================================
-- CATEGORÇ?AS INSERTADAS
-- ======================================
INSERT INTO categorias (nombre, descripcion) VALUES 
('Frutas', 'Frutas frescas, de temporada y exoticas'),
('Verduras', 'Hortalizas, legumbres y verduras frescas'),
('Lacteos y derivados', 'Leche, quesos, yogures, mantequillas y otros derivados'),
('Panaderia', 'Pan fresco, bolleria, pasteles y masas'),
('Elaborados', 'Comidas preparadas, conservas y productos procesados'),
('Aceites', 'Aceite de oliva, girasol, semillas y grasas vegetales'),
('Plantas', 'Plantas ornamentales, semillas y articulos de jardineria'),
('Otros', 'Articulos diversos y productos sin categoria especifica');

-- ======================================
-- UNIDADES INSERTADAS
-- ======================================
INSERT INTO unidades (nombre, simbolo) VALUES
('Kilogramo', 'kg'),
('Gramo', 'g'),
('Litro', 'L'),
('Mililitro', 'ml'),
('Unidad', 'ud'),
('Otros', 'otros');

-- ======================================
-- SEED DE EJEMPLO (CHAT 1 A 1)
-- ======================================
-- Contraseña para ambos usuarios: 1234
-- (hash bcrypt ya generado, para que puedas hacer login)
INSERT INTO usuarios (id, nombre, nickname, email, tlf, contrasena, tipo, lat, lng) VALUES
(1, 'Daniel', 'Daniel', 'daniel@ejemplo.com', NULL, '$2b$10$rkZhm8DzBLUtkEzixgEA2uPy2I037R6TtT/Sa7RpmoTpGnPdDg3xe', 'admin', 39.07170000, -0.26680000),
(2, 'Joel', 'Joel', 'joel@ejemplo.com', NULL, '$2b$10$rkZhm8DzBLUtkEzixgEA2uPy2I037R6TtT/Sa7RpmoTpGnPdDg3xe', 'miembro', 39.07310000, -0.26820000);

-- ======================================
-- PRODUCTOS DE MUESTRA (ALTERNANDO VENDEDOR)
-- ======================================
-- Nota: se alterna id_vendedor entre Daniel (1) y Joel (2).
-- Imagen: el campo guarda solo el nombre del fichero.
INSERT INTO productos
  (nombre, id_categoria, id_unidad, stock, precio, descripcion, imagen, id_vendedor, duracion_producto)
VALUES
  ('Sandia rayada',          1, 1, 24.00, 2.80, 'Sandia dulce de temporada.',                 'sandias.jpeg',     1, 7),
  ('Tomate valenciano',      2, 1, 38.00, 2.40, 'Tomate rojo para ensalada.',                 'tomates.jpg',      2, 6),
  ('Pepino fresco',          2, 1, 30.00, 1.90, 'Pepino crujiente recien cortado.',           'pepinos.jpg',      1, 6),
  ('Leche fresca',           3, 3, 46.00, 1.35, 'Leche fresca pasteurizada.',                 'lechefresca.jpg', 2, 4),
  ('Pan de pueblo',          4, 5, 20.00, 1.80, 'Pan artesanal horneado hoy.',                'pan.jpg',          1, 2),
  ('Embutido casero',        5, 5, 18.00, 3.90, 'Elaborado artesanal listo para servir.',     'elaborado.jpg',    2, 20),
  ('Aceite de oliva virgen', 6, 3, 28.00, 7.80, 'Aceite suave de primera prensada.',          'aceite.jpg',       1, 60),
  ('Ramo de flores',         7, 5, 12.00, 9.50, 'Ramo mixto de flor natural.',                'ramodeflores.jpg', 2, 3),
  ('Miel local',             8, 5, 16.00, 5.60, 'Miel natural de apicultor local.',           'miel.jpg',         1, 90);

-- ======================================
-- PUNTOS DE ENTREGA DE MUESTRA
-- ======================================
INSERT INTO puntos_entrega (id_vendedor, lat, lng, descripcion) VALUES
  (1, 39.07190000, -0.26710000, 'Punto centro Tavernes - Daniel'),
  (1, 39.06980000, -0.26290000, 'Punto norte Tavernes - Daniel'),
  (2, 39.07340000, -0.27060000, 'Punto centro Tavernes - Joel'),
  (2, 39.07500000, -0.26470000, 'Punto este Tavernes - Joel');

-- ======================================
-- RESERVAS DE MUESTRA (ESTADOS VARIADOS)
-- ======================================
-- Objetivo: tener ejemplos reales de reservas en distintos estados
-- para probar listados, filtros y acciones del frontend/backend.
INSERT INTO reservas
  (id_vendedor, id_comprador, id_producto, cantidad, id_punto_entrega, estado)
VALUES
  -- Pendiente: Joel compra a Daniel
  (1, 2, 1, 2.00, 1, 'pendiente'),
  -- Aceptada: Daniel compra a Joel
  (2, 1, 2, 1.00, 4, 'aceptada'),
  -- Cancelada: Joel compra a Daniel
  (1, 2, 3, 3.00, 2, 'cancelada'),
  -- Rechazada: Daniel compra a Joel
  (2, 1, 4, 2.00, 3, 'rechazada'),
  -- Completada: Joel compra a Daniel (con valoracion creada mas abajo)
  (1, 2, 5, 1.00, 1, 'completada'),
  -- Completada: Daniel compra a Joel (sin valorar aun -> pendiente de valoracion)
  (2, 1, 6, 1.00, 4, 'completada'),
  -- Cancelacion solicitada: Joel compra a Daniel
  (1, 2, 7, 1.00, 2, 'cancelacion_solicitada'),
  -- Completada: Joel compra a Daniel (sin valorar aun -> pendiente de valoracion)
  (1, 2, 9, 2.00, 1, 'completada');

-- ======================================
-- VALORACIONES DE MUESTRA
-- ======================================
-- Objetivo: tener ejemplos de "valoraciones hechas" y "pendientes".
-- Reserva #5: Joel (comprador) valora a Daniel (vendedor).
INSERT INTO valoraciones
  (id_reserva, id_autor, id_destinatario, nota_producto, nota_entrega, nota_negociacion, comentario)
VALUES
  (5, 2, 1, 5, 4, 5, 'Producto muy bueno y trato rapido.');

-- Creamos (si no existe) el chat entre ellos y unos mensajes de ejemplo.

-- 1 chat por pareja: si ya existe, no se duplica (por UNIQUE de (id_usuario_min, id_usuario_max)).
INSERT INTO chats (id_usuario_1, id_usuario_2, id_usuario_min, id_usuario_max)
VALUES (1, 2, 1, 2)
ON DUPLICATE KEY UPDATE created_at = created_at;

-- Mensajes de ejemplo (se insertan solo si ese texto exacto no existe ya en ese chat).
INSERT INTO mensajes (id_chat, id_usuario, mensaje, id_reserva)
SELECT c.id, 1, 'Ey, te escribo por el producto', NULL
FROM chats c
WHERE c.id_usuario_min = 1 AND c.id_usuario_max = 2
  AND NOT EXISTS (
    SELECT 1 FROM mensajes m
    WHERE m.id_chat = c.id AND m.id_usuario = 1 AND m.mensaje = 'Ey, te escribo por el producto'
  );

INSERT INTO mensajes (id_chat, id_usuario, mensaje, id_reserva)
SELECT c.id, 2, 'Perfecto, dime', NULL
FROM chats c
WHERE c.id_usuario_min = 1 AND c.id_usuario_max = 2
  AND NOT EXISTS (
    SELECT 1 FROM mensajes m
    WHERE m.id_chat = c.id AND m.id_usuario = 2 AND m.mensaje = 'Perfecto, dime'
  );

INSERT INTO mensajes (id_chat, id_usuario, mensaje, id_reserva)
SELECT c.id, 1, 'Lo tienes disponible todavia?', NULL
FROM chats c
WHERE c.id_usuario_min = 1 AND c.id_usuario_max = 2
  AND NOT EXISTS (
    SELECT 1 FROM mensajes m
    WHERE m.id_chat = c.id AND m.id_usuario = 1 AND m.mensaje = 'Lo tienes disponible todavia?'
  );

INSERT INTO mensajes (id_chat, id_usuario, mensaje, id_reserva)
SELECT c.id, 2, 'Si, aun queda stock para hoy.', 1
FROM chats c
WHERE c.id_usuario_min = 1 AND c.id_usuario_max = 2
  AND NOT EXISTS (
    SELECT 1 FROM mensajes m
    WHERE m.id_chat = c.id AND m.id_usuario = 2 AND m.mensaje = 'Si, aun queda stock para hoy.'
  );

INSERT INTO mensajes (id_chat, id_usuario, mensaje, id_reserva)
SELECT c.id, 1, 'Perfecto, reservo 2 unidades.', 1
FROM chats c
WHERE c.id_usuario_min = 1 AND c.id_usuario_max = 2
  AND NOT EXISTS (
    SELECT 1 FROM mensajes m
    WHERE m.id_chat = c.id AND m.id_usuario = 1 AND m.mensaje = 'Perfecto, reservo 2 unidades.'
  );

INSERT INTO mensajes (id_chat, id_usuario, mensaje, id_reserva)
SELECT c.id, 2, 'Genial, te confirmo en cuanto la vea.', 1
FROM chats c
WHERE c.id_usuario_min = 1 AND c.id_usuario_max = 2
  AND NOT EXISTS (
    SELECT 1 FROM mensajes m
    WHERE m.id_chat = c.id AND m.id_usuario = 2 AND m.mensaje = 'Genial, te confirmo en cuanto la vea.'
  );

INSERT INTO mensajes (id_chat, id_usuario, mensaje, id_reserva)
SELECT c.id, 1, 'Gracias, quedamos en el punto norte.', 5
FROM chats c
WHERE c.id_usuario_min = 1 AND c.id_usuario_max = 2
  AND NOT EXISTS (
    SELECT 1 FROM mensajes m
    WHERE m.id_chat = c.id AND m.id_usuario = 1 AND m.mensaje = 'Gracias, quedamos en el punto norte.'
  );

-- ======================================
-- NOTIFICACIONES DE MUESTRA
-- ======================================
INSERT INTO notificaciones
  (id_usuario, tipo, titulo, mensaje, url, id_reserva, leida)
VALUES
  (1, 'reserva_pendiente', 'Nueva reserva pendiente', 'Tienes una reserva nueva por revisar.', '/reservas', 1, 0),
  (2, 'reserva_aceptada', 'Reserva aceptada', 'Tu reserva ha sido aceptada por el vendedor.', '/reservas', 2, 0),
  (2, 'reserva_cancelada', 'Reserva cancelada', 'Una de tus reservas ha sido cancelada.', '/reservas', 3, 1),
  (1, 'valoracion_pendiente', 'Te falta valorar', 'Tienes una reserva completada pendiente de valoracion.', '/valoraciones', 6, 0),
  (2, 'valoracion_pendiente', 'Te falta valorar', 'Recuerda valorar la experiencia de tu ultima reserva.', '/valoraciones', 8, 0),
  (1, 'mensaje_nuevo', 'Mensaje nuevo', 'Has recibido un mensaje en tu chat.', '/mensajes', 1, 1),
  (2, 'info', 'Consejo de uso', 'Puedes gestionar tus filtros desde la pantalla de compra.', '/comprar', NULL, 1);


CREATE TABLE logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INT NOT NULL,
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  data JSON,
  
  CONSTRAINT fk_logs_usuario
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
