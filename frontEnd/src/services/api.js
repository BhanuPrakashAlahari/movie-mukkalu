import axios from 'axios';
import { getSessionId } from './session';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Request Interceptor: Attach Session ID
api.interceptors.request.use(
  (config) => {
    const sessionId = getSessionId();
    if (sessionId) {
      config.headers['x-session-id'] = sessionId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getBookedSeats = async (dateId, showTime) => {
  try {
    const response = await api.get('/bookings', { 
      params: { dateId, showTime } 
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getRukkuBookings = async () => {
  try {
    const response = await api.get('/bookings/rukku-bookings');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const toggleBookingVisited = async (id, visited) => {
  try {
    const response = await api.put(`/bookings/${id}/visited`, { visited });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getStalls = async () => {
  try {
    const response = await api.get('/stalls');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const createStall = async (stallData) => {
  try {
    const response = await api.post('/stalls', stallData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Atomic Seat Locking
 * Reserves seats for 10 minutes to prevent double booking.
 */
export const lockSeats = async (dateId, showTime, seatIds, movieName) => {
  try {
    const response = await api.post('/bookings/lock-seats', { dateId, showTime, seatIds, movieName });
    return response.data;
  } catch (error) {
    console.error('Locking error:', error);
    if (error.response && error.response.status === 409) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Creates a Razorpay Order linked to a BookingSession
 */
export const createRazorpayOrder = async (bookingSessionId) => {
  try {
    const response = await api.post('/bookings/create-order', { bookingSessionId });
    return response.data;
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    throw error;
  }
};

/**
 * Verifies Razorpay Payment and Finalizes Booking
 */
export const verifyPayment = async (paymentData) => {
  try {
    const response = await api.post('/bookings/verify-payment', paymentData);
    return response.data;
  } catch (error) {
    console.error('Payment Verification Error:', error);
    throw error;
  }
};

/**
 * Explicitly cancels a BookingSession and unlocks seats
 */
export const cancelOrder = async (bookingSessionId) => {
  try {
    const response = await api.post('/bookings/cancel-order', { bookingSessionId });
    return response.data;
  } catch (error) {
    console.error('Cancellation error:', error);
    throw error;
  }
};

export default api;

