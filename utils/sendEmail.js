import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async ({ to, subject, html, text }) => {
  let transporterConfig;

  // Check if using custom SMTP server
  if (process.env.SMTP_HOST) {
    transporterConfig = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // Convert string to boolean
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
      },
    };
  } else {
    // Use service-based configuration (e.g., Gmail)
    transporterConfig = {
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };
  }

  const transporter = nodemailer.createTransport(transporterConfig);

  await transporter.sendMail({
    from: `"Rahnimo" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text,
  });
};
