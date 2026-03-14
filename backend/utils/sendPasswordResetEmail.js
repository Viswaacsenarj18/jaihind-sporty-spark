import { transporter } from "./emailTransporter.js";

export const sendPasswordResetEmail = async ({
  email,
  name,
  resetUrl,
}) => {
  try {
    console.log(`\n📧 === PASSWORD RESET EMAIL ===`);
    console.log(`👤 To: ${email}`);
    console.log(`👨 Name: ${name}`);
    console.log(`🔗 Reset URL: ${resetUrl}`);

    const mailOptions = {
      from: `"Jaihind Sports" <${process.env.EMAIL_USER || "noreply@jaihindsports.com"}>`,
      to: email,
      subject: "🔐 Jaihind Sports - Password Reset Request",
      html: `
      <div style="font-family: Arial; max-width:600px; margin:auto; padding:20px">
        <div style="background:#f3f4f6; padding:20px; border-radius:8px;">
          <h2 style="color:#2563eb; margin:0 0 20px 0;">Jaihind Sports</h2>
          
          <p>Hello <b>${name}</b>,</p>

          <p>You requested a password reset. Click the button below to create a new password:</p>

          <div style="text-align:center; margin:30px 0;">
            <a href="${resetUrl}" 
            style="background:#2563eb; color:white; padding:12px 28px;
            text-decoration:none; border-radius:6px; display:inline-block; font-weight:bold;">
            Reset Password
            </a>
          </div>

          <p style="margin:20px 0; font-size:13px; color:#666;">
            <strong>⏱️  This link expires in 15 minutes.</strong>
          </p>

          <p style="margin:20px 0; font-size:12px; color:#888; border-top:1px solid #ddd; padding-top:15px;">
            If you didn't request this reset, please ignore this email.
          </p>
        </div>
      </div>
      `,
    };

    console.log(`📧 Sending email directly (non-queued)...`);
    const result = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent successfully!`);
    if (result.response) {
      console.log(`📬 Server response: ${result.response}`);
    }
    
    // For Ethereal test emails, show preview URL
    if (result.messageId && process.env.NODE_ENV === "development") {
      const previewUrl = nodemailer.getTestMessageUrl(result);
      if (previewUrl) {
        console.log(`\n🔗 EMAIL PREVIEW URL (Development Only):`);
        console.log(`${previewUrl}`);
        console.log(`\n📧 Check this URL to see your test email!\n`);
      }
    }
    
    return result;
    
  } catch (error) {
    console.error(`\n❌ Email Sending Failed!`);
    console.error(`❌ Error Code: ${error.code || "UNKNOWN"}`);
    console.error(`❌ Error Message: ${error.message}`);
    console.error(`❌ Full Error:`, error);
    
    // Re-throw the error so the controller can handle it
    throw new Error(`Email sending failed: ${error.message}`);
  }

// Import nodemailer to use getTestMessageUrl
import nodemailer from "nodemailer";