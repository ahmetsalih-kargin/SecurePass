import type { StrengthAnalysis, StrengthLevel } from './types';

/**
 * Verilen parola için kullanılan gerçek karakter havuzunun boyutunu (N) hesaplar.
 */
export function estimatePoolSize(password: string): number {
  let hasLower = false;
  let hasUpper = false;
  let hasDigit = false;
  let hasSymbol = false;

  for (const char of password) {
    if (/[a-z]/.test(char)) hasLower = true;
    else if (/[A-Z]/.test(char)) hasUpper = true;
    else if (/[0-9]/.test(char)) hasDigit = true;
    else hasSymbol = true;
  }

  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasDigit) poolSize += 10;
  if (hasSymbol) poolSize += 33;

  return Math.max(poolSize, 1);
}

/**
 * Shannon Entropisi: H = L * log2(N)
 * Bağımsız ve eşit dağılımlı karakterler varsayımı altındaki teorik üst sınırı temsil eder.
 */
export function calculateShannonEntropy(length: number, poolSize: number): number {
  if (length <= 0 || poolSize <= 0) return 0;
  const entropy = length * Math.log2(poolSize);
  return Math.round(entropy * 10) / 10;
}

/**
 * Tahmin süresini insan tarafından okunabilir bir metne dönüştürür.
 * Varsayım: Yüksek performanslı bir saldırgan / GPU kümesi (Saniyede 10^11 hash / ~100 GH/s).
 */
export function estimateCrackTime(entropyBits: number): string {
  if (entropyBits <= 0) return 'Anında (0 saniye)';
  
  // Olası kombinasyon sayısı: 2^entropyBits
  // Ortalama kırılma için arama uzayının yarısı: 2^(entropyBits - 1)
  const guessesPerSecond = 1e11; // 100 milyar tahmin / sn
  const seconds = Math.pow(2, entropyBits - 1) / guessesPerSecond;

  if (seconds < 1) return 'Saliseler içinde';
  if (seconds < 60) return `${Math.round(seconds)} saniye`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} dakika`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} saat`;
  if (seconds < 86400 * 30) return `${Math.round(seconds / 86400)} gün`;
  if (seconds < 86400 * 365) return `${Math.round(seconds / (86400 * 30))} ay`;
  if (seconds < 86400 * 365 * 100) return `${Math.round(seconds / (86400 * 365))} yıl`;
  if (seconds < 86400 * 365 * 1000000) return `${Math.round(seconds / (86400 * 365 * 1000))} bin yıl`;
  return 'Milyonlarca yıl';
}

/**
 * Parolanın gücünü, entropisini, örüntülerini ve tahmin edilebilirliğini değerlendirir.
 */
export function evaluatePasswordStrength(password: string, isPassphrase = false): StrengthAnalysis {
  if (!password || password.length === 0) {
    return {
      score: 0,
      level: 'weak',
      label: 'Geçersiz',
      color: 'text-rose-500',
      entropyBits: 0,
      guessesLog10: 0,
      crackTimeDisplay: 'Anında',
      warnings: ['Parola girilmedi veya üretilemedi.'],
      suggestions: ['Lütfen en az 12-16 karakter uzunluğunda bir parola üretin.'],
      poolSize: 0,
      isPassphrase,
    };
  }

  const poolSize = estimatePoolSize(password);
  let entropy = calculateShannonEntropy(password.length, poolSize);

  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Örüntü ve zayıflık cezaları (tekrarlar, sıralı karakterler vb.)
  if (/(.)\1{2,}/.test(password)) {
    warnings.push('Tekrarlanan karakterler (örn: "aaa") tespit edildi.');
    entropy = Math.max(0, entropy - 10);
  }

  if (/1234|abcd|qwer|asdf/i.test(password)) {
    warnings.push('Sıralı veya yaygın klavye dizilimi tespit edildi.');
    entropy = Math.max(0, entropy - 15);
  }

  if (password.length < 12) {
    suggestions.push('Parolanızı en az 16 karaktere çıkarmanız güvenliği katlanarak artırır.');
  }

  // Güç sınıflandırması
  let level: StrengthLevel = 'weak';
  let score = 0;
  let label = 'Zayıf';
  let color = 'text-rose-400';

  if (entropy < 45) {
    level = 'weak';
    score = 1;
    label = 'Zayıf';
    color = 'text-rose-400';
  } else if (entropy < 70) {
    level = 'fair';
    score = 2;
    label = 'Orta';
    color = 'text-amber-400';
  } else if (entropy < 95) {
    level = 'strong';
    score = 3;
    label = 'Güçlü';
    color = 'text-emerald-400';
  } else {
    level = 'very-strong';
    score = 4;
    label = 'Çok Güçlü';
    color = 'text-cyan-400';
  }

  const guessesLog10 = Math.round((entropy * Math.log10(2)) * 10) / 10;
  const crackTimeDisplay = estimateCrackTime(entropy);

  return {
    score,
    level,
    label,
    color,
    entropyBits: Math.round(entropy * 10) / 10,
    guessesLog10,
    crackTimeDisplay,
    warnings,
    suggestions,
    poolSize,
    isPassphrase,
  };
}
