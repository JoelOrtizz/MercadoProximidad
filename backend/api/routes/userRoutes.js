import express from 'express'

import { fetchUser, register, deleteUser, updateUser } from '../controllers/userController.js'
<<<<<<< HEAD
||||||| merged common ancestors
import { updateUserById } from '../models/userModel.js';
=======
import { requireAuth } from '../middlewares/requireAuth.js';
>>>>>>> 453993692076ad081ed8260043102b14683ffd63

const router = express.Router();

router.get('/', fetchUser);

router.post('/', register);

router.delete('/me', requireAuth, deleteUser);
router.put('/me', requireAuth, updateUser);

router.delete('/:id', requireAuth, deleteUser);
router.put('/:id', requireAuth, updateUser)

export default router;
