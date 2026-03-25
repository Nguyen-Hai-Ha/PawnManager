import { useAuthStore } from '@/stores/auth';

export const permissionDirective = {
  mounted(el, binding) {
    const { value } = binding;
    const authStore = useAuthStore();
    
    // Admin thì luôn cho hiện
    if (authStore.user?.role === 'admin') return;

    if (value && !authStore.permissions.includes(value)) {
      // Nếu không có quyền, xóa phần tử khỏi DOM
      el.parentNode && el.parentNode.removeChild(el);
    }
  }
};