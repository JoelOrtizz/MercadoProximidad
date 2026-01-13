import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { fetchProducts, updateProduct, insertProduct, deleteProduct, fetchProductsByVendedor, fetchProductsByCategoria } from "../controllers/productController.js";

import { upload } from "../config/multerConfig.js";

const router = express.Router();

router.get('/', fetchProducts);

router.get('/me', requireAuth, fetchProductsByVendedor);

router.get('/:id_categoria', fetchProductsByCategoria);

router.post('/', requireAuth, upload.single('imagen'), insertProduct);

router.put('/:id', requireAuth, upload.single('imagen'), updateProduct);

router.delete('/:id', requireAuth, deleteProduct);

export default router;
