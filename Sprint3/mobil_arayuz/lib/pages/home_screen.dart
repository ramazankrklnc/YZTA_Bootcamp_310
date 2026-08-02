import 'package:flutter/material.dart';
import 'package:mobil_arayuz/models/chat_session.dart';
import 'package:mobil_arayuz/models/message.dart';
import 'package:mobil_arayuz/services/chat_service.dart';
import 'package:mobil_arayuz/services/session_service.dart';
import 'package:mobil_arayuz/utils/theme_manager.dart'; // Tema yönetimi eklendi
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

  // 1. Kullanıcının Geçmiş Oturumlarını Getirme ve İlk Oturumun Mesajlarını Yükleme
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

        if (_activeSessionId != null) {
          _fetchMessages(_activeSessionId!);
        }
      }
    } catch (e) {
      _showSnackBar('Oturumlar yüklenirken hata oluştu: ${e.toString()}');
    } finally {
      if (mounted) {
        setState(() => _isLoadingSessions = false);
      }
    }
  }

  // 2. Seçilen Oturuma Ait Geçmiş Mesajları Getirme
  Future<void> _fetchMessages(int sessionId) async {
    final token = TokenManager.token;
    if (token == null) return;

    setState(() {
      _activeSessionId = sessionId;
      _messages.clear();
      _isSendingMessage = true;
    });

    try {
      final messages = await _chatService.getMessages(
        sessionId: sessionId,
        token: token,
      );

      setState(() {
        _messages = messages;
      });

      _scrollToBottom();
    } catch (e) {
      _showSnackBar('Mesajlar yüklenemedi: ${e.toString()}');
    } finally {
      if (mounted) {
        setState(() => _isSendingMessage = false);
      }
    }
  }

  // 3. Yeni Oturum (Sohbet) Oluşturma
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
          Navigator.pop(context);
        }
        return newSession.id;
      }
    } catch (e) {
      _showSnackBar('Oturum oluşturulamadı: ${e.toString()}');
    }
    return null;
  }

  // 4. Yapay Zekâya Soru Sorma (Chat)
  Future<void> _sendMessage() async {
    final question = _messageController.text.trim();
    final token = TokenManager.token;

    if (question.isEmpty) return;

    if (token == null) {
      _showSnackBar('Lütfen tekrar giriş yapın.');
      return;
    }

    int? currentSessionId = _activeSessionId;
    if (currentSessionId == null) {
      setState(() => _isSendingMessage = true);
      currentSessionId = await _createNewSession(closeDrawer: false);
      if (currentSessionId == null) {
        setState(() => _isSendingMessage = false);
        return;
      }
    }

    final userMessage = Message(
      id: DateTime.now().millisecondsSinceEpoch,
      sessionId: currentSessionId,
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

      final aiMessage = Message(
        id: DateTime.now().millisecondsSinceEpoch + 1,
        sessionId: currentSessionId,
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
    // 🌙 TEMA DURUMU VE DİNAMİK RENKLER
    final isDark = ThemeManager.isDarkMode;
    final cardBgColor = isDark ? const Color(0xFF1E1E1E) : Colors.white;
    final primaryTextColor = isDark ? Colors.white : Colors.grey.shade900;
    final secondaryTextColor = isDark
        ? Colors.grey.shade400
        : Colors.grey.shade600;
    final inputFillColor = isDark
        ? const Color(0xFF2C2C2C)
        : Colors.grey.shade100;

    return Scaffold(
      appBar: AppBar(
        title: const Text('HakkımVar AI'),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          tooltip: 'Ana Sayfaya Dön',
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_comment_outlined),
            tooltip: 'Yeni Sohbet',
            onPressed: () => _createNewSession(closeDrawer: false),
          ),
          Builder(
            builder: (context) => IconButton(
              icon: const Icon(Icons.history_rounded),
              tooltip: 'Geçmiş Sohbetler',
              onPressed: () => Scaffold.of(context).openDrawer(),
            ),
          ),
        ],
      ),

      // SOL MENÜ (Geçmiş Sohbetler Drawer)
      drawer: Drawer(
        backgroundColor: isDark ? const Color(0xFF181818) : Colors.white,
        child: Column(
          children: [
            UserAccountsDrawerHeader(
              decoration: BoxDecoration(
                color: isDark
                    ? Colors.blue.shade900.withOpacity(0.8)
                    : Colors.blue.shade900,
              ),
              accountName: const Text('HakkımVar Kullanıcısı'),
              accountEmail: const Text('Kira & Hukuk Danışmanlığı'),
              currentAccountPicture: const CircleAvatar(
                backgroundColor: Colors.white,
                child: Icon(Icons.gavel, color: Colors.blue, size: 32),
              ),
            ),
            ListTile(
              leading: Icon(
                Icons.add_circle_outline,
                color: isDark ? Colors.blue.shade300 : Colors.blue,
              ),
              title: Text(
                'Yeni Analiz / Sohbet',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: primaryTextColor,
                ),
              ),
              onTap: () => _createNewSession(closeDrawer: true),
            ),
            Divider(
              color: isDark ? Colors.grey.shade800 : Colors.grey.shade300,
            ),
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 16.0,
                vertical: 8.0,
              ),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Geçmiş Analizler',
                  style: TextStyle(
                    color: secondaryTextColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            Expanded(
              child: _isLoadingSessions
                  ? Center(
                      child: CircularProgressIndicator(
                        color: isDark
                            ? Colors.blue.shade300
                            : Colors.blue.shade900,
                      ),
                    )
                  : ListView.builder(
                      itemCount: _sessions.length,
                      itemBuilder: (context, index) {
                        final session = _sessions[index];
                        final isSelected = session.id == _activeSessionId;

                        return ListTile(
                          selected: isSelected,
                          selectedTileColor: isDark
                              ? Colors.blue.shade900.withOpacity(0.3)
                              : Colors.blue.shade50,
                          leading: Icon(
                            Icons.chat_bubble_outline,
                            color: isSelected
                                ? (isDark
                                      ? Colors.blue.shade300
                                      : Colors.blue.shade900)
                                : secondaryTextColor,
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
                              color: isSelected
                                  ? (isDark
                                        ? Colors.blue.shade300
                                        : Colors.blue.shade900)
                                  : primaryTextColor,
                            ),
                          ),
                          onTap: () {
                            _fetchMessages(session.id);
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
                            color: isDark
                                ? Colors.blue.shade400.withOpacity(0.5)
                                : Colors.blue.shade200,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'Kira Sözleşmenizle ilgili bir soru sorun',
                            style: TextStyle(
                              color: secondaryTextColor,
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Örn: "Ev sahibi kirayı %50 artırabilir mi?"',
                            style: TextStyle(
                              color: isDark
                                  ? Colors.grey.shade600
                                  : Colors.grey.shade400,
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
                        return _buildMessageBubble(
                          msg,
                          isDark,
                          cardBgColor,
                          primaryTextColor,
                        );
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
                    SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: isDark
                            ? Colors.blue.shade300
                            : Colors.blue.shade800,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      'HakkımVar AI cevabı hazırlıyor...',
                      style: TextStyle(color: secondaryTextColor, fontSize: 13),
                    ),
                  ],
                ),
              ),

            // MESAJ YAZMA ALANI
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: cardBgColor,
                boxShadow: [
                  BoxShadow(
                    color: isDark ? Colors.black38 : Colors.black12,
                    blurRadius: 4,
                    offset: const Offset(0, -2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      style: TextStyle(color: primaryTextColor),
                      decoration: InputDecoration(
                        hintText: 'Hukuki sorunuzu yazın...',
                        hintStyle: TextStyle(color: secondaryTextColor),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide.none,
                        ),
                        fillColor: inputFillColor,
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
                    backgroundColor: isDark
                        ? Colors.blue.shade700
                        : Colors.blue.shade800,
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
  Widget _buildMessageBubble(
    Message msg,
    bool isDark,
    Color cardBgColor,
    Color primaryTextColor,
  ) {
    final isUser = msg.isUser;

    // Kullanıcı mesajı için mavi, AI mesajı için açık/koyu mod arka planı
    final bubbleColor = isUser
        ? (isDark ? Colors.blue.shade900 : Colors.blue.shade800)
        : cardBgColor;

    final textColor = isUser ? Colors.white : primaryTextColor;

    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 6),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.78,
        ),
        decoration: BoxDecoration(
          color: bubbleColor,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft: Radius.circular(isUser ? 16 : 4),
            bottomRight: Radius.circular(isUser ? 4 : 16),
          ),
          boxShadow: [
            if (!isUser)
              BoxShadow(
                color: isDark ? Colors.black26 : Colors.black12,
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
          ],
        ),
        child: Text(
          msg.content,
          style: TextStyle(color: textColor, fontSize: 14, height: 1.4),
        ),
      ),
    );
  }
}
