import express from 'express'

import { login, logout, register } from '../controllers/userController.js'

const router = express.Router();

// ==============================
// POST USER
// ==============================

router.post('/', register);

router.post('/', login)

router.post('/logout', logout)

export default router;