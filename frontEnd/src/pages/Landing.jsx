import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-bg-main selection:bg-primary selection:text-white font-body text-white relative flex flex-col justify-between">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center">
        <Hero />
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
