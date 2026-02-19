import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { getFavoritos, deleteFavoritos, postFavoritos, verifarFavoritos } from '../controllers/favoritosController.js';
const router = express.Router();

router.get('/', requireAuth,  getFavoritos);
router.post('/:id/producto', requireAuth, postFavoritos);
router.delete('/eliminar/:id', requireAuth, deleteFavoritos);
router.get('/:id', requireAuth,  verifarFavoritos);

export default router;