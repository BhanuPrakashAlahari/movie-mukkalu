import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e) => {
      // Check window scroll or any element scroll (for pages with internal containers)
      const scrollPos = window.scrollY || (e.target && e.target.scrollTop) || 0;
      
      if (scrollPos > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Use capture: true to listen for scroll events on inner scrollable containers
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const navLinks = [
    { name: 'Book Tickets', path: '/booking' },
    { name: 'Promotions', path: '/promotions' },
    { name: 'Stalls', path: '/stalls' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      isScrolled ? 'py-0' : 'py-4 md:py-6'
    }`}>
      <div className={`w-full mx-auto md:w-[88%] flex items-center justify-between px-6 md:px-10 h-20 md:h-22 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/[0.02] backdrop-blur-2xl border-b border-white/10 md:rounded-[2.5rem] md:mt-4 md:border md:shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]' 
          : 'bg-transparent border-transparent'
      }`}>
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <span className="font-display text-xl md:text-2xl font-black tracking-tighter text-white">
            Movie <span className="text-primary">Mokkalu</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted hover:text-white transition-colors duration-300 relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger Icon - More refined */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden w-12 h-12 flex flex-col items-center justify-center gap-1.5 focus:outline-none bg-white/5 rounded-full border border-white/10"
        >
          <motion.span 
            animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            className="w-5 h-0.5 bg-white block rounded-full"
          />
          <motion.span 
            animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
            className="w-5 h-0.5 bg-white block rounded-full"
          />
          <motion.span 
            animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            className="w-5 h-0.5 bg-white block rounded-full"
          />
        </button>
      </div>

      {/* Mobile Menu Overlay - Full Width and Premium */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-bg-main/95 backdrop-blur-3xl border-b border-white/10"
          >
            <div className="flex flex-col p-10 gap-8">
              {navLinks.map((link, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={link.name}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex justify-between items-center group"
                  >
                    <span className="text-2xl font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors">
                      {link.name}
                    </span>
                    <i className="fas fa-arrow-right text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0"></i>
                  </Link>
                </motion.div>
              ))}
              

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
