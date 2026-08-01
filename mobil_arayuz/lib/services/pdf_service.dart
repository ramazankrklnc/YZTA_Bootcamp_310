import 'dart:io';
import 'dart:typed_data';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:syncfusion_flutter_pdf/pdf.dart';

class PdfService {
  // Standart cihazdan dosya seçme
  Future<String?> pickAndReadPdf() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ["pdf"],
      withData: true,
    );

    if (result == null || result.files.isEmpty) return null;

    PlatformFile file = result.files.single;
    PdfDocument document;

    if (file.bytes != null) {
      document = PdfDocument(inputBytes: file.bytes!);
    } else if (file.path != null) {
      Uint8List fileBytes = await File(file.path!).readAsBytes();
      document = PdfDocument(inputBytes: fileBytes);
    } else {
      return null;
    }

    String text = PdfTextExtractor(document).extractText();
    document.dispose();
    return text.isEmpty ? null : text;
  }

  // YENİ: Proje Assets Klasöründeki Hazır PDF'i Okuma
  Future<String?> readPdfFromAssets(String assetPath) async {
    try {
      // Asset içerisindeki dosyayı Byte verisi olarak yükler
      final ByteData data = await rootBundle.load(assetPath);
      final Uint8List bytes = data.buffer.asUint8List();

      // Syncfusion PDF ile metni çıkarır
      PdfDocument document = PdfDocument(inputBytes: bytes);
      String text = PdfTextExtractor(document).extractText();
      document.dispose();

      return text.isEmpty ? null : text;
    } catch (e) {
      print("Asset PDF okuma hatası: $e");
      return null;
    }
  }
}
