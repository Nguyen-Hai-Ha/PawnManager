<template>
    <div class="login-container">
        <div class="login-overlay"></div>
        <div class="login-card">
            <div class="login-header">
                <div class="logo-area">
                    <font-awesome-icon icon="fa-solid fa-file-invoice-dollar" class="logo-icon" />
                    <h1>Pawn<span>Manager</span></h1>
                </div>
                <p>Chào mừng bạn quay trở lại. Vui lòng đăng nhập để tiếp tục.</p>
            </div>

            <form @submit.prevent="handleLogin" class="login-form">
                <div class="form-group">
                    <label for="email">Email Hệ Thống</label>
                    <div class="input-wrapper">
                        <font-awesome-icon icon="fa-solid fa-user" class="input-icon" />
                        <input type="email" id="email" v-model="email" placeholder="nhanvien@pawn.com" required />
                    </div>
                </div>

                <div class="form-group">
                    <label for="password">Mật Khẩu</label>
                    <div class="input-wrapper">
                        <font-awesome-icon icon="fa-solid fa-lock" class="input-icon" />
                        <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
                            placeholder="••••••••" required />
                        <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                            <font-awesome-icon :icon="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" />
                        </button>
                    </div>
                </div>

                <div class="form-footer">
                    <label class="remember-me">
                        <input type="checkbox" v-model="rememberMe" />
                        <span>Ghi nhớ đăng nhập</span>
                    </label>
                    <a href="#" class="forgot-password">Quên mật khẩu?</a>
                </div>

                <button type="submit" class="btn-login" :disabled="isLoading">
                    <span v-if="!isLoading">Đăng Nhập</span>
                    <font-awesome-icon v-else icon="fa-solid fa-rotate" spin />
                </button>

                <div v-if="error" class="error-message">
                    <font-awesome-icon icon="fa-solid fa-circle-exclamation" />
                    {{ error }}
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import apiClient  from '@/plugins/axios';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);
const error = ref(null);

const handleLogin = async () => {
    isLoading.ref = true;
    error.value = null;

    try {
        const response = await apiClient.post('/staff/login', {
            email: email.value,
            password: password.value
        });

        const { staff, token, permissions } = response.data;

        // Set to store (now handles persistence inside)
        authStore.setUser({
            ...staff,
            permissions
        }, token);

        // Redirect to dashboard
        router.push('/admin/dashboard');
    } catch (err) {
        console.error('Login failed:', err);
        error.value = err.response?.data?.error || 'Đăng nhập không thành công. Vui lòng kiểm tra lại.';
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
.login-container {
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-position: center;
    position: relative;
    font-family: 'Inter', sans-serif;
}

.login-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%);
    backdrop-filter: blur(2px);
}

.login-card {
    position: relative;
    width: 100%;
    max-width: 440px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    z-index: 1;
}

.login-header {
    text-align: center;
    margin-bottom: 35px;
}

.logo-area {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 12px;
}

.logo-icon {
    font-size: 32px;
    color: #1a7a6e;
}

.logo-area h1 {
    font-size: 28px;
    font-weight: 800;
    margin: 0;
    color: #333;
}

.logo-area h1 span {
    color: #1a7a6e;
}

.login-header p {
    color: #666;
    font-size: 14px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #444;
    margin-bottom: 8px;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 15px;
    color: #999;
    font-size: 14px;
}

.input-wrapper input {
    width: 100%;
    padding: 12px 15px 12px 45px;
    border: 1px solid #ddd;
    border-radius: 10px;
    font-size: 15px;
    transition: all 0.2s;
    background: #fff;
}

.input-wrapper input:focus {
    outline: none;
    border-color: #1a7a6e;
    box-shadow: 0 0 0 3px rgba(26, 122, 110, 0.1);
}

.toggle-password {
    position: absolute;
    right: 15px;
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    padding: 0;
}

.form-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
}

.remember-me {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    color: #555;
}

.remember-me input {
    width: 16px;
    height: 16px;
    accent-color: #1a7a6e;
}

.forgot-password {
    font-size: 13px;
    color: #1a7a6e;
    text-decoration: none;
    font-weight: 600;
}

.forgot-password:hover {
    text-decoration: underline;
}

.btn-login {
    width: 100%;
    padding: 14px;
    background: #1a7a6e;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-login:hover {
    background: #156157;
}

.btn-login:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.error-message {
    margin-top: 20px;
    padding: 10px;
    background: #fff0f0;
    border-left: 4px solid #ff5a5a;
    color: #d32f2f;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 4px;
}
</style>
