import express from 'express';

import { requireAuth } from '../middlewares/requireAuth.js';
import { createPuntoEntregaHandler, listMyPuntosEntrega, listPuntosEntregaByUsuarioId } from '../controllers/puntosEntregaController.js';

const router = express.Router();

// Crea un punto de entrega (1 por request)
router.post('/', requireAuth, createPuntoEntregaHandler);

// Lista puntos del usuario autenticado
router.get('/me', requireAuth, listMyPuntosEntrega);

// Lista puntos de un vendedor/usuario por id (publico para compradores)
router.get('/usuario/:id', listPuntosEntregaByUsuarioId);

export default router;
