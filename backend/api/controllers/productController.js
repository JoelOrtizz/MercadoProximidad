import {getProduct, postProduct, putProduct, deleteProductById} from '../models/procutModel.js'

export async function fetchProducts(req, res, next) {
  try {
    const result = await getProduct();
    res.status(200).json(result);
  } catch (error) {
    next(error);
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

        const productoId = req.body.id;
        if (!productoId) {
            return res.status(400).json({ message: 'Error: No se ha proporcionado el ID del producto.' });
        }

        let { nombre, id_categoria, tipo, stock, precio, descripcion, duracion_producto, imagen_anterior } = req.body;

        const nombreImagen = req.file ? req.file.filename : imagen_anterior;

        id_categoria = parseInt(id_categoria);
        stock = parseInt(stock);
        precio = parseFloat(precio);

        if (!nombre || !id_categoria || !tipo || !descripcion || !duracion_producto) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        if (isNaN(precio) || precio < 0) {
            return res.status(400).json({ message: 'El precio debe ser mayor o igual a 0' });
        }

        if (isNaN(stock) || stock < 0) { // Permitimos 0 si está agotado, pero no negativos.
            return res.status(400).json({ message: 'El stock no puede ser negativo' });
        }

        const result = await putProduct(nombre, id_categoria, tipo, stock, precio, descripcion, nombreImagen, duracion_producto, productoId, vendedorId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ message: "Producto actualizado correctamente" });
    } catch(error) {
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

        let { nombre, categoria, tipo, stock, precio, descripcion, duracion } = req.body;

        const id_categoria = parseInt(categoria); 
        const stockInt = parseInt(stock);
        const precioFloat = parseFloat(precio);

        const id_vendedor = req.user?.id;
        if (!id_vendedor) {
          const error = new Error("Inicia sesion");
          error.status = 401;
          throw error;
        }

        if (!nombre || isNaN(id_categoria) || !tipo || !descripcion || !duracion) {
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
            duracion 
        );
        
        res.status(201).json({
            message: 'Producto creado correctamente',
            id: result.insertId,
            data: result
        });

    } catch(error) {
        console.error(error);
        next(error);
    }
}

export async function deleteProduct(req, res, next) {
    try{
        const {id} = req.params;
        const result = await deleteProductById(id);
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json({ message: "Producto eliminado correctamente" });
    }catch(error){
        next(error);
    }
}