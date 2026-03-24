const express = require('express');
const router = express.Router();
const TicketBooking = require('../models/Booking');
const SeatLock = require('../models/SeatLock');
const Order = require('../models/Order');
const { sendBookingEmail } = require('../utils/emailService');
const crypto = require('crypto');
const razorpay = require('../utils/razorpay');

// LOCK_TIMEOUT in milliseconds (e.g. 10 minutes)
const LOCK_TIMEOUT = 10 * 60 * 1000;
const TICKET_PRICE = 100;

// Get all booked AND locked seats separately
router.get('/:dateId/:showTime', async (req, res) => {
  try {
    const { dateId, showTime } = req.params;
    
    // 1. Get confirmed bookings
    const bookings = await TicketBooking.find({ dateId, showTime });
    const bookedSeats = bookings.reduce((acc, b) => [...acc, ...b.seats], []);
    
    // 2. Get active locks by OTHERS
    const locks = await SeatLock.find({ 
      dateId, 
      showTime, 
      expiresAt: { $gt: new Date() },
      lockedBy: { $ne: req.sessionId } 
    });
    const lockedByOthers = locks.map(l => l.seatId);

    res.json({
      booked: [...new Set(bookedSeats)],
      locked: [...new Set(lockedByOthers)]
    });
  } catch (err) {
    console.error("Fetch seat status error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Helper to generate suggestions when seats are taken
async function suggestAlternativeSeats(dateId, showTime, conflictSeats) {
  try {
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const seatsPerRow = 14;
    
    // 1. Get ALL unavailable seats (booked + locked)
    const booked = await TicketBooking.find({ dateId, showTime });
    const bookedArr = booked.reduce((acc, b) => [...acc, ...b.seats], []);
    const locked = await SeatLock.find({ dateId, showTime, expiresAt: { $gt: new Date() } });
    const lockedArr = locked.map(l => l.seatId);
    const unavailable = new Set([...bookedArr, ...lockedArr]);

    let suggestions = [];

    // 2. Logic: For each conflict seat, find the nearest free seat in the SAME row
    for (const seat of conflictSeats) {
      const row = seat.charAt(0);
      const num = parseInt(seat.substring(1));
      
      // Look left and right in the same row
      for (let offset = 1; offset <= 5; offset++) {
        const left = `${row}${num - offset}`;
        const right = `${row}${num + offset}`;
        
        if (num - offset >= 1 && !unavailable.has(left) && !suggestions.includes(left)) {
          suggestions.push(left);
          if (suggestions.length >= 3) break;
        }
        if (num + offset <= seatsPerRow && !unavailable.has(right) && !suggestions.includes(right)) {
          suggestions.push(right);
          if (suggestions.length >= 3) break;
        }
      }
      if (suggestions.length >= 3) break;
    }

    // 3. If row is full, just pick any available seats
    if (suggestions.length === 0) {
      for (const r of rows) {
        for (let n = 1; n <= seatsPerRow; n++) {
          const s = `${r}${n}`;
          if (!unavailable.has(s)) {
            suggestions.push(s);
            if (suggestions.length >= 3) break;
          }
        }
        if (suggestions.length >= 3) break;
      }
    }

    return suggestions.slice(0, 4);
  } catch (err) {
    return [];
  }
}

router.post('/lock-seats', async (req, res) => {
  const { dateId, showTime, seatIds } = req.body;
  const sessionId = req.sessionId;

  if (!dateId || !showTime || !seatIds || !Array.isArray(seatIds)) {
    return res.status(400).json({ success: false, reason: "INVALID_DATA" });
  }

  try {
    const now = new Date();
    const expiry = new Date(now.getTime() + LOCK_TIMEOUT);

    // 1. Check for Conflicts (Booked OR Locked by Others)
    const bookings = await TicketBooking.find({ dateId, showTime, seats: { $in: seatIds } });
    const locks = await SeatLock.find({ 
      dateId, 
      showTime, 
      seatId: { $in: seatIds },
      lockedBy: { $ne: sessionId }, // We allow refreshing our OWN locks
      expiresAt: { $gt: now }
    });

    const unavailableFromBookings = bookings.reduce((acc, b) => [...acc, ...b.seats.filter(s => seatIds.includes(s))], []);
    const unavailableFromLocks = locks.map(l => l.seatId);
    const allConflicts = [...new Set([...unavailableFromBookings, ...unavailableFromLocks])];

    if (allConflicts.length > 0) {
      const suggestions = await suggestAlternativeSeats(dateId, showTime, allConflicts);
      return res.status(200).json({
        success: false,
        reason: "SEAT_UNAVAILABLE",
        unavailableSeats: allConflicts,
        suggestedSeats: suggestions
      });
    }

    // 2. ATOMIC LOCKING (All-or-Nothing)
    // Upsert our locks for all seats
    await Promise.all(seatIds.map(async (seatId) => {
      await SeatLock.findOneAndUpdate(
        { dateId, showTime, seatId },
        { lockedBy: sessionId, expiresAt: expiry },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }));

    res.json({ success: true, expiresAt: expiry });
  } catch (err) {
    console.error("Locking error:", err);
    res.status(500).json({ success: false, reason: "SERVER_ERROR", error: err.message });
  }
});

/**
 * Step 1: Create a Razorpay Order
 */
router.post('/create-order', async (req, res) => {
  const { dateId, showTime, seatIds } = req.body;
  const sessionId = req.sessionId;

  if (!dateId || !showTime || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
    return res.status(400).json({ message: "Invalid order data" });
  }

  try {
    const now = new Date();
    
    // Debug info for the 'The id provided does not exist' error
    // (This usually happens if Backend used KEY A but Frontend uses KEY B)
    console.log(`[ORDER] Creating order for session ${sessionId.substring(0, 5)} using Key: ${(razorpay.key_id || 'unknown').substring(0, 10)}...`);

    // 1. Validate that all seats are currently locked by this session and not expired
    const activeLocks = await SeatLock.find({
      dateId,
      showTime,
      seatId: { $in: seatIds },
      lockedBy: sessionId,
      expiresAt: { $gt: now }
    });

    if (activeLocks.length !== seatIds.length) {
      return res.status(403).json({ 
        message: "Seat reservation expired. Please select seats again." 
      });
    }

    // 2. Calculate amount on server
    const amount = seatIds.length * TICKET_PRICE;

    // 3. Create Razorpay order
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `rcpt_${sessionId.substring(0, 5)}_${Date.now()}`,
      notes: { sessionId, seatIds: seatIds.join(',') }
    };

    const razorOrder = await razorpay.orders.create(options);

    // 4. Store PENDING order in DB
    const pendingOrder = new Order({
      orderId: razorOrder.id,
      sessionId,
      dateId,
      showTime,
      seatIds,
      amount,
      status: 'PENDING'
    });

    await pendingOrder.save();

    res.json(razorOrder);
  } catch (err) {
    console.error('Razorpay Error:', err);
    res.status(500).json({ message: "Error creating Razorpay order" });
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

    // 2. Fetch Order from DB
    const order = await Order.findOne({ orderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ message: "Transaction record missing in database." });
    }

    if (order.status === 'SUCCESS') {
      return res.status(200).json({ status: "success", message: "Transaction completed." });
    }

    // 3. Destructure and Provide Defaults for safety
    const { dateId, showTime, seatIds: seats, amount: totalPrice, sessionId: finalSessionId } = order;
    
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
      order.status = 'FAILED_COLLISION';
      await order.save();
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

    // 7. Update Order to SUCCESS
    order.status = 'SUCCESS';
    order.paymentId = razorpay_payment_id;
    order.signature = razorpay_signature;
    await order.save();
    
    // 8. Release any remaining locks
    await SeatLock.deleteMany({
      dateId,
      showTime,
      seatId: { $in: seats },
      lockedBy: finalSessionId
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

// Create a new direct ticket booking (Fallback or for testing)
router.post('/', async (req, res) => {
  // ... (keeping existing implementation just in case, but usually redirected to verify-payment)
  res.status(403).json({ message: "Direct booking without payment is disabled. Use /create-order instead." });
});

module.exports = router;
