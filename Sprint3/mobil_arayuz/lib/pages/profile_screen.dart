import 'package:flutter/material.dart';
import 'package:mobil_arayuz/LoginPages/login_screen.dart';
import 'package:mobil_arayuz/LoginPages/terms_bottom_sheet.dart'; // TermsBottomSheet import edildi
import 'package:mobil_arayuz/pages/faq_screen.dart'; // FaqScreen import edildi
import 'package:mobil_arayuz/utils/theme_manager.dart';
import 'package:mobil_arayuz/utils/token_manager.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _notificationsEnabled = true;

  void _logout() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Çıkış Yap'),
        content: const Text(
          'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
        ),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('İptal', style: TextStyle(color: Colors.grey)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red.shade600,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            onPressed: () {
              TokenManager.clearToken();
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (context) => const LoginScreen()),
                (route) => false,
              );
            },
            child: const Text(
              'Çıkış Yap',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // TEMA RENK DEĞİŞKENLERİ
    final isDark = ThemeManager.isDarkMode;
    final cardBgColor = isDark ? const Color(0xFF1E1E1E) : Colors.white;
    final primaryTextColor = isDark ? Colors.white : Colors.grey.shade900;
    final secondaryTextColor = isDark
        ? Colors.grey.shade400
        : Colors.grey.shade600;
    final borderColor = isDark ? Colors.grey.shade800 : Colors.grey.shade200;

    return Scaffold(
      appBar: AppBar(title: const Text('Profilim'), centerTitle: true),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            children: [
              // 1. KULLANICI BİLGİ KARTI
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: cardBgColor,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: borderColor),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 36,
                      backgroundColor: isDark
                          ? Colors.blue.shade700
                          : Colors.blue.shade900,
                      child: const Icon(
                        Icons.person_rounded,
                        size: 40,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'İzzettin Mert Özyağlı',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: primaryTextColor,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'mertozyagli@gmail.com',
                            style: TextStyle(
                              fontSize: 13,
                              color: secondaryTextColor,
                            ),
                          ),
                          const SizedBox(height: 10),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: isDark
                                  ? Colors.green.shade900.withOpacity(0.4)
                                  : Colors.green.shade50,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: isDark
                                    ? Colors.green.shade700
                                    : Colors.green.shade300,
                              ),
                            ),
                            child: Text(
                              'Ücretsiz Üyelik',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: isDark
                                    ? Colors.green.shade300
                                    : Colors.green.shade800,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // 2. UYGULAMA AYARLARI KATEGORİSİ
              _buildSectionTitle('Uygulama Ayarları', primaryTextColor),
              const SizedBox(height: 10),
              Container(
                decoration: BoxDecoration(
                  color: cardBgColor,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: borderColor),
                ),
                child: Column(
                  children: [
                    SwitchListTile(
                      activeColor: Colors.blue.shade600,
                      secondary: Icon(
                        Icons.notifications_outlined,
                        color: isDark
                            ? Colors.blue.shade300
                            : Colors.blue.shade900,
                      ),
                      title: Text(
                        'Bildirimler',
                        style: TextStyle(color: primaryTextColor),
                      ),
                      subtitle: Text(
                        'Kira artış dönemi ve hukuki hatırlatmalar',
                        style: TextStyle(color: secondaryTextColor),
                      ),
                      value: _notificationsEnabled,
                      onChanged: (val) {
                        setState(() => _notificationsEnabled = val);
                      },
                    ),
                    Divider(height: 1, color: borderColor),
                    SwitchListTile(
                      activeColor: Colors.blue.shade600,
                      secondary: Icon(
                        Icons.dark_mode_outlined,
                        color: isDark
                            ? Colors.blue.shade300
                            : Colors.blue.shade900,
                      ),
                      title: Text(
                        'Karanlık Mod',
                        style: TextStyle(color: primaryTextColor),
                      ),
                      subtitle: Text(
                        'Gece teması görünümünü aktif et',
                        style: TextStyle(color: secondaryTextColor),
                      ),
                      value: isDark,
                      onChanged: (val) {
                        setState(() {
                          ThemeManager.toggleTheme(val);
                        });
                      },
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // 3. DESTEK VE BİLGİ KATEGORİSİ
              _buildSectionTitle('Destek & Hakkında', primaryTextColor),
              const SizedBox(height: 10),
              Container(
                decoration: BoxDecoration(
                  color: cardBgColor,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: borderColor),
                ),
                child: Column(
                  children: [
                    // 1. Sıkça Sorulan Sorular Yönlendirmesi
                    _buildProfileMenuItem(
                      icon: Icons.quiz_outlined,
                      title: 'Sıkça Sorulan Sorular',
                      isDark: isDark,
                      primaryTextColor: primaryTextColor,
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const FaqScreen(),
                          ),
                        );
                      },
                    ),
                    Divider(height: 1, color: borderColor),

                    // 2. Gizlilik Politikası / KVKK Modal Açılışı
                    _buildProfileMenuItem(
                      icon: Icons.privacy_tip_outlined,
                      title: 'Gizlilik Politikası (KVKK)',
                      isDark: isDark,
                      primaryTextColor: primaryTextColor,
                      onTap: () {
                        showModalBottomSheet(
                          context: context,
                          isScrollControlled: true,
                          backgroundColor: Colors.transparent,
                          builder: (context) =>
                              TermsBottomSheet(onAccept: () {}),
                        );
                      },
                    ),
                    Divider(height: 1, color: borderColor),

                    // 3. Kullanım Koşulları Modal Açılışı
                    _buildProfileMenuItem(
                      icon: Icons.gavel_outlined,
                      title: 'Kullanım Koşulları',
                      isDark: isDark,
                      primaryTextColor: primaryTextColor,
                      onTap: () {
                        showModalBottomSheet(
                          context: context,
                          isScrollControlled: true,
                          backgroundColor: Colors.transparent,
                          builder: (context) =>
                              TermsBottomSheet(onAccept: () {}),
                        );
                      },
                    ),
                    Divider(height: 1, color: borderColor),

                    // 4. Uygulama Sürümü Hakkında Penceresi
                    _buildProfileMenuItem(
                      icon: Icons.info_outline_rounded,
                      title: 'Uygulama Sürümü',
                      trailingText: 'v1.0.0',
                      isDark: isDark,
                      primaryTextColor: primaryTextColor,
                      onTap: () {
                        showAboutDialog(
                          context: context,
                          applicationName: 'HakkımVar',
                          applicationVersion: '1.0.0',
                          applicationIcon: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: isDark
                                  ? Colors.blue.shade900.withOpacity(0.4)
                                  : Colors.blue.shade50,
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              Icons.gavel_rounded,
                              color: isDark
                                  ? Colors.blue.shade300
                                  : Colors.blue.shade800,
                              size: 32,
                            ),
                          ),
                          children: [
                            const SizedBox(height: 10),
                            Text(
                              'HakkımVar, kiracı ve ev sahipleri arasındaki hukuki uyuşmazlıkları yapay zekâ teknolojisi ile analiz eden ve rehberlik sunan bir mobil platformdur.',
                              style: TextStyle(
                                fontSize: 13,
                                color: secondaryTextColor,
                              ),
                            ),
                          ],
                        );
                      },
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 30),

              // 4. ÇIKIŞ YAP BUTONU
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _logout,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: isDark
                        ? Colors.red.shade900.withOpacity(0.3)
                        : Colors.red.shade50,
                    foregroundColor: isDark
                        ? Colors.red.shade300
                        : Colors.red.shade700,
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(
                        color: isDark
                            ? Colors.red.shade800
                            : Colors.red.shade200,
                      ),
                    ),
                  ),
                  icon: const Icon(Icons.logout_rounded),
                  label: const Text(
                    'Hesaptan Çıkış Yap',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title, Color color) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Text(
        title,
        style: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.bold,
          color: color,
        ),
      ),
    );
  }

  Widget _buildProfileMenuItem({
    required IconData icon,
    required String title,
    required bool isDark,
    required Color primaryTextColor,
    String? trailingText,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(
        icon,
        color: isDark ? Colors.blue.shade300 : Colors.blue.shade900,
      ),
      title: Text(
        title,
        style: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: primaryTextColor,
        ),
      ),
      trailing: trailingText != null
          ? Text(
              trailingText,
              style: TextStyle(color: Colors.grey.shade500, fontSize: 13),
            )
          : Icon(Icons.chevron_right_rounded, color: Colors.grey.shade400),
      onTap: onTap,
    );
  }
}
