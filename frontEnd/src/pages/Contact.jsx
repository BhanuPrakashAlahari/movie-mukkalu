import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
    const contacts = [
        { name: "A.Bhanu Prakash", phone: "+91 8500292426" },
        { name: "T.Ashok", phone: "+91 81798 65747" },
        { name: "M.Sree Ram", phone: "+91 97033 13572" },
        { name: "K.Umesh", phone: "+91 99665 11966" }
    ];

    const [copiedIndex, setCopiedIndex] = useState(null);

    const handleCopy = (phone, index) => {
        navigator.clipboard.writeText(phone);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1500);
    };

    return (
        <div className="min-h-screen bg-[#050101] flex flex-col font-body text-white selection:bg-primary selection:text-white">
            <Navbar />

            <main className="flex-1 pt-32 pb-32 px-[6%] overflow-hidden relative">
                {/* Visual Orbs */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <header className="mb-20 text-left animate-fade-up">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary block mb-4 italic">
                            ConnectWithUs
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] italic">
                           Contact <br />
                           <span className="text-primary font-display not-italic">Support.</span>
                        </h1>
                        <p className="mt-8 text-sm md:text-md font-bold text-white/30 max-w-lg leading-relaxed italic">
                            NeedHelpWithYourBooking?OurTeamIsAvailable24/7ToAssistYouWithAnyInquiries.
                        </p>
                    </header>

                    <div className="grid gap-8">
                        {contacts.map((contact, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.15, type: "spring", damping: 20 }}
                                className="group relative"
                            >
                                {/* Glow Background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]"></div>
                                
                                <div className="relative bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-3xl flex flex-col md:flex-row md:items-center justify-between gap-8 hover:border-white/20 transition-all duration-300">
                                    <div className="flex items-center gap-8">
                                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl flex items-center justify-center text-primary text-2xl border border-white/5 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                            <i className="fas fa-headset"></i>
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="text-2xl font-black text-white italic tracking-tight">{contact.name}</h3>
                                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1">TeamLeader</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 bg-black/60 pl-8 pr-4 py-4 rounded-[1.5rem] border border-white/5 shadow-inner group-hover:border-primary/20 transition-all">
                                        <span className="text-xl md:text-2xl font-black text-white tracking-widest font-mono">{contact.phone}</span>
                                        <button 
                                            onClick={() => handleCopy(contact.phone, index)}
                                            className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 active:scale-90"
                                        >
                                            <AnimatePresence mode="wait">
                                                {copiedIndex === index ? (
                                                    <motion.i 
                                                        key="check"
                                                        initial={{ scale: 0, rotate: -90 }}
                                                        animate={{ scale: 1, rotate: 0 }}
                                                        exit={{ scale: 0 }}
                                                        className="fas fa-check"
                                                    />
                                                ) : (
                                                    <motion.i 
                                                        key="copy"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        exit={{ scale: 0 }}
                                                        className="fas fa-copy"
                                                    />
                                                )}
                                            </AnimatePresence>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-24 pt-12 border-t border-white/5 text-center flex flex-col items-center">
                        <div className="w-16 h-1 bg-primary mb-8 rounded-full"></div>
                        <p className="text-white/10 font-black uppercase text-[10px] tracking-[0.5em] italic">
                             PoweredByMovieMokkaluEngineering
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
