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
        'select * from reservas where id=?'
        [id]
    );

    return result;
}

export async function fetchReservas() {
    const [result] = await pool.query(
        'select * from reservas'
    );

    return result;
}