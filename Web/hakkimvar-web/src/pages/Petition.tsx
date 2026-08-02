 import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Copy,
  Check,
  Sparkles,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Zap,
} from 'lucide-react';
import api from '../services/api';
import type { PetitionResponse } from '../types';

export const Petition: React.FC = () => {
  const navigate = useNavigate();

  // Form State'i
  const [problemText, setProblemText] = useState('');

  // Çıktı State'leri
  const [isGenerating, setIsGenerating] = useState(false);
  const [petitionData, setPetitionData] = useState<PetitionResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Örnek Şikayet Tıklama Mantığı
  const sampleComplaints = [
    'Ev sahibim yasal sınırı aşıp %80 zam yapmak istiyor, kabul etmiyorum.',
    'Evden çıktım ancak ev sahibi depozitomu sebepsiz yere iade etmiyor.',
    'Sözleşme günü bana zorla tahliye taahhüdü imzalattılar, itiraz etmek istiyorum.',
  ];

  // 🟢 GERÇEK BACKEND API DİLEKÇE ÜRETİM MANTIĞI
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemText.trim()) return;

    setIsGenerating(true);
    setPetitionData(null);
    setError(null);

    try {
      // Flutter'daki gibi JSON payload parametresi 'problem' olarak gönderiliyor
      const response = await api.post<PetitionResponse>('/api/Petition/create', {
        problem: problemText,
      });

      // Backend'den gelen yanıt (petition ve missingFields)
      setPetitionData(response.data);
    } catch (err: any) {
      console.error('Dilekçe üretim hatası:', err);
      const serverMessage =
        err.response?.data?.message ||
        err.message ||
        'Dilekçe oluşturulurken sunucuyla bağlantı kurulamadı.';
      setError(serverMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!petitionData?.petition) return;
    navigator.clipboard.writeText(petitionData.petition);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors">
      
      {/* ÜST BAR */}
      <header className="sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold leading-tight">İhtarname & Dilekçe Oluştur</h1>
              <span className="text-[11px] text-gray-400 font-medium">Yapay Zekâ Destekli Resmî Metin Üretici</span>
            </div>
          </div>

          {petitionData && (
            <button
              onClick={() => {
                setPetitionData(null);
                setProblemText('');
                setError(null);
              }}
              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Sıfırla
            </button>
          )}
        </div>
      </header>

      {/* İÇERİK GÖVDESİ */}
      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* SOL TARAF: ŞİKAYET VE GİRDİ FORMU */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
          
          {/* BANNER AÇIKLAMA */}
          <div className="p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 rounded-2xl flex items-center gap-3">
            <FileText className="w-6 h-6 text-teal-700 dark:text-teal-300 shrink-0" />
            <p className="text-xs text-teal-900 dark:text-teal-200 leading-relaxed">
              Yaşadığınız durumu anlatın, Yapay Zekâ hukuki normlara uygun ihtarname veya dilekçe taslağınızı hazırlasın.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1.5 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 fill-current" />
                Uyuşmazlık / Problem Tanımı
              </label>
              <textarea
                rows={6}
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                placeholder="Örn: Ev sahibim sözleşme yenileme döneminde %120 zam talep etti ve kabul etmediğim takdirde evi boşaltmamı istiyor..."
                className="w-full p-4 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-2xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600 leading-relaxed resize-none transition-colors"
                required
              />
            </div>

            {/* ÖRNEK ŞİKAYET CHIP'LERİ */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Veya Hazır Bir Durum Seçin:</span>
              <div className="flex flex-wrap gap-2">
                {sampleComplaints.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setProblemText(sample)}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-700 dark:hover:text-teal-300 border border-gray-200 dark:border-zinc-700 rounded-xl text-[11px] text-gray-600 dark:text-gray-300 transition-colors text-left leading-tight"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* HATA BİLDİRİMİ */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}

            {/* OLUŞTUR BUTONU */}
            <button
              type="submit"
              disabled={isGenerating || !problemText.trim()}
              className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Dilekçe Hazırlanıyor...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Resmî Dilekçe Taslağı Üret
                </>
              )}
            </button>
          </form>
        </section>

        {/* SAĞ TARAF: DİLEKÇE ÖNİZLEMESİ VE EKSİK ALANLAR */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 lg:sticky lg:top-24 min-h-[480px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-600" /> Hazırlanan Dilekçe / İhtarname
              </span>
              {petitionData?.petition && (
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Kopyalandı' : 'Metni Kopyala'}
                </button>
              )}
            </div>

            {/* EKSİK BİLGİLER UYARI KARTI (missingFields) */}
            {petitionData?.missingFields && petitionData.missingFields.length > 0 && (
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Eksik Bilgiler Var</span>
                </div>
                <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                  Resmî makamlara sunmadan önce aşağıdaki alanları dilekçede doldurmayı unutmayın:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {petitionData.missingFields.map((field, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 rounded-lg text-[10px] font-semibold"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3 text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                  <p className="text-xs font-medium">Yapay zekâ sunucusu ihtarnameyi derliyor...</p>
                </div>
              ) : petitionData?.petition ? (
                <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-800 dark:text-gray-200 p-4 bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-800/80 max-h-[500px] overflow-y-auto">
                  {petitionData.petition}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
                  <FileText className="w-10 h-10 text-gray-300 dark:text-zinc-700 mb-2" />
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Henüz bir dilekçe oluşturulmadı.
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1 max-w-xs">
                    Sol taraftaki alanı doldurup "Resmî Dilekçe Taslağı Üret" butonuna basarak çıktıyı inceleyebilirsiniz.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};