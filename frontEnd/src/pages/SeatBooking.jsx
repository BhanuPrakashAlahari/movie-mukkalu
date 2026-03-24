import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { getBookedSeats, lockSeats, createRazorpayOrder, verifyPayment } from '../services/api';
import { MOVIES_DATA } from '../data/movies';

const SeatBooking = () => {
  const { dateId, showTime } = useParams();
  const navigate = useNavigate();
  
  const currentMovie = MOVIES_DATA[dateId]?.find(m => m.slug === showTime);
  const movieName = currentMovie?.name || "Movie";
  const poster = currentMovie?.poster || "";

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedStatus, setBookedStatus] = useState({ booked: [], locked: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: '', email: '' });
  const [conflictData, setConflictData] = useState(null);
  
  const pricePerTicket = 100;

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

  const fetchBookings = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const data = await getBookedSeats(dateId, showTime);
      setBookedStatus(data || { booked: [], locked: [] });
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const intervalId = setInterval(() => fetchBookings(false), 20000);
    return () => clearInterval(intervalId);
  }, [dateId, showTime]);

  const combinedUnavailable = [...bookedStatus.booked, ...bookedStatus.locked];

  const handleSeatClick = (seatId) => {
    if (combinedUnavailable.includes(seatId)) return;
    setSelectedSeats(prev => 
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const handleApplySuggestions = (suggestions) => {
    setSelectedSeats(prev => {
      const available = prev.filter(s => !conflictData.unavailableSeats.includes(s));
      return [...available, ...suggestions].slice(0, prev.length);
    });
    setConflictData(null);
    fetchBookings(); 
  };

  const handlePayClick = () => {
    if (selectedSeats.length === 0) return;
    setShowModal(true);
  };

  const handleFinalPayment = async (e) => {
    e.preventDefault();
    if (!userDetails.name || !userDetails.email) {
      alert("Please enter your name and email.");
      return;
    }

    try {
      setIsSubmitting(true);
      const lockResponse = await lockSeats(dateId, showTime, selectedSeats);
      
      if (!lockResponse.success) {
        if (lockResponse.reason === "SEAT_UNAVAILABLE") {
          setConflictData(lockResponse);
          setShowModal(false);
        } else {
          throw new Error(lockResponse.message || "Locking failed");
        }
        setIsSubmitting(false);
        return;
      }

      const order = await createRazorpayOrder(dateId, showTime, selectedSeats);
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SUx71yfaQ42aCV',
        amount: order.amount,
        currency: order.currency,
        name: "Movie Mokkalu",
        description: `Booking for ${movieName}`,
        image: poster,
        order_id: order.id,
        handler: async (response) => {
          try {
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
                totalPrice: selectedSeats.length * pricePerTicket,
                movieName,
                poster
              }
            });

            if (result.status === 'success') {
              alert(`Booking Confirmed! Order ID: ${response.razorpay_order_id}`);
              setSelectedSeats([]);
              setShowModal(false);
              setUserDetails({ name: '', email: '' });
              navigate('/'); 
            }
          } catch (err) {
            console.error('Verification failed:', err);
            alert("Payment verification failed.");
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: { name: userDetails.name, email: userDetails.email },
        theme: { color: "#A01A1A" },
        modal: { ondismiss: () => setIsSubmitting(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Payment initiation failed.');
      setIsSubmitting(false);
    }
  };

  const rows = ['A', 'B', 'C', 'D', 'E'];
  const seatsInRow = Array.from({ length: 14 }, (_, i) => i + 1);

  return (
    <div className="h-screen bg-[#050101] overflow-hidden flex flex-col font-body">
      <Navbar />
      
      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <div className="flex flex-col items-center justify-start min-h-full">
          
          <div className="w-full px-8 pt-32 md:pt-40 flex justify-between items-center relative z-[110]">
            <button onClick={() => navigate('/booking')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
              <i className="fas fa-chevron-left"></i> Back
            </button>
            <button onClick={() => fetchBookings()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-colors group">
              Refresh <i className={`fas fa-sync-alt ${isLoading ? 'animate-spin text-primary' : ''}`}></i>
            </button>
          </div>

          <div className="w-[90%] max-w-[500px] mb-16 md:mb-24 flex flex-col items-center animate-fade-up pointer-events-none relative mt-8 text-center">
            <div className="w-full relative h-[40px] md:h-[60px] flex justify-center">
               <div className="absolute top-0 w-full h-[150px] border-t-[3px] border-primary rounded-[100%] drop-shadow-[0_10px_20px_rgba(160,26,26,0.6)]"></div>
            </div>
            <p className="mt-6 md:mt-8 text-[11px] font-black text-white uppercase tracking-[0.5rem] italic z-10">THEATER SCREEN</p>
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
                          const isBooked = bookedStatus.booked.includes(seatId);
                          const isLocked = bookedStatus.locked.includes(seatId);
                          const isUnavailable = isBooked || isLocked;

                          return (
                            <React.Fragment key={seatId}>
                              <button
                                onClick={() => handleSeatClick(seatId)}
                                disabled={isUnavailable}
                                className={`
                                  relative w-8 h-8 md:w-11 md:h-11 rounded-lg border flex items-center justify-center text-[10px] font-black transition-all duration-300
                                  ${isBooked 
                                    ? 'bg-white/5 border-white/10 cursor-not-allowed opacity-30 shadow-inner' 
                                    : isLocked
                                      ? 'bg-white/5 border-white/10 cursor-not-allowed opacity-60'
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
                                ) : isLocked ? <i className="fas fa-clock text-[8px] opacity-40"></i> : seatId}
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

          <div className="flex justify-center gap-6 md:gap-14 pb-12 pt-8 opacity-40">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#120808] border border-white/20" />
              <span className="text-[10px] font-black uppercase text-white tracking-widest">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary shadow-glow" />
              <span className="text-[10px] font-black uppercase text-white tracking-widest">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-white/5 opacity-30 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-white rotate-45"></div>
              </div>
              <span className="text-[10px] font-black uppercase text-white tracking-widest">Sold</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-white/5 opacity-60 flex items-center justify-center">
                <i className="fas fa-clock text-[6px]"></i>
              </div>
              <span className="text-[10px] font-black uppercase text-white tracking-widest text-[#999]">Processing</span>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {conflictData && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-md bg-[#120808] p-10 rounded-[3rem] border border-primary/30 text-center shadow-3xl">
              <h3 className="text-3xl font-black text-white mb-4 italic text-primary uppercase">Seat Conflict</h3>
              <p className="text-white/60 text-sm mb-8">Some seats were already taken. Would you like to use these nearby suggestions instead?</p>
              
              <div className="flex flex-col gap-3 mb-8">
                <div className="text-[10px] font-black text-white/30 uppercase tracking-tighter mb-1">UNAVAILABLE</div>
                <div className="flex justify-center gap-2">
                  {conflictData.unavailableSeats.map(s => <span key={s} className="px-4 py-2 bg-white/5 rounded-xl text-white/40 border border-white/10 line-through decoration-primary">{s}</span>)}
                </div>
                
                <div className="text-[10px] font-black text-primary uppercase tracking-tighter mt-4 mb-1">SUGGESTED ALTERNATIVES</div>
                <div className="flex justify-center gap-2 flex-wrap">
                  {conflictData.suggestedSeats.length > 0 ? (
                    conflictData.suggestedSeats.map(s => <span key={s} className="px-4 py-2 bg-primary/10 rounded-xl text-primary border border-primary/20 font-black">{s}</span>)
                  ) : <span className="text-white/40">None nearby</span>}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => handleApplySuggestions(conflictData.suggestedSeats)}
                  className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase hover:shadow-glow-lg transition-all"
                >
                  APPLY SUGGESTIONS
                </button>
                <button onClick={() => setConflictData(null)} className="py-2 text-[10px] font-black text-white/40 uppercase tracking-tight">GO BACK TO SEAT MAP</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && !conflictData && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-md bg-[#120808] p-10 rounded-[3rem] border border-white/10 text-center">
              <h3 className="text-3xl font-black text-white mb-8 italic text-primary">Finalize Booking</h3>
              <form onSubmit={handleFinalPayment} className="flex flex-col gap-5">
                <input type="text" required placeholder="Full Name" value={userDetails.name} onChange={(e) => setUserDetails({...userDetails, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold" />
                <input type="email" required placeholder="Email Address" value={userDetails.email} onChange={(e) => setUserDetails({...userDetails, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold" />
                <button type="submit" disabled={isSubmitting} className="mt-6 w-full py-5 bg-primary text-white rounded-2xl font-black uppercase shadow-glow transition-all">{isSubmitting ? 'PROCESSING...' : 'CONFIRM & PAY'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="text-[10px] font-black text-white/40 uppercase mt-2">CANCEL</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedSeats.length > 0 && !showModal && !conflictData && (
          <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-[500px] z-50 bg-[#1a0808]/95 p-5 rounded-[2.5rem] flex items-center justify-between shadow-2xl border border-white/10 backdrop-blur-3xl">
            <div className="flex flex-col pl-4">
                <span className="text-xs font-black text-primary uppercase">{selectedSeats.length} SEATS</span>
                <button onClick={() => setSelectedSeats([])} className="text-[10px] font-black text-white/40 uppercase text-left">Clear</button>
            </div>
            <button onClick={handlePayClick} className="px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase shadow-glow">CHECKOUT ₹{selectedSeats.length * pricePerTicket}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeatBooking;
