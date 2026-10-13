import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Settings2 } from 'lucide-react';

interface AdvancedSettingsProps {
  customInclude: string;
  onChangeCustomInclude: (val: string) => void;
  customExclude: string;
  onChangeCustomExclude: (val: string) => void;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  customInclude,
  onChangeCustomInclude,
  customExclude,
  onChangeCustomExclude,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden transition-all">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-850/50 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">İleri Düzey Ayarlar</span>
          <span className="text-[11px] text-slate-400">
            (Özel karakter dahil etme / hariç tutma)
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="p-5 pt-0 space-y-4 border-t border-slate-800/80 mt-2">
          {/* Özel Karakter Dahil Et */}
          <div>
            <label
              htmlFor="custom-include-input"
              className="block text-xs font-medium text-slate-300 mb-1"
            >
              Havuza Kesinlikle Dahil Edilecek Karakterler
            </label>
            <input
              id="custom-include-input"
              type="text"
              value={customInclude}
              onChange={(e) => onChangeCustomInclude(e.target.value)}
              placeholder="Örn: §€µ#"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Bu karakterler aktif havuzla birleştirilir.
            </p>
          </div>

          {/* Özel Karakter Hariç Tut */}
          <div>
            <label
              htmlFor="custom-exclude-input"
              className="block text-xs font-medium text-slate-300 mb-1"
            >
              Havuzdan Kesinlikle Hariç Tutulacak Karakterler
            </label>
            <input
              id="custom-exclude-input"
              type="text"
              value={customExclude}
              onChange={(e) => onChangeCustomExclude(e.target.value)}
              placeholder="Örn: &quot;'/\"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Belirtilen karakterler parola üretiminde kesinlikle kullanılmaz.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
