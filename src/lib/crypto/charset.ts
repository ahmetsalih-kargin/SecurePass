/**
 * SECUREPASS KARAKTER KÜMELERİ VE FİLTRELEME MOTORU
 */

export const CHARSET_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
export const CHARSET_UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const CHARSET_NUMBERS = '0123456789';
export const CHARSET_SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?~';

// Görsel olarak birbirine çok benzeyen ve karıştırılabilen karakterler
// (0, O, o, 1, l, I, |, 8, B, 5, S, 2, Z vb.)
export const SIMILAR_CHARACTERS = '0OolI1|8B5S2Z';

export interface PoolValidationResult {
  valid: boolean;
  pool: string;
  activeGroups: {
    name: string;
    chars: string;
  }[];
  errorMessage?: string;
}

/**
 * Kullanıcı tercihlerine göre benzersiz karakter havuzunu ve zorunlu grup listelerini derler.
 * Dahil etme, hariç tutma ve benzer karakter kısıtlamalarını eksiksiz uygular.
 */
export function buildCharacterPool(options: {
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar?: boolean;
  customInclude?: string;
  customExclude?: string;
}): PoolValidationResult {
  const activeGroups: { name: string; chars: string }[] = [];
  const excludeSet = new Set<string>();

  // Hariç tutulacak özel karakterler
  if (options.customExclude) {
    for (const char of options.customExclude) {
      excludeSet.add(char);
    }
  }

  // Benzer karakterleri hariç tut
  if (options.excludeSimilar) {
    for (const char of SIMILAR_CHARACTERS) {
      excludeSet.add(char);
    }
  }

  // Grupları filtrele ve zorunlu kümelere ekle
  function processGroup(name: string, chars: string, enabled: boolean) {
    if (!enabled) return;
    const filteredChars = Array.from(chars)
      .filter((c) => !excludeSet.has(c))
      .join('');
    
    if (filteredChars.length > 0) {
      activeGroups.push({ name, chars: filteredChars });
    } else {
      // Grup seçilmiş ama filtreleme sonucu o gruptan hiç karakter kalmamış!
      activeGroups.push({ name, chars: '' });
    }
  }

  processGroup('lowercase', CHARSET_LOWERCASE, options.lowercase);
  processGroup('uppercase', CHARSET_UPPERCASE, options.uppercase);
  processGroup('numbers', CHARSET_NUMBERS, options.numbers);
  processGroup('symbols', CHARSET_SYMBOLS, options.symbols);

  // Hiçbir grup seçilmemiş ve özel dahil etme de yoksa
  const hasNoEnabledGroups = !options.lowercase && !options.uppercase && !options.numbers && !options.symbols;
  const customIncludeFiltered = options.customInclude
    ? Array.from(options.customInclude)
        .filter((c) => !excludeSet.has(c))
        .join('')
    : '';

  if (hasNoEnabledGroups && !customIncludeFiltered) {
    return {
      valid: false,
      pool: '',
      activeGroups: [],
      errorMessage: 'Lütfen en az bir karakter grubu seçin veya dahil edilecek geçerli karakterler girin.',
    };
  }

  // Seçili gruplardan herhangi birinde sıfır karakter kalmışsa (hariç tutma çakışması)
  const emptyActiveGroup = activeGroups.find((g) => g.chars.length === 0);
  if (emptyActiveGroup) {
    return {
      valid: false,
      pool: '',
      activeGroups,
      errorMessage: `'${emptyActiveGroup.name}' grubu seçildi, ancak hariç tutulan karakterler nedeniyle bu grupta kullanılabilir karakter kalmadı. Lütfen kısıtlamalarınızı düzenleyin.`,
    };
  }

  // Karakter havuzunu derle (tekrar eden karakterleri tekilleştir)
  const poolCharSet = new Set<string>();
  for (const group of activeGroups) {
    for (const char of group.chars) {
      poolCharSet.add(char);
    }
  }

  if (customIncludeFiltered) {
    for (const char of customIncludeFiltered) {
      poolCharSet.add(char);
    }
  }

  const pool = Array.from(poolCharSet).join('');

  if (pool.length === 0) {
    return {
      valid: false,
      pool: '',
      activeGroups,
      errorMessage: 'Karakter havuzu boş. Belirtilen filtreler tüm karakterlerin elenmesine yol açtı.',
    };
  }

  return {
    valid: true,
    pool,
    activeGroups,
  };
}
