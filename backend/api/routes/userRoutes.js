import express from 'express'

import { fetchUser, register, deleteUser, updateUser } from '../controllers/userController.js'
<<<<<<< HEAD
=======
import { requireAuth } from '../middlewares/requireAuth.js';
>>>>>>> 50d0e2d9846590023b7baf40260f89e858062d65

const router = express.Router();

router.get('/', fetchUser);

router.post('/', register);

router.delete('/me', requireAuth, deleteUser);
router.put('/me', requireAuth, updateUser);

router.delete('/:id', requireAuth, deleteUser);
router.put('/:id', requireAuth, updateUser)

export default router;
