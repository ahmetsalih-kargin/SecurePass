import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Güvenlik kuralı: Yalnızca UI temasını localStorage'da saklarız, asla parola saklanmaz!
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('securepass_theme') as Theme | null;
      if (stored === 'light' || stored === 'dark') return stored;
      if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }
    return 'dark'; // Varsayılan koyu tema
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('securepass_theme', theme);
    } catch {
      // localStorage kısıtlı ortamlarda sessizce yoksayılır
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, setTheme, toggleTheme };
}
