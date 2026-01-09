import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { fetchProducts, updateProduct, insertProduct, deleteProduct } from "../controllers/productController.js";
const router = express.Router();

router.get('/', fetchProducts, requireAuth);

router.post('/', insertProduct, requireAuth);

router.put('/:id', updateProduct, requireAuth);

router.delete('/:id', deleteProduct, requireAuth);

export default router;
