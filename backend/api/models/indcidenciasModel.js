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
        `SELECT 
            i.*, 
            u.nombre, 
            u.nickname,
            p.nombre AS producto_nombre,   
            p.imagen AS producto_imagen,
            r.*
        FROM incidencias i
        JOIN usuarios u ON i.id_comprador = u.id
        JOIN reservas r ON i.id_reserva = r.id     
        JOIN productos p ON r.id_producto = p.id   
        WHERE i.id_comprador = ?
        ORDER BY v.fecha_creacion DESC`,
        [id]
    );
    return result;
}

export async function incidenciaVendedor(id) {
    const [result] = await pool.query(
        `SELECT 
            i.*,
            u.nombre,
            u.nickname,
            p.nombre AS producto_nombre,
            p.imagen AS producto_imagen,
            r.*
        FROM incidencias i
        JOIN usuarios u ON i.vendedor = u.id
        JOIN reservas r ON i.id_reserva = r.id     
        JOIN productos p ON r.id_producto = p.id   
        WHERE i.id_vendedor = ?
        ORDER BY v.fecha_creacion DESC`,
        [id]
    );
    return result;
}