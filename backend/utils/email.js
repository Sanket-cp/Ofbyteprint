const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const templates = {
  welcome: (data) => ({
    subject: 'Welcome to PrintHub - Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2dd4bf 0%, #0891b2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to PrintHub!</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Hi ${data.name},</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Thank you for joining PrintHub! We're excited to help you with all your printing needs.
          </p>
          <p style="color: #4b5563; line-height: 1.6;">
            To get started, please verify your email address by clicking the button below:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verificationUrl}" 
               style="background: #2dd4bf; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't create an account with PrintHub, please ignore this email.
          </p>
        </div>
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 14px;">
            © 2024 PrintHub. All rights reserved.
          </p>
        </div>
      </div>
    `
  }),

  passwordReset: (data) => ({
    subject: 'PrintHub - Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2dd4bf 0%, #0891b2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Hi ${data.name},</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            We received a request to reset your password for your PrintHub account.
          </p>
          <p style="color: #4b5563; line-height: 1.6;">
            Click the button below to reset your password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" 
               style="background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            This link will expire in 10 minutes. If you didn't request a password reset, please ignore this email.
          </p>
        </div>
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 14px;">
            © 2024 PrintHub. All rights reserved.
          </p>
        </div>
      </div>
    `
  }),

  orderConfirmation: (data) => ({
    subject: `Order Confirmation - ${data.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2dd4bf 0%, #0891b2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed!</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Hi ${data.customerName},</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Thank you for your order! We've received your order and will start processing it soon.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Order Details</h3>
            <p><strong>Order Number:</strong> #${data.orderNumber}</p>
            <p><strong>Total Amount:</strong> ₹${data.total.toFixed(2)}</p>
            <div style="margin-top: 20px;">
              <h4 style="color: #1f2937;">Items:</h4>
              ${data.items.map(item => `
                <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
                  <p style="margin: 5px 0;"><strong>${item.productSnapshot.name}</strong></p>
                  <p style="margin: 5px 0; color: #6b7280;">Quantity: ${item.customization.quantity}</p>
                  <p style="margin: 5px 0; color: #6b7280;">Price: ₹${item.priceBreakdown.finalPrice.toFixed(2)}</p>
                </div>
              `).join('')}
            </div>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.orderUrl}" 
               style="background: #2dd4bf; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Track Your Order
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            We'll send you updates as your order progresses. Expected delivery: 5-7 business days.
          </p>
        </div>
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 14px;">
            © 2024 PrintHub. All rights reserved.
          </p>
        </div>
      </div>
    `
  }),

  paymentConfirmation: (data) => ({
    subject: `Payment Confirmed - ${data.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Payment Confirmed!</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Hi ${data.customerName},</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Great news! Your payment has been successfully processed.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Payment Details</h3>
            <p><strong>Order Number:</strong> #${data.orderNumber}</p>
            <p><strong>Amount Paid:</strong> ₹${data.amount.toFixed(2)}</p>
            <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
            <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p style="color: #4b5563; line-height: 1.6;">
            Your order is now confirmed and will be processed shortly. We'll keep you updated on the progress.
          </p>
        </div>
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 14px;">
            © 2024 PrintHub. All rights reserved.
          </p>
        </div>
      </div>
    `
  }),

  orderStatusUpdate: (data) => ({
    subject: `Order Update - ${data.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2dd4bf 0%, #0891b2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Update</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Hi ${data.customerName},</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Your order #${data.orderNumber} status has been updated to: <strong>${data.status}</strong>
          </p>
          ${data.message ? `
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #4b5563; margin: 0;">${data.message}</p>
            </div>
          ` : ''}
          ${data.trackingUrl ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.trackingUrl}" 
                 style="background: #2dd4bf; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Track Package
              </a>
            </div>
          ` : ''}
        </div>
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 14px;">
            © 2024 PrintHub. All rights reserved.
          </p>
        </div>
      </div>
    `
  }),

  orderCancellation: (data) => ({
    subject: `Order Cancelled - ${data.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Cancelled</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Hi ${data.customerName},</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Your order #${data.orderNumber} has been cancelled.
          </p>
          ${data.reason ? `
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">Reason:</h3>
              <p style="color: #4b5563; margin: 0;">${data.reason}</p>
            </div>
          ` : ''}
          <p style="color: #4b5563; line-height: 1.6;">
            If you have any questions, please don't hesitate to contact our support team.
          </p>
        </div>
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 14px;">
            © 2024 PrintHub. All rights reserved.
          </p>
        </div>
      </div>
    `
  }),

  codConfirmation: (data) => ({
    subject: `COD Order Confirmed - ${data.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2dd4bf 0%, #0891b2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">COD Order Confirmed!</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Hi ${data.customerName},</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Your Cash on Delivery order has been confirmed!
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Order Details</h3>
            <p><strong>Order Number:</strong> #${data.orderNumber}</p>
            <p><strong>Amount to Pay:</strong> ₹${data.amount.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> Cash on Delivery</p>
          </div>
          <p style="color: #4b5563; line-height: 1.6;">
            Please keep the exact amount ready for payment when your order is delivered.
          </p>
        </div>
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 14px;">
            © 2024 PrintHub. All rights reserved.
          </p>
        </div>
      </div>
    `
  })
};

// Send email function
const sendEmail = async ({ to, subject, template, data, html, text }) => {
  try {
    const transporter = createTransporter();

    let emailContent = {};

    if (template && templates[template]) {
      const templateContent = templates[template](data);
      emailContent = {
        subject: templateContent.subject,
        html: templateContent.html
      };
    } else {
      emailContent = {
        subject,
        html: html || text,
        text
      };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'PrintHub <noreply@printhub.com>',
      to,
      ...emailContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Send bulk emails
const sendBulkEmail = async (emails) => {
  try {
    const transporter = createTransporter();
    const results = [];

    for (const email of emails) {
      try {
        const result = await sendEmail(email);
        results.push({ success: true, messageId: result.messageId, to: email.to });
      } catch (error) {
        results.push({ success: false, error: error.message, to: email.to });
      }
    }

    return results;
  } catch (error) {
    console.error('Bulk email sending failed:', error);
    throw error;
  }
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email configuration verified successfully');
    return true;
  } catch (error) {
    console.error('❌ Email configuration verification failed:', error);
    return false;
  }
};

module.exports = {
  sendEmail,
  sendBulkEmail,
  verifyEmailConfig,
  templates
};