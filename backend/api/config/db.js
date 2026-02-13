import mysql from 'mysql2/promise'
import 'dotenv/config'

function toNumber(value, fallback) {
    const n = Number(value)
    if (!Number.isFinite(n)) return fallback
    return n
}

// creamos la conexion (local o docker). En docker NO es "localhost", será el nombre del servicio (ej: db)
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: toNumber(process.env.MYSQL_PORT, 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE || 'terretashop_db',
    waitForConnections: true,
    connectionLimit: toNumber(process.env.MYSQL_CONNECTION_LIMIT, 10),
    queueLimit: 0
})

export default pool
