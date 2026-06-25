import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const features = [
    {
      title: "Pessimistic Locking",
      icon: "fa-lock",
      description: "When you select a seat, the database locks it instantly. Even under massive concurrency, double-booking is mathematically impossible.",
      badge: "Scaleable & Safe"
    },
    {
      title: "Razorpay Security",
      icon: "fa-shield-alt",
      description: "Cryptographic signature verification ensures that every ticket is backed by a verified, secure transaction.",
      badge: "HMAC-SHA256"
    },
    {
      title: "TTL Auto-Releases",
      icon: "fa-hourglass-end",
      description: "Abandoned checkouts are cleaned up automatically in 120 seconds, releasing the seats back to other cinema lovers.",
      badge: "MongoDB TTL"
    },
    {
      title: "Frictionless Sessions",
      icon: "fa-user-secret",
      description: "No tedious registration forms. We use secure browser-generated UUID sessions to let you book in seconds.",
      badge: "Anonymous & Fast"
    }
  ];

  return (
    <section id="about" className="pt-32 pb-32 px-[6%] bg-bg-secondary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Left Side: Header and core message */}
          <div className="lg:col-span-5 text-left flex flex-col items-start">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary block mb-6 px-1 border-l-2 border-primary ml-1 italic">
              ENGINEERING INTEGRITY
            </span>
            <h2 className="text-4xl sm:text-6xl mb-8 leading-[1.1] font-black">
              Under The <br />
              <span className="text-primary italic font-display not-italic">Hood.</span>
            </h2>
            <p className="text-text-muted text-base sm:text-lg leading-relaxed font-medium max-w-lg">
              Movie Mukkalu isn't just a clean interface. Underneath the hood lies a high-performance ticketing engine engineered with atomic concurrency controls and automated state releases.
            </p>
            <div className="w-16 h-1 bg-primary/40 mt-10 rounded-full"></div>
          </div>

          {/* Right Side: Feature Grid */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6 w-full">
            {features.map((feat, index) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -5,
                  borderColor: "rgba(160, 26, 26, 0.3)",
                  boxShadow: "0 10px 30px -10px rgba(160, 26, 26, 0.15)",
                  transition: { duration: 0.2 }
                }}
                className="p-8 bg-[#0d0707] border border-white/[0.04] rounded-[2rem] flex flex-col items-start text-left transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center mb-6 text-primary text-xl group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <i className={`fas ${feat.icon}`}></i>
                </div>
                
                <span className="text-[9px] font-black text-primary uppercase tracking-widest mb-2 block font-mono">
                  {feat.badge}
                </span>
                
                <h3 className="text-xl mb-3 font-black text-white italic tracking-tight">{feat.title}</h3>
                
                <p className="text-text-muted text-xs sm:text-sm font-medium leading-[1.6]">
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

