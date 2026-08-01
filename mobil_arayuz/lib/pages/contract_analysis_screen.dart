import 'package:flutter/material.dart';
import 'package:mobil_arayuz/models/contract_response.dart';
import 'package:mobil_arayuz/services/contract_service.dart';
import 'package:mobil_arayuz/services/pdf_service.dart';
import 'package:mobil_arayuz/utils/theme_manager.dart'; // Tema yönetimi eklendi
import 'package:mobil_arayuz/utils/token_manager.dart';

class ContractAnalysisScreen extends StatefulWidget {
  final String? initialText;

  const ContractAnalysisScreen({super.key, this.initialText});

  @override
  State<ContractAnalysisScreen> createState() => _ContractAnalysisScreenState();
}

class _ContractAnalysisScreenState extends State<ContractAnalysisScreen> {
  final PdfService _pdfService = PdfService();
  final ContractService _contractService = ContractService();

  String? _extractedText;
  ContractResponse? _analysisResult;
  bool _isLoading = false;
  String _loadingMessage = "";

  @override
  void initState() {
    super.initState();
    if (widget.initialText != null && widget.initialText!.trim().isNotEmpty) {
      _extractedText = widget.initialText;
    }
  }

  Future<void> _pickPdf() async {
    setState(() {
      _isLoading = true;
      _loadingMessage = "PDF dosyası okunuyor...";
      _analysisResult = null;
    });

    try {
      final text = await _pdfService.pickAndReadPdf();

      if (text != null && text.trim().isNotEmpty) {
        setState(() {
          _extractedText = text;
        });
        _showSnackBar("PDF başarıyla okundu.", isError: false);
      } else {
        _showSnackBar("PDF içeriği okunamadı veya dosya boş.");
      }
    } catch (e) {
      _showSnackBar("PDF okuma hatası: ${e.toString()}");
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _analyzeContract() async {
    if (_extractedText == null || _extractedText!.isEmpty) return;

    final token = TokenManager.token;
    if (token == null) {
      _showSnackBar("Oturum süresi dolmuş, lütfen tekrar giriş yapın.");
      return;
    }

    setState(() {
      _isLoading = true;
      _loadingMessage = "Yapay zekâ sözleşmeyi analiz ediyor...";
    });

    try {
      final result = await _contractService.analyzeContract(_extractedText!);

      setState(() {
        _analysisResult = result;
      });

      _showSnackBar("Sözleşme analizi tamamlandı!", isError: false);
    } catch (e) {
      _showSnackBar("Analiz hatası: ${e.toString()}");
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _showSnackBar(String message, {bool isError = true}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? Colors.red.shade600 : Colors.green,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // 🌙 TEMA DURUMU VE RENKLERİ
    final isDark = ThemeManager.isDarkMode;
    final cardBgColor = isDark ? const Color(0xFF1E1E1E) : Colors.white;
    final primaryTextColor = isDark ? Colors.white : Colors.grey.shade900;
    final secondaryTextColor = isDark
        ? Colors.grey.shade400
        : Colors.grey.shade600;
    final borderColor = isDark ? Colors.grey.shade800 : Colors.blue.shade200;

    return Scaffold(
      appBar: AppBar(title: const Text('Sözleşme Analizi'), centerTitle: true),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. PDF YÜKLEME KART ALANI
              InkWell(
                onTap: _isLoading ? null : _pickPdf,
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: cardBgColor,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: _extractedText != null
                          ? Colors.green
                          : borderColor,
                      width: 2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: isDark ? Colors.black38 : Colors.black12,
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Icon(
                        _extractedText != null
                            ? Icons.check_circle_rounded
                            : Icons.picture_as_pdf_rounded,
                        size: 56,
                        color: _extractedText != null
                            ? Colors.green
                            : (isDark
                                  ? Colors.blue.shade300
                                  : Colors.blue.shade700),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        _extractedText != null
                            ? 'PDF / Metin Yüklendi'
                            : 'Kira Sözleşmesi (PDF) Seçin',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: _extractedText != null
                              ? Colors.green.shade400
                              : primaryTextColor,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _extractedText != null
                            ? 'Farklı bir dosya seçmek için tıklayın'
                            : 'Cihazınızdan PDF formatında dosya yükleyin',
                        style: TextStyle(
                          fontSize: 12,
                          color: secondaryTextColor,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // ANALİZ ET BUTONU
              if (_extractedText != null && _analysisResult == null)
                ElevatedButton.icon(
                  onPressed: _isLoading ? null : _analyzeContract,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: isDark
                        ? Colors.blue.shade700
                        : Colors.blue.shade800,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  icon: const Icon(
                    Icons.analytics_outlined,
                    color: Colors.white,
                  ),
                  label: const Text(
                    'Yapay Zekâ İle Analiz Et',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),

              // YÜKLENİYOR İNDİKATÖRÜ
              if (_isLoading) ...[
                const SizedBox(height: 30),
                Center(
                  child: Column(
                    children: [
                      CircularProgressIndicator(
                        color: isDark
                            ? Colors.blue.shade300
                            : Colors.blue.shade800,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        _loadingMessage,
                        style: TextStyle(
                          color: secondaryTextColor,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
              ],

              // 2. ANALİZ SONUÇLARI PANELİ
              if (_analysisResult != null) ...[
                const SizedBox(height: 24),
                _buildRiskScoreCard(_analysisResult!.riskScore, isDark),
                const SizedBox(height: 20),

                // ÖZET KARTI
                _buildSectionCard(
                  title: 'Sözleşme Özeti',
                  icon: Icons.subject_rounded,
                  cardBgColor: cardBgColor,
                  primaryTextColor: primaryTextColor,
                  borderColor: borderColor,
                  child: Text(
                    _analysisResult!.summary,
                    style: TextStyle(
                      fontSize: 14,
                      color: secondaryTextColor,
                      height: 1.4,
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // TESPİT EDİLEN RİSKLER
                _buildSectionCard(
                  title: 'Riskli Maddeler (${_analysisResult!.risks.length})',
                  icon: Icons.warning_amber_rounded,
                  iconColor: Colors.orange.shade700,
                  cardBgColor: cardBgColor,
                  primaryTextColor: primaryTextColor,
                  borderColor: borderColor,
                  child: Column(
                    children: _analysisResult!.risks.map((risk) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 10.0),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(
                              Icons.error_outline,
                              size: 18,
                              color: Colors.red.shade400,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: RichText(
                                text: TextSpan(
                                  text: '${risk.type}: ',
                                  style: TextStyle(
                                    color: Colors.red.shade300,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 13,
                                  ),
                                  children: [
                                    TextSpan(
                                      text: risk.description,
                                      style: TextStyle(
                                        color: secondaryTextColor,
                                        fontWeight: FontWeight.normal,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ),
                const SizedBox(height: 20),

                // ÖNERİLER KARTI
                _buildSectionCard(
                  title: 'Hukuki Tavsiyeler',
                  icon: Icons.lightbulb_outline_rounded,
                  iconColor: Colors.green.shade600,
                  cardBgColor: cardBgColor,
                  primaryTextColor: primaryTextColor,
                  borderColor: borderColor,
                  child: Column(
                    children: _analysisResult!.recommendations.map((rec) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8.0),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(
                              Icons.check_circle_outline,
                              size: 18,
                              color: Colors.green.shade400,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                rec,
                                style: TextStyle(
                                  fontSize: 13,
                                  color: secondaryTextColor,
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  // Risk Skoru Gösterge Kartı
  Widget _buildRiskScoreCard(int score, bool isDark) {
    Color scoreColor = Colors.green;
    String riskLevel = "Düşük Riskli";

    if (score > 40 && score <= 70) {
      scoreColor = Colors.orange;
      riskLevel = "Orta Riskli";
    } else if (score > 70) {
      scoreColor = Colors.red;
      riskLevel = "Yüksek Riskli";
    }

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: scoreColor.withOpacity(isDark ? 0.2 : 0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: scoreColor.withOpacity(0.4)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Genel Risk Derecesi',
                style: TextStyle(
                  color: isDark ? Colors.grey.shade400 : Colors.grey.shade700,
                  fontSize: 13,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                riskLevel,
                style: TextStyle(
                  color: scoreColor,
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                ),
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: scoreColor,
              shape: BoxShape.circle,
            ),
            child: Text(
              '$score/100',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Genel Bölüm Kart Yardımcısı
  Widget _buildSectionCard({
    required String title,
    required IconData icon,
    required Widget child,
    required Color cardBgColor,
    required Color primaryTextColor,
    required Color borderColor,
    Color? iconColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardBgColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                icon,
                color:
                    iconColor ??
                    (ThemeManager.isDarkMode
                        ? Colors.blue.shade300
                        : Colors.blue.shade900),
              ),
              const SizedBox(width: 8),
              Text(
                title,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: primaryTextColor,
                ),
              ),
            ],
          ),
          Divider(height: 20, color: borderColor),
          child,
        ],
      ),
    );
  }
}
