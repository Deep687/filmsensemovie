import axios from "axios";
import { API_KEY } from "./constants";

export const fetchSearchMovies = async (movieQuery) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${(movieQuery)}`);
        return response.data; import.meta.env.VITE_API_KEY
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
