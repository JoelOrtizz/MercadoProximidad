import express from 'express'

import { fetchUser, register, deleteUser } from '../controllers/userController.js'

const router = express.Router();

router.get('/', fetchUser);

router.post('/', register);

router.delete('/:id', deleteUser);

export default router;