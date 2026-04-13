import axios from 'axios';

// Tạo baseURL động dựa vào host hiện tại
const getApiBaseURL = () => {
  // Nếu là production/public, sử dụng host hiện tại
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Cho devtunnels hoặc domain công khai khác
    return `${window.location.protocol}//${window.location.host}/api`;
  }
  // Cho development local
  return 'http://localhost:3000/api';
};

const apiClient = axios.create({
  baseURL: getApiBaseURL(),
  timeout: 10000,
  headers: {
    'Accept': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Token hết hạn hoặc không hợp lệ');
      // Xóa sạch storage trước khi redirect để tránh loop
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('permissions');
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;