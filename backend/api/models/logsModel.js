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

        return null;
    }
};

export const getLogs = async ({ startDate = null, endDate = null, userId = null }) => {

    const [rows] = await pool.query(
        `SELECT log_id, created_at, user_id, action, table_name, data
        FROM logs
        WHERE (? IS NULL OR created_at >= ?)
        AND (? IS NULL OR created_at <= ?)
        AND (? IS NULL OR user_id = ?)
        ORDER BY created_at DESC`,
        [startDate, startDate, endDate, endDate, userId, userId]
    );

    return rows;
};
