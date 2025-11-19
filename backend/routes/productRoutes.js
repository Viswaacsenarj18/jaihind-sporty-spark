import express from "express";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { upload } from "../middleware/upload.js"; // Multer upload middleware

const router = express.Router();

// ✅ Public - fetch products
router.get("/", getProducts);

// ✅ TEMP: No auth while testing
router.post("/", upload.single("imageFile"), addProduct);
router.put("/:id", upload.single("imageFile"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
