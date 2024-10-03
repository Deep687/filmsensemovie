import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

import { ref } from "vue";

const uid=ref()

console
export const useUserData = defineStore('userData', {
  state: () => ({
    userData: null,
    errorMessage: "",
  
  }),
  actions: {
    async fetchUserData(uid) {

    


      try {
        const userProfileRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userProfileRef);

        if (userDoc.exists()) {
          this.userData = userDoc.data();
        } else {
          this.userData = null;
          throw new Error('No user profile found');
        }
      } catch (error) {
        this.errorMessage = error.message || 'Failed to fetch user data';
        console.error('Error fetching user data:', this.errorMessage);
      } finally {
        this.loading = false;
      }
    },
  },
});
