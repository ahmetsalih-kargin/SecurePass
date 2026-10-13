import React from 'react';
import { Check } from 'lucide-react';

interface CharacterOptionsProps {
  lowercase: boolean;
  onChangeLowercase: (val: boolean) => void;
  uppercase: boolean;
  onChangeUppercase: (val: boolean) => void;
  numbers: boolean;
  onChangeNumbers: (val: boolean) => void;
  symbols: boolean;
  onChangeSymbols: (val: boolean) => void;
  excludeSimilar: boolean;
  onChangeExcludeSimilar: (val: boolean) => void;
}

export const CharacterOptions: React.FC<CharacterOptionsProps> = ({
  lowercase,
  onChangeLowercase,
  uppercase,
  onChangeUppercase,
  numbers,
  onChangeNumbers,
  symbols,
  onChangeSymbols,
  excludeSimilar,
  onChangeExcludeSimilar,
}) => {
  const options = [
    {
      id: 'lowercase',
      label: 'Küçük Harfler',
      example: 'a-z (abc...)',
      checked: lowercase,
      onChange: onChangeLowercase,
      desc: 'Standart küçük harf kümesi (26 karakter)',
    },
    {
      id: 'uppercase',
      label: 'Büyük Harfler',
      example: 'A-Z (ABC...)',
      checked: uppercase,
      onChange: onChangeUppercase,
      desc: 'Standart büyük harf kümesi (26 karakter)',
    },
    {
      id: 'numbers',
      label: 'Rakamlar',
      example: '0-9 (012...)',
      checked: numbers,
      onChange: onChangeNumbers,
      desc: 'Sayısal rakam kümesi (10 karakter)',
    },
    {
      id: 'symbols',
      label: 'Özel Karakterler',
      example: '!@#$%^&*...',
      checked: symbols,
      onChange: onChangeSymbols,
      desc: 'Noktalama ve sembol karakterleri',
    },
  ];

  return (
    <div className="w-full p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-200">Karakter Kümeleri</h3>
        <p className="text-xs text-slate-400">
          Her seçili gruptan en az 1 karakter bulunması garanti edilir.
        </p>
      </div>

      {/* 4 Ana Karakter Grubu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {options.map((opt) => (
          <label
            key={opt.id}
            htmlFor={`checkbox-${opt.id}`}
            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${
              opt.checked
                ? 'bg-slate-950/80 border-cyan-500/40 shadow-sm shadow-cyan-500/5'
                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 opacity-60'
            }`}
          >
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                id={`checkbox-${opt.id}`}
                type="checkbox"
                checked={opt.checked}
                onChange={(e) => opt.onChange(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors border ${
                  opt.checked
                    ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                    : 'bg-slate-900 border-slate-700'
                }`}
              >
                {opt.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">{opt.label}</span>
                <span className="text-[11px] font-mono text-cyan-400/90">{opt.example}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{opt.desc}</p>
            </div>
          </label>
        ))}
      </div>

      {/* Ek Seçenek: Benzer Karakterleri Hariç Tut */}
      <div className="pt-2 border-t border-slate-800/80">
        <label
          htmlFor="checkbox-exclude-similar"
          className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
        >
          <div>
            <div className="text-xs font-semibold text-slate-200">
              Benzer Karakterleri Hariç Tut
            </div>
            <p className="text-[11px] text-slate-400">
              Kafa karıştırabilen karakterleri eler (<code className="text-slate-300">1, l, I, 0, O, o, 8, B</code>)
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <input
              id="checkbox-exclude-similar"
              type="checkbox"
              checked={excludeSimilar}
              onChange={(e) => onChangeExcludeSimilar(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors border ${
                excludeSimilar
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                  : 'bg-slate-900 border-slate-700'
              }`}
            >
              {excludeSimilar && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};
