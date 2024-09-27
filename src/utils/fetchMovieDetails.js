import { API_HEADERS } from "./constants";

export const fetchMovieDetails = async (movieId) => {

    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, API_HEADERS);


    const data = await response.json();

    return data; 

  
};
