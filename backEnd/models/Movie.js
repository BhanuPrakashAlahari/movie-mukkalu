const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  dateId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    required: true,
    default: 'Available'
  },
  trailer: {
    type: String
  },
  bookingPoster: {
    type: String
  }
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
