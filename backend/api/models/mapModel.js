import pool from '../config/db.js'

export const updateUserCords = async (userId, cords) => {
    const { lat, lng } = cords;

    const [result] = await pool.query(
        'UPDATE usuarios SET lat = ?, lng = ? WHERE id = ?',
        [lat, lng, userId]
    );

    if (result.affectedRows === 0) {
        const error = new Error('Usuario no encontrado.');
        error.status = 404;
        throw error;
    }

    return result;
}
