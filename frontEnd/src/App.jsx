import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Booking from './pages/Booking';
import SeatBooking from './pages/SeatBooking';
import Stalls from './pages/Stalls';
import Promotions from './pages/Promotions';
import Contact from './pages/Contact';

import { checkHealth } from './services/api';
import { ALL_POSTERS } from './data/movies';

const App = () => {
  useEffect(() => {
    checkHealth()
      .then(data => console.log('Backend Status:', data.message))
      .catch(err => console.error('Backend Connection Failed:', err));

    // Preload movie posters for better UX
    ALL_POSTERS.forEach((poster) => {
      const img = new Image();
      img.src = poster;
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/booking/:dateId/:showTime" element={<SeatBooking />} />
        <Route path="/stalls" element={<Stalls />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
};


export default App;