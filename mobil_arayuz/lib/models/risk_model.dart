class RiskModel {
  final String type;
  final String description;

  RiskModel({required this.type, required this.description});

  factory RiskModel.fromJson(Map<String, dynamic> json) {
    return RiskModel(
      type: json["type"]?.toString() ?? "",
      description: json["description"]?.toString() ?? "",
    );
  }
}
