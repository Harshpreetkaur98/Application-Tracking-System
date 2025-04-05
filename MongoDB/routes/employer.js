const express = require("express");
const bcrypt = require("bcryptjs");
const Employer = require("../models/employer");

const router = express.Router();

// ✅ Employer Signup Route
router.post("/register", async (req, res) => {
  try {
    const { name = "", email, password } = req.body;

    // ✅ Check if all required fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if email already exists
    const existingEmployer = await Employer.findOne({ email });
    if (existingEmployer) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new employer
    const newEmployer = new Employer({ name, email, password: hashedPassword });
    await newEmployer.save();

    // ✅ Return success message (excluding password)
    res.status(201).json({
      message: "Employer registered successfully",
      user: { name: newEmployer.name, email: newEmployer.email },
    });

  } catch (err) {
    res.status(500).json({ message: "Error registering employer", error: err.message });
  }
});

module.exports = router;
