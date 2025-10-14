const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

const users = {}; // Temporary user store (replace with DB later)
const otpStore = {}; // For holding OTPs temporarily

// Email transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // add to your .env
    pass: process.env.EMAIL_PASS, // add to your .env (use App Password)
  },
});

// Send OTP
router.post("/send-otp", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, password, createdAt: Date.now() };

  try {
    await transporter.sendMail({
      from: `NearbyNomad <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your NearbyNomad OTP",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP send error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Verify OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const stored = otpStore[email];
  if (!stored) return res.status(400).json({ message: "OTP not found. Request a new one." });
  if (stored.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

  // Optional: Check expiry (5 minutes)
  if (Date.now() - stored.createdAt > 5 * 60 * 1000) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  // Register the user
  users[email] = { password: stored.password };
  delete otpStore[email];

  res.json({ message: "Account verified successfully" });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (users[email] && users[email].password === password) {
    res.json({ message: "Login successful" });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
});

module.exports = router;
