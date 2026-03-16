import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Booking = () => {
  const navigate = useNavigate();
  const dates = [
    { id: 27, label: 'MARCH 27', full: 'March 27th, 2026' },
    { id: 28, label: 'MARCH 28', full: 'March 28th, 2026' },
    { id: 29, label: 'MARCH 29', full: 'March 29th, 2026' },
    { id: 30, label: 'MARCH 30', full: 'March 30th, 2026' },
  ];

  const shows = [
    { time: '10:00 AM - 1:00 PM', slug: '10-00-AM-01-00-PM', status: 'Available' },
    { time: '1:15 PM - 4:15 PM', slug: '01-15-PM-04-15-PM', status: 'Fast Filling' },
    { time: '4:30 PM - 7:00 PM', slug: '04-30-PM-07-00-PM', status: 'Available' },
  ];

  const [selectedDate, setSelectedDate] = useState(dates[0]);

  const handleSelectSeats = (showTimeSlug) => {
    navigate(`/booking/${selectedDate.id}/${showTimeSlug}`);
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      
      <main className="pt-32 pb-20 px-[6%]">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 text-center md:text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary block mb-4 animate-fade-up">
              Step 01
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-gradient animate-fade-up">
              SELECT <br /><span className="italic font-display">YOUR SHOW.</span>
            </h1>
          </header>

          {/* Tab Style Date Selector */}
          <div className="relative border-b border-white/10 mb-16 overflow-x-auto no-scrollbar">
            <div className="flex gap-10 md:gap-16 min-w-max pb-1">
              {dates.map((date) => (
                <button
                  key={date.id}
                  onClick={() => setSelectedDate(date)}
                  className={`relative py-4 text-[11px] md:text-sm font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                    selectedDate.id === date.id ? 'text-white' : 'text-text-muted hover:text-white/60'
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

          {/* Show Times Grid with Animation */}
          <motion.div 
            layout
            className="grid md:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="wait">
              {shows.map((show, index) => (
                <motion.div
                  key={`${selectedDate.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group relative p-8 bg-bg-secondary/40 border border-white/[0.05] rounded-[2.5rem] hover:border-primary/40 hover:bg-bg-secondary transition-all duration-500"
                >
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary">
                      <i className="fas fa-clock"></i>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      show.status === 'Fast Filling' 
                        ? 'text-orange-500 border-orange-500/20 bg-orange-500/5' 
                        : 'text-green-500 border-green-500/20 bg-green-500/5'
                    }`}>
                      {show.status}
                    </span>
                  </div>

                  <div className="mb-8 p-6 bg-white/[0.02] border border-white/[0.03] rounded-2xl">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Movie Listing</p>
                      <h3 className="text-xl font-black text-white italic tracking-tight uppercase">Movie Name <span className="text-white/30">(TBA)</span></h3>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">Show Time</p>
                    <p className="text-white font-black text-xl">{show.time}</p>
                  </div>

                  <button 
                    onClick={() => handleSelectSeats(show.slug)}
                    className="mt-10 w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-primary hover:border-primary hover:shadow-glow transition-all duration-300"
                  >
                    Select Seats
                  </button>

                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.03] rounded-[2.5rem] transition-colors pointer-events-none"></div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;
