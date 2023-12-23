const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Create a transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.titan.email',
  port: 465,
  secure: 'ssl',
  auth: {
    user: 'support@qdata.com.ng',
    pass: 'fs?jN8YJ9URvW_*'
  },
  logger: true, // Enable logging
});

// Use the body-parser middleware
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

app.post('/send-email', (req, res) => {
  const { recipient, subject, message } = req.body;

  // Configure the email details
  const mailOptions = {
    from: 'QDATA <support@qdata.com.ng>',
    to: recipient,
    subject: subject,
    html: message
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("error: " + error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent successfully');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
