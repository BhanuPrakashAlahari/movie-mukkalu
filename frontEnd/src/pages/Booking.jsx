import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MOVIES_DATA } from '../data/movies';

const Booking = () => {
  const navigate = useNavigate();
  const dates = [
    { id: 27, label: 'MAY 27', full: 'May 27th, 2026' },
    { id: 28, label: 'MAY 28', full: 'May 28th, 2026' },
    { id: 29, label: 'MAY 29', full: 'May 29th, 2026' },
    { id: 30, label: 'MAY 30', full: 'May 30th, 2026' },
  ];

  const [selectedDate, setSelectedDate] = useState(dates[0]);

  const currentShows = MOVIES_DATA[selectedDate.id] || [];

  const handleSelectSeats = (showTimeSlug) => {
    navigate(`/booking/${selectedDate.id}/${showTimeSlug}`);
  };

  return (
    <div className="min-h-screen bg-bg-main selection:bg-primary selection:text-white">
      <Navbar />

      <main className="pt-32 pb-20 px-[6%]">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 text-left">
            <h1 className="text-4xl md:text-6xl font-black text-gradient animate-fade-up">
              Select <br /><span className="font-display">Your Show.</span>
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
          <div className="grid md:grid-cols-3 gap-8">
            {currentShows.map((movie, index) => (
              <div
                key={`${selectedDate.id}-${index}-${movie.name}`}
                className="group relative p-6 bg-bg-secondary/40 border border-white/[0.05] rounded-xl transition-all duration-500 overflow-hidden"
              >
                {/* Poster Background */}
                <div className="absolute inset-x-0 top-0 h-48 overflow-hidden">
                  <img
                    src={movie.poster}
                    alt=""
                    className="w-full h-full object-cover opacity-20 transition-transform duration-1000 blur-sm"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-main/90"></div>
                </div>

                <div className="relative z-10 px-2 pt-4">

                  <div className="mb-6 flex gap-4 items-center">
                    <div className="w-20 h-28 rounded-xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0">
                      <img src={movie.poster} alt={movie.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Now Showing</p>
                      <h3 className="text-lg font-black text-white tracking-tight leading-tight">{movie.name}</h3>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 mb-8">
                    <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">Show Time</p>
                    <p className="text-white font-black text-lg">{movie.time}</p>
                  </div>

                  <button
                    onClick={() => handleSelectSeats(movie.slug)}
                    className="w-full py-4 bg-primary border border-primary rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all duration-300"
                  >
                    Select Seats
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;
