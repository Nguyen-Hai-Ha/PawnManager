import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {  state: () => ({
    user: null,
    permissions: [] // lưu quyền
  }),
  actions: {
    setUser(userData) {
      this.user = userData;
      this.permissions = userData.permissions;
    },
    logout() {
      this.user = null;
      this.permissions = [];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('permissions');
    }
  }
});