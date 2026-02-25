import pool from '../config/db.js';

const badRequest = (message) => {
    const error = new Error(message);
    error.status = 400;
    return error;
};

export const insertLog = async ({ userId, action, tableName = 'usuarios', data = null }) => {
    if (!userId || !action) {
        throw badRequest('Faltan campos obligatorios para registrar el log.');
    }

    const payload = data == null ? null : JSON.stringify(data);

  try {
    const [result] = await pool.query(
      'INSERT INTO logs (user_id, action, table_name, data) VALUES (?, ?, ?, ?)',
      [userId, action, tableName, payload]
    );
    return result.insertId;
  } catch {
    // Los logs no deben romper el flujo principal (registro/login/update).
    return null;
  }
};

export const getLogs = async ({ startDate = null, endDate = null, userId = null, action = null, limit = 200 }) => {
    const where = [];
    const params = [];

    if (startDate) {
        where.push('created_at >= ?');
        params.push(startDate);
    }

    if (endDate) {
        where.push('created_at <= ?');
        params.push(endDate);
    }

    if (userId) {
        where.push('user_id = ?');
        params.push(userId);
    }

    if (action) {
        where.push('action = ?');
        params.push(action);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const safeLimit = Number.isFinite(Number(limit)) ? Math.min(Math.max(Number(limit), 1), 1000) : 200;

  const [rows] = await pool.query(
    `SELECT log_id, created_at, user_id, action, table_name, data
     FROM logs
     ${whereSql}
     ORDER BY created_at DESC
     LIMIT ${safeLimit}`,
        params
    );

    return rows;
};
