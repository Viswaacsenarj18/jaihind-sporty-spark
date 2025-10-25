import express from "express";
import { loginAdmin } from "../controllers/adminController.js"; // Only loginAdmin

const router = express.Router();

// Admin login
router.post("/login", loginAdmin);

export default router;
