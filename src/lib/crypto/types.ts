export type CharacterGroupId = 'lowercase' | 'uppercase' | 'numbers' | 'symbols';

export interface CharacterGroupConfig {
  id: CharacterGroupId;
  label: string;
  characters: string;
  description: string;
  enabled: boolean;
}

export type PasswordMode = 'custom' | 'quick' | 'readable' | 'passphrase';

export interface PasswordGeneratorOptions {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean;      // e.g. 1, l, I, 0, O, o, 8, B
  customInclude?: string;       // Characters to force include in pool
  customExclude?: string;       // Characters to exclude from pool
}

export interface PassphraseOptions {
  wordCount: number;            // typically 3 to 10
  separator: string;            // '-', '_', '.', ' ', '', etc.
  capitalize: 'none' | 'capitalize' | 'uppercase';
  includeNumber: boolean;       // Append or insert a random number
}

export type StrengthLevel = 'weak' | 'fair' | 'strong' | 'very-strong';

export interface StrengthAnalysis {
  score: number;                // 0 to 4
  level: StrengthLevel;
  label: string;
  color: string;
  entropyBits: number;          // Theoretical Shannon / Diceware entropy
  guessesLog10: number;         // Estimated search space (log10)
  crackTimeDisplay: string;     // Friendly estimate (e.g. "Centuries", "10 minutes")
  warnings: string[];
  suggestions: string[];
  poolSize: number;
  isPassphrase: boolean;
}

export interface GeneratedResult {
  value: string;
  entropyBits: number;
  poolSize: number;
  timestamp: number;
}
