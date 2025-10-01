import express from 'express';

const router = express.Router();

import { createProducts, deleteProduct, getProducts, updateProduct } from '../controller/product.controller.js';

router.post("/",createProducts);
router.put("/:id", updateProduct)
router.delete("/:id", deleteProduct)
router.get("/", getProducts)

export default router;

