class ApiConstants {
  // Bu kısmı güncelleyeceğiz NGROK üzerinden test etmek için
  static const String baseUrl =
      "https://nonexistentially-nonstatic-reita.ngrok-free.dev";

  static const String login = "$baseUrl/api/Auth/login";
  static const String register = "$baseUrl/api/Auth/register";

  static const String createSession = "$baseUrl/api/Session/create";
  static const String getSessions = "$baseUrl/api/Session/list";

  static const String askQuestion = "$baseUrl/api/Chat/ask";

  // Yeni Eklenen Endpoint'ler:
  static const String analyzeContract = "$baseUrl/api/Contract/analyze";
  static const String createPetition = "$baseUrl/api/Petition/create";
}
