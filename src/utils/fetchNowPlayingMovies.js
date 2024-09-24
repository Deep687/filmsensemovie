import { ref } from 'vue';
import API_HEADERS from './constants';
export const useNowPlayingMovies = () => {
  const nowPlayingMoviesList = ref([]);
  const error = ref(null);

  const fetchNowPlayingMovies = async () => {
    try {
      const response = await fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', API_HEADERS);
      const data = await response.json();
      nowPlayingMoviesList.value = data.results;
    } catch (err) {
      error.value = 'Error fetching now playing movies: ' + err.message;
      console.error(error.value);
    }
  };

  return {
    nowPlayingMoviesList,
    error,
    fetchNowPlayingMovies,
  };
};