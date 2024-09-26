<template>
  <div class="relative z-10 p-4 flex justify-between items-center w-full h-16 bg-gradient-to-br from-gray-900 to-black bg-opacity-80 shadow-lg">
    <h1 class="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-teal-500 ml-2 md:ml-12">
      FilmSense
    </h1>
    <div v-if="currentRoute !== '/'" class="flex items-center space-x-2 mr-0 md:mr-7">
      <p class="text-teal-500 text-xs sm:text-base">
        Hello <span class="text-white font-semibold">{{ userStore.user?.displayName || 'Guest' }}</span>
      </p>
      <button 
        @click="handleSignOut" 
        class="bg-teal-500 text-white font-semibold text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 hover:bg-teal-700 transition duration-300"
      >
        Sign out
      </button>
    </div>
  </div>
</template>

<script setup>
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase"; 
import { useRouter, useRoute } from 'vue-router'; 
import { useUserStore } from "../stores/userStore";
import { computed } from "vue";

const route = useRoute();
const currentRoute = computed(() => route.path);
console.log(currentRoute);
const router = useRouter();
const userStore = useUserStore();

const handleSignOut = async () => {
  try {
    await signOut(auth);
    router.push('/');
  } catch (error) {
    console.error('Sign-out error: ', error);
  }
};
</script>

<style scoped>

</style>
