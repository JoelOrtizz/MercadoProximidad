import express from 'express';

import { requireAuth } from '../middlewares/requireAuth.js';
import { updateCords } from '../controllers/mapController.js';

const router = express.Router();

// Guarda coordenadas del usuario autenticado
router.patch('/me', requireAuth, updateCords);

export default router;

