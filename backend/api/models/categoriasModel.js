import pool from "../config/db.js";

export const getCategorias = async () => {
    const [result] = await pool.query(
        "select * from categorias"
    );
    return result;
}