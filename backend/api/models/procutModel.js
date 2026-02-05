import pool from "../config/db.js";

// u.nickname se ha añadido a la lista para poder mostrar el campo (nickname -> vendedor) en la tarjeta
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

// 2. AÑADIMOS u.nickname AL GROUP BY
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

    // 3. AÑADIMOS EL JOIN CON USUARIOS AQUÍ para poder traer el campo nickname o cualquier otro de "usuarios"
    let join = " JOIN unidades un ON p.id_unidad = un.id JOIN usuarios u ON p.id_vendedor = u.id";
    
    let select = PRODUCT_SELECT_COLUMNS;
    let groupBy = "";
    let having = "";
    let orderBy = " ORDER BY p.fecha_creacion DESC";

    where.push("p.stock > 0");

    if (category !== undefined && category !== null) {
        where.push("p.id_categoria = ?");
        whereParams.push(category);
    }

    if (text) {
        where.push("(p.nombre LIKE ? OR p.descripcion LIKE ?)");
        const like = `%${text}%`;
        whereParams.push(like, like);
    }

    const hasGeo = Number.isFinite(lat) && Number.isFinite(lng) && Number.isFinite(distance);
    if (hasGeo) {
        // Importante (modo DAW):
        // - Antes solo calculabamos distancia usando puntos_entrega (pe.lat/pe.lng).
        // - Si un vendedor NO tenia puntos de entrega, su producto desaparecia al filtrar por distancia.
        // Solucion simple: LEFT JOIN a puntos_entrega y si no existe, usamos la ubicacion del usuario vendedor (u.lat/u.lng).
        join += " LEFT JOIN puntos_entrega pe ON pe.id_vendedor = p.id_vendedor";

        const latExpr = "COALESCE(pe.lat, u.lat)";
        const lngExpr = "COALESCE(pe.lng, u.lng)";

        // Si no hay coordenadas (ni puntos, ni coords de usuario), ponemos una distancia enorme para que no pase el HAVING.
        const distanceExpr =
            "(CASE " +
            `WHEN ${latExpr} IS NULL OR ${lngExpr} IS NULL THEN 999999 ` +
            "ELSE (6371 * acos(" +
            `cos(radians(?)) * cos(radians(${latExpr})) * cos(radians(${lngExpr}) - radians(?)) +` +
            `sin(radians(?)) * sin(radians(${latExpr}))` +
            ")) END)";

        select = `${PRODUCT_SELECT_COLUMNS}, MIN(${distanceExpr}) AS distance_km`;
        groupBy = ` GROUP BY ${PRODUCT_GROUP_BY_COLUMNS}`;
        having = " HAVING distance_km <= ?";

        selectParams.push(lat, lng, lat);
        havingParams.push(distance);
        orderBy = " ORDER BY distance_km ASC, p.fecha_creacion DESC";
    }

    const whereClause = where.length ? ` WHERE ${where.join(" AND ")}` : "";

    const sql = `SELECT ${select} FROM productos p${join}${whereClause}${groupBy}${having}${orderBy}`;
    return { sql, params: [...selectParams, ...whereParams, ...havingParams] };
};

export const getProduct = async (filters = {}) => {
    const categoryRaw = filters.category ?? filters.id_categoria ?? null;
    const category =
        categoryRaw === undefined || categoryRaw === null || categoryRaw === ""
            ? null
            : Number.parseInt(String(categoryRaw), 10);

    const text = filters.text ? String(filters.text) : "";

    const lat = filters.lat === undefined ? NaN : Number.parseFloat(String(filters.lat));
    const lng = filters.lng === undefined ? NaN : Number.parseFloat(String(filters.lng));
    const distance = filters.distance === undefined ? NaN : Number.parseFloat(String(filters.distance));

    const { sql, params } = buildProductsQuery({
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
