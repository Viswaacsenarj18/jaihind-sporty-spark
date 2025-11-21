import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import multer from "multer";
import User from "../models/User.js";
import { deleteUser, getAllUsers, updateProfile, uploadProfilePhoto, changePassword, deleteAccount, saveCart, getCart } from "../controllers/authController.js";
import { protectAdmin } from "../middleware/auth.js";
import { protectUser } from "../middleware/protectUser.js";

dotenv.config();

// Setup multer for file upload (memory storage for Cloudinary)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'), false);
    }
  }
});

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "yourSuperSecretKey123";

console.log("🔐 AUTH ROUTES - JWT_SECRET loaded:", JWT_SECRET?.substring(0, 10) + "...");

/* ✅ USER REGISTRATION */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: "Email already exists" });

    // Password will be hashed by pre-save hook in User model
    const user = await User.create({ name, email, password, role: "user" });
    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.json({ 
      success: true, 
      message: "✅ Registered successfully!",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          gender: user.gender || "",
          profilePicture: user.profilePicture || "",
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ✅ USER / ADMIN LOGIN (One page login) */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    // Use matchPassword method from User schema
    const match = await user.matchPassword(password);
    if (!match) return res.status(400).json({ success: false, message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.json({
      success: true,
      message: "✅ Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        gender: user.gender || "",
        profilePicture: user.profilePicture || "",
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ✅ GET ALL USERS (Protected - Admin Only) */
router.get("/users", protectAdmin, getAllUsers);

/* ✅ DELETE USER (Protected - Admin Only) */
router.delete("/users/:id", protectAdmin, deleteUser);

/* ✅ UPDATE USER PROFILE */
router.patch("/profile/update", protectUser, updateProfile);

/* ✅ GET USER PROFILE */
router.get("/profile", protectUser, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ✅ UPLOAD PROFILE PHOTO */
router.post("/profile/upload-photo", protectUser, upload.single("file"), uploadProfilePhoto);

/* ✅ CHANGE PASSWORD */
router.patch("/change-password", protectUser, changePassword);

/* ✅ DELETE ACCOUNT */
router.delete("/delete-account", protectUser, deleteAccount);

/* ✅ SAVE CART */
router.post("/cart/save", protectUser, saveCart);

/* ✅ GET CART */
router.get("/cart", protectUser, getCart);

export default router;
