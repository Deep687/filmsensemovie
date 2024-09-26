<template>

  <div class="bg-black p-4">
  
    <h1 class="text-white m-7 text-lg md:text-2xl ml-0 md:ml-16">
      Upcoming Movies
    </h1>
    <div class=" w-full">
      <Swiper
        :slides-per-view="1" 
        :space-between="20"
        class="mySwiper"
      >
        <SwiperSlide v-for="movie in response" :key="movie.id" class="w-full">
          <div class="flex-row justify-center w-full">
            <router-link :to="{ name: 'movieDetails', params: { id: movie.id } }">
              <UpcomingMovieCard :movie="movie" />
            </router-link>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
    <MovieSwiper title="Now Playing Movies" :movie-list="nowPlayingMoviesList" />
    <MovieSwiper title="Top Rated Movies" :movie-list="topRatedMoviesList" />
    <MovieSwiper title="Popular Movies" :movie-list="popularMoviesList" />
  </div>

</template>

<script setup>

import { onMounted, ref } from 'vue';
import UpcomingMovieCard from '../components/UpcomingMovieCard.vue';
import MovieSwiper from '../components/MovieSwiper.vue';
import { fetchMovies } from '../utils/fetchMovies';
import { Swiper, SwiperSlide } from 'swiper/vue'; 

const response = ref([]);
const nowPlayingMoviesList = ref([]);
const topRatedMoviesList = ref([]);
const popularMoviesList = ref([]);

onMounted(() => {
Promise.allSettled([
fetchMovies('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1',response),
 fetchMovies('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1',nowPlayingMoviesList),
 fetchMovies('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', topRatedMoviesList),
 fetchMovies('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', popularMoviesList)])
 .then((results)=>{

})
});

</script>

