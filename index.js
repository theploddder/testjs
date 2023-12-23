const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Create a transporter
const transporter = nodemailer.createTransport({
  host: "smtp.titan.email",
  port: 465,
  secure: true, // Corrected option for secure connection
  auth: {
    user: 'support@qdata.com.ng',
    pass: 'fs?jN8YJ9URvW_*'
  }
});

// Use the body-parser middleware
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// CORS headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Adjust as needed for security
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

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
