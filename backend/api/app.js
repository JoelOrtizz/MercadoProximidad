import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser';

import userRoutes from './routes/userRoutes.js'
import loginRoutes from './routes/loginRoutes.js'

const app = express()
const PORT = 3000

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
// ⚠️ MANEJO GLOBAL DE ERRORES
// ==============================

app.use((err, req, res, next) => {
  console.error("❌ Error capturado:", err);

  // Valores por defecto
  let status = 500;
  let message = "Error interno del servidor";

  // 📦 Errores MySQL comunes
  if (err.code) {
    switch (err.code) {
      case "ER_DUP_ENTRY":
        status = 409;
        message = "Registro duplicado";
        break;
      case "ER_BAD_FIELD_ERROR":
        status = 400;
        message = "Campo o columna no válido";
        break;
      case "ER_NO_REFERENCED_ROW_2":
      case "ER_ROW_IS_REFERENCED_2":
        status = 409;
        message = "Violación de clave foránea";
        break;
      case "ER_PARSE_ERROR":
        status = 400;
        message = "Error de sintaxis SQL";
        break;
      case "ER_ACCESS_DENIED_ERROR":
        status = 403;
        message = "Acceso denegado a la base de datos";
        break;
      case "PROTOCOL_CONNECTION_LOST":
        status = 503;
        message = "Conexión con la base de datos perdida";
        break;
      default:
        message = err.message || message;
    }
  } else if (err.status) {
    // Si se definió un código HTTP en el error manualmente
    status = err.status;
    message = err.message;
  } else if (err.message) {
    // Error genérico con mensaje
    message = err.message;
  }

  res.status(status).json({ error: message });
});

// ==============================
// HEALTH CHECK
// ==============================

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "auth-backend" });
});

// ==============================
// RUTAS
// ==============================

app.get('/', (req, res) => {
  res.send('Conexión establecida.')
})

app.use ('/api/usuarios', userRoutes);

app.use('/api/login', loginRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando a http://localhost:${PORT}`)
})