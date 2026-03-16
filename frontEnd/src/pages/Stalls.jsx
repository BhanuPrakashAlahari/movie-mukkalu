import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getStalls, createStall } from '../services/api';

const Stalls = () => {
    const [stalls, setStalls] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        stallName: '',
        ownerName: '',
        mobileNumber: '',
        email: ''
    });

    const fetchStalls = async () => {
        try {
            setIsLoading(true);
            const data = await getStalls();
            setStalls(data);
        } catch (error) {
            console.error('Failed to fetch stalls:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStalls();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.stallName || !formData.ownerName || !formData.mobileNumber || !formData.email) {
            alert("Please fill all fields.");
            return;
        }

        try {
            setIsSubmitting(true);
            await createStall(formData);
            alert("Stall registered successfully!");
            setFormData({
                stallName: '',
                ownerName: '',
                mobileNumber: '',
                email: ''
            });
            fetchStalls(); // Refresh list
        } catch (error) {
            console.error('Failed to register stall:', error);
            alert("Failed to register stall. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-main flex flex-col">
            <Navbar />

            <main className="flex-1 pt-32 pb-20 px-[6%]">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-12 text-center md:text-left">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary block mb-4 animate-fade-up">
                            Partnerships
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-gradient animate-fade-up">
                            FOOD <br /><span className="italic font-display">STALLS.</span>
                        </h1>
                    </header>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Registration Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-bg-secondary/40 border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-xl"
                        >
                            <h2 className="text-2xl font-black text-white italic mb-8 uppercase tracking-tight">Register New Stall</h2>
                            
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Stall Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Stall Name"
                                        value={formData.stallName}
                                        onChange={(e) => setFormData({ ...formData, stallName: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition-colors font-bold"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Owner Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Owner Name"
                                        value={formData.ownerName}
                                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition-colors font-bold"
                                        required
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Mobile No.</label>
                                        <input
                                            type="tel"
                                            placeholder="Mobile Number"
                                            value={formData.mobileNumber}
                                            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition-colors font-bold"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Email ID</label>
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition-colors font-bold"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-6 w-full py-5 bg-primary text-white border-2 border-white/20 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                                >
                                    {isSubmitting ? 'Registering...' : 'Submit Registration'}
                                </button>
                            </form>
                        </motion.div>

                        {/* Stalls List */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">Available Stalls</h2>
                                <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">
                                    {stalls.length} Total
                                </span>
                            </div>

                            <div className="max-h-[600px] overflow-y-auto no-scrollbar flex flex-col gap-4 pr-1">
                                {isLoading ? (
                                    <div className="py-20 flex justify-center">
                                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : stalls.length === 0 ? (
                                    <div className="py-20 border border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-center px-10">
                                        <i className="fas fa-store-slash text-4xl text-white/10 mb-4"></i>
                                        <p className="text-white/40 font-bold uppercase text-[10px] tracking-widest">No stalls registered yet.</p>
                                    </div>
                                ) : (
                                    <AnimatePresence>
                                        {stalls.map((stall, index) => (
                                            <motion.div
                                                key={stall._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="group p-6 bg-bg-secondary/40 border border-white/5 rounded-3xl hover:border-primary/30 transition-all duration-300"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-14 h-14 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center text-primary text-xl group-hover:scale-110 transition-transform shadow-inner">
                                                            <i className="fas fa-utensils"></i>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <h3 className="text-lg font-black text-white italic uppercase leading-none mb-1">{stall.stallName}</h3>
                                                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                                                                <i className="fas fa-user-circle text-[8px]"></i> {stall.ownerName}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-col items-start md:items-end gap-1">
                                                        <div className="flex items-center gap-2 text-text-muted hover:text-white transition-colors">
                                                            <i className="fas fa-phone-alt text-[10px]"></i>
                                                            <span className="text-xs font-black">{stall.mobileNumber}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-text-muted hover:text-white transition-colors">
                                                            <i className="fas fa-envelope text-[10px]"></i>
                                                            <span className="text-xs font-black lowercase">{stall.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Stalls;
