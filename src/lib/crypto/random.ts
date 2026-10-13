/**
 * SECUREPASS CSPRNG & UNBIASED RANDOM ENGINE
 * 
 * Bu modül, kriptografik rastgelelik ve sıfır-yanlılık (unbiased) garantilerini sağlar.
 * 
 * Güvenlik İlkeleri:
 * 1. Asla Math.random() KULLANILMAZ.
 * 2. Yalnızca Web Cryptography API (crypto.getRandomValues) kullanılır.
 * 3. Modulo yanlılığını (modulo bias) önlemek için Rejection Sampling uygulanır.
 * 4. Karıştırma işlemleri kriptografik Fisher-Yates shuffle ile yapılır.
 */

export class CryptoNotSupportedError extends Error {
  constructor(message = 'Web Cryptography API (crypto.getRandomValues) tarayıcınızda veya ortamınızda desteklenmiyor. Güvenlik nedeniyle parola üretimi durduruldu.') {
    super(message);
    this.name = 'CryptoNotSupportedError';
  }
}

/**
 * Web Cryptography API'nin kullanılabilirliğini doğrular.
 * @throws {CryptoNotSupportedError} API mevcut değilse
 */
export function getCrypto(): Crypto {
  if (typeof globalThis !== 'undefined' && globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') {
    return globalThis.crypto;
  }
  throw new CryptoNotSupportedError();
}

/**
 * Belirtilen üst sınıra (max hariç) kadar düzgün dağılımlı (uniform) ve 
 * modulo yanlılığı içermeyen (unbiased) rastgele bir tamsayı üretir [0, max - 1].
 * 
 * Modulo Bias Neden Oluşur ve Nasıl Önlenir?
 * 32-bit tamsayı uzayı [0, 2^32 - 1] aralığındadır (M = 2^32 = 4,294,967,296).
 * Eğer M, hedef aralık olan 'max' değerine tam bölünemiyorsa, (M mod max) kadar sayı
 * modülo işleminde ilk indekse daha fazla denk gelir ve bu da dağılımı çarpıtır.
 * 
 * Çözüm (Rejection Sampling):
 * limit = M - (M % max) eşiği belirlenir.
 * Rastgele çekilen 32-bit sayı >= limit ise reddedilir (reject) ve yeniden çekilir.
 * [0, limit - 1] aralığında kalan sayılar, her indeksin kesinlikle eşit olasılıkla
 * seçilmesini (1/max) matematiksel olarak garanti eder.
 * 
 * @param max Üst sınır (pozitif tamsayı, max > 0). Dönüş aralığı: 0 <= n < max.
 * @returns 0 ile max-1 arasında tarafsız rastgele tamsayı.
 */
export function getUnbiasedRandomInt(max: number): number {
  if (!Number.isInteger(max) || max <= 0) {
    throw new RangeError(`'max' değeri pozitif bir tamsayı olmalıdır. Alınan: ${max}`);
  }

  if (max === 1) {
    return 0;
  }

  const cryptoInstance = getCrypto();
  const buffer = new Uint32Array(1);
  const maxUint32 = 0x100000000; // 2^32 = 4,294,967,296
  const limit = maxUint32 - (maxUint32 % max);

  let rand: number;
  do {
    cryptoInstance.getRandomValues(buffer);
    rand = buffer[0];
  } while (rand >= limit);

  return rand % max;
}

/**
 * Diziden veya karakter katarından kriptografik olarak tarafsız bir eleman seçer.
 * 
 * @param collection Eleman seçilecek dizi veya karakter katarı.
 */
export function securePickOne<T>(collection: readonly T[]): T;
export function securePickOne(collection: string): string;
export function securePickOne<T>(collection: readonly T[] | string): T | string {
  if (collection.length === 0) {
    throw new RangeError('Boş bir koleksiyondan eleman seçilemez.');
  }
  const index = getUnbiasedRandomInt(collection.length);
  return collection[index];
}

/**
 * Fisher-Yates (Knuth) karıştırma algoritması ile diziyi kriptografik olarak karıştırır.
 * 
 * Orijinal diziyi mutasyona uğratmaz; yeni ve güvenli karıştırılmış bir kopya döndürür.
 * Her adımda eleman takası için getUnbiasedRandomInt() kullanılır.
 * 
 * @param array Karıştırılacak dizi.
 * @returns Karıştırılmış yeni dizi.
 */
export function secureShuffle<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    // 0 <= j <= i aralığında unbiased rastgele indeks seçimi
    const j = getUnbiasedRandomInt(i + 1);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}
