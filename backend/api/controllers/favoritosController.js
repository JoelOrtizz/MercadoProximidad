
import { insertFavorito, selectFavoritos, eliminarFavorito, verificarFavorito } from '../models/favoritosModel.js';

export async function getFavoritos(req, res, next) {
    try{
        const userId = req.user?.id;
        const rows = await selectFavoritos(userId);
        return res.json(rows);
    }catch(err){
        return next(err);
    }
}
export async function postFavoritos(req, res, next) {
    try {
        const userId = req.user?.id;
        const {id} = req.params;
        const result = await insertFavorito(userId, id);
        if (result.affectedRows === 0){
            return res.status(409).json({ message: "Ya está en favoritos" });
        }
        res.status(201).json({ message: "Añadido a favoritos" });
    } catch (err) {
        return next(err);
    }
}
export async function deleteFavoritos(req, res, next) {
    try {
        const userId = req.user?.id;
        const {id} = req.params;
        const result = await eliminarFavorito(userId, id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Favorito no encontrado" });
        }
        res.status(200).json({ message: "Favorito eliminado correctamente" });
    } catch (err) {
        return next(err);
    }
}
export async function verifarFavoritos(req, res, next) {
    try {
        if (!req.user || !req.user.id) {
            return res.json({ esFavorito: false });
        }
        const userId = req.user.id;
        const { id } = req.params;
        const result = await verificarFavorito(userId, id);
        const count = result[0]['count(*)'] || 0;
        res.json({ esFavorito: count > 0 });
    } catch (err) {
        return next(err);
    }
}