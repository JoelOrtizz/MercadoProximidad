import pool from '../config/db.js';

export async function insertFavorito(id_usuario, id_producto) {
    const [result] = await pool.query(
        `insert into favoritos(id_usuario, id_producto) values (?, ?)`,
        [id_usuario, id_producto]
    );
    return result;
}

export async function eliminarFavorito(id_usuario, id_producto) {
    const [result] = await pool.query(
        `delete from favoritos where id_usuario = ? and id_producto = ?`,
        [id_usuario, id_producto]
    );
    return result;
}

export async function verificarFavorito(id_usuario, id_producto) {
    const [result] = await pool.query(
        `SELECT count(*) FROM favoritos WHERE id_usuario = ? AND id_producto = ?`,
        [id_usuario, id_producto]
    );
    return result;
}


export async function selectFavoritos(id_usuario) {
    const [result] = await pool.query(
        `select p.*, f.id as id_favorito
        from productos p
        join favoritos f on f.id_producto = p.id
        where f.id_usuario = ?`,
        [id_usuario]
    );
    return result;
}