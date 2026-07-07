const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');


router.get('/', bookingController.getBookedSeats);


router.get('/rukku-bookings', bookingController.getBookingsHistory);


router.put('/:id/visited', bookingController.toggleVisitedStatus);


router.get('/:dateId/:showTime', bookingController.getBookedSeatsByPath);


router.post('/lock-seats', bookingController.lockSeats);


router.post('/create-order', bookingController.createOrder);


router.post('/verify-payment', bookingController.verifyPayment);


router.post('/cancel-order', bookingController.cancelOrder);

module.exports = router;
