import pool from '../config/db.js';

export async function insertLog(user_id, action, table_name, data) {
    const [result] = await pool.query(
        `insert into logs (user_id, action, table_name, data) values (?, ?, ?, ?)`,
        [user_id, action, table_name, data]
    )
    return result;
}

export async function getLogs() {
    const [result] = await pool.query(
        `select * from logs `
    )
    return result;
}

export async function getLogsUserId(id){
    const [result] = await pool.query(
        `select * from logs where user_id = ?`,
        [id]
    )
    return result;
}

