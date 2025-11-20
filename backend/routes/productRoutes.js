import express from "express";
import {
  getProducts,
  getProductsByCategory,
  addProduct,
  updateProduct,
  updateSizeStock,
  deleteProduct,
} from "../controllers/productController.js";

import { upload } from "../middleware/upload.js";

const router = express.Router();

// ✅ Public - fetch all products
router.get("/", getProducts);

// ✅ Public - fetch products by category
router.get("/category/:category", getProductsByCategory);

// ✅ Admin - Add product
router.post("/", upload.single("imageFile"), addProduct);

// ✅ Admin - Update size stock
router.put("/size-stock", updateSizeStock);

// ✅ Admin - Update product
router.put("/:id", upload.single("imageFile"), updateProduct);

// ✅ Admin - Delete product
router.delete("/:id", deleteProduct);

export default router;

