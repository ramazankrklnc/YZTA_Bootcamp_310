class TokenManager {
  static String? _token;

  static String? get token => _token;

  static void setToken(String token) {
    _token = token;
  }

  static void clearToken() {
    _token = null;
  }

  static bool get isAuthenticated => _token != null;
}
