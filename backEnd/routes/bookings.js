const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Get booked/reserved seats using query parameters
router.get('/', bookingController.getBookedSeats);

// Admin: Get all bookings (History)
router.get('/rukku-bookings', bookingController.getBookingsHistory);

// Admin: Toggle visited status
router.put('/:id/visited', bookingController.toggleVisitedStatus);

// Backward Compatibility: Get booked/reserved seats using path parameters
router.get('/:dateId/:showTime', bookingController.getBookedSeatsByPath);

// Atomic Seat Locking
router.post('/lock-seats', bookingController.lockSeats);

// Step 1: Create a Razorpay Order
router.post('/create-order', bookingController.createOrder);

// Step 2: Finalize Booking After Payment
router.post('/verify-payment', bookingController.verifyPayment);

// Step 3: Explicit Order Cancellation/Failure
router.post('/cancel-order', bookingController.cancelOrder);

module.exports = router;
