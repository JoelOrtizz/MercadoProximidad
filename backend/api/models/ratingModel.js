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
    `select v.*, u.nombre, u.nickname
    from valoraciones v
    join usuarios u on v.id_autor = u.id
    where v.id_destinatario=?`,
    [id]
  );
  return result;
}
export async function ratingsSent(id) {
  const [result] = await pool.query(
    `select v.*, u.nombre, u.nickname
    from valoraciones v
    join usuarios u on v.id_destinatario = u.id
    where v.id_autor=?`,
    [id]
  );
  return result;
}