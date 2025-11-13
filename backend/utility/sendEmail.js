// const nodemailer = require("nodemailer");
//
// const sendEmail = async ({ to, subject, text }) => {
//   let transporter = nodemailer.createTransport({
//     service: "Gmail", // or your email provider
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
//
//   await transporter.sendMail({
//     from: `"Your App" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     text,
//   });
// };
//
// module.exports = sendEmail;


const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text }) => {
  let transporter = nodemailer.createTransport({
    host: "mail.sayuree.com",      // ✅ NOT Gmail
    port: 465,                     // ✅ Secure SSL port
    secure: true,                  // ✅ true because port 465
    auth: {
      user: "otp@sayuree.com",     // ✅ full email
      pass: "fm#!#6bStkW}",         // ✅ your real password
    },
  });

  await transporter.sendMail({
    from: '"Sayuree" <otp@sayuree.com>', // Optional display name
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
