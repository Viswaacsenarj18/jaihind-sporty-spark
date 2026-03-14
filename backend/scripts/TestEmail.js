import dotenv from "dotenv";
import { transporter } from "../utils/emailTransporter.js";

dotenv.config();

console.log("🧪 Testing Email Configuration...\n");
console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
console.log("🔑 EMAIL_PASS:", process.env.EMAIL_PASS ? "***SET***" : "NOT SET");
console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
console.log("\n=== Starting Email Test ===\n");

async function testEmail() {
  try {
    console.log("1️⃣  Testing transporter connection...");
    
    // Verify transporter
    const verified = await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error("❌ Transporter verification failed:", error.message);
          reject(error);
        } else {
          console.log("✅ Transporter verified successfully");
          resolve(true);
        }
      });
    });

    console.log("\n2️⃣  Sending test email...\n");

    const mailOptions = {
      from: `"Jaihind Sports Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER || "jaihindsports2026@gmail.com",
      subject: "🧪 Jaihind Sports - Email Test",
      html: `
      <div style="font-family: Arial; max-width:600px; margin:auto; padding:20px;">
        <h2>✅ Jaihind Sports Email Test</h2>
        <p>If you received this email, the email system is working correctly!</p>
        <p><strong>Test Status:</strong> SUCCESS</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      </div>
      `,
    };

    console.log("📧 Sending to:", mailOptions.to);
    console.log("📨 Subject:", mailOptions.subject);

    const result = await transporter.sendMail(mailOptions);

    console.log("\n✅ TEST EMAIL SENT SUCCESSFULLY!");
    console.log("📬 Response:", result.response);
    console.log("\n🎉 Email configuration is working correctly!");
    console.log("Check your inbox for the test email.\n");

  } catch (error) {
    console.error("\n❌ EMAIL TEST FAILED!");
    console.error("🔴 Error Code:", error.code);
    console.error("🔴 Error Message:", error.message);
    console.error("🔴 Full Error:", error);
    console.error("\n💡 Troubleshooting steps:");
    console.error("1. Check EMAIL_USER is correct (should be jaihindsports2026@gmail.com)");
    console.error("2. Check EMAIL_PASS is correct (app password, not Gmail password)");
    console.error("3. Generate new app password at: https://myaccount.google.com/apppasswords");
    console.error("4. Two-factor authentication must be ENABLED on Gmail account");
    console.error("5. Check firewall/proxy is not blocking Gmail SMTP (port 465)\n");
    process.exit(1);
  }
}

testEmail();
