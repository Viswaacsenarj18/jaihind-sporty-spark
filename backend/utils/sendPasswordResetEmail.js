import transporter from "./emailTransporter.js";

export const sendPasswordResetEmail = async ({ email, name, resetUrl }) => {
  try {

    console.log("📧 Sending reset email to:", email);

    const mailOptions = {
      from: `"Jaihind Sports" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",

      html: `
      <div style="font-family:Arial;padding:20px">
        <h2>Password Reset</h2>

        <p>Hello ${name},</p>

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
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.messageId);

    return info;

  } catch (error) {
    console.error("❌ Email send error:", error);
    throw error;
  }
};