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
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

// ✅ Public - fetch all products
router.get("/", getProducts);

// ✅ Public - fetch products by category
router.get("/category/:category", getProductsByCategory);

// ✅ Admin - Add product (Protected - admin only)
router.post("/", protectAdmin, upload.single("imageFile"), addProduct);

// ✅ Admin - Update size stock (Protected - admin only)
router.put("/size-stock", protectAdmin, updateSizeStock);

// ✅ Admin - Update product (Protected - admin only)
router.put("/:id", protectAdmin, upload.single("imageFile"), updateProduct);

// ✅ Admin - Delete product (Protected - admin only)
router.delete("/:id", protectAdmin, deleteProduct);

export default router;

