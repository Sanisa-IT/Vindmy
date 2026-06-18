require("dotenv").config();

const express = require("express");
const multer = require("multer");
const { Resend } = require("resend");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   RESEND SETUP
========================= */
const resend = new Resend(process.env.RESEND_API_KEY);

/* =========================
   FILE UPLOAD SETUP
========================= */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

/* =========================
   SUPPORT ROUTE
========================= */
app.post("/support", upload.single("attachment"), async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      category,
      subject,
      message
    } = req.body;

    /* -------------------------
       ATTACHMENT HANDLING
    ------------------------- */
    let attachments = [];

    if (req.file) {
      attachments.push({
        filename: req.file.originalname,
        content: req.file.buffer
      });
    }

    /* -------------------------
       SEND EMAIL VIA RESEND
    ------------------------- */
    const response = await resend.emails.send({
      from: "Vindmy Support <support@vindmy.com>",
      to: ["hi@sanisa.co.za"], // YOUR ADMIN EMAIL
      replyTo: email,
      subject: `[${category}] ${subject}`,
      html: `
        <h2>New Support Request</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Category:</strong> ${category}</p>

        <hr>

        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
      attachments
    });

   if (response.error) {
  console.log("❌ Email failed:", response.error.message);
} else {
  console.log("✅ Email sent:", response);
}

    /* -------------------------
       SUCCESS RESPONSE
    ------------------------- */
    res.json({
      success: true,
      message: "Email sent successfully",
      resendId: response.id
    });

  } catch (error) {
    console.error("❌ Support form error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit support request."
    });
  }
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
