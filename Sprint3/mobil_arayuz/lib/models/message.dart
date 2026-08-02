class Message {
  final int id;
  final int sessionId;
  final bool isUser;
  final String content;
  final DateTime createdAt;

  Message({
    required this.id,
    required this.sessionId,
    required this.isUser,
    required this.content,
    required this.createdAt,
  });

  // API'den gelen { "sessionId": 2, "answer": "...", "score": 0, "isValid": true } yapısına göre:
  factory Message.fromJson(
    Map<String, dynamic> json, {
    required bool isUserMessage,
    int messageId = 0,
  }) {
    return Message(
      id: messageId,
      sessionId: json['sessionId'] is int
          ? json['sessionId']
          : int.tryParse(json['sessionId']?.toString() ?? '0') ?? 0,
      isUser: isUserMessage,
      content: json['answer']?.toString() ?? '',
      createdAt: DateTime.now(),
    );
  }
}
