import pool from '../config/db.js'

export const getByNick = async(uNick) => {

    const [result] = await pool.query(
        'SELECT * FROM usuarios where nickname=?', 
        [uNick]
    )

    return result[0]

}


export const getById = async(uId) => {

    const [result] = await pool.query(
        'SELECT * FROM usuarios where id=?',
        [uId]
    )

    return result[0]
}


export const getByEmail = async(uEmail) => {

    const [result] = await pool.query(
        'SELECT * FROM usuarios where email=?',
        [uEmail]
    )

    return result[0]
}


export const getUser = async () => {

    const [result] = await pool.query(
        'SELECT nombre, nickname, email, tipo FROM usuarios'
    );

    return result;
}

export const insertUser = async (userData) => {

    const { nombre, nickname, email, contrasena } = userData;

    if (!nombre || !nickname || !email || !contrasena) {
        return res.status(400).json({
            message: "Por favor, rellena todos los campos obligatorios."
        });
    }

    const [result] = await pool.query(
        'INSERT INTO usuarios (nombre, nickname, email, contrasena)VALUES( ?, ?, ?, ?)',
        [nombre, nickname, email, contrasena]
    );

    return result;

}

export const deleteUserById = async (id) => {

    const [result] = await pool.query(
        'DELETE FROM usuarios WHERE id = ?',
        [id]
    );

    return result;
}