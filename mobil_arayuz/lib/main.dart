import 'package:flutter/material.dart';
import 'package:mobil_arayuz/LoginPages/login_screen.dart'; // veya ilk açılan ekranınız hangisiyse
import 'package:mobil_arayuz/utils/theme_manager.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ThemeMode>(
      valueListenable: ThemeManager.themeModeNotifier,
      builder: (context, currentMode, child) {
        return MaterialApp(
          title: 'HakkımVar',
          debugShowCheckedModeBanner: false,
          themeMode: currentMode, // Aktif tema modunu dinler
          // ☀️ AÇIK TEMA AYARLARI
          theme: ThemeData(
            useMaterial3: true,
            brightness: Brightness.light,
            scaffoldBackgroundColor: Colors.grey.shade50,
            primaryColor: Colors.blue.shade900,
            appBarTheme: const AppBarTheme(
              backgroundColor: Colors.white,
              foregroundColor: Colors.blueAccent,
              elevation: 1,
            ),
          ),

          // 🌙 KARANLIK TEMA AYARLARI
          darkTheme: ThemeData(
            useMaterial3: true,
            brightness: Brightness.dark,
            scaffoldBackgroundColor: const Color(0xFF121212),
            primaryColor: Colors.blue.shade400,
            appBarTheme: const AppBarTheme(
              backgroundColor: Color(0xFF1E1E1E),
              foregroundColor: Colors.white,
              elevation: 1,
            ),
            cardColor: const Color(0xFF1E1E1E),
          ),

          home: const LoginScreen(),
        );
      },
    );
  }
}
