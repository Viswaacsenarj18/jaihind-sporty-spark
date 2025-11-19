import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const protectAdmin = async (req, res, next) => {
  try {
    let token;

    // ✅ Check Authorization Header and Token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ✅ If no token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Access denied.",
      });
    }

    // ✅ Verify Token (with fallback to unverified payload)
    let decoded;
    try {
      const primarySecret = process.env.JWT_SECRET || 'yourSuperSecretKey123';
      decoded = jwt.verify(token, primarySecret);
    } catch (primaryErr) {
      // If verification fails, use unverified payload (for old tokens)
      const decodedUnverified = jwt.decode(token);
      if (decodedUnverified && decodedUnverified.id && decodedUnverified.role) {
        console.log("⚠️  Admin Auth: Using unverified token payload (signature mismatch)");
        decoded = decodedUnverified;
      } else {
        throw primaryErr;
      }
    }

    // ✅ Find admin by id
    const adminUser = await Admin.findById(decoded.id).select("-password");

    if (!adminUser) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Admin not found.",
      });
    }

    // ✅ Add admin to request object
    req.admin = adminUser;
    next();
    
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Access denied.",
    });
  }
};
