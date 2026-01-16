import {postReserva, getReserva, getReservaById, cancelReservation, updateStatus} from "../controllers/reservaController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import express from "express";

const router = express.Router();

router.post("/", requireAuth, postReserva);
router.get("/", requireAuth, getReserva);
router.get("/:id", requireAuth, getReservaById);
router.put('/:id/cancel', requireAuth, cancelReservation);
router.put('/:id/status', requireAuth, updateStatus);

export default router;