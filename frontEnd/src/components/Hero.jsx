import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-screen flex flex-col justify-center items-center text-center px-[6%] overflow-hidden bg-bg-main">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-[1000px] z-10 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-10 text-[10px] font-black tracking-[0.3em] uppercase text-primary border border-primary/20 rounded-full bg-primary/5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Live Booking Available
        </div>

        <h1 className="text-6xl md:text-[7.5rem] leading-[0.95] mb-8 text-gradient font-black">
          THE ART OF <br /> 
          <span className="italic font-display font-bold">CINEMA.</span>
        </h1>

        <p className="text-lg md:text-xl text-text-muted mb-14 max-w-[700px] mx-auto font-medium leading-relaxed">
          Elevate your movie-going experience. Seamless ticket booking and 
          stall management wrapped in a premium, focused interface.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link
            to="/booking"
            className="group relative px-10 py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(160,26,26,0.4)]"
          >
            <span className="relative z-10">Start Booking</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </Link>
          <a
            href="#about"
            className="px-10 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 hover:border-primary/50 transition-all duration-300"
          >
            Explore More
          </a>
        </div>
      </div>

      {/* Side Vignette */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]"></div>
    </section>
  );
};

export default Hero;
