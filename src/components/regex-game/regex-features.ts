// Check if a matched text satisfies a target pattern
// Handles both literal matches and regex patterns (e.g., "ra.a" matching "rada")
export const doesMatchSatisfyTarget = (matchedText: string, targetPattern: string): boolean => {
  try {
    const re = new RegExp(`^${targetPattern}$`);
    return re.test(matchedText);
  } catch {
    return matchedText.includes(targetPattern);
  }
};

export interface RegexFeature {
  id: string;
  name: string;
  description: string;
  example: string;
  explanation: string;
  icon: string;
  difficulty_score: number;
  color: string;
  generator: (text: string) => string | null;
}

export interface Target {
  text: string;
  feature: string;
  featureName: string;
  start?: number;
  end?: number;
}

export interface GenerateResult {
  targets: Target[];
  features: RegexFeature[];
}

// Helper functions for target generation
const findRepeatedChars = (text: string): string[] => {
  const matches = text.match(/(.)\1+/g);
  return matches ? matches.filter((m) => m.length >= 2) : [];
};

const findDigitSequences = (text: string): string[] => {
  const matches = text.match(/\d+/g);
  return matches ? matches.filter((m) => m.length >= 2) : [];
};

const findWords = (text: string): string[] => {
  const matches = text.match(/\b\w{3,8}\b/g);
  return matches || [];
};

const findOptionalPatterns = (text: string): string[] => {
  const matches = text.match(/\w+(s)?\b/g);
  return matches ? matches.filter((m) => m.length >= 3) : [];
};

const findVowelClusters = (text: string): string[] => {
  const matches = text.match(/[aeiouAEIOU]{2,}/g);
  return matches || [];
};

const findConsonantClusters = (text: string): string[] => {
  const matches = text.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{2,}/g);
  return matches || [];
};

const findWordBoundaries = (text: string): string[] => {
  const matches = text.match(/\b\w{4,7}\b/g);
  return matches || [];
};

const findAlternationCandidates = (text: string): { word1: string; word2: string }[] => {
  const words = text.match(/\b\w{3,6}\b/g);
  if (!words || words.length < 2) return [];

  const candidates: { word1: string; word2: string }[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    for (let j = i + 1; j < Math.min(i + 10, words.length); j++) {
      if (
        words[i] !== words[j] &&
        (words[i].length === words[j].length || words[i][0] === words[j][0])
      ) {
        candidates.push({ word1: words[i], word2: words[j] });
      }
    }
  }
  return candidates;
};

const findRangePatterns = (text: string): string[] => {
  const matches = text.match(/\b\w{3,5}\b/g);
  return matches || [];
};

export const REGEX_FEATURES: RegexFeature[] = [
  {
    id: 'literal',
    name: 'Literal Characters',
    description: 'Match exact characters as they appear',
    example: 'cat',
    explanation: 'Matches the word "cat" exactly',
    icon: 'mdi-format-text',
    difficulty_score: 1,
    color: 'blue',
    generator: (text: string) => {
      const words = findWords(text);
      if (words.length === 0) return null;
      const word = words[Math.floor(Math.random() * Math.min(words.length, 20))];
      const start = Math.floor(Math.random() * Math.max(1, word.length - 3));
      const length = 3 + Math.floor(Math.random() * 2);
      return word.substring(start, start + length);
    }
  },
  {
    id: 'any_char',
    name: 'Any Character (.)',
    description: 'Matches any single character except newline',
    example: 'c.t',
    explanation: 'Matches "cat", "cot", "c9t", etc.',
    icon: 'mdi-circle-outline',
    difficulty_score: 2,
    color: 'cyan',
    generator: (text: string) => {
      const words = findWords(text);
      if (words.length === 0) return null;
      const word = words[Math.floor(Math.random() * Math.min(words.length, 20))];
      if (word.length < 3) return null;
      const pos = 1 + Math.floor(Math.random() * (word.length - 2));
      return word.substring(0, pos) + '.' + word.substring(pos + 1, pos + 2);
    }
  },
  {
    id: 'character_set',
    name: 'Character Sets [...]',
    description: 'Match any one character from a set',
    example: '[aeiou]',
    explanation: 'Matches any vowel',
    icon: 'mdi-format-letter-case',
    difficulty_score: 3,
    color: 'green',
    generator: (text: string) => {
      const vowelClusters = findVowelClusters(text);
      const consonantClusters = findConsonantClusters(text);
      const all = [...vowelClusters, ...consonantClusters];
      if (all.length === 0) return null;
      return all[Math.floor(Math.random() * Math.min(all.length, 15))].substring(0, 2);
    }
  },
  {
    id: 'digit',
    name: 'Digits (\\d)',
    description: 'Matches any digit (0-9)',
    example: '\\d+',
    explanation: 'Matches one or more digits like "123"',
    icon: 'mdi-numeric',
    difficulty_score: 3,
    color: 'purple',
    generator: (text: string) => {
      const digits = findDigitSequences(text);
      if (digits.length === 0) return null;
      return digits[Math.floor(Math.random() * digits.length)];
    }
  },
  {
    id: 'word_char',
    name: 'Word Characters (\\w)',
    description: 'Matches any word character (letters, digits, underscore)',
    example: '\\w+',
    explanation: 'Matches "hello", "test123", etc.',
    icon: 'mdi-alphabetical',
    difficulty_score: 3,
    color: 'indigo',
    generator: (text: string) => {
      const words = findWords(text);
      if (words.length === 0) return null;
      return words[Math.floor(Math.random() * Math.min(words.length, 20))];
    }
  },
  {
    id: 'quantifier_plus',
    name: 'One or More (+)',
    description: 'Matches one or more of the preceding element',
    example: 'o+',
    explanation: 'Matches "o", "oo", "ooo", etc.',
    icon: 'mdi-plus',
    difficulty_score: 5,
    color: 'orange',
    generator: (text: string) => {
      const repeated = findRepeatedChars(text);
      if (repeated.length === 0) return null;
      return repeated[Math.floor(Math.random() * repeated.length)];
    }
  },
  {
    id: 'quantifier_star',
    name: 'Zero or More (*)',
    description: 'Matches zero or more of the preceding element',
    example: 'colou*r',
    explanation: 'Matches "color" and "colour"',
    icon: 'mdi-asterisk',
    difficulty_score: 6,
    color: 'yellow',
    generator: (text: string) => {
      const optional = findOptionalPatterns(text);
      if (optional.length === 0) return null;
      return optional[Math.floor(Math.random() * optional.length)];
    }
  },
  {
    id: 'quantifier_question',
    name: 'Zero or One (?)',
    description: 'Makes the preceding element optional',
    example: 'colou?r',
    explanation: 'Matches "color" and "colour"',
    icon: 'mdi-help-circle-outline',
    difficulty_score: 6,
    color: 'pink',
    generator: (text: string) => {
      const optional = findOptionalPatterns(text);
      if (optional.length === 0) return null;
      return optional[Math.floor(Math.random() * optional.length)];
    }
  },
  {
    id: 'alternation',
    name: 'Alternation (|)',
    description: 'Matches either the expression before or after',
    example: 'cat|dog',
    explanation: 'Matches "cat" or "dog"',
    icon: 'mdi-source-branch',
    difficulty_score: 7,
    color: 'red',
    generator: (text: string) => {
      const candidates = findAlternationCandidates(text);
      if (candidates.length === 0) return null;
      const pair = candidates[Math.floor(Math.random() * Math.min(candidates.length, 10))];
      return Math.random() > 0.5 ? pair.word1 : pair.word2;
    }
  },
  {
    id: 'quantifier_range',
    name: 'Range Quantifier {n,m}',
    description: 'Matches between n and m occurrences',
    example: '\\d{2,4}',
    explanation: 'Matches 2 to 4 digits',
    icon: 'mdi-code-braces',
    difficulty_score: 8,
    color: 'teal',
    generator: (text: string) => {
      const ranges = findRangePatterns(text);
      if (ranges.length === 0) return null;
      return ranges[Math.floor(Math.random() * ranges.length)];
    }
  },
  {
    id: 'word_boundary',
    name: 'Word Boundary (\\b)',
    description: 'Matches a position between a word and non-word character',
    example: '\\bcat\\b',
    explanation: 'Matches "cat" but not "catch" or "scat"',
    icon: 'mdi-vector-polyline',
    difficulty_score: 9,
    color: 'emerald',
    generator: (text: string) => {
      const words = findWordBoundaries(text);
      if (words.length === 0) return null;
      return words[Math.floor(Math.random() * words.length)];
    }
  },
  {
    id: 'negated_set',
    name: 'Negated Character Set [^...]',
    description: 'Matches any character NOT in the set',
    example: '[^aeiou]',
    explanation: 'Matches any consonant',
    icon: 'mdi-file-search-outline',
    difficulty_score: 10,
    color: 'rose',
    generator: (text: string) => {
      const consonants = findConsonantClusters(text);
      if (consonants.length === 0) return null;
      return consonants[Math.floor(Math.random() * consonants.length)].substring(0, 2);
    }
  }
];

// Calculate dynamic difficulty based on level
export const getAvailableFeatures = (level: number): RegexFeature[] => {
  const baseDifficulty = 2;
  const difficultyMultiplier = 0.8;
  const maxDifficulty = baseDifficulty + level * difficultyMultiplier;

  return REGEX_FEATURES.filter((feature) => feature.difficulty_score <= maxDifficulty);
};

// Generate targets for a specific level
export const generateTargets = (
  text: string,
  level: number,
  targetCount = 3
): GenerateResult | null => {
  const availableFeatures = getAvailableFeatures(level);

  if (availableFeatures.length === 0) {
    return null;
  }

  const targets: Target[] = [];
  const usedTexts = new Set<string>();
  const usedFeatures: RegexFeature[] = [];

  let attempts = 0;
  const maxAttempts = 50;

  while (targets.length < targetCount && attempts < maxAttempts) {
    attempts++;

    const feature = availableFeatures[Math.floor(Math.random() * availableFeatures.length)];

    try {
      const targetText = feature.generator(text);

      if (
        targetText &&
        targetText.length >= 2 &&
        targetText.length <= 10 &&
        !usedTexts.has(targetText) &&
        /\w/.test(targetText)
      ) {
        targets.push({
          text: targetText,
          feature: feature.id,
          featureName: feature.name
        });
        usedTexts.add(targetText);
        usedFeatures.push(feature);
      }
    } catch {
      continue;
    }
  }

  return targets.length === targetCount ? { targets, features: usedFeatures } : null;
};
