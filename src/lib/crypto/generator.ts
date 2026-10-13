import { buildCharacterPool } from './charset';
import { securePickOne, secureShuffle } from './random';
import type { PasswordGeneratorOptions } from './types';

export class InvalidPoolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPoolError';
  }
}

export class PasswordLengthTooShortError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PasswordLengthTooShortError';
  }
}

/**
 * Kullanıcı kısıtlamalarına göre kriptografik olarak güvenli, modulo-yanlılıksız
 * ve seçilen karakter gruplarının her birinden en az bir karakter bulunmasını
 * garanti eden parola üreticisi.
 */
export function generatePassword(options: PasswordGeneratorOptions): string {
  const { length } = options;

  if (!Number.isInteger(length) || length <= 0) {
    throw new RangeError(`Parola uzunluğu pozitif bir tamsayı olmalıdır. Alınan: ${length}`);
  }

  // 1. Karakter havuzunu derle ve kuralları doğrula
  const poolResult = buildCharacterPool({
    lowercase: options.lowercase,
    uppercase: options.uppercase,
    numbers: options.numbers,
    symbols: options.symbols,
    excludeSimilar: options.excludeSimilar,
    customInclude: options.customInclude,
    customExclude: options.customExclude,
  });

  if (!poolResult.valid || !poolResult.pool) {
    throw new InvalidPoolError(poolResult.errorMessage || 'Geçerli bir karakter havuzu oluşturulamadı.');
  }

  const { pool, activeGroups } = poolResult;

  // 2. Zorunlu grup sayısı kontrolü
  // Her seçili gruptan en az 1 karakter bulunması gerektiği için,
  // parola uzunluğu aktif grup sayısından küçük olamaz.
  if (length < activeGroups.length) {
    throw new PasswordLengthTooShortError(
      `Belirtilen parola uzunluğu (${length}), seçilen zorunlu karakter grubu sayısından (${activeGroups.length}) küçük olamaz.`
    );
  }

  const resultChars: string[] = [];

  // 3. Her aktif gruptan en az 1 karakter garantisi
  for (const group of activeGroups) {
    const char = securePickOne(group.chars);
    resultChars.push(char);
  }

  // 4. Kalan karakterleri genel havuzdan seç
  const remainingCount = length - resultChars.length;
  for (let i = 0; i < remainingCount; i++) {
    const char = securePickOne(pool);
    resultChars.push(char);
  }

  // 5. Karakterleri kriptografik olarak karıştır (Fisher-Yates)
  // Böylece zorunlu karakterlerin hep başa gelmesi örüntüsü engellenir
  const shuffledChars = secureShuffle(resultChars);

  return shuffledChars.join('');
}
