import { transporter } from "./emailTransporter.js";

// Helper function to retry email sending with exponential backoff
async function sendEmailWithRetry(mailOptions, retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`📧 Email attempt ${attempt}/${retries}: Sending to ${mailOptions.to}`);
      console.log(`📨 From: ${mailOptions.from}`);
      console.log(`📌 Subject: ${mailOptions.subject}`);
      
      const result = await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent successfully on attempt ${attempt}`);
      console.log(`📬 Response:`, result.response);
      return result;
    } catch (error) {
      console.error(`❌ Email attempt ${attempt} failed`);
      console.error(`🔴 Error code:`, error.code);
      console.error(`🔴 Error message:`, error.message);
      console.error(`🔴 Full error:`, error);
      
      // If last attempt, throw error
      if (attempt === retries) {
        console.error(`❌ Failed to send email after ${retries} attempts`);
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const waitTime = delay * attempt;
      console.log(`⏳ Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

export const sendPasswordResetEmail = async ({
  email,
  name,
  resetUrl,
}) => {
  try {
    console.log(`📧 Preparing password reset email for ${email}`);
    console.log(`👤 User name: ${name}`);
    console.log(`🔗 Reset URL: ${resetUrl}`);

    const mailOptions = {
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
      text-decoration:none;border-radius:6px;display:inline-block;">
      Reset Password
      </a>

      <p style="margin-top:20px;font-size:12px;color:#888">
      Link expires in 15 minutes.
      </p>

      </div>
      `,
    };

    console.log(`🚀 Starting email send with 3 retry attempts...`);
    // Send with retry logic (3 attempts with exponential backoff)
    const result = await sendEmailWithRetry(mailOptions, 3, 2000);
    
    console.log(`✅ Password reset email processed for: ${email}`);
    return result;
  } catch (error) {
    console.error(`❌ Email sending failed after all retries:`, error.message);
    console.error(`⚠️  User will still be able to reset password, but email won't arrive`);
    // Don't throw - let the background task fail silently
    // The user already has the reset token saved in DB
  }
};