const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
app.use(express.json());

// configure mail transporter (use Gmail App Password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourgmail@gmail.com",   // replace with your Gmail
    pass: "your-app-password"      // use Gmail App Password
  }
});

// Step 1: send verification link
app.post("/api/send-delete-link", async (req, res) => {
  const { email } = req.body;
  const token = Math.random().toString(36).substr(2);
  const verifyUrl = `http://localhost:3000/api/verify-delete?token=${token}&email=${email}`;

  try {
    await transporter.sendMail({
      from: "no-reply@vindmy.com",
      to: email,
      subject: "Vindmy Account Deletion",
      text: `Click this link to confirm deletion: ${verifyUrl}`
    });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending email");
  }
});

// Step 2: verify link and notify support
app.get("/api/verify-delete", async (req, res) => {
  const { email } = req.query;

  try {
    await transporter.sendMail({
      from: "no-reply@vindmy.com",
      to: "support@vindmy.com",
      subject: "Account Deletion Request",
      text: `Please delete account for: ${email}`
    });
    res.send("Your deletion request has been sent to support.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error notifying support");
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
