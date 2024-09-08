const { Patches } = require('../dist/cjs/index.js')
const StringExtensions = Patches.get(String)
const StringPrototypeExtensions = Patches.get(String.prototype)
import { describe, beforeAll, test, expect } from 'vitest';

describe('StringExtensions', () => {
  beforeAll(() => {
    // Apply the StringExtensions patch
    StringExtensions.apply();
  });

  test('isString should correctly identify strings', () => {
    expect(String.isString('hello')).toBe(true);
    expect(String.isString(new String('hello'))).toBe(true);
    expect(String.isString(123)).toBe(false);
    expect(String.isString(null)).toBe(false);
    expect(String.isString(undefined)).toBe(false);
    expect(String.isString({})).toBe(false);
  });

  test('parenthesisPair should return correct pair', () => {
    expect(String.parenthesisPair).toEqual(['(', ')']);
  });

  test('squareBracketsPair should return correct pair', () => {
    expect(String.squareBracketsPair).toEqual(['[', ']']);
  });

  test('curlyBracketsPair should return correct pair', () => {
    expect(String.curlyBracketsPair).toEqual(['{', '}']);
  });
});

describe('StringPrototypeExtensions', () => {
  beforeAll(() => {
    // Apply the StringPrototypeExtensions patch
    StringPrototypeExtensions.apply();
  });

  test('extractSubstring should correctly extract substrings', () => {
    const testString = "This is a test (with a substring) and some more text.";
    const result = testString.extractSubstring(0, ['(', ')']);
    expect(result).toEqual({
      extracted: "(with a substring)",
      range: [15, 32],
      newOffset: 33,
      leadingToken: 'test',
    });
  });

  test('extractSubstring with no matching tokens should return null', () => {
    const testString = "No parentheses here.";
    const result = testString.extractSubstring();
    expect(result).toEqual({
      extracted: null,
      range: [-1, -1],
      newOffset: 0,
      leadingToken: '',
    });
  });
});