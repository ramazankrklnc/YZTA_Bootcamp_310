import React from 'react';
import { Gavel, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  if (!isOpen) return null;

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
                <Gavel className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Kullanım Sözleşmesi ve KVKK
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* İÇERİK (KAYDIRILABİLİR) */}
          <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <section>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                1. Taraflar ve Amaç
              </h4>
              <p>
                İşbu Kullanım Sözleşmesi, HakkımVar uygulaması ("Uygulama") ile Uygulama'ya üye olan kullanıcı ("Kullanıcı") arasında, Uygulama tarafından sunulan yapay zekâ destekli hukuki analiz ve rehberlik hizmetlerinin kullanım şartlarını belirlemek amacıyla akdedilmiştir.
              </p>
            </section>

            <section>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                2. Hizmet Kapsamı ve Sorumluluk Reddi
              </h4>
              <p>
                HakkımVar, Türk Borçlar Kanunu ve ilgili mevzuatlar doğrultusunda kira sözleşmelerinizi analiz eden yapay zekâ tabanlı bir bilgi platformudur. Uygulama tarafından sunulan çıktılar ve öneriler bilgilendirme amaçlı olup resmi bir hukuki mütalaa veya avukatlık hizmeti yerine geçmez.
              </p>
            </section>

            <section>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                3. Veri Gizliliği ve Güvenliği (KVKK)
              </h4>
              <p>
                Yüklediğiniz kira sözleşmeleri ve kişisel verileriniz, yalnızca analiz işlemlerinin gerçekleştirilmesi ve size hizmet sunulması amacıyla işlenir. Verileriniz üçüncü taraflarla ticari amaçlarla paylaşılmaz ve yüksek güvenlikli sunucularda muhafaza edilir.
              </p>
            </section>

            <section>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                4. Kullanıcı Yükümlülükleri
              </h4>
              <p>
                Kullanıcı, sisteme yüklediği belgelerin içeriğinden ve sisteme sağladığı bilgilerin doğruluğundan bizzat sorumludur.
              </p>
            </section>
          </div>

          {/* FOOTER & ONAYLAMA BUTONU */}
          <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              Kapat
            </button>
            <button
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Okudum, Anladım ve Onaylıyorum
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};