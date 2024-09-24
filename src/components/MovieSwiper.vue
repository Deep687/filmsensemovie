<template>
    <div class="text-white m-7 text-lg md:text-2xl ml-0 md:ml-16 mb-4">
      <h1>{{ title }}</h1>
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
            <MovieCards :data="movie" />
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
  