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
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown.down.prevent="highlightSuggestion(1)"
          @keydown.up.prevent="highlightSuggestion(-1)"
          @keydown.enter.prevent="selectHighlightedMovie"
          class="w-full px-4 py-3 text-lg bg-gray-800 text-gray-200 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300 placeholder-gray-500"
          id="search"
          placeholder="Search movies"
        />
      </div>
      <ul v-if="searchResults.length && isSuggestionsVisible" class="mt-14 absolute left-0 mt-1 w-full bg-gray-800 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
        <li
          v-for="(result, index) in searchResults"
          :key="index"
          :class="{'bg-gray-700': index === highlightedIndex}"
          @click="selectMovie(result)"
          class="cursor-pointer transition duration-200"
        >
          <router-link :to="{ name: 'movieDetails', params: { id: result.id } }" class="block px-4 py-2 text-white">
            {{ result.title }}
          </router-link>
        </li>
      </ul>
    </form>

    <nav v-if="currentRoute !== '/'" class="flex flex-nowrap items-center space-x-4">
      <router-link
        :to="{ path: '/home' }"
        :class="{ 'text-teal-500': currentRoute === '/home', 'text-white': currentRoute !== '/home' }"
        class="font-semibold transition duration-300"
      >
        Home
      </router-link>

      <router-link
        v-if="currentRoute !== '/'"
        :to="{ path: '/watchlist' }"
        :class="{ 'text-teal-500': currentRoute === '/watchlist', 'text-white': currentRoute !== '/watchlist' }"
        class="flex items-center justify-center p-1 md:p-2 rounded-lg hover:text-teal-500 transition duration-300 ease-in-out"
      >
        <span class="mr-1 md:mr-2">Watchlist</span>
        <div v-if="watchlist.watchlist.length > 0">
          <span class="bg-teal-500 text-white rounded-full px-2 py-1 text-xs">
            {{ watchlist.watchlist.length }}
          </span>
        </div>
      </router-link>

      <div class="hs-dropdown relative inline-flex">
        <button
          @click="toggleDropdown"
          type="button"
          class="hs-dropdown-toggle py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          aria-haspopup="menu"
          :aria-expanded="isDropdownOpen.toString()"
          aria-label="Dropdown"
        >
          Profile
          <svg
            class="hs-dropdown-open:rotate-180 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <div
          v-if="isDropdownOpen"
          class="hs-dropdown-menu transition-opacity duration-300 opacity-100 min-w-60 bg-white shadow-md rounded-lg mt-1 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700 z-10 absolute right-0 top-full"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="hs-dropdown-default"
        >
          <div class="p-1 space-y-0.5">
            <a class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700">
              Hello,<span class="text-white font-semibold">{{userStore.user?.displayName || 'Guest' }}</span>
            </a>
            <button
              @click="handleSignOut"
              class="bg-teal-500 text-white font-semibold px-2 py-1 md:py-2 md:px-2 rounded-lg hover:bg-teal-800 transition duration-300 text-xs md:text-sm whitespace-nowrap"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from "../stores/userStore";
import { computed, ref, watch } from "vue";
import { fetchSearchMovies } from "../utils/searchMovies";
import { useWatchlistStore } from "../utils/watchListStore";

const watchlist = useWatchlistStore();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const currentRoute = computed(() => route.path);
const movieQuery = ref("");
const searchResults = ref([]);
const highlightedIndex = ref(-1);
const isSuggestionsVisible = ref(false);
const isDropdownOpen = ref(false);

const fetchSearchData = async (query) => {
  if (!query || query.length < 2) {
    searchResults.value = [];
    isSuggestionsVisible.value = false;
    return; 
  }
  try {
    const searchData = await fetchSearchMovies(query);
    searchResults.value = searchData.results;
    isSuggestionsVisible.value = true; 
  } catch (err) {
    console.error("Failed to fetch data:", err);
  }
};

watch(movieQuery, (newQuery) => {
  fetchSearchData(newQuery);
});

const handleFocus = () => {
  if (movieQuery.value.length >= 2) {
    isSuggestionsVisible.value = true; 
  }
};

const handleBlur = () => {
  setTimeout(() => {
    isSuggestionsVisible.value = false;
  }, 100);
};

const highlightSuggestion = (direction) => {
  if (direction === 1) {
    highlightedIndex.value = (highlightedIndex.value + 1) % searchResults.value.length; 
  } else {
    highlightedIndex.value = (highlightedIndex.value - 1 + searchResults.value.length) % searchResults.value.length; 
  }
};

const selectHighlightedMovie = () => {
  if (highlightedIndex.value >= 0 && highlightedIndex.value < searchResults.value.length) {
    selectMovie(searchResults.value[highlightedIndex.value]);
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
  }
  movieQuery.value = '';
};

const selectMovie = (movie) => {
 
  searchResults.value = [];
  movieQuery.value = ''; 
  highlightedIndex.value = -1; 
  isSuggestionsVisible.value = false; 
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

document.addEventListener('click', (event) => {
  const dropdown = document.querySelector('.hs-dropdown-menu');
  const toggleButton = document.querySelector('.hs-dropdown-toggle');

  if (isDropdownOpen.value && dropdown && toggleButton && !dropdown.contains(event.target) && !toggleButton.contains(event.target)) {
    isDropdownOpen.value = false;
  }
});
</script>

<style scoped></style>
