import pool from '../config/db.js'

export const insertUser = async (userData) => {

    const { nombre, nickname, email, contrasena } = userData

    const [result] = await pool.query(
        'INSERT INTO usuarios (nombre, nickname, email, contrasena)VALUES( ?, ?, ?, ?)',
        [nombre, nickname, email, contrasena]
    );

    return result;

}