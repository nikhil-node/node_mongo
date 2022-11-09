const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    // service: process.env.EMAIL_HOST,
    host: "smtp.mailtrap.io",
    port: process.env.EMAIL_PORT,
    secure: false, // use SSL
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Nikhil Sompura <hello@yopmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
