import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gavel,
  FileSearch,
  MessageSquare,
  FileText,
  TrendingUp,
  Wallet,
  ShieldCheck,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { TokenManager } from '../utils/tokenManager';
import { RightsDetailModal } from '../components/RightsDetailModal';

export const HomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [isRightsModalOpen, setIsRightsModalOpen] = useState(false);
  const [selectedRightIndex, setSelectedRightIndex] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>('Kullanıcı');
  const [userInitials, setUserInitials] = useState<string>('HK');

  // Oturum açan kullanıcının bilgilerini yükle
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.fullName) {
          setUserName(parsed.fullName);
          const initials = parsed.fullName
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase();
          setUserInitials(initials.slice(0, 2));
        }
      } catch (e) {
        console.error('Kullanıcı verisi okunamadı:', e);
      }
    }
  }, []);

  const handleLogout = () => {
    TokenManager.clearToken();
    localStorage.removeItem('user');
    navigate('/login');
  };

  const openRightsModal = (index?: number) => {
    setSelectedRightIndex(index ?? 0);
    setIsRightsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      
      {/* 1. TOP NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-400 rounded-xl">
              <Gavel className="w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold text-blue-950 dark:text-blue-400 tracking-tight">
              HakkımVar
            </span>
          </div>

          {/* Sağ Aksiyonlar */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              title="Temayı Değiştir"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="p-1.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2"
              title="Profilim"
            >
              <div className="w-9 h-9 rounded-full bg-blue-800 dark:bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {userInitials}
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 dark:hover:border-red-900 transition-colors"
              title="Çıkış Yap"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. İÇERİK KAPSAYICI */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* HERO BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-8 sm:p-10 shadow-xl"
        >
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Hoş Geldiniz {userName.split(' ')[0]} 👋
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Hukuki Uyuşmazlıklarınızı Ve Kira Süreçlerinizi Yönetin
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
              Yapay zekâ asistanınız ile sözleşmenizi analiz edin veya aklınızdaki hukuki soruları hemen sorun.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
        </motion.div>

        {/* HIZLI İŞLEMLER KARTLARI */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Hızlı İşlemler
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* KART 1: PDF ANALİZİ */}
            <motion.div
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/analysis')}
              className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileSearch className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">
                Kira Sözleşmesi Analizi
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Sözleşme PDF'inizi yükleyin, yapay zekâ ile risk skorunu ve geçersiz maddeleri tespit edin.
              </p>
              <div className="flex items-center gap-1 text-xs font-bold text-teal-700 dark:text-teal-400">
                <span>Analize Başla</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            {/* KART 2: AI DANIŞMAN */}
            <motion.div
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/chat')}
              className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">
                Yapay Zekâ Danışmanı
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                7/24 hukuki uyuşmazlıklarınızı doğal dilde sorun, yasal dayanaklı yanıtlar alın.
              </p>
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-700 dark:text-indigo-400">
                <span>Sohbete Başla</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            {/* KART 3: DİLEKÇE ÜRETİCİ */}
            <motion.div
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/petition')}
              className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">
                İhtarname & Dilekçe
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Şikayetinizi yazın; yapay zekâ resmi ihtarname ve dilekçe taslağını üretsin.
              </p>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400">
                <span>Dilekçe Oluştur</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

          </div>
        </div>

        {/* TEMEL KİRACI HAKLARI REHBERİ */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Önemli Kiracı Hakları
            </h2>
            <button
              onClick={() => openRightsModal(0)}
              className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline"
            >
              Tümünü Gör
            </button>
          </div>

          <div className="space-y-3">
            
            {/* HAK 1 */}
            <div
              onClick={() => openRightsModal(0)}
              className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 flex items-center justify-between gap-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-800 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                    Yasal Kira Artış Oranı
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Kira artışları TÜFE 12 aylık ortalamasını geçemez (TBK m. 344).
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>

            {/* HAK 2 */}
            <div
              onClick={() => openRightsModal(1)}
              className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 flex items-center justify-between gap-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-800 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                    Depozito İadesi Kuralları
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Depozito en fazla 3 aylık kira bedeli kadar olabilir (TBK m. 342).
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>

            {/* HAK 3 */}
            <div
              onClick={() => openRightsModal(2)}
              className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 flex items-center justify-between gap-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-800 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                    Tahliye Şartları
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Ev sahibi haklı gerekçe olmadan kiracıyı çıkaramaz (TBK m. 347).
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>

          </div>
        </div>

      </main>

      {/* HAKLAR MODALI */}
      <RightsDetailModal
        isOpen={isRightsModalOpen}
        onClose={() => setIsRightsModalOpen(false)}
        initialIndex={selectedRightIndex}
      />
    </div>
  );
};