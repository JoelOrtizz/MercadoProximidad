import { cambiarEstado, crearIncidencia, incidenciaComprador, incidenciaVendedor } from "../models/incidenciasModel.js";
import { reservaByUserId } from "../models/reservaModel.js";
import { createNotificacion } from "../models/notificacionModel.js";

export async function postIncidencia(req, res, next) {
    try {
        const id_autor = req.user?.id;
        if (!id_autor) {
            const error = new Error("Inicia sesion");
            error.status = 401;
            throw error;
        }
        if (!req.file) {
            return res.status(400).json({ message: 'La imagen es obligatoria' });
        }
        // recoge la imagen
        const imagen_prueba = req.file.filename;
        const {id_reserva} = req.params;
        const { tipo_problema, descripcion, estado } = req.body;     
        const filas = await reservaByUserId(id_reserva, id_autor);
        const reserva = filas[0];
        if (!reserva) {
            return res.status(403).json({ error: "No tienes permiso para poner una incidencia en esta reserva o no existe." });
        }
        const id_destinatario = reserva.id_vendedor;
        const result = await crearIncidencia(id_reserva, id_autor, id_destinatario, tipo_problema, descripcion, imagen_prueba, estado);
        try {
            await createNotificacion(
                id_destinatario,
                "info",
                "Nueva Incidencia",
                "Has recibido una incidencia",
                "/perfil",
                id_reserva
            );
        } catch (e) {
            console.error("No se pudo crear la notificacion del nuevo reporte :", e);
        }
        res.status(201).json({ success: true, id: result.insertId });

    } catch (err) {
        next(err);
    }
}

export async function incidenciasRecibidas(req, res, next) {
    try{
        const id = req.user?.id;
        if (!id) {
            const error = new Error("Inicia sesion");
            error.status = 401;
            throw error;
        }
        const result = await incidenciaComprador(id);
        res.status(200).json(Array.isArray(result) ? result : []);
    }catch(err){
        next(err);
    }
}

export async function incidenciasEnviadas(req, res, next) {
    try {
        const id = req.user?.id;
        if (!id) {
            const error = new Error("Inicia sesion");
            error.status = 401;
            throw error;
        }
        const result = await incidenciaVendedor(id);
        res.status(200).json(Array.isArray(result) ? result : []);
    } catch (err) {
        next(err);
    }
}

export async function putIncidencia(req, res, next) {
    try{
        const {id} = req.params;
        const estado = req.body;
        const result = await cambiarEstado(id, estado);
        res.status(201).json({message: "estado cambiado"})
    }catch(err){
        next(err);
    }
}