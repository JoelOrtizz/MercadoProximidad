import express from 'express'

import { requireAuth } from '../middlewares/requireAuth.js';
import { postAlerta, getAlertas, status } from '../controllers/alertaController.js';

const router = express.Router();

router.get('/', requireAuth, getAlertas);
router.post('/', requireAuth, postAlerta);
router.put('/:id/desactivar', requireAuth, status);

export default router;