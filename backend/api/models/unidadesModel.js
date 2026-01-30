import pool from '../config/db.js';

export const getUnidades = async () => {
  const [rows] = await pool.query(
    `
      SELECT id, nombre, simbolo
      FROM unidades
      ORDER BY id ASC
    `
  );
  return rows;
};

