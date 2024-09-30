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

      <div v-if="movieDetails" class="flex-1 md:ml-4">
        <h1 class="text-3xl md:text-5xl font-bold mb-2">{{ movieDetails.title }}</h1>
        <button @click="handleAddBtnSubmit" class="mt-2 bg-teal-500 hover:bg-teal-800 text-white px-4 py-2 rounded">
          {{ isAlreadyAdded ? "Added to watchlist" : "Add to watchlist" }}
        </button>
        <p class="mt-1 text-lg leading-relaxed">{{ movieDetails.tagline }}</p>
        <p class="text-gray-400 text-lg mt-1">Release Date: {{ movieDetails.release_date }}</p>
        <p class="mt-2 text-lg leading-relaxed">{{ movieDetails.overview }}</p>

        <div class="mt-4">
          <h2 class="text-xl font-semibold">Genres</h2>
          <div class="flex flex-wrap gap-2 mt-2">
            <div
              v-for="genre in movieDetails.genres"
              :key="genre.id"
              class="text-lg bg-gray-800 rounded px-2 py-1"
            >
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
          <div v-for="member in displayedCastMembers" :key="member.id" class="text-center">
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

    <div v-if="loading" class="text-center mt-4">Loading...</div>
    <div v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { fetchMovieImages } from "../utils/fetchMovieImages";
import { fetchMovieDetails } from "../utils/fetchMovieDetails";
import { fetchMovieCredits } from "../utils/fetchMovieCredits";
import { useWatchlistStore } from "../utils/watchListStore";
import { useUserStore } from "../stores/userStore";

const watchlistStore = useWatchlistStore();
const userStore = useUserStore();
const isAlreadyAdded = ref(false);
const movieDetails = ref(null);
const displayedCastMembers = ref([]);
const movieImages = ref(null);
const movieId = ref(null); 
const loading = ref(false);
const errorMessage = ref(null);
const route = useRoute();

const fetchData = async (id) => {
  loading.value = true;
  errorMessage.value = null;
  try {
    await Promise.allSettled([
      fetchMovieImages(id).then(images => movieImages.value = images),
      fetchMovieDetails(id).then(details => movieDetails.value = details),
      fetchMovieCredits(id).then(castData => displayedCastMembers.value = castData.cast.slice(0, 5))
    ]);
  } catch (error) {
    errorMessage.value = "Error fetching movie data";
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleAddBtnSubmit = async () => {
  if (movieDetails.value?.id) {
    try {
      await watchlistStore.addMovieToWatchList(movieDetails.value, String(movieDetails.value.id));
      await watchlistStore.fetchWatchlist(userStore.user.uid); 

      isAlreadyAdded.value = watchlistStore.isMovieInWatchlist; 
    } catch (error) {
      console.error("Failed to add movie to watchlist: ", error);
    }
  } else {
    console.error("Movie ID is missing from movieDetails.");
  }
};
const alreadyAddedMovie = async () => {
  movieId.value = route.params.id;
  if (userStore.user?.uid) {
    await watchlistStore.fetchWatchlist(userStore.user.uid);
  
    isAlreadyAdded.value = watchlistStore.watchlist.some(movie => movie.movieId === movieId.value);
   
   
  }
  fetchData(movieId.value);
}
onMounted(()=>{
alreadyAddedMovie()
}
);

watch(() => route.params.id, (newMovieId) => {
  movieId.value = newMovieId;
  fetchData(newMovieId);
alreadyAddedMovie();
  
});
</script>
