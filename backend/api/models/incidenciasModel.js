import pool from "../config/db.js";

export async function crearIncidencia(id_reserva, id_autor, id_destinatario, tipo_problema, descripcion, imagen_prueba, estado) {
    const [result] = await pool.query(
        `insert into incidencias(id_reserva, id_autor, id_destinatario, tipo_problema, descripcion, imagen_prueba, estado)
        values (?, ?, ?, ?, ? ,?, ?)`,
        [id_reserva, id_autor, id_destinatario, tipo_problema, descripcion, imagen_prueba, estado]
    );
    return result;
}

export async function incidenciaComprador(id) {
    const [result] = await pool.query(
        `select * from incidencias where id_destinatario = ?`,
        [id]
    );
    return result;
}

export async function incidenciaVendedor(id) {
    const [result] = await pool.query(
        `select * from incidencias where id_autor = ?`,
        [id]
    );
    return result;
}

export async function cambiarEstado(id, estado) {
    const [result] = await pool.query(
        `update incidencias set estado = ? where id = ?`,
        [id, estado]
    )
    return result;
}