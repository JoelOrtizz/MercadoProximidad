import {
  countNotificacionesNoLeidas,
  listNotificacionesByUsuario,
  markNotificacionLeida,
  markTodasLeidas,
} from "../models/notificacionModel.js";

export async function getMyNotificaciones(req, res, next) {
  try {
    const id_usuario = req.user && req.user.id ? req.user.id : null;
    if (!id_usuario) return res.status(401).json({ error: "No autenticado." });

    const items = await listNotificacionesByUsuario(id_usuario);
    const unreadCount = await countNotificacionesNoLeidas(id_usuario);

    res.status(200).json({ items, unreadCount });
  } catch (err) {
    next(err);
  }
}

export async function postMarkNotificacionLeida(req, res, next) {
  try {
    const id_usuario = req.user && req.user.id ? req.user.id : null;
    if (!id_usuario) return res.status(401).json({ error: "No autenticado." });

    const id_notificacion = Number.parseInt(req.params.id, 10);
    if (!Number.isFinite(id_notificacion)) {
      return res.status(400).json({ error: "ID de notificación inválido." });
    }

    const result = await markNotificacionLeida(id_usuario, id_notificacion);
    if (!result || !result.affectedRows) {
      return res.status(404).json({ error: "Notificación no encontrada." });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function postMarkTodasLeidas(req, res, next) {
  try {
    const id_usuario = req.user && req.user.id ? req.user.id : null;
    if (!id_usuario) return res.status(401).json({ error: "No autenticado." });

    const result = await markTodasLeidas(id_usuario);
    res.status(200).json({ success: true, updated: result && result.affectedRows ? result.affectedRows : 0 });
  } catch (err) {
    next(err);
  }
}
