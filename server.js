const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/bookings', async (req, res) => {
  console.log('BOOKING REQUEST RECEIVED:', req.body);

  try {
    const { name, phone, email, service, date, time, placement, details } = req.body || {};

    if (!name || !phone || !email || !service || !date || !time || !placement || !details) {
      console.log('BOOKING ERROR: missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.BUSINESS_EMAIL) {
      console.log('BOOKING ERROR: missing environment variables');
      return res.status(500).json({ error: 'Email settings are missing on the server' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mail = {
      from: process.env.SMTP_USER,
      to: process.env.BUSINESS_EMAIL,
      replyTo: email,
      subject: `New Tattoo Booking - ${name} - ${date} ${time}`,
      text: `
New booking request for SMOKIN INK TATTOOS

Name: ${name}
Phone: ${phone}
Email: ${email}
Service: ${service}
Date: ${date}
Time: ${time}
Placement: ${placement}

Tattoo Details:
${details}

Deposit: $30
CashApp: $SmokinInkTattoos24
      `.trim()
    };

    const info = await transporter.sendMail(mail);
    console.log('BOOKING EMAIL SENT:', info.messageId);
    return res.json({ ok: true });
  } catch (error) {
    console.error('BOOKING EMAIL ERROR:', error && error.message ? error.message : error);
    return res.status(500).json({ error: 'Could not send booking email' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
