import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendOTPEmail(email: string, otp: string, type: 'password_reset' | 'email_verification'): Promise<boolean> {
    try {
      const subject = type === 'password_reset' 
        ? 'Reset Your Password - DitzAPI' 
        : 'Verify Your Email - DitzAPI';

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">DitzAPI</h1>
          </div>
          <div style="padding: 30px; background-color: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">
              ${type === 'password_reset' ? 'Password Reset Request' : 'Email Verification'}
            </h2>
            <p style="color: #555; line-height: 1.6;">
              ${type === 'password_reset' 
                ? 'You have requested to reset your password. Use the code below to proceed:'
                : 'Please use the code below to verify your email address:'
              }
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">
                ${otp}
              </div>
            </div>
            <p style="color: #777; font-size: 14px;">
              This code will expire in 10 minutes. If you didn't request this, please ignore this email.
            </p>
          </div>
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">© 2024 DitzAPI. All rights reserved.</p>
          </div>
        </div>
      `;

      const text = `
        ${type === 'password_reset' ? 'Password Reset Request' : 'Email Verification'} - DitzAPI
        
        Your verification code: ${otp}
        
        This code will expire in 10 minutes.
        
        If you didn't request this, please ignore this email.
      `;

      await this.transporter.sendMail({
        from: `"DitzAPI" <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        html,
        text,
      });

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendNotificationEmail(email: string, subject: string, message: string): Promise<boolean> {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">DitzAPI</h1>
          </div>
          <div style="padding: 30px; background-color: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">${subject}</h2>
            <div style="color: #555; line-height: 1.6;">
              ${message}
            </div>
          </div>
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">© 2024 DitzAPI. All rights reserved.</p>
          </div>
        </div>
      `;

      await this.transporter.sendMail({
        from: `"DitzAPI" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `${subject} - DitzAPI`,
        html,
        text: message,
      });

      return true;
    } catch (error) {
      console.error('Error sending notification email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();