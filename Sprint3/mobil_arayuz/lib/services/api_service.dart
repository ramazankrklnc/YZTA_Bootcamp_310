import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  Future<dynamic> get(String url, String? token) async {
    try {
      final response = await http.get(
        Uri.parse(url),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          // NGOK UYARI SAYFASINI ATLAMAK İÇİN KRİTİK HEADER:
          "ngrok-skip-browser-warning": "true",
          if (token != null) "Authorization": "Bearer $token",
        },
      );

      return _handleResponse(response);
    } catch (e) {
      throw Exception("Sunucuya bağlanılamadı: $e");
    }
  }

  Future<dynamic> post(String url, dynamic body, String? token) async {
    try {
      final response = await http.post(
        Uri.parse(url),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          // NGOK UYARI SAYFASINI ATLAMAK İÇİN KRİTİK HEADER:
          "ngrok-skip-browser-warning": "true",
          if (token != null) "Authorization": "Bearer $token",
        },
        body: jsonEncode(body),
      );

      return _handleResponse(response);
    } catch (e) {
      throw Exception("Sunucuya bağlanılamadı: $e");
    }
  }

  dynamic _handleResponse(http.Response response) {
    // Yanıt gövdesi boş gelirse çökmesini engelle
    if (response.body.trim().isEmpty) {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return [];
      } else {
        throw Exception(
          "Sunucudan boş yanıt döndü. HTTP Kodu: ${response.statusCode}",
        );
      }
    }

    dynamic body;
    try {
      body = jsonDecode(response.body);
    } catch (e) {
      print("❌ Dönen Raw Yanıt Metni: ${response.body}");
      throw Exception(
        "JSON Parse Hatası (HTTP ${response.statusCode}): ${response.body}",
      );
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return body;
    } else {
      final errorMessage = (body is Map)
          ? (body["message"] ?? body["title"] ?? "Bilinmeyen hata")
          : "Hata oluştu. Durum Kodu: ${response.statusCode}";
      throw Exception(errorMessage);
    }
  }
}
