import '../models/petition_response.dart';
import '../utils/api_constants.dart';
import 'api_service.dart';

class PetitionService {
  final ApiService _apiService = ApiService();

  // JWT Token parametresi kaldırıldı
  Future<PetitionResponse> createPetition(String problem) async {
    final response = await _apiService.post(
      ApiConstants.createPetition,
      {"problem": problem},
      null, // Token gönderilmiyor
    );

    return PetitionResponse.fromJson(response);
  }
}
