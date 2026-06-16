const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
app.use(express.json());

// configure mail transporter (use Gmail App Password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tshegofatsoramokopu307@gmail.com",   // replace with your Gmail
    pass: "tshego16"      // use Gmail App Password
  }
});

// Step 1: send verification link
app.post("/api/send-delete-link", async (req, res) => {
  const { email } = req.body;
  const token = Math.random().toString(36).substr(2);
  const verifyUrl = `https://vindmy.com/api/verify-delete?token=${token}&email=${email}`;

  try {
    await transporter.sendMail({
      from: "tshegofatsoramokopu307@gmail.com",
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
      from: "tshegofatsoramokopu307@gmail.com",
      to: "maropengprecious247@gmail.com",
      subject: "Account Deletion Request",
      text: `Please delete account for: ${email}`
    });
    res.send("Your deletion request has been sent to support.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error notifying support");
  }
});

app.listen(3000, () => console.log("Server running on https://vindmy.com"));
import express from "express";
import multer from "multer";
import { Resend } from "resend";

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

const upload = multer({
    storage: multer.memoryStorage()
});

router.post(
    "/contact",
    upload.single("attachment"),
    async (req, res) => {

        try {
            const {
                name,
                email,
                mobile,
                category,
                subject,
                message
            } = req.body;

            const attachments = [];

            if (req.file) {
                attachments.push({
                    filename: req.file.originalname,
                    content: req.file.buffer
                });
            }

            await resend.emails.send({
                from: "tshegofatsoramokopu307@gmail.com",
                to: "maropengprecious247@gmail.com",
                reply_to: email,
                subject: `[${category}] ${subject}`,
                html: `
                    <h2>New Support Query</h2>

                    <p><strong>Name:</strong> ${name}</p>

                    <p><strong>Email:</strong> ${email}</p>

                    <p><strong>Mobile:</strong> ${mobile}</p>

                    <p><strong>Category:</strong> ${category}</p>

                    <p><strong>Subject:</strong> ${subject}</p>

                    <p><strong>Message:</strong></p>

                    <p>${message}</p>
                `,
                attachments
            });

            res.status(200).json({
                success: true,
                message: "Query submitted successfully."
            });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to submit query."
            });
        }
    }
);

export default router;

import express from "express";
import contactRoutes from "./routes/contact.js";

const app = express();

app.use("/api", contactRoutes);

app.listen(3000, () => {
    console.log("Server running");
});