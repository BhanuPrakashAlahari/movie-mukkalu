const TicketBooking = require('../models/Booking');
const SeatLock = require('../models/SeatLock');
const BookingSession = require('../models/BookingSession');
const { sendBookingEmail, sendAdminBookingEmail } = require('../utils/emailService');
const crypto = require('crypto');
const razorpay = require('../utils/razorpay');

// DYNAMIC LOCK TIMEOUTS
const INITIAL_LOCK_TIMEOUT = 2 * 60 * 1000; // 2 minutes
const PAYMENT_LOCK_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const TICKET_LIMIT = 6;

const calculatePrice = (count, movieName) => {
  if (count <= 0) return 0;
  return count * 1;
};

/**
 * Get booked/reserved seats using query parameters
 * GET /api/bookings?dateId=...&showTime=...
 */
const getBookedSeats = async (req, res) => {
  try {
    const { dateId, showTime } = req.query;
    const sessionId = req.sessionId;

    if (!dateId || !showTime) {
      return res.status(400).json({ message: "Missing dateId or showTime in query parameters." });
    }

    const bookings = await TicketBooking.find({ dateId, showTime });
    const confirmedSeats = bookings.reduce((acc, booking) => [...acc, ...booking.seats], []);

    const activeSessions = await BookingSession.find({
      dateId,
      showTime,
      expiresAt: { $gt: new Date() },
      status: { $in: ['LOCKED', 'PAYMENT_PENDING', 'CONFIRMED'] },
      sessionId: { $ne: sessionId }
    });

    const reservedSeats = activeSessions.reduce((acc, session) => [...acc, ...session.seatIds], []);
    const allUnavailableSeats = [...new Set([...confirmedSeats, ...reservedSeats])];

    res.json(allUnavailableSeats);
  } catch (err) {
    console.error("Fetch bookings (query) error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Admin: Get all bookings (History)
 * GET /api/bookings/rukku-bookings
 */
const getBookingsHistory = async (req, res) => {
  try {
    const allBookings = await TicketBooking.find().sort({ createdAt: -1 });
    res.json(allBookings);
  } catch (err) {
    console.error("Fetch all bookings error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Admin: Toggle visited status
 * PUT /api/bookings/:id/visited
 */
const toggleVisitedStatus = async (req, res) => {
  try {
    const { visited } = req.body;
    const updated = await TicketBooking.findByIdAndUpdate(
      req.params.id,
      { visited },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Toggle visited error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Backward compatibility: Get booked/reserved seats using path parameters
 * GET /api/bookings/:dateId/:showTime
 */
const getBookedSeatsByPath = async (req, res) => {
  try {
    const { dateId, showTime } = req.params;
    const sessionId = req.sessionId;

    const bookings = await TicketBooking.find({ dateId, showTime });
    const confirmedSeats = bookings.reduce((acc, booking) => [...acc, ...booking.seats], []);

    const activeSessions = await BookingSession.find({
      dateId,
      showTime,
      expiresAt: { $gt: new Date() },
      status: { $in: ['LOCKED', 'PAYMENT_PENDING', 'CONFIRMED'] },
      sessionId: { $ne: sessionId }
    });

    const reservedSeats = activeSessions.reduce((acc, session) => [...acc, ...session.seatIds], []);
    const allUnavailableSeats = [...new Set([...confirmedSeats, ...reservedSeats])];

    res.json(allUnavailableSeats);
  } catch (err) {
    console.error("Fetch bookings (path) error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Atomic Seat Locking
 * POST /api/bookings/lock-seats
 */
const lockSeats = async (req, res) => {
  const { dateId, showTime, seatIds, movieName } = req.body;
  const sessionId = req.sessionId;

  if (!dateId || !showTime || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
    return res.status(400).json({ message: "Invalid locking data" });
  }

  if (seatIds.length > TICKET_LIMIT) {
    return res.status(403).json({ message: `Maximum ${TICKET_LIMIT} tickets allowed per booking.` });
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

    // 2. CREATE BookingSession
    const bookingSession = new BookingSession({
      sessionId,
      dateId,
      showTime,
      seatIds,
      movieName,
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
        // If 11000 Duplicate Key error or filter mismatch, someone else locked it
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
};

/**
 * Step 1: Create a Razorpay Order
 * POST /api/bookings/create-order
 */
const createOrder = async (req, res) => {
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

    // Calculate amount
    const amount = calculatePrice(session.seatIds.length, session.movieName);

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100) + (76 * session.seatIds.length), // convert to paise and add 76 paise per ticket surcharge
      currency: "INR",
      receipt: `rcpt_${session._id}`,
      notes: { sessionId, bookingSessionId: session._id.toString() }
    };

    const razorOrder = await razorpay.orders.create(options);

    // UPDATE SESSION
    session.status = 'PAYMENT_PENDING';
    session.orderId = razorOrder.id;
    session.expiresAt = extendedExpiry;
    await session.save();

    // EXTEND individual SeatLocks to match
    await SeatLock.updateMany(
      { bookingSessionId: session._id },
      { expiresAt: extendedExpiry }
    );

    res.json(razorOrder);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ message: "Error creating payment order." });
  }
};

/**
 * Step 2: Finalize Booking After Payment
 * POST /api/bookings/verify-payment
 */
const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingDetails
  } = req.body;

  try {
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing Razorpay payment identifiers." });
    }

    // Verify Payment Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature." });
    }

    // IDEMPOTENCY CHECK
    const existing = await TicketBooking.findOne({
      $or: [{ orderId: razorpay_order_id }, { paymentId: razorpay_payment_id }]
    });

    if (existing) {
      return res.status(200).json({ status: "success", booking: existing, message: "Booking recovered." });
    }

    // Fetch Session from DB
    const session = await BookingSession.findOne({ orderId: razorpay_order_id });
    if (!session) {
      return res.status(404).json({ message: "Transaction record missing in database." });
    }

    if (session.status === 'CONFIRMED') {
      return res.status(200).json({ status: "success", message: "Transaction completed." });
    }

    const { dateId, showTime, seatIds: seats, sessionId: finalSessionId, movieName: sessionMovieName } = session;
    const totalPrice = calculatePrice(seats.length, sessionMovieName) + (0.76 * seats.length);

    // Safely destructure bookingDetails
    const details = bookingDetails || {};
    const name = details.name || "Customer";
    const email = details.email || "no-email@example.com";
    const phone = details.phone || "no-phone";
    const displayTime = details.displayTime || showTime;
    const movieName = details.movieName || "Movie";
    const poster = details.poster || "";

    // ATOMIC SEAT CHECK
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

    // Create AND Save Booking
    const booking = new TicketBooking({
      name,
      email,
      phone,
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

    // Update Session to CONFIRMED
    session.status = 'CONFIRMED';
    await session.save();

    // Release any remaining locks
    await SeatLock.deleteMany({
      bookingSessionId: session._id
    });

    // Send confirmation Emails in parallel
    await Promise.allSettled([
      sendBookingEmail(newBooking),
      sendAdminBookingEmail(newBooking)
    ]);

    res.status(201).json({ status: "success", booking: newBooking });

  } catch (err) {
    console.error("Critical: Verify Payment 500 error:", err);
    res.status(500).json({
      message: "Internal error during finalization.",
      error: err.message
    });
  }
};

/**
 * Step 3: Explicit Order Cancellation/Failure
 * POST /api/bookings/cancel-order
 */
const cancelOrder = async (req, res) => {
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
};

module.exports = {
  getBookedSeats,
  getBookingsHistory,
  toggleVisitedStatus,
  getBookedSeatsByPath,
  lockSeats,
  createOrder,
  verifyPayment,
  cancelOrder
};
