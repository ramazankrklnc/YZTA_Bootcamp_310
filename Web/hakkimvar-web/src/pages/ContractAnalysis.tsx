import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  Info,
  CheckCircle,
  Sparkles,
  X,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ContractResponse, PetitionResponse } from '../types';
import { extractTextFromPdf } from '../services/pdfService';
import api from '../services/api';

export const ContractAnalysis: React.FC = () => {
  const navigate = useNavigate();

  // State'ler
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isReadingPdf, setIsReadingPdf] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ContractResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dilekçe Pop-up (Modal) State'leri
  const [isPetitionModalOpen, setIsPetitionModalOpen] = useState(false);
  const [isGeneratingPetition, setIsGeneratingPetition] = useState(false);
  const [petitionData, setPetitionData] = useState<PetitionResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [petitionError, setPetitionError] = useState<string | null>(null);

  // 1. PDF OKUMA İŞLEMİ
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Lütfen geçerli bir PDF dosyası seçin.');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setIsReadingPdf(true);
    setAnalysisResult(null);

    try {
      const text = await extractTextFromPdf(file);

      if (!text || text.trim().length === 0) {
        throw new Error('PDF içeriği okunamadı veya dosya boş.');
      }

      setExtractedText(text);
    } catch (err: any) {
      console.error('PDF okuma hatası:', err);
      setError(err.message || 'PDF dosyası okunurken bir hata oluştu.');
      setExtractedText(null);
    } finally {
      setIsReadingPdf(false);
    }
  };

  // 2. BACKEND API SÖZLEŞME ANALİZİ
  const handleAnalyzeContract = async () => {
    if (!extractedText) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await api.post<any>('/api/Contract/analyze', {
        contractText: extractedText,
      });

      const rawData = response.data;
      const analysisObj = rawData.analysis || rawData;

      const formattedResponse: ContractResponse = {
        success: rawData.success ?? true,
        riskScore: analysisObj.riskScore ?? analysisObj.risk_score ?? 0,
        summary: analysisObj.summary || '',
        risks: (analysisObj.risks || []).map((r: any) => ({
          type: r.type || r.Type || 'Risk',
          description: r.description || r.Description || '',
        })),
        recommendations: analysisObj.recommendations || [],
      };

      setAnalysisResult(formattedResponse);
    } catch (err: any) {
      console.error('Sözleşme analiz hatası:', err);
      const serverMessage =
        err.response?.data?.message ||
        err.message ||
        'Analiz sırasında sunucuyla bağlantı kurulamadı.';
      setError(serverMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 3. POP-UP İÇİNDE DİLEKÇE ÜRETİMİ (SAYFA DEĞİŞMEDEN)
  const handleGeneratePetitionInModal = async () => {
    if (!analysisResult) return;

    setIsPetitionModalOpen(true);
    setIsGeneratingPetition(true);
    setPetitionData(null);
    setPetitionError(null);

    // Analizde tespit edilen riskleri ve özeti prompt olarak birleştir
    const problemPrompt = `Kira sözleşmemde şu riskli maddeler tespit edildi: ${analysisResult.risks
      .map((r) => `${r.type}: ${r.description}`)
      .join('; ')}. Özet: ${analysisResult.summary}. Bu maddeler için hukuki ihtarname/dilekçe üretilmesini istiyorum.`;

    try {
      const response = await api.post<PetitionResponse>('/api/Petition/create', {
        problem: problemPrompt,
      });

      setPetitionData(response.data);
    } catch (err: any) {
      console.error('Pop-up dilekçe üretme hatası:', err);
      const serverMessage =
        err.response?.data?.message ||
        err.message ||
        'Dilekçe oluşturulurken sunucuyla bağlantı kurulamadı.';
      setPetitionError(serverMessage);
    } finally {
      setIsGeneratingPetition(false);
    }
  };

  const handleCopyPetition = () => {
    if (!petitionData?.petition) return;
    navigator.clipboard.writeText(petitionData.petition);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score <= 40) return 'text-green-500 border-green-500/30 bg-green-500/10';
    if (score <= 70) return 'text-amber-500 border-amber-500/30 bg-amber-500/10';
    return 'text-red-500 border-red-500/30 bg-red-500/10';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors">
      
      {/* APP BAR */}
      <header className="sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <h1 className="text-base font-bold">Sözleşme Analizi</h1>
            </div>
          </div>
        </div>
      </header>

      {/* İÇERİK GÖVDESİ */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* 1. PDF YÜKLEME KARTI */}
        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
          <label
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group ${
              extractedText
                ? 'border-green-500/60 bg-green-500/5'
                : 'border-blue-300 dark:border-zinc-700 hover:border-blue-500'
            }`}
          >
            {isReadingPdf ? (
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-3" />
            ) : extractedText ? (
              <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
            ) : (
              <Upload className="w-12 h-12 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform mb-3" />
            )}

            <span className="text-base font-bold text-gray-800 dark:text-gray-200">
              {isReadingPdf
                ? 'PDF Dokümanı Okunuyor...'
                : extractedText
                ? 'PDF Metni Başarıyla Yüklendi'
                : 'Kira Sözleşmesi (PDF) Seçin'}
            </span>
            <span className="text-xs text-gray-400 mt-1">
              {extractedText
                ? 'Farklı bir dosya seçmek için tıklayın'
                : 'Cihazınızdan PDF formatında dosya yükleyin'}
            </span>

            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={isReadingPdf || isAnalyzing}
            />
          </label>

          {/* ANALİZ ET BUTONU */}
          {extractedText && !analysisResult && (
            <button
              onClick={handleAnalyzeContract}
              disabled={isAnalyzing}
              className="w-full py-4 bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Yapay Zekâ Sözleşmeyi Analiz Ediyor...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Yapay Zekâ İle Analiz Et
                </>
              )}
            </button>
          )}
        </div>

        {/* HATA UYARISI */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-2xl text-xs sm:text-sm font-medium">
            {error}
          </div>
        )}

        {/* YÜKLENİYOR İNDİKATÖRÜ */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-10 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 text-center space-y-3 shadow-sm"
          >
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
            <h3 className="font-bold text-base">Yapay zekâ sözleşmeyi analiz ediyor...</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Türk Borçlar Kanunu emredici hükümleri süzgecinden geçiriliyor.
            </p>
          </motion.div>
        )}

        {/* 2. ANALİZ SONUÇLARI PANELİ */}
        {analysisResult && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* RİSK SKORU KARTI */}
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${getScoreColor(analysisResult.riskScore)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold opacity-80 block mb-1">Genel Risk Derecesi</span>
                  <span className="text-2xl font-black">
                    {analysisResult.riskScore > 70
                      ? 'Yüksek Riskli'
                      : analysisResult.riskScore > 40
                      ? 'Orta Riskli'
                      : 'Düşük Riskli'}
                  </span>
                </div>
                <div className="w-16 h-16 rounded-full bg-current flex items-center justify-center text-white font-extrabold text-lg shadow-md shrink-0">
                  <span className="text-gray-900 dark:text-zinc-900">{analysisResult.riskScore}/100</span>
                </div>
              </div>
            </div>

            {/* SÖZLEŞME ÖZETİ */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" /> Sözleşme Özeti
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed pt-1">
                {analysisResult.summary}
              </p>
            </div>

            {/* TESPİT EDİLEN RİSKLER */}
            {analysisResult.risks && analysisResult.risks.length > 0 && (
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                <h3 className="font-bold text-base flex items-center gap-2 text-amber-600 dark:text-amber-500">
                  <AlertTriangle className="w-5 h-5" /> Riskli Maddeler ({analysisResult.risks.length})
                </h3>
                <div className="space-y-3">
                  {analysisResult.risks.map((risk, idx) => (
                    <div key={idx} className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 rounded-2xl flex items-start gap-3">
                      <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        <strong className="text-red-600 dark:text-red-400 mr-1">{risk.type}:</strong>
                        {risk.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HUKUKİ TAVSİYELER VE DİLEKÇE POP-UP BUTONU */}
            {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                <h3 className="font-bold text-base flex items-center gap-2 text-green-600 dark:text-green-500">
                  <CheckCircle2 className="w-5 h-5" /> Hukuki Tavsiyeler
                </h3>
                <div className="space-y-2.5">
                  {analysisResult.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-end">
                  {/* Sayfa değiştirmeden doğrudan Pop-up açan buton */}
                  <button
                    onClick={handleGeneratePetitionInModal}
                    className="px-4 py-2.5 bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-blue-500/20"
                  >
                    <FileText className="w-4 h-4" />
                    Bu Maddeler İçin Dilekçe Taslağı Üret
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        )}

      </main>

      {/* 3. DİLEKÇE TASLAĞI POP-UP MODALI */}
      <AnimatePresence>
        {isPetitionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-zinc-900 p-6 rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 dark:border-zinc-800 space-y-4 relative max-h-[85vh] flex flex-col justify-between"
            >
              {/* MODAL HEADER */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Üretilen İhtarname / Dilekçe Taslağı
                  </h3>
                </div>
                <button
                  onClick={() => setIsPetitionModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* MODAL İÇERİĞİ */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-4 my-2">
                {isGeneratingPetition ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-3 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="text-xs font-medium">Tespit edilen riskli maddelere göre resmi ihtarname derleniyor...</p>
                  </div>
                ) : petitionError ? (
                  <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-2xl text-xs font-medium">
                    {petitionError}
                  </div>
                ) : petitionData?.petition ? (
                  <>
                    {/* Eksik Alanlar Uyarısı (Var ise) */}
                    {petitionData.missingFields && petitionData.missingFields.length > 0 && (
                      <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl space-y-1.5">
                        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>Tamamlanması Gereken Alanlar</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {petitionData.missingFields.map((field, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 rounded-md text-[10px] font-semibold"
                            >
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metin Alanı */}
                    <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-800 dark:text-gray-200 p-4 bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-800 max-h-[350px] overflow-y-auto">
                      {petitionData.petition}
                    </pre>
                  </>
                ) : null}
              </div>

              {/* MODAL FOOTER */}
              <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                  Noter veya PTT öncesi ad ve imza alanlarını doldurunuz.
                </span>
                <div className="flex items-center gap-2">
                  {petitionData?.petition && (
                    <button
                      onClick={handleCopyPetition}
                      className="px-4 py-2 bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Kopyalandı' : 'Metni Kopyala'}
                    </button>
                  )}
                  <button
                    onClick={() => setIsPetitionModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};