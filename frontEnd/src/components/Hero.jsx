import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMovies } from '../context/MovieContext';

const Hero = () => {
  const { moviesData, loading } = useMovies();
  
  const showcaseMovies = [
    {
      name: "Salaar",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243294/kushi_ffkvjj.jpg", 
      rotate: "-6deg",
      y: "10px",
      x: "-20px",
    },
    {
      name: "Salaar Real",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243229/salaar_khs9kg.jpg",
      rotate: "-2deg",
      y: "60px",
      x: "80px",
    },
    {
      name: "Kanchana",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243228/kanchana_rgz5fg.jpg",
      rotate: "4deg",
      y: "-20px",
      x: "10px",
    }
  ];

  
  const getPoster = (name) => {
    if (loading) return "";
    for (const date of Object.keys(moviesData)) {
      const match = moviesData[date]?.find(m => m.name === name);
      if (match) return match.poster;
    }
    return "";
  };

  const featuredCollage = [
    { name: "Salaar", rotate: -8, x: -30, y: 20, delay: 0 },
    { name: "Kanchana", rotate: 6, x: 40, y: -10, delay: 0.2 },
    { name: "Ee Nagaraniki Emaindhi", rotate: -2, x: 20, y: 90, delay: 0.4 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-[6%] overflow-hidden bg-bg-main">
      
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none animate-pulse-slow delay-700"></div>

      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>

      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center relative z-10">
        
        <div className="lg:col-span-7 text-left flex flex-col items-start">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black mb-8 leading-[1.05] tracking-tight"
          >
            <span className="text-gradient block">Blockbuster Cinema.</span>
            <span className="text-white font-display italic">Zero Booking Fees.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-text-muted text-base sm:text-lg md:text-xl font-medium max-w-xl mb-12 leading-relaxed"
          >
            Experience movie booking engineered for speed. Secure your seats instantly with active locking protection and check out seamlessly using Razorpay.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              to="/booking"
              className="w-full sm:w-56 py-4 bg-primary hover:bg-primary-hover rounded-2xl flex items-center justify-center transition-all duration-300 shadow-[0_4px_20px_rgba(160,26,26,0.3)] hover:shadow-[0_8px_30px_rgba(160,26,26,0.5)] active:scale-95 group"
            >
              <span className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                Get Tickets <i className="fas fa-arrow-right transition-transform group-hover:translate-x-1"></i>
              </span>
            </Link>
          </motion.div>
        </div>

        
        <div className="lg:col-span-5 hidden md:flex justify-center items-center relative h-[500px] w-full">
          <div className="relative w-[300px] h-[400px]">
            {featuredCollage.map((item, idx) => {
              const src = getPoster(item.name);
              if (!src) return null;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8, rotate: item.rotate - 10 }}
                  animate={{ opacity: 1, scale: 1, rotate: item.rotate }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: item.delay
                  }}
                  whileHover={{
                    scale: 1.08,
                    rotate: item.rotate > 0 ? item.rotate + 3 : item.rotate - 3,
                    zIndex: 40,
                    transition: { duration: 0.3 }
                  }}
                  className="absolute rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-bg-secondary w-[200px] sm:w-[220px] aspect-[2/3] cursor-pointer cursor-grab active:cursor-grabbing"
                  style={{
                    left: `${50 + item.x}%`,
                    top: `${40 + item.y}px`,
                    transform: `translate(-50%, -50%)`,
                    zIndex: idx + 10,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 z-10 flex items-end p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-white bg-primary px-2.5 py-1 rounded-lg shadow-md">
                      {item.name}
                    </p>
                  </div>
                  <img
                    src={src}
                    alt={item.name}
                    className="w-full h-full object-cover select-none"
                    draggable="false"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

