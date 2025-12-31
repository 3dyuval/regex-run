import { describe, it, expect } from 'vitest';
import {
  REGEX_FEATURES,
  generateTargets,
  getAvailableFeatures,
  doesMatchSatisfyTarget
} from './regex-features';

describe('doesMatchSatisfyTarget', () => {
  it('should match literal patterns', () => {
    expect(doesMatchSatisfyTarget('are', 'are')).toBe(true);
    expect(doesMatchSatisfyTarget('cat', 'cat')).toBe(true);
  });

  it('should match dot wildcard patterns', () => {
    // This is the bug: "rada".includes("ra.a") returns false
    expect('rada'.includes('ra.a')).toBe(false); // current broken behavior

    // But our helper correctly matches
    expect(doesMatchSatisfyTarget('rada', 'ra.a')).toBe(true);
    expect(doesMatchSatisfyTarget('the', 't.e')).toBe(true);
    expect(doesMatchSatisfyTarget('hipp', 'hi.p')).toBe(true);
  });

  it('should not match incorrect patterns', () => {
    expect(doesMatchSatisfyTarget('cat', 'ra.a')).toBe(false);
    expect(doesMatchSatisfyTarget('the', 'ra.a')).toBe(false);
  });
});

describe('regex pattern matching', () => {
  const sampleText =
    "A cat's whiskers are thought to be a kind of radar, which helps a cat gauge the space it intends to walk through.";

  describe('dot (.) as any character', () => {
    it('should match "are" literally', () => {
      const regex = /are/g;
      const matches = sampleText.match(regex);
      expect(matches).toContain('are');
    });

    it('should match "ra.a" pattern (rada in radar)', () => {
      const regex = /ra.a/g;
      const matches = sampleText.match(regex);
      expect(matches).toContain('rada');
    });

    it('should match "t.e" pattern (the)', () => {
      const regex = /t.e/g;
      const matches = sampleText.match(regex);
      expect(matches).toContain('the');
    });

    it('should match combined pattern with alternation', () => {
      const regex = /are|ra.a|t.e/g;
      const matches = sampleText.match(regex);
      expect(matches).toContain('are');
      expect(matches).toContain('rada');
      expect(matches).toContain('the');
    });
  });

  describe('literal character matching', () => {
    it('should match exact substrings', () => {
      const regex = /whiskers/g;
      const matches = sampleText.match(regex);
      expect(matches).toContain('whiskers');
    });

    it('should match multiple occurrences', () => {
      const regex = /cat/g;
      const matches = sampleText.match(regex);
      expect(matches?.length).toBe(2);
    });
  });

  describe('REGEX_FEATURES generators', () => {
    const testText = 'The quick brown fox jumps over the lazy dog 123';

    it('literal generator returns substring from text', () => {
      const literal = REGEX_FEATURES.find((f) => f.id === 'literal');
      const result = literal?.generator(testText);
      expect(result).toBeTruthy();
      expect(testText.toLowerCase()).toContain(result!.toLowerCase());
    });

    it('any_char generator returns pattern with dot', () => {
      const anyChar = REGEX_FEATURES.find((f) => f.id === 'any_char');
      const result = anyChar?.generator(testText);
      expect(result).toBeTruthy();
      expect(result).toContain('.');
    });

    it('digit generator finds digit sequences', () => {
      const digit = REGEX_FEATURES.find((f) => f.id === 'digit');
      const result = digit?.generator(testText);
      expect(result).toBe('123');
    });
  });

  describe('getAvailableFeatures', () => {
    it('level 1 should include literal and any_char', () => {
      const features = getAvailableFeatures(1);
      const ids = features.map((f) => f.id);
      expect(ids).toContain('literal');
      expect(ids).toContain('any_char');
    });

    it('higher levels should unlock more features', () => {
      const level1 = getAvailableFeatures(1);
      const level10 = getAvailableFeatures(10);
      expect(level10.length).toBeGreaterThan(level1.length);
    });
  });

  describe('generateTargets', () => {
    it('should generate requested number of targets', () => {
      const result = generateTargets(sampleText, 5, 3);
      expect(result?.targets.length).toBe(3);
    });

    it('should return null if no valid targets can be generated', () => {
      const result = generateTargets('', 1, 3);
      expect(result).toBeNull();
    });
  });
});
