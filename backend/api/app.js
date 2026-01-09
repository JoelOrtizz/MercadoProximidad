import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/userRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import mapRoutes from './routes/mapRoutes.js';
import userRoutes from './routes/userRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import mapRoutes from './routes/mapRoutes.js';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : true;
app.use(cors({ origin: corsOrigin, credentials: true }));

const cookieSecret = process.env.COOKIE_SECRET;
if (!cookieSecret) {
  throw new Error('Falta configurar COOKIE_SECRET en el .env');
}
app.use(cookieParser(cookieSecret));

// ==============================
// HEALTH CHECK
// ==============================

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-backend' });
});

// ==============================
// RUTAS
// ==============================

app.get('/', (req, res) => {
  res.send('Conexion establecida.');
});

app.use('/api/usuarios', userRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/map', mapRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ==============================
// MANEJO GLOBAL DE ERRORES
// MANEJO GLOBAL DE ERRORES
// ==============================

app.use((err, req, res, next) => {
  console.error('Error capturado:', err);
  console.error('Error capturado:', err);

  let status = 500;
  let message = 'Error interno del servidor';
  let message = 'Error interno del servidor';

  if (err?.name === 'JsonWebTokenError' || err?.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token invalido o expirado';
  } else if (err?.code) {
  if (err?.name === 'JsonWebTokenError' || err?.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token invalido o expirado';
  } else if (err?.code) {
    switch (err.code) {
      case 'ER_DUP_ENTRY':
      case 'ER_DUP_ENTRY':
        status = 409;
        message = 'Registro duplicado';
        message = 'Registro duplicado';
        break;
      case 'ER_BAD_FIELD_ERROR':
      case 'ER_BAD_FIELD_ERROR':
        status = 400;
        message = 'Campo o columna no valido';
        message = 'Campo o columna no valido';
        break;
      case 'ER_NO_REFERENCED_ROW_2':
      case 'ER_ROW_IS_REFERENCED_2':
      case 'ER_NO_REFERENCED_ROW_2':
      case 'ER_ROW_IS_REFERENCED_2':
        status = 409;
        message = 'Violacion de clave foranea';
        message = 'Violacion de clave foranea';
        break;
      case 'ER_PARSE_ERROR':
      case 'ER_PARSE_ERROR':
        status = 400;
        message = 'Error de sintaxis SQL';
        message = 'Error de sintaxis SQL';
        break;
      case 'ER_ACCESS_DENIED_ERROR':
      case 'ER_ACCESS_DENIED_ERROR':
        status = 403;
        message = 'Acceso denegado a la base de datos';
        message = 'Acceso denegado a la base de datos';
        break;
      case 'PROTOCOL_CONNECTION_LOST':
      case 'PROTOCOL_CONNECTION_LOST':
        status = 503;
        message = 'Conexion con la base de datos perdida';
        message = 'Conexion con la base de datos perdida';
        break;
      default:
        message = err.message || message;
    }
  } else if (err?.status) {
  } else if (err?.status) {
    status = err.status;
    message = err.message || message;
  } else if (err?.message) {
    message = err.message || message;
  } else if (err?.message) {
    message = err.message;
  }

  res.status(status).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando a http://localhost:${PORT}`);
});

  console.log(`Servidor escuchando a http://localhost:${PORT}`);
});
