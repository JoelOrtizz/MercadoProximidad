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

    // Si hay reservas antiguas (canceladas / rechazadas / completadas) que todavia guardan un punto,
    // lo quitamos aqui para que no bloqueen el borrado por la foreign key.
    await conn.query(
      `
        UPDATE reservas r
        JOIN puntos_entrega p ON p.id = r.id_punto_entrega
        SET r.id_punto_entrega = NULL
        WHERE p.id_vendedor = ?
          AND r.estado IN ('rechazada', 'cancelada', 'completada')
      `,
      [vendedorId]
    );

    // Si hay reservas activas (pendiente/aceptada/cancelacion_solicitada) que usan puntos,
    // esos puntos NO se pueden borrar. En ese caso, hacemos un "reemplazo parcial":
    // - mantenemos los puntos bloqueados
    // - borramos los puntos que NO estén bloqueados
    // - insertamos los nuevos puntos, evitando duplicar los bloqueados
    const [lockedIdRows] = await conn.query(
      `
        SELECT DISTINCT r.id_punto_entrega AS id_punto_entrega
        FROM reservas r
        JOIN puntos_entrega p ON p.id = r.id_punto_entrega
        WHERE p.id_vendedor = ?
          AND r.id_punto_entrega IS NOT NULL
          AND r.estado IN ('pendiente', 'aceptada', 'cancelacion_solicitada')
      `,
      [vendedorId]
    );

    const lockedIds = (Array.isArray(lockedIdRows) ? lockedIdRows : [])
      .map((r) => Number(r?.id_punto_entrega))
      .filter((n) => Number.isFinite(n));

    let lockedPoints = [];
    if (lockedIds.length) {
      const [rows] = await conn.query(
        `
          SELECT id, lat, lng, descripcion
          FROM puntos_entrega
          WHERE id_vendedor = ?
            AND id IN (?)
        `,
        [vendedorId, lockedIds]
      );
      lockedPoints = Array.isArray(rows) ? rows : [];
    }

    const roundCoord = (v) => {
      const n = Number(v);
      if (!Number.isFinite(n)) return '';
      return n.toFixed(6);
    };

    const lockedKeySet = new Set(
      lockedPoints.map((p) => `${roundCoord(p?.lat)},${roundCoord(p?.lng)}`)
    );

    // Quitamos del insert los puntos que ya existen y están bloqueados (para no duplicarlos)
    const toInsert = [];
    for (let i = 0; i < puntos.length; i++) {
      const p = puntos[i];
      const key = `${roundCoord(p?.lat)},${roundCoord(p?.lng)}`;
      if (key && lockedKeySet.has(key)) continue;
      toInsert.push(p);
    }

    // Maximo 5 en total (bloqueados + nuevos a insertar)
    const totalFinal = lockedIds.length + toInsert.length;
    if (totalFinal > 5) {
      const error = new Error(
        `No se puede guardar: tienes ${lockedIds.length} punto(s) bloqueado(s) por reservas y estás intentando guardar ${toInsert.length} nuevo(s). Maximo 5 en total.`
      );
      error.status = 400;
      throw error;
    }

    // Borra solo los puntos NO bloqueados
    if (lockedIds.length) {
      await conn.query(
        `DELETE FROM puntos_entrega WHERE id_vendedor = ? AND id NOT IN (?)`,
        [vendedorId, lockedIds]
      );
    } else {
      await conn.query(`DELETE FROM puntos_entrega WHERE id_vendedor = ?`, [vendedorId]);
    }

    if (toInsert.length === 0) {
      await conn.commit();
      const [rows] = await conn.query(
        `
          SELECT id, id_vendedor AS id_vendedor, lat, lng, descripcion
          FROM puntos_entrega
          WHERE id_vendedor = ?
          ORDER BY id DESC
        `,
        [vendedorId]
      );
      return { inserted: 0, rows };
    }

    const valuesToInsert = toInsert.map((p) => [vendedorId, p.lat, p.lng, p.descripcion ?? null]);

    const [insertResult] = await conn.query(
      `
        INSERT INTO puntos_entrega (id_vendedor, lat, lng, descripcion)
        VALUES ?
      `,
      [valuesToInsert]
    );

    const inserted = Number(insertResult.affectedRows) || valuesToInsert.length;

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
