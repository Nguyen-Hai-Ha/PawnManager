import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    permissions: JSON.parse(localStorage.getItem('permissions')) || []
  }),
  actions: {
    setUser(userData, token) {
      this.user = userData;
      this.permissions = userData.permissions || [];

      // Persistence
      if (token) localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('permissions', JSON.stringify(this.permissions));
    },
    logout() {
      this.user = null;
      this.permissions = [];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('permissions');
      localStorage.removeItem('access_token'); // Dọn dẹp cả token từ axios plugin nếu có
    }
  },
  persist: true
});