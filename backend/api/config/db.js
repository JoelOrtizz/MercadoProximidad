import mysql from 'mysql2/promise'
import 'dotenv/config'

const pool = mysql.createPool({
    host: 'localhost',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'terretashop_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

export default pool