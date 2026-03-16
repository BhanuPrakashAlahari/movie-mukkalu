import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-32 md:py-48 px-[6%] bg-bg-main relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-center relative z-10">
        <div className="animate-fade-up">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary block mb-6 px-1 border-l-2 border-primary ml-1">
            Core Concept
          </span>
          <h2 className="text-5xl md:text-7xl mb-10 leading-[1.1] font-black">
            Beyond the <br /> 
            <span className="text-primary italic font-display font-bold underline decoration-white/10 underline-offset-8">Big Screen.</span>
          </h2>
          <p className="text-xl text-text-muted leading-[1.8] font-medium max-w-xl">
            Movie Mukkalu is a dedicated platform designed to simplify theater management. 
            From instant ticket reservations to digital stall registrations, we provide 
            the tools needed for a modern cinema ecosystem.
          </p>
          
          <div className="mt-12 flex items-center gap-6">
            <div className="h-0.5 w-12 bg-primary"></div>
            <p className="text-sm font-bold tracking-widest uppercase text-white">Our Mission</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 relative">
          <div className="group p-10 bg-bg-secondary/50 border border-white/[0.05] rounded-[2.5rem] hover:border-primary/40 hover:bg-bg-secondary transition-all duration-500">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 text-primary text-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <i className="fas fa-ticket-alt"></i>
            </div>
            <h3 className="text-2xl mb-4 font-black">Tickets</h3>
            <p className="text-text-muted text-sm font-medium leading-[1.7] group-hover:text-white/80 transition-colors">
              Advanced booking algorithms ensuring you get the best seats every time.
            </p>
          </div>

          <div className="group p-10 bg-bg-secondary/50 border border-white/[0.05] rounded-[2.5rem] hover:border-primary/40 hover:bg-bg-secondary transition-all duration-500 md:translate-y-12">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 text-primary text-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <i className="fas fa-store"></i>
            </div>
            <h3 className="text-2xl mb-4 font-black">Stalls</h3>
            <p className="text-text-muted text-sm font-medium leading-[1.7] group-hover:text-white/80 transition-colors">
              Streamlined registration flow for food and beverage vendors.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
