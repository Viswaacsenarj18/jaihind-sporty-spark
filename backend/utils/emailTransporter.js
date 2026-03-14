import nodemailer from "nodemailer";
import dotenv from "dotenv";

// 🔐 Load environment variables
dotenv.config();

let transporter;

// 🔐 Create transporter based on environment
async function createTransporter() {
  // For development/localhost: Use Ethereal Email (free test service)
  if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
    console.log("📧 [DEV] Using Ethereal Email for localhost testing...");
    try {
      // Create Ethereal test account
      let testAccount = await nodemailer.createTestAccount();
      
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      console.log("✅ [DEV] Ethereal Email Test Account Created");
      console.log("📧 [DEV] Test emails preview: https://ethereal.email/messages");
      
      return transporter;
    } catch (error) {
      console.warn("⚠️  [DEV] Ethereal setup failed, falling back to Gmail:", error.message);
    }
  }

  // For production: Use Gmail SMTP
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ [PROD] ERROR: EMAIL_USER or EMAIL_PASS not set!");
    console.error("❌ [PROD] Please set these in Render environment variables:");
    console.error("❌ [PROD] - EMAIL_USER (Gmail address)");
    console.error("❌ [PROD] - EMAIL_PASS (16-character app password)");
    throw new Error("Email credentials not configured");
  }

  console.log(`📧 [PROD] Configuring Gmail SMTP...`);
  console.log(`📧 [PROD] Email address: ${process.env.EMAIL_USER}`);
  
  transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use TLS instead of SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: true,
    debug: process.env.NODE_ENV === "development",
    connectionTimeout: 10000,  // 10 seconds
    socketTimeout: 10000,      // 10 seconds
    pool: {
      maxConnections: 1,
      maxMessages: 5,
      rateDelta: 2000,
      rateLimit: 3,
    },
  });

  return transporter;
}

// Initialize transporter on import
try {
  transporter = await createTransporter();
  console.log("✅ Email transporter created successfully");
} catch (error) {
  console.error("❌ Failed to create email transporter:", error.message);
  // Don't throw - let the app continue, will fail when trying to send email
}

// Export the transporter
export { transporter };

// Verify transporter immediately
if (transporter) {
  console.log("⏳ Verifying email transporter connection...");
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Email transporter verification FAILED:", error.message);
      if (process.env.NODE_ENV === "production") {
        console.error("⚠️  [PROD] Check your email credentials in Render dashboard");
      }
    } else {
      console.log("✅ Email transporter is ready - emails can be sent");
    }
  });
}