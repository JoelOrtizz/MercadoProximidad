import { insertRerserva, fetchReservas, findById } from "../models/reservaModel.js";
import { getProductById } from "../models/procutModel.js";
import { getPuntoEntregaById } from "../models/puntosEntregaModel.js";

export async function getReserva(req, res, next) {
    try{
        const result = await fetchReservas();
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
        const id = req.params;

        if (!id){
            res.status(400).json({message: 'Reserva no encontrada'});
        }
        const result = await findById(id);
        res.status(200).json(result);
    }catch(err){
        next(err);
    }
}

