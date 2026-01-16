import {postReserva, getReserva, getReservaById} from "../controllers/reservaController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import express from "express";

const router = express.Router();

router.post("/", requireAuth, postReserva);
router.get("/", requireAuth, getReserva);
router.get("/:id", requireAuth, getReservaById);

export default router;