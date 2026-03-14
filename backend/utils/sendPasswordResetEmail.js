import { transporter } from "./emailTransporter.js";

export const sendPasswordResetEmail = async ({
  email,
  name,
  resetUrl,
}) => {
  try {
    console.log(`📧 Sending password reset email to ${email}`);

    await transporter.sendMail({
      from: `"Jaihind Sports" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Jaihind Sports - Password Reset Request",

      html: `
      <div style="font-family: Arial; max-width:600px; margin:auto">

      <h2>Jaihind Sports</h2>

      <p>Hello <b>${name}</b>,</p>

      <p>You requested a password reset.</p>

      <a href="${resetUrl}" 
      style="background:#2563eb;color:white;padding:12px 24px;
      text-decoration:none;border-radius:6px;">
      Reset Password
      </a>

      <p style="margin-top:20px;font-size:12px;color:#888">
      Link expires in 15 minutes.
      </p>

      </div>
      `,
    });

    console.log(`✅ Password reset email sent`);
  } catch (error) {
    console.error("❌ Email failed:", error.message);
    throw error;
  }
};