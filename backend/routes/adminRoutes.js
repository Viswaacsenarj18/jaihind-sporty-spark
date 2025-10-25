import express from "express";
import { loginAdmin } from "../controllers/adminController.js"; // Only loginAdmin export
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin login
router.post("/login", loginAdmin);

// Optional: get admin profile (protected)
router.get("/profile", protectAdmin, (req, res) => {
  res.json(req.admin);
});

export default router;
