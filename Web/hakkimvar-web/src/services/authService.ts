import api from './api';
import { TokenManager } from '../utils/tokenManager';

export const authService = {
  // GİRİŞ YAPMA METODU
  async login(email: string, password: string) {
    const response = await api.post('api/Auth/login', { email, password });
    const data = response.data;

    // Token varsa kaydet
    if (data.token) {
      TokenManager.setToken(data.token);
    }

    // Kullanıcı bilgisini kaydet
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    } else {
      localStorage.setItem(
        'user',
        JSON.stringify({
          fullName: data.fullName || data.name || 'Kullanıcı',
          email: data.email || email,
        })
      );
    }

    return data;
  },

  // 🟢 KAYIT OLMA METODU (Eksik Olan Kısım)
  async register(fullName: string, email: string, password: string) {
    // Backend API'nizin beklediği JSON modeline göre payload oluşturulur
    const response = await api.post('/api/Auth/register', {
      fullName, // veya backend 'name' bekliyorsa 'name: fullName' yapabilirsiniz
      email,
      password,
    });

    return response.data;
  },

  // ÇIKIŞ YAPMA METODU
  logout() {
    TokenManager.clearToken();
    localStorage.removeItem('user');
  },
};