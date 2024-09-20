<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black font-sans text-gray-300">
    <h1 class="p-4 xs:p-6 sm:p-6 md:p-8 lg:p-8 xl:p-8 text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 font-sans">
      FilmSense
    </h1>
    <div class="flex-grow flex items-center justify-center px-2 sm:px-4 lg:px-6">
      <div class="w-full max-w-[90%] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
        <h2 class="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-white text-center">
          {{ isLogin ? "Welcome Back" : "Join FilmSense" }}
        </h2>
        <form class="space-y-3 sm:space-y-4" @submit.prevent="handleSubmit">
          <div v-if="!isLogin" class="relative">
            <input
              type="text"
              v-model="name"
              class="w-full px-3 sm:px-4 pt-5 pb-2 text-xs sm:text-sm md:text-base bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 peer"
              id="name"
              placeholder=" "
            />
            <label
              for="name"
              class="absolute text-xs sm:text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 sm:left-4
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-red-500"
            >
              Full Name
            </label>
          </div>
          <div class="relative">
            <input
              type="email"
              v-model="email"
              class="w-full px-3 sm:px-4 pt-5 pb-2 text-xs sm:text-sm md:text-base bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 peer"
              id="email"
              placeholder=" "
            />
            <label
              for="email"
              class="absolute text-xs sm:text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 sm:left-4
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-red-500"
            >
              Email Address
            </label>
          </div>
          <div class="relative">
            <input
              type="password"
              v-model="password"
              class="w-full px-3 sm:px-4 pt-5 pb-2 text-xs sm:text-sm md:text-base bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 peer"
              id="password"
              placeholder=" "
            />
            <label
              for="password"
              class="absolute text-xs sm:text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 sm:left-4
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-red-500"
            >
              Password
            </label>
          </div>
          <p v-if="errorMessage" class="text-red-500 text-xs sm:text-sm font-medium">
            {{ errorMessage }}
          </p>
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 sm:py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition duration-300 font-bold shadow-lg text-xs sm:text-sm md:text-base"
          >
            {{ isLogin ? "Sign In" : "Create Account" }}
          </button>
        </form>
        <div class="mt-4 sm:mt-6 text-xs sm:text-sm text-center">
          <span class="text-gray-400">
            {{ isLogin ? "New to FilmSense? " : "Already have an account? " }}
          </span>
          <button @click="toggleForm" class="text-red-400 hover:text-red-300 font-semibold transition duration-300">
            {{ isLogin ? "Create an account" : "Sign in" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { validData } from '../utils/Valid';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../utils/firebase';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

export default {
  setup() {
    const isLogin = ref(true);
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');
    
    const userStore = useUserStore();
    const router = useRouter();

    const toggleForm = () => {
      isLogin.value = !isLogin.value;
      errorMessage.value = '';
    };

    const handleSubmit = () => {
      const message = validData(isLogin.value, name.value, email.value, password.value);
      if (message) {
        errorMessage.value = message;
        return;
      }

      if (isLogin.value) {
        // Sign In
        signInWithEmailAndPassword(auth, email.value, password.value)
          .then((userCredential) => {
            const user = userCredential.user;
            userStore.addUser(user);
            errorMessage.value = '';
            router.push('/browse');
          })
          .catch((error) => {
            errorMessage.value = error.message;
          });
      } else {
        // Sign Up
        createUserWithEmailAndPassword(auth, email.value, password.value)
          .then((userCredential) => {
            const user = userCredential.user;
            userStore.addUser(user);

            // Update profile with user's name
            updateProfile(auth.currentUser, {
              displayName: name.value,
              photoURL: "https://example.com/user/profile.jpg"  // You can adjust this to the user's actual photo URL if needed
            }).then(() => {
              errorMessage.value = '';
              router.push('/browse');
            }).catch((error) => {
              errorMessage.value = error.message;
            });
          })
          .catch((error) => {
            errorMessage.value = error.message;
          });
      }
    };

    return {
      isLogin,
      name,
      email,
      password,
      errorMessage,
      toggleForm,
      handleSubmit,
    };
  }
};
</script>
