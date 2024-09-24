<script setup>
const props = defineProps({
  data: Object,
});

const baseImageUrl = 'https://image.tmdb.org/t/p/w400';


const getStars = (rating) => {
  const filledStars = Math.round(rating / 2);
  return Array.from({ length: 5 }, (_, index) => index < filledStars ? '★' : '☆');
};
</script>

<template>
  <div class="card flex-col w-28 md:w-44 h-44 md:h-72 relative">
    <img :src="`${baseImageUrl}${data.poster_path}`" alt="Movie Poster" class="w-full h-full object-cover rounded-lg">
    
    <div class="absolute top-2 left-2 flex items-center text-yellow-500">
      <span v-for="star in getStars(data.vote_average)" :key="star">{{ star }}</span>
    </div>

    <div class="">
      <h2 class="text-sm md:text-lg font-semibold">{{ data.title }}</h2>
      
    </div>
  </div>
</template>


