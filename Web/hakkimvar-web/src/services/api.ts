import axios from 'axios';
import { TokenManager } from '../utils/tokenManager';

const API_BASE_URL = 'https://nonexistentially-nonstatic-reita.ngrok-free.dev';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Flutter ApiService.dart içindeki kritik header
    'ngrok-skip-browser-warning': 'true',
  },
});

// Request Interceptor: Token varsa Header'a ekle
api.interceptors.request.use(
  (config) => {
    const token = TokenManager.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Header'ın ngrok tarafından ezilmesini önle
    config.headers['ngrok-skip-browser-warning'] = 'true';
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401 yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      TokenManager.clearToken();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;