import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import dotenv from "dotenv";
import User from "../models/User.js";

import {
  deleteUser,
  getAllUsers,
  updateProfile,
  uploadProfilePhoto,
  changePassword,
  deleteAccount,
  saveCart,
  getCart,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";

import { protectAdmin } from "../middleware/auth.js";
import { protectUser } from "../middleware/protectUser.js";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "yourSuperSecretKey123";

/* ==============================
   MULTER CONFIG
============================== */

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"), false);
    }
  }
});

/* ==============================
   REGISTER USER
============================== */

router.post("/register", async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "user"
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      message: "Registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
});

/* ==============================
   LOGIN USER
============================== */

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    const match = await user.matchPassword(password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});

/* ==============================
   PASSWORD RESET
============================== */

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

/* ==============================
   PROFILE ROUTES
============================== */

router.patch("/profile/update", protectUser, updateProfile);

router.post(
  "/profile/upload-photo",
  protectUser,
  upload.single("file"),
  uploadProfilePhoto
);

router.patch("/change-password", protectUser, changePassword);
router.delete("/delete-account", protectUser, deleteAccount);

/* ==============================
   CART ROUTES
============================== */

router.post("/cart/save", protectUser, saveCart);
router.get("/cart", protectUser, getCart);

/* ==============================
   ADMIN ROUTES
============================== */

router.get("/users", protectAdmin, getAllUsers);
router.delete("/users/:id", protectAdmin, deleteUser);

/* ==============================
   EXPORT ROUTER
============================== */

export default router;