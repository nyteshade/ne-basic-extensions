// src/utils/descriptor.utils.test.js
import { describe, it, expect } from 'vitest';
import {
  accessor,
  data,
  isAccessor,
  isData,
  isDescriptor,
  redescribe,
  kAccessorDescriptorKeys,
  kDataDescriptorKeys,
  kDescriptorKeys,
  kSharedDescriptorKeys
} from '../../dist/cjs/utils/index.js';

describe('DescriptorUtils', () => {
  describe('accessor', () => {
    it('should create a default accessor descriptor', () => {
      const descriptor = accessor();
      expect(descriptor).toHaveProperty('get');
      expect(descriptor).toHaveProperty('set');
      expect(descriptor.configurable).toBe(true);
      expect(descriptor.enumerable).toBe(true);
    });

    it('should create a read-only accessor when given a zero-argument function', () => {
      const getter = () => 42;
      const descriptor = accessor(getter);
      expect(descriptor.get()).toBe(42);
      expect(descriptor.set).toBeUndefined();
    });
  });

  describe('data', () => {
    it('should create a default data descriptor', () => {
      const descriptor = data();
      expect(descriptor.value).toBeUndefined();
      expect(descriptor.writable).toBe(true);
      expect(descriptor.configurable).toBe(true);
      expect(descriptor.enumerable).toBe(true);
    });

    it('should create a data descriptor with specified value', () => {
      const descriptor = data(42);
      expect(descriptor.value).toBe(42);
    });
  });

  describe('isAccessor', () => {
    it('should return true for a valid accessor descriptor', () => {
      const descriptor = { get: () => 42, set: (val) => {} };
      expect(isAccessor(descriptor)).toBe(true);
    });

    it('should return false for a non-accessor descriptor', () => {
      const descriptor = { value: 42, writable: true };
      expect(isAccessor(descriptor)).toBe(false);
    });
  });

  describe('isData', () => {
    it('should return true for a valid data descriptor', () => {
      const descriptor = { value: 42, writable: true };
      expect(isData(descriptor)).toBe(true);
    });

    it('should return false for a non-data descriptor', () => {
      const descriptor = { get: () => 42, set: (val) => {} };
      expect(isData(descriptor)).toBe(false);
    });
  });

  describe('isDescriptor', () => {
    it('should return true for a valid descriptor', () => {
      const descriptor = { value: 42, writable: true };
      expect(isDescriptor(descriptor)).toBe(true);
    });

    it('should return false for an invalid descriptor', () => {
      const descriptor = { foo: 'bar' };
      expect(isDescriptor(descriptor)).toBe(false);
    });
  });

  describe('redescribe', () => {
    it('should redefine a property on an object', () => {
      const obj = { a: 1 };
      redescribe(obj, 'a', { writable: false });
      expect(Object.getOwnPropertyDescriptor(obj, 'a').writable).toBe(false);
    });

    it('should rename a property on an object', () => {
      const obj = { a: 1 };
      redescribe(obj, 'a', { writable: false }, { rename: 'b' });
      expect(obj).not.toHaveProperty('a');
      expect(obj).toHaveProperty('b');
    });

    it('should create aliases of a property on an object', () => {
      const obj = { a: 1 };

      redescribe(obj, 'a', null, { alsoAs: ['b', 'c'] })
      expect(obj).toHaveProperty('a')
      expect(obj).toHaveProperty('b')
      expect(obj).toHaveProperty('c')
      expect(obj.a === obj.b)
      expect(obj.a === obj.c)
    });
  });

  describe('Descriptor Keys', () => {
    it('should have correct accessor descriptor keys', () => {
      expect(kAccessorDescriptorKeys).toEqual(['get', 'set']);
    });

    it('should have correct data descriptor keys', () => {
      expect(kDataDescriptorKeys).toEqual(['value', 'writable']);
    });

    it('should have correct shared descriptor keys', () => {
      expect(kSharedDescriptorKeys).toEqual(['configurable', 'enumerable']);
    });

    it('should have correct combined descriptor keys', () => {
      expect(kDescriptorKeys).toEqual([
        'get', 'set', 'value', 'writable', 'configurable', 'enumerable'
      ]);
    });
  });
});