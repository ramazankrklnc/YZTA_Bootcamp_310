class Message {
  final int id;
  final bool isUser;
  final String content;
  final DateTime createdAt;

  Message({
    required this.id,
    required this.isUser,
    required this.content,
    required this.createdAt,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json["id"],
      isUser: json["isUser"],
      content: json["content"],
      createdAt: DateTime.parse(json["createdAt"]),
    );
  }
}
