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
    try{
        const {id} = req.params;

        const {nombre, id_categoria, tipo, stock, precio, descripcion, imagen, id_vendedor, duracion_producto} = req.body;

        if (!nombre || !id_categoria || !tipo || !descripcion || !imagen || !id_vendedor || !duracion_producto) {
            return res.status(400).json({ message: 'Faltan campos de texto obligatorios' });
        }

        if (precio === undefined || precio < 0) {
            return res.status(400).json({ message: 'El precio debe ser 0 o superior' });
        }

        if (stock === undefined || stock <= 0) {
            return res.status(400).json({ message: 'El stock debe ser mayor a 0' });
        }
        const result = await putProduct(nombre, id_categoria, tipo, stock, precio, descripcion, imagen, id_vendedor, duracion_producto, id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json({ message: "Producto actualizado correctamente" });
    }catch(error){
        next(error);
    }
}

export async function insertProduct(req, res, next) {
    try{
        const {nombre, id_categoria, tipo, stock, precio, descripcion, imagen, id_vendedor, duracion_producto} = req.body;
        if (!nombre || !id_categoria || !tipo || !descripcion || !imagen || !id_vendedor || !duracion_producto) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }
        if (precio === undefined || precio < 0) {
            return res.status(400).json({ message: 'El precio debe ser 0 o superior' });
        }

        if (stock === undefined || stock <= 0) {
            return res.status(400).json({ message: 'El stock debe ser mayor a 0' });
        }
        const result = await postProduct(nombre, id_categoria, tipo, stock, precio, descripcion, imagen, id_vendedor, duracion_producto);
        
        res.status(201).json({
            message: 'Producto creado correctamente',
            id: result.insertId,
            data: result
        });
    }catch(error){
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