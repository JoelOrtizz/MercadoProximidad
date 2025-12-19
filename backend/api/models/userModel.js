import pool from '../config/db.js'

export const insertUser = async (userData) => {

    const { nombre, nickname, email, contrasena } = userData

    const [result] = await pool.query(
        'INSERT INTO usuarios (nombre, nickname, email, contrasena)VALUES( ?, ?, ?, ?)',
        [nombre, nickname, email, contrasena]
    );

    return result;

}

export const getByNick = async(uNick) => {

    const [result] = await pool.query(
        'SELECT * FROM usuarios where nickname=?', 
        [uNick]
    )

    return result

}


export const getById = async(uId) => {

    const [result] = await pool.query(
        'SELECT * FROM usuarios where id=?',
        [uId]
    )

    return result
}


export const getByEmail = async(uEmail) => {

    const [result] = await pool.query(
        'SELECT * FROM usuarios where email=?',
        [uEmail]
    )

    return result
}