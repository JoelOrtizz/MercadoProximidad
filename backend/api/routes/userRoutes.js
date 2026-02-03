import express from 'express'

import { fetchUser, register, deleteUser, updateUser, updateUserMe } from '../controllers/userController.js'
import { me as authMe } from '../controllers/authController.js'
import { requireAuth } from '../middlewares/requireAuth.js';


const router = express.Router();

router.get('/', fetchUser);

router.post('/', register);

router.get('/me', requireAuth, authMe);
router.delete('/me', requireAuth, deleteUser);
router.put('/me', requireAuth, updateUserMe);


router.delete('/:id', requireAuth, deleteUser);
router.put('/:id', requireAuth, updateUser)

export default router;

