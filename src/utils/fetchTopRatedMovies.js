import { ref } from 'vue';
import API_OPTIONS from './constants';

export const useTopRatedMoviesList = () => {
  const topRatedMoviesList = ref([]);
  const error = ref(null);

  const fetchTopRatedMovies = async () => {
    try {
      const response = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', API_OPTIONS);
      const data = await response.json();
      topRatedMoviesList.value = data.results;
    } catch (err) {
      error.value = 'Error fetching top rated movies: ' + err.message;
      console.error(error.value);
    }
  };

  return {
    topRatedMoviesList,
    error,
    fetchTopRatedMovies,
  };
};
