import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async ({ email, name, resetUrl }) => {

  try {

    console.log("📧 Sending reset email to:", email);

    const htmlContent = `
      <h2>Password Reset</h2>

      <p>Hello ${name}</p>

      <p>Click below to reset your password:</p>

      <a href="${resetUrl}">Reset Password</a>
    `;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset Password",
      html: htmlContent
    });

    console.log("✅ Email sent via Resend");

  } catch (error) {

    console.error("❌ Email error:", error);

  }

};