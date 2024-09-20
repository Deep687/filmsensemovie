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
      Authorization: 'Bearer YOUR_TOKEN_HERE', 
    },
  };

  try {
    const res = await fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', options);
    const data = await res.json();
    response.value = data.results; // Set response to the results array
  } catch (error) {
    console.error('Fetch error: ', error);
  }
};

onMounted(() => {
  fetchUpcomingMovieList();
});
</script>
