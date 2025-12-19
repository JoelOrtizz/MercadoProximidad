import express from 'express'

import { register } from '../controllers/userController.js'

const router = express.Router();

// ==============================
// POST USER
// ==============================

router.post('/', register);

export default router;