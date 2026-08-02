import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, Gavel } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { TermsModal } from '../components/TermsModal';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler birbiriyle eşleşmiyor.');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (!acceptedTerms) {
      setError('Lütfen Kullanıcı Sözleşmesini onaylayın.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register(fullName, email, password);
      // Kayıt başarılı olduğunda login sayfasına yönlendir
      navigate('/login', {
        state: { message: 'Kayıt başarılı! Lütfen giriş yapın.' },
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Kayıt oluşturulamadı. Lütfen bilgilerinizi kontrol edin.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4 py-12 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 relative"
      >
        {/* GERİ DÖN BUTONU */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          title="Ana Sayfaya Dön"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* LOGO VE BAŞLIK */}
        <div className="text-center pt-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-400 mb-4">
            <Gavel className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-blue-950 dark:text-blue-400 tracking-tight">
            Yeni Hesap Oluştur
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Hukuki süreçlerinizi kolayca yönetmek için HakkımVar'a katılın.
          </p>
        </div>

        {/* HATA MESAJI BANNER'I */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900">
            {error}
          </div>
        )}

        {/* FORM */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* AD SOYAD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ad Soyad
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                <UserIcon className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="İzzettin Mert Özyağlı"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors text-sm"
                required
              />
            </div>
          </div>

          {/* E-POSTA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              E-posta Adresi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors text-sm"
                required
              />
            </div>
          </div>

          {/* ŞİFRE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Şifre
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* ŞİFRE TEKRAR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Şifre Tekrar
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* SÖZLEŞME ONAY CHECKBOX */}
          <div className="flex items-start pt-2">
            <input
              id="accept-terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
            />
            <label htmlFor="accept-terms" className="ml-2 block text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Kayıt olarak{' '}
              <button
                type="button"
                onClick={() => setIsTermsOpen(true)}
                className="font-bold text-blue-800 dark:text-blue-400 hover:underline"
              >
                Kullanıcı Sözleşmesini
              </button>{' '}
              ve Aydınlatma Metnini okuduğumu ve onayladığımı kabul ediyorum.
            </label>
          </div>

          {/* SUBMIT BUTONU */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Kayıt Ol'
            )}
          </button>
        </form>

        {/* GİRİŞ YAP YÖNLENDİRMESİ */}
        <div className="text-center pt-2 border-t border-gray-100 dark:border-zinc-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Zaten bir hesabınız var mı?{' '}
            <Link to="/login" className="font-bold text-blue-800 dark:text-blue-400 hover:underline">
              Giriş Yap
            </Link>
          </p>
        </div>
      </motion.div>

      {/* SÖZLEŞME MODALI */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        onAccept={() => setAcceptedTerms(true)}
      />
    </div>
  );
};