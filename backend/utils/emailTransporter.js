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
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
  logger: process.env.NODE_ENV === "development",
  debug: process.env.NODE_ENV === "development",
  connectionTimeout: 20000, // 20 seconds (reduced from 30)
  socketTimeout: 20000, // 20 seconds (reduced from 30)
  maxConnections: 1, // Use single connection to avoid rate limits
  maxMessages: 100, // Per connection
  rateDelta: 1000, // 1 second between messages
  rateLimit: 5, // 5 messages per second
  greetingTimeout: 10000, // 10 seconds to receive greeting
  connectionUrl: "smtps://username:password@smtp.gmail.com/?pool=true",
});

// Test email configuration on startup - NON-BLOCKING
console.log("⏳ Verifying email transporter (async)...");
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  // Don't wait for verify - it's non-critical
  setTimeout(() => {
    transporter.verify((error, success) => {
      if (error) {
        console.warn("⚠️  Email verification warning:", error.message);
      } else {
        console.log("✅ Email Transporter Ready");
      }
    });
  }, 2000); // Delay verification to not block startup
} else {
  console.warn("⚠️  Email credentials not configured");
}