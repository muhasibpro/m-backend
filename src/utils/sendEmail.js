const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = async (to, subject, text) => {
  await transporter.sendMail({
    from: `"Tasdiqlash xizmati" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  });
};