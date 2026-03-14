import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ EMAIL_USER or EMAIL_PASS missing in .env");
  process.exit(1);
}

// Fast SMTP connection with pooling
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  pool: true,          // reuse connection (faster)
  maxConnections: 5,
  maxMessages: 100,

  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000,
});

// verify once at startup
transporter.verify((err) => {
  if (err) {
    console.error("❌ Email transporter error:", err);
  } else {
    console.log("✅ Email transporter ready (FAST MODE)");
  }
});

export default transporter;