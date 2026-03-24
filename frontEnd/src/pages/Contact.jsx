import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
    const contacts = [
        { name: "A. Bhanu Prakash", phone: "+91 8500292426" },
        { name: "T. Ashok", phone: "+91 81798 65747" },
        { name: "M. Sree Ram", phone: "+91 97033 13572" }
    ];

    const [copiedIndex, setCopiedIndex] = useState(null);

    const handleCopy = (phone, index) => {
        navigator.clipboard.writeText(phone);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1500);
    };

    return (
        <div className="min-h-screen bg-bg-main flex flex-col font-body">
            <Navbar />

            <main className="flex-1 pt-32 pb-20 px-[6%]">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12 text-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary block mb-4">
                            Connect with us
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-gradient">
                            Contact <br /><span className="font-display">Suppport.</span>
                        </h1>
                    </header>

                    <div className="grid gap-6">
                        {contacts.map((contact, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-bg-secondary/40 border border-white/10 p-8 rounded-[2rem] shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary text-xl border border-white/5 shadow-inner group-hover:scale-110 transition-transform">
                                        <i className="fas fa-headset"></i>
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-xl font-black text-white italic tracking-tight">{contact.name}</h3>
                                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Team Leader</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-black/40 px-6 py-4 rounded-2xl border border-white/5 group-hover:bg-primary/5 transition-colors">
                                    <span className="text-lg font-black text-white tracking-widest">{contact.phone}</span>
                                    <button 
                                        onClick={() => handleCopy(contact.phone, index)}
                                        className="relative p-2 text-primary hover:text-white transition-colors"
                                    >
                                        <AnimatePresence mode="wait">
                                            {copiedIndex === index ? (
                                                <motion.i 
                                                    key="check"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className="fas fa-check-circle"
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
                                        {copiedIndex === index && (
                                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest pointer-events-none whitespace-nowrap">
                                                Copied!
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <p className="text-white/20 font-bold uppercase text-[10px] tracking-[0.3em] max-w-sm mx-auto leading-relaxed">
                            Need help with your booking? <br /> Our team is available 24/7 to assist you with any inquiries.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
