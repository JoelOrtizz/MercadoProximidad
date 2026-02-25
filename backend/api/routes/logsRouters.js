import express from 'express'

import { requireAuth, requireAdmin } from '../middlewares/requireAuth.js'
import { getLog, getLogId } from '../controllers/logsController.js';
const router = express.Router();

router.get('/', requireAuth, requireAdmin, getLog);
router.get('/user/:id', requireAuth, requireAdmin, getLogId);

export default router;