<template>
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        v-if="movie.poster_path"
        :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
        alt="Movie Poster"
        class="w-full h-64 object-cover"
      />
      <div class="p-4">
        <h2 class="text-lg font-bold mb-2">{{ movie.title }}</h2>
        <p class="text-gray-700">{{ movie.overview }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    movie: {
      type: Object,
      required: true,
    },
  });
  </script>
  
  <style scoped>

  </style>
  