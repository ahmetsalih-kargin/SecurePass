import React from 'react';
import { BookOpen, Check } from 'lucide-react';
import { BITS_PER_WORD } from '../../lib/crypto/passphrase';

interface PassphraseControlsProps {
  wordCount: number;
  onChangeWordCount: (val: number) => void;
  separator: string;
  onChangeSeparator: (val: string) => void;
  capitalize: 'none' | 'capitalize' | 'uppercase';
  onChangeCapitalize: (val: 'none' | 'capitalize' | 'uppercase') => void;
  includeNumber: boolean;
  onChangeIncludeNumber: (val: boolean) => void;
}

export const PassphraseControls: React.FC<PassphraseControlsProps> = ({
  wordCount,
  onChangeWordCount,
  separator,
  onChangeSeparator,
  capitalize,
  onChangeCapitalize,
  includeNumber,
  onChangeIncludeNumber,
}) => {
  const separators = [
    { label: 'Tire (-)', value: '-' },
    { label: 'Alt Çizgi (_)', value: '_' },
    { label: 'Nokta (.)', value: '.' },
    { label: 'Boşluk ( )', value: ' ' },
    { label: 'Bitişik', value: '' },
  ];

  const capitalizeOptions: { label: string; value: 'capitalize' | 'none' | 'uppercase' }[] = [
    { label: 'Baş Harf Büyük', value: 'capitalize' },
    { label: 'Tümü Küçük', value: 'none' },
    { label: 'TÜMÜ BÜYÜK', value: 'uppercase' },
  ];

  const theoreticalEntropy = Math.round((wordCount * BITS_PER_WORD + (includeNumber ? Math.log2(10) : 0)) * 10) / 10;

  return (
    <div className="w-full p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-5">
      {/* Başlık & Entropi Bilgisi */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200">Parola Cümlesi Ayarları (Diceware)</h3>
        </div>
        <span className="text-xs font-mono font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
          ~{theoreticalEntropy} bit entropi
        </span>
      </div>

      {/* Kelime Sayısı */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="word-count-slider" className="text-xs font-medium text-slate-300">
            Kelime Sayısı
          </label>
          <span className="text-xs font-mono font-bold text-cyan-400">{wordCount} Kelime</span>
        </div>
        <input
          id="word-count-slider"
          type="range"
          min={3}
          max={10}
          value={wordCount}
          onChange={(e) => onChangeWordCount(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          aria-label="Kelime sayısı kaydırıcısı"
        />
        <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
          <span>3 (Hızlı)</span>
          <span>5 (Önerilen)</span>
          <span>10 (Ultra Güvenli)</span>
        </div>
      </div>

      {/* Ayraç Seçimi */}
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-2">Kelime Ayracı</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {separators.map((sep) => (
            <button
              key={sep.label}
              onClick={() => onChangeSeparator(sep.value)}
              className={`py-2 px-2.5 text-xs rounded-xl font-medium transition-all ${
                separator === sep.value
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 ring-1 ring-cyan-500/20'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {sep.label}
            </button>
          ))}
        </div>
      </div>

      {/* Büyük Harf Düzeni & Sayı Ekleme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
        {/* Büyük Harf */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">Harf Düzeni</label>
          <div className="flex flex-col gap-1.5">
            {capitalizeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChangeCapitalize(opt.value)}
                className={`py-1.5 px-3 text-xs text-left rounded-xl transition-all ${
                  capitalize === opt.value
                    ? 'bg-slate-800 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sayı Ekle */}
        <div className="flex flex-col justify-end">
          <label
            htmlFor="checkbox-include-number"
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
          >
            <div>
              <div className="text-xs font-semibold text-slate-200">Rastgele Sayı Ekle</div>
              <p className="text-[11px] text-slate-400">Son kelimeye sayı ekler</p>
            </div>
            <div className="relative flex items-center justify-center">
              <input
                id="checkbox-include-number"
                type="checkbox"
                checked={includeNumber}
                onChange={(e) => onChangeIncludeNumber(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors border ${
                  includeNumber
                    ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                    : 'bg-slate-900 border-slate-700'
                }`}
              >
                {includeNumber && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
