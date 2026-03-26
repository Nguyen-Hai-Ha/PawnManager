import { useAuthStore } from '@/stores/auth';
import { watchEffect } from 'vue';

export const permissionDirective = {
  mounted(el, binding) {
    const authStore = useAuthStore();

    // Tạo một watchEffect để có thể phản ứng với thay đổi của store (nếu có delay khi load)
    watchEffect(() => {
      const { value } = binding;
      const user = authStore.user;
      const permissions = authStore.permissions || [];

      // Admin thì luôn cho hiện
      if (user?.role === 'admin') {
        el.style.display = '';
        return;
      }

      if (value && !permissions.includes(value)) {
        // Thay vì xóa DOM (có thể gây lỗi khi hydrate hoặc cần hiện lại), ta ẩn đi
        el.style.display = 'none';
      } else {
        el.style.display = '';
      }
    });
  }
};