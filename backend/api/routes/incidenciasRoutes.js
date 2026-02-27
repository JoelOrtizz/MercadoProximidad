import express from 'express'
import { requireAuth } from "../middlewares/requireAuth.js";
import { postIncidencia, incidenciasRecibidas, incidenciasEnviadas, putIncidencia } from '../controllers/incidenciasController.js';
import { upload } from "../middlewares/multerConfig.js";
const router = express.Router();

router.get('/mis-reclamaciones', requireAuth, incidenciasEnviadas);
router.get('/recibidas', requireAuth, incidenciasRecibidas);
router.post('/:id_reserva', requireAuth, upload.single('imagen_prueba'), postIncidencia);
router.put('/vista/:id', requireAuth, putIncidencia);

export default router;
