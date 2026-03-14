import transporter from "./emailTransporter.js";

export const sendPasswordResetEmail = async ({ email, name, resetUrl }) => {
  try {
    if (!email) {
      throw new Error("Recipient email is missing");
    }

    console.log("📧 Sending email to:", email);

    const mailOptions = {
      from: `"Jaihind Sports" <${process.env.EMAIL_USER}>`,
      to: email,   // IMPORTANT
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial; padding:20px">
          <h2>Password Reset Request</h2>

          <p>Hello ${name || "User"},</p>

          <p>You requested to reset your password.</p>

          <p>Click the button below to reset your password:</p>

          <a href="${resetUrl}"
            style="
              background:#2563eb;
              color:white;
              padding:12px 20px;
              text-decoration:none;
              border-radius:6px;
              display:inline-block;
              margin-top:10px;
            ">
            Reset Password
          </a>

          <p style="margin-top:20px">
            This link will expire in 15 minutes.
          </p>

          <p>If you didn't request this, ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully");
    console.log("📨 Message ID:", info.messageId);

    return info;

  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};