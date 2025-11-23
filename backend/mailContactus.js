// services/emailService.js
import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

export const sendResponseEmail = async (contact, adminResponse) => {
  try {
    console.log('Creating email transporter...');
    const transporter = createTransporter();

    // Verify transporter configuration
    await transporter.verify();
    console.log('Email transporter verified successfully');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: contact.email,
      subject: `Re: Your Contact Message - SmartAgri Support`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10B981, #059669); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">SmartAgri 🌱</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Agricultural Support Team</p>
          </div>
          
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #065f46; margin-bottom: 20px;">Hello ${contact.fullName},</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10B981;">
              <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">
                Thank you for reaching out to us. Here's our response to your message:
              </p>
              
              <div style="background: #f0fdf4; padding: 15px; border-radius: 6px; margin: 15px 0;">
                <p style="color: #065f46; font-style: italic; margin: 0;">"${adminResponse.message}"</p>
              </div>
              
              <p style="color: #374151; line-height: 1.6;">
                If you need further assistance, please don't hesitate to reply to this email.
              </p>
            </div>
            
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
                <strong>Responded by:</strong> ${adminResponse.adminName}
              </p>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
                <strong>Response Date:</strong> ${new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div style="background: #065f46; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 14px;">
              &copy; 2025 SmartAgri. All rights reserved.<br>
              Transforming Agriculture with Technology
            </p>
          </div>
        </div>
      `
    };

    console.log('Sending email to:', contact.email);
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};