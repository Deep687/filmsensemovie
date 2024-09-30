<template>
    <div class="flex-row text-white m-7 text-lg md:text-2xl ml-0 md:ml-16 mb-4 md:mb-7">
      <h1 class=" mb-2 md:mb-7 lg:mb-10 ml-2 md:ml-6 text-lg md:text-2xl font-semibold">{{ title }}</h1>
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
        <SwiperSlide v-for="movie in movieList" :key="movie.id">
          
          <div class="flex justify-center">
            <router-link :to="{ name: 'movieDetails', params: { id: movie.id } }">
            <MovieCards :data="movie" class="p-1 md:p-0" />
            </router-link>
           
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
</template>
  
  <script setup>
  import { defineProps } from 'vue'; 
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import 'swiper/swiper-bundle.css';
  import MovieCards from '../utils/MovieCards.vue';
  
  const props = defineProps({
    title: String,
    movieList: Array
  });
  </script>
  