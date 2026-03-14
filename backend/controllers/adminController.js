import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import Admin from "../models/Admin.js";
import User from "../models/User.js";

import { sendPasswordResetEmail } from "../utils/sendPasswordResetEmail.js";

/* =========================
   ADMIN LOGIN
========================= */

export const loginAdmin = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role || "admin",
      },
      process.env.JWT_SECRET || "yourSuperSecretKey123",
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,

      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (error) {

    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });

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

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl =
      `${process.env.FRONTEND_URL}/reset-password/${token}`;

    console.log("🔗 Reset URL:", resetUrl);

    // Send email in background (fast response)
    sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      resetUrl,
    }).catch((err) => console.error("Email error:", err));

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });

  } catch (error) {

    console.error("Forgot password error:", error);

    res.status(500).json({
      message: "Server error. Please try again.",
    });

  }
};