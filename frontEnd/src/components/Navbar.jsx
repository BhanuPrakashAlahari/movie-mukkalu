import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-[100] flex justify-between items-center px-[6%] py-7 bg-bg-main/60 backdrop-blur-2xl border-b border-white/[0.05]">
      <Link to="/" className="flex items-center gap-2 group cursor-pointer">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
          <i className="fas fa-play text-white text-xs ml-0.5"></i>
        </div>
        <span className="font-display text-xl font-black tracking-tighter text-white">
          MOVIE <span className="text-primary italic">MUKKALU</span>
        </span>
      </Link>
      
      <div className="hidden md:flex items-center gap-12">
        <Link to="/" className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted hover:text-white transition-all duration-300">About</Link>
        <Link to="/booking" className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted hover:text-white transition-all duration-300">Book Tickets</Link>
        <a href="#stalls" className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted hover:text-white transition-all duration-300">Stalls</a>
        <a href="#contact" className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted hover:text-white transition-all duration-300">Contact</a>
        <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 hover:border-primary/50 transition-all duration-300">
          Sign In
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
