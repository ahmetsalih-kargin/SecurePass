import React from 'react';
import { Sliders, Zap, BookOpen, Eye } from 'lucide-react';
import type { PasswordMode } from '../../lib/crypto/types';

interface ModeSelectorProps {
  currentMode: PasswordMode;
  onSelectMode: (mode: PasswordMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onSelectMode }) => {
  const modes: { id: PasswordMode; label: string; icon: React.FC<{ className?: string }>; desc: string }[] = [
    {
      id: 'custom',
      label: 'Özelleştirilmiş',
      icon: Sliders,
      desc: 'Uzunluk, karakterler ve kural kısıtlamaları',
    },
    {
      id: 'quick',
      label: 'Hızlı & Güvenli',
      icon: Zap,
      desc: '20 karakter, dengeli ve maksimum güvenlik',
    },
    {
      id: 'readable',
      label: 'Kolay Okunabilir',
      icon: Eye,
      desc: 'Karışan karakterler (1, l, I, 0, O) hariç',
    },
    {
      id: 'passphrase',
      label: 'Parola Cümlesi',
      icon: BookOpen,
      desc: 'Diceware EFF kelime havuzu ile akılda kalıcı',
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-900/90 border border-slate-800/80 rounded-2xl">
        {modes.map((item) => {
          const Icon = item.icon;
          const isActive = currentMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectMode(item.id)}
              className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-xl transition-all duration-200 text-center select-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                isActive
                  ? 'bg-gradient-to-b from-slate-800 to-slate-850 text-white shadow-md border border-cyan-500/30 ring-1 ring-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
              title={item.desc}
              aria-pressed={isActive}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400'
                  }`}
                />
                <span className="text-xs font-semibold tracking-tight">{item.label}</span>
              </div>
              <span className="text-[10px] text-slate-400 line-clamp-1 hidden md:block">
                {item.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
