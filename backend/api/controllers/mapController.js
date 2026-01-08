import { updateUserCords } from '../models/mapModel.js';

const badRequest = (message) => {
    const error = new Error(message);
    error.status = 400;
    return error;
}

export const updateCords = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            const error = new Error('No autenticado.');
            error.status = 401;
            throw error;
        }

        const lat = Number(req.body?.lat);
        const lng = Number(req.body?.lng);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            throw badRequest('lat y lng deben ser numeros.');
        }

        if (lat < -90 || lat > 90) {
            throw badRequest('lat fuera de rango (-90..90).');
        }

        if (lng < -180 || lng > 180) {
            throw badRequest('lng fuera de rango (-180..180).');
        }

        await updateUserCords(userId, { lat, lng });
        res.status(200).json({ message: "Coordenadas actualizadas correctamente", lat, lng });
    } catch (error) {
        next(error);
    }
};
