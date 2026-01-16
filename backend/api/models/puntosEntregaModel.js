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

export const countPuntosEntregaByVendedor = async (vendedorId) => {
  const [rows] = await pool.query(
    `
      SELECT COUNT(*) AS total
      FROM puntos_entrega
      WHERE id_vendedor = ?
    `,
    [vendedorId]
  );

  const total = Number(rows?.[0]?.total);
  return Number.isFinite(total) ? total : 0;
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

export const createPuntosEntregaBulk = async ({ vendedorId, puntos }) => {
  const values = puntos.map((p) => [vendedorId, p.lat, p.lng, p.descripcion ?? null]);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Semantica "reemplazar": borra los existentes y crea los nuevos.
    await conn.query(`DELETE FROM puntos_entrega WHERE id_vendedor = ?`, [vendedorId]);

    if (values.length === 0) {
      await conn.commit();
      return { inserted: 0, rows: [] };
    }

    const [insertResult] = await conn.query(
      `
        INSERT INTO puntos_entrega (id_vendedor, lat, lng, descripcion)
        VALUES ?
      `,
      [values]
    );

    const inserted = Number(insertResult.affectedRows) || values.length;

    const [rows] = await conn.query(
      `
        SELECT id, id_vendedor AS id_vendedor, lat, lng, descripcion
        FROM puntos_entrega
        WHERE id_vendedor = ?
        ORDER BY id DESC
      `,
      [vendedorId]
    );

    await conn.commit();
    return { inserted, rows };
  } catch (err) {
    try {
      await conn.rollback();
    } catch {
      // ignore
    }
    throw err;
  } finally {
    conn.release();
  }
};

export async function getPuntoEntregaById(id) {
  const [result] = await pool.query(
    "select * from puntos_entrega where id = ?",
    [id]
  );
  return result[0];
}
