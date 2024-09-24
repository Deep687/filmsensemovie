<template>
  <div class="bg-black p-4">
    <Header />

    <h1 class="text-white m-7 text-lg md:text-2xl ml-0 md:ml-16">
      Upcoming Movies
    </h1>

    <div>
      <Swiper
        :slides-per-view="1" 
        :space-between="50"
        class="mySwiper"
      >
        <SwiperSlide v-for="movie in response" :key="movie.id">
          <div class="flex justify-center w-full">
            <UpcomingMovieCard :movie="movie" class="w-full" />
          </div>
        </SwiperSlide>
      </Swiper> 
    </div>

    <div class="text-white m-7 text-lg md:text-2xl ml-0 md:ml-16 mb-4">
      <h1 >Now playing movies</h1>
      <Swiper
        :space-between="20"
        class="mySwiper"
        :breakpoints="{
          0: { slidesPerView: 3 },  
          640: { slidesPerView: 3 }, 
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 }, 
          1536: { slidesPerView: 5 } 
        }"
      >
        <SwiperSlide v-for="movie in nowPlayingMoviesList" :key="movie.id">
          <div class="flex justify-center">
            <MovieCards :data="movie" />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
    <div>
      <div class="text-white m-7 text-lg md:text-2xl ml-0 md:ml-16 mb-4">
        <h1 >Top rated movies</h1>
       <Swiper
        :space-between="20"
        class="mySwiper"
        :breakpoints="{
          0: { slidesPerView: 3 },  
          640: { slidesPerView: 3 }, 
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 }, 
          1536: { slidesPerView: 5 } 
        }"
   
      >
        <SwiperSlide v-for="movie in topRatedMoviesList" :key="movie.id">
          <div class="flex justify-center">
            <MovieCards :data="movie" />
          </div>
        </SwiperSlide>
      </Swiper> 
      </div>
    </div>
    <div class="">
      <div class="text-white m-7 text-lg md:text-2xl ml-0 md:ml-16">
        <h1>Popular movies</h1>
       <Swiper
        :space-between="20"
        class="mySwiper"
        :breakpoints="{
          0: { slidesPerView: 3 },  
          640: { slidesPerView: 3 }, 
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 }, 
          1536: { slidesPerView: 5 } 
        }"

      >
        <SwiperSlide v-for="movie in popularMoviesList" :key="movie.id">
          <div class="flex justify-center">
            <MovieCards :data="movie" />
          </div>
        </SwiperSlide>
      </Swiper> 
      </div> 
    </div>
  </div>
</template>
<script setup>
import Header from '../components/Header.vue';
import { onMounted, ref } from 'vue';
import UpcomingMovieCard from '../components/UpcomingMovieCard.vue';
import MovieCards from '../utils/MovieCards.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';
import API_HEADERS from '../utils/constants';
import { useNowPlayingMovies } from '../utils/fetchNowPlayingMovies';
import { useTopRatedMoviesList } from '../utils/fetchTopRatedMovies';
import { usePopularMoviesList } from '../utils/fetchPopularMovies';
const response = ref([]);
const { nowPlayingMoviesList, fetchNowPlayingMovies } = useNowPlayingMovies();
const {topRatedMoviesList, fetchTopRatedMovies } = useTopRatedMoviesList();
const {popularMoviesList,fetchPopularMovies} = usePopularMoviesList();
const fetchUpcomingMovieList = async () => {
  try {
    const res = await fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1',API_HEADERS);
    const data = await res.json();
    response.value = data.results; 
  } catch (error) {
    console.error('Fetch error: ', error); 
  }
};

onMounted(() =>{
  fetchUpcomingMovieList();
  fetchNowPlayingMovies();
  fetchTopRatedMovies();
  fetchPopularMovies();
});
</script>
