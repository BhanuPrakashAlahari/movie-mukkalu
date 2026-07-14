const Movie = require('../models/Movie');

const getMoviesGroupedByDate = async (req, res) => {
  try {
    const movies = await Movie.find();
    const grouped = {};
    
    
    movies.forEach(movie => {
      if (!grouped[movie.dateId]) {
        grouped[movie.dateId] = [];
      }
      grouped[movie.dateId].push({
        name: movie.name,
        poster: movie.poster,
        time: movie.time,
        slug: movie.slug,
        status: movie.status,
        trailer: movie.trailer,
        bookingPoster: movie.bookingPoster
      });
    });

    res.json(grouped);
  } catch (err) {
    console.error('Fetch movies error:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getMovies: getMoviesGroupedByDate
};
