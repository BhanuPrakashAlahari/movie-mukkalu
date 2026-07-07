const express = require('express');
const router = express.Router();
const stallController = require('../controllers/stallController');

// Get all stalls
router.get('/', stallController.getStalls);

// Create a new stall
router.post('/', stallController.createStall);

module.exports = router;
