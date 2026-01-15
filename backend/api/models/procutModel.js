import pool from "../config/db.js";

export const getProduct = async () => {
    const [result] = await pool.query(
        "select * from productos"
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
