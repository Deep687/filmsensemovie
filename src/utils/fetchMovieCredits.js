import { API_HEADERS } from "./constants";
import axios from "axios";

export const fetchMovieCredits = async (movieId) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`, API_HEADERS);
  
         return response.data; 
      
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
