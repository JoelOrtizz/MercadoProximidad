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
        const {id} = req.params;

        let {nombre, id_categoria, tipo, stock, precio, descripcion, id_vendedor, duracion_producto, imagen_anterior} = req.body;

        const nombreImagen = req.file ? req.file.filename : imagen_anterior;

        id_categoria = parseInt(id_categoria);
        stock = parseInt(stock);
        precio = parseFloat(precio);

        if (!nombre || !id_categoria || !tipo || !descripcion || !nombreImagen || !id_vendedor || !duracion_producto) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        if (precio === undefined || precio < 0) {
            return res.status(400).json({ message: 'El precio debe ser 0 o superior' });
        }

        if (stock === undefined || stock <= 0) {
            return res.status(400).json({ message: 'El stock debe ser mayor a 0' });
        }

        const result = await putProduct(nombre, id_categoria, tipo, stock, precio, descripcion, nombreImagen, id_vendedor, duracion_producto, id);

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

        const id_vendedor = req.user.id; 

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