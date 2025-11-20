import express from "express";
import {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { upload } from "../middleware/upload.js";
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

// ✅ Public - Get all categories
router.get("/", getCategories);

// ✅ Public - Get single category
router.get("/:id", getCategory);

// ✅ Admin - Add category (Protected - admin only)
router.post("/", protectAdmin, upload.single("imageFile"), addCategory);

// ✅ Admin - Update category (Protected - admin only)
router.put("/:id", protectAdmin, upload.single("imageFile"), updateCategory);

// ✅ Admin - Delete category (Protected - admin only)
router.delete("/:id", protectAdmin, deleteCategory);

export default router;
