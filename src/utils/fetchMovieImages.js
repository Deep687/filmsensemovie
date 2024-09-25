import API_HEADERS from "./constants";
export const fetchMovieImages = async (movieImages,movieId) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images`,API_HEADERS);
  
      if (!response.ok) {
        throw new Error('Failed to fetch movie images');
      }
  
      const data = await response.json();
      movieImages.value = data; 
     
    } catch (error) {
      movieImages.value=error;
    }
  };