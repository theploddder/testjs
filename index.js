// nodemailer.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.titan.email',
  port: 587,
  secure: true,
  auth: {
    user: 'support@qdata.com.ng',
    pass: 'fs?jN8YJ9URvW_*'
  }
});

const sendEmail = async (recipient, subject, message) => {
  const mailOptions = {
    from: 'QDATA <support@qdata.com.ng>',
    to: recipient,
    subject: subject,
    html: message
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return 'Email sent successfully';
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
};

module.exports = { sendEmail };
