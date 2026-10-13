import React from 'react';
import { Shield, ShieldCheck, Sun, Moon, HelpCircle } from 'lucide-react';
import type { Theme } from '../../hooks/useTheme';

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
  onOpenSecurityModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onOpenSecurityModal,
}) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 transition-colors dark:bg-slate-950/80 dark:border-slate-800/80 light:bg-white/80 light:border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Marka & Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-cyan-400 bg-clip-text text-transparent dark:from-slate-100 dark:via-slate-200 dark:to-cyan-400 light:text-slate-900">
                SecurePass
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                CSPRNG
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Cryptographically Secure Password & Passphrase Engine
            </p>
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex items-center gap-2">
          {/* Güvenlik Hakkında */}
          <button
            onClick={onOpenSecurityModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all dark:text-slate-300 dark:bg-slate-900/80 dark:hover:bg-slate-800 light:text-slate-700 light:bg-slate-100 light:hover:bg-slate-200 light:border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            title="Güvenlik ve Mimari Hakkında Bilgi"
            aria-label="Güvenlik mimarisi hakkında bilgi"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Güvenlik Hakkında</span>
          </button>

          {/* GitHub Linki */}
          <a
            href="https://github.com/ahmetsalih-kargin/SecurePass"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all dark:text-slate-400 dark:bg-slate-900/80 dark:hover:bg-slate-800 light:text-slate-600 light:bg-slate-100 light:hover:bg-slate-200 light:border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            title="GitHub Deposu"
            aria-label="GitHub Deposu"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* Tema Değiştirici */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all dark:text-slate-400 dark:bg-slate-900/80 dark:hover:bg-slate-800 light:text-slate-600 light:bg-slate-100 light:hover:bg-slate-200 light:border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            title={theme === 'dark' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
            aria-label={theme === 'dark' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
