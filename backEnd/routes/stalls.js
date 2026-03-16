const express = require('express');
const router = express.Router();
const Stall = require('../models/Stall');

// Get all stalls
router.get('/', async (req, res) => {
  try {
    const stalls = await Stall.find().sort({ createdAt: -1 });
    res.json(stalls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new stall
router.post('/', async (req, res) => {
  const { stallName, ownerName, mobileNumber, email } = req.body;
  
  if (!stallName || !ownerName || !mobileNumber || !email) {
    return res.status(400).json({ message: "Missing required fields for stall registration." });
  }

  const stall = new Stall({
    stallName,
    ownerName,
    mobileNumber,
    email
  });

  try {
    const newStall = await stall.save();
    res.status(201).json(newStall);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
