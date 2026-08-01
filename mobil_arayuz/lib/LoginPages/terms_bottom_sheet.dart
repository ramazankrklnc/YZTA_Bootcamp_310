import 'package:flutter/material.dart';
import 'package:mobil_arayuz/utils/theme_manager.dart'; // Tema yönetimi eklendi

class TermsBottomSheet extends StatelessWidget {
  final VoidCallback onAccept;

  const TermsBottomSheet({super.key, required this.onAccept});

  @override
  Widget build(BuildContext context) {
    // 🌙 TEMA DURUMU VE DİNAMİK RENKLER
    final isDark = ThemeManager.isDarkMode;
    final cardBgColor = isDark ? const Color(0xFF1E1E1E) : Colors.white;
    final primaryTextColor = isDark ? Colors.white : Colors.grey.shade900;
    final secondaryTextColor = isDark
        ? Colors.grey.shade400
        : Colors.grey.shade700;
    final handleColor = isDark ? Colors.grey.shade700 : Colors.grey.shade300;
    final borderColor = isDark ? Colors.grey.shade800 : Colors.grey.shade300;

    return Container(
      height:
          MediaQuery.of(context).size.height * 0.75, // Ekranın %75'ini kaplar
      decoration: BoxDecoration(
        color: cardBgColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Tutma Çubuğu (Drag Handle)
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: handleColor,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Başlık
          Row(
            children: [
              Icon(
                Icons.gavel,
                color: isDark ? Colors.blue.shade300 : Colors.blue.shade900,
              ),
              const SizedBox(width: 10),
              Text(
                'Kullanım Sözleşmesi ve KVKK',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.blue.shade300 : Colors.blue.shade900,
                ),
              ),
            ],
          ),
          Divider(height: 24, color: borderColor),

          // Sözleşme Metni (Kaydırılabilir)
          Expanded(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionTitle('1. Taraflar ve Amaç', primaryTextColor),
                  _buildSectionText(
                    'İşbu Kullanım Sözleşmesi, HakkımVar uygulaması ("Uygulama") ile '
                    'Uygulama\'ya üye olan kullanıcı ("Kullanıcı") arasında, '
                    'Uygulama tarafından sunulan yapay zekâ destekli hukuki analiz '
                    've rehberlik hizmetlerinin kullanım şartlarını belirlemek amacıyla akdedilmiştir.',
                    secondaryTextColor,
                  ),
                  _buildSectionTitle(
                    '2. Hizmet Kapsamı ve Sorumluluk Reddi',
                    primaryTextColor,
                  ),
                  _buildSectionText(
                    'HakkımVar, Türk Borçlar Kanunu ve ilgili mevzuatlar doğrultusunda '
                    'kira sözleşmelerinizi analiz eden yapay zekâ tabanlı bir bilgi platformudur. '
                    'Uygulama tarafından sunulan çıktılar ve öneriler bilgilendirme amaçlı olup '
                    'resmi bir hukuki mütalaa veya avukatlık hizmeti yerine geçmez.',
                    secondaryTextColor,
                  ),
                  _buildSectionTitle(
                    '3. Veri Gizliliği ve Güvenliği (KVKK)',
                    primaryTextColor,
                  ),
                  _buildSectionText(
                    'Yüklediğiniz kira sözleşmeleri ve kişisel verileriniz, yalnızca analiz '
                    'işlemlerinin gerçekleştirilmesi ve size hizmet sunulması amacıyla işlenir. '
                    'Verileriniz üçüncü taraflarla ticari amaçlarla paylaşılmaz ve yüksek güvenlikli '
                    'sunucularda muhafaza edilir.',
                    secondaryTextColor,
                  ),
                  _buildSectionTitle(
                    '4. Kullanıcı Yükümlülükleri',
                    primaryTextColor,
                  ),
                  _buildSectionText(
                    'Kullanıcı, sisteme yüklediği belgelerin içeriğinden ve sisteme sağladığı '
                    'bilgilerin doğruluğundan bizzat sorumludur.',
                    secondaryTextColor,
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Onayla Butonu
          ElevatedButton(
            onPressed: () {
              onAccept(); // Checkbox'ı işaretler
              Navigator.pop(
                context,
              ); // Pencereyi kapatıp alttaki Kayıt ekranına döndürür
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: isDark
                  ? Colors.blue.shade700
                  : Colors.blue.shade800,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Text(
              'Okudum, Anladım ve Onaylıyorum',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title, Color textColor) {
    return Padding(
      padding: const EdgeInsets.only(top: 12.0, bottom: 4.0),
      child: Text(
        title,
        style: TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 14,
          color: textColor,
        ),
      ),
    );
  }

  Widget _buildSectionText(String text, Color textColor) {
    return Text(
      text,
      style: TextStyle(fontSize: 13, color: textColor, height: 1.4),
    );
  }
}
