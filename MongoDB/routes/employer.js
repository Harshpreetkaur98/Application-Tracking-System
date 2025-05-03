const express = require("express");
const bcrypt = require("bcryptjs");
const Employer = require("../models/employer");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name = "", email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmployer = await Employer.findOne({ email });
    if (existingEmployer) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployer = new Employer({ name, email, password: hashedPassword });
    await newEmployer.save();

    res.status(201).json({
      message: "Employer registered successfully",
      user: { name: newEmployer.name, email: newEmployer.email },
    });

  } catch (err) {
    res.status(500).json({ message: "Error registering employer", error: err.message });
  }
});

module.exports = router;
