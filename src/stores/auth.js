import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {  state: () => ({
    user: null,
    permissions: [] // lưu quyền
  }),
  actions: {
    setUser(userData) {
      this.user = userData;
      this.permissions = userData.permissions;
    }
  }
});