import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="pt-32 pb-12 px-[6%] bg-bg-main border-t border-white/5 relative overflow-hidden">

      <div className="pt-12 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-bold text-text-muted uppercase tracking-widest relative z-10">
        <p>&copy; {new Date().getFullYear()} Movie Mukkalu. Crafted for Cinema.</p>
        <p>Made with ❤️ by Bhanu Prakash Alahari</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Contact US</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
