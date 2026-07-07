import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Booking from './pages/Booking';
import SeatBooking from './pages/SeatBooking';
import Promotions from './pages/Promotions';
import RukkuBookings from './pages/RukkuBookings';

import { checkHealth } from './services/api';
import { ALL_POSTERS } from './data/movies';

const App = () => {
  useEffect(() => {
    checkHealth()
      .then(data => console.log('Backend Status:', data.message))
      .catch(err => console.error('Backend Connection Failed:', err));

    
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

        <Route path="/promotions" element={<Promotions />} />

        <Route path="/rukkuBookings" element={<RukkuBookings />} />
      </Routes>
    </Router>
  );
};


export default App;