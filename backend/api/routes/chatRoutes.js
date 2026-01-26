import express from 'express';

import { requireAuth } from '../middlewares/requireAuth.js';
import { getChats, getMensajes, postMensaje, postFindOrCreateChat } from '../controllers/chatController.js';

const router = express.Router();

router.get('/', requireAuth, getChats);
router.post('/find-or-create', requireAuth, postFindOrCreateChat);
router.get('/:id/mensajes', requireAuth, getMensajes);
router.post('/:id/mensajes', requireAuth, postMensaje);

export default router;
