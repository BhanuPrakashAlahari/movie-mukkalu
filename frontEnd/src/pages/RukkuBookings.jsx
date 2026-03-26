import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRukkuBookings, toggleBookingVisited } from '../services/api';
import { MOVIES_DATA } from '../data/movies';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RukkuBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMovie, setSelectedMovie] = useState('AllMovies');

    // Extract unique movie names from MOVIES_DATA
    const movieNames = ['AllMovies', ...new Set(Object.values(MOVIES_DATA).flat().map(m => m.name))];

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const data = await getRukkuBookings();
                setBookings(data);
            } catch (error) {
                console.error('FailedToFetchBookingHistory:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAll();
    }, []);

    const handleToggleVisited = async (id, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            // Optimistic Update
            setBookings(prev => prev.map(b => b._id === id ? { ...b, visited: newStatus } : b));
            
            await toggleBookingVisited(id, newStatus);
        } catch (error) {
            console.error('FailedToToggleVisited:', error);
            // Revert on error
            setBookings(prev => prev.map(b => b._id === id ? { ...b, visited: currentStatus } : b));
        }
    };

    const filteredBookings = bookings.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             b.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMovie = selectedMovie === 'AllMovies' || b.movieName === selectedMovie;
        return matchesSearch && matchesMovie;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-[#050101] flex flex-col font-body text-white selection:bg-primary selection:text-white">
            <Navbar />

            <main className="flex-1 pt-32 pb-20 px-[6%] relative overflow-hidden">
                {/* Visual Glows */}
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none animate-pulse-slow delay-1000"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-up">
                        <div className="text-left">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary block mb-4 italic">
                                AdministrativePortal
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic">
                               Rukku<span className="text-primary font-display not-italic">Bookings.</span>
                            </h1>
                            <div className="mt-6 flex items-baseline gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary italic mb-1">TotalRevenue(Filtered)</span>
                                    <h2 className="text-3xl font-black italic tracking-tighter text-white">
                                        ₹{filteredBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0).toLocaleString('en-IN')}
                                    </h2>
                                </div>
                                <div className="h-10 w-px bg-white/10 mx-2"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic mb-1">TicketCount</span>
                                    <h2 className="text-3xl font-black italic tracking-tighter text-white/40">
                                        {filteredBookings.length}
                                    </h2>
                                </div>
                            </div>
                            <p className="mt-8 text-sm font-bold text-white/30 italic">
                                DetailedSystemReportOfAllTicketTransactions
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            {/* Movie Filter */}
                            <div className="relative w-full md:w-64">
                                <select 
                                    value={selectedMovie}
                                    onChange={(e) => setSelectedMovie(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary focus:outline-none transition-all appearance-none italic font-bold text-xs cursor-pointer"
                                >
                                    {movieNames.map(name => (
                                        <option key={name} value={name} className="bg-bg-main text-white">{name}</option>
                                    ))}
                                </select>
                                <i className="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-primary/60 pointer-events-none text-[10px]"></i>
                            </div>

                            {/* Search */}
                            <div className="relative w-full md:w-64">
                                <input 
                                    type="text"
                                    placeholder="SearchNamesOrEmails..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary focus:outline-none transition-all placeholder:text-white/20 italic font-bold text-xs"
                                />
                                <i className="fas fa-search absolute right-6 top-1/2 -translate-y-1/2 text-white/20"></i>
                            </div>
                        </div>
                    </header>

                    {isLoading ? (
                        <div className="h-96 flex flex-col items-center justify-center gap-6 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl animate-pulse">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">FetchingCloudData...</span>
                        </div>
                    ) : (
                        <div className="bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl animate-fade-up delay-100">
                            <div className="overflow-x-auto no-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-white/5 uppercase text-[10px] font-black tracking-widest text-white/40">
                                            <th className="px-8 py-6 w-16">MarkVisited</th>
                                            <th className="px-8 py-6">CustomerInfo</th>
                                            <th className="px-8 py-6">MovieSelection</th>
                                            <th className="px-8 py-6">SeatsReserved</th>
                                            <th className="px-8 py-6">AmountPaid</th>
                                            <th className="px-8 py-6">TransactionTime</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm font-sans">
                                        {filteredBookings.length > 0 ? (
                                            filteredBookings.map((booking, index) => (
                                                <motion.tr 
                                                    key={booking._id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className={`hover:bg-white/[0.03] transition-colors group ${booking.visited ? 'opacity-40' : 'opacity-100'}`}
                                                >
                                                    <td className="px-8 py-6">
                                                        <button 
                                                            onClick={() => handleToggleVisited(booking._id, booking.visited)}
                                                            className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                                                                booking.visited 
                                                                    ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]' 
                                                                    : 'bg-white/5 border-white/10 text-white/10 hover:border-primary/50'
                                                            }`}
                                                        >
                                                            <i className={`fas ${booking.visited ? 'fa-check' : 'fa-clock'} text-xs`}></i>
                                                        </button>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-white font-black italic">{booking.name}</span>
                                                            <span className="text-white/30 text-[10px] font-bold font-mono">{booking.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <img src={booking.poster} alt="" className="w-8 h-10 rounded shadow-md object-cover border border-white/10" />
                                                            <div className="flex flex-col">
                                                                <span className="text-white font-black italic text-[11px] uppercase tracking-tighter">{booking.movieName}</span>
                                                                <span className="text-[9px] font-black text-primary/60 uppercase">{booking.displayTime}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-wrap gap-1">
                                                            {booking.seats.map(s => (
                                                                <span key={s} className="px-2 py-1 bg-primary/10 border border-primary/20 rounded text-[9px] font-black text-primary">
                                                                    {s}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="text-lg font-black text-white italic tracking-tighter">₹{booking.totalPrice}</span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="text-white/30 font-bold text-[9px] uppercase tracking-tight">{formatDate(booking.createdAt)}</span>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-8 py-20 text-center text-white/20 font-black italic uppercase tracking-widest">
                                                    NoArchivesFoundMatchingYourRequest.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="mt-12 flex justify-between items-center text-[10px] font-black text-white/20 uppercase tracking-[0.2em] italic">
                        <span>TotalRecordCount: {filteredBookings.length}</span>
                        <span>GeneratedByMovieMokkaluCore</span>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default RukkuBookings;
