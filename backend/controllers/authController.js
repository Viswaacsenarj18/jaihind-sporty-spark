import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import { sendPasswordResetEmail } from "../utils/sendPasswordResetEmail.js";

// ✅ FIX: Removed the self-import of authController functions
//    (this file IS the authController, you cannot import from itself)

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
      message: "User registered",
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

    res.json({ message: "Profile updated", user });
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
      return res.status(400).json({ message: "Email is required" });
    }

    console.log(`📝 Forgot password request for: ${email}`);
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`✅ User found: ${user.name}`);

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

    await user.save();
    console.log(`🔐 Reset token generated for: ${email}`);

    // 🌐 Determine FRONTEND_URL dynamically for dev and production
    let frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    
    // For production, use the domain from environment or request
    if (process.env.NODE_ENV === "production") {
      if (!process.env.FRONTEND_URL || process.env.FRONTEND_URL.includes("localhost")) {
        frontendUrl = process.env.FRONTEND_URL_PROD || "https://jaihindsportsfit.in";
      }
    }
    
    console.log(`🌐 Using frontend URL: ${frontendUrl}`);
    const resetUrl = `${frontendUrl}/reset-password/${token}`;

    console.log(`📧 Sending reset email to: ${email}`);
    await sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      resetUrl,
    });

    console.log(`✅ Email sent successfully to: ${email}`);
    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error(`❌ Forgot password error:`, error.message);
    res.status(500).json({ message: error.message || "Failed to send reset email" });
  }
};

/* =========================
   RESET PASSWORD
========================= */

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    console.log(`🔐 Reset password request received`);
    console.log(`📝 Token received: ${token?.substring(0, 10)}...${token?.substring(-10)}`);
    console.log(`⏰ Current time: ${Date.now()}`);

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    console.log(`🔍 Searching for user with token and expiry check...`);
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      console.log(`❌ No user found with valid token`);
      // Check if token exists but is expired
      const expiredUser = await User.findOne({ resetToken: token });
      if (expiredUser) {
        console.log(`⏰ Token exists but is EXPIRED`);
        return res.status(400).json({ message: "Reset link has expired. Please request a new one." });
      }
      console.log(`❌ Token does not exist in database`);
      return res.status(400).json({ message: "Invalid reset link. Please request a new password reset." });
    }

    console.log(`✅ User found: ${user.email}`);
    console.log(`🔐 Updating password...`);

    user.password = password;
    user.resetToken = null;
    user.resetTokenExpire = null;

    await user.save();

    console.log(`✅ Password updated successfully for: ${user.email}`);
    res.json({ message: "✅ Password reset successful! Please log in with your new password." });
  } catch (error) {
    console.error(`❌ Reset password error:`, error.message);
    res.status(500).json({ message: error.message || "Failed to reset password" });
  }
};

/* =========================
   UPLOAD PROFILE PHOTO
========================= */

export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
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
      return res.status(400).json({ message: "Current password incorrect" });
    }

    user.password = req.body.newPassword;
    await user.save();

    res.json({ message: "Password changed" });
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
    res.json({ message: "Account deleted" });
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
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};