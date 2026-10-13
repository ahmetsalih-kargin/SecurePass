import React from 'react';

interface LengthControlsProps {
  length: number;
  onChangeLength: (length: number) => void;
  min?: number;
  max?: number;
}

export const LengthControls: React.FC<LengthControlsProps> = ({
  length,
  onChangeLength,
  min = 8,
  max = 128,
}) => {
  const quickPresets = [12, 16, 20, 32, 64];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) onChangeLength(val);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) return;
    const clamped = Math.max(min, Math.min(max, val));
    onChangeLength(clamped);
  };

  return (
    <div className="w-full p-5 bg-slate-900/90 border border-slate-800 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <label htmlFor="password-length-slider" className="text-sm font-semibold text-slate-200">
            Parola Uzunluğu
          </label>
          <p className="text-xs text-slate-400">
            Tavsiye edilen minimum uzunluk: 16 karakter
          </p>
        </div>

        {/* Sayısal Giriş Alanı (Senkronize) */}
        <div className="flex items-center gap-2">
          <input
            id="password-length-input"
            type="number"
            min={min}
            max={max}
            value={length}
            onChange={handleInputChange}
            className="w-16 px-2.5 py-1.5 text-center font-mono font-bold text-base bg-slate-950 border border-slate-700 rounded-xl text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Parola uzunluğu sayısı"
          />
        </div>
      </div>

      {/* Kaydırıcı (Slider) */}
      <div className="space-y-2">
        <input
          id="password-length-slider"
          type="range"
          min={min}
          max={max}
          value={length}
          onChange={handleSliderChange}
          className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          aria-label="Parola uzunluğu kaydırıcısı"
        />
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>

      {/* Hızlı Önayar Butonları */}
      <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-800/80">
        <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Hızlı Seçim:</span>
        {quickPresets.map((preset) => (
          <button
            key={preset}
            onClick={() => onChangeLength(preset)}
            className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-colors ${
              length === preset
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
};
