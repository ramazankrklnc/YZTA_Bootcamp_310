import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Bell,
  Moon,
  HelpCircle,
  ShieldCheck,
  Gavel,
  Info,
  ChevronRight,
  LogOut,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { TokenManager } from '../utils/tokenManager';
import { TermsModal } from '../components/TermsModal';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  // State'ler
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Kullanıcı Verisi State'leri
  const [fullName, setFullName] = useState('Kullanıcı');
  const [email, setEmail] = useState('');

  // Kullanıcı bilgilerini LocalStorage veya JWT Token'dan yükle
  useEffect(() => {
    // 1. Yerel hafızayı kontrol et
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.email) setEmail(parsed.email);
        return;
      } catch (e) {
        console.error('Local storage verisi korrupt:', e);
      }
    }

    // 2. Eğer local storage boşsa JWT token payload'ından oku
    const tokenUser = TokenManager.getUserFromToken();
    if (tokenUser) {
      if (tokenUser.fullName) setFullName(tokenUser.fullName);
      if (tokenUser.email) setEmail(tokenUser.email);
    }
  }, []);

  // Çıkış Onaylama Mantığı
  const handleConfirmLogout = () => {
    TokenManager.clearToken();
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors">
      
      {/* MOBİL UYUMLU HEADER / APPBAR */}
      <header className="sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold">Profilim</h1>
          </div>
        </div>
      </header>

      {/* İÇERİK GÖVDESİ */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* 1. KULLANICI BİLGİ KARTI */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-900 dark:bg-blue-700 text-white flex items-center justify-center shrink-0">
            <User className="w-9 h-9" />
          </div>
          <div className="flex-1 overflow-hidden">
            <h2 className="text-base font-bold truncate">{fullName}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{email || 'E-posta belirtilmedi'}</p>
            <div className="inline-block mt-2.5 px-2.5 py-1 rounded-lg bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700 text-[11px] font-bold">
              Ücretsiz Üyelik
            </div>
          </div>
        </div>

        {/* 2. UYGULAMA AYARLARI KATEGORİSİ */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-gray-900 dark:text-white px-1">Uygulama Ayarları</h3>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 divide-y divide-gray-100 dark:divide-zinc-800 shadow-sm overflow-hidden">
            
            {/* Bildirimler Switch */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-blue-900 dark:text-blue-300" />
                <div>
                  <h4 className="text-xs font-bold">Bildirimler</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Kira artış dönemi ve hukuki hatırlatmalar</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            {/* Karanlık Mod Switch */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-blue-900 dark:text-blue-300" />
                <div>
                  <h4 className="text-xs font-bold">Karanlık Mod</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Gece teması görünümünü aktif et</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={toggleTheme}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* 3. DESTEK VE BİLGİ KATEGORİSİ */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-gray-900 dark:text-white px-1">Destek & Hakkında</h3>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 divide-y divide-gray-100 dark:divide-zinc-800 shadow-sm overflow-hidden">
            
            {/* Sıkça Sorulan Sorular */}
            <button
              onClick={() => navigate('/faq')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-blue-900 dark:text-blue-300" />
                <span className="text-xs font-medium">Sıkça Sorulan Sorular</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {/* Gizlilik Politikası (KVKK) */}
            <button
              onClick={() => setShowTermsModal(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-900 dark:text-blue-300" />
                <span className="text-xs font-medium">Gizlilik Politikası (KVKK)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {/* Kullanım Koşulları */}
            <button
              onClick={() => setShowTermsModal(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Gavel className="w-5 h-5 text-blue-900 dark:text-blue-300" />
                <span className="text-xs font-medium">Kullanım Koşulları</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {/* Uygulama Sürümü */}
            <button
              onClick={() => setShowAboutModal(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-blue-900 dark:text-blue-300" />
                <span className="text-xs font-medium">Uygulama Sürümü</span>
              </div>
              <span className="text-xs text-gray-400">v1.0.0</span>
            </button>

          </div>
        </div>

        {/* 4. HESAPTAN ÇIKIŞ YAP BUTONU */}
        <div className="pt-2">
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="w-full py-3.5 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 font-bold text-sm rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Hesaptan Çıkış Yap
          </button>
        </div>

      </main>

      {/* 5. MODALLAR VE PENCERELER */}

      {/* A. ÇIKIŞ ONAY DIALOGI */}
      <AnimatePresence>
        {showLogoutDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 p-6 rounded-2xl max-w-sm w-full shadow-2xl border border-gray-100 dark:border-zinc-800 space-y-4"
            >
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Çıkış Yap</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Hesabınızdan çıkış yapmak istediğinize emin misiniz?
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowLogoutDialog(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  İptal
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow transition-colors"
                >
                  Çıkış Yap
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* B. SÖZLEŞME VE KVKK MODALI */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => setShowTermsModal(false)}
      />

      {/* C. UYGULAMA HAKKINDA PENCERESİ */}
      <AnimatePresence>
        {showAboutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 p-6 rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 dark:border-zinc-800 space-y-4 relative"
            >
              <button
                onClick={() => setShowAboutModal(false)}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 rounded-full">
                  <Gavel className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">HakkımVar</h3>
                  <p className="text-xs text-gray-400">Sürüm 1.0.0</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pt-2">
                HakkımVar, kiracı ve ev sahipleri arasındaki hukuki uyuşmazlıkları yapay zekâ teknolojisi ile analiz eden ve rehberlik sunan bir mobil platformdur.
              </p>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowAboutModal(false)}
                  className="px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};