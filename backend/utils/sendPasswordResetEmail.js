import { transporter } from "./emailTransporter.js";
import nodemailer from "nodemailer";

export const sendPasswordResetEmail = async ({
  email,
  name,
  resetUrl,
}) => {
  try {
    const env = process.env.NODE_ENV || "development";
    console.log(`\n📧 === PASSWORD RESET EMAIL [${env.toUpperCase()}] ===`);
    console.log(`👤 To: ${email}`);
    console.log(`👨 Name: ${name}`);
    console.log(`🔗 Reset URL: ${resetUrl}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

    if (!transporter) {
      throw new Error("Email transporter not initialized");
    }

    const mailOptions = {
      from: `"Jaihind Sports" <${process.env.EMAIL_USER || "noreply@jaihindsports.com"}>`,
      to: email,
      subject: "🔐 Jaihind Sports - Password Reset Request",
      html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width:600px; margin:auto; padding:0">
        <div style="background:linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding:20px; border-radius:8px 8px 0 0; text-align:center;">
          <h2 style="color:white; margin:0; font-size:28px;">🏋️ Jaihind Sports</h2>
        </div>
        
        <div style="background:#f3f4f6; padding:30px; border-radius:0 0 8px 8px;">
          <p style="color:#333; font-size:16px; margin:0 0 20px 0;">Hello <b>${name}</b>,</p>

          <p style="color:#555; font-size:14px; margin:0 0 25px 0;">You requested a password reset. Click the button below to create a new password:</p>

          <div style="text-align:center; margin:30px 0;">
            <a href="${resetUrl}" 
            style="background:#2563eb; color:white; padding:12px 32px;
            text-decoration:none; border-radius:6px; display:inline-block; 
            font-weight:bold; font-size:16px; border:none; cursor:pointer;">
            Reset Password
            </a>
          </div>

          <p style="margin:20px 0; font-size:13px; color:#666; background:#fff; padding:15px; border-left:4px solid #2563eb;">
            <strong>⏱️  This link expires in 15 minutes.</strong><br>
            Link expires at: ${new Date(Date.now() + 15 * 60 * 1000).toISOString()}
          </p>

          <p style="margin:20px 0; font-size:12px; color:#888; border-top:1px solid #ddd; padding-top:15px;">
            If you didn't request this reset, please ignore this email. Your password will remain unchanged.
          </p>
        </div>
      </div>
      `,
      text: `
Jaihind Sports - Password Reset
================================

Hello ${name},

You requested a password reset. Use this link to reset your password:

${resetUrl}

This link expires in 15 minutes.

If you didn't request this, please ignore this email.
`,
    };

    console.log(`📧 Sending email directly...`);
    const result = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent successfully!`);
    console.log(`📨 Message ID: ${result.messageId}`);
    if (result.response) {
      console.log(`📬 Server response: ${result.response}`);
    }
    
    // For Ethereal test emails in development, show preview URL
    if (env === "development" && result.messageId) {
      try {
        const previewUrl = nodemailer.getTestMessageUrl(result);
        if (previewUrl) {
          console.log(`\n🔗 EMAIL PREVIEW URL (Development Only):`);
          console.log(`${previewUrl}`);
          console.log(`\n📧 Check this URL to see your test email!\n`);
        }
      } catch (e) {
        // Ethereal might not have getTestMessageUrl in all cases
      }
    }
    
    return result;
    
  } catch (error) {
    console.error(`\n❌ EMAIL SENDING FAILED!`);
    console.error(`❌ Error Code: ${error.code || "UNKNOWN"}`);
    console.error(`❌ Error Message: ${error.message}`);
    console.error(`❌ Full Error:`, error);
    
    if (process.env.NODE_ENV === "production") {
      console.error(`\n⚠️  [PROD] Troubleshooting:`);
      console.error(`⚠️  1. Check Render environment variables for: EMAIL_USER, EMAIL_PASS`);
      console.error(`⚠️  2. Verify Gmail app password is correct`);
      console.error(`⚠️  3. Check if Gmail is blocking the connection`);
    }
    
    // Re-throw the error so the controller can handle it
    throw new Error(`Email sending failed: ${error.message}`);
  }
};