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
        <h1 class="text-3xl md:text-5xl font-bold mb-2">
          {{ movieDetails.title }}
        </h1>
        <button 
          @click="addMovieToWatchList" 
          class="mt-2 bg-green-600 text-white px-4 py-2 rounded"
          :disabled="isInWatchlist" 
        >
          {{ isInWatchlist ? 'Added to Watchlist' : 'Add to Watchlist' }}
        </button>
        <p class="mt-1 text-lg leading-relaxed">{{ movieDetails.tagline }}</p>
        <p class="text-gray-400 text-lg mt-1">
          Release Date: {{ movieDetails.release_date }}
        </p>
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

        <h2 class="text-xl md:text-3xl font-semibold mt-4 ml-0 md:ml-12">
          Cast
        </h2>

        <div class="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
          <div
            v-for="member in displayedCastMembers"
            :key="member.id"
            class="text-center"
          >
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
import { ref, onMounted, watch } from "vue";
import { fetchMovieImages } from "../utils/fetchMovieImages";
import { fetchMovieDetails } from "../utils/fetchMovieDetails";
import { fetchMovieCredits } from "../utils/fetchMovieCredits";
import { useUserStore } from "../stores/userStore";
import { addToWatchList } from "../utils/addToWatchList";
import { db } from "../utils/firebase"; 
import { collection, getDocs } from 'firebase/firestore';

const userStore = useUserStore();
const movieDetails = ref({});
const movieImages = ref([]);
const displayedCastMembers = ref([]);
const watchlist = ref([]);
const errorMessage = ref(null);
const route = useRoute();
const movieId = ref(null);
const isInWatchlist = ref(false);

const fetchData = async (id) => {
  await fetchDetails(id);
  await fetchImages(id);
  await fetchCast(id);
  await fetchWatchList(userStore.user?.uid); 
};

const fetchImages = async (id) => {
  try {
    await fetchMovieImages(movieImages, id);
  } catch (err) {
    errorMessage.value = "Failed to fetch movie images.";
  }
};

const fetchDetails = async (id) => {
  try {
    await fetchMovieDetails(movieDetails, id);
  } catch (err) {
    errorMessage.value = "Failed to fetch movie details.";
  }
};

const fetchCast = async (id) => {
  try {
    const castData = await fetchMovieCredits(id);
    displayedCastMembers.value = castData.cast.slice(0, 5);
  } catch (err) {
    console.error("Failed to fetch data:", err);
  }
};





const addMovieToWatchList = async () => {
  if (userStore.user) {

    const isAlreadyInWatchlist = watchlist.value.some(movie => movie.movieId === movieId.value);
    if (isAlreadyInWatchlist) {
      alert("This movie is already in your watchlist.");
      return; 
    }
    await addToWatchList(userStore.user.uid, movieId.value);
    isInWatchlist.value = true; 
  } else {
    alert("Please log in to add movies to your watchlist.");
  }
};

const fetchWatchList = async (userId) => {
  if (!userId) return; 
  try {
    const watchlistRef = collection(db, `users/${userId}/watchlist`);
    const watchlistSnapshot = await getDocs(watchlistRef);
    watchlist.value = watchlistSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
  
    isInWatchlist.value = watchlist.value.some(movie => movie.movieId === movieId.value);
    
    console.log(watchlist.value);
  } catch (error) {
    console.error("Error fetching watchlist: ", error);
  }
};

onMounted(() => {
  movieId.value = route.params.id; 
  fetchData(movieId.value);
});

watch(() => route.params.id, (newMovieId) => {
  movieId.value = newMovieId; 
  fetchData(movieId.value);
});
</script>
