import { useState, useCallback, useEffect, useRef } from 'react';
import type { PasswordMode, PasswordGeneratorOptions, PassphraseOptions, StrengthAnalysis } from '../lib/crypto/types';
import { generatePassword } from '../lib/crypto/generator';
import { generatePassphrase } from '../lib/crypto/passphrase';
import { evaluatePasswordStrength } from '../lib/crypto/entropy';

export function usePasswordGenerator() {
  const [mode, setModeState] = useState<PasswordMode>('custom');

  // Parola Seçenekleri
  const [length, setLength] = useState<number>(20);
  const [lowercase, setLowercase] = useState<boolean>(true);
  const [uppercase, setUppercase] = useState<boolean>(true);
  const [numbers, setNumbers] = useState<boolean>(true);
  const [symbols, setSymbols] = useState<boolean>(true);
  const [excludeSimilar, setExcludeSimilar] = useState<boolean>(false);
  const [customInclude, setCustomInclude] = useState<string>('');
  const [customExclude, setCustomExclude] = useState<string>('');

  // Parola Cümlesi Seçenekleri
  const [wordCount, setWordCount] = useState<number>(5);
  const [separator, setSeparator] = useState<string>('-');
  const [capitalize, setCapitalize] = useState<'none' | 'capitalize' | 'uppercase'>('capitalize');
  const [includeNumber, setIncludeNumber] = useState<boolean>(true);

  // Görünürlük
  const [isMasked, setIsMasked] = useState<boolean>(false);

  // Üretilen parola ve durum
  const [password, setPassword] = useState<string>('');
  const [strength, setStrength] = useState<StrengthAnalysis>(() => evaluatePasswordStrength(''));
  const [error, setError] = useState<string | null>(null);

  // Parola üretim fonksiyonu
  const generate = useCallback(() => {
    setError(null);
    try {
      if (mode === 'passphrase') {
        const options: PassphraseOptions = {
          wordCount,
          separator,
          capitalize,
          includeNumber,
        };
        const result = generatePassphrase(options);
        setPassword(result.passphrase);
        setStrength(evaluatePasswordStrength(result.passphrase, true));
      } else {
        const isReadableMode = mode === 'readable';
        const isQuickMode = mode === 'quick';

        const options: PasswordGeneratorOptions = {
          length: isQuickMode ? 20 : length,
          lowercase: isQuickMode ? true : lowercase,
          uppercase: isQuickMode ? true : uppercase,
          numbers: isQuickMode ? true : numbers,
          symbols: isQuickMode ? true : (isReadableMode ? false : symbols),
          excludeSimilar: isReadableMode ? true : excludeSimilar,
          customInclude: isQuickMode ? '' : customInclude,
          customExclude: isQuickMode ? '' : customExclude,
        };

        const generated = generatePassword(options);
        setPassword(generated);
        setStrength(evaluatePasswordStrength(generated, false));
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Parola üretilirken beklenmeyen bir hata oluştu.');
      }
    }
  }, [
    mode,
    length,
    lowercase,
    uppercase,
    numbers,
    symbols,
    excludeSimilar,
    customInclude,
    customExclude,
    wordCount,
    separator,
    capitalize,
    includeNumber,
  ]);

  // Mod değişimi yöneticisi
  const setMode = useCallback((newMode: PasswordMode) => {
    setModeState(newMode);
    if (newMode === 'quick') {
      setLength(20);
      setLowercase(true);
      setUppercase(true);
      setNumbers(true);
      setSymbols(true);
      setExcludeSimilar(false);
    } else if (newMode === 'readable') {
      setLength(18);
      setLowercase(true);
      setUppercase(true);
      setNumbers(true);
      setSymbols(false);
      setExcludeSimilar(true);
    }
  }, []);

  // İlk yüklemede otomatik ilk parolayı üret
  const isInitialized = useRef(false);
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      generate();
    }
  }, [generate]);

  const toggleMask = () => setIsMasked((prev) => !prev);

  return {
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
  };
}
