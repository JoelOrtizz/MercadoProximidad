import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  getMyNotificaciones,
  postMarkNotificacionLeida,
  postMarkTodasLeidas,
} from "../controllers/notificacionController.js";

const router = express.Router();

router.get("/", requireAuth, getMyNotificaciones);
router.post("/leidas-todas", requireAuth, postMarkTodasLeidas);
router.post("/:id/leida", requireAuth, postMarkNotificacionLeida);

export default router;

