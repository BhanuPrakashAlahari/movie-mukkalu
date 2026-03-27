const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://bhanuprakashalahari04_db_user:Bhanu09%40@cluster0.kwontdu.mongodb.net/movie_mukkalu';

async function clearSlot() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const dateId = '27';
    const showTime = '01-00-PM-04-00-PM';

    // Delete Confirmed Bookings
    const resultBookings = await mongoose.connection.collection('ticketBooking').deleteMany({ dateId, showTime });
    console.log(`Deleted ${resultBookings.deletedCount} confirmed bookings for slot ${dateId} ${showTime}`);

    // Delete Sessions
    const resultSessions = await mongoose.connection.collection('bookingsessions').deleteMany({ dateId, showTime });
    console.log(`Deleted ${resultSessions.deletedCount} sessions`);

    // Delete Seat Locks
    const resultLocks = await mongoose.connection.collection('seatlocks').deleteMany({ dateId, showTime });
    console.log(`Deleted ${resultLocks.deletedCount} seat locks`);

    process.exit(0);
  } catch (err) {
    console.error('Error clearing slot:', err);
    process.exit(1);
  }
}

clearSlot();
