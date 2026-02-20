import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { mostrarFavoritos,añadirFavoritos } from "../controllers/favoritosController.js";

const router = express.Router();

router.get('/',requireAuth,mostrarFavoritos);

router.post('/', requireAuth,añadirFavoritos);

export default router;