import { describe, it, expect } from 'vitest';
import {
  getUnbiasedRandomInt,
  securePickOne,
  secureShuffle,
  getCrypto,
  CryptoNotSupportedError,
} from '../lib/crypto/random';
import {
  buildCharacterPool,
  SIMILAR_CHARACTERS,
} from '../lib/crypto/charset';
import {
  generatePassword,
  PasswordLengthTooShortError,
} from '../lib/crypto/generator';
import {
  generatePassphrase,
  BITS_PER_WORD,
  EFF_WORDLIST_SIZE,
} from '../lib/crypto/passphrase';
import { EFF_WORDLIST } from '../lib/crypto/wordlist';
import {
  calculateShannonEntropy,
  estimateCrackTime,
  evaluatePasswordStrength,
} from '../lib/crypto/entropy';

describe('CSPRNG & Unbiased Random Engine (random.ts)', () => {
  it('getCrypto() Web Crypto API nesnesini döndürmelidir', () => {
    const crypto = getCrypto();
    expect(crypto).toBeDefined();
    expect(typeof crypto.getRandomValues).toBe('function');
  });

  it('crypto API mevcut değilse CryptoNotSupportedError fırlatmalıdır', () => {
    const originalCrypto = globalThis.crypto;
    try {
      // @ts-expect-error simulate missing crypto
      delete globalThis.crypto;
      expect(() => getCrypto()).toThrow(CryptoNotSupportedError);
    } finally {
      globalThis.crypto = originalCrypto;
    }
  });

  it('getUnbiasedRandomInt(max) geçerli aralıkta [0, max-1] değerler üretmelidir', () => {
    const max = 10;
    for (let i = 0; i < 50; i++) {
      const val = getUnbiasedRandomInt(max);
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(max);
      expect(Number.isInteger(val)).toBe(true);
    }
  });

  it('getUnbiasedRandomInt(1) daima 0 döndürmelidir', () => {
    expect(getUnbiasedRandomInt(1)).toBe(0);
  });

  it('getUnbiasedRandomInt geçersiz max değerlerinde RangeError fırlatmalıdır', () => {
    expect(() => getUnbiasedRandomInt(0)).toThrow(RangeError);
    expect(() => getUnbiasedRandomInt(-5)).toThrow(RangeError);
    expect(() => getUnbiasedRandomInt(1.5)).toThrow(RangeError);
  });

  it('securePickOne bir diziden veya metinden geçerli bir eleman seçmelidir', () => {
    const items = ['a', 'b', 'c', 'd'];
    for (let i = 0; i < 20; i++) {
      const picked = securePickOne(items);
      expect(items).toContain(picked);
    }
  });

  it('securePickOne boş koleksiyonda hata fırlatmalıdır', () => {
    expect(() => securePickOne([])).toThrow(RangeError);
    expect(() => securePickOne('')).toThrow(RangeError);
  });

  it('secureShuffle orijinal diziyi değiştirmemeli ve aynı elemanları korumalıdır', () => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const originalCopy = [...original];
    const shuffled = secureShuffle(original);

    // Orijinal dizi mutasyona uğramamış olmalı
    expect(original).toEqual(originalCopy);
    // Boyut aynı olmalı
    expect(shuffled.length).toBe(original.length);
    // Tüm elemanlar korunmuş olmalı
    expect([...shuffled].sort((a, b) => a - b)).toEqual(original);
  });
});

describe('Character Pool & Filtering Engine (charset.ts)', () => {
  it('tüm gruplar seçildiğinde eksiksiz havuz oluşturmalıdır', () => {
    const res = buildCharacterPool({
      lowercase: true,
      uppercase: true,
      numbers: true,
      symbols: true,
    });
    expect(res.valid).toBe(true);
    expect(res.activeGroups.length).toBe(4);
    expect(res.pool).toContain('a');
    expect(res.pool).toContain('A');
    expect(res.pool).toContain('1');
    expect(res.pool).toContain('!');
  });

  it('hiçbir grup seçilmediğinde valid=false ve net hata mesajı döndürmelidir', () => {
    const res = buildCharacterPool({
      lowercase: false,
      uppercase: false,
      numbers: false,
      symbols: false,
    });
    expect(res.valid).toBe(false);
    expect(res.errorMessage).toBeDefined();
    expect(res.pool).toBe('');
  });

  it('benzer karakterleri hariç tutma (excludeSimilar) doğru çalışmalıdır', () => {
    const res = buildCharacterPool({
      lowercase: true,
      uppercase: true,
      numbers: true,
      symbols: false,
      excludeSimilar: true,
    });
    expect(res.valid).toBe(true);
    for (const char of SIMILAR_CHARACTERS) {
      expect(res.pool).not.toContain(char);
    }
  });

  it('customExclude ile belirtilen karakterleri havuzdan çıkarmalıdır', () => {
    const res = buildCharacterPool({
      lowercase: true,
      uppercase: false,
      numbers: false,
      symbols: false,
      customExclude: 'abc',
    });
    expect(res.valid).toBe(true);
    expect(res.pool).not.toContain('a');
    expect(res.pool).not.toContain('b');
    expect(res.pool).not.toContain('c');
  });

  it('özel hariç tutma seçili bir grubun tüm karakterlerini silerse hata döndürmelidir', () => {
    const res = buildCharacterPool({
      lowercase: false,
      uppercase: false,
      numbers: true,
      symbols: false,
      customExclude: '0123456789', // Tüm rakamlar hariç tutuldu
    });
    expect(res.valid).toBe(false);
    expect(res.errorMessage).toContain('numbers');
  });
});

describe('Password Generator Engine (generator.ts)', () => {
  it('varsayılan ayarlarla (20 karakter, tüm gruplar) parola üretmelidir', () => {
    const password = generatePassword({
      length: 20,
      lowercase: true,
      uppercase: true,
      numbers: true,
      symbols: true,
      excludeSimilar: false,
    });
    expect(password.length).toBe(20);
  });

  it('seçilen her gruptan en az bir karakter bulunmasını garanti etmelidir (100 deneme)', () => {
    for (let i = 0; i < 100; i++) {
      const pwd = generatePassword({
        length: 8,
        lowercase: true,
        uppercase: true,
        numbers: true,
        symbols: true,
        excludeSimilar: false,
      });

      const hasLower = /[a-z]/.test(pwd);
      const hasUpper = /[A-Z]/.test(pwd);
      const hasNumber = /[0-9]/.test(pwd);
      const hasSymbol = /[!@#$%^&*()_+\-=[\]{}|;:,.<>?~]/.test(pwd);

      expect(hasLower).toBe(true);
      expect(hasUpper).toBe(true);
      expect(hasNumber).toBe(true);
      expect(hasSymbol).toBe(true);
    }
  });

  it('parola uzunluğu zorunlu grup sayısından küçükse PasswordLengthTooShortError fırlatmalıdır', () => {
    expect(() =>
      generatePassword({
        length: 3, // 4 grup seçili ama uzunluk 3
        lowercase: true,
        uppercase: true,
        numbers: true,
        symbols: true,
        excludeSimilar: false,
      })
    ).toThrow(PasswordLengthTooShortError);
  });

  it('minimum geçerli uzunluk (length = 4, 4 grup seçili) başarıyla üretilmelidir', () => {
    const pwd = generatePassword({
      length: 4,
      lowercase: true,
      uppercase: true,
      numbers: true,
      symbols: true,
      excludeSimilar: false,
    });
    expect(pwd.length).toBe(4);
  });

  it('maksimum uzunluk (örneğin 128 karakter) sorunsuz üretilmelidir', () => {
    const pwd = generatePassword({
      length: 128,
      lowercase: true,
      uppercase: true,
      numbers: true,
      symbols: true,
      excludeSimilar: false,
    });
    expect(pwd.length).toBe(128);
  });

  it('tek bir grup seçildiğinde yalnızca o gruptan karakter üretilmelidir', () => {
    const pwd = generatePassword({
      length: 15,
      lowercase: false,
      uppercase: false,
      numbers: true,
      symbols: false,
      excludeSimilar: false,
    });
    expect(pwd.length).toBe(15);
    expect(/^\d+$/.test(pwd)).toBe(true);
  });

  it('hariç tutulan karakterlerin hiçbirinin üretilmediğini doğrulamalıdır', () => {
    const excluded = 'xyz123';
    for (let i = 0; i < 20; i++) {
      const pwd = generatePassword({
        length: 25,
        lowercase: true,
        uppercase: true,
        numbers: true,
        symbols: true,
        excludeSimilar: false,
        customExclude: excluded,
      });
      for (const char of excluded) {
        expect(pwd).not.toContain(char);
      }
    }
  });
});

describe('Passphrase Generator Engine (passphrase.ts & wordlist.ts)', () => {
  it('EFF kelime listesi tam olarak 7776 kelime içermelidir', () => {
    expect(EFF_WORDLIST.length).toBe(7776);
    expect(EFF_WORDLIST_SIZE).toBe(7776);
  });

  it('belirtilen kelime sayısında parola cümlesi üretmelidir', () => {
    const res = generatePassphrase({
      wordCount: 5,
      separator: '-',
      capitalize: 'none',
      includeNumber: false,
    });

    const parts = res.passphrase.split('-');
    expect(parts.length).toBe(5);
    expect(res.words.length).toBe(5);
    // Entropi 5 * ~12.9155 = ~64.6
    expect(res.entropyBits).toBeCloseTo(5 * BITS_PER_WORD, 0);
  });

  it('büyük harf biçimlendirmesini (capitalize: "capitalize") doğru uygulamalıdır', () => {
    const res = generatePassphrase({
      wordCount: 4,
      separator: ' ',
      capitalize: 'capitalize',
      includeNumber: false,
    });

    for (const word of res.words) {
      expect(word[0]).toBe(word[0].toUpperCase());
    }
  });

  it('sayı ekleme seçeneği (includeNumber: true) bir rakam eklemeli ve entropiyi artırmalıdır', () => {
    const res = generatePassphrase({
      wordCount: 4,
      separator: '.',
      capitalize: 'none',
      includeNumber: true,
    });

    const lastWord = res.words[res.words.length - 1];
    expect(/\d$/.test(lastWord)).toBe(true);
    // Entropi taban entropiden büyük olmalı
    expect(res.entropyBits).toBeGreaterThan(4 * BITS_PER_WORD);
  });

  it('geçersiz kelime sayılarında RangeError fırlatmalıdır', () => {
    expect(() =>
      generatePassphrase({
        wordCount: 2, // min 3
        separator: '-',
        capitalize: 'none',
        includeNumber: false,
      })
    ).toThrow(RangeError);
  });
});

describe('Entropy & Strength Analysis (entropy.ts)', () => {
  it('Shannon entropisini doğru formülle H = L * log2(N) hesaplamalıdır', () => {
    // 10 karakter, 95 karakter havuzu: 10 * log2(95) ~= 65.7 bits
    const entropy = calculateShannonEntropy(10, 95);
    expect(entropy).toBeCloseTo(65.7, 0);
  });

  it('farklı parola güçlerini seviyelere ayırmalıdır', () => {
    const weak = evaluatePasswordStrength('abc');
    expect(weak.level).toBe('weak');

    const strong = evaluatePasswordStrength('K#9vB$2mP!xL7@wQ');
    expect(strong.level).toBe('very-strong');
    expect(strong.score).toBe(4);
  });

  it('boş parolada güvenli varsayılanlar döndürmelidir', () => {
    const empty = evaluatePasswordStrength('');
    expect(empty.score).toBe(0);
    expect(empty.entropyBits).toBe(0);
    expect(empty.crackTimeDisplay).toBe('Anında');
  });

  it('kırılma süresi tahminleri mantıklı olmalıdır', () => {
    expect(estimateCrackTime(20)).toBe('Saliseler içinde');
    expect(estimateCrackTime(100)).toBe('Milyonlarca yıl');
  });
});
