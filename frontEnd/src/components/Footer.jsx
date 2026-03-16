import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="pt-32 pb-12 px-[6%] bg-bg-main border-t border-white/5 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="flex flex-col md:flex-row justify-between mb-28 gap-16 relative z-10">
        <div className="max-w-[350px]">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-xs text-white">
              <i className="fas fa-play ml-0.5"></i>
            </div>
            <span className="font-display text-xl font-black tracking-tighter text-white">
              MOVIE <span className="text-primary italic">MUKKALU</span>
            </span>
          </div>
          <p className="text-text-muted text-base font-medium leading-relaxed">
            Redefining the cinematic management experience with premium tools 
            for viewers and vendors alike.
          </p>
          <div className="flex gap-4 mt-10">
            {['twitter', 'instagram', 'linkedin', 'facebook'].map((social) => (
              <a key={social} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:bg-primary/20 hover:text-primary transition-all duration-300">
                <i className={`fab fa-${social}`}></i>
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-20 lg:gap-32">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-10">
              Navigation
            </h4>
            <ul className="space-y-5">
              <li><Link to="/" className="text-sm font-bold text-text-muted hover:text-white transition-colors duration-300">Home</Link></li>
              <li><Link to="/" className="text-sm font-bold text-text-muted hover:text-white transition-colors duration-300">About</Link></li>
              <li><Link to="/booking" className="text-sm font-bold text-text-muted hover:text-white transition-colors duration-300">Book Tickets</Link></li>
              <li><a href="#stalls" className="text-sm font-bold text-text-muted hover:text-white transition-colors duration-300">Stalls</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-10">
              Legal
            </h4>
            <ul className="space-y-5">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm font-bold text-text-muted hover:text-white transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="pt-12 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-bold text-text-muted uppercase tracking-widest relative z-10">
        <p>&copy; {new Date().getFullYear()} Movie Mukkalu. Crafted for Cinema.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Support</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
