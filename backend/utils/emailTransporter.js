import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Check email credentials
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ EMAIL_USER or EMAIL_PASS not found in .env file");
  process.exit(1);
}

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter verification failed:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

export default transporter;