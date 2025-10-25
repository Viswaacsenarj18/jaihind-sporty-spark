import express from "express";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes (optional — if you want users to see products without login)
router.get("/", getProducts);

// Admin-protected routes
router.post("/", protectAdmin, addProduct);
router.put("/:id", protectAdmin, updateProduct);
router.delete("/:id", protectAdmin, deleteProduct);

export default router;
