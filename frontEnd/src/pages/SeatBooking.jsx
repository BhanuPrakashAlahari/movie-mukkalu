import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';

const SeatBooking = () => {
  const { dateId, showTime } = useParams();
  const navigate = useNavigate();
  
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeatsMap, setBookedSeatsMap] = useState({});
  const pricePerTicket = 100;

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem('mukkalu_bookings')) || {};
    setBookedSeatsMap(savedBookings);
  }, []);

  const currentShowKey = `${dateId}-${showTime}`;
  const alreadyBooked = bookedSeatsMap[currentShowKey] || [];

  const handleSeatClick = (seatId) => {
    if (alreadyBooked.includes(seatId)) return;
    
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(s => s !== seatId) 
        : [...prev, seatId]
    );
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) return;

    const newBookedSeats = [...alreadyBooked, ...selectedSeats];
    const newMap = { ...bookedSeatsMap, [currentShowKey]: newBookedSeats };
    
    setBookedSeatsMap(newMap);
    localStorage.setItem('mukkalu_bookings', JSON.stringify(newMap));
    setSelectedSeats([]);
    alert(`Payment Successful! ${selectedSeats.length} tickets booked.`);
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
      
      <main className="flex-1 flex flex-col items-center justify-start p-2 pt-28 md:pt-36 relative">
        {/* Back Button */}
        <div className="absolute top-24 left-4 md:left-8 z-10">
          <button 
            onClick={() => navigate('/booking')}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
          >
            <i className="fas fa-chevron-left"></i> Back
          </button>
        </div>

        {/* Bent Theater Screen Visual (Concave Bottom) */}
        <div className="w-[85%] max-w-[600px] mb-12 md:mb-16 animate-fade-up flex flex-col items-center relative">
            <div className="w-full h-1 bg-primary/60 rounded-[100%] shadow-[0_10px_30px_rgba(160,26,26,0.4)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            <p className="mt-4 text-[10px] md:text-[11px] font-black text-white uppercase tracking-[1em] italic text-center drop-shadow-glow">
                THEATER SCREEN
            </p>
        </div>

        {/* Seating Grid - Compact and Fit to Screen */}
        <div className="transform scale-[0.75] sm:scale-85 md:scale-95 transition-transform duration-500 w-full flex justify-center">
          <div className="flex flex-col gap-4 md:gap-8">
            {rows.map((row) => (
              <div key={row} className="flex items-center gap-3 md:gap-10">
                <span className="w-4 text-[9px] md:text-sm font-black text-white/30 italic font-display">{row}</span>
                
                <div className="flex gap-4 md:gap-12">
                  {columns.map((col) => (
                    <div key={col} className="flex gap-1.5 md:gap-3 px-2 py-1.5 rounded-xl border border-white/[0.03] bg-white/[0.01]">
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
                              relative w-7 h-7 md:w-10 md:h-10 rounded-lg border flex items-center justify-center text-[7px] md:text-[9px] font-black transition-all duration-300
                              ${isBooked 
                                ? 'bg-white/5 border-white/10 cursor-not-allowed overflow-hidden' 
                                : isSelected 
                                  ? 'bg-primary border-white text-white shadow-glow translate-z-10' 
                                  : 'bg-[#120808] border-white/20 text-white/60 hover:border-white hover:bg-white/5'}
                            `}
                          >
                            {/* The "X" for already booked seats cross vertices */}
                            {isBooked && (
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-white/40 rotate-45"></div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-white/40 -rotate-45"></div>
                                </div>
                            )}
                            
                            {/* Seat Label (Only visible if not booked, or if you want it behind the X) */}
                            <span className={isBooked ? 'opacity-20' : 'opacity-100'}>{seatId}</span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
                
                <span className="w-4 text-[9px] md:text-sm font-black text-white/30 italic font-display text-right">{row}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons for Desktop */}
        <div className="hidden md:flex mt-14 gap-6">
          {selectedSeats.length > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-4">
                <button onClick={handleClear} className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10">
                    Clear
                </button>
                <button onClick={handleBooking} className="px-12 py-4 bg-primary text-white border border-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-glow">
                    Pay Now
                </button>
            </motion.div>
          )}
        </div>
      </main>

      {/* Mobile Pay Bar (Clean Dock Style) */}
      <AnimatePresence>
        {selectedSeats.length > 0 && (
          <motion.div
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            exit={{ y: 200 }}
            className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-50 bg-[#1a0808]/90 backdrop-blur-xl border border-white/10 p-5 rounded-[2.5rem] flex items-center justify-between shadow-2xl"
          >
            <div className="flex flex-col pl-4">
                <span className="text-xs font-black text-primary uppercase tracking-widest">{selectedSeats.length} SEATS</span>
                <button onClick={handleClear} className="text-[10px] font-black text-white/40 uppercase tracking-widest text-left mt-0.5">CLEAR</button>
            </div>
            
            <button 
                onClick={handleBooking}
                className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-tight shadow-glow border border-white/20"
            >
                PAY ₹{selectedSeats.length * pricePerTicket}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="pb-8 hidden md:flex justify-center gap-10 opacity-30 select-none">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded bg-white/10 border border-white/20"></div>
           <span className="text-[8px] font-black uppercase text-white">Available</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded bg-primary shadow-glow"></div>
           <span className="text-[8px] font-black uppercase text-white">Selected</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded bg-white/5 relative border border-white/10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-white/40 rotate-45"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-white/40 -rotate-45"></div>
           </div>
           <span className="text-[8px] font-black uppercase text-white">Sold Out</span>
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;
