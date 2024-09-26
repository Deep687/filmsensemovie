import { API_HEADERS } from "./constants";
export const fetchMovieDetails = async (movieDetails,movieId) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,API_HEADERS);
  
      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }
  
      const data = await response.json();
      movieDetails.value = data; 

    } catch (error) {
     movieDetails.value=error;
    }
  };