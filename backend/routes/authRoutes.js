import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// USER REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hash });

    res.json({ success: true, message: "Registered successfully" });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// USER / ADMIN LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
