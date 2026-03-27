import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import VideoPlayer from '../components/ui/video-player';
import { getBookedSeats, lockSeats, createRazorpayOrder, verifyPayment, cancelOrder } from '../services/api';
import { MOVIES_DATA } from '../data/movies';

const SeatBooking = () => {
  const { dateId, showTime } = useParams();
  const navigate = useNavigate();

  const currentMovie = MOVIES_DATA[dateId]?.find(m => m.slug === showTime);
  const movieName = currentMovie?.name || "Movie";
  const poster = currentMovie?.poster || "";
  const trailerUrl = currentMovie?.trailer || "";

  useEffect(() => {
    if (currentMovie?.status === 'Bookings closed!') {
      alert("Bookings are closed for this show.");
      navigate('/booking', { state: { selectedDateId: parseInt(dateId) } });
    }
  }, [currentMovie, navigate, dateId]);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [alreadyBooked, setAlreadyBooked] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCheckoutPage, setShowCheckoutPage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: '', email: '', phone: '' });
  const [bookingSessionId, setBookingSessionId] = useState(null);

  const TICKET_LIMIT = 6;
  const calculateTotal = (count) => {
    if (count === 1) return 79;
    if (count === 2) return 149;
    if (count === 3) return 79 + 149;
    return count * 69;
  };

  const fetchBookings = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const booked = await getBookedSeats(dateId, showTime);
      setAlreadyBooked(booked || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const intervalId = setInterval(() => fetchBookings(false), 4000);
    return () => clearInterval(intervalId);
  }, [dateId, showTime]);

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
      if (prev.includes(seatId)) return prev.filter(s => s !== seatId);
      if (prev.length >= TICKET_LIMIT) {
        alert(`Maximum ${TICKET_LIMIT} seats.`);
        return prev;
      }
      return [...prev, seatId].sort();
    });
  };

  const handlePayClick = async () => {
    if (selectedSeats.length === 0) return;
    try {
      setIsSubmitting(true);
      const lockResult = await lockSeats(dateId, showTime, selectedSeats);
      if (lockResult.success === false) {
        const unavailable = lockResult.unavailableSeats || [];
        alert(unavailable.length > 0 
          ? `Seats ${unavailable.join(', ')} were just taken. Selection updated.` 
          : "Seats unavailable.");
        
        // Clear all selected seats so user can start a fresh transaction
        setSelectedSeats([]);
        
        fetchBookings(false);
        setIsSubmitting(false);
        return;
      }
      setBookingSessionId(lockResult.bookingSessionId);
      setShowCheckoutPage(true);
    } catch (error) {
      console.error('Locking failed:', error);
      alert('Failed to reserve seats.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelCheckout = async () => {
    setShowCheckoutPage(false);
    if (bookingSessionId) {
      try {
        await cancelOrder(bookingSessionId);
        setBookingSessionId(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFinalPayment = async (e) => {
    e.preventDefault();
    if (!userDetails.name || !userDetails.email || !userDetails.phone) return alert("Fill all details.");
    if (userDetails.phone.length !== 10) return alert("Contact number must be exactly 10 digits.");
    try {
      setIsSubmitting(true);
      const order = await createRazorpayOrder(bookingSessionId);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SUx71yfaQ42aCV',
        amount: order.amount,
        currency: order.currency,
        name: "Movie Mokkalu",
        order_id: order.id,
        handler: async (res) => {
          try {
            const result = await verifyPayment({ ...res, bookingDetails: { ...userDetails, dateId, showTime, seats: selectedSeats, totalPrice: calculateTotal(selectedSeats.length), movieName, poster, displayTime: currentMovie.time } });
            if (result.status === 'success') {
              alert("Booked!");
              navigate('/');
            } else {
              alert(result.message || "Booking verification failed.");
              setIsSubmitting(false);
            }
          } catch (err) {
            console.error(err);
            alert("An error occurred during verification. Please contact support.");
            setIsSubmitting(false);
          }
        },
        modal: { ondismiss: () => { setIsSubmitting(false); cancelOrder(bookingSessionId); } }
      };
      new window.Razorpay(options).open();
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const mainRows = ['A', 'B', 'C', 'D', 'E'];
  const lastRow = 'F';

  return (
    <div className="min-h-screen bg-[#050101] flex flex-col font-body text-white relative">
      <main className="flex-1 overflow-y-auto no-scrollbar pb-48">
        <div className="flex flex-col items-center justify-start min-h-full">

          <div className="w-full px-6 pt-10 flex justify-between items-center z-[110]">
            <button onClick={() => navigate('/booking', { state: { selectedDateId: parseInt(dateId) } })} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white">
              <i className="fas fa-chevron-left"></i> BACK
            </button>
            <button onClick={() => fetchBookings()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-primary">
              <i className={`fas fa-sync-alt ${isLoading ? 'animate-spin' : ''}`}></i>
            </button>
          </div>

          <div className="w-[94%] max-w-[600px] mt-6 animate-fade-up flex flex-col items-start">
            <VideoPlayer src={trailerUrl} />
            <div className="mt-6 text-left w-full">
              <h2 className="text-xl md:text-2xl font-black  font-display text-white " >Book Your Tickets</h2>
              <p className="text-[10px] md:text-[11px] font-black text-white/30  mt-1 ">Select Your Preferred Seats To Enjoy</p>
            </div>
          </div>

          <div className="w-[90%] max-w-[500px] mt-14 mb-10 flex flex-col items-center animate-fade-up pointer-events-none relative">
            <div className="w-full relative h-14 flex justify-center">
              <div className="w-full h-10 bg-gradient-to-b from-primary/50 to-transparent border-t-[5px] border-primary rounded-b-[100%] drop-shadow-[0_15px_40px_rgba(160,26,26,0.6)]"></div>
            </div>
            <p className="mt-6 text-[22px] text-white ">Theater Screen</p>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center py-20">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto no-scrollbar py-4 px-4">
              <div className="flex flex-col items-center gap-4 md:gap-7 transition-all duration-500 mx-auto min-w-max">
                {mainRows.map((row) => (
                  <div key={row} className="flex items-center gap-6">
                    <span className="w-6 text-[11px] font-black text-white/20">{row}</span>
                    <div className="flex items-center gap-2 md:gap-3">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((num, idx) => {
                        const id = `${row}${num}`;
                        const sel = selectedSeats.includes(id);
                        const bkd = alreadyBooked.includes(id);
                        return (
                          <React.Fragment key={id}>
                            <button
                              onClick={() => handleSeatClick(id)}
                              disabled={bkd}
                              className={`w-8 h-8 md:w-10 md:h-10 rounded-lg border flex items-center justify-center text-[10px] font-black transition-all duration-300 relative overflow-hidden ${bkd ? 'bg-white/5 border-white/5 opacity-20' : sel ? 'border-primary scale-110 shadow-glow' : 'bg-[#120808] border-white/10 hover:border-white/40'}`}
                              style={sel ? { backgroundImage: `url(${poster})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                            >
                              {!sel && <span className="relative z-10">{bkd ? "X" : num}</span>}
                            </button>
                            {idx === 5 && <div className="w-10 md:w-16" />}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="flex items-center gap-6">
                  <span className="w-6 text-[11px] font-black text-white/20">{lastRow}</span>
                  <div className="flex items-center gap-2 md:gap-3">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num, idx) => {
                      const id = `${lastRow}${num}`;
                      const sel = selectedSeats.includes(id);
                      const bkd = alreadyBooked.includes(id);
                      return (
                        <React.Fragment key={id}>
                          <button
                            onClick={() => handleSeatClick(id)}
                            disabled={bkd}
                            className={`w-8 h-8 md:w-10 md:h-10 rounded-lg border flex items-center justify-center text-[10px] font-black transition-all duration-300 relative overflow-hidden ${bkd ? 'bg-white/5 border-white/5 opacity-20' : sel ? 'border-primary scale-110 shadow-glow' : 'bg-[#120808] border-white/10 hover:border-white/40'}`}
                            style={sel ? { backgroundImage: `url(${poster})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                          >
                            {!sel && <span className="relative z-10">{bkd ? "X" : num}</span>}
                          </button>
                          {idx === 4 && <div className="w-16 md:w-32" />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selectedSeats.length > 0 && !showCheckoutPage && (
          <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} className="fixed bottom-0 left-0 w-full z-50 bg-[#120808]/95 py-3 px-6 rounded-t-[2rem] flex items-center justify-between shadow-2xl border-t border-white/10 backdrop-blur-3xl">
            <div className="flex flex-col pl-4">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">{selectedSeats.length} SEATS SELECTED</span>
              <span className="text-[13px] font-black text-white/60 uppercase mt-1">{selectedSeats.join(", ")}</span>
            </div>
            <button onClick={handlePayClick} disabled={isSubmitting} className="px-10 md:px-14 py-3 md:py-3.5 bg-primary text-white rounded-xl font-black uppercase text-xs shadow-glow active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <i className="fas fa-circle-notch animate-spin text-sm"></i>
              ) : (
                <>PAY ₹{calculateTotal(selectedSeats.length)}</>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCheckoutPage && (
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[300] bg-[#050101] flex flex-col font-body"
          >
            {/* Checkout Header */}
            <div className="w-full px-6 py-10 flex items-center justify-between border-b border-white/5">
              <button
                onClick={handleCancelCheckout}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <i className="fas fa-chevron-left text-white/60"></i>
              </button>
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <h1 className="font-display text-xl md:text-2xl font-black tracking-tighter text-white" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                  Movie <span className="text-primary">Mokkalu</span>
                </h1>
              </Link>
              <div className="w-10"></div> {/* Spacer */}
            </div>

            {/* Checkout Content */}
            <div className="flex-1 overflow-y-auto px-8 py-10 flex flex-col items-start gap-8">
              <div className="text-left animate-fade-up">
                <h2 className="text-3xl md:text-4xl font-black text-white  mb-2">Finalize Your Booking</h2>
                <p className="text-sm font-bold text-white/40 " >Enter Your Details To Receive Tickets</p>
              </div>

              <form onSubmit={handleFinalPayment} className="w-full max-w-xl flex flex-col gap-6 animate-fade-up delay-100">
                <div className="flex flex-col gap-4">
                  <input
                    type="text" required placeholder="Name"
                    value={userDetails.name}
                    onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-primary focus:outline-none transition-all"
                  />

                  <div className="flex flex-col gap-2">
                    <input
                      type="tel" required placeholder="Contact Number"
                      value={userDetails.phone}
                      maxLength="10"
                      onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-primary focus:outline-none transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <input
                      type="email" required placeholder="Email"
                      value={userDetails.email}
                      onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-primary focus:outline-none transition-all"
                    />
                    <div className="mt-1 ml-2">
                      <p className="text-[12px] text-red-500 leading-relaxed font-black">
                        * Please Enter a Valid Email & Contact Number As Your Tickets Will Be Sent.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-6 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-4">
                  <div className="flex justify-between items-center text-white/40 text-xs font-black tracking-widest">
                    <span>Selected Seats</span>
                    <span className="text-primary">{selectedSeats.join(", ")}</span>
                  </div>
                  <div className="flex justify-between items-center text-white text-xl font-black pt-4 border-t border-white/5">
                    <span>Total Amount</span>
                    <span>₹{calculateTotal(selectedSeats.length)}</span>
                  </div>
                </div>

                <button
                  type="submit" disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-white rounded-xl font-black tracking-widest text-sm shadow-glow active:scale-95 transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <i className="fas fa-circle-notch animate-spin text-lg"></i>
                  ) : (
                    "Proceed To Checkout"
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeatBooking;
