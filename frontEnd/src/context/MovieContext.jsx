import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMovies } from '../services/api';

const MovieContext = createContext({
  moviesData: {},
  allPosters: [],
  loading: true,
  error: null
});

export const MovieProvider = ({ children }) => {
  const [moviesData, setMoviesData] = useState({});
  const [allPosters, setAllPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndPreloadMovies = async () => {
      try {
        const data = await getMovies();
        setMoviesData(data || {});

        
        const posters = Object.values(data || {}).flat().map(movie => movie.poster);
        posters.forEach((poster) => {
          if (poster) {
            const img = new Image();
            img.src = poster;
          }
        });
        setAllPosters(posters);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load movie data:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchAndPreloadMovies();
  }, []);

  return (
    <MovieContext.Provider value={{ moviesData, allPosters, loading, error }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};
