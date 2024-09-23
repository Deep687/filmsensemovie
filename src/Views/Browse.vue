<template>
  <div>
    <Header />
    <div v-if="response" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <UpcomingMovieCard
        v-for="movie in response"
        :key="movie.id"
        :movie="movie"
      />
    </div>
    <div v-else class="p-4">
      <p>Loading...</p>
    </div>
  </div>
</template>


<script setup>
import Header from '../components/Header.vue';
import { onMounted, ref } from 'vue';
import UpcomingMovieCard from '../components/UpcomingMovieCard.vue';

const response = ref(null);

const fetchUpcomingMovieList = async () => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNTA3YTExYjQzZjJlYzhmNWE4M2JkOTMyNWQ3MjViMCIsIm5iZiI6MTcyNjgzMzg0NS40NTQxMTIsInN1YiI6IjY2ZWQ2MzBkMTkyM2ZlMDMyN2FkZDJmNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pVxg9z-o2xqXfaCs6WU7HHhGkDiIp41g27mH-9ubCXM',
    },
  };

  try {
    // Fetch data from TMDB API for upcoming movies
    const res = await fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', options);
    const data = await res.json();
    response.value = data.results;  // Store the fetched movie list in the response
  } catch (error) {
    console.error('Fetch error: ', error);
  }
};

// Fetch the movie data when the component is mounted
onMounted(() => {
  fetchUpcomingMovieList();
});
</script>

