import express from 'express'

import { fetchUser, register, deleteUser, updateUser } from '../controllers/userController.js'

const router = express.Router();

router.get('/', fetchUser);

router.post('/', register);

router.delete('/:id', deleteUser);

router.put('/:id',updateUser)

export default router;