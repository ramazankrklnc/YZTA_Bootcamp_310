import '../models/chat_response.dart';
import '../utils/api_constants.dart';
import 'api_service.dart';

class ChatService {
  final ApiService _api = ApiService();

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
}
