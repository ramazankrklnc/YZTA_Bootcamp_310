import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  Future<dynamic> get(String url, String? token) async {
    try {
      final response = await http.get(
        Uri.parse(url),
        headers: {
          "Content-Type": "application/json",
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
    final body = jsonDecode(response.body);

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return body;
    } else {
      // C# Web API'den dönen BadRequest("Mesaj") veya problem details içindeki mesajı alma
      final errorMessage =
          body["message"] ?? body["title"] ?? "Bilinmeyen bir hata oluştu.";
      throw Exception(errorMessage);
    }
  }
}
