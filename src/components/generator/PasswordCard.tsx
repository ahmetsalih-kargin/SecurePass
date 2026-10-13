import React, { useState } from 'react';
import { Copy, Check, RefreshCw, Eye, EyeOff, ShieldCheck, AlertTriangle, KeyRound } from 'lucide-react';
import type { StrengthAnalysis } from '../../lib/crypto/types';

interface PasswordCardProps {
  password: string;
  isMasked: boolean;
  onToggleMask: () => void;
  onCopy: () => void;
  isCopied: boolean;
  copyError: string | null;
  onGenerate: () => void;
  strength: StrengthAnalysis;
  error: string | null;
}

export const PasswordCard: React.FC<PasswordCardProps> = ({
  password,
  isMasked,
  onToggleMask,
  onCopy,
  isCopied,
  copyError,
  onGenerate,
  strength,
  error,
}) => {
  const [isRotating, setIsRotating] = useState(false);

  const handleRefreshClick = () => {
    setIsRotating(true);
    onGenerate();
    setTimeout(() => setIsRotating(false), 300);
  };

  // Maskelenmiş gösterim
  const displayPassword = isMasked ? '•'.repeat(Math.min(password.length, 32)) : password;

  // Güç rengi haritası
  const getStrengthBarColor = (index: number) => {
    if (strength.score < index + 1) return 'bg-slate-800';
    switch (strength.level) {
      case 'weak':
        return 'bg-rose-500';
      case 'fair':
        return 'bg-amber-500';
      case 'strong':
        return 'bg-emerald-500';
      case 'very-strong':
        return 'bg-cyan-400';
      default:
        return 'bg-slate-800';
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl shadow-slate-950/40 relative overflow-hidden transition-all">
      {/* Hafif arka plan ışıltısı */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Üst Bilgi Başlığı */}
      <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
          <span>Oluşturulan Parola</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700/60 text-slate-300 font-mono text-[11px]">
            {password ? `${password.length} Karakter` : '0 Karakter'}
          </span>
        </div>
      </div>

      {/* Hata Durumu Uyarısı */}
      {error ? (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3 my-2">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-200">Parola Üretilemedi</p>
            <p className="text-xs text-rose-300/90 mt-1">{error}</p>
          </div>
        </div>
      ) : (
        /* Ana Parola Gösterim Kutusu */
        <div className="relative group bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 transition-all hover:border-slate-700/80">
          <div className="min-w-0 flex-1 overflow-x-auto py-1">
            <span
              data-testid="generated-password-display"
              className={`font-mono text-lg sm:text-2xl font-semibold tracking-wider break-all select-all ${
                isMasked ? 'text-slate-400 tracking-widest' : 'text-slate-100'
              }`}
            >
              {displayPassword || 'Parola oluşturuluyor...'}
            </span>
          </div>

          {/* Hızlı Butonlar: Maske, Kopyala, Yenile */}
          <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
            {/* Göster / Gizle */}
            <button
              onClick={onToggleMask}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
              title={isMasked ? 'Parolayı Göster' : 'Parolayı Gizle'}
              aria-label={isMasked ? 'Parolayı Göster' : 'Parolayı Gizle'}
            >
              {isMasked ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>

            {/* Yeni Parola Üret (Yenile) */}
            <button
              onClick={handleRefreshClick}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 active:scale-95"
              title="Yeni Parola Üret (Boşluk tuşu / Tıkla)"
              aria-label="Yeni Parola Üret"
            >
              <RefreshCw
                className={`w-4 h-4 text-cyan-400 transition-transform duration-300 ${
                  isRotating ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Panoya Kopyala */}
            <button
              onClick={onCopy}
              disabled={!password}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400 active:scale-95 ${
                isCopied
                  ? 'bg-emerald-600 text-white shadow-emerald-600/25 ring-1 ring-emerald-400'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/25'
              }`}
              title="Panoya Kopyala (Ctrl+C)"
              aria-label="Parolayı Panoya Kopyala"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Kopyala</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Kopyalama Hatası Bildirimi */}
      {copyError && (
        <div className="mt-2 text-xs text-rose-400 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{copyError}</span>
        </div>
      )}

      {/* Güvenlik & Güç Göstergesi */}
      <div className="mt-5 pt-4 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Parola Gücü:</span>
            <span className={`text-xs font-semibold ${strength.color}`}>
              {strength.label}
            </span>
            <span className="text-[11px] text-slate-400">
              ({strength.entropyBits} bit teorik entropi)
            </span>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Kırılma Süresi Tahmini: </span>
            <span className="font-semibold text-slate-200">
              {strength.crackTimeDisplay}
            </span>
          </div>
        </div>

        {/* 4 Kademeli Güç Çubuğu */}
        <div className="grid grid-cols-4 gap-1.5 h-1.5 rounded-full overflow-hidden">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`h-full rounded-full transition-colors duration-300 ${getStrengthBarColor(
                idx
              )}`}
            />
          ))}
        </div>

        {/* Uyarılar ve Tavsiyeler (varsa) */}
        {strength.warnings.length > 0 && (
          <div className="mt-2 text-[11px] text-amber-300/90 flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 shrink-0 text-amber-400" />
            <span>{strength.warnings.join(' ')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
