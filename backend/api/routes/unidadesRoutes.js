import express from 'express';

import { fetchUnidades } from '../controllers/unidadesController.js';

const router = express.Router();

router.get('/', fetchUnidades);

export default router;

