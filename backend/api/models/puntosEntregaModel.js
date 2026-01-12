import pool from '../config/db.js';

export const createPuntoEntrega = async ({ vendedorId, lat, lng, descripcion }) => {
  const [result] = await pool.query(
    `
      INSERT INTO puntos_entrega (id_vendedor, lat, lng, descripcion)
      VALUES (?, ?, ?, ?)
    `,
    [vendedorId, lat, lng, descripcion ?? null]
  );

  const [rows] = await pool.query(
    `
      SELECT id, id_vendedor AS id_vendedor, lat, lng, descripcion
      FROM puntos_entrega
      WHERE id = ?
    `,
    [result.insertId]
  );

  return rows[0] || null;
};

export const listPuntosEntregaByVendedor = async (vendedorId) => {
  const [rows] = await pool.query(
    `
      SELECT id, id_vendedor AS id_vendedor, lat, lng, descripcion
      FROM puntos_entrega
      WHERE id_vendedor = ?
      ORDER BY id DESC
    `,
    [vendedorId]
  );

  return rows;
};

