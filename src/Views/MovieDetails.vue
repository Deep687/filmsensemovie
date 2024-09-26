<template>
  <div class="movieDetails bg-black text-white min-h-screen flex flex-col p-4">
    <div class="flex flex-col md:flex-row md:items-start">
      <div class="flex-none mb-4 md:mb-0 justify-self-center">
        <img
          v-if="movieImages?.posters && movieImages.posters.length > 0"
          :src="`https://image.tmdb.org/t/p/w500/${movieImages.posters[0]?.file_path}`"
          alt="Movie Image"
          class="rounded-lg shadow-lg w-48 md:w-72 transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div class="flex-1 md:ml-4">
        <h1 class="text-3xl md:text-5xl font-bold mb-2">{{ movieDetails.title }}</h1>
        <p class="mt-1 text-lg leading-relaxed">{{ movieDetails.tagline }}</p>
        <p class="text-gray-400 text-lg mt-1">Release Date: {{ movieDetails.release_date }}</p>
        <p class="mt-2 text-lg leading-relaxed">{{ movieDetails.overview }}</p>

        <div class="mt-4">
          <h2 class="text-xl font-semibold">Genres</h2>
          <div class="flex flex-wrap gap-2 mt-2">
            <div v-for="genre in movieDetails.genres" :key="genre.id" class="text-lg bg-gray-800 rounded px-2 py-1">
              {{ genre.name }}
            </div>
          </div>
        </div>

        <div class="mt-4">
          <h2 class="text-xl font-semibold">Rating</h2>
          <p class="text-lg">{{ movieDetails.vote_average }} / 10</p>
        </div>

        <h2 class="text-xl md:text-3xl font-semibold mt-4 ml-0 md:ml-12">Cast</h2>

        <div class="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
          <div v-for="member in castSlice5" :key="member.id" class="text-center">
            <img
              v-if="member.profile_path"
              :src="`https://image.tmdb.org/t/p/w185/${member.profile_path}`"
              alt="Cast Image"
              class="rounded-full w-20 h-20 object-cover mx-auto"
            />
            <p class="mt-2 font-semibold">{{ member.original_name }}</p>
            <p class="text-sm text-gray-400">as {{ member.character }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { fetchMovieImages } from "../utils/fetchMovieImages";
import { fetchMovieDetails } from "../utils/fetchMovieDetails";
import { fetchMovieCredits } from "../utils/fetchMovieCredits";

const movieDetails = ref({});
const movieImages = ref([]);
const cast = ref([]);
const castSlice5 = ref([]); 
const error = ref(null);
const route = useRoute();

const movieId = route.params.id;

const fetchImages = async () => {
  try {
    await fetchMovieImages(movieImages, movieId);
  } catch (err) {
    error.value = "Failed to fetch movie images.";
  }
};

const fetchDetails = async () => {
  try {
    await fetchMovieDetails(movieDetails, movieId);
  } catch (err) {
    error.value = "Failed to fetch movie details.";
  }
};

const fetchCast = async () => {
  try { 
    const castData = await fetchMovieCredits(movieId);
    cast.value = castData.cast; 
    castSlice5.value = cast.value.slice(0, 5); 
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};

onMounted(() => {
  fetchDetails();
  fetchImages();
  fetchCast();
});
</script>
