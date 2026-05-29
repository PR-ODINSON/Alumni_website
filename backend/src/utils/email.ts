import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'IITRAM Alumni <noreply@iitram.ac.in>',
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
};

export const emailTemplates = {
  verifyEmail: (name: string, verificationUrl: string): string => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #1a3a5c 0%, #2563eb 100%); padding: 40px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 28px; font-weight: 700; }
        .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }
        .body { padding: 40px; }
        .greeting { font-size: 18px; font-weight: 600; color: #1a1a2e; margin-bottom: 16px; }
        .text { color: #4a4a68; line-height: 1.7; font-size: 15px; margin-bottom: 24px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #1a3a5c, #2563eb); color: #fff; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; }
        .footer { background: #f8f9fa; padding: 24px 40px; text-align: center; color: #888; font-size: 13px; }
        .divider { height: 1px; background: #eee; margin: 24px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>IITRAM Alumni</h1>
          <p>Institute of Infrastructure, Technology, Research and Management</p>
        </div>
        <div class="body">
          <p class="greeting">Hello, ${name}!</p>
          <p class="text">Welcome to the IITRAM Alumni Network. You're one step away from joining our community of achievers, innovators, and change-makers.</p>
          <p class="text">Please verify your email address to activate your account:</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verificationUrl}" class="btn">Verify Email Address</a>
          </div>
          <div class="divider"></div>
          <p class="text" style="font-size: 13px; color: #888;">This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} IITRAM Alumni Platform. All rights reserved.</p>
          <p>Institute of Infrastructure, Technology, Research and Management, Ahmedabad</p>
        </div>
      </div>
    </body>
    </html>
  `,

  resetPassword: (name: string, resetUrl: string): string => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #1a3a5c 0%, #2563eb 100%); padding: 40px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 28px; font-weight: 700; }
        .body { padding: 40px; }
        .text { color: #4a4a68; line-height: 1.7; font-size: 15px; margin-bottom: 24px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #dc2626, #ef4444); color: #fff; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; }
        .footer { background: #f8f9fa; padding: 24px 40px; text-align: center; color: #888; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>IITRAM Alumni</h1>
        </div>
        <div class="body">
          <p style="font-size: 18px; font-weight: 600; color: #1a1a2e;">Hello, ${name}</p>
          <p class="text">We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" class="btn">Reset Password</a>
          </div>
          <p class="text" style="font-size: 13px; color: #888;">This link expires in 1 hour. If you didn't request a password reset, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} IITRAM Alumni Platform</p>
        </div>
      </div>
    </body>
    </html>
  `,
};
