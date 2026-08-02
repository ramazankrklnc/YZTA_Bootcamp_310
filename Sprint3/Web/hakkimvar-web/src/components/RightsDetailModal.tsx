import React, { useState } from 'react';
import { Gavel, X, ChevronDown, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RightsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number | null;
}

export const RightsDetailModal: React.FC<RightsDetailModalProps> = ({
  isOpen,
  onClose,
  initialIndex = null,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(initialIndex ?? 0);

  if (!isOpen) return null;

  const rightsList = [
    {
      title: 'Yasal Kira Artış Oranı',
      law: 'TBK Madde 344',
      summary: 'Kira artışları TÜFE 12 aylık ortalamasını geçemez.',
      detail:
        'Konut ve çatılı işyeri kiralarında yenilenen kira dönemlerinde uygulanacak kira bedeline ilişkin anlaşmalar, bir önceki kira yılında tüketici fiyat endeksindeki (TÜFE) 12 aylık ortalamalara göre değişim oranını geçmemek koşuluyla geçerlidir. Ev sahibi bu oranın üzerinde tek taraflı zam yapamaz.',
    },
    {
      title: 'Depozito İadesi Kuralları',
      law: 'TBK Madde 342',
      summary: 'Depozito en fazla 3 aylık kira bedeli kadar olabilir.',
      detail:
        'Sözleşmeyle kiracıya güvence (depozito) verme borcu getirilmişse, bu güvence 3 aylık kira bedelini aşamaz. Depozito bedeli kiracının rızası olmadan ev sahibi tarafından harcanamaz ve bir vadeli mevduat hesabında veya bankada tutulmalıdır. Taşınmaza olağan kullanım dışında zarar verilmediği sürece sözleşme sonunda aynen iade edilir.',
    },
    {
      title: 'Tahliye Şartları & Güvence',
      law: 'TBK Madde 347 & 350',
      summary: 'Ev sahibi haklı gerekçe olmadan kiracıyı çıkaramaz.',
      detail:
        'Kira sözleşmesinin süresinin dolması ev sahibine kiracıyı çıkarma hakkı vermez. Ev sahibi ancak haklı bir sebebi (gereksinim/ihtiyaç sebebiyle tahliye, imar ve ihya, 10 yıllık uzama süresinin dolması veya 2 haklı ihtar) varsa mahkeme yoluyla tahliye isteyebilir.',
    },
    {
      title: 'Demirbaş & Esaslı Onarımlar',
      law: 'TBK Madde 301 & 305',
      summary: 'Evin esaslı tadilat ve bakımları ev sahibine aittir.',
      detail:
        'Kiralananın kullanımıyla ilgili ayıplardan ve esaslı onarımlardan (kombi arızası, çatı akması, tesisat problemleri vb.) ev sahibi sorumludur. Kiracının kullanımından kaynaklanmayan yıpranma ve arızaların masraflarını kiralayan karşılamak zorundadır.',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-zinc-900 w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 flex flex-col overflow-hidden"
        >
          {/* HEADER */}
          <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-400 rounded-xl">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Temel Kiracı Hakları Rehberi
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* LİSTE */}
          <div className="p-6 overflow-y-auto space-y-4">
            {rightsList.map((right, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-gray-50/50 dark:bg-zinc-950/50"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-gray-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                      {right.title}
                    </h4>
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                      {right.law}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-4 pt-2 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-zinc-800">
                    {right.detail}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-xl transition-colors"
            >
              Anladım
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};