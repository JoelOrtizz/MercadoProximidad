import { getProductById } from '../models/procutModel.js';
import { crearAlerta, listarAlertas, pathAlertas } from '../models/alertaModel.js';


export async function postAlerta(req, res, next) {
    try {
        const userId = req.user?.id;
        const productId = req.body.id_producto;

        const producto = await getProductById(productId);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        const stock = producto[0].stock;
        if (stock > 0) return res.status(400).json({ error: 'El producto ya tiene stock' })
        const result = await crearAlerta(userId, productId);
        res.status(201).json({ message: 'Alerta creada' })
    } catch (err) {
        return next(err);
    }
}

export async function getAlertas(req, res, next) {
    try {
        const userId = req.user?.id;
        const result = await listarAlertas(userId);
        res.status(200).json(Array.isArray(result) ? result : []);
    } catch (err) {
        return err;
    }
}

export async function status(req, res, next) {
    try {
        const userId = req.user?.id;
        const alertId = req.params.id;
        const result = await pathAlertas(alertId, userId);
        res.status(200).json(Array.isArray(result) ? result : []);
    } catch (err) {
        return err;
    }
}