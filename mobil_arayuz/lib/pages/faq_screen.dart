import 'package:flutter/material.dart';
import 'package:mobil_arayuz/utils/theme_manager.dart';

class FaqScreen extends StatelessWidget {
  const FaqScreen({super.key});

  final List<Map<String, String>> _faqItems = const [
    {
      'question':
          'HakkımVar hukuki bir danışmanlık veya avukatlık hizmeti midir?',
      'answer':
          'Hayır. HakkımVar, Türk Borçlar Kanunu ve ilgili mevzuatlar doğrultusunda eğitilmiş bir yapay zekâ asistanıdır. Sunulan analiz ve çıktılar bilgilendirme amaçlı olup resmi hukuki mütalaa veya avukatlık hizmeti yerine geçmez.',
    },
    {
      'question': 'Yüklediğim kira sözleşmeleri güvende mi?',
      'answer':
          'Evet. Yüklediğiniz belgeler ve metinler yalnızca analiz işlemi süresince işlenir. Kişisel verileriniz KVKK standartlarına uygun şekilde korunur ve asla 3. taraflarla paylaşılmaz.',
    },
    {
      'question': 'Risk skoru nasıl hesaplanıyor?',
      'answer':
          'Geliştirilen yapay zekâ modeli, sözleşmedeki maddeleri yasal mevzuatla (TBK m. 344 vd.) karşılaştırır. Kiracı aleyhine haksız veya geçersiz şartlar (örn. yasal sınırı aşan zam, haksız tahliye şartı) tespit edildikçe risk skoru yükselir.',
    },
    {
      'question':
          'Oluşturulan dilekçe ve ihtarnameleri direkt resmi makamlara sunabilir miyim?',
      'answer':
          'Sistem tarafından üretilen dilekçe taslakları standart hukuki formatlara uygundur. Ancak sunmadan önce isim, T.C. Kimlik No, tarih ve imza gibi eksik alanları tamamlamanız gerekmektedir.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = ThemeManager.isDarkMode;
    final primaryTextColor = isDark ? Colors.white : Colors.grey.shade900;
    final secondaryTextColor = isDark
        ? Colors.grey.shade400
        : Colors.grey.shade700;
    final cardBgColor = isDark ? const Color(0xFF1E1E1E) : Colors.white;
    final borderColor = isDark ? Colors.grey.shade800 : Colors.grey.shade200;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Sıkça Sorulan Sorular'),
        centerTitle: true,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: _faqItems.length,
        itemBuilder: (context, index) {
          final item = _faqItems[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            decoration: BoxDecoration(
              color: cardBgColor,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: borderColor),
            ),
            child: ExpansionTile(
              shape: const Border(),
              iconColor: isDark ? Colors.blue.shade300 : Colors.blue.shade900,
              collapsedIconColor: secondaryTextColor,
              title: Text(
                item['question']!,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: primaryTextColor,
                ),
              ),
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                  child: Text(
                    item['answer']!,
                    style: TextStyle(
                      fontSize: 13,
                      color: secondaryTextColor,
                      height: 1.4,
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
