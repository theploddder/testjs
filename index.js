const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const Imap = require('imap');

const app = express();
const port = 3000;

// Create a nodemailer transporter for Titan Email
const transporter = nodemailer.createTransport({
  host: 'smtp.titan.email',
  port: 465,
  secure: true,
  auth: {
    user: 'support@qdata.com.ng', // Replace with your email address
    pass: 'fs?jN8YJ9URvW_*', // Replace with your email password
  },
});


// Use the body-parser middleware
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

app.post('/send-email', async (req, res) => {
  const { recipient, subject, message } = req.body;

  // Configure the email details
  const mailOptions = {
    from: 'QDATA <support@qdata.com.ng>',
    to: recipient,
    subject: subject,
    html: message,
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
    console.log('Info object:', info);

    // Append the sent email to the "Sent" folder using IMAP
    const imap = new Imap({
      user: 'support@qdata.com.ng', // Replace with your email address
      password: 'fs?jN8YJ9URvW_*', // Replace with your email password
      host: 'imap.titan.email',
      port: 993,
      tls: true,
    });

    imap.once('ready', () => {
      imap.openBox('Sent', true, (err) => {
        if (err) {
          console.error('Error opening "Sent" folder:', err);
          imap.end();
          return res.status(500).send('Error sending email');
        }

        // Create the email message as MIMEText
        const emailMessage = `From: ${mailOptions.from}\r\nTo: ${mailOptions.to}\r\nSubject: ${mailOptions.subject}\r\n\r\n${mailOptions.html}`;

        // Append the sent email to the "Sent" folder
        imap.append(emailMessage, { mailbox: 'Sent' }, (appendErr) => {
          if (appendErr) {
            console.error('Error appending email to "Sent" folder:', appendErr);
            res.status(500).send('Error sending email');
          } else {
            console.log('Email appended to "Sent" folder.');
            res.send('Email sent successfully');
          }
          imap.end();
        });
      });
    });

    imap.once('error', (imapErr) => {
      console.error('IMAP Error:', imapErr);
    });

    imap.connect();
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
