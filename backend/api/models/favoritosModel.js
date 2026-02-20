import pool from "../config/db.js";

export async function addFavoritos(id_usuario,id_producto){
    const [result] = await pool.query(
        `INSERT into favoritos (id_usuario,id_producto) values (?,?)`,
        [id_usuario,id_producto]
    );
    return result;
}

export async function removeFavoritos(id_usuario,id_producto){
    const [result] = await pool.query(
        `DELETE from favoritos where id_usuario=? and id_producto=?`,
        [id_usuario,id_producto]
    );
    return result;
}

export async function listFavoritos(id_usuario){
    const [result] = await pool.query(
        `SELECT p.* from favoritos f
        join productos p ON p.id=f.id_producto
        where f.id_usuario=?`,
        [id_usuario]
    );
    return result;
}