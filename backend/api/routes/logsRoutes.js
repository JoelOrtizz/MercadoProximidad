import express from 'express';
import { fetchLogs } from '../controllers/logsController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = express.Router();

router.get('/', requireAuth, requireRole('admin'), fetchLogs);

export default router;

