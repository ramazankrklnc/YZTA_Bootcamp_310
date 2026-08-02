import 'package:flutter/material.dart';
import 'package:mobil_arayuz/utils/theme_manager.dart';

class RightsDetailBottomSheet extends StatelessWidget {
  final int? initialIndex;

  const RightsDetailBottomSheet({super.key, this.initialIndex});

  static const List<Map<String, dynamic>> _tenantRights = [
    {
      'title': 'Yasal Kira Artış Oranı',
      'law': 'TBK Madde 344',
      'icon': Icons.trending_up_rounded,
      'summary': 'Kira artışları TÜFE 12 aylık ortalamasını geçemez.',
      'detail':
          'Konut ve çatılı işyeri kiralarında yenilenen kira dönemlerinde uygulanacak kira bedeline ilişkin anlaşmalar, bir önceki kira yılında tüketici fiyat endeksindeki (TÜFE) twelve aylık ortalamalara göre değişim oranını geçmemek koşuluyla geçerlidir. Ev sahibi bu oranın üzerinde tek taraflı zam yapamaz.',
    },
    {
      'title': 'Depozito İadesi Kuralları',
      'law': 'TBK Madde 342',
      'icon': Icons.account_balance_wallet_outlined,
      'summary': 'Depozito en fazla 3 aylık kira bedeli kadar olabilir.',
      'detail':
          'Sözleşmeyle kiracıya güvence (depozito) verme borcu getirilmişse, bu güvence 3 aylık kira bedelini aşamaz. Depozito bedeli kiracının rızası olmadan ev sahibi tarafından harcanamaz ve bir vadeli mevduat hesabında ya da depozito hesabında tutulmalıdır. Taşınmaza olağan kullanım dışında zarar verilmediği sürece sözleşme sonunda aynen iade edilir.',
    },
    {
      'title': 'Tahliye Şartları & Güvence',
      'law': 'TBK Madde 347 & 350',
      'icon': Icons.security_outlined,
      'summary': 'Ev sahibi haklı gerekçe olmadan kiracıyı çıkaramaz.',
      'detail':
          'Kira sözleşmesinin süresinin dolması ev sahibine kiracıyı çıkarma hakkı vermez. Ev sahibi ancak haklı bir sebebi (gereksinim/ihtiyaç sebebiyle tahliye, imar ve ihya, 10 yıllık uzama süresinin dolması veya 2 haklı ihtar) varsa mahkeme yoluyla tahliye isteyebilir.',
    },
    {
      'title': 'Demirbaş & Esaslı Onarımlar',
      'law': 'TBK Madde 301 & 305',
      'icon': Icons.build_outlined,
      'summary': 'Evin esaslı tadilat ve bakımları ev sahibine aittir.',
      'detail':
          'Kiralananın kullanımıyla ilgili ayıplardan ve esaslı onarımlardan (kombi arızası, çatı akması, tesisat problemleri vb.) ev sahibi sorumludur. Kiracının kullanımından kaynaklanmayan yıpranma ve arızaların masraflarını kiralayan karşılamak zorundadır.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = ThemeManager.isDarkMode;
    final cardBgColor = isDark ? const Color(0xFF1E1E1E) : Colors.white;
    final primaryTextColor = isDark ? Colors.white : Colors.grey.shade900;
    final secondaryTextColor = isDark
        ? Colors.grey.shade400
        : Colors.grey.shade700;
    final borderColor = isDark ? Colors.grey.shade800 : Colors.grey.shade300;
    final handleColor = isDark ? Colors.grey.shade700 : Colors.grey.shade300;

    return Container(
      height: MediaQuery.of(context).size.height * 0.80,
      decoration: BoxDecoration(
        color: cardBgColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Drag Handle
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
                Icons.gavel_rounded,
                color: isDark ? Colors.blue.shade300 : Colors.blue.shade900,
              ),
              const SizedBox(width: 10),
              Text(
                'Temel Kiracı Hakları Rehberi',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.blue.shade300 : Colors.blue.shade900,
                ),
              ),
            ],
          ),
          Divider(height: 24, color: borderColor),

          // Liste
          Expanded(
            child: ListView.builder(
              physics: const BouncingScrollPhysics(),
              itemCount: _tenantRights.length,
              itemBuilder: (context, index) {
                final right = _tenantRights[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  decoration: BoxDecoration(
                    color: isDark
                        ? const Color(0xFF252525)
                        : Colors.grey.shade50,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: borderColor),
                  ),
                  child: ExpansionTile(
                    initiallyExpanded: initialIndex == index,
                    shape: const Border(),
                    leading: Icon(
                      right['icon'] as IconData,
                      color: isDark
                          ? Colors.blue.shade300
                          : Colors.blue.shade800,
                    ),
                    title: Text(
                      right['title'] as String,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: primaryTextColor,
                      ),
                    ),
                    subtitle: Text(
                      right['law'] as String,
                      style: TextStyle(
                        fontSize: 12,
                        color: isDark
                            ? Colors.blue.shade300
                            : Colors.blue.shade700,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    children: [
                      Padding(
                        padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                        child: Text(
                          right['detail'] as String,
                          style: TextStyle(
                            fontSize: 13,
                            color: secondaryTextColor,
                            height: 1.5,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
