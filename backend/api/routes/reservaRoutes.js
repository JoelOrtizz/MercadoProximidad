import express, { Router } from 'express'

import { requireAuth } from '../middlewares/requireAuth.js'

import { cancelReservation, updateStatus } from '../controllers/reservaController'

const router = express.Router();

router.put('/:id/cancel', requireAuth, cancelReservation);

router.put('/:id/status', requireAuth, updateStatus);