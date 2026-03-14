import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import { sendPasswordResetEmail } from "../utils/sendPasswordResetEmail.js";

/* =========================
   CLOUDINARY CONFIG
========================= */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dzyilb43m",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* =========================
   GENERATE JWT
========================= */

const generateToken = (id, role = "user") => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || "superSecretKey",
    { expiresIn: "30d" }
  );
};

/* =========================
   REGISTER
========================= */

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   LOGIN
========================= */

export const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   UPDATE PROFILE
========================= */

export const updateProfile = async (req, res) => {
  try {

    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   FORGOT PASSWORD
========================= */

export const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    console.log("📝 Forgot password request:", email);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:5173";

    const resetUrl = `${frontendUrl}/reset-password/${token}`;

    console.log("🔗 Reset URL:", resetUrl);

    try {
      await sendPasswordResetEmail({
        email: user.email,
        name: user.name,
        resetUrl,
      });

      console.log("✅ Reset email sent to:", user.email);

    } catch (emailError) {

      console.error("⚠️ Email sending failed:", emailError.message);

    }

    res.status(200).json({
      message: "Password reset link sent to your email",
    });

  } catch (error) {

    console.error("❌ Forgot password error:", error.message);

    res.status(500).json({
      message: "Server error. Please try again.",
    });

  }
};

/* =========================
   RESET PASSWORD
========================= */

export const resetPassword = async (req, res) => {
  try {

    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset link",
      });
    }

    user.password = password;
    user.resetToken = null;
    user.resetTokenExpire = null;

    await user.save();

    res.json({
      message: "Password reset successful",
    });

  } catch (error) {

    console.error("❌ Reset password error:", error.message);

    res.status(500).json({
      message: "Server error. Please try again.",
    });

  }
};

/* =========================
   UPLOAD PROFILE PHOTO
========================= */

export const uploadProfilePhoto = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_photos",
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: result.secure_url },
      { new: true }
    );

    res.json({
      message: "Profile photo uploaded",
      photo: result.secure_url,
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   CHANGE PASSWORD
========================= */

export const changePassword = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password incorrect",
      });
    }

    user.password = req.body.newPassword;

    await user.save();

    res.json({
      message: "Password changed successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   DELETE ACCOUNT
========================= */

export const deleteAccount = async (req, res) => {
  try {

    await User.findByIdAndDelete(req.user.id);

    res.json({
      message: "Account deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   CART
========================= */

export const saveCart = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { cartItems: req.body.cartItems },
      { new: true }
    );

    res.json(user.cartItems);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    res.json(user.cartItems || []);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ADMIN
========================= */

export const getAllUsers = async (req, res) => {
  try {

    const users = await User.find().select("-password");

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};