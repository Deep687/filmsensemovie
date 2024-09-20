import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),
  actions: {
    addUser(user) {
      this.user = user;
    },
    clearUser() {
      this.user = null;
    },
  },
});
