<template>
  <header class="relative z-10 p-4 flex flex-col md:flex-row justify-between items-center w-full bg-gradient-to-br from-gray-900 to-black bg-opacity-80 shadow-lg">
    <h1 class="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-teal-500 ml-2 md:ml-12 mb-2 md:mb-0">
      FilmSense
    </h1>


    <form v-if="currentRoute !== '/'" @submit.prevent="handleSubmit" class="flex w-full max-w-md md:w-1/3 mt-2 md:mt-0 mb-4 mx-auto relative">
      <div class="relative w-full">
        <input
          type="text"
          v-model="movieQuery"
          class="w-full px-4 py-3 text-base bg-gray-800 text-gray-200 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-300 placeholder-gray-500 peer"
          id="search"
          placeholder=""
        />
        <label
          for="search"
          class="absolute text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 left-4 z-10 origin-[0] 
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
            peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-red-600"
        >
          Search movies
        </label>
      </div>

    
      <ul v-if="searchResults.length" class="absolute left-0 mt-1 w-full bg-gray-800 rounded-lg shadow-lg z-20 overflow-hidden max-h-48 overflow-y-auto">
        <li v-for="(result, index) in searchResults" :key="index" @click="selectMovie(result)" class="cursor-pointer">
          <router-link :to="{ name: 'movieDetails', params: { id: result.id } }" class="block px-4 py-2 text-white hover:bg-gray-700">
            {{ result.title }}
          </router-link>
        </li>
      </ul>
    </form>

    <div v-if="currentRoute !== '/'" class="flex items-center space-x-4 mb-2 md:mb-0">
      <p class="text-teal-500 text-sm">
        Hello <span class="text-white font-semibold">{{ userStore.user?.displayName || 'Guest' }}</span>
      </p>
      <button 
        @click="handleSignOut" 
        class="bg-teal-500 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-teal-600 transition duration-300"
      >
        Sign out
      </button>
    </div>
  </header>
</template>

<script setup>
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase"; 
import { useRouter, useRoute } from 'vue-router'; 
import { useUserStore } from "../stores/userStore";
import { computed, ref } from "vue";
import { fetchSearchMovies } from "../utils/searchMovies";

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
