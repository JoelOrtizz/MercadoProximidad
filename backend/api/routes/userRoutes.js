import express from 'express'

import { fetchUser, fetchUserByIdPublic, register, deleteUser, updateUser, updateUserMe } from '../controllers/userController.js'
import { me as authMe } from '../controllers/authController.js'
import { requireAuth } from '../middlewares/requireAuth.js';


const router = express.Router();

router.get('/', fetchUser);

router.post('/', register);

router.get('/me', requireAuth, authMe);
router.delete('/me', requireAuth, deleteUser);
router.put('/me', requireAuth, updateUserMe);

// Perfil publico (para ver datos basicos de otro usuario)
router.get('/:id', fetchUserByIdPublic);

router.delete('/:id', requireAuth, deleteUser);
router.put('/:id', requireAuth, updateUser)

export default router;

