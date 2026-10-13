import { EFF_WORDLIST } from './wordlist';
import { getUnbiasedRandomInt, securePickOne } from './random';
import type { PassphraseOptions } from './types';

export const EFF_WORDLIST_SIZE = 7776;
export const BITS_PER_WORD = Math.log2(EFF_WORDLIST_SIZE); // ~12.9155 bits

export interface PassphraseResult {
  passphrase: string;
  words: string[];
  entropyBits: number;
}

/**
 * Kriptografik olarak güvenli Diceware parola cümlesi (passphrase) üretir.
 * 
 * Güvenlik Özellikleri:
 * - EFF'nin 7776 kelimelik resmi listesini kullanır.
 * - Her kelime Web Cryptography API ve rejection sampling ile tarafsız (unbiased) seçilir.
 * - Matematiksel olarak kesin Diceware entropisi hesaplar.
 */
export function generatePassphrase(options: PassphraseOptions): PassphraseResult {
  const { wordCount, separator, capitalize, includeNumber } = options;

  if (!Number.isInteger(wordCount) || wordCount < 3 || wordCount > 20) {
    throw new RangeError(`Kelime sayısı 3 ile 20 arasında olmalıdır. Alınan: ${wordCount}`);
  }

  const selectedWords: string[] = [];

  for (let i = 0; i < wordCount; i++) {
    const word = securePickOne(EFF_WORDLIST);
    let formattedWord = word;

    if (capitalize === 'capitalize') {
      formattedWord = word.charAt(0).toUpperCase() + word.slice(1);
    } else if (capitalize === 'uppercase') {
      formattedWord = word.toUpperCase();
    }

    selectedWords.push(formattedWord);
  }

  let theoreticalEntropy = wordCount * BITS_PER_WORD;

  // Sayı ekleme opsiyonu
  if (includeNumber) {
    const num = getUnbiasedRandomInt(10); // 0-9
    // Sayıyı cümlenin son kelimesine ekle
    selectedWords[selectedWords.length - 1] += num.toString();
    theoreticalEntropy += Math.log2(10); // + ~3.32 bits
  }

  const passphrase = selectedWords.join(separator);

  return {
    passphrase,
    words: selectedWords,
    entropyBits: Math.round(theoreticalEntropy * 10) / 10,
  };
}
