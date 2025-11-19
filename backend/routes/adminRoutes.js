import express from "express";
import { loginAdmin } from "../controllers/adminController.js"; // Only loginAdmin export
import { protectAdmin } from "../middleware/auth.js";
import Admin from "../models/Admin.js";

const router = express.Router();

// Admin login
router.post("/login", loginAdmin);

// Optional: get admin profile (protected)
router.get("/profile", protectAdmin, (req, res) => {
  res.json(req.admin);
});

// 🔍 DEBUG: Check if admin exists (remove in production)
router.get("/check-admin", async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    const admins = await Admin.find({}, { password: 0 }); // Don't return passwords
    
    res.json({
      success: true,
      totalAdmins: adminCount,
      admins: admins,
      message: adminCount > 0 ? "✅ Admin(s) found" : "❌ No admin accounts found"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking admin",
      error: error.message
    });
  }
});

export default router;
