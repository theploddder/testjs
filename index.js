const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 3000;

// Create a transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com', // Replace with your Hostinger SMTP server
  port: 465, // or the port provided by your hosting service
  true: false, // true for 465, false for other ports
  auth: {
    user: 'support@qdata.com.ng', // Replace with your email address
    pass: 'fs?jN8YJ9URvW_*' // Replace with your email password
  }
});

// Use the body-parser middleware
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

app.post('/send-email', (req, res) => {
  const { recipient, subject, message } = req.body;

  // Configure the email details
  const mailOptions = {
    from: 'support@qdata.com.ng', // Replace with your email address
    to: recipient,
    subject: subject,
    html: message
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent successfully');
    }
  });
});

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve index.html as the default file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
