import pool from '../config/db.js'

export async function insertRerserva(id_vendedor, id_comprador, id_producto, cantidad, id_punto_entrega) {
    const [result] = await pool.query(
      `insert into reservas (id_vendedor, id_comprador, id_producto, cantidad, id_punto_entrega)
      values(?,?,?,?,?)`,
      [id_vendedor, id_comprador, id_producto, cantidad, id_punto_entrega]
    );

    return result;
}

export const findById = async (id) => {
    const [result] = await pool.query(
        `
        SELECT r.*, p.nombre AS producto_nombre, pe.descripcion AS punto_descripcion
        FROM reservas r
        JOIN productos p ON r.id_producto = p.id
        LEFT JOIN puntos_entrega pe ON r.id_punto_entrega = pe.id
        WHERE r.id = ?
        `,
        [id]
    );

    return result[0] || null;
}

export async function fetchReservas(userId) {
    const [result] = await pool.query(
        `
        SELECT r.*, p.nombre AS producto_nombre, pe.descripcion AS punto_descripcion
        FROM reservas r
        JOIN productos p ON r.id_producto = p.id
        LEFT JOIN puntos_entrega pe ON r.id_punto_entrega = pe.id
        WHERE r.id_vendedor = ? OR r.id_comprador = ?
        ORDER BY r.fecha_creacion DESC
        `,
        [userId, userId]
    );

    return result;
}

export const updateStatus = async (id, estado) => {

    const [result] = await pool.query(
        'update reservas set estado=? where id=?',
        [estado, id]
    );

    return result;
}

export async function reservaByUserId(id, id_user) {
    const [result] = await pool.query(
        `select id_vendedor, id_comprador, estado
        from reservas
        where id = ? and (id_vendedor = ? or id_comprador=?)`,
        [id, id_user, id_user]
    );

    return result;
}