import { ref } from 'vue';
import API_HEADERS from './constants';

export const usePopularMoviesList = () => {
  const popularMoviesList = ref([]);
  const error = ref(null);

  const fetchPopularMovies = async () => {
    try {
      const response = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', API_HEADERS);
      const data = await response.json();
      popularMoviesList.value = data.results;
    } catch (err) {
      error.value = 'Error fetching top rated movies: ' + err.message;
      console.error(error.value);
    }
  };

  return {
    popularMoviesList,
    error,
    fetchPopularMovies,
  };
};
