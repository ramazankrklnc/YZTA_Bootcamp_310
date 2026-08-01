import 'package:flutter/material.dart';
import 'package:mobil_arayuz/pages/contract_analysis_screen.dart'; // Yükleme ve risk analiz ekranı
import 'package:mobil_arayuz/pages/home_screen.dart'; // Chat ekranı
import 'package:mobil_arayuz/pages/petition_screen.dart'; // İhtarname & Dilekçe ekranı
import 'package:mobil_arayuz/services/pdf_service.dart';

class HomeDashboardScreen extends StatefulWidget {
  const HomeDashboardScreen({super.key});

  @override
  State<HomeDashboardScreen> createState() => _HomeDashboardScreenState();
}

class _HomeDashboardScreenState extends State<HomeDashboardScreen> {
  int _currentIndex = 0;
  final PdfService _pdfService = PdfService();
  bool _isLoadingAssetPdf = false;

  // Proje assets klasöründen PDF'i okuyup Analiz Ekranına Aktaran Fonksiyon
  Future<void> _loadAssetPdfAndNavigate() async {
    setState(() {
      _isLoadingAssetPdf = true;
    });

    try {
      final extractedText = await _pdfService.readPdfFromAssets(
        'assets/ornek_kira_sozlesmesi.pdf',
      );

      if (!mounted) return;

      if (extractedText != null && extractedText.trim().isNotEmpty) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) =>
                ContractAnalysisScreen(initialText: extractedText),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Asset PDF metni okunamadı veya dosya boş!'),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Hata oluştu: ${e.toString()}'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
        ),
      );
    } finally {
      if (mounted) {
        setState(() {
          _isLoadingAssetPdf = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.blue.shade50,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                Icons.gavel_rounded,
                color: Colors.blue.shade900,
                size: 24,
              ),
            ),
            const SizedBox(width: 12),
            Text(
              'HakkımVar',
              style: TextStyle(
                color: Colors.blue.shade900,
                fontWeight: FontWeight.bold,
                fontSize: 20,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(
              Icons.notifications_none_rounded,
              color: Colors.grey.shade800,
            ),
            onPressed: () {},
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. KARŞILAMA BANNER'I & ÖRNEK PDF TEST BUTONU
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.blue.shade900, Colors.blue.shade700],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.blue.shade900.withOpacity(0.3),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Hızlı Test 🚀',
                      style: TextStyle(color: Colors.white70, fontSize: 14),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Örnek Kira Sözleşmesi İle Analizi Başlat',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        height: 1.3,
                      ),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton.icon(
                      onPressed: _isLoadingAssetPdf
                          ? null
                          : _loadAssetPdfAndNavigate,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: Colors.blue.shade900,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 12,
                        ),
                      ),
                      icon: _isLoadingAssetPdf
                          ? SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.blue.shade900,
                              ),
                            )
                          : const Icon(Icons.picture_as_pdf_rounded, size: 18),
                      label: Text(
                        _isLoadingAssetPdf
                            ? 'PDF Okunuyor...'
                            : 'Örnek PDF\'i Aktar ve Analiz Et',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 28),

              // 2. HIZLI ERİŞİM KARTLARI
              Text(
                'Hızlı İşlemler',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey.shade800,
                ),
              ),
              const SizedBox(height: 14),

              // Hızlı İşlemler Grubu 1
              Row(
                children: [
                  Expanded(
                    child: _buildActionCard(
                      context,
                      title: 'Manuel PDF\nYükle',
                      subtitle: 'Cihazdan Seç',
                      icon: Icons.upload_file_rounded,
                      color: Colors.teal,
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                const ContractAnalysisScreen(),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: _buildActionCard(
                      context,
                      title: 'Yapay Zekâ\nDanışmanı',
                      subtitle: 'Soru Sor & Analiz Al',
                      icon: Icons.chat_bubble_outline_rounded,
                      color: Colors.indigo,
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const HomeScreen(),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 14),

              // Hızlı İşlemler Grubu 2 - İHTARNAME & DİLEKÇE KARTI
              Row(
                children: [
                  Expanded(
                    child: _buildActionCard(
                      context,
                      title: 'İhtarname &\nDilekçe',
                      subtitle: 'Taslak Oluştur',
                      icon: Icons.description_outlined,
                      color: Colors.amber,
                      onTap: () {
                        // PetitionScreen Ekranına Yönlendirme
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const PetitionScreen(),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(width: 14),
                  // Gelecekte eklenebilecek ek bir kart için boşluk kalıbı/esneklik
                  const Expanded(child: SizedBox()),
                ],
              ),

              const SizedBox(height: 28),

              // 3. REHBER & TEMEL HAKLAR ALANI
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Önemli Kiracı Hakları',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey.shade800,
                    ),
                  ),
                  TextButton(
                    onPressed: () {},
                    child: Text(
                      'Tümünü Gör',
                      style: TextStyle(color: Colors.blue.shade800),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),

              _buildInfoTile(
                title: 'Yasal Kira Artış Oranı',
                subtitle: 'Kira artışları TÜFE 12 aylık ortalamasını geçemez.',
                icon: Icons.trending_up_rounded,
              ),
              _buildInfoTile(
                title: 'Depozito İadesi Kuralları',
                subtitle:
                    'Depozito en fazla 3 aylık kira bedeli kadar olabilir.',
                icon: Icons.account_balance_wallet_outlined,
              ),
              _buildInfoTile(
                title: 'Tahliye Şartları',
                subtitle: 'Ev sahibi haklı gerekçe olmadan kiracıyı çıkaramaz.',
                icon: Icons.security_outlined,
              ),
            ],
          ),
        ),
      ),

      // ALT GEÇİŞ MENÜSÜ (BOTTOM NAVIGATION)
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        selectedItemColor: Colors.blue.shade900,
        unselectedItemColor: Colors.grey.shade500,
        showUnselectedLabels: true,
        type: BottomNavigationBarType.fixed,
        onTap: (index) {
          setState(() => _currentIndex = index);
          if (index == 1) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const HomeScreen()),
            );
          } else if (index == 2) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const ContractAnalysisScreen(),
              ),
            );
          }
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_filled),
            label: 'Ana Sayfa',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.chat_outlined),
            label: 'HakkımVar AI',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.folder_open_rounded),
            label: 'Analizlerim',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline_rounded),
            label: 'Profil',
          ),
        ],
      ),
    );
  }

  // Yardımcı İşlem Kartı Widget'ı
  Widget _buildActionCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required MaterialColor color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey.shade200),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.shade100,
              blurRadius: 6,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.shade50,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color.shade700, size: 26),
            ),
            const SizedBox(height: 14),
            Text(
              title,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 15,
                height: 1.2,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
            ),
          ],
        ),
      ),
    );
  }

  // Yardımcı Bilgi Liste Elemanı
  Widget _buildInfoTile({
    required String title,
    required String subtitle,
    required IconData icon,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(
        children: [
          Icon(icon, color: Colors.blue.shade800, size: 24),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                ),
              ],
            ),
          ),
          Icon(Icons.chevron_right_rounded, color: Colors.grey.shade400),
        ],
      ),
    );
  }
}
