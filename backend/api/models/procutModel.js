import pool from "../config/db.js";

export const getProduct = async () => {
    const [result] = await pool.query(
        "select * from productos"
    );
    return result;
}

export const postProduct = async (nombre, id_categoria, tipo, stock, precio, descripcion, imagen, id_vendedor, duracion_producto) => {
    
    const [result] = await pool.query(
       ` INSERT INTO productos (nombre, id_categoria, tipo, stock, precio, 
        descripcion, imagen, id_vendedor, duracion_producto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) `, 
        [nombre, id_categoria, tipo, stock, precio, descripcion, imagen, id_vendedor, duracion_producto]
    );

    return result;
};

export const putProduct = async(nombre, id_categoria, tipo, stock, precio, descripcion, imagen, id_vendedor, duracion_producto, id) => {
    const [result] = await pool.query(
        `UPDATE productos SET nombre = ?, id_categoria = ?, tipo = ?, stock = ?, precio = ?, descripcion = ?, 
        imagen = ?, duracion_producto = ? 
        WHERE id = ? and id_vendedor = ?`,
        [nombre, id_categoria, tipo, stock, precio, descripcion, imagen, id_vendedor, duracion_producto, id]
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