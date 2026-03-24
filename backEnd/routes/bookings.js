const express = require('express');
const router = express.Router();
const TicketBooking = require('../models/Booking');
const SeatLock = require('../models/SeatLock');
const Order = require('../models/Order');
const BookingSession = require('../models/BookingSession');
const { sendBookingEmail } = require('../utils/emailService');
const crypto = require('crypto');
const razorpay = require('../utils/razorpay');

// DYNAMIC LOCK TIMEOUTS
const INITIAL_LOCK_TIMEOUT = 2 * 60 * 1000; // 2 minutes
const PAYMENT_LOCK_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const TICKET_PRICE = 100;

// Get all booked OR reserved seats for a specific show
router.get('/:dateId/:showTime', async (req, res) => {
  try {
    const { dateId, showTime } = req.params;
    const sessionId = req.sessionId;
    
    // 1. Get truly CONFIRMED bookings from the final collection
    const bookings = await TicketBooking.find({ dateId, showTime });
    const confirmedSeats = bookings.reduce((acc, booking) => [...acc, ...booking.seats], []);
    
    // 2. Get seats currently in ACTIVE sessions (excluding our own)
    // We include LOCKED, PAYMENT_PENDING, and CONFIRMED (in case sync is slow)
    const activeSessions = await BookingSession.find({
      dateId,
      showTime,
      expiresAt: { $gt: new Date() },
      status: { $in: ['LOCKED', 'PAYMENT_PENDING', 'CONFIRMED'] },
      sessionId: { $ne: sessionId } // Don't block our own seats from ourselves
    });
    
    const reservedSeats = activeSessions.reduce((acc, session) => [...acc, ...session.seatIds], []);

    // Combine both sets
    const allUnavailableSeats = [...new Set([...confirmedSeats, ...reservedSeats])];
    
    res.json(allUnavailableSeats);
  } catch (err) {
    console.error("Fetch bookings error:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * Atomic Seat Locking
 * Requirements:
 * - Lock ONLY if AVAILABLE OR EXPIRED
 * - Allow SAME session to refresh its lock
 * - Prevent others from overriding active locks
 */
router.post('/lock-seats', async (req, res) => {
  const { dateId, showTime, seatIds } = req.body;
  const sessionId = req.sessionId;

  if (!dateId || !showTime || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
    return res.status(400).json({ message: "Invalid locking data" });
  }

  try {
    const now = new Date();
    const expiry = new Date(now.getTime() + INITIAL_LOCK_TIMEOUT);

    // 1. Check current availability
    const confirmedBookings = await TicketBooking.find({ dateId, showTime });
    const bookedSeats = confirmedBookings.reduce((acc, b) => [...acc, ...b.seats], []);
    
    const activeSessions = await BookingSession.find({
      dateId,
      showTime,
      expiresAt: { $gt: now },
      status: { $in: ['LOCKED', 'PAYMENT_PENDING'] },
      sessionId: { $ne: sessionId }
    });
    const lockedByOthers = activeSessions.reduce((acc, s) => [...acc, ...s.seatIds], []);
    
    const allUnavailable = new Set([...bookedSeats, ...lockedByOthers]);
    const unavailableInRequest = seatIds.filter(s => allUnavailable.has(s));

    if (unavailableInRequest.length > 0) {
      return res.status(200).json({ success: false, reason: "SEAT_UNAVAILABLE", unavailableSeats: unavailableInRequest });
    }

    // 2. CREATE BookingSession (Status: LOCKED, Expiry: 2 mins)
    const bookingSession = new BookingSession({
      sessionId,
      dateId,
      showTime,
      seatIds,
      status: 'LOCKED',
      expiresAt: expiry
    });
    await bookingSession.save();

    // 3. APPLY individual SeatLocks (with native mongo atomic check)
    const failedSeats = [];
    await Promise.all(seatIds.map(async (seatId) => {
      try {
        await SeatLock.findOneAndUpdate(
          { 
            dateId, 
            showTime, 
            seatId, 
            $or: [
              { lockedBy: sessionId },          // It's already mine (from refresh)
              { expiresAt: { $lt: now } }       // Or it has expired
            ]
          },
          { 
            lockedBy: sessionId, 
            bookingSessionId: bookingSession._id, 
            expiresAt: expiry 
          },
          { upsert: true, new: true, runValidators: true }
        );
      } catch (err) {
        // If 11000 Duplicate Key error or filter mismatch, alguien mas lo tomo
        failedSeats.push(seatId);
      }
    }));

    if (failedSeats.length > 0) {
      // ROLLBACK: Cleanup any partial success in this batch
      await BookingSession.deleteOne({ _id: bookingSession._id });
      await SeatLock.deleteMany({ bookingSessionId: bookingSession._id });

      return res.status(200).json({ 
        success: false, 
        reason: "SEAT_UNAVAILABLE", 
        unavailableSeats: failedSeats 
      });
    }

    res.json({ success: true, bookingSessionId: bookingSession._id, expiresAt: expiry });
  } catch (err) {
    console.error("Locking error:", err);
    res.status(500).json({ success: false, message: "Seat locking failed safely." });
  }
});

/**
 * Step 1: Create a Razorpay Order
 */
router.post('/create-order', async (req, res) => {
  const { bookingSessionId } = req.body;
  const sessionId = req.sessionId;

  try {
    const session = await BookingSession.findById(bookingSessionId);
    const now = new Date();
    
    if (!session || session.status === 'FAILED' || session.expiresAt < now) {
      return res.status(403).json({ message: "Session expired or invalid. Please re-select seats." });
    }

    // EXTEND EXPIRY: 5 minutes for payment phase
    const extendedExpiry = new Date(now.getTime() + PAYMENT_LOCK_TIMEOUT);

    // 2. Calculate amount
    const amount = session.seatIds.length * TICKET_PRICE;

    // 3. Create Razorpay order
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `rcpt_${session._id}`,
      notes: { sessionId, bookingSessionId: session._id.toString() }
    };

    const razorOrder = await razorpay.orders.create(options);

    // 4. UPDATE SESSION: Status PAYMENT_PENDING, extend expiry
    session.status = 'PAYMENT_PENDING';
    session.orderId = razorOrder.id;
    session.expiresAt = extendedExpiry;
    await session.save();

    // 5. EXTEND individual SeatLocks to match
    await SeatLock.updateMany(
      { bookingSessionId: session._id },
      { expiresAt: extendedExpiry }
    );

    res.json(razorOrder);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ message: "Error creating payment order." });
  }
});

/**
 * Step 2: Finalize Booking After Payment
 * Validates the payment signature and saves the booking.
 */
router.post('/verify-payment', async (req, res) => {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature,
    bookingDetails
  } = req.body;

  try {
    // 1. Verify Payment Signature (Security Check)
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing Razorpay payment identifiers." });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature." });
    }

    // 1.5. IDEMPOTENCY CHECK
    const existing = await TicketBooking.findOne({ 
      $or: [{ orderId: razorpay_order_id }, { paymentId: razorpay_payment_id }] 
    });
    
    if (existing) {
      return res.status(200).json({ status: "success", booking: existing, message: "Booking recovered." });
    }

    // 2. Fetch Session from DB
    const session = await BookingSession.findOne({ orderId: razorpay_order_id });
    if (!session) {
      return res.status(404).json({ message: "Transaction record missing in database." });
    }

    if (session.status === 'CONFIRMED') {
      return res.status(200).json({ status: "success", message: "Transaction completed." });
    }

    // 3. Destructure
    const { dateId, showTime, seatIds: seats, sessionId: finalSessionId } = session;
    const totalPrice = seats.length * TICKET_PRICE;
    
    // Safely destructure bookingDetails
    const details = bookingDetails || {};
    const name = details.name || "Customer";
    const email = details.email || "no-email@example.com";
    const displayTime = details.displayTime || showTime;
    const movieName = details.movieName || "Movie";
    const poster = details.poster || "";

    // 5. ATOMIC SEAT CHECK
    const existingBookings = await TicketBooking.find({ dateId, showTime });
    const allBookedSeats = existingBookings.reduce((acc, b) => [...acc, ...b.seats], []);
    
    const isAnySeatAlreadyBooked = seats.some(seat => allBookedSeats.includes(seat));
    
    if (isAnySeatAlreadyBooked) {
      const myBooking = await TicketBooking.findOne({ orderId: razorpay_order_id });
      if (myBooking) return res.status(200).json({ status: "success", booking: myBooking });

      console.error(`[CRITICAL] Collision during verification: ${razorpay_order_id}`);
      session.status = 'FAILED';
      await session.save();
      return res.status(409).json({ message: "Seats were lost during payment. Contact support with Order ID for refund." });
    }

    // 6. Create AND Save Booking
    const booking = new TicketBooking({
      name,
      email,
      dateId,
      showTime,
      displayTime,
      seats,
      totalPrice,
      movieName,
      poster,
      sessionId: finalSessionId,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });

    const newBooking = await booking.save();

    // 7. Update Session to CONFIRMED
    session.status = 'CONFIRMED';
    await session.save();
    
    // 8. Release any remaining locks
    await SeatLock.deleteMany({
      bookingSessionId: session._id
    });

    // 9. Send confirmation email
    await sendBookingEmail(newBooking);
    
    res.status(201).json({ status: "success", booking: newBooking });

  } catch (err) {
    console.error("Critical: Verify Payment 500 error:", err);
    res.status(500).json({ 
      message: "Internal error during finalization.",
      error: err.message 
    });
  }
});

/**
 * Step 3: Explicit Order Cancellation/Failure
 * Releases seats immediately instead of waiting for 10 min TTL.
 */
router.post('/cancel-order', async (req, res) => {
  const { bookingSessionId } = req.body;
  const sessionId = req.sessionId;

  try {
    const session = await BookingSession.findOne({ _id: bookingSessionId, sessionId });
    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    if (session.status !== 'CONFIRMED') {
      session.status = 'FAILED';
      await session.save();

      // Clear the locks
      await SeatLock.deleteMany({
        bookingSessionId: session._id,
        lockedBy: sessionId
      });
      
      return res.json({ message: "Order cancelled and seats released successfully." });
    }

    res.status(400).json({ message: "Confirmed orders cannot be cancelled." });
  } catch (err) {
    console.error("Cancellation error:", err);
    res.status(500).json({ message: "Error during order cancellation." });
  }
});

// Create a new direct ticket booking (Fallback or for testing)
router.post('/', async (req, res) => {
  // ... (keeping existing implementation just in case, but usually redirected to verify-payment)
  res.status(403).json({ message: "Direct booking without payment is disabled. Use /create-order instead." });
});

module.exports = router;
