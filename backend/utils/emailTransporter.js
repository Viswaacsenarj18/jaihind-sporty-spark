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
  connectionTimeout: 30000, // 30 seconds (increased from 10s)
  socketTimeout: 30000, // 30 seconds (increased from 10s)
  maxConnections: 1, // Use single connection to avoid rate limits
  maxMessages: 100, // Per connection
  rateDelta: 1000, // 1 second between messages
  rateLimit: 5, // 5 messages per second
});

// Test email configuration on startup
console.log("⏳ Verifying email transporter...");
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter.verify((error, success) => {
    if (error) {
      console.warn("⚠️  Email verification failed:", error.message);
    } else {
      console.log("✅ Email Transporter Ready");
    }
  });
} else {
  console.warn("⚠️  Email credentials not configured");
}