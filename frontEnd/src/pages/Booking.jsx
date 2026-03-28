import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MOVIES_DATA } from '../data/movies';

const Booking = () => {
  const navigate = useNavigate();
  const dates = [
    { id: 29, label: 'MARCH 29', full: 'March 29th, 2026' },
    { id: 30, label: 'MARCH 30', full: 'March 30th, 2026' },
  ];

  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(() => {
    // Check if we have a pre-selected date passed in state
    if (location.state?.selectedDateId) {
      const foundDate = dates.find(d => d.id === location.state.selectedDateId);
      if (foundDate) return foundDate;
    }
    
    return dates[0];
  });

  const currentShows = MOVIES_DATA[selectedDate.id] || [];

  const handleSelectSeats = (showTimeSlug) => {
    navigate(`/booking/${selectedDate.id}/${showTimeSlug}`);
  };

  return (
    <div className="min-h-screen bg-bg-main selection:bg-primary selection:text-white">
      <Navbar />

      <main className="pt-32 pb-20 px-[6%]">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12">
            <button 
              onClick={() => navigate('/')}
              className="group flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-6"
            >
              <i className="fas fa-chevron-left text-xs group-hover:text-primary transition-colors"></i>
              <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
            </button>
            <h1 className="text-3xl md:text-5xl font-black text-white animate-fade-up">
              Select Your <span className="text-primary font-display">Show.</span>
            </h1>
          </header>

          {/* Tab Style Date Selector */}
          <div className="relative border-b border-white/10 mb-16 overflow-x-auto no-scrollbar">
            <div className="flex gap-10 md:gap-16 min-w-max pb-1">
              {dates.map((date) => (
                <button
                  key={date.id}
                  onClick={() => setSelectedDate(date)}
                  className={`relative py-4 text-[11px] md:text-sm font-black uppercase tracking-[0.2em] transition-colors duration-300 ${selectedDate.id === date.id ? 'text-white' : 'text-text-muted hover:text-white/60'
                    }`}
                >
                  {date.label}
                  {selectedDate.id === date.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-glow"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Show Times Grid */}
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {currentShows.length > 0 ? (
              currentShows.map((movie, index) => (
                <div
                  key={`${selectedDate.id}-${index}-${movie.name}`}
                  className="flex bg-bg-secondary/40 border border-white/10 rounded-xl overflow-hidden h-[170px] hover:border-white/30 transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Left Side: Poster */}
                  <div className="w-[120px] flex-shrink-0 border-r border-white/10">
                    <img
                      src={movie.poster}
                      alt={movie.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Right Side: Content */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <span className={`text-[7px] font-black uppercase tracking-[0.2em] block mb-0.5 px-2 py-0.5 w-fit rounded-full leading-none ${movie.status === 'Bookings closed!' ? 'bg-white/10 text-white/40' : 'text-primary bg-primary/10'
                        }`}>
                        {movie.status === 'Bookings closed!' ? 'Booking Closed' : 'Now Showing'}
                      </span>
                      <h3 className="text-base font-black text-white leading-tight line-clamp-1">{movie.name}</h3>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="leading-tight">
                        <p className="text-text-muted text-[7px] font-bold uppercase tracking-widest mb-0.5 opacity-60 font-display">Show Time</p>
                        <p className="text-white font-black text-sm whitespace-nowrap">{movie.time}</p>
                      </div>
                      <button
                        onClick={() => movie.status !== 'Bookings closed!' && handleSelectSeats(movie.slug)}
                        disabled={movie.status === 'Bookings closed!'}
                        className={`w-full h-9 text-[8px] font-black uppercase tracking-[0.2em] transition-all rounded-lg ${movie.status === 'Bookings closed!'
                            ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5 opacity-50'
                            : 'bg-primary text-white hover:bg-primary-light shadow-glow'
                          }`}
                      >
                        {movie.status === 'Bookings closed!' ? 'Bookings closed!' : 'Book Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                <i className="fas fa-film text-white/20 text-4xl mb-4 animate-pulse"></i>
                <p className="text-white/60 font-black uppercase tracking-[0.3em] text-xs">the movies will be revealed soon....</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;
