import pool from '../config/db.js'

export const findById = async (id) => {

    const [result] = await pool.query(
        'select * from reservas where id=?'
        [id]
    );

    return result;
}

export const updateStatus = async (id, nuevoEstado) => {

    const [result] = await pool.query(
        'update reservas set status=? where id=?'
        [id, nuevoEstado]
    );

    return result;
}