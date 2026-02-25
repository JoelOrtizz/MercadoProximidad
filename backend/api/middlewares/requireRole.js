import { getById } from '../models/userModel.js';

export function requireRole(...rolesPermitidos) {
    return async (req, res, next) => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({ error: 'No autenticado' });
            }

            const user = await getById(req.user.id);
            if (!user) {
                return res.status(401).json({ error: 'No autenticado' });
            }

            if (!rolesPermitidos.includes(user.tipo)) {
                return res.status(403).json({ error: 'Acceso denegado: rol insuficiente' });
            }

            req.userRole = user.tipo;
            return next();
        } catch (err) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }
    };
}
