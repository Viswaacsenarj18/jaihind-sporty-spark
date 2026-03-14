import nodemailer from "nodemailer";
import dotenv from "dotenv";

// 🔐 Load environment variables
dotenv.config();

// 🔐 Verify environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn("⚠️  WARNING: EMAIL_USER or EMAIL_PASS not set in .env");
  console.warn("Password reset emails will NOT work!");
}

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: process.env.NODE_ENV === "development",
  debug: process.env.NODE_ENV === "development",
  connectionTimeout: 10000, // 10 seconds
  socketTimeout: 10000, // 10 seconds
});

// Test email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email Transporter Error:", error.message);
  } else {
    console.log("✅ Email Transporter Ready:", success);
  }
});