import { getProduct, postProduct, putProduct, deleteProductById, getProductByVendedor, getProductByCategoria, getProductByPrecio,getProductByUbicacion } from '../models/procutModel.js'

export async function fetchProducts(req, res, next) {
    try {
        const result = await getProduct();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function fetchProductsByVendedor(req, res, next) {
    try {
        const vendedorIdRaw = req.user?.id;
        const id_vendedor = Number.parseInt(String(vendedorIdRaw), 10);

        if (!Number.isFinite(id_vendedor)) {
            const error = new Error("No autenticado.");
            error.status = 401;
            return next(error);
        }

        const result = await getProductByVendedor(id_vendedor);
        res.status(200).json(Array.isArray(result) ? result : []);
    } catch (error) {
        next(error)
    }
}

export async function fetchProductsByCategoria(req, res, next) {
    try {
        const categoriaIdRaw = req.params.id_categoria;
        const id_categoria = Number.parseInt(String(categoriaIdRaw), 10);

        if (!Number.isFinite(id_categoria)) {
            const error = new Error("No existe.");
            error.status = 401;
            return next(error);
        }

        const result = await getProductByCategoria(id_categoria);
        res.status(200).json(Array.isArray(result) ? result : []);
    } catch (error) {
        next(error)
    }
}


export async function fetchProductsByPrecio(req, res, next) {
    try {
        const { precio_min, precio_max } = req.params;

        const min = parseInt(precio_min, 10);
        const max = parseInt(precio_max, 10);

        if (isNaN(min) || isNaN(max)) {
            return res.status(400).json({ error: 'Precios inválidos' });
        }

        const result = await getProductByPrecio(precio_min, precio_max);
        res.status(200).json(Array.isArray(result) ? result : [])
    } catch (error) {
        next(error)
    }
}

export async function fetchProductsByUbicacion(req,res,next){
    try{
        const { lat,lng } = req.params;

        const result = await getProductByUbicacion(lat,lng);
        res.status(200).json(Array.isArray(result) ? result : [])
    }catch(error){
        next(error)
    }
}

export async function updateProduct(req, res, next) {
    try {
        if (!req.user || !req.user.id) {
            const error = new Error("No autenticado.");
            error.status = 401;
            return next(error);
        }
        const vendedorId = req.user.id;

        const productoId = Number.parseInt(req.params.id, 10);
        if (!Number.isFinite(productoId)) {
            return res.status(400).json({ message: 'Error: ID de producto invalido.' });
        }

        let { nombre, tipo, stock, precio, descripcion, imagen_anterior } = req.body;
        const id_categoria_raw = req.body?.id_categoria;

        const nombreImagen = req.file ? req.file.filename : imagen_anterior;

        const id_categoria =
            id_categoria_raw === undefined || id_categoria_raw === null || id_categoria_raw === ""
                ? null
                : Number.parseInt(id_categoria_raw, 10);

        if (id_categoria !== null && !Number.isFinite(id_categoria)) {
            return res.status(400).json({ message: 'id_categoria invalido' });
        }

        stock = parseInt(stock);
        precio = parseFloat(precio);

        if (!nombre || !tipo || !descripcion) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        if (isNaN(precio) || precio < 0) {
            return res.status(400).json({ message: 'El precio debe ser mayor o igual a 0' });
        }

        if (isNaN(stock) || stock < 0) { // Permitimos 0 si está agotado, pero no negativos.
            return res.status(400).json({ message: 'El stock no puede ser negativo' });
        }

        const result = await putProduct(
            nombre,
            id_categoria,
            tipo,
            stock,
            precio,
            descripcion,
            nombreImagen,
            productoId,
            vendedorId
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado o no autorizado' });
        }

        res.status(200).json({ message: "Producto actualizado correctamente" });
    } catch (error) {
        next(error);
    }
}

export async function insertProduct(req, res, next) {
    try {
        console.log("Datos recibidos del HTML:", req.body); // Chivato para ver qué llega

        if (!req.file) {
            return res.status(400).json({ message: 'La imagen es obligatoria' });
        }
        const nombreImagen = req.file.filename;

        let { nombre, categoria, tipo, stock, precio, descripcion } = req.body;

        const id_categoria = parseInt(categoria);
        const stockInt = parseInt(stock);
        const precioFloat = parseFloat(precio);

        const id_vendedor = req.user?.id;
        if (!id_vendedor) {
            const error = new Error("Inicia sesion");
            error.status = 401;
            throw error;
        }

        if (!nombre || isNaN(id_categoria) || !tipo || !descripcion) {
            return res.status(400).json({ message: 'Faltan campos de texto o la categoría está vacía' });
        }

        if (isNaN(precioFloat) || precioFloat < 0) {
            return res.status(400).json({ message: 'El precio debe ser un número positivo' });
        }

        if (isNaN(stockInt) || stockInt < 0) {
            return res.status(400).json({ message: 'El stock debe ser un número positivo' });
        }

        const result = await postProduct(
            nombre,
            id_categoria,
            tipo,
            stockInt,
            precioFloat,
            descripcion,
            nombreImagen,
            id_vendedor,
        );

        res.status(201).json({
            message: 'Producto creado correctamente',
            id: result.insertId,
            data: result
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
}

export async function deleteProduct(req, res, next) {
    try {
        const { id } = req.params;
        const result = await deleteProductById(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        next(error);
    }
}
