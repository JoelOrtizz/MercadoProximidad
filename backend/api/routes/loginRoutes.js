import express from 'express'

import { login, logout, me  } from '../controllers/authController.js'

const router = express.Router();

router.post('/', login)

router.post('/logout', logout)

router.get('/me', me)

export default router