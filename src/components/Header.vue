<template>
  <header class="relative z-10 p-4 flex flex-col md:flex-row justify-between items-center w-full bg-gradient-to-br from-gray-900 to-black bg-opacity-90 shadow-lg">
    <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-teal-400 mb-4 md:mb-0">
      FilmSense
    </h1>

    <form v-if="currentRoute !== '/'" @submit.prevent="handleSubmit" class="flex w-full max-w-md md:w-1/3 mb-4 relative">
      <div class="relative w-full">
        <input
          type="text"
          v-model="movieQuery"
          class="w-full px-4 py-3 text-lg bg-gray-800 text-gray-200 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300 placeholder-gray-500"
          id="search"
          placeholder="Search movies"
        />
      </div>
      <ul v-if="searchResults.length" class="absolute left-0 mt-1 w-full bg-gray-800 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
        <li v-for="(result, index) in searchResults" :key="index" @click="selectMovie(result)" class="cursor-pointer hover:bg-gray-700 transition duration-200">
          <router-link :to="{ name: 'movieDetails', params: { id: result.id } }" class="block px-4 py-2 text-white">
            {{ result.title }}
          </router-link>
        </li>
      </ul>
    </form>

    <nav v-if="currentRoute !== '/'" class="flex items-center space-x-6">
      <router-link
        :to="{ path: '/home' }"
        :class="{'text-teal-500': currentRoute === '/home', 'text-white': currentRoute !== '/home'}"
        class="font-semibold transition duration-300"
      >
        Home
      </router-link>
      <router-link
  v-if="currentRoute !== '/'"
  :to="{ path: '/watchlist' }"
  :class="{
    'text-teal-500': currentRoute === '/watchlist',
    'text-white': currentRoute !== '/watchlist'
  }"
  class="flex items-center justify-center   hover:text-teal-500 transition  "
>
  <span class="mr-2">Watchlist</span>
  <span class="bg-teal-500 text-white rounded-full px-2 py-1 text-xs">
    {{ watchlist.watchlist.length }}
  </span>
</router-link>

      <p class="text-teal-400 text-sm">
        Hello, <span class="text-white font-semibold">{{ userStore.user?.displayName || 'Guest' }}</span>
      </p>
      
      <button 
        @click="handleSignOut" 
        class="bg-teal-500 text-white font-semibold  px-2 py-1 md:py-2 md:px-3 md:text-lg rounded-lg hover:bg-teal-800 transition duration-300 w-full text-xs"
      >
        Sign out
      </button>
    </nav>
  </header>
</template>

<script setup>

import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase"; 
import { useRouter, useRoute } from 'vue-router'; 
import { useUserStore } from "../stores/userStore";
import { computed, onMounted, ref } from "vue";
import { fetchSearchMovies } from "../utils/searchMovies";
import { useWatchlistStore } from "../utils/watchListStore";
const watchlist =useWatchlistStore();
const route = useRoute();
const currentRoute = computed(() => route.path); 
const movieQuery = ref("");
const searchResults = ref([]);
const router = useRouter();
const userStore = useUserStore();


  

const fetchSearchData = async (query) => {
  try { 
    const searchData = await fetchSearchMovies(query);
    searchResults.value = searchData.results;
  } catch (err) {
    console.error("Failed to fetch data:", err);
  }
};

const handleSignOut = async () => {
  try {
    await signOut(auth);
    router.push('/');
  } catch (error) {
    console.error('Sign-out error: ', error);
  }
};

const handleSubmit = () => {
  if (movieQuery.value) {
    fetchSearchData(movieQuery.value);
    movieQuery.value = ''; 
  }
};

const selectMovie = (movie) => {
  console.log('Selected movie:', movie);
  searchResults.value = [];
};


</script>

<style scoped>

</style>
