import '../models/login_request.dart';
import '../models/register_request.dart';
import '../utils/api_constants.dart';
import 'api_service.dart';

class AuthService {
  final ApiService _api = ApiService();

  // Parametreleri süslü parantez {} içine alarak named parameter yaptık
  Future<dynamic> login({
    required String email,
    required String password,
  }) async {
    final requestBody = LoginRequest(email: email, password: password).toJson();
    return await _api.post(ApiConstants.login, requestBody, null);
  }

  Future<dynamic> register({
    required String fullName,
    required String email,
    required String password,
  }) async {
    final requestBody = RegisterRequest(
      fullName: fullName,
      email: email,
      password: password,
    ).toJson();
    return await _api.post(ApiConstants.register, requestBody, null);
  }
}
