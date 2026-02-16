import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/userRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import mapRoutes from './routes/mapRoutes.js';
import productRoutes from './routes/productRoutes.js';
import puntosEntregaRoutes from './routes/puntosEntregaRoutes.js';
import categoriasRoutes from './routes/categoriasRoutes.js';
import reservaRoutes from './routes/reservaRoutes.js';
import unidadesRoutes from './routes/unidadesRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import notificacionRoutes from './routes/notificacionRoutes.js';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// IMPORTANTE (produccion con proxy inverso):
// Traefik hace de proxy, y el backend recibe peticiones internas por HTTP.
// Con trust proxy, Express interpreta bien `req.secure` usando X-Forwarded-Proto.
app.set('trust proxy', 1);

app.use(express.json());


let corsOrigin = true;
if (process.env.CORS_ORIGIN) {
  const parsed = process.env.CORS_ORIGIN
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  // Si el env existe pero viene vacío (""), dejamos modo desarrollo (true) en vez de bloquear todo.
  corsOrigin = parsed.length > 0 ? parsed : true;
}

app.use(cors({ origin: corsOrigin, credentials: true }));

// gaurdamos la palabra secreta 
const cookieSecret = process.env.COOKIE_SECRET;
if (!cookieSecret) {
  throw new Error('Falta configurar COOKIE_SECRET en el .env');
}
// activamos el parser cookie
app.use(cookieParser(cookieSecret));

app.use('/uploads', express.static('uploads')); // Para pintar las imágenes de /uploads. 
                                                // "Si alguien pide un archivo que existe en la carpeta uploads, dáselo directamente.


// ruta simple para ver si el servidor esta funcionando
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-backend' });
});


app.get('/', (req, res) => {
  res.send('Conexion establecida.');
});

app.use('/api/usuarios', userRoutes, ratingRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/puntos-entrega', puntosEntregaRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/unidades', unidadesRoutes);
app.use("/api/reservas", reservaRoutes, ratingRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/notificaciones', notificacionRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});
app.use(express.json())

app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);

app.use(cookieParser('secret'));

// ==============================
// MANEJO GLOBAL DE ERRORES
// ==============================

app.use((err, req, res, next) => {
  // Para DAW: no queremos llenar consola con errores esperados (401/403/400).
  // Dejamos el log "fuerte" solo para 500+.

  let status = 500;
  let message = 'Error interno del servidor';

  // Errores de JWT
  if (err?.name === 'JsonWebTokenError' || err?.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token invalido o expirado';
  
  // Errores de Base de Datos (SQL)
  } else if (err?.code) {
    switch (err.code) {
      case 'ER_DUP_ENTRY':
        status = 409;
        message = 'Registro duplicado';
        break;
      case 'ER_BAD_FIELD_ERROR':
        status = 400;
        message = 'Campo o columna no valido';
        break;
      case 'ER_NO_REFERENCED_ROW_2':
      case 'ER_ROW_IS_REFERENCED_2':
        status = 409;
        message = 'Violacion de clave foranea';
        break;
      case 'ER_PARSE_ERROR':
        status = 400;
        message = 'Error de sintaxis SQL';
        break;
      case 'ER_ACCESS_DENIED_ERROR':
        status = 403;
        message = 'Acceso denegado a la base de datos';
        break;
      case 'PROTOCOL_CONNECTION_LOST':
        status = 503;
        message = 'Conexion con la base de datos perdida';
        break;
      default:
        message = err.message || message;
    }
  
  // Errores personalizados con status
  } else if (err?.status) {
    status = err.status;
    message = err.message || message;
  
  // Otros errores con mensaje
  } else if (err?.message) {
    message = err.message || message;
  }

  if (status >= 500) {
    console.error('Error capturado:', err);
  } else {
    console.warn(`Error ${status}: ${message}`);
  }

  res.status(status).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando a http://localhost:${PORT}`);
});
