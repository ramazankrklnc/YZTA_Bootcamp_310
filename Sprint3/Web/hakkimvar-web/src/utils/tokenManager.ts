import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  name?: string;
  email?: string;
  sub?: string;
  [key: string]: any;
}

export const TokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem('jwt_token');
  },
  setToken: (token: string): void => {
    localStorage.setItem('jwt_token', token);
  },
  clearToken: (): void => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
  },
  hasToken: (): boolean => {
    return !!localStorage.getItem('jwt_token');
  },

  // 🟢 Eksik Olan Fonksiyon: Token İçinden Kullanıcı Bilgilerini Okur
  getUserFromToken: (): { fullName: string; email: string } | null => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return null;

    try {
      const decoded: JwtPayload = jwtDecode(token);

      // ASP.NET Core JWT Claim standart isimleri veya varsayılan JWT key'leri:
      const fullName =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
        decoded.name ||
        decoded.unique_name ||
        'Kullanıcı';

      const email =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
        decoded.email ||
        decoded.sub ||
        '';

      return { fullName, email };
    } catch (error) {
      console.error('JWT Token decode hatası:', error);
      return null;
    }
  },
};