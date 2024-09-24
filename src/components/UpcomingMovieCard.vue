<template>
  <div class="movieCard flex flex-col md:flex-row w-full bg-black text-white shadow-lg border-2 border-teal-400 ">
    <div class="imgCard flex w-full justify-center p-2">
      <img
        :src="`${baseImageUrl}${movie.poster_path}`"
        alt="Movie Poster"
        class="w-32 h-60 md:w-44 md:h-64 lg:w-48 lg:h-72 border-2 transition-transform duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg border-teal-400"
      />
    </div>
    
    <div class="textCard w-full p-4 flex flex-col justify-between">
      <h1 class="text-2xl md:text-3xl font-bold mb-2">{{ movie.original_title }}</h1>
      
      <div class="flex items-center mb-2">
        <strong class="mr-2">Rating:</strong>
        <div class="flex text-yellow-400">
          <span v-for="star in 5" :key="star" class="h-6 w-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              :class="star <= Math.round(movie.vote_average / 2) ? 'text-yellow-500' : 'text-gray-400'"
              viewBox="0 0 20 20"
            >
              <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z"/>
            </svg>
          </span>
        </div>
      </div>
 <p class="mb-2">Popularity: {{ movie.popularity }} votes</p>
      <p class="mb-2 text-gray-200">{{ movie.overview }}</p>
     
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

const baseImageUrl = 'https://image.tmdb.org/t/p/w500'; 
</script>

<style scoped>

</style>
