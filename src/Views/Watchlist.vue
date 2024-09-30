<template>
    <div class="min-h-screen p-4 bg-black text-white">
      <h1 class="text-2xl font-bold mb-4 text-center">Watchlist</h1>
  
      <div v-if="isLoading" class="text-center">
        <p class="text-lg">Loading your watchlist...</p>
      </div>
  
      <div v-else-if="watchlistMovies.length === 0" class="text-center">
        <p class="text-lg">Your watchlist is empty</p>
      </div>
  
      <div v-else class="flex flex-col items-center">
        <div
          v-for="movie in watchlistMovies"
          :key="movie.id"
          class="m-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
        >
          <div class=" rounded-lg shadow-md flex overflow-hidden transition-transform transform hover:scale-105 shadow-teal-200">
            <router-link :to="{ name: 'movieDetails', params: { id: movie.id } }">
              <img
                :src="`https://image.tmdb.org/t/p/w500/${movie.posterPath}`"
                :alt="movie.title"
                class="w-24 h-36 object-cover sm:w-32 sm:h-48"
              />
            </router-link>
  
            <div class="p-4 flex flex-col justify-between flex-1">
              <div>
                <h2 class="text-lg font-semibold truncate">{{ movie.title }}</h2>
                <p class="text-sm">{{ movie.tagline }}</p>
                <button
                  @click="removeMovie(movie.id)"
                  class="mt-2 text-sm   bg-teal-500 hover:bg-teal-700 p-2 text-white rounded-2xl transition-colors duration-200"
                  aria-label="Remove from watchlist"
                >
                  Remove from Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useWatchlistStore } from '../utils/watchListStore';
  import { useUserStore } from '../stores/userStore';
  import { onMounted, ref } from 'vue';
  
  const userStore = useUserStore();
  const watchlist = useWatchlistStore();
  const watchlistMovies = ref([]);
  const isLoading = ref(true);
  
  const fetchWatchlist = async () => {
    isLoading.value = true;
    if (userStore.user?.uid) {
      try {
        await watchlist.fetchWatchlist();
        watchlistMovies.value = watchlist.watchlist;
        console.log("Fetched watchlist:", watchlistMovies.value);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
        alert("Failed to fetch your watchlist. Please try again later.");
      }
    } else {
      console.warn("User not logged in.");
    }
    isLoading.value = false;
  };
  
  const removeMovie = async (movieId) => {
    await watchlist.removeMovie(movieId);
    fetchWatchlist();
  };
  
  onMounted(() => {
    fetchWatchlist();
  });
  </script>
  
  <style scoped>

  </style>
  