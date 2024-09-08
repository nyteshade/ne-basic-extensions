const { Patches } = require('../dist/cjs/index.js')
const ArrayPrototypeExtensions = Patches.get(Array.prototype)

import { describe, expect, it } from 'vitest';

ArrayPrototypeExtensions.apply();

describe('ArrayPrototypeExtensions', () => {
  describe('contains method', () => {
    it('should return true if the array contains the specified element', () => {
      const arr = [1, 2, 3];
      expect(arr.contains(2)).toBeTruthy();
    });

    it('should return false if the array does not contain the specified element', () => {
      const arr = [1, 2, 3];
      expect(arr.contains(4)).toBeFalsy();
    });
  });

  describe('findEntry method', () => {
    it('should return the first matching [index, value] entry', () => {
      const arr = ['a', 'b', 'c'];
      expect(arr.findEntry(x => x === 'b')).toEqual([1, 'b']);
    });

    it('should return undefined if no match is found', () => {
      const arr = ['a', 'b', 'c'];
      expect(arr.findEntry(x => x === 'd')).toBeUndefined();
    });
  });

  describe('first getter', () => {
    it('should return the first element of the array', () => {
      const arr = [1, 2, 3];
      expect(arr.first).toBe(1);
    });

    it('should return undefined if the array is empty', () => {
      const arr = [];
      expect(arr.first).toBeUndefined();
    });
  });

  describe('last getter', () => {
    it('should return the last element of the array', () => {
      const arr = [1, 2, 3];
      expect(arr.last).toBe(3);
    });

    it('should return undefined if the array is empty', () => {
      const arr = [];
      expect(arr.last).toBeUndefined();
    });
  });
});