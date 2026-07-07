const express = require('express');
const router = express.Router();
const stallController = require('../controllers/stallController');


router.get('/', stallController.getStalls);


router.post('/', stallController.createStall);

module.exports = router;
