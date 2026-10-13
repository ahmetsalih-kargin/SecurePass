import React, { useEffect } from 'react';
import { X, ShieldAlert, Cpu, Lock, EyeOff, BookOpen, CheckCircle2 } from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose }) => {
  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="security-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-200">
        {/* Kapatma Butonu */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
          aria-label="Pencereyi Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Başlık */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 id="security-modal-title" className="text-xl font-bold text-white tracking-tight">
              Güvenlik Mimarisi & Privacy by Design
            </h2>
            <p className="text-xs text-slate-400">
              SecurePass'in arkasındaki matematiksel ve kriptografik ilkeler
            </p>
          </div>
        </div>

        {/* İçerik Bölümleri */}
        <div className="space-y-6 text-sm leading-relaxed text-slate-300">
          {/* 1. CSPRNG */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <div className="flex items-center gap-2 font-semibold text-white mb-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              1. Kriptografik Rastgelelik (CSPRNG)
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">
              Standart <code className="text-rose-400">Math.random()</code> fonksiyonu sözde rastgeledir (PRNG) ve tahmin edilebilir olduğu için şifreleme veya parola üretiminde <strong>asla kullanılmamalıdır</strong>. SecurePass, işletim sisteminin entropi havuzundan beslenen <code className="text-cyan-300">crypto.getRandomValues()</code> Web Cryptography API standardını kullanır.
            </p>
          </div>

          {/* 2. Modulo Bias ve Rejection Sampling */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <div className="flex items-center gap-2 font-semibold text-white mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              2. Modulo Yanlılığı (Modulo Bias) Önleme
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">
              32-bit rastgele tamsayı uzayı (2<sup>32</sup>) hedef karakter havuzunun büyüklüğüne (N) tam bölünmediğinde doğrudan modül (<code className="text-amber-300">% N</code>) işlemi yapılırsa ilk karakterler matematiksel olarak daha yüksek ihtimalle seçilir. SecurePass, <strong>Rejection Sampling</strong> tekniği uygulayarak bu eşiğin üzerindeki sayıları reddeder ve her karakterin tamamen eşit olasılıkla (1/N) seçilmesini garanti eder.
            </p>
          </div>

          {/* 3. Karakter Garantisi & Shuffle */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <div className="flex items-center gap-2 font-semibold text-white mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              3. Zorunlu Karakter Garantisi & Fisher-Yates Shuffle
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">
              Seçilen tüm karakter gruplarından (küçük, büyük, rakam, sembol) en az 1 karakter bulunması garanti edilir. Ardından, karakterlerin sırası kriptografik olarak güvenli <strong>Fisher-Yates (Knuth) karıştırma algoritması</strong> ile karıştırılarak tahmin edilebilir konum örüntüleri engellenir.
            </p>
          </div>

          {/* 4. Privacy by Design & Sıfır Veri Saklama */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <div className="flex items-center gap-2 font-semibold text-white mb-2">
              <EyeOff className="w-4 h-4 text-indigo-400" />
              4. Gizlilik ve Sıfır Bellek Kalıntısı (Privacy by Design)
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs sm:text-sm">
              <li>Üretilen parolalar hiçbir zaman bir sunucuya veya dış API'ye gönderilmez.</li>
              <li>Parolalar <code className="text-slate-200">localStorage</code> veya <code className="text-slate-200">sessionStorage</code> içinde saklanmaz.</li>
              <li>Konsola (console.log) parola yazdırılmaz, analitik sistemlerine aktarılmaz.</li>
              <li>İşlem tamamen kullanıcının kendi tarayıcısında (client-side) gerçekleşir.</li>
            </ul>
          </div>

          {/* 5. Diceware Passphrase */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <div className="flex items-center gap-2 font-semibold text-white mb-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              5. Diceware & EFF Kelime Havuzu
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">
              Parola Cümlesi modu, Electronic Frontier Foundation (EFF) tarafından hazırlanan 7.776 kelimelik resmi listeyi kullanır. Her kelime tam olarak log<sub>2</sub>(7776) ≈ 12.92 bit saf Diceware entropisi sağlar.
            </p>
          </div>
        </div>

        {/* Modal Alt Kısım */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-colors shadow-lg shadow-cyan-600/20 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
};
