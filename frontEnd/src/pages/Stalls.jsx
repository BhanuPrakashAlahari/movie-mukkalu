import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Stalls = () => {
    return (
        <div className="min-h-screen bg-bg-main flex flex-col">
            <Navbar />

            <main className="flex-1 pt-32 pb-20 px-[6%] flex items-center justify-center">
                <div className="max-w-4xl w-full text-center">
                    <header className="mb-12">
                        <motion.span 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] font-black uppercase tracking-[0.4em] text-primary block mb-4"
                        >
                            Partnerships
                        </motion.span>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black text-gradient mb-8"
                        >
                            Food <br /><span className="font-display">Stalls.</span>
                        </motion.h1>
                    </header>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-bg-secondary/40 border border-white/10 p-12 md:p-20 rounded-[3rem] shadow-2xl backdrop-blur-xl relative overflow-hidden group"
                    >
                        
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"></div>
                        
                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-primary text-3xl shadow-glow">
                                <i className="fas fa-utensils"></i>
                            </div>
                            
                            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight italic">
                                "Food will be available on the day of booking..."
                            </h2>
                            
                            <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.3em] max-w-xs mx-auto leading-relaxed">
                                Explore a variety of local delicacies and snacks at our venue stalls.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Stalls;
