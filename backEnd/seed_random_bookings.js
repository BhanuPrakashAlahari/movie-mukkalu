require('dotenv').config();
const mongoose = require('mongoose');
const TicketBooking = require('./models/Booking');

async function seedRandomBookings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const movies = [
      { dateId: '27', showTime: '10-00-AM', movieName: 'Kushi', poster: 'https://res.cloudinary.com/diipfzmyj/image/upload/v1774243294/kushi_ffkvjj.jpg', time: '10:00 AM' },
      { dateId: '27', showTime: '01-00-PM', movieName: 'Kanchana', poster: 'https://res.cloudinary.com/diipfzmyj/image/upload/v1774243228/kanchana_rgz5fg.jpg', time: '1:00 PM' },
      { dateId: '27', showTime: '04-00-PM', movieName: 'Ganga', poster: 'https://res.cloudinary.com/diipfzmyj/image/upload/v1774967255/ganga_wjqbap.jpg', time: '4:00 PM' },
      { dateId: '28', showTime: '10-00-AM', movieName: 'Orange', poster: 'https://res.cloudinary.com/diipfzmyj/image/upload/v1774412256/WhatsApp_Image_2026-03-24_at_03.27.51_xlxu8j.jpg', time: '10:00 AM' },
      { dateId: '28', showTime: '01-00-PM', movieName: 'Ee Nagaraniki Emaindhi', poster: 'https://res.cloudinary.com/diipfzmyj/image/upload/v1774412257/WhatsApp_Image_2026-03-24_at_03.30.56_cuxavb.jpg', time: '1:00 PM' },
      { dateId: '29', showTime: '10-00-AM', movieName: 'Darling', poster: 'https://res.cloudinary.com/diipfzmyj/image/upload/v1774412257/WhatsApp_Image_2026-03-24_at_03.29.31_fqchqx.jpg', time: '10:00 AM' },
      { dateId: '29', showTime: '01-00-PM', movieName: 'Arjun Reddy', poster: 'https://res.cloudinary.com/diipfzmyj/image/upload/v1774243227/arjun_reddy_ex4bav.jpg', time: '1:00 PM' },
      { dateId: '29', showTime: '04-00-PM', movieName: 'Masoodha', poster: 'https://res.cloudinary.com/diipfzmyj/image/upload/v1774716746/masoodha_l6xw95.jpg', time: '4:00 PM' },
      { dateId: '30', showTime: '04-00-PM-07-00-PM', movieName: 'Sita Ramam', poster: 'https://res.cloudinary.com/diipfzmyj/image/upload/v1774855159/SITARAMAM_cga0bh.jpg', time: '4:00 PM' }
    ];

    const rows = ['A', 'B', 'C', 'D', 'E'];
    const lastRow = 'F';

    for (const movie of movies) {
      // Check if bookings already exist for this movie to avoid over-seeding
      const count = await TicketBooking.countDocuments({ dateId: movie.dateId, showTime: movie.showTime });
      if (count > 0) {
        console.log(`Skipping seeding for ${movie.movieName} (${movie.dateId} ${movie.showTime}), already has bookings.`);
        continue;
      }

      const numBookings = Math.floor(Math.random() * 15) + 10; // 10 to 25 random seats
      const bookedSeats = new Set();

      while (bookedSeats.size < numBookings) {
        const isLastRow = Math.random() > 0.8;
        let seatId;
        if (isLastRow) {
          const num = Math.floor(Math.random() * 10) + 1;
          seatId = `F${num}`;
        } else {
          const row = rows[Math.floor(Math.random() * rows.length)];
          const num = Math.floor(Math.random() * 12) + 1;
          seatId = `${row}${num}`;
        }
        bookedSeats.add(seatId);
      }

      const seatsArray = Array.from(bookedSeats);
      // Group seats into chunks of 1 to 4 to simulate real bookings
      let i = 0;
      while (i < seatsArray.length) {
        const chunkSize = Math.floor(Math.random() * 4) + 1;
        const chunk = seatsArray.slice(i, i + chunkSize);
        i += chunkSize;

        const booking = new TicketBooking({
          name: 'Random User',
          email: 'random@example.com',
          phone: '9999999999',
          dateId: movie.dateId,
          showTime: movie.showTime,
          displayTime: movie.time,
          seats: chunk,
          totalPrice: chunk.length * 1, // Current ₹1 price
          movieName: movie.movieName,
          poster: movie.poster,
          sessionId: 'seeding-' + Math.random().toString(36).substr(2, 9),
          paymentId: 'pay_' + Math.random().toString(36).substr(2, 14),
          orderId: 'order_' + Math.random().toString(36).substr(2, 14),
          status: 'success'
        });

        await booking.save();
      }
      console.log(`Seeded ${numBookings} seats for ${movie.movieName} (${movie.dateId} ${movie.showTime})`);
    }

    console.log('Random seeding completed!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedRandomBookings();
