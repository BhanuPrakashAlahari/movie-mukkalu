import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player';
import { getBookedSeats, lockSeats, createRazorpayOrder, verifyPayment, cancelOrder } from '../services/api';
import { MOVIES_DATA } from '../data/movies';

const SeatBooking = () => {
  const { dateId, showTime } = useParams();
  const navigate = useNavigate();

  // Find current movie details
  const currentMovie = MOVIES_DATA[dateId]?.find(m => m.slug === showTime);
  const movieName = currentMovie?.name || "Movie";
  const poster = currentMovie?.poster || "";
  const trailerUrl = currentMovie?.trailer || "";

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [alreadyBooked, setAlreadyBooked] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: '', email: '' });
  const [bookingSessionId, setBookingSessionId] = useState(null);

  const TICKET_LIMIT = 6;
  const calculateTotal = (count) => {
    if (count === 1) return 79;
    if (count === 2) return 149;
    return count * 69;
  };

  const fetchBookings = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const booked = await getBookedSeats(dateId, showTime);
      setAlreadyBooked(booked);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    // Auto refresh every 1 minute
    const intervalId = setInterval(() => {
      fetchBookings(false);
    }, 60000);

    return () => clearInterval(intervalId);
  }, [dateId, showTime]);

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) document.body.removeChild(existingScript);
    };
  }, []);

  const handleSeatClick = (seatId) => {
    if (alreadyBooked.includes(seatId)) return;

    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(s => s !== seatId);
      }
      if (prev.length >= TICKET_LIMIT) {
        alert(`You can select a maximum of ${TICKET_LIMIT} seats.`);
        return prev;
      }
      return [...prev, seatId];
    });
  };

  const handlePayClick = async () => {
    if (selectedSeats.length === 0) return;
    if (selectedSeats.length > TICKET_LIMIT) {
      alert(`Please select maximum ${TICKET_LIMIT} seats.`);
      return;
    }

    try {
      setIsSubmitting(true);

      // Lock the seats right after clicking checkout
      const lockResult = await lockSeats(dateId, showTime, selectedSeats);

      if (lockResult.success === false) {
        if (lockResult.reason === "SEAT_UNAVAILABLE") {
          const unavailable = (lockResult.unavailableSeats?.length > 0)
            ? `\nTaken: ${lockResult.unavailableSeats.join(', ')}`
            : "";

          alert(`Currently the seats are not available.${unavailable}\n\nPlease update your selection.`);
          fetchBookings(false); // Refresh UI to show the real status
        } else {
          alert(lockResult.message || "Could not lock seats.");
        }
        setIsSubmitting(false);
        return;
      }

      setBookingSessionId(lockResult.bookingSessionId);
      setShowModal(true);
    } catch (error) {
      console.error('Locking failed:', error);
      alert('Failed to reserve seats. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelModal = async () => {
    setShowModal(false);
    if (bookingSessionId) {
      try {
        await cancelOrder(bookingSessionId);
        setBookingSessionId(null);
      } catch (err) {
        console.error("Error releasing seats:", err);
      }
    }
  };

  /**
   * Production-Grade Razorpay Integration Logic
   */
  const handleFinalPayment = async (e) => {
    e.preventDefault();
    if (!userDetails.name || !userDetails.email) {
      alert("Please enter your name and email.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (!bookingSessionId) {
        throw new Error("Missing booking session. Please re-select seats.");
      }

      // 2. Create Razorpay Order using the bookingSessionId we already have
      const order = await createRazorpayOrder(bookingSessionId);

      if (!order || !order.id) {
        throw new Error("Failed to generate a secure Order ID from the server. Please check your backend.");
      }

      // 3. Configure Razorpay Modal (with debugging for the 'undefined' error)
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SUx71yfaQ42aCV';

      console.log('--- Razorpay Modal Initializing ---');
      console.log('Order ID:', order.id);
      console.log('Key length:', razorpayKey.length);

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "Movie Mokkalu",
        description: `Booking for ${movieName}`,
        image: poster,
        order_id: order.id,
        handler: async (response) => {
          try {
            // 4. Verify Payment & Finalize Booking
            const result = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingDetails: {
                name: userDetails.name,
                email: userDetails.email,
                dateId,
                showTime,
                displayTime: currentMovie?.time || showTime,
                seats: selectedSeats,
                totalPrice: calculateTotal(selectedSeats.length),
                movieName,
                poster
              }
            });

            if (result.status === 'success') {
              alert(`Booking Confirmed! Thank you, ${userDetails.name}.`);
              setAlreadyBooked(prev => [...prev, ...selectedSeats]);
              setSelectedSeats([]);
              setShowModal(false);
              setUserDetails({ name: '', email: '' });
              navigate('/');
            }
          } catch (err) {
            console.error('Verification failed:', err);
            alert("Payment verification failed. Please contact support if your money was deducted.");
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email
        },
        theme: {
          color: "#A01A1A"
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            // Proactively release seats when user cancels Razorpay modal
            cancelOrder(bookingSessionId).catch(err => console.error("Error releasing seats:", err));
            setBookingSessionId(null);
          }
        }
      };

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Checkout failed:', error);
      alert(error.message || 'Payment initiation failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setSelectedSeats([]);
  };

  const rows = ['A', 'B', 'C', 'D', 'E'];
  const seatsInRow = Array.from({ length: 14 }, (_, i) => i + 1);

  return (
    <div className="h-screen bg-[#050101] overflow-hidden flex flex-col font-body">
      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <div className="flex flex-col items-center justify-start min-h-full">

          <div className="w-full px-8 pt-12 md:pt-16 flex justify-between items-center relative z-[110]">
            <button
              onClick={() => navigate('/booking')}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
            >
              <i className="fas fa-chevron-left"></i> Back
            </button>

            <button
              onClick={() => fetchBookings()}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-colors group"
            >
              Refresh <i className={`fas fa-sync-alt ${isLoading ? 'animate-spin text-primary' : ''}`}></i>
            </button>
          </div>

          {/* Trailer Player Section - Now between Nav and Screen */}
          <div className="w-[90%] max-w-[500px] mt-8 mb-4 animate-fade-up">
            {trailerUrl ? (
              <div className="w-full aspect-video relative rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
                <ReactPlayer
                  url={trailerUrl}
                  playing={true}
                  controls={true}
                  muted={true}
                  width="100%"
                  height="100%"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  config={{
                    youtube: {
                      playerVars: { showinfo: 0, rel: 0, modestbranding: 1 }
                    }
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-32 flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-xl transition-all">
                <i className="fas fa-video-slash text-white/20 text-2xl mb-4"></i>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4rem]">Trailer not available</p>
              </div>
            )}
          </div>

          <div className="w-[85%] max-w-[440px] mb-12 flex flex-col items-center animate-fade-up pointer-events-none relative mt-4 text-center">
            <div className="w-full relative h-12 flex justify-center">
              <div
                className="w-full h-10 bg-gradient-to-b from-primary/30 to-transparent border-t-[3px] border-primary drop-shadow-[0_4px_12px_rgba(160,26,26,0.3)]"
                style={{ clipPath: 'polygon(0% 0%, 100% 0%, 93% 100%, 7% 100%)' }}
              ></div>
            </div>
            <p className="text-white ">Theater Screen</p>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto no-scrollbar py-6 md:py-10">
              <div className="flex justify-start md:justify-center min-w-max mx-auto px-8 transition-all duration-500">
                <div className="flex flex-col gap-4 md:gap-8">
                  {rows.map((row) => (
                    <div key={row} className="flex items-center gap-4 md:gap-10">
                      <span className="w-6 text-[11px] font-black text-white/30 italic">{row}</span>
                      <div className="flex items-center gap-2 md:gap-3">
                        {seatsInRow.map((seatNum, idx) => {
                          const seatId = `${row}${seatNum}`;
                          const isSelected = selectedSeats.includes(seatId);
                          const isBooked = alreadyBooked.includes(seatId);

                          return (
                            <React.Fragment key={seatId}>
                              <button
                                onClick={() => handleSeatClick(seatId)}
                                disabled={isBooked}
                                className={`
                                  relative w-8 h-8 md:w-11 md:h-11 rounded-lg border flex items-center justify-center text-[10px] font-black transition-all duration-300
                                  ${isBooked
                                    ? 'bg-white/5 border-white/10 cursor-not-allowed opacity-30 shadow-inner'
                                    : isSelected
                                      ? 'border-primary bg-primary text-white shadow-glow scale-110 z-10'
                                      : 'bg-[#120808] border-white/20 text-white hover:border-white'}
                                `}
                              >
                                {isBooked ? (
                                  <div className="absolute inset-0 flex items-center justify-center opacity-40">
                                    <div className="w-full h-px bg-white/60 rotate-45 transform"></div>
                                    <div className="w-full h-px bg-white/60 -rotate-45 transform absolute"></div>
                                  </div>
                                ) : seatId}
                              </button>
                              {(idx + 1) === 7 && <div className="w-10 md:w-24" />}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md bg-[#120808] p-10 rounded-[3rem] border border-white/10 text-center shadow-3xl"
            >
              <h3 className="text-3xl font-black text-white mb-8 italic">Finalize Booking</h3>
              <form onSubmit={handleFinalPayment} className="flex flex-col gap-5">
                <input
                  type="text" required placeholder="Full Name"
                  value={userDetails.name}
                  onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary focus:outline-none font-bold"
                />
                <input
                  type="email" required placeholder="Email Address"
                  value={userDetails.email}
                  onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary focus:outline-none font-bold"
                />
                <div className="mt-4 pt-4 border-t border-white/5 text-left flex flex-col gap-2">
                  <div className="flex justify-between uppercase text-[10px] font-black text-white/40">
                    <span>Selected: {selectedSeats.join(', ')}</span>
                    <span className="text-primary">Total: ₹{calculateTotal(selectedSeats.length)}</span>
                  </div>
                </div>
                <button
                  type="submit" disabled={isSubmitting}
                  className="mt-6 w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-glow active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'PROCESSING...' : 'CONFIRM & PAY'}
                </button>
                <button type="button" onClick={handleCancelModal} className="text-[10px] font-black text-white/40 uppercase mt-2">CANCEL</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedSeats.length > 0 && !showModal && (
          <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-[500px] z-50 bg-[#1a0808]/95 p-5 rounded-[2.5rem] flex items-center justify-between shadow-2xl border border-white/10 backdrop-blur-3xl">
            <div className="flex flex-col pl-4">
              <span className="text-xs font-black text-primary uppercase">{selectedSeats.length} SEATS</span>
              <button onClick={handleClear} className="text-[10px] font-black text-white/40 uppercase text-left">Clear selection</button>
            </div>
            <button
              onClick={handlePayClick}
              disabled={isSubmitting}
              className="px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-tight shadow-glow active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'RESERVING...' : `CHECKOUT ₹${calculateTotal(selectedSeats.length)}`}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeatBooking;
