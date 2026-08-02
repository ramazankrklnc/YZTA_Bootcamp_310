class PetitionResponse {
  final String petition;
  final List<String> missingFields;

  PetitionResponse({required this.petition, required this.missingFields});

  factory PetitionResponse.fromJson(Map<String, dynamic> json) {
    return PetitionResponse(
      petition: json["petition"]?.toString() ?? "",
      missingFields: List<String>.from(json["missingFields"] ?? []),
    );
  }
}
