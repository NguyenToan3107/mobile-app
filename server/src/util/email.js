const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // create transporter to send email
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASS,
  //   },
  // });

  // EMAIL_HOST=sandbox.smtp.mailtrap.io
  // EMAIL_PORT=2525
  // EMAIL_USER=b1fcf7963a1230
  // EMAIL_PASS=4af1e24bed35ab

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // ví dụ: smtp.gmail.com
    port: 587, // ví dụ: 465 cho SSL, 587 cho TLS
    secure: false, // true nếu sử dụng SSL
    auth: {
      user: process.env.EMAIL_GMAIL_USER, // địa chỉ email của bạn
      pass: process.env.EMAIL_GMAIL_PASSWORD, // mật khẩu email của bạn
    },
  });

  const mailOptions = {
    from: `cuahangdientu@mobiles.io <${process.env.EMAIL_GMAIL_USER}>`,
    replyTo: 'cuahangdientu@mobiles.io',
    to: options.email,
    text: options.message,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
