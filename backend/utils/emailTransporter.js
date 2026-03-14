import nodemailer from "nodemailer";
import dotenv from "dotenv";

// 🔐 Load environment variables
dotenv.config();

let transporter;

// 🔐 Create transporter based on environment
async function createTransporter() {
  // For development/localhost: Use Ethereal Email (free test service)
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "localhost") {
    console.log("📧 Using Ethereal Email for localhost testing...");
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
      
      console.log("✅ Ethereal Email Test Account Created");
      console.log("📧 Test emails will be previewed at: https://ethereal.email/messages");
      
      return transporter;
    } catch (error) {
      console.warn("⚠️  Ethereal setup failed, falling back to Gmail:", error.message);
    }
  }

  // For production: Use Gmail
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️  WARNING: EMAIL_USER or EMAIL_PASS not set in .env");
    console.warn("📧 Email sending will be simulated (emails won't actually send)");
    
    // Create a mock transporter for development without credentials
    transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 465,
      secure: true,
      auth: {
        user: "test",
        pass: "test",
      },
    });
    return transporter;
  }

  console.log("📧 Using Gmail SMTP...");
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: process.env.NODE_ENV === "development",
    debug: process.env.NODE_ENV === "development",
    connectionTimeout: 15000,
    socketTimeout: 15000,
  });

  return transporter;
}

// Initialize transporter on import
transporter = await createTransporter();

// Export the transporter
export { transporter };

// Verify transporter immediately and log results
if (transporter) {
  console.log("⏳ Verifying email transporter...");
  transporter.verify((error, success) => {
    if (error) {
      console.warn("⚠️  Email transporter verification warning:", error.message);
    } else {
      console.log("✅ Email transporter is ready to send emails");
    }
  });
}