import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { fetchProducts, updateProduct, insertProduct, deleteProduct } from "../controllers/productController.js";

import { upload } from "../config/multerConfig.js";

const router = express.Router();

router.get('/', fetchProducts);

router.post('/', requireAuth, upload.single('imagen'), insertProduct);

router.put('/:id', requireAuth, upload.single('imagen'), updateProduct );

router.delete('/:id', deleteProduct);

export default router;
