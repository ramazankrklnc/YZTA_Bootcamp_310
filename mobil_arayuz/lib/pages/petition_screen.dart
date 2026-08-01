import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobil_arayuz/models/petition_response.dart';
import 'package:mobil_arayuz/services/petition_service.dart';

class PetitionScreen extends StatefulWidget {
  const PetitionScreen({super.key});

  @override
  State<PetitionScreen> createState() => _PetitionScreenState();
}

class _PetitionScreenState extends State<PetitionScreen> {
  final PetitionService _petitionService = PetitionService();
  final TextEditingController _problemController = TextEditingController();

  PetitionResponse? _petitionResponse;
  bool _isLoading = false;

  @override
  void dispose() {
    _problemController.dispose();
    super.dispose();
  }

  // 1. Dilekçe / İhtarname Oluşturma Fonksiyonu
  Future<void> _generatePetition() async {
    final problem = _problemController.text.trim();

    if (problem.isEmpty) {
      _showSnackBar(
        'Lütfen yaşadığınız hukuki problemi veya durumu kısaca açıklayın.',
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _petitionResponse = null;
    });

    try {
      final response = await _petitionService.createPetition(problem);

      setState(() {
        _petitionResponse = response;
      });

      _showSnackBar('Dilekçe taslağı başarıyla oluşturuldu!', isError: false);
    } catch (e) {
      _showSnackBar('Dilekçe oluşturulamadı: ${e.toString()}');
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  // Metni Panoya Kopyalama
  void _copyToClipboard(String text) {
    Clipboard.setData(ClipboardData(text: text));
    _showSnackBar('Dilekçe metni panoya kopyalandı.', isError: false);
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
        title: const Text('İhtarname & Dilekçe Oluştur'),
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
              // 1. AÇIKLAMA KARTI
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.teal.shade50,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.teal.shade200),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.description_outlined,
                      color: Colors.teal.shade800,
                      size: 32,
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Text(
                        'Yaşadığınız durumu anlatın, Yapay Zekâ hukuki normlara uygun ihtarname veya dilekçe taslağınızı hazırlasın.',
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.teal.shade900,
                          height: 1.3,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // 2. METİN GİRİŞ ALANI
              Text(
                'Uyuşmazlık / Problem Tanımı',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey.shade800,
                ),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _problemController,
                maxLines: 5,
                decoration: InputDecoration(
                  hintText:
                      'Örn: Ev sahibim sözleşme yenileme döneminde %120 zam talep etti ve kabul etmediğim takdirde evi boşaltmamı istiyor...',
                  fillColor: Colors.white,
                  filled: true,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey.shade300),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(
                      color: Colors.blue.shade800,
                      width: 2,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // DİLEKÇE OLUŞTUR BUTONU
              ElevatedButton.icon(
                onPressed: _isLoading ? null : _generatePetition,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.teal.shade700,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                icon: _isLoading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    : const Icon(
                        Icons.auto_awesome_rounded,
                        color: Colors.white,
                      ),
                label: Text(
                  _isLoading
                      ? 'Dilekçe Hazırlanıyor...'
                      : 'Resmî Dilekçe Taslağı Üret',
                  style: const TextStyle(
                    fontSize: 16,
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),

              // 3. SONUÇ PANELİ
              if (_petitionResponse != null) ...[
                const SizedBox(height: 30),

                // EKSİK BİLGİ UYARISI (Varsa)
                if (_petitionResponse!.missingFields.isNotEmpty) ...[
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.amber.shade50,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.amber.shade400),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons.warning_amber_rounded,
                              color: Colors.amber.shade900,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Eksik Bilgiler Var',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Colors.amber.shade900,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Resmî makamlara sunmadan önce aşağıdaki alanları dilekçede doldurmayı unutmayın:',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.amber.shade900,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 6,
                          runSpacing: 6,
                          children: _petitionResponse!.missingFields.map((
                            field,
                          ) {
                            return Chip(
                              label: Text(
                                field,
                                style: const TextStyle(fontSize: 11),
                              ),
                              backgroundColor: Colors.amber.shade100,
                              side: BorderSide.none,
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                ],

                // DİLEKÇE METNİ KARTI
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.grey.shade300),
                    boxShadow: const [
                      BoxShadow(
                        color: Colors.black12,
                        blurRadius: 4,
                        offset: Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Hazırlanan Dilekçe / İhtarname',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            ),
                          ),
                          IconButton(
                            icon: const Icon(
                              Icons.copy_rounded,
                              color: Colors.blue,
                            ),
                            tooltip: 'Metni Kopyala',
                            onPressed: () =>
                                _copyToClipboard(_petitionResponse!.petition),
                          ),
                        ],
                      ),
                      const Divider(),
                      const SizedBox(height: 8),
                      SelectableText(
                        _petitionResponse!.petition,
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.grey.shade900,
                          height: 1.5,
                          fontFamily: 'monospace',
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
