import pool from "../config/db.js";

export async function listNotificacionesByUsuario(id_usuario) {
  const [rows] = await pool.query(
    `
      SELECT
        n.id,
        n.id_usuario,
        n.tipo,
        n.titulo,
        n.mensaje,
        n.url,
        n.id_reserva,
        n.leida,
        n.fecha_creacion
      FROM notificaciones n
      WHERE n.id_usuario = ?
      ORDER BY n.fecha_creacion DESC
    `,
    [id_usuario]
  );

  return rows;
}

export async function countNotificacionesNoLeidas(id_usuario) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS total FROM notificaciones WHERE id_usuario = ? AND leida = 0`,
    [id_usuario]
  );
  return rows && rows[0] ? rows[0].total : 0;
}

export async function markNotificacionLeida(id_usuario, id_notificacion) {
  const [result] = await pool.query(
    `UPDATE notificaciones SET leida = 1 WHERE id = ? AND id_usuario = ?`,
    [id_notificacion, id_usuario]
  );
  return result;
}

export async function markTodasLeidas(id_usuario) {
  const [result] = await pool.query(
    `UPDATE notificaciones SET leida = 1 WHERE id_usuario = ? AND leida = 0`,
    [id_usuario]
  );
  return result;
}

// Utilidad para crear notificaciones desde otras features (reservas, chats, etc.)
export async function createNotificacion(id_usuario, tipo, titulo, mensaje, url, id_reserva) {
  const tipoFinal = tipo ? String(tipo) : "";
  if (!tipoFinal) {
    const error = new Error("Falta el tipo de notificación");
    error.status = 400;
    throw error;
  }

  // Tipos permitidos (mismo listado que el ENUM de la BD)
  if (
    tipoFinal !== "reserva_pendiente" &&
    tipoFinal !== "reserva_aceptada" &&
    tipoFinal !== "reserva_cancelada" &&
    tipoFinal !== "mensaje_nuevo" &&
    tipoFinal !== "valoracion_pendiente" &&
    tipoFinal !== "info"
  ) {
    const error = new Error("Tipo de notificación inválido");
    error.status = 400;
    throw error;
  }

  const tituloFinal = titulo ? String(titulo) : null;
  const mensajeFinal = mensaje ? String(mensaje) : null;
  const urlFinal = url ? String(url) : null;
  const idReservaFinal = Number.isFinite(id_reserva) ? id_reserva : null;

  const [result] = await pool.query(
    `
      INSERT INTO notificaciones (id_usuario, tipo, titulo, mensaje, url, id_reserva, leida)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `,
    [id_usuario, tipoFinal, tituloFinal, mensajeFinal, urlFinal, idReservaFinal]
  );

  return result;
}
