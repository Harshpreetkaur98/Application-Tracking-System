const express = require("express");
const bcrypt = require("bcryptjs");
const Candidate = require("../models/candidate");

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json({ candidates });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching candidates', error: err.message });
  }
});


router.post("/register", async (req, res) => {
  try {
    const { name="", email, password, cvFilePath = "" } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCandidate = new Candidate({ name, email, password: hashedPassword, cvFilePath });
    await newCandidate.save();

    res.status(201).json({
      message: "Candidate registered successfully",
      user: { name: newCandidate.name, email: newCandidate.email },
    });

  } catch (err) {
    res.status(500).json({ message: "Error registering candidate", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if(email==="harshpreet.149kaur@gmail.com" && password==="kaur941.harshpreet"){
      res.status(200).json({
        message: "ADMIN login successfull",
        user: { name: "ADMIN", email: "harshpreet.149kaur@gmail.com" },
      });
    }
    
    else{
        const candidate = await Candidate.findOne({ email });
        if (!candidate) {
          return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, candidate.password);
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid email or password" });
        }

        res.status(200).json({
          message: "Login successful",
          user: { name: candidate.name, email: candidate.email },
        });

      }
    }
    catch (err) {
      res.status(500).json({ message: "Error logging in", error: err.message });
    }
});


module.exports = router;
