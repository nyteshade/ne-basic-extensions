import { describe, it, expect } from 'vitest';
import { is, si, has, as } from '../../dist/cjs/index.js';

describe('is utility functions', () => {
  it('should correctly identify types', () => {
    expect(is.a(42, 'number')).toBe(true);
    expect(is.a(new Date(), Date)).toBe(true);
    expect(is.a('string', Number)).toBe(false);
  });

  it('should correctly identify accessor descriptors', () => {
    expect(is.accessorDescriptor({ get: () => 42, set: () => {} })).toBe(true);
    expect(is.accessorDescriptor({ value: 42, writable: true })).toBe(false);
  });

  it('should correctly identify arrays', () => {
    expect(is.array([1, 2, 3])).toBe(true);
    expect(is.array('string')).toBe(false);
  });

  it('should correctly identify bigints', () => {
    expect(is.bigint(123n)).toBe(true);
    expect(is.bigint(123)).toBe(false);
  });

  it('should correctly identify booleans', () => {
    expect(is.boolean(true)).toBe(true);
    expect(is.boolean(false)).toBe(true);
    expect(is.boolean(1)).toBe(false);
  });

  it('should correctly identify functions', () => {
    expect(is.function(function() {})).toBe(true);
    expect(is.function(123)).toBe(false);
  });

  it('should correctly identify iterables', () => {
    expect(is.iterable([1, 2, 3])).toBe(true);
    expect(is.iterable('string')).toBe(true);
    expect(is.iterable(123)).toBe(false);
  });

  it('should correctly identify nullish values', () => {
    expect(is.nullish(null)).toBe(true);
    expect(is.nullish(undefined)).toBe(true);
    expect(is.nullish('value')).toBe(false);
  });

  it('should correctly identify numbers', () => {
    expect(is.number(123)).toBe(true);
    expect(is.number('123')).toBe(false);
  });

  it('should correctly identify objects', () => {
    expect(is.object({})).toBe(true);
    expect(is.object(null)).toBe(false);
  });

  it('should correctly identify strings', () => {
    expect(is.string('hello')).toBe(true);
    expect(is.string(123)).toBe(false);
  });

  it('should correctly identify symbols', () => {
    expect(is.symbol(Symbol('foo'))).toBe(true);
    expect(is.symbol('foo')).toBe(false);
  });

  it('should correctly identify true values', () => {
    expect(is.true(true)).toBe(true);
    expect(is.true(false)).toBe(false);
  });

  it('should correctly identify truthy values', () => {
    expect(is.truthy(1)).toBe(true);
    expect(is.truthy('hello')).toBe(true);
    expect(is.truthy(0)).toBe(false);
    expect(is.truthy('')).toBe(false);
  });
});

describe('si utility functions', () => {
  it('should return thenValue or elseValue based on condition', () => {
    expect(si.a(42, 'number', 'yes', 'no')).toBe('yes');
    expect(si.a('string', Number, 'yes', 'no')).toBe('no');
  });

  it('should correctly identify falsy values and return thenValue or elseValue', () => {
    expect(si.falsy(0, 'yes', 'no')).toBe('yes');
    expect(si.falsy(1, 'yes', 'no')).toBe('no');
  });

  it('should correctly identify functions and return thenValue or elseValue', () => {
    expect(si.function(function() {}, 'yes', 'no')).toBe('yes');
    expect(si.function(123, 'yes', 'no')).toBe('no');
  });

  it('should correctly identify iterables and return thenValue or elseValue', () => {
    expect(si.iterable([1, 2, 3], 'yes', 'no')).toBe('yes');
    expect(si.iterable(123, 'yes', 'no')).toBe('no');
  });

  it('should correctly identify nullish values and return thenValue or elseValue', () => {
    expect(si.nullish(null, 'yes', 'no')).toBe('yes');
    expect(si.nullish('value', 'yes', 'no')).toBe('no');
  });

  it('should correctly identify numbers and return thenValue or elseValue', () => {
    expect(si.number(123, 'yes', 'no')).toBe('yes');
    expect(si.number('123', 'yes', 'no')).toBe('no');
  });

  it('should correctly identify objects and return thenValue or elseValue', () => {
    expect(si.object({}, 'yes', 'no')).toBe('yes');
    expect(si.object(null, 'yes', 'no')).toBe('no');
  });

  it('should correctly identify symbols and return thenValue or elseValue', () => {
    expect(si.symbol(Symbol('foo'), 'yes', 'no')).toBe('yes');
    expect(si.symbol('foo', 'yes', 'no')).toBe('no');
  });

  it('should correctly identify true values and return thenValue or elseValue', () => {
    expect(si.true(true, 'yes', 'no')).toBe('yes');
    expect(si.true(false, 'yes', 'no')).toBe('no');
  });

  it('should correctly identify truthy values and return thenValue or elseValue', () => {
    expect(si.truthy(1, 'yes', 'no')).toBe('yes');
    expect(si.truthy(0, 'yes', 'no')).toBe('no');
  });
});

describe('has utility functions', () => {
  it('should correctly identify if an object has a key', () => {
    expect(has(new Map([['key', 'value']]), 'key')).toBe(true);
    expect(has({}, 'key')).toBe(false);
  });

  it('should correctly identify if an object has all keys', () => {
    expect(has.all(new Map([['key1', 'value1'], ['key2', 'value2']]), ['key1', 'key2'])).toBe(true);
    expect(has.all({}, ['key1', 'key2'])).toBe(false);
  });

  it('should correctly identify if an object has some keys', () => {
    expect(has.some(new Map([['key1', 'value1'], ['key2', 'value2']]), ['key1'])).toBe(true);
    expect(has.some({}, ['key1', 'key2'])).toBe(false);
  });

  it('should correctly identify if an object has a prototype', () => {
    expect(has.prototype(function() {})).toBe(true);
    expect(has.prototype(() => {})).toBe(false);
  });

  it('should correctly identify if an object has a custom string tag', () => {
    const obj = { [Symbol.toStringTag]: 'CustomObject' };
    expect(has.stringTag(obj)).toBe(true);
  });

  it('should correctly identify if an object has a custom toPrimitive method', () => {
    const obj = { [Symbol.toPrimitive]: () => 42 };
    expect(has.toPrimitive(obj)).toBe(true);
  });

  it('should correctly identify if an object has a custom valueOf method', () => {
    const obj = { valueOf: () => 42 };
    expect(has.valueOfFn(obj)).toBe(true);
  });
});

describe('as utility functions', () => {
  it('should correctly convert values to arrays', () => {
    expect(as.array([1, 2, 3])).toEqual([1, 2, 3]);
    expect(as.array('string')).toEqual(['s', 't', 'r', 'i', 'n', 'g']);
    expect(as.array(123)).toBe(undefined);
  });

  it('should correctly convert values to objects', () => {
    expect(as.object({ key: 'value' })).toEqual({ key: 'value' });
    expect(typeof as.object('string')).toBe('object');
    expect(as.object(null)).toEqual({});
  });

  it('should correctly convert values to strings', () => {
    expect(as.string(null)).toBe('null');
    expect(as.string(123)).toBe('123');
    const obj = { [Symbol.toPrimitive]: () => 'custom' };
    expect(as.string(obj)).toBe('custom');
    expect(as.string(Symbol('mySymbol'), { description: true })).toBe('mySymbol');
    expect(as.string([], { stringTag: true })).toBe('');
  });

  it('should correctly convert values to integer strings', () => {
    expect(as.integerString(123.456)).toBe('123');
    expect(as.integerString('0.789')).toBe('0');
  });

  it('should correctly convert values to number strings', () => {
    expect(as.numberString('  123.456abc  ')).toBe('123.456');
    expect(as.numberString('-0.789xyz')).toBe('-0.789');
  });

  it('should correctly convert values to numbers', () => {
    expect(as.number('123.456abc')).toBe(123.456);
    expect(as.number('-0.789xyz')).toBe(-0.789);
  });

  it('should correctly convert values to bigints', () => {
    expect(as.bigint('123.456abc')).toBe(123n);
    expect(as.bigint('0.789xyz')).toBe(0n);
  });

  it('should correctly convert values to booleans', () => {
    expect(as.boolean('yes')).toBe(true);
    expect(as.boolean('no')).toBe(false);
    expect(as.boolean(1)).toBe(true);
    expect(as.boolean(0)).toBe(false);
    expect(as.boolean('true')).toBe(true);
    expect(as.boolean('false')).toBe(false);
    expect(as.boolean({})).toBe(true);
    expect(as.boolean(null)).toBe(false);
  });
});