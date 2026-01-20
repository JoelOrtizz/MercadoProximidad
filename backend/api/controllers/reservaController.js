import { insertRerserva, fetchReservas, findById, updateStatus } from "../models/reservaModel.js";
import { getProductById } from "../models/procutModel.js";
import { getPuntoEntregaById } from "../models/puntosEntregaModel.js";

export async function getReserva(req, res, next) {
    try{
        const userId = req.user?.id;
        if (!userId) {
            const error = new Error("No autenticado.");
            error.status = 401;
            throw error;
        }

        const result = await fetchReservas(userId);
        res.status(200).json(result);
    }catch(err){
        next(err);
    }
}

export async function postReserva(req, res, next) {
    try{
        const id_comprador = req.user.id;

        const {id_producto, cantidad, id_punto_entrega} = req.body;

        if (!id_producto || !cantidad || !id_punto_entrega) {
            return res.status(400).json({ error: "Faltan campos obligatorios." });
        }

        // getProductById devuelve un array de filas, extraemos la primera
        const [producto] = await getProductById(id_producto);

        if (!producto) {
            return res.status(404).json({ error: "El producto no existe." });
        }

        if (producto.id_vendedor === id_comprador) {
            return res.status(403).json({ error: "No puedes reservar tus propios productos." });
        }

        if (producto.stock < cantidad) {
            return res.status(400).json({ error: `Stock insuficiente. Solo quedan ${producto.stock}.` });
        }

        const punto = await getPuntoEntregaById(id_punto_entrega);
        if (!punto || punto.id_vendedor !== producto.id_vendedor) {
            return res.status(400).json({ error: "El punto de entrega no es válido para este vendedor." });
        }

        const result = await insertRerserva(producto.id_vendedor, id_comprador, id_producto, cantidad, id_punto_entrega);

        res.status(201).json({
            success: true,
            message: "Reserva solicitada con éxito.",
            reservaId: result.insertId
        });
    }catch(err){
        next(err);
    }
}

export async function getReservaById(req, res, next) {
    try{
        const userId = req.user?.id;
        if (!userId) {
            const error = new Error("No autenticado.");
            error.status = 401;
            throw error;
        }

        const id = Number.parseInt(req.params?.id, 10);
        if (!Number.isFinite(id)){
            return res.status(400).json({message: 'Reserva no encontrada'});
        }

        const reserva = await findById(id);
        if (!reserva) {
            return res.status(404).json({ error: "Reserva no encontrada" });
        }

        if (String(reserva.id_vendedor) !== String(userId) && String(reserva.id_comprador) !== String(userId)) {
            return res.status(403).json({ error: "No autorizado" });
        }

        res.status(200).json(reserva);
    }catch(err){
        next(err);
    }
}


export async function cancelReservation(req, res, next) {

    try {

        if (!req.user || !req.user.id) {
            const error = new Error("No autenticado.");
            error.status = 401;
            return next(error);
        }

        const { id } = req.params;

        const reserva = await findById(id);

        if (!reserva) {
            return res.status(404).json({ error: "Reserva no encontrada" });
        }

        // solo el comprador puede cancelar y solo si está pendiente
        if (String(reserva.id_comprador) !== String(req.user.id)) {
            return res.status(403).json({ error: "No autorizado" });
        }

        if (reserva.estado !== 'pendiente') {
            return res.status(400).json({ error: "Solo se puede cancelar una reserva pendiente" });
        }

        const actualizado = await updateStatus(id, 'cancelada');

        if (actualizado?.affectedRows > 0) {
            return res.json({
                mensaje: 'Reserva cancelada correctamente',
                id_reserva: id,
                nuevo_estado: 'cancelada'
            });

        } else {

            return res.status(400).json({ error: 'No se pudo cancelar la reserva.' })
        }

    } catch (error) {

        next(error);

    }
}

export async function updateEstado(req, res, next) {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const estadosValidos = ['aceptada', 'rechazada', 'completada'];

        if (!estado || !estadosValidos.includes(estado)) {
          return res.status(400).json({ error: "Estado no válido" });
        }

        const reserva = await findById(id);

        if (!reserva) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }

        // solo el vendedor puede aceptar/rechazar/completar
        if (String(reserva.id_vendedor) !== String(req.user?.id)) {
            return res.status(403).json({ error: "No autorizado" });
        }

        const actualizado = await updateStatus(id, estado);

        if (actualizado?.affectedRows > 0) {
            return res.json({
                mensaje: `Estado actualizado a ${estado}`,
                id_reserva: id,
                nuevo_estado: estado
            });
        } else {
            return res.status(400).json({ error: 'No se pudo actualizar' });
        }

    } catch (error) {
        next(error);
    }
}
