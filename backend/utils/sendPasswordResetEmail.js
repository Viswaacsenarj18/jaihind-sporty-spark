import { transporter } from "./emailTransporter.js";

// Email retry queue to handle Render timeout issues
const emailQueue = [];
let isProcessing = false;

// Helper function to retry email sending with exponential backoff
async function sendEmailWithRetry(mailOptions, retries = 3, delay = 500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`📧 Email attempt ${attempt}/${retries}: Sending to ${mailOptions.to}`);
      
      const result = await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent successfully on attempt ${attempt}`);
      return result;
    } catch (error) {
      console.error(`❌ Email attempt ${attempt} failed: ${error.code || error.message}`);
      
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

// Process email queue one at a time (prevents overwhelming Gmail)
async function processEmailQueue() {
  if (isProcessing || emailQueue.length === 0) return;
  
  isProcessing = true;
  while (emailQueue.length > 0) {
    const emailData = emailQueue.shift();
    try {
      console.log(`📬 Processing queued email to: ${emailData.mailOptions.to}`);
      await sendEmailWithRetry(emailData.mailOptions, 3, 500);
      console.log(`✅ Queued email delivered`);
    } catch (error) {
      console.error(`⚠️  Queued email failed:`, error.message);
    }
    
    // Small delay between emails
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  isProcessing = false;
}

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

    // Add to queue to be processed asynchronously
    emailQueue.push({ mailOptions });
    console.log(`✔️ Email queued for sending (Queue length: ${emailQueue.length})`);
    
    // Start processing queue
    setImmediate(() => processEmailQueue());
    
  } catch (error) {
    console.error(`❌ Email queueing error:`, error.message);
  }
};
    // Don't throw - let the background task fail silently
    // The user already has the reset token saved in DB
  }
};