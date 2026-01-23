import pool from '../config/db.js'
import bcrypt from 'bcrypt'

// error
const badRequest = (message) => {
    const error = new Error(message);
    error.status = 400;
    return error;
}

export const getByNick = async (uNick) => {

    const [result] = await pool.query(
        'SELECT * FROM usuarios where nickname=?',
        [uNick]
    )

    return result[0]

}


export const getById = async (uId) => {

    const [result] = await pool.query(
        'SELECT * FROM usuarios where id=?',
        [uId]
    )

    return result[0]
}


export const getByEmail = async (uEmail) => {

    const [result] = await pool.query(
        'SELECT * FROM usuarios where email=?',
        [uEmail]
    )

    return result[0]
}


export const getUser = async () => {

    const [result] = await pool.query(
        'SELECT id,nombre, nickname, email, tipo FROM usuarios'
    );

    return result;
}

export const insertUser = async ( nombre, nickname, email, telef, contrasena) => {

    if (!nombre || !nickname || !email || !telef || !contrasena) {
        throw badRequest("Por favor, rellena todos los campos obligatorios.");
        throw badRequest("Por favor, rellena todos los campos obligatorios.");
    }

    // Encriptación de la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const [result] = await pool.query(
        'INSERT INTO usuarios (nombre, nickname, email, telef, contrasena)VALUES( ?, ?, ?, ?, ?)',
        [nombre, nickname, email, telef, hashedPassword]
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


export const updateUserById = async (id, nombre, nickname, email, telef, contrasena) => {

    if (!nombre || !nickname || !email || !telef || !contrasena) {
        throw badRequest("Por favor, rellena todos los campos obligatorios.");
        throw badRequest("Por favor, rellena todos los campos obligatorios.");
    }

    // Encriptación de la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const [result] = await pool.query(
        `UPDATE usuarios 
         SET nombre = ?, nickname = ?, email = ?, telef = ?, contrasena = ?
         WHERE id = ?`,
        [nombre, nickname, email, telef, hashedPassword, id]
    );

    return result;
}


export const updateUserMyself = async (id,nombre,email,telef) => {
    
    if (!nombre || !email || !telef ){
        throw badRequest("Por favor, rellena todos los campos")
    }

    const [result] = await pool.query(
        `Update usuarios
        set nombre=?,email=?,telef=? where id=?`,
        [nombre,email,telef,id]
    )

    return result;
}