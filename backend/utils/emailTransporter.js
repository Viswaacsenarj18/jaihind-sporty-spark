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
    port: 465,
    secure: true, // Use SSL (port 465) - more reliable on Render
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: false,
    debug: false,
    connectionTimeout: 10000,
    socketTimeout: 10000,
    maxConnections: 1,
    maxMessages: 10,
  });

  return transporter;
}

// Initialize transporter on import
try {
  transporter = await createTransporter();
  console.log("✅ Email transporter created successfully");
} catch (error) {
  console.error("❌ Failed to create email transporter:", error.message);
  // Don't throw - let the app continue
}

// Export the transporter
export { transporter };

// Verify transporter asynchronously (non-blocking)
if (transporter && process.env.NODE_ENV === "production") {
  console.log("⏳ Verifying email transporter connection (async)...");
  // Set a timeout to prevent hanging
  setTimeout(() => {
    transporter.verify((error, success) => {
      if (error) {
        console.error("⚠️  [PROD] Email verification failed:", error.message);
        console.error("⚠️  [PROD] Will attempt to send email anyway...");
      } else {
        console.log("✅ Email transporter verified and ready");
      }
    });
  }, 2000); // Delay verification to not block startup
}