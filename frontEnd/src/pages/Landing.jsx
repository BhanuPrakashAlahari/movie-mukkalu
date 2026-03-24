import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Footer from '../components/Footer';
import _ReactPlayer from 'react-player';
const ReactPlayer = _ReactPlayer.default || _ReactPlayer;
import { MOVIES_DATA } from '../data/movies';

const TrailerPreloader = () => {
  const allTrailers = Object.values(MOVIES_DATA)
    .flat()
    .map(m => m.trailer)
    .filter(url => url && (url.includes('youtube.com') || url.includes('youtu.be')));
  
  // Get unique trailers to avoid double loading
  const uniqueTrailers = [...new Set(allTrailers)];

  return (
    <div className="fixed opacity-0 pointer-events-none -z-50 w-1 h-1 overflow-hidden">
      {uniqueTrailers.map((url, idx) => (
        <ReactPlayer 
          key={idx} 
          url={url} 
          playing={false} 
          muted={true} 
          width="1px" 
          height="1px" 
        />
      ))}
    </div>
  );
};

const Landing = () => {
  return (
    <div className="min-h-screen selection:bg-primary selection:text-white">
      <TrailerPreloader />
      <Navbar />
      <main>
        <Hero />
        <About />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
