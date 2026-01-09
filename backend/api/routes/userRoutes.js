import express from 'express'

import { fetchUser, register, deleteUser, updateUser } from '../controllers/userController.js'
import { requireAuth } from '../middlewares/requireAuth.js';


const router = express.Router();

router.get('/', fetchUser);

router.post('/', register);

router.delete('/me', requireAuth, deleteUser);
router.put('/me', requireAuth, updateUser);
router.delete('/me', requireAuth, deleteUser);
router.put('/me', requireAuth, updateUser);

router.delete('/:id', requireAuth, deleteUser);
router.put('/:id', requireAuth, updateUser)
router.delete('/:id', requireAuth, deleteUser);
router.put('/:id', requireAuth, updateUser)

export default router;

