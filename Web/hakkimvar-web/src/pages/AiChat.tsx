import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Plus,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { Message } from '../types';
import api from '../services/api';

export const AiChat: React.FC = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State'ler
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Otomatik Aşağı Kaydırma
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSendingMessage]);

  // Sayfa ilk yüklendiğinde yeni bir oturum başlat
  useEffect(() => {
    handleNewChat();
  }, []);

  // YENİ OTURUM (SOHBET) OLUŞTURMA
  const handleNewChat = async () => {
    setIsSendingMessage(true);
    setError(null);
    setMessages([]);

    try {
      const response = await api.post<any>('/api/Session/create', {});
      const sData = response.data;
      const newSessionId = sData.id || Date.now();
      setActiveSessionId(newSessionId);
      return newSessionId;
    } catch (err: any) {
      console.error('Oturum oluşturulamadı:', err);
      // Yerel geçici ID ile sohbetin devam etmesini sağla
      const fallbackId = Date.now();
      setActiveSessionId(fallbackId);
      return fallbackId;
    } finally {
      setIsSendingMessage(false);
    }
  };

  // MESAJ GÖNDERME VE AI YANITI ALMA
  const handleSendMessage = async (textToSend?: string) => {
    const question = textToSend || inputMessage;
    if (!question.trim() || isSendingMessage) return;

    let currentSessionId = activeSessionId;

    if (!currentSessionId) {
      currentSessionId = await handleNewChat();
      if (!currentSessionId) return;
    }

    // Kullanıcı mesajını arayüze ekle
    const userMsg: Message = {
      id: Date.now(),
      sessionId: currentSessionId,
      isUser: true,
      content: question,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsSendingMessage(true);
    setError(null);

    try {
      const response = await api.post<any>('/api/Chat/ask', {
        sessionId: currentSessionId,
        question: question,
      });

      const answerText =
        response.data?.answer ||
        response.data?.response ||
        (typeof response.data === 'string' ? response.data : 'Cevap alınamadı.');

      const aiMsg: Message = {
        id: Date.now() + 1,
        sessionId: currentSessionId,
        isUser: false,
        content: answerText,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Chat API Hatası:', err);
      const serverMsg = err.response?.data?.message || 'Cevap alınamadı. Lütfen tekrar deneyin.';
      setError(serverMsg);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Ready Prompts
  const promptChips = [
    'Ev sahibi en fazla ne kadar zam yapabilir?',
    'Depozito iadesini alamıyorum, ne yapmalıyım?',
    'Sözleşme bittiğinde ev sahibi beni çıkarabilir mi?',
    'Kombi arıza masrafını kim öder?',
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors overflow-hidden">
      
      {/* APP BAR */}
      <header className="h-16 shrink-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 sm:px-6 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 rounded-xl">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">HakkımVar AI</h1>
              <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Canlı Hukuk Asistanı
              </span>
            </div>
          </div>
        </div>

        {/* YENİ SOHBET TEMİZLEME BUTONU */}
        <button
          onClick={handleNewChat}
          disabled={isSendingMessage}
          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Sohbeti Sıfırla</span>
        </button>
      </header>

      {/* SOHBET ALANI */}
      <div className="flex-1 flex flex-col bg-gray-50/50 dark:bg-zinc-950/50 relative overflow-hidden">
        
        {/* MESAJ LİSTESİ */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl w-full mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-3 text-gray-400">
              <Bot className="w-12 h-12 text-blue-300 dark:text-blue-800" />
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Kira Sözleşmenizle ilgili bir soru sorun
              </h3>
              <p className="text-xs max-w-xs">
                Örn: "Ev sahibi kirayı %50 artırabilir mi?"
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 max-w-2xl ${msg.isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                    msg.isUser
                      ? 'bg-blue-800 dark:bg-blue-700'
                      : 'bg-indigo-600 dark:bg-indigo-500'
                  }`}
                >
                  {msg.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-1 shadow-sm ${
                    msg.isUser
                      ? 'bg-blue-800 text-white rounded-tr-none'
                      : 'bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-zinc-800 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.createdAt && (
                    <span
                      className={`block text-[10px] text-right ${
                        msg.isUser ? 'text-blue-200' : 'text-gray-400'
                      }`}
                    >
                      {msg.createdAt}
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          )}

          {/* YAZIYOR EFEKTİ */}
          {isSendingMessage && (
            <div className="flex gap-3 max-w-2xl">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                <span className="text-xs text-gray-500 font-medium">
                  HakkımVar AI cevabı hazırlıyor...
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl text-xs font-medium">
              ⚠️ {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* HAZIR SORU CHIP'LERİ VE INPUT ALANI */}
        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 space-y-3">
          <div className="max-w-4xl w-full mx-auto space-y-3">
            
            {/* PROMPT CHIPS */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {promptChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  disabled={isSendingMessage}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-700 dark:hover:text-blue-400 border border-gray-200 dark:border-zinc-700 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 text-gray-600 dark:text-gray-300 disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* MESAJ INPUT BAR */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Hukuki sorunuzu yazın..."
                disabled={isSendingMessage}
                className="flex-1 py-3 px-4 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isSendingMessage}
                className="p-3 bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-xl shadow transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>

      </div>

    </div>
  );
};