import { findById, updateStatus } from "../models/reservaModel";

export async function cancelReservation(req, res) {

    try {

        if (!req.user || !req.user.id) {
            const error = new Error("No autenticado.");
            error.status = 401;
            return next(error);
        }

        const {id} = req.params;

        const reserva = await findById(id);

        if (!reserva) {
            return res.status(404).json({error: "Reserva no encontrada"});
        }

        const actualizado = await updateStatus(id, 'cancelada');

        if (actualizado) {
            return res.json({
                mensaje: 'Reserva cancelada correctamente',
                id_reserva: id,
                nuevo_estado: 'cancelada'
            });

        } else {

            return res.status(400).json({error: 'No se pudo cancelar la reserva.'})
        }

    }catch(error) {

        console.error(error);
        return res.status(500).json({error: 'Error interno del servidor'})

    }
}

export async function updateStatus(req, res) {

    try {

        const {id} = req.params;
        const {nuevoEstado} = req.body;

        const estados = ['pendiente', 'aceptada', 'vendida', 'cancelada'];

        if (!nuevoEstado || !estados.includes(nuevoEstado)){
            return res.status(400).json({error: 'Estado no válido'})
        }

         

    }catch (error) {

    }
}