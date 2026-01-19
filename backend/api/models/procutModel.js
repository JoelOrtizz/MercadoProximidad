import pool from "../config/db.js";

export const getProduct = async () => {
    const [result] = await pool.query(
        "select * from productos"
    );
    return result;
}

export async function getProductById(id) {
    const [result] = await pool.query(
        "select * from productos where id = ?",
        [id]
    );
    return result;
}

export const getProductByVendedor = async(id_vendedor) =>{
    const [result] = await pool.query(
        "select * from productos where id_vendedor = ? order by fecha_creacion desc",
        [id_vendedor]
    )

    return result;
}

export const getProductByCategoria = async(id_categoria) =>{
    const [result] = await pool.query(
        "select * from productos where id_categoria = ? order by fecha_creacion desc",
        [id_categoria]
    );

    return result;
}

export const getProductByPrecio = async(precio_min,precio_max) => {
    const [result] = await pool.query(
        "select * from productos where precio>=? and precio<=? order by fecha_creacion desc",
        [precio_min,precio_max]
    );

    return result;
}

export const getProductByUbicacion = async (lat, lng, radioKm = 10) => {
    const [result] = await pool.query(
        `
        SELECT p.*, u.*,
        (
            6371 * acos(
                cos(radians(?)) *
                cos(radians(u.lat)) *
                cos(radians(u.lng) - radians(?)) +
                sin(radians(?)) *
                sin(radians(u.lat))
            )
        ) AS distancia
        FROM productos p
        JOIN usuarios u ON p.id_vendedor = u.id
        HAVING distancia <= ?
        ORDER BY distancia ASC
        `,
        [lat, lng, lat, radioKm]
    );

    return result;
};



export const postProduct = async (nombre, id_categoria, tipo, stock, precio, descripcion, imagen, id_vendedor) => {
        
    const [result] = await pool.query(
       ` INSERT INTO productos (nombre, id_categoria, tipo, stock, precio, 
        descripcion, imagen, id_vendedor) VALUES (?, ?, ?, ?, ?, ?, ?, ?) `, 
        [nombre, id_categoria, tipo, stock, precio, descripcion, imagen, id_vendedor]
    );

    return result;
};

export const putProduct = async (nombre, id_categoria, tipo, stock, precio, descripcion, imagen, id, id_vendedor) => {
    const [result] = await pool.query(
        `UPDATE productos SET nombre = ?, id_categoria = ?, tipo = ?, stock = ?, precio = ?, descripcion = ?, 
        imagen = ?
        WHERE id = ? and id_vendedor = ?`,
        [nombre, id_categoria, tipo, stock, precio, descripcion, imagen, id, id_vendedor]
    );

    return result;
}

export const deleteProductById = async(id) => {
    const result = await pool.query(
        `delete from productos where id = ?`,
        [id]
    );

    return result;
}
