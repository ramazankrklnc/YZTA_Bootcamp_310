import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gavel,
  ShieldCheck,
  FileSearch,
  FileText,
  Bot,
  ArrowRight,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  Zap,
  AlertTriangle,
  Scale,
  MessageSquare,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  
  // SSS Açılır Menü State
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  // Mockup Sekme State (Sözleşme / Chat / Dilekçe)
  const [activeTab, setActiveTab] = useState<'contract' | 'chat' | 'petition'>('contract');

  // Canlı Simülatör State'leri
  const [rentIncrease, setRentIncrease] = useState<number>(65);
  const [depositMonths, setDepositMonths] = useState<number>(4);

  // Risk Skoru Canlı Hesaplama Mantığı
  const calculateSimulatedRisk = () => {
    let score = 20;
    if (rentIncrease > 50) score += (rentIncrease - 50) * 1.5;
    if (depositMonths > 3) score += (depositMonths - 3) * 20;
    return Math.min(Math.round(score), 100);
  };

  const simulatedScore = calculateSimulatedRisk();

  const getScoreBadge = (score: number) => {
    if (score <= 40) return { label: 'Düşük Risk', color: 'bg-green-500 text-white' };
    if (score <= 70) return { label: 'Orta Risk', color: 'bg-amber-500 text-white' };
    return { label: 'Yüksek Riskli Şartlar!', color: 'bg-red-500 text-white' };
  };

  const faqItems = [
    {
      q: 'HakkımVar hukuki bir danışmanlık veya avukatlık hizmeti midir?',
      a: 'Hayır. HakkımVar, Türk Borçlar Kanunu ve ilgili mevzuatlar doğrultusunda eğitilmiş bir yapay zekâ asistanıdır. Sunulan analiz ve çıktılar bilgilendirme amaçlı olup resmi hukuki mütalaa veya avukatlık hizmeti yerine geçmez.',
    },
    {
      q: 'Yapay Zekâ Danışmanı hangi konulara cevap verebilir?',
      a: 'Kira artış oranları, depozito iade süreçleri, ev sahibinin tahliye hakları, kiracının demirbaş giderleri, ecrimisil, ihtarname süreleri ve Türk Borçlar Kanunu kapsamındaki tüm uyuşmazlıklara anında yasal dayanaklı yanıtlar sunar.',
    },
    {
      q: 'Yüklediğim sözleşme ve veriler güvende mi?',
      a: 'Evet. Yüklediğiniz belgeler ve girdiğiniz bilgiler yalnızca analiz işlemi süresince işlenir. Verileriniz KVKK standartlarına uygun şekilde korunur ve asla 3. taraflarla paylaşılmaz.',
    },
    {
      q: 'Üretilen ihtarname ve dilekçeleri resmi makamlara sunabilir miyim?',
      a: 'Evet, üretilen taslaklar standart hukuki kalıplara uygundur. Ancak teslim etmeden önce T.C. Kimlik No, Ad-Soyad, Tarih ve İmza gibi eksik alanları doldurmanız yeterlidir.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden selection:bg-blue-500 selection:text-white">
      
      {/* 🔮 ARKA PLAN IZGARA VE NEON GLOW EFEKTLERİ */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/15 to-purple-500/10 blur-[130px] rounded-full" />
      </div>

      {/* 1. STICKY NAVBAR */}
      <motion.nav 
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-zinc-950/70 border-b border-gray-200/60 dark:border-zinc-800/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2.5 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30">
              <Gavel className="w-5 h-5" />
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-blue-950 to-blue-700 dark:from-white dark:to-blue-400 bg-clip-text text-transparent">
              HakkımVar
            </span>
          </motion.div>

          {/* Menü Linkleri */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600 dark:text-gray-300">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tüm Özellikler</a>
            <a href="#simulator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Risk Simülatörü</a>
            <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Nasıl Çalışır?</a>
            <a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">S.S.S.</a>
          </div>

          {/* Sağ Aksiyonlar */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ rotate: 18, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </motion.button>

            <button
              onClick={() => navigate('/login')}
              className="hidden sm:inline-block px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
            >
              Giriş Yap
            </button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/register')}
              className="px-4 py-2 text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              Ücretsiz Başla <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Rozet */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold mb-8 shadow-sm backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 animate-spin text-blue-500" />
            <span>Kira Hukuku & Anlaşmazlıklarda Yapay Zekâ Gücü</span>
          </motion.div>

          {/* Ana Başlık */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tight max-w-5xl mx-auto leading-[1.15]"
          >
            Kira Süreçlerinizi Ve Haklarınızı{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Hakkım Var AI
            </span>{' '}
            İle Yönetin
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-normal"
          >
            Sözleşme risk analizi yapın, yapay zekâ danışmanına 7/24 hukuki soru sorun, anında resmî ihtarname veya dilekçe taslağı oluşturun.
          </motion.p>

          {/* Aksiyon Butonları */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 20px 30px -10px rgba(37, 99, 235, 0.4)' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl shadow-xl flex items-center justify-center gap-3 group"
            >
              <Zap className="w-5 h-5 fill-current" />
              Platformu Ücretsiz Deneyin
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800 rounded-2xl transition-all"
            >
              Giriş Yap
            </motion.button>
          </motion.div>

          {/* ÇOK YÖNLÜ CANLI INTERACTIVE MOCKUP */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 max-w-5xl mx-auto p-3 bg-gradient-to-b from-gray-200/50 to-gray-400/20 dark:from-zinc-800/50 dark:to-zinc-900/20 rounded-3xl border border-gray-200/80 dark:border-zinc-800 backdrop-blur-md shadow-2xl"
          >
            <div className="bg-white dark:bg-zinc-950 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800/80 text-left shadow-inner">
              
              {/* Sekme Butonları */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs text-gray-400 font-mono ml-2 hidden sm:inline">hakkimvar_app_v1.0</span>
                </div>
                
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-zinc-900 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('contract')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      activeTab === 'contract' ? 'bg-white dark:bg-zinc-800 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500'
                    }`}
                  >
                    <FileSearch className="w-3.5 h-3.5" /> Sözleşme Analizi
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      activeTab === 'chat' ? 'bg-white dark:bg-zinc-800 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500'
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5" /> AI Chat Danışman
                  </button>
                  <button
                    onClick={() => setActiveTab('petition')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      activeTab === 'petition' ? 'bg-white dark:bg-zinc-800 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" /> Dilekçe Üretici
                  </button>
                </div>
              </div>

              {/* SEKME 1: SÖZLEŞME ANALİZİ */}
              {activeTab === 'contract' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                    <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4" /> Haksız Zam Oranı (%75)
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Sözleşmedeki zam oranı yasal TÜFE 12 aylık ortalamasını aştığı için geçersizdir (TBK m.344).
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                      <Zap className="w-4 h-4" /> Sakat Tahliye Taahhüdü
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Kira sözleşmesi ile aynı gün imzalatılan taahhütname Yargıtay kararlarınca haksızdır.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                    <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                      <ShieldCheck className="w-4 h-4" /> Otomatik Çözüm Üretildi
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Ev sahibinize iletmek üzere yasal zam sınırlarına itiraz dilekçeniz anında hazırlandı.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* SEKME 2: AI CHAT DANIŞMAN */}
              {activeTab === 'chat' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 mt-6 text-xs">
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none max-w-md">
                      Ev sahibim sözleşme bittiği için evi 30 gün içinde boşaltmamı istiyor. Böyle bir hakkı var mı?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-3 rounded-2xl rounded-tl-none max-w-lg text-gray-800 dark:text-gray-200">
                      <strong>HakkımVar AI:</strong> Hayır, Türk Borçlar Kanunu Madde 347 uyarınca kira sözleşmesinin süresinin dolması ev sahibine tek taraflı tahliye hakkı vermez. Ev sahibi ancak haklı bir sebebi (gereksinim, imar veya 10 yıllık uzama süresi) varsa mahkeme yoluyla tahliye isteyebilir.
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SEKME 3: DİLEKÇE ÜRETİCİ */}
              {activeTab === 'petition' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 font-mono text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                  <p className="font-bold text-center text-gray-900 dark:text-white mb-2">İHTARNAMEDİR (KİRA ZAM İTİRAZI)</p>
                  <p><strong>KEŞİDECİ (Kiracı):</strong> [Adınız Soyadınız]</p>
                  <p><strong>MUHATAP (Ev Sahibi):</strong> [Ev Sahibinin Adı]</p>
                  <p className="mt-2"><strong>KONU:</strong> Haksız ve yasal sınırı aşan kira zam talebinin reddi ile yasal zam oranına uygun ödeme yapılacağının ihtarından ibarettir...</p>
                </motion.div>
              )}

            </div>
          </motion.div>
        </div>
      </section>

      {/* 🛠️ 3. TÜM ÖZELLİKLER (FEATURES GRID) SECTION */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-zinc-900/40 border-y border-gray-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">Platform Kapasitesi</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mt-2">
              İhtiyacınız Olan Tüm Hukuki Araçlar Tek Bir Yerde
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Kira uyuşmazlıklarınızı çözmek için geliştirilen yapay zekâ tabanlı 4 temel güç.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* ÖZELLİK 1 */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-200/80 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6">
                <FileSearch className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Sözleşme & Risk Analizi
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                PDF veya görsel kira sözleşmenizi yükleyin. Yasal mevzuata aykırı maddeleri, sakat tahliye taahhütlerini ve gizli riskleri 100 üzerinden skorlasın.
              </p>
            </motion.div>

            {/* ÖZELLİK 2 */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-200/80 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Yapay Zekâ Danışmanı
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Kira ilişkisinde yaşadığınız her türlü problemi doğal dilde sorun. Türk Borçlar Kanunu odaklı anında açıklayıcı yasal yanıtlar alın.
              </p>
            </motion.div>

            {/* ÖZELLİK 3 */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-200/80 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Resmî İhtarname & Dilekçe
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Uyuşmazlık konusunu özetleyin; sistem resmi makamlara ve noter ihtarname kalıplarına uygun taslağı sizin için anında üretsin.
              </p>
            </motion.div>

            {/* ÖZELLİK 4 */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-200/80 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Temel Kiracı Hakları Rehberi
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                TBK m. 344 (Zam sınırı), m. 342 (Depozito), m. 347 (Tahliye) gibi kritik maddeleri anlaşılır özetler ve rehber kartları ile inceleyin.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 🎛️ 4. İNTERAKTİF RİSK SİMÜLATÖRÜ SECTION */}
      <section id="simulator" className="py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">Hızlı Test</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mt-2">
              Kira Risk Simülatörünü Deneyin
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Aşağıdaki değerleri kaydırarak kira şartlarınızın tahmini risk derecesini anında görün.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 sm:p-10 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            
            <div className="space-y-6">
              {/* Slider 1 */}
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>Talep Edilen Kira Zam Oranı:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-extrabold">%{rentIncrease}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  value={rentIncrease}
                  onChange={(e) => setRentIncrease(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-[11px] text-gray-400">Yasal Üst Sınır (TÜFE 12 Aylık Ort.) aşılırsa risk yükselir.</span>
              </div>

              {/* Slider 2 */}
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>Talep Edilen Depozito Miktarı:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-extrabold">{depositMonths} Aylık Kira</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={depositMonths}
                  onChange={(e) => setDepositMonths(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-[11px] text-gray-400">TBK m.342 gereğince depozito en fazla 3 ay olabilir.</span>
              </div>
            </div>

            {/* Canlı Skor Ekranı */}
            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-zinc-950/60 border border-gray-100 dark:border-zinc-800 text-center flex flex-col items-center justify-center">
              <span className="text-xs font-semibold text-gray-500">Hesaplanan Tahmini Risk</span>
              
              <div className="text-5xl font-black text-gray-900 dark:text-white my-3">
                {simulatedScore}<span className="text-lg text-gray-400">/100</span>
              </div>

              <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getScoreBadge(simulatedScore).color}`}>
                {getScoreBadge(simulatedScore).label}
              </span>

              <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                Bu simülatör temel parametreleri içerir. Sözleşmenizdeki geçersiz tüm şartları detaylı analiz ettirmek için kaydolun.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 🚀 5. ADIM ADIM NASIL ÇALIŞIR SECTION */}
      <section id="how-it-works" className="py-24 bg-gray-50 dark:bg-zinc-900/40 border-y border-gray-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">Kolay Kullanım</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mt-2">
              Süreç Nasıl İlerliyor?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-200/80 dark:border-zinc-800 relative"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mb-6">1</div>
              <h3 className="text-lg font-bold mb-2">Durumunuzu Belirtin veya Belge Yükleyin</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Kira sözleşmenizi PDF olarak yükleyin veya yaşadığınız anlaşmazlığı sohbet ekranına yazın.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-200/80 dark:border-zinc-800 relative"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mb-6">2</div>
              <h3 className="text-lg font-bold mb-2">Hukuki Yapay Zekâ Analiz Etsin</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Modelimiz verilerinizi Türk Borçlar Kanunu süzgecinden geçirerek haklarınızı ortaya çıkarsın.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-200/80 dark:border-zinc-800 relative"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mb-6">3</div>
              <h3 className="text-lg font-bold mb-2">Çözüm & İhtarname Üretin</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Karşı tarafa veya resmi makamlara sunulmak üzere anında yasal dilekçe taslağı edinin.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🙋‍♂️ 6. S.S.S (FAQ) */}
      <section id="faq" className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              Sıkça Sorulan Sorular
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left font-bold text-gray-900 dark:text-white flex justify-between items-center gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <span>{item.q}</span>
                  <motion.div animate={{ rotate: openFaq === index ? 180 : 0 }}>
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-zinc-800/60 pt-4"
                    >
                      {item.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📣 7. ÇAĞRI (CTA BANNER) */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-black mb-6">
            Kira Haklarınızı Korumaya Hemen Başlayın
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-base sm:text-lg">
            Saniyeler içinde kaydolun; sözleşme analizi, yapay zekâ sohbeti ve dilekçe üretici araçlarını hemen kullanın.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="px-10 py-5 bg-white text-blue-950 font-black rounded-2xl shadow-xl hover:bg-blue-50 transition-all text-base"
          >
            Ücretsiz Hesabınızı Oluşturun
          </motion.button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-zinc-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Gavel className="w-5 h-5 text-blue-500" />
            <span className="text-lg font-black text-white">HakkımVar</span>
          </div>
          <p>© 2026 HakkımVar. Tüm hakları saklıdır. Yapay zekâ tabanlı hukuki rehberlik platformudur.</p>
        </div>
      </footer>

    </div>
  );
};