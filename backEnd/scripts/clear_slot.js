const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function clearSlot() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const dateId = '27';
    const showTime = '01-00-PM-04-00-PM';

    
    const resultBookings = await mongoose.connection.collection('ticketBooking').deleteMany({ dateId, showTime });
    console.log(`Deleted ${resultBookings.deletedCount} confirmed bookings for slot ${dateId} ${showTime}`);

    
    const resultSessions = await mongoose.connection.collection('bookingsessions').deleteMany({ dateId, showTime });
    console.log(`Deleted ${resultSessions.deletedCount} sessions`);

    
    const resultLocks = await mongoose.connection.collection('seatlocks').deleteMany({ dateId, showTime });
    console.log(`Deleted ${resultLocks.deletedCount} seat locks`);

    process.exit(0);
  } catch (err) {
    console.error('Error clearing slot:', err);
    process.exit(1);
  }
}

clearSlot();
