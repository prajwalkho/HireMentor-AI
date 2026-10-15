const nodemailer = require("nodemailer");

const transPorter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function senData(to, subject, html) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("Email service is not configured. Set SMTP_USER and SMTP_PASS.");
  }

  const mailFormat = {
    from: process.env.SMTP_USER,
    to,
    subject,
    html,
  };
  await transPorter.sendMail(mailFormat);
  console.log("Email sent.");
}
module.exports = senData;
