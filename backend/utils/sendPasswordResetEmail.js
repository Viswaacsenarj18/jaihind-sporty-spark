import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async ({ email, name, resetUrl }) => {
  try {

    console.log("📧 Sending reset email to:", email);

    await resend.emails.send({
      from: "Jaihind Sports <onboarding@resend.dev>",
      to: email,
      subject: "Reset Your Password",

      html: `
      <div style="font-family:Arial;padding:20px">
        <h2>Password Reset</h2>

        <p>Hello ${name}</p>

        <p>Click the button below to reset your password:</p>

        <a href="${resetUrl}"
        style="
        background:#2563eb;
        color:white;
        padding:12px 20px;
        border-radius:6px;
        text-decoration:none;
        display:inline-block;">
        Reset Password
        </a>

        <p style="margin-top:20px">
        This link expires in 15 minutes.
        </p>
      </div>
      `,
    });

    console.log("✅ Email sent via Resend");

  } catch (error) {
    console.error("❌ Email error:", error);
  }
};