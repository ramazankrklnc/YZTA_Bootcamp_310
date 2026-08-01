import 'package:flutter/material.dart';
import 'package:mobil_arayuz/models/contract_response.dart';
import 'package:mobil_arayuz/services/contract_service.dart';
import 'package:mobil_arayuz/services/pdf_service.dart';
import 'package:mobil_arayuz/utils/token_manager.dart';

class ContractAnalysisScreen extends StatefulWidget {
  // Dışarıdan (Dashboard'daki test butonundan vs.) aktarılan metin için parametre
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
    // Eğer dışarıdan hazır metin geldiyse değişkenimize aktarıyoruz
    if (widget.initialText != null && widget.initialText!.trim().isNotEmpty) {
      _extractedText = widget.initialText;
    }
  }

  // 1. PDF Dosyası Seç ve Metni Oku
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

  // 2. Metni C# Backend'ine Gönderip Analiz Et
  Future<void> _analyzeContract() async {
    if (_extractedText == null || _extractedText!.isEmpty) return;

    final token = TokenManager.token;

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
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: const Text('Sözleşme Analizi'),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: Colors.blue.shade900,
        elevation: 1,
      ),
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
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: _extractedText != null
                          ? Colors.green
                          : Colors.blue.shade200,
                      width: 2,
                    ),
                    boxShadow: const [
                      BoxShadow(
                        color: Colors.black12,
                        blurRadius: 4,
                        offset: Offset(0, 2),
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
                            : Colors.blue.shade700,
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
                              ? Colors.green.shade800
                              : Colors.blue.shade900,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _extractedText != null
                            ? 'Farklı bir dosya seçmek için tıklayın'
                            : 'Cihazınızdan PDF formatında dosya yükleyin',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey.shade600,
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
                    backgroundColor: Colors.blue.shade800,
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
                      CircularProgressIndicator(color: Colors.blue.shade800),
                      const SizedBox(height: 16),
                      Text(
                        _loadingMessage,
                        style: TextStyle(
                          color: Colors.grey.shade700,
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
                _buildRiskScoreCard(_analysisResult!.riskScore),
                const SizedBox(height: 20),

                // ÖZET KARTI
                _buildSectionCard(
                  title: 'Sözleşme Özeti',
                  icon: Icons.subject_rounded,
                  child: Text(
                    _analysisResult!.summary,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey.shade800,
                      height: 1.4,
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // TESPİT EDİLEN RİSKLER
                _buildSectionCard(
                  title: 'Riskli Maddeler (${_analysisResult!.risks.length})',
                  icon: Icons.warning_amber_rounded,
                  iconColor: Colors.orange.shade800,
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
                              color: Colors.red.shade700,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: RichText(
                                text: TextSpan(
                                  text: '${risk.type}: ',
                                  style: TextStyle(
                                    color: Colors.red.shade900,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 13,
                                  ),
                                  children: [
                                    TextSpan(
                                      text: risk.description,
                                      style: const TextStyle(
                                        color: Colors.black87,
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
                  iconColor: Colors.green.shade800,
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
                              color: Colors.green.shade700,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                rec,
                                style: const TextStyle(
                                  fontSize: 13,
                                  color: Colors.black87,
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
  Widget _buildRiskScoreCard(int score) {
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
        color: scoreColor.withOpacity(0.1),
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
                style: TextStyle(color: Colors.grey.shade700, fontSize: 13),
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
    Color? iconColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: iconColor ?? Colors.blue.shade900),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const Divider(height: 20),
          child,
        ],
      ),
    );
  }
}
