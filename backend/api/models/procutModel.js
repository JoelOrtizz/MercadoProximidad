import pool from "../config/db.js";

// guardamos el select
const PRODUCT_SELECT_COLUMNS = `
    p.id,
    p.nombre,
    p.id_categoria,
    p.id_unidad,
    p.stock,
    p.precio,
    p.descripcion,
    p.imagen,
    p.id_vendedor,
    u.nickname, 
    p.fecha_creacion,
    p.duracion_producto,
    un.nombre AS unidad_nombre,
    un.simbolo AS unidad_simbolo
`;

// guardamos el group by
const PRODUCT_GROUP_BY_COLUMNS = `
    p.id,
    p.nombre,
    p.id_categoria,
    p.id_unidad,
    p.stock,
    p.precio,
    p.descripcion,
    p.imagen,
    p.id_vendedor,
    u.nickname,
    p.fecha_creacion,
    p.duracion_producto,
    un.nombre,
    un.simbolo
`;

const buildProductsQuery = ({ category, text, lat, lng, distance }) => {
    const where = [];
    const whereParams = [];
    const selectParams = [];
    const havingParams = [];

    // productos con unidades
    let join = `JOIN unidades un ON p.id_unidad = un.id 
                JOIN usuarios u ON p.id_vendedor = u.id`;
    // productos con usuarios

    let select = PRODUCT_SELECT_COLUMNS;
    let groupBy = "";
    let having = "";
    let orderBy = " ORDER BY p.fecha_creacion DESC";
    // solo mostrar productos stock
    where.push("p.stock > 0");
    // si el usuario selecciona una categoria
    if (category !== undefined && category !== null) {
        // hace push a los arrays declarados al principio
        where.push("p.id_categoria = ?");
        whereParams.push(category);
    }
    // si el usuario pone texto
    if (text) {
        // añade al array
        where.push("(p.nombre LIKE ? OR p.descripcion LIKE ?)");
        const like = `%${text}%`;
        whereParams.push(like, like); // se inserta 2 veces, una para nombre y otra para descripcion
    }
    const hasGeo = Number.isFinite(lat) && Number.isFinite(lng) && Number.isFinite(distance);
    if (hasGeo) {
        // añadimos al join de antes la union de puntos de entrega con el producto
        join += " JOIN puntos_entrega pe ON pe.id_vendedor = p.id_vendedor";
        // formula
        const distanceExpr =
            "(6371 * acos(" +
            "cos(radians(?)) * cos(radians(pe.lat)) * cos(radians(pe.lng) - radians(?)) +" +
            "sin(radians(?)) * sin(radians(pe.lat))" +
            "))";
        // agregamos al select la distancia
        select = `${PRODUCT_SELECT_COLUMNS}, MIN(${distanceExpr}) AS distance_km`;
        groupBy = ` GROUP BY ${PRODUCT_GROUP_BY_COLUMNS}`;
        having = " HAVING distance_km <= ?";
        // insertamos los parametros para la formula
        selectParams.push(lat, lng, lat);
        havingParams.push(distance);
        orderBy = " ORDER BY distance_km ASC, p.fecha_creacion DESC"; // cambiamos el orden, primero la distancia luego la fecha
    }
    // si hay condiciones en el where unelas con and si no dejalo vacío
    // este if resuelve el problema de querer buscar la categoria y nombre al mismo tiempo al poner el and
    const whereClause = where.length ? ` WHERE ${where.join(" AND ")}` : "";
    // construye la sentencia final conectando todas las partes
    const sql = `SELECT ${select} FROM productos p${join}${whereClause}${groupBy}${having}${orderBy}`;
    // añade a la sentencia sql los datos que hemos ido recogiendo
    return { sql, params: [...selectParams, ...whereParams, ...havingParams] };
};


// utiliza el {} como salvavidas para que pueda ejecutarse la funcion sin pasarle nada
export const getProduct = async (filters = {}) => {
    // guardamos el id de la categoria, a lo mejor llega llamandose category o id_categoria
    const categoryRaw = filters.category ?? filters.id_categoria ?? null;
    // nos aseguramos que sea numero
    const category =
        categoryRaw === undefined || categoryRaw === null || categoryRaw === ""
            ? null
            : Number.parseInt(String(categoryRaw), 10);
    // si viene texto lo convertimos en string si no, lo dejamos vacio
    const text = filters.text ? String(filters.text) : "";
    // converrtimos a decimales, si no viene el dato lo dejamos NaN
    const lat = filters.lat === undefined ? NaN : Number.parseFloat(String(filters.lat));
    const lng = filters.lng === undefined ? NaN : Number.parseFloat(String(filters.lng));
    const distance = filters.distance === undefined ? NaN : Number.parseFloat(String(filters.distance));
    // llamamos a la funcion que hicimos antes
    const { sql, params } = buildProductsQuery({
        // solo pasamos las categprias si es numero finito
        category: Number.isFinite(category) ? category : null,
        text,
        lat,
        lng,
        distance,
    });
    const [result] = await pool.query(sql, params);
    return result;
}

// 4. ACTUALIZAMOS LAS DEMÁS FUNCIONES GET PARA INCLUIR EL JOIN Y LOS CAMPOS
export async function getProductById(id) {
    const [result] = await pool.query(
        `
        SELECT p.*, un.nombre AS unidad_nombre, un.simbolo AS unidad_simbolo, u.nickname AS vendedor_nickname
        FROM productos p
        JOIN unidades un ON p.id_unidad = un.id
        JOIN usuarios u ON p.id_vendedor = u.id
        WHERE p.id = ?
        `,
        [id]
    );
    return result;
}

export const getProductByVendedor = async(id_vendedor) =>{
    const [result] = await pool.query(
        `
        SELECT p.*, un.nombre AS unidad_nombre, un.simbolo AS unidad_simbolo, u.nickname AS vendedor_nickname
        FROM productos p
        JOIN unidades un ON p.id_unidad = un.id
        JOIN usuarios u ON p.id_vendedor = u.id
        WHERE p.id_vendedor = ?
        ORDER BY p.fecha_creacion DESC
        `,
        [id_vendedor]
    )
    return result;
}

export const getProductByCategoria = async(id_categoria) =>{
    const [result] = await pool.query(
        `
        SELECT p.*, un.nombre AS unidad_nombre, un.simbolo AS unidad_simbolo, u.nickname AS vendedor_nickname
        FROM productos p
        JOIN unidades un ON p.id_unidad = un.id
        JOIN usuarios u ON p.id_vendedor = u.id
        WHERE p.id_categoria = ?
        ORDER BY p.fecha_creacion DESC
        `,
        [id_categoria]
    );
    return result;
}

export const getProductByPrecio = async(precio_min,precio_max) => {
    const [result] = await pool.query(
        `
        SELECT p.*, un.nombre AS unidad_nombre, un.simbolo AS unidad_simbolo, u.nickname AS vendedor_nickname
        FROM productos p
        JOIN unidades un ON p.id_unidad = un.id
        JOIN usuarios u ON p.id_vendedor = u.id
        WHERE p.precio >= ? AND p.precio <= ?
        ORDER BY p.fecha_creacion DESC
        `,
        [precio_min,precio_max]
    );
    return result;
}

export const getProductByUbicacion = async (lat, lng, radioKm = 10) => {
    const [result] = await pool.query(
        `
        SELECT p.*, u.nickname AS vendedor_nickname, un.nombre AS unidad_nombre, un.simbolo AS unidad_simbolo,
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
        JOIN unidades un ON p.id_unidad = un.id
        HAVING distancia <= ?
        ORDER BY distancia ASC
        `,
        [lat, lng, lat, radioKm]
    );
    return result;
};

// --- LAS FUNCIONES DE ESCRITURA (INSERT/UPDATE/DELETE) SE MANTIENEN IGUAL ---
export const postProduct = async (nombre, id_categoria, id_unidad, stock, precio, descripcion, imagen, id_vendedor) => {
    const [result] = await pool.query(
       `INSERT INTO productos (nombre, id_categoria, id_unidad, stock, precio, 
        descripcion, imagen, id_vendedor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
        [nombre, id_categoria, id_unidad, stock, precio, descripcion, imagen, id_vendedor]
    );
    return result;
};

export const putProduct = async (nombre, id_categoria, id_unidad, stock, precio, descripcion, imagen, id, id_vendedor) => {
    const [result] = await pool.query(
        `UPDATE productos SET nombre = ?, id_categoria = ?, id_unidad = ?, stock = ?, precio = ?, descripcion = ?, 
        imagen = ?
        WHERE id = ? and id_vendedor = ?`,
        [nombre, id_categoria, id_unidad, stock, precio, descripcion, imagen, id, id_vendedor]
    );
    return result;
};

export const deleteProductById = async(id) => {

    // Validar que el producto no está reservado
    const [reservas] = await pool.query(
        `SELECT id FROM reservas 
         WHERE id_producto = ? 
         AND estado IN ('pendiente', 'aceptada', 'cancelacion_solicitada')`, 
        [id]
    );

    if (reservas.length > 0){
        throw new Error("Está reservado");
    }

    const result = await pool.query(
        `delete from productos where id = ?`,
        [id]
    );
    return result;
}
