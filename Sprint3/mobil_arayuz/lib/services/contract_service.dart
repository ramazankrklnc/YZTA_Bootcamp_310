import '../models/contract_response.dart';
import '../utils/api_constants.dart';
import 'api_service.dart';

class ContractService {
  final ApiService _apiService = ApiService();

  // JWT Token parametresi kaldırıldı
  Future<ContractResponse> analyzeContract(String contractText) async {
    final response = await _apiService.post(
      ApiConstants.analyzeContract,
      {"contractText": contractText},
      null, // Token gönderilmiyor
    );

    return ContractResponse.fromJson(response);
  }
}
