import express from 'express'

import { register, deleteUser  } from '../controllers/userController.js'

const router = express.Router();

// ==============================
// POST USER
// ==============================

router.post('/', register);

router.delete('/:id', deleteUser);

export default router;