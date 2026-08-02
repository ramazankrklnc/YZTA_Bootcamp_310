import '../models/chat_response.dart';
import '../models/message.dart';
import '../utils/api_constants.dart';
import 'api_service.dart';

class ChatService {
  final ApiService _api = ApiService();

  // 1. Yapay Zekâya Soru Sorma
  Future<ChatResponse> askQuestion({
    required int sessionId,
    required String question,
    required String token,
  }) async {
    final response = await _api.post(ApiConstants.askQuestion, {
      "sessionId": sessionId,
      "question": question,
    }, token);

    return ChatResponse.fromJson(response);
  }

  // 2. Geçmiş Mesajları Getirme
  Future<List<Message>> getMessages({
    required int sessionId,
    required String token,
  }) async {
    final String url = "${ApiConstants.baseUrl}/api/Chat/history/$sessionId";

    final response = await _api.get(url, token);

    List<dynamic> list = [];

    if (response is List) {
      list = response;
    } else if (response is Map<String, dynamic>) {
      list =
          response['data'] ?? response['\$values'] ?? response['result'] ?? [];
    }

    List<Message> messages = [];

    for (int i = 0; i < list.length; i++) {
      final item = Map<String, dynamic>.from(list[i]);

      // Çift indeksler (0, 2, 4...) -> Kullanıcı Sorusu
      // Tek indeksler (1, 3, 5...)  -> Yapay Zekâ Cevabı
      final bool isUser = (i % 2 == 0);

      messages.add(
        Message.fromJson(item, isUserMessage: isUser, messageId: i + 1),
      );
    }

    return messages;
  }
}
