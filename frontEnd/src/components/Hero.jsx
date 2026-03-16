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
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-10 animate-fade-up">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-glow"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Currently Premiering March 2026</span>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 animate-fade-up">
          <span className="text-gradient block mb-4">THE FUTURE</span>
          <span className="text-white italic font-display">OF CINEMA.</span>
        </h1>

        <p className="text-text-muted text-lg md:text-xl font-medium max-w-2xl mx-auto mb-14 leading-relaxed animate-fade-up delay-200">
          Seamless movie booking and vendor management tailored for the ultimate entertainment experience.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-up delay-300">
          <Link to="/booking" className="group relative px-12 py-5 bg-primary rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-glow hover:scale-105 active:scale-95">
            <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.3em] text-white">Start Booking</span>
          </Link>

          <Link to="/" className="px-12 py-5 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
            Register Stall
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;
