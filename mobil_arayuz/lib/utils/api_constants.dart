class ApiConstants {
  // Bu kısmı güncelleyeceğiz NGROK üzerinden test etmek için
  static const String baseUrl = "https://10.0.2.2:7127/api";

  static const String login = "$baseUrl/auth/login";
  static const String register = "$baseUrl/auth/register";

  static const String createSession = "$baseUrl/session/create";
  static const String getSessions = "$baseUrl/session";

  static const String askQuestion = "$baseUrl/chat/ask";
}
