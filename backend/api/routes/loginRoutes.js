import express from 'express'

import { login, logout, me } from '../controllers/authController.js'
import { requireAuth } from '../middlewares/requireAuth.js'

const router = express.Router();

router.post('/', login)

router.post('/logout', logout)

export default router
