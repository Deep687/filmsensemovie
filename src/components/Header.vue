<template>
  <div class="relative z-10 p-4 flex  sm:flex-row justify-between items-center w-full h-16 bg-gradient-to-br from-gray-900 to-black bg-opacity-80 shadow-lg rounded-b-lg">
    <h1 class="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
      FilmSense
    </h1>
    <p class="text-orange-400 text-base sm:text-lg">
      Hello <span class="text-white font-semibold">{{ userStore.user?.displayName || 'Guest' }}</span>
    </p>
    <button 
      @click="handleSignOut" 
      class="bg-red-600 text-white font-semibold text-sm sm:text-base px-4 py-2 rounded-full hover:bg-red-700 transition duration-300 mt-2 sm:mt-0"
    >
      Sign Out
    </button>
  </div>
</template>

<script>
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase"; 
import { useRouter } from 'vue-router'; 
import { useUserStore } from "../stores/userStore";

export default {
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
console.log(userStore.user)
    const handleSignOut = async () => {
      try {
        await signOut(auth);
        router.push('/');
      } catch (error) {
        console.error('Sign-out error: ', error);
      }
    };

    return {
      handleSignOut,
      userStore,
    };
  }
};
</script>

<style scoped>
</style>
