import pool from "../config/db.js";

export async function crearAlerta(id_usuario, id_producto) {
    const [result] = await pool.query(
        `insert into alertas_stock(id_usuario, id_producto) values (?,?)`,
        [id_usuario, id_producto]
    );
    return result;
}

export async function pathAlertas(id, id_usuario) {
    const [result] = await pool.query(
        `UPDATE alertas_stock SET activa = false WHERE id = ? AND id_usuario = ?`,
        [id, id_usuario]
    );
    return result;
}

export async function listarAlertas(id_usuario) {
    const [result] = await pool.query(
        `select * 
        from productos p
        join alertas_stock a on a.id_producto = p.id
        where a.id_usuario = ?`,
        [id_usuario]
    );
    return result;
}

export async function usuariosConAlerta(id_producto) {
    const [result] = await pool.query(
        `select id_usuario
        where id_producto = ?`,
        [id_producto]
    );

    return result;
}