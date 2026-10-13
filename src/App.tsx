import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { SecurityModal } from './components/common/SecurityModal';
import { PasswordCard } from './components/generator/PasswordCard';
import { ModeSelector } from './components/generator/ModeSelector';
import { LengthControls } from './components/generator/LengthControls';
import { CharacterOptions } from './components/generator/CharacterOptions';
import { AdvancedSettings } from './components/generator/AdvancedSettings';
import { PassphraseControls } from './components/generator/PassphraseControls';
import { useTheme } from './hooks/useTheme';
import { useClipboard } from './hooks/useClipboard';
import { usePasswordGenerator } from './hooks/usePasswordGenerator';
import { ShieldCheck, Sparkles, LockKeyhole } from 'lucide-react';

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  const {
    mode,
    setMode,
    length,
    setLength,
    lowercase,
    setLowercase,
    uppercase,
    setUppercase,
    numbers,
    setNumbers,
    symbols,
    setSymbols,
    excludeSimilar,
    setExcludeSimilar,
    customInclude,
    setCustomInclude,
    customExclude,
    setCustomExclude,
    wordCount,
    setWordCount,
    separator,
    setSeparator,
    capitalize,
    setCapitalize,
    includeNumber,
    setIncludeNumber,
    isMasked,
    toggleMask,
    password,
    strength,
    error,
    generate,
  } = usePasswordGenerator();

  const { copied, copyError, copy } = useClipboard();

  // Klavye Kısayolu: Form elemanlarında değilken 'Space' ile yeni parola üretme
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.code === 'Space') {
        e.preventDefault();
        generate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generate]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900 transition-colors selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Üst Gezinme */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
      />

      {/* Ana İçerik */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Karşılama & Başlık */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kriptografik Olarak Doğrulanmış Rastgelelik Motoru</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-slate-400 light:from-slate-950 light:to-slate-700">
            Kırılması İmkânsız Parolalar Üretin
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Tamamen tarayıcınızda çalışan, modulo yanlılığı içermeyen CSPRNG ve Diceware motoruyla maksimum güvenlik.
          </p>
        </div>

        {/* 1. Odak Noktası: Ana Parola Kartı */}
        <section aria-label="Ana Parola Gösterim Kartı">
          <PasswordCard
            password={password}
            isMasked={isMasked}
            onToggleMask={toggleMask}
            onCopy={() => copy(password)}
            isCopied={copied}
            copyError={copyError}
            onGenerate={generate}
            strength={strength}
            error={error}
          />
        </section>

        {/* 2. Mod Seçici Sekmeler */}
        <section aria-label="Parola Üretim Modları">
          <ModeSelector currentMode={mode} onSelectMode={setMode} />
        </section>

        {/* 3. Seçili Moda Göre Kontroller */}
        <section className="space-y-4" aria-label="Yapılandırma Seçenekleri">
          {mode === 'custom' && (
            <>
              <LengthControls
                length={length}
                onChangeLength={(len) => {
                  setLength(len);
                }}
              />
              <CharacterOptions
                lowercase={lowercase}
                onChangeLowercase={setLowercase}
                uppercase={uppercase}
                onChangeUppercase={setUppercase}
                numbers={numbers}
                onChangeNumbers={setNumbers}
                symbols={symbols}
                onChangeSymbols={setSymbols}
                excludeSimilar={excludeSimilar}
                onChangeExcludeSimilar={setExcludeSimilar}
              />
              <AdvancedSettings
                customInclude={customInclude}
                onChangeCustomInclude={setCustomInclude}
                customExclude={customExclude}
                onChangeCustomExclude={setCustomExclude}
              />
            </>
          )}

          {mode === 'quick' && (
            <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Hızlı & Dengeli Profil</h3>
                  <p className="text-xs text-slate-400">
                    20 karakter, tüm harf, rakam ve sembol grupları dengeli dağıtılmış maksimum güvenlik standardı.
                  </p>
                </div>
              </div>
              <button
                onClick={generate}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-xl border border-slate-700 transition-colors shrink-0"
              >
                Yeni Üret
              </button>
            </div>
          )}

          {mode === 'readable' && (
            <div className="space-y-4">
              <LengthControls
                length={length}
                onChangeLength={setLength}
              />
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs text-slate-300 flex items-center gap-2">
                <LockKeyhole className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  Kolay Okunur modda <code className="text-cyan-300">1, l, I, 0, O, o, 8, B</code> gibi karışan karakterler ve özel semboller elenmiştir. Güvenliği korumak için en az 16-18 karakter kullanılması önerilir.
                </span>
              </div>
            </div>
          )}

          {mode === 'passphrase' && (
            <PassphraseControls
              wordCount={wordCount}
              onChangeWordCount={setWordCount}
              separator={separator}
              onChangeSeparator={setSeparator}
              capitalize={capitalize}
              onChangeCapitalize={setCapitalize}
              includeNumber={includeNumber}
              onChangeIncludeNumber={setIncludeNumber}
            />
          )}
        </section>
      </main>

      {/* Alt Bilgi & Lisans */}
      <Footer />

      {/* Güvenlik Bilgilendirme Modalı */}
      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </div>
  );
};

export default App;
