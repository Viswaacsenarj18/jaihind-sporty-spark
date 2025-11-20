import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

export const protectUser = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.warn("⚠️ No token provided in Authorization header");
      return res.status(401).json({ success: false, message: "Login required" });
    }

    const secret = process.env.JWT_SECRET || 'yourSuperSecretKey123';
    console.log("🔐 JWT_SECRET:", secret);
    console.log("🔐 Verifying token with secret:", secret?.substring(0, 10) + "...");
    
    const decoded = jwt.verify(token, secret);
    console.log("✅ Token verified, user ID:", decoded.id);
    
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.warn("⚠️ User not found in database with ID:", decoded.id);
      return res.status(401).json({ success: false, message: "User not found" });
    }

    console.log("✅ User found:", user.email);
    req.user = user;
    next();

  } catch (error) {
    console.error("❌ Token verification error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid token", error: error.message });
  }
};
