import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { getBookedSeats, createBooking } from '../services/api';
import { MOVIES_DATA } from '../data/movies';

const SeatBooking = () => {
  const { dateId, showTime } = useParams();
  const navigate = useNavigate();
  
  // Find current movie details
  const currentMovie = MOVIES_DATA[dateId]?.find(m => m.slug === showTime);
  const movieName = currentMovie?.name || "Movie";
  const poster = currentMovie?.poster || "";

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [alreadyBooked, setAlreadyBooked] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: '', email: '' });
  
  const pricePerTicket = 100;

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
      fetchBookings(false); // Don't show loading spinner for auto-refresh
    }, 60000);

    return () => clearInterval(intervalId);
  }, [dateId, showTime]);

  const handleManualRefresh = () => {
    fetchBookings();
  };


  const handleSeatClick = (seatId) => {
    if (alreadyBooked.includes(seatId)) return;
    
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(s => s !== seatId) 
        : [...prev, seatId]
    );
  };

  const handlePayClick = () => {
    if (selectedSeats.length === 0) return;
    setShowModal(true);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!userDetails.name || !userDetails.email) {
      alert("Please enter your name and email.");
      return;
    }

    try {
      setIsSubmitting(true);
      const bookingData = {
        name: userDetails.name,
        email: userDetails.email,
        dateId,
        showTime,
        displayTime: currentMovie?.time || showTime,
        seats: selectedSeats,
        totalPrice: selectedSeats.length * pricePerTicket,
        movieName,
        poster
      };

      await createBooking(bookingData);
      
      // Update local state after successful booking
      setAlreadyBooked(prev => [...prev, ...selectedSeats]);
      setSelectedSeats([]);
      setShowModal(false);
      setUserDetails({ name: '', email: '' });
      alert(`Booking Confirmed for ${movieName}! Thank you, ${userDetails.name}.`);
    } catch (error) {
      console.error('Booking failed:', error);
      alert(error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setSelectedSeats([]);
  };

  const rows = ['A', 'B', 'C', 'D', 'E'];
  const columns = [1, 2, 3]; 
  const seatsPerCell = [1, 2, 3, 4];

  return (
    <div className="h-screen bg-[#050101] overflow-hidden flex flex-col font-body">
      <Navbar />
      
      {/* Container with scrolling for seats */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <div className="flex flex-col items-center justify-start min-h-full">
          
          {/* Back Button */}
          <div className="w-full px-8 pt-32 md:pt-40 flex justify-between items-center relative z-[110]">

            <button 
              onClick={() => navigate('/booking')}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
            >
              <i className="fas fa-chevron-left"></i> Back
            </button>

            <button 
              onClick={handleManualRefresh}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-colors group"
            >
              Refresh <i className={`fas fa-sync-alt group-hover:rotate-180 transition-transform duration-500 ${isLoading ? 'animate-spin text-primary' : ''}`}></i>
            </button>
          </div>

          {/* Theater Screen Visual */}
          <div className="w-[90%] max-w-[500px] mb-16 md:mb-24 flex flex-col items-center animate-fade-up pointer-events-none relative mt-8">
            <div className="w-full relative h-[40px] md:h-[60px] flex justify-center">
               <div className="absolute top-0 w-full h-[150px] border-t-[3px] border-primary rounded-[100%] drop-shadow-[0_10px_20px_rgba(160,26,26,0.6)]"></div>
               <div className="absolute top-0 w-full h-[80px] bg-gradient-to-b from-primary/15 to-transparent rounded-[100%] blur-xl translate-y-2"></div>
            </div>
            <p className="mt-6 md:mt-8 text-[11px] md:text-[13px] font-black text-white uppercase tracking-[0.5rem] md:tracking-[1.2rem] text-center italic drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] z-10 whitespace-nowrap">
              THEATER SCREEN
            </p>
          </div>

          {/* Loading State or Grid */}
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Seating Grid */}
              <div className="w-full overflow-x-auto no-scrollbar py-10">
                <div className="flex justify-start md:justify-center min-w-max mx-auto px-12 md:px-0 transition-all duration-500">
                  <div className="flex flex-col gap-6 md:gap-10">
                    {rows.map((row) => (
                      <div key={row} className="flex items-center gap-6 md:gap-14">
                        <span className="w-6 text-[11px] md:text-sm font-black text-white/30 italic font-display">{row}</span>
                        
                        <div className="flex gap-10 md:gap-16">
                          {columns.map((col) => (
                            <div key={col} className="flex gap-3 md:gap-4 px-3 py-2 rounded-2xl border border-white/[0.05] bg-white/[0.01]">
                              {seatsPerCell.map((seatNum) => {
                                const seatIndex = (col - 1) * 4 + seatNum;
                                const seatId = `${row}${seatIndex}`;
                                const isSelected = selectedSeats.includes(seatId);
                                const isBooked = alreadyBooked.includes(seatId);

                                return (
                                  <button
                                    key={seatId}
                                    onClick={() => handleSeatClick(seatId)}
                                    disabled={isBooked}
                                    className={`
                                      relative w-9 h-9 md:w-11 md:h-11 rounded-lg border flex items-center justify-center text-[10px] md:text-[11px] font-black transition-all duration-300 overflow-hidden
                                      ${isBooked 
                                        ? 'bg-white/5 border-white/10 cursor-not-allowed' 
                                        : isSelected 
                                          ? 'border-primary shadow-glow scale-110 z-10' 
                                          : 'bg-[#120808] border-white/20 text-white hover:border-white hover:bg-white/5'}
                                    `}
                                  >
                                    {isBooked && (
                                        <div className="absolute inset-0 pointer-events-none">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-white/60 rotate-45"></div>
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-white/60 -rotate-45"></div>
                                        </div>
                                    )}

                                    {isSelected ? (
                                        <motion.img 
                                            initial={{ scale: 1.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            src={poster} 
                                            alt="" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className={`${isBooked ? 'opacity-20' : 'opacity-100'} font-black`}>{seatId}</span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                        
                        <span className="w-6 text-[11px] md:text-sm font-black text-white/30 italic font-display text-right">{row}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="pt-20 pb-10 flex flex-wrap justify-center gap-6 md:gap-12 opacity-40 select-none">
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded bg-white/10 border border-white/20"></div>
                   <span className="text-[10px] font-black uppercase text-white">Available</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded bg-primary shadow-glow border border-white/20"></div>
                   <span className="text-[10px] font-black uppercase text-white">Selected</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded bg-white/5 relative border border-white/10">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1.5px] bg-white/60 rotate-45"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1.5px] bg-white/60 -rotate-45"></div>
                   </div>
                   <span className="text-[10px] font-black uppercase text-white">Sold</span>
                </div>

              </div>
            </>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass-panel p-10 rounded-[3rem] border border-white/10 shadow-3xl text-center"
            >
              <h3 className="text-3xl font-black text-white mb-2 italic">Confirm Booking</h3>
              <p className="text-text-muted text-sm mb-8 font-medium">Please enter your details to finalize your tickets.</p>
              
              <form onSubmit={handleConfirmBooking} className="flex flex-col gap-5">
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    placeholder="Full Name"
                    value={userDetails.name}
                    onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition-colors font-bold"
                  />
                </div>
                <div className="relative">
                  <input 
                    type="email" 
                    required
                    placeholder="Email Address"
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition-colors font-bold"
                  />
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-4">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Selected Seats</span>
                    <span className="text-sm font-black text-white">{selectedSeats.join(', ')}</span>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Total Amount</span>
                    <span className="text-lg font-black text-primary italic">₹{selectedSeats.length * pricePerTicket}</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 w-full py-5 bg-primary text-white border-2 border-white/20 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm & Book Now'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Pay Bar */}
      <AnimatePresence>
        {selectedSeats.length > 0 && !showModal && (
          <motion.div
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            exit={{ y: 200 }}
            className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-[500px] z-50 bg-[#1a0808]/95 backdrop-blur-3xl border border-white/10 p-5 rounded-[2.5rem] flex items-center justify-between shadow-2xl"
          >
            <div className="flex flex-col pl-4">
                <span className="text-xs font-black text-primary uppercase tracking-widest">{selectedSeats.length} SEATS</span>
                <button onClick={handleClear} className="text-[10px] font-black text-white/40 uppercase tracking-widest text-left mt-0.5">CLEAR SELECTION</button>
            </div>
            
            <button 
                onClick={handlePayClick}
                className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-tight shadow-glow border border-white/30 active:scale-95 transition-transform"
            >
                PAY ₹{selectedSeats.length * pricePerTicket}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Pay Side Panel */}
      <div className="hidden md:block">
        <AnimatePresence>
            {selectedSeats.length > 0 && !showModal && (
            <motion.div initial={{ x: 100 }} animate={{ x: 0 }} exit={{ x: 100 }} className="fixed top-1/2 right-12 z-50 -translate-y-1/2 flex flex-col items-center gap-4 bg-bg-secondary/40 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-glow">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Total Pay</span>
                <p className="text-3xl font-black text-white italic font-display">₹{selectedSeats.length * pricePerTicket}</p>
                <div className="w-full h-[1px] bg-white/10 my-2"></div>
                <button onClick={handlePayClick} className="px-10 py-5 bg-primary text-white border-2 border-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-glow hover:scale-105 transition-all">
                    Pay Now
                </button>
            </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SeatBooking;
