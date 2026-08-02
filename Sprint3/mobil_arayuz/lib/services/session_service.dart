import '../utils/api_constants.dart';
import 'api_service.dart';

class SessionService {
  final ApiService _api = ApiService();

  Future<dynamic> createSession(String token) async {
    return await _api.post(ApiConstants.createSession, {}, token);
  }

  Future<dynamic> getSessions(String token) async {
    return await _api.get(ApiConstants.getSessions, token);
  }
}
