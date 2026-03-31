# Movie Mukkalu 🎬

Movie Mukkalu is a premium movie ticket booking application designed for high-concurrency environments. It features a real-time seat reservation system, atomic database locking, and seamless payment integration.

## 🚀 Key Features

- **Real-Time Seat Mapping:** Users can see available, booked, and temporarily locked seats in real-time.
- **Atomic Seat Locking:** Prevents double-booking by using atomic database operations to "lock" seats during the checkout process.
- **Automated Lock Release:** Uses MongoDB TTL (Time-To-Live) indexes to automatically release seats if a user abandons their checkout after 2 minutes.
- **Secure Payments:** Integrated with **Razorpay** for safe and reliable transactions with backend signature verification.
- **Session Identity:** Anonymous session tracking ensures users can reserve seats before providing personal details.
- **Dynamic Pricing:** Support for movie-specific pricing and bulk ticket rates.

## 🏗️ System Design

The application is built with a focus on data consistency and performance:

1.  **Pessimistic Concurrency Control:** When a user selects seats, the system creates an atomic lock in the database. This ensures that even if hundreds of users are looking at the same show, only one can proceed with the payment for a specific seat.
2.  **Stateless API with Session Tracking:** The backend uses a `x-session-id` header to identify users across requests without requiring full authentication initially.
3.  **Idempotent Booking Logic:** Final booking creation is protected against duplicate payments and network retry issues.
4.  **Short Polling:** The frontend polls the backend every 4 seconds to sync the seat map, providing a "live" feel while remaining highly scalable.

## 🛠️ Technology Stack

### Frontend
- **React 19**
- **Vite** (Build Tool)
- **Framer Motion** (Premium Animations)
- **Tailwind CSS** (Styling)
- **Axios** (API Client)

### Backend
- **Node.js & Express**
- **MongoDB** with **Mongoose**
- **Razorpay SDK** (Payments)
- **Nodemailer** (Email Confirmations)

## 📦 Project Structure

```text
├── backEnd/           # Express.js Server
│   ├── models/        # MongoDB Schemas (Booking, SeatLock, etc.)
│   ├── routes/        # API Endpoints
│   ├── utils/         # Helpers (Email, Razorpay)
│   └── server.js      # Entry Point
└── frontEnd/          # React App
    ├── src/
    │   ├── components/# Reusable UI Components
    │   ├── pages/     # Main Views (Home, SeatBooking, etc.)
    │   ├── services/  # API & Session logic
    │   └── data/      # Movie metadata
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Razorpay API Keys

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd movie-mukkalu
   ```

2. **Backend Setup:**
   ```bash
   cd backEnd
   npm install
   # Create a .env file with:
   # PORT=5000
   # MONGODB_URI=your_mongodb_uri
   # RAZORPAY_KEY_ID=your_key
   # RAZORPAY_KEY_SECRET=your_secret
   # EMAIL_USER=your_email
   # EMAIL_PASS=your_email_password
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontEnd
   npm install
   # Create a .env file with:
   # VITE_API_BASE_URL=http://localhost:5000/api
   # VITE_RAZORPAY_KEY_ID=your_key
   npm run dev
   ```

## 📄 License
This project is for demonstration and production use in movie booking scenarios.

---
Built with ❤️ by Bhanu Prakash alahari
