import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Booking from './pages/Booking';
import SeatBooking from './pages/SeatBooking';
import Stalls from './pages/Stalls';

import { checkHealth } from './services/api';

const App = () => {
  useEffect(() => {
    checkHealth()
      .then(data => console.log('Backend Status:', data.message))
      .catch(err => console.error('Backend Connection Failed:', err));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/booking/:dateId/:showTime" element={<SeatBooking />} />
        <Route path="/stalls" element={<Stalls />} />
      </Routes>
    </Router>
  );
};


export default App;