import express from 'express'

import { fetchCategorias } from '../controllers/categoriasController.js'

const router = express.Router();

router.get('/', fetchCategorias);

export default router;