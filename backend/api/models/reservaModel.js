import pool from "../config/db.js";

export async function insertRerserva(
  id_vendedor,
  id_comprador,
  id_producto,
  cantidad,
  id_punto_entrega,
) {
  const [result] = await pool.query(
    `insert into reservas (id_vendedor, id_comprador, id_producto, cantidad, id_punto_entrega)
      values(?,?,?,?,?)`,
    [id_vendedor, id_comprador, id_producto, cantidad, id_punto_entrega],
  );

  return result;
}

export const findById = async (id) => {
  const [result] = await pool.query(
    `
        SELECT r.*, p.nombre AS producto_nombre, pe.descripcion AS punto_descripcion
        FROM reservas r
        -- Si el producto ya fue borrado, la reserva debe seguir saliendo (historial).
        -- Por eso usamos LEFT JOIN.
        LEFT JOIN productos p ON r.id_producto = p.id
        LEFT JOIN puntos_entrega pe ON r.id_punto_entrega = pe.id
        WHERE r.id = ?
        `,
    [id],
  );

  return result[0] || null;
};

export async function fetchReservas(userId) {
  const [result] = await pool.query(
    `
        SELECT r.*, p.nombre AS producto_nombre, pe.descripcion AS punto_descripcion
        FROM reservas r
        -- Si el producto ya fue borrado, la reserva debe seguir saliendo (historial).
        -- Por eso usamos LEFT JOIN.
        LEFT JOIN productos p ON r.id_producto = p.id
        LEFT JOIN puntos_entrega pe ON r.id_punto_entrega = pe.id
        WHERE r.id_vendedor = ? OR r.id_comprador = ?
        ORDER BY r.fecha_creacion DESC
        `,
    [userId, userId],
  );

  return result;
}

export async function reservaByUserId(id_reserva, id_autor) {
  // Esta consulta sirve para comprobar que el usuario que valora es el COMPRADOR de esa reserva.
  // (En nuestro flujo, el comprador valora al vendedor cuando la reserva está completada.)
  const [result] = await pool.query(
    "select * from reservas where id = ? and id_comprador = ?",
    [id_reserva, id_autor]
  );
  return result;
}

export const updateStatus = async (id, estado) => {
  const [result] = await pool.query("update reservas set estado=? where id=?", [
    estado,
    id,
  ]);

  return result;
};

// AÑADIR 2 ENDPOINTS DE SOLICITAR CANCELACION
export const solicitarCancelacionReserva = async (idReserva, idUsuario) => {
  // Validamos usando el id del comprador
  const [rows] = await pool.query(
    "select id from reservas where id = ? and id_comprador = ? and estado = 'aceptada'",
    [idReserva, idUsuario],
  );

  if (rows.length === 0) {
    throw new Error(
      "No se puede solicitar la cancelación (No eres el comprador o no está aceptada.)",
    );
  }

  // Nuevo estado
  const [result] = await pool.query(
    "update reservas set estado = 'cancelacion_solicitada' where id = ?",
    [idReserva],
  );

  return result;
};

export const responderCancelacion = async (idReserva, idVendedor, decision) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Validamos que el producto sea del vendedor logueado
    const [rows] = await conn.query(
      `SELECT r.id, r.cantidad, r.id_producto 
             FROM reservas r
             JOIN productos p ON r.id_producto = p.id
             WHERE r.id = ? AND p.id_vendedor = ? AND r.estado = 'cancelacion_solicitada'
             FOR UPDATE`,
      [idReserva, idVendedor],
    );

    if (rows.length === 0) {
      throw new Error(
        "No autorizado o la reserva no tiene solicitud pendiente.",
      );
    }

    const reserva = rows[0];

    if (decision === "aceptar") {
      // Aceptar: Poner en cancelada, quitar punto de entrega, devolver stock
      await conn.query(
        "UPDATE reservas SET estado = 'cancelada', id_punto_entrega = NULL WHERE id = ?",
        [idReserva],
      );
      await conn.query("UPDATE productos SET stock = stock + ? WHERE id = ?", [
        reserva.cantidad,
        reserva.id_producto,
      ]);
    } else if (decision === "rechazar") {
      await conn.query("update reservas set estado = 'aceptada' where id = ?", [
        idReserva,
      ]);
    } else {
      throw new Error("Decisión inválida");
    }

    await conn.commit();

    return {
      success: true,
      estado_nuevo: decision === "aceptar" ? "cancelada" : "aceptada",
    };
  } catch (error) {
    await conn.rollback();

    throw error;
  } finally {
    conn.release;
  }
};
