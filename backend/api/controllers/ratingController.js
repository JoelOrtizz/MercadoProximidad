import {
  createRating,
  ratingsReceived,
  ratingsSent,
} from "../models/ratingModel.js";
import { reservaByUserId } from "../models/reservaModel.js";
import { createNotificacion } from "../models/notificacionModel.js";

import {reservaByUserId} from "../models/reservaModel.js"

export async function postRating(req, res, next) {
  try {
    // recogemos el id del token
    const id_autor = req.user?.id;
    
    // validamos que este autenticado
    if (!id_autor) return res.status(401).json({ error: "No autenticado." });

    // validaciones
    const id_reserva = Number.parseInt(req.params.id, 10);
    const nota_producto = Number.parseInt(String(req.body?.nota_producto), 10);
    const nota_entrega = Number.parseInt(String(req.body?.nota_entrega), 10);
    const nota_negociacion = Number.parseInt(String(req.body?.nota_negociacion), 10);
    const comentario = req.body?.comentario ? String(req.body.comentario) : null;
    if (
      !Number.isFinite(id_reserva) || !Number.isFinite(nota_producto) ||
      !Number.isFinite(nota_entrega) || !Number.isFinite(nota_negociacion)
    ) {
      return res.status(400).json({ error: "Faltan campos obligatorios o formato incorrecto." });
    }
    if (
      nota_producto < 1 || nota_producto > 5 ||
      nota_entrega < 1 || nota_entrega > 5 ||
      nota_negociacion < 1 || nota_negociacion > 5
    ) {
      return res.status(400).json({ error: "Las notas deben ser valores entre 1 y 5." });
    }
    // utilizamos esta funcion para poder sacar el id_destinatario y que el autor no pueda valorarse a si mismo
    const filas = await reservaByUserId(id_reserva, id_autor);
    const reserva = filas[0];
    if (!reserva) {
      return res.status(403).json({ error: "No tienes permiso para valorar esta reserva o no existe." });
    }
    let id_destinatario;

    if (id_autor === reserva.id_comprador) {
      // Soy el COMPRADOR -> Valoro al Vendedor
      id_destinatario = reserva.id_vendedor;
    } else if (id_autor === reserva.id_vendedor) {
      // Soy el VENDEDOR -> Valoro al Comprador
      id_destinatario = reserva.id_comprador;
    } else {
      // Por seguridad, si no soy ninguno (no debería pasar por el filtro anterior, pero por si acaso)
      return res.status(403).json({ error: "No participas en esta reserva." });
    }
    // si el estado estado no esta completado no se puede valorar
    if (reserva.estado !== "completada") {
      return res.status(403).json({ error: "Solo puedes valorar reservas completadas " });
    }

    
    const result = await createRating(id_reserva, id_autor, id_destinatario, nota_producto, nota_entrega, nota_negociacion, comentario);

    // ==============================
    // NOTIFICACION (INICIO): el vendedor recibe una valoración
    // ==============================
    try {
      await createNotificacion(
        id_destinatario,
        "info",
        "Nueva valoracion",
        "Has recibido una nueva valoracion.",
        "/perfil",
        id_reserva
      );
    } catch (e) {
      console.error("No se pudo crear la notificacion de nueva valoracion:", e);
    }
    // ==============================
    // NOTIFICACION (FIN): el vendedor recibe una valoración
    // ==============================

    res.status(201).json({ success: true, id: result.insertId });

  } catch (err) {
    next(err);
  }
}

export async function getRating(req, res, next) {
  try {
    const id_user = Number.parseInt(req.params.id, 10);
    if (!Number.isFinite(id_user)) {
      return res.status(400).json({ error: "Este usaurio no tiene reseñas" });
    }
    const result = await ratingsReceived(id_user);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getRatingSent(req, res, next) {
  try {
    const id_solicitado = Number.parseInt(req.params.id, 10);
    const id_user = req.user.id;
    if (!Number.isFinite(id_solicitado)) {
      return res.status(400).json({ error: "ID de usuario inválido" });
    }
    if (id_solicitado !== id_user){
        return res.status(403).json({error: "Acceso denegado. Solo puedes ver tu propio historial de valoraciones enviadas."})
    }
    const result = await ratingsSent(id_solicitado);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
