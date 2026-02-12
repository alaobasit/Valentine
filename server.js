const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '200kb' }));

// Serve static files (the front-end) so the app can be previewed from the same server
app.use(express.static(path.join(__dirname)));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/send-email', async (req, res) => {
  const payload = req.body || {};

  // Basic validation
  const {
    memoryLane,
    favoriteThing,
    unforgettableMoment,
    loveLetter,
    fullSession
  } = payload;

  // If front-end sends a full serialized session, include it; otherwise use provided fields.
  const sessionData = fullSession || {
    memoryLane,
    favoriteThing,
    unforgettableMoment,
    loveLetter,
  };

  // Create transporter using SMTP env or service fallback
  let transporter;
  try {
    if (process.env.SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }
  } catch (err) {
    console.error('Failed to create transporter', err);
    return res.status(500).json({ message: 'Server email configuration error' });
  }

  const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@example.com';
  const toAddress = process.env.EMAIL_TO || 'spouse.email@example.com';

  const textBody = `
Full session data:
${JSON.stringify(sessionData, null, 2)}

-- End of message --`;

  const htmlBody = `<h2>Your partner shared something special</h2>
<pre style="white-space:pre-wrap">${escapeHtml(JSON.stringify(sessionData, null, 2))}</pre>`;

  const mailOptions = {
    from: fromAddress,
    to: toAddress,
    subject: process.env.EMAIL_SUBJECT || "Your Partner's Responses 💌",
    text: textBody,
    html: htmlBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('sendMail error', err && err.toString());
    res.status(500).json({ message: 'Failed to send email' });
  }
});

function escapeHtml(str){
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
