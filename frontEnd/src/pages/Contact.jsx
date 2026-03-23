import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      <Navbar />
      <main className="flex-1 pt-40 px-[6%] flex items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl font-black text-gradient uppercase italic">
          This is Contact Page
        </h1>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
