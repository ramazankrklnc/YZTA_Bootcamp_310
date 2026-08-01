import 'package:flutter/material.dart';

class ThemeManager {
  // Tema modunu dinlemek için ValueNotifier
  static final ValueNotifier<ThemeMode> themeModeNotifier = ValueNotifier(
    ThemeMode.light,
  );

  // Mevcut durumun dark olup olmadığını döndürür
  static bool get isDarkMode => themeModeNotifier.value == ThemeMode.dark;

  // Temayı değiştiren fonksiyon
  static void toggleTheme(bool isDark) {
    themeModeNotifier.value = isDark ? ThemeMode.dark : ThemeMode.light;
  }
}
