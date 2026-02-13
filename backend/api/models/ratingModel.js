import pool from "../config/db.js";

export async function createRating(id_reserva, id_autor, id_destinatario, nota_producto, nota_entrega, nota_negociacion, comentario) {
  const [result] = await pool.query(`
      insert into valoraciones (id_reserva, id_autor, id_destinatario, nota_producto, nota_entrega, nota_negociacion, comentario) values (?, ?, ?,?,?,?,?)`,
    [id_reserva, id_autor, id_destinatario, nota_producto, nota_entrega, nota_negociacion, comentario]
  );
  return result;
}


export async function ratingsReceived(id) {
  const [result] = await pool.query(
    `SELECT 
        v.*, 
        u.nombre, 
        u.nickname,
        p.nombre AS producto_nombre,   
        p.imagen AS producto_imagen,
        r.id_comprador,
        r.id_vendedor
      FROM valoraciones v
      JOIN usuarios u ON v.id_autor = u.id
      JOIN reservas r ON v.id_reserva = r.id     
      JOIN productos p ON r.id_producto = p.id   
      WHERE v.id_destinatario = ?
      ORDER BY v.fecha_creacion DESC`, 
    [id]
  );
  return result;
}
export async function ratingsSent(id) {
  const [result] = await pool.query(
    `SELECT 
        v.*, 
        u.nombre, 
        u.nickname,
        p.nombre AS producto_nombre,   
        p.imagen AS producto_imagen,
        r.id_vendedor,
        r.id_comprador
    FROM valoraciones v
    JOIN usuarios u ON v.id_destinatario = u.id
    JOIN reservas r ON v.id_reserva = r.id
    JOIN productos p ON r.id_producto = p.id
    WHERE v.id_autor = ?
    ORDER BY v.fecha_creacion DESC`,
    [id]
  );
  return result;
}

export async function ratingAverageReceived(id) {
  const [rows] = await pool.query(
    `
    SELECT
      AVG((v.nota_producto + v.nota_entrega + v.nota_negociacion) / 3) AS media,
      COUNT(*) AS total
    FROM valoraciones v
    WHERE v.id_destinatario = ?
    `,
    [id]
  );

  const row = rows && rows[0] ? rows[0] : {};
  return {
    media: row && row.media != null ? Number(row.media) : null,
    total: row && row.total != null ? Number(row.total) : 0,
  };
}

