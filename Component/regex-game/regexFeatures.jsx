import {
  Type,
  Circle,
  LetterText,
  Hash,
  BookA,
  Plus,
  Asterisk,
  HelpCircle,
  Split,
  Braces,
  ArrowRight,
  SearchX,
  Waypoints,
} from "lucide-react";

// Helper functions for target generation
const findRepeatedChars = (text) => {
  const matches = text.match(/(.)\1+/g);
  return matches ? matches.filter((m) => m.length >= 2) : [];
};

const findDigitSequences = (text) => {
  const matches = text.match(/\d+/g);
  return matches ? matches.filter((m) => m.length >= 2) : [];
};

const findWords = (text) => {
  const matches = text.match(/\b\w{3,8}\b/g);
  return matches || [];
};

const findMixedCase = (text) => {
  const matches = text.match(/[a-zA-Z]{3,6}/g);
  return matches || [];
};

const findWhitespacePatterns = (text) => {
  const matches = text.match(/\w+\s+\w+/g);
  return matches || [];
};

const findPunctuation = (text) => {
  const matches = text.match(/\w+[.!?,;:]\w*/g);
  return matches || [];
};

const findVowelClusters = (text) => {
  const matches = text.match(/[aeiouAEIOU]{2,}/g);
  return matches || [];
};

const findConsonantClusters = (text) => {
  const matches = text.match(
    /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{2,}/g,
  );
  return matches || [];
};

const findWordBoundaries = (text) => {
  const matches = text.match(/\b\w{4,7}\b/g);
  return matches || [];
};

const findAlternationCandidates = (text) => {
  const words = text.match(/\b\w{3,6}\b/g);
  if (!words || words.length < 2) return [];

  // Find pairs of words that share some similarity (same length or first letter)
  const candidates = [];
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

const findOptionalPatterns = (text) => {
  // Find words with optional 's' at end, or words followed by optional punctuation
  const matches = text.match(/\w+(s)?\b/g);
  return matches ? matches.filter((m) => m.length >= 3) : [];
};

const findRangePatterns = (text) => {
  const matches = text.match(/\b\w{3,5}\b/g);
  return matches || [];
};

export const REGEX_FEATURES = [
  {
    id: "literal",
    name: "Literal Characters",
    description: "Match exact characters as they appear",
    example: "cat",
    explanation: 'Matches the word "cat" exactly',
    icon: Type,
    difficulty_score: 1,
    color: "blue",
    generator: (text) => {
      const words = findWords(text);
      if (words.length === 0) return null;
      const word =
        words[Math.floor(Math.random() * Math.min(words.length, 20))];
      const start = Math.floor(Math.random() * Math.max(1, word.length - 3));
      const length = 3 + Math.floor(Math.random() * 2);
      return word.substring(start, start + length);
    },
  },
  {
    id: "any_char",
    name: "Any Character (.)",
    description: "Matches any single character except newline",
    example: "c.t",
    explanation: 'Matches "cat", "cot", "c9t", etc.',
    icon: Circle,
    difficulty_score: 2,
    color: "cyan",
    generator: (text) => {
      const words = findWords(text);
      if (words.length === 0) return null;
      const word =
        words[Math.floor(Math.random() * Math.min(words.length, 20))];
      if (word.length < 3) return null;
      const pos = 1 + Math.floor(Math.random() * (word.length - 2));
      return word.substring(0, pos) + "." + word.substring(pos + 1, pos + 2);
    },
  },
  {
    id: "character_set",
    name: "Character Sets [...]",
    description: "Match any one character from a set",
    example: "[aeiou]",
    explanation: "Matches any vowel",
    icon: LetterText,
    difficulty_score: 3,
    color: "green",
    generator: (text) => {
      const vowelClusters = findVowelClusters(text);
      const consonantClusters = findConsonantClusters(text);
      const all = [...vowelClusters, ...consonantClusters];
      if (all.length === 0) return null;
      return all[
        Math.floor(Math.random() * Math.min(all.length, 15))
      ].substring(0, 2);
    },
  },
  {
    id: "digit",
    name: "Digits (\\d)",
    description: "Matches any digit (0-9)",
    example: "\\d+",
    explanation: 'Matches one or more digits like "123"',
    icon: Hash,
    difficulty_score: 3,
    color: "purple",
    generator: (text) => {
      const digits = findDigitSequences(text);
      if (digits.length === 0) return null;
      return digits[Math.floor(Math.random() * digits.length)];
    },
  },
  {
    id: "word_char",
    name: "Word Characters (\\w)",
    description: "Matches any word character (letters, digits, underscore)",
    example: "\\w+",
    explanation: 'Matches "hello", "test123", etc.',
    icon: BookA,
    difficulty_score: 3,
    color: "indigo",
    generator: (text) => {
      const words = findWords(text);
      if (words.length === 0) return null;
      return words[Math.floor(Math.random() * Math.min(words.length, 20))];
    },
  },
  {
    id: "quantifier_plus",
    name: "One or More (+)",
    description: "Matches one or more of the preceding element",
    example: "o+",
    explanation: 'Matches "o", "oo", "ooo", etc.',
    icon: Plus,
    difficulty_score: 5,
    color: "orange",
    generator: (text) => {
      const repeated = findRepeatedChars(text);
      if (repeated.length === 0) return null;
      return repeated[Math.floor(Math.random() * repeated.length)];
    },
  },
  {
    id: "quantifier_star",
    name: "Zero or More (*)",
    description: "Matches zero or more of the preceding element",
    example: "colou*r",
    explanation: 'Matches "color" and "colour"',
    icon: Asterisk,
    difficulty_score: 6,
    color: "yellow",
    generator: (text) => {
      const optional = findOptionalPatterns(text);
      if (optional.length === 0) return null;
      return optional[Math.floor(Math.random() * optional.length)];
    },
  },
  {
    id: "quantifier_question",
    name: "Zero or One (?)",
    description: "Makes the preceding element optional",
    example: "colou?r",
    explanation: 'Matches "color" and "colour"',
    icon: HelpCircle,
    difficulty_score: 6,
    color: "pink",
    generator: (text) => {
      const optional = findOptionalPatterns(text);
      if (optional.length === 0) return null;
      return optional[Math.floor(Math.random() * optional.length)];
    },
  },
  {
    id: "alternation",
    name: "Alternation (|)",
    description: "Matches either the expression before or after",
    example: "cat|dog",
    explanation: 'Matches "cat" or "dog"',
    icon: Split,
    difficulty_score: 7,
    color: "red",
    generator: (text) => {
      const candidates = findAlternationCandidates(text);
      if (candidates.length === 0) return null;
      const pair =
        candidates[Math.floor(Math.random() * Math.min(candidates.length, 10))];
      // Return just one of them as the target
      return Math.random() > 0.5 ? pair.word1 : pair.word2;
    },
  },
  {
    id: "quantifier_range",
    name: "Range Quantifier {n,m}",
    description: "Matches between n and m occurrences",
    example: "\\d{2,4}",
    explanation: "Matches 2 to 4 digits",
    icon: Braces,
    difficulty_score: 8,
    color: "teal",
    generator: (text) => {
      const ranges = findRangePatterns(text);
      if (ranges.length === 0) return null;
      return ranges[Math.floor(Math.random() * ranges.length)];
    },
  },
  {
    id: "word_boundary",
    name: "Word Boundary (\\b)",
    description: "Matches a position between a word and non-word character",
    example: "\\bcat\\b",
    explanation: 'Matches "cat" but not "catch" or "scat"',
    icon: Waypoints,
    difficulty_score: 9,
    color: "emerald",
    generator: (text) => {
      const words = findWordBoundaries(text);
      if (words.length === 0) return null;
      return words[Math.floor(Math.random() * words.length)];
    },
  },
  {
    id: "negated_set",
    name: "Negated Character Set [^...]",
    description: "Matches any character NOT in the set",
    example: "[^aeiou]",
    explanation: "Matches any consonant",
    icon: SearchX,
    difficulty_score: 10,
    color: "rose",
    generator: (text) => {
      const consonants = findConsonantClusters(text);
      if (consonants.length === 0) return null;
      return consonants[
        Math.floor(Math.random() * consonants.length)
      ].substring(0, 2);
    },
  },
];

// Calculate dynamic difficulty based on level
export const getAvailableFeatures = (level) => {
  // Formula: base difficulty + (level * multiplier)
  const baseDifficulty = 2;
  const difficultyMultiplier = 0.8;
  const maxDifficulty = baseDifficulty + level * difficultyMultiplier;

  return REGEX_FEATURES.filter(
    (feature) => feature.difficulty_score <= maxDifficulty,
  );
};

// Generate targets for a specific level
export const generateTargets = (text, level, targetCount = 3) => {
  const availableFeatures = getAvailableFeatures(level);

  if (availableFeatures.length === 0) {
    return null;
  }

  const targets = [];
  const usedTexts = new Set();
  const usedFeatures = [];

  let attempts = 0;
  const maxAttempts = 50;

  while (targets.length < targetCount && attempts < maxAttempts) {
    attempts++;

    // Pick a random feature from available ones
    const feature =
      availableFeatures[Math.floor(Math.random() * availableFeatures.length)];

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
          featureName: feature.name,
        });
        usedTexts.add(targetText);
        usedFeatures.push(feature);
      }
    } catch (e) {
      // Generator failed, try another
      continue;
    }
  }

  return targets.length === targetCount
    ? { targets, features: usedFeatures }
    : null;
};
