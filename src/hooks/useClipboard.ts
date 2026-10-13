import { useState, useCallback } from 'react';

export function useClipboard(timeout = 2500) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const copy = useCallback(
    async (text: string) => {
      if (!text) return false;

      setCopyError(null);

      // Modern Navigator Clipboard API
      if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), timeout);
          return true;
        } catch {
          // İzin reddedildiyse fallback'e geç
        }
      }

      // Güvenli bağlam dışı veya izin kısıtlamaları için Fallback metodu
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '-9999px';
        textArea.style.left = '-9999px';
        textArea.setAttribute('readonly', '');
        document.body.appendChild(textArea);
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), timeout);
          return true;
        } else {
          throw new Error('Kopyalama komutu başarısız oldu.');
        }
      } catch {
        const errMsg = 'Parola panoya kopyalanamadı. Lütfen metni seçip manuel olarak (Ctrl+C) kopyalayın.';
        setCopyError(errMsg);
        return false;
      }
    },
    [timeout]
  );

  return { copied, copyError, copy };
}
