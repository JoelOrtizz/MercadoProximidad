import { findById, updateStatus } from "../models/reservaModel";

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

        const actualizado = await updateStatus(id, 'cancelada');

        if (actualizado) {
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

export async function updateStatus(req, res, next) {

    try {

        const { id } = req.params;
        const { nuevoEstado } = req.body;

        const estados = ['pendiente', 'aceptada', 'vendida', 'cancelada'];

        if (!nuevoEstado || !estados.includes(nuevoEstado)) {
            return res.status(400).json({ error: 'Estado no válido' })
        }

        const reserva = findById(id);

        if (!reserva) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }

        const actualizado = await updateStatus(id, newStatus);

        if (actualizado) {
            return res.json({
                mensaje: `Estado actualizado a ${newStatus}`,
                id_reserva: id,
                nuevo_estado: newStatus
            });
        } else {
            return res.status(400).json({ error: 'No se pudo actualizar' });
        }

    } catch (error) {
        next(error);
    }
}