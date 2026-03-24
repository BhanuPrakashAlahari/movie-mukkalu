import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center px-[6%] overflow-hidden bg-bg-main">
      {/* Background Cinematic Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full animate-pulse-slow delay-700"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">

        <h1 className="text-5xl md:text-8xl lg:text-9xl font-black mb-8 pt-12 md:pt-0 animate-fade-up">
          <span className="text-gradient block mb-4">Experience</span>
          <span className="text-white font-display">The Magic.</span>
        </h1>

        <p className="text-white text-lg md:text-xl font-medium max-w-2xl mx-auto mb-14 leading-relaxed animate-fade-up delay-200">
          Seamless movie booking and vendor management tailored for the ultimate entertainment experience.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-300">
          <Link to="/booking" className="w-56 py-4 bg-primary rounded-xl flex items-center justify-center transition-all duration-300 active:scale-95">
            <span className="text-[13px] font-black uppercase tracking-[0.2em] text-white">Start Booking</span>
          </Link>

          <Link to="/stalls" className="w-56 py-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center transition-all duration-300">
            <span className="text-[13px] font-black uppercase tracking-[0.2em] text-white">Order Food</span>
          </Link>
        </div>
      </div>

      {/* Mouse Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-fade-up delay-1000 opacity-20 hover:opacity-100 transition-opacity duration-500">
        <div className="w-[22px] h-[36px] border-2 border-white rounded-full flex justify-center p-1.5">
          <motion.div 
            animate={{ 
              y: [0, 12, 0],
              opacity: [1, 0.5, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-1 h-1.5 bg-white rounded-full"
          />
        </div>
        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white ml-1">Scroll</span>
      </div>
    </section>
  );
};

export default Hero;
