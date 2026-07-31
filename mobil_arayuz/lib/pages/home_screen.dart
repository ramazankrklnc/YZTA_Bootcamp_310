import 'package:flutter/material.dart';
import 'package:mobil_arayuz/models/chat_session.dart';
import 'package:mobil_arayuz/models/message.dart';
import 'package:mobil_arayuz/services/chat_service.dart';
import 'package:mobil_arayuz/services/session_service.dart';
import 'package:mobil_arayuz/utils/token_manager.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final SessionService _sessionService = SessionService();
  final ChatService _chatService = ChatService();
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  List<ChatSession> _sessions = [];
  List<Message> _messages = [];

  int? _activeSessionId;
  bool _isLoadingSessions = false;
  bool _isSendingMessage = false;

  @override
  void initState() {
    super.initState();
    _fetchSessions();
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  // 1. Kullanıcının Geçmiş Oturumlarını Getirme
  Future<void> _fetchSessions() async {
    final token = TokenManager.token;
    if (token == null) return;

    setState(() => _isLoadingSessions = true);

    try {
      final response = await _sessionService.getSessions(token);
      if (response != null && response is List) {
        setState(() {
          _sessions = response.map((s) => ChatSession.fromJson(s)).toList();
          if (_sessions.isNotEmpty && _activeSessionId == null) {
            _activeSessionId = _sessions.first.id;
          }
        });
      }
    } catch (e) {
      _showSnackBar('Oturumlar yüklenirken hata oluştu: ${e.toString()}');
    } finally {
      if (mounted) {
        setState(() => _isLoadingSessions = false);
      }
    }
  }

  // 2. Yeni Oturum (Sohbet) Oluşturma
  Future<int?> _createNewSession({bool closeDrawer = true}) async {
    final token = TokenManager.token;
    if (token == null) {
      _showSnackBar('Oturum süreniz dolmuş, lütfen tekrar giriş yapın.');
      return null;
    }

    try {
      final response = await _sessionService.createSession(token);
      if (response != null) {
        final newSession = ChatSession.fromJson(response);
        setState(() {
          _sessions.insert(0, newSession);
          _activeSessionId = newSession.id;
          _messages.clear();
        });

        if (closeDrawer && Navigator.canPop(context)) {
          Navigator.pop(context); // Drawer açık ise kapat
        }
        return newSession.id;
      }
    } catch (e) {
      _showSnackBar('Oturum oluşturulamadı: ${e.toString()}');
    }
    return null;
  }

  // 3. Yapay Zekâya Soru Sorma (Chat)
  Future<void> _sendMessage() async {
    final question = _messageController.text.trim();
    final token = TokenManager.token;

    if (question.isEmpty) return;

    if (token == null) {
      _showSnackBar('Lütfen tekrar giriş yapın.');
      return;
    }

    // Eğer aktif bir oturum yoksa arka planda otomatik yeni oturum oluştur
    int? currentSessionId = _activeSessionId;
    if (currentSessionId == null) {
      setState(() => _isSendingMessage = true);
      currentSessionId = await _createNewSession(closeDrawer: false);
      if (currentSessionId == null) {
        setState(() => _isSendingMessage = false);
        return; // Oturum oluşturulamazsa işlemi durdur
      }
    }

    // Kullanıcı mesajını ekrana anında ekle
    final userMessage = Message(
      id: DateTime.now().millisecondsSinceEpoch,
      isUser: true,
      content: question,
      createdAt: DateTime.now(),
    );

    setState(() {
      _messages.add(userMessage);
      _isSendingMessage = true;
    });

    _messageController.clear();
    _scrollToBottom();

    try {
      final chatResponse = await _chatService.askQuestion(
        sessionId: currentSessionId,
        question: question,
        token: token,
      );

      // Yapay Zekâ cevabını ekrana ekle
      final aiMessage = Message(
        id: DateTime.now().millisecondsSinceEpoch + 1,
        isUser: false,
        content: chatResponse.answer,
        createdAt: DateTime.now(),
      );

      setState(() {
        _messages.add(aiMessage);
      });

      _scrollToBottom();
    } catch (e) {
      _showSnackBar('Cevap alınamadı: ${e.toString()}');
    } finally {
      if (mounted) {
        setState(() => _isSendingMessage = false);
      }
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _showSnackBar(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), behavior: SnackBarBehavior.floating),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      appBar: AppBar(
        title: const Text('HakkımVar AI'),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 1,
        foregroundColor: Colors.blue.shade900,
        actions: [
          IconButton(
            icon: const Icon(Icons.add_comment_outlined),
            tooltip: 'Yeni Sohbet',
            onPressed: () => _createNewSession(closeDrawer: false),
          ),
        ],
      ),

      // SOL MENÜ (Geçmiş Sohbetler Drawer)
      drawer: Drawer(
        child: Column(
          children: [
            UserAccountsDrawerHeader(
              accountName: const Text('HakkımVar Kullanıcısı'),
              accountEmail: const Text('Kira & Hukuk Danışmanlığı'),
              currentAccountPicture: const CircleAvatar(
                backgroundColor: Colors.white,
                child: Icon(Icons.gavel, color: Colors.blue, size: 32),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.add_circle_outline, color: Colors.blue),
              title: const Text(
                'Yeni Analiz / Sohbet',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              onTap: () => _createNewSession(closeDrawer: true),
            ),
            const Divider(),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Geçmiş Analizler',
                  style: TextStyle(
                    color: Colors.grey,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            Expanded(
              child: _isLoadingSessions
                  ? const Center(child: CircularProgressIndicator())
                  : ListView.builder(
                      itemCount: _sessions.length,
                      itemBuilder: (context, index) {
                        final session = _sessions[index];
                        final isSelected = session.id == _activeSessionId;

                        return ListTile(
                          selected: isSelected,
                          selectedTileColor: Colors.blue.shade50,
                          leading: Icon(
                            Icons.chat_bubble_outline,
                            color: isSelected
                                ? Colors.blue.shade900
                                : Colors.grey,
                          ),
                          title: Text(
                            session.title.isEmpty
                                ? 'Sohbet #${session.id}'
                                : session.title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontWeight: isSelected
                                  ? FontWeight.bold
                                  : FontWeight.normal,
                            ),
                          ),
                          onTap: () {
                            setState(() {
                              _activeSessionId = session.id;
                              _messages.clear();
                            });
                            Navigator.pop(context);
                          },
                        );
                      },
                    ),
            ),
          ],
        ),
      ),

      // CHAT ALANI
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: _messages.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.balance,
                            size: 64,
                            color: Colors.blue.shade200,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'Kira Sözleşmenizle ilgili bir soru sorun',
                            style: TextStyle(
                              color: Colors.grey.shade600,
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Örn: "Ev sahibi kirayı %50 artırabilir mi?"',
                            style: TextStyle(
                              color: Colors.grey.shade400,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      controller: _scrollController,
                      padding: const EdgeInsets.all(16),
                      itemCount: _messages.length,
                      itemBuilder: (context, index) {
                        final msg = _messages[index];
                        return _buildMessageBubble(msg);
                      },
                    ),
            ),

            if (_isSendingMessage)
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16.0,
                  vertical: 8.0,
                ),
                child: Row(
                  children: [
                    const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      'HakkımVar AI cevabı hazırlıyor...',
                      style: TextStyle(
                        color: Colors.grey.shade600,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),

            // MESAJ YAZMA ALANI
            Container(
              padding: const EdgeInsets.all(12),
              decoration: const BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 4,
                    offset: Offset(0, -2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      decoration: InputDecoration(
                        hintText: 'Hukuki sorunuzu yazın...',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide.none,
                        ),
                        fillColor: Colors.grey.shade100,
                        filled: true,
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 10,
                        ),
                      ),
                      onSubmitted: (_) =>
                          _isSendingMessage ? null : _sendMessage(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  CircleAvatar(
                    backgroundColor: Colors.blue.shade800,
                    child: IconButton(
                      icon: const Icon(
                        Icons.send_rounded,
                        color: Colors.white,
                        size: 20,
                      ),
                      onPressed: _isSendingMessage ? null : _sendMessage,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Mesaj Balonu Widget'ı
  Widget _buildMessageBubble(Message msg) {
    final isUser = msg.isUser;

    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 6),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.78,
        ),
        decoration: BoxDecoration(
          color: isUser ? Colors.blue.shade800 : Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft: Radius.circular(isUser ? 16 : 4),
            bottomRight: Radius.circular(isUser ? 4 : 16),
          ),
          boxShadow: [
            if (!isUser)
              const BoxShadow(
                color: Colors.black12,
                blurRadius: 4,
                offset: Offset(0, 2),
              ),
          ],
        ),
        child: Text(
          msg.content,
          style: TextStyle(
            color: isUser ? Colors.white : Colors.black87,
            fontSize: 14,
            height: 1.4,
          ),
        ),
      ),
    );
  }
}
