import { useAuthStore } from '@/stores/auth';
import { watchEffect } from 'vue';

export const permissionDirective = {
  mounted(el, binding) {
    const authStore = useAuthStore();

    // Tạo một watchEffect để có thể phản ứng với thay đổi của store
    watchEffect(() => {
      const { value } = binding;
      const user = authStore.user;
      const permissions = authStore.permissions || [];

      // Admin thì luôn cho hiện
      if (user?.role === 'admin') {
        el.style.display = '';
        return;
      }

      const hasPermission = Array.isArray(value) 
        ? value.some(p => permissions.includes(p))
        : permissions.includes(value);

      if (value && !hasPermission) {
        el.style.display = 'none';
      } else {
        el.style.display = '';
      }
    });
  }
};