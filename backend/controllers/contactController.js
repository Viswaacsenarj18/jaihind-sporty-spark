import nodemailer from 'nodemailer';

// ✅ SEND CONTACT FORM EMAIL
export const sendContactEmail = async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email address" 
      });
    }

    // Configure nodemailer transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'sethupathi51469@gmail.com',
        pass: process.env.GMAIL_PASSWORD || 'yourGmailAppPassword', // Use app-specific password
      },
    });

    // Email content for you (admin)
    const adminMailOptions = {
      from: process.env.GMAIL_USER || 'sethupathi51469@gmail.com',
      to: 'sethupathi51469@gmail.com',
      subject: `New Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e94560; border-bottom: 2px solid #e94560; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>From:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="background-color: white; padding: 10px; border-left: 4px solid #e94560; white-space: pre-wrap;">
              ${message}
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">
            This is an automated message from Jaihind Sports Contact Form
          </p>
        </div>
      `,
    };

    // Email content for user (confirmation)
    const userMailOptions = {
      from: process.env.GMAIL_USER || 'sethupathi51469@gmail.com',
      to: email,
      subject: 'Thank you for contacting Jaihind Sports!',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e94560;">Thank You for Reaching Out! 🙏</h2>
          
          <p>Dear ${firstName},</p>
          
          <p>We have received your message and appreciate you contacting Jaihind Sports. Our team will review your inquiry and get back to you as soon as possible.</p>

          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #e94560;">
            <p><strong>Subject:</strong> ${subject}</p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>

          <p><strong>Contact Information:</strong></p>
          <ul>
            <li>📞 Phone: 86374 50696 / 80568 91366</li>
            <li>📧 Email: sethupathi51469@gmail.com</li>
            <li>⏰ Business Hours: Mon-Sat 9:00 AM - 8:00 PM, Sun 10:00 AM - 6:00 PM</li>
          </ul>

          <p>For immediate assistance, you can also reach us on WhatsApp or call us during business hours.</p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">
            Jaihind Sports | Sports Store<br />
            Near Bus Stand, Thuraiyur Rd, Mettuppalayam - 621210
          </p>
        </div>
      `,
    };

    // Send emails
    await transporter.sendMail(adminMailOptions);
    console.log('✅ Admin email sent successfully');

    await transporter.sendMail(userMailOptions);
    console.log('✅ Confirmation email sent to user:', email);

    res.json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
    });

  } catch (error) {
    console.error('❌ Error sending contact email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
      error: error.message,
    });
  }
};
