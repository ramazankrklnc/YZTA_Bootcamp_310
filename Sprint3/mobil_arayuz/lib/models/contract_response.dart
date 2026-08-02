import 'risk_model.dart';

class ContractResponse {
  final bool success;
  final int riskScore;
  final String summary;
  final List<RiskModel> risks;
  final List<String> recommendations;

  ContractResponse({
    required this.success,
    required this.riskScore,
    required this.summary,
    required this.risks,
    required this.recommendations,
  });

  factory ContractResponse.fromJson(Map<String, dynamic> json) {
    // API bazen "analysis" objesi içinden, bazen direkt root'tan dönebilir
    final analysis = json["analysis"] is Map<String, dynamic>
        ? json["analysis"]
        : json;

    return ContractResponse(
      success: json["success"] ?? true,
      riskScore: analysis["risk_score"] ?? analysis["riskScore"] ?? 0,
      summary: analysis["summary"]?.toString() ?? "",
      risks: (analysis["risks"] as List? ?? [])
          .map((e) => RiskModel.fromJson(Map<String, dynamic>.from(e)))
          .toList(),
      recommendations: List<String>.from(analysis["recommendations"] ?? []),
    );
  }
}
