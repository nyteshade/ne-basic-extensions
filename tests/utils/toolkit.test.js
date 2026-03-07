import { describe, it, expect } from 'vitest'
import { is, si, has, as } from '../../dist/cjs/index.js'

describe('is utility functions', () => {
  it('should correctly identify types via is.a', () => {
    expect(is.a(42, 'number')).toBe(true)
    expect(is.a(new Date(), Date)).toBe(true)
    expect(is.a('string', Number)).toBe(false)
  })

  it('should correctly identify accessor descriptors', () => {
    expect(is.accessorDescriptor({ get: () => 42, set: () => {} })).toBe(true)
    expect(is.accessorDescriptor({ get: () => 42 })).toBe(true)
    expect(is.accessorDescriptor({ value: 42, writable: true })).toBe(false)
    expect(is.accessorDescriptor({ value: 42, get: () => 42 })).toBe(false)
    expect(is.accessorDescriptor(null)).toBe(false)
  })

  it('should correctly identify arrays', () => {
    expect(is.array([1, 2, 3])).toBe(true)
    expect(is.array([])).toBe(true)
    expect(is.array('string')).toBe(false)
    expect(is.array(null)).toBe(false)
  })

  it('should correctly identify bigints', () => {
    expect(is.bigint(123n)).toBe(true)
    expect(is.bigint(0n)).toBe(true)
    expect(is.bigint(123)).toBe(false)
    expect(is.bigint('123')).toBe(false)
  })

  it('should correctly identify booleans', () => {
    expect(is.boolean(true)).toBe(true)
    expect(is.boolean(false)).toBe(true)
    expect(is.boolean(1)).toBe(false)
    expect(is.boolean('true')).toBe(false)
    expect(is.boolean(null)).toBe(false)
  })

  it('should correctly identify callables', () => {
    expect(is.callable(function() {})).toBe(true)
    expect(is.callable(() => {})).toBe(true)
    expect(is.callable(class Foo {})).toBe(true)
    expect(is.callable(123)).toBe(false)
    expect(is.callable(null)).toBe(false)
  })

  it('should correctly identify callable descriptors', () => {
    expect(is.callableDescriptor({ get: function() {} })).toBe(true)
    expect(is.callableDescriptor({ set: function() {} })).toBe(true)
    expect(is.callableDescriptor({ value: function() {} })).toBe(true)
    expect(is.callableDescriptor({ value: 42 })).toBe(false)
    expect(is.callableDescriptor(123)).toBe(false)
    const object = { get name() { return 'Brie' } }
    const descriptor = Object.getOwnPropertyDescriptor(object, 'name')
    expect(is.callableDescriptor(object)).toBe(false)
    expect(is.callableDescriptor(descriptor)).toBe(true)
  })

  it('should correctly identify data descriptors', () => {
    expect(is.dataDescriptor({ value: 42, writable: true })).toBe(true)
    expect(is.dataDescriptor({ value: 42 })).toBe(true)
    expect(is.dataDescriptor({ get: () => 42, set: () => {} })).toBe(false)
    expect(is.dataDescriptor({ value: 42, get: () => 42 })).toBe(false)
    expect(is.dataDescriptor(null)).toBe(false)
  })

  it('should correctly identify property descriptors', () => {
    expect(is.descriptor({ configurable: true, enumerable: false })).toBe(true)
    expect(is.descriptor({ get: () => {}, set: () => {} })).toBe(true)
    expect(is.descriptor({ value: 42 })).toBe(true)
    expect(is.descriptor({})).toBe(false)
    expect(is.descriptor(null)).toBe(false)
  })

  it('should correctly identify strict false', () => {
    expect(is.false(false)).toBe(true)
    expect(is.false(true)).toBe(false)
    expect(is.false(0)).toBe(false)
    expect(is.false(null)).toBe(false)
  })

  it('should correctly identify falsy values', () => {
    expect(is.falsy(0)).toBe(true)
    expect(is.falsy('')).toBe(true)
    expect(is.falsy(null)).toBe(true)
    expect(is.falsy(undefined)).toBe(true)
    expect(is.falsy(false)).toBe(true)
    expect(is.falsy(1)).toBe(false)
    expect(is.falsy('hello')).toBe(false)
  })

  it('should correctly identify falsey values (alias for falsy)', () => {
    expect(is.falsey(0)).toBe(true)
    expect(is.falsey('')).toBe(true)
    expect(is.falsey(1)).toBe(false)
    expect(is.falsey('hello')).toBe(false)
  })

  it('should correctly identify functions', () => {
    expect(is.function(function() {})).toBe(true)
    expect(is.function(() => {})).toBe(true)
    expect(is.function(class Foo {})).toBe(true)
    expect(is.function(123)).toBe(false)
    expect(is.function(null)).toBe(false)
  })

  it('should correctly identify iterables', () => {
    expect(is.iterable([1, 2, 3])).toBe(true)
    expect(is.iterable('string')).toBe(true)
    expect(is.iterable(new Map())).toBe(true)
    expect(is.iterable(new Set())).toBe(true)
    expect(is.iterable(123)).toBe(false)
  })

  it('should correctly identify nullish values', () => {
    expect(is.nullish(null)).toBe(true)
    expect(is.nullish(undefined)).toBe(true)
    expect(is.nullish('value')).toBe(false)
    expect(is.nullish(0)).toBe(false)
  })

  it('should correctly identify numbers', () => {
    expect(is.number(123)).toBe(true)
    expect(is.number(0)).toBe(true)
    expect(is.number('123')).toBe(false)
    expect(is.number(null)).toBe(false)
  })

  it('should correctly identify objects', () => {
    expect(is.object({})).toBe(true)
    expect(is.object([])).toBe(true)
    expect(is.object(new Map())).toBe(true)
    expect(is.object(null)).toBe(false)
    expect(is.object(42)).toBe(false)
  })

  it('should correctly identify valid object entries', () => {
    expect(is.objectEntry(['key', 42])).toBe(true)
    expect(is.objectEntry([Symbol('id'), {}])).toBe(true)
    expect(is.objectEntry([0, 'value'])).toBe(true)
    expect(is.objectEntry([1, 2, 3])).toBe(false)
    expect(is.objectEntry([{}, 'value'])).toBe(false)
    expect(is.objectEntry('not-an-array')).toBe(false)
  })

  it('should correctly identify valid object keys', () => {
    expect(is.objectKey('name')).toBe(true)
    expect(is.objectKey(0)).toBe(true)
    expect(is.objectKey(Symbol('id'))).toBe(true)
    expect(is.objectKey({})).toBe(false)
    expect(is.objectKey(null)).toBe(false)
    expect(is.objectKey(true)).toBe(false)
  })

  it('should correctly identify primitive types', () => {
    expect(is.primitive('hello')).toBe(true)
    expect(is.primitive(123)).toBe(true)
    expect(is.primitive(true)).toBe(true)
    expect(is.primitive(123n)).toBe(true)
    expect(is.primitive(Symbol('s'))).toBe(true)
    expect(is.primitive(null)).toBe(true)
    expect(is.primitive(undefined)).toBe(true)
    expect(is.primitive({})).toBe(false)
    expect(is.primitive([])).toBe(false)
  })

  it('should correctly identify shiny values (object or function)', () => {
    expect(is.shiny({})).toBe(true)
    expect(is.shiny([])).toBe(true)
    expect(is.shiny(function() {})).toBe(true)
    expect(is.shiny(() => {})).toBe(true)
    expect(is.shiny(123)).toBe(false)
    expect(is.shiny(null)).toBe(false)
    expect(is.shiny('string')).toBe(false)
  })

  it('should correctly identify strings', () => {
    expect(is.string('hello')).toBe(true)
    expect(is.string('')).toBe(true)
    expect(is.string(123)).toBe(false)
    expect(is.string(null)).toBe(false)
  })

  it('should correctly identify symbols', () => {
    expect(is.symbol(Symbol('foo'))).toBe(true)
    expect(is.symbol(Symbol())).toBe(true)
    expect(is.symbol('foo')).toBe(false)
    expect(is.symbol(null)).toBe(false)
  })

  it('should correctly identify strict true', () => {
    expect(is.true(true)).toBe(true)
    expect(is.true(false)).toBe(false)
    expect(is.true(1)).toBe(false)
  })

  it('should correctly identify truthy values', () => {
    expect(is.truthy(1)).toBe(true)
    expect(is.truthy('hello')).toBe(true)
    expect(is.truthy({})).toBe(true)
    expect(is.truthy(0)).toBe(false)
    expect(is.truthy('')).toBe(false)
    expect(is.truthy(null)).toBe(false)
  })
})

describe('si utility functions', () => {
  describe('returns thenValue or elseValue based on condition', () => {
    it('si.a — type/class check', () => {
      expect(si.a(42, 'number', 'yes', 'no')).toBe('yes')
      expect(si.a('string', Number, 'yes', 'no')).toBe('no')
      expect(si.a(42, 'number', () => 'computed', 'no')).toBe('computed')
      expect(si.a('str', Number, 'yes', () => 'computed')).toBe('computed')
    })

    it('si.accessorDescriptor', () => {
      expect(si.accessorDescriptor({ get: () => 42 }, 'yes', 'no')).toBe('yes')
      expect(si.accessorDescriptor({ value: 42 }, 'yes', 'no')).toBe('no')
      expect(si.accessorDescriptor({ get: () => 42 }, () => 'computed', 'no')).toBe('computed')
    })

    it('si.array', () => {
      expect(si.array([1, 2, 3], 'yes', 'no')).toBe('yes')
      expect(si.array('string', 'yes', 'no')).toBe('no')
      expect(si.array([1, 2, 3], () => 'computed', 'no')).toBe('computed')
    })

    it('si.bigint', () => {
      expect(si.bigint(123n, 'yes', 'no')).toBe('yes')
      expect(si.bigint(123, 'yes', 'no')).toBe('no')
      expect(si.bigint(123n, () => 'computed', 'no')).toBe('computed')
    })

    it('si.boolean', () => {
      expect(si.boolean(true, 'yes', 'no')).toBe('yes')
      expect(si.boolean(false, 'yes', 'no')).toBe('yes')
      expect(si.boolean(1, 'yes', 'no')).toBe('no')
      expect(si.boolean(false, () => 'computed', 'no')).toBe('computed')
    })

    it('si.callable', () => {
      expect(si.callable(function() {}, 'yes', 'no')).toBe('yes')
      expect(si.callable(123, 'yes', 'no')).toBe('no')
      expect(si.callable(() => {}, () => 'computed', 'no')).toBe('computed')
    })

    it('si.callableDescriptor', () => {
      expect(si.callableDescriptor({ get: function() {} }, 'yes', 'no')).toBe('yes')
      expect(si.callableDescriptor(123, 'yes', 'no')).toBe('no')
      expect(si.callableDescriptor({ get: function() {} }, () => 'computed', 'no')).toBe('computed')
    })

    it('si.dataDescriptor', () => {
      expect(si.dataDescriptor({ value: 42, writable: true }, 'yes', 'no')).toBe('yes')
      expect(si.dataDescriptor({ get: () => 42 }, 'yes', 'no')).toBe('no')
      expect(si.dataDescriptor({ value: 42 }, () => 'computed', 'no')).toBe('computed')
    })

    it('si.descriptor', () => {
      expect(si.descriptor({ configurable: true }, 'yes', 'no')).toBe('yes')
      expect(si.descriptor({}, 'yes', 'no')).toBe('no')
      expect(si.descriptor({ get: () => {} }, () => 'computed', 'no')).toBe('computed')
    })

    it('si.false', () => {
      expect(si.false(false, 'yes', 'no')).toBe('yes')
      expect(si.false(0, 'yes', 'no')).toBe('no')
      expect(si.false(false, () => 'computed', 'no')).toBe('computed')
    })

    it('si.falsy', () => {
      expect(si.falsy(0, 'yes', 'no')).toBe('yes')
      expect(si.falsy(1, 'yes', 'no')).toBe('no')
      expect(si.falsy('', () => 'computed', 'no')).toBe('computed')
    })

    it('si.falsey (alias for falsy)', () => {
      expect(si.falsey(0, 'yes', 'no')).toBe('yes')
      expect(si.falsey(1, 'yes', 'no')).toBe('no')
      expect(si.falsey('', () => 'computed', 'no')).toBe('computed')
    })

    it('si.function', () => {
      expect(si.function(function() {}, 'yes', 'no')).toBe('yes')
      expect(si.function(123, 'yes', 'no')).toBe('no')
      expect(si.function(function() {}, () => 'computed', 'no')).toBe('computed')
    })

    it('si.iterable', () => {
      expect(si.iterable([1, 2, 3], 'yes', 'no')).toBe('yes')
      expect(si.iterable(123, 'yes', 'no')).toBe('no')
      expect(si.iterable('string', () => 'computed', 'no')).toBe('computed')
    })

    it('si.nullish', () => {
      expect(si.nullish(null, 'yes', 'no')).toBe('yes')
      expect(si.nullish(undefined, 'yes', 'no')).toBe('yes')
      expect(si.nullish('value', 'yes', 'no')).toBe('no')
      expect(si.nullish(undefined, () => 'computed', 'no')).toBe('computed')
    })

    it('si.number', () => {
      expect(si.number(123, 'yes', 'no')).toBe('yes')
      expect(si.number('123', 'yes', 'no')).toBe('no')
      expect(si.number(123, () => 'computed', 'no')).toBe('computed')
    })

    it('si.object', () => {
      expect(si.object({}, 'yes', 'no')).toBe('yes')
      expect(si.object(null, 'yes', 'no')).toBe('no')
      expect(si.object({}, () => 'computed', 'no')).toBe('computed')
    })

    it('si.objectEntry', () => {
      expect(si.objectEntry(['key', 42], 'yes', 'no')).toBe('yes')
      expect(si.objectEntry([1, 2, 3], 'yes', 'no')).toBe('no')
      expect(si.objectEntry(['key', 42], () => 'computed', 'no')).toBe('computed')
    })

    it('si.objectKey', () => {
      expect(si.objectKey('name', 'yes', 'no')).toBe('yes')
      expect(si.objectKey(0, 'yes', 'no')).toBe('yes')
      expect(si.objectKey(Symbol('id'), 'yes', 'no')).toBe('yes')
      expect(si.objectKey({}, 'yes', 'no')).toBe('no')
      expect(si.objectKey(null, 'yes', 'no')).toBe('no')
      expect(si.objectKey(Symbol('id'), () => 'computed', 'no')).toBe('computed')
    })

    it('si.primitive', () => {
      expect(si.primitive('hello', 'yes', 'no')).toBe('yes')
      expect(si.primitive(123, 'yes', 'no')).toBe('yes')
      expect(si.primitive({}, 'yes', 'no')).toBe('no')
      expect(si.primitive(123, () => 'computed', 'no')).toBe('computed')
    })

    it('si.shiny', () => {
      expect(si.shiny({}, 'yes', 'no')).toBe('yes')
      expect(si.shiny(123, 'yes', 'no')).toBe('no')
      expect(si.shiny(function() {}, () => 'computed', 'no')).toBe('computed')
    })

    it('si.string', () => {
      expect(si.string('hello', 'yes', 'no')).toBe('yes')
      expect(si.string(123, 'yes', 'no')).toBe('no')
      expect(si.string('hello', () => 'computed', 'no')).toBe('computed')
    })

    it('si.symbol', () => {
      expect(si.symbol(Symbol('foo'), 'yes', 'no')).toBe('yes')
      expect(si.symbol('foo', 'yes', 'no')).toBe('no')
      expect(si.symbol(Symbol('foo'), () => 'computed', 'no')).toBe('computed')
    })

    it('si.then — evaluates a boolean or function condition', () => {
      expect(si.then(true, 'yes', 'no')).toBe('yes')
      expect(si.then(false, 'yes', 'no')).toBe('no')
      expect(si.then(() => true, 'yes', 'no')).toBe('yes')
      expect(si.then(() => false, 'yes', 'no')).toBe('no')
      expect(si.then(true, () => 'computed', 'no')).toBe('computed')
      expect(si.then(false, 'yes', () => 'computed')).toBe('computed')
    })

    it('si.true', () => {
      expect(si.true(true, 'yes', 'no')).toBe('yes')
      expect(si.true(false, 'yes', 'no')).toBe('no')
      expect(si.true(1, 'yes', 'no')).toBe('no')
      expect(si.true(true, () => 'computed', 'no')).toBe('computed')
    })

    it('si.truthy', () => {
      expect(si.truthy(1, 'yes', 'no')).toBe('yes')
      expect(si.truthy(0, 'yes', 'no')).toBe('no')
      expect(si.truthy('hello', () => 'computed', 'no')).toBe('computed')
    })

    it('si.undefined', () => {
      expect(si.undefined(undefined, 'yes', 'no')).toBe('yes')
      expect(si.undefined('value', 'yes', 'no')).toBe('no')
      expect(si.undefined(undefined, () => 'computed', 'no')).toBe('computed')
      expect(si.undefined('value', 'yes', () => 'computed')).toBe('computed')
    })
  })

  describe('thenValue defaults to the condition result when omitted', () => {
    it('returns the condition boolean when only value is passed', () => {
      expect(si.string('hello')).toBe(true)
      expect(si.string(123)).toBe(false)
      expect(si.number(42)).toBe(true)
      expect(si.number('42')).toBe(false)
    })
  })
})

describe('has utility functions', () => {
  it('should correctly identify if an object has a key', () => {
    expect(has(new Map([['key', 'value']]), 'key')).toBe(true)
    expect(has({}, 'key')).toBe(false)
  })

  it('should correctly identify if an object has all keys', () => {
    expect(has.all(new Map([['key1', 'value1'], ['key2', 'value2']]), ['key1', 'key2'])).toBe(true)
    expect(has.all({}, ['key1', 'key2'])).toBe(false)
  })

  it('should correctly identify if an object has some keys', () => {
    expect(has.some(new Map([['key1', 'value1'], ['key2', 'value2']]), ['key1'])).toBe(true)
    expect(has.some({}, ['key1', 'key2'])).toBe(false)
  })

  it('should correctly identify if an object has a prototype', () => {
    expect(has.prototype(function() {})).toBe(true)
    expect(has.prototype(() => {})).toBe(false)
    expect(has.prototype(5)).toBe(false)
  })

  it('should correctly identify if an object has a custom string tag', () => {
    const obj = { [Symbol.toStringTag]: 'CustomObject' }
    expect(has.stringTag(obj)).toBe(true)
    expect(has.stringTag({})).toBe(false)
  })

  it('should correctly identify if an object has a custom toPrimitive method', () => {
    const obj = { [Symbol.toPrimitive]: () => 42 }
    expect(has.toPrimitive(obj)).toBe(true)
    expect(has.toPrimitive({})).toBe(false)
  })

  it('should correctly identify if an object has a custom valueOf method', () => {
    const obj = { valueOf: () => 42 }
    expect(has.valueOfFn(obj)).toBe(true)
    expect(has.valueOfFn({})).toBe(false)
  })
})

describe('as utility functions', () => {
  it('should correctly convert values to arrays', () => {
    expect(as.array([1, 2, 3])).toEqual([1, 2, 3])
    expect(as.array('string')).toEqual(['s', 't', 'r', 'i', 'n', 'g'])
    expect(as.array(123)).toBe(undefined)
  })

  it('should correctly convert values to objects', () => {
    expect(as.object({ key: 'value' })).toEqual({ key: 'value' })
    expect(typeof as.object('string')).toBe('object')
    expect(as.object(null)).toEqual({})
  })

  it('should correctly convert values to strings', () => {
    expect(as.string(null)).toBe('null')
    expect(as.string(123)).toBe('123')
    const obj = { [Symbol.toPrimitive]: () => 'custom' }
    expect(as.string(obj)).toBe('custom')
    expect(as.string(Symbol('mySymbol'), { description: true })).toBe('mySymbol')
    expect(as.string([], { stringTag: true })).toBe('')
  })

  it('should correctly convert values to integer strings', () => {
    expect(as.integerString(123.456)).toBe('123')
    expect(as.integerString('0.789')).toBe('0')
  })

  it('should correctly convert values to number strings', () => {
    expect(as.numberString('  123.456abc  ')).toBe('123.456')
    expect(as.numberString('-0.789xyz')).toBe('-0.789')
  })

  it('should correctly convert values to numbers', () => {
    expect(as.number('123.456abc')).toBe(123.456)
    expect(as.number('-0.789xyz')).toBe(-0.789)
  })

  it('should correctly convert values to bigints', () => {
    expect(as.bigint('123.456abc')).toBe(123n)
    expect(as.bigint('0.789xyz')).toBe(0n)
  })

  it('should correctly convert values to booleans', () => {
    expect(as.boolean('yes')).toBe(true)
    expect(as.boolean('no')).toBe(false)
    expect(as.boolean(1)).toBe(true)
    expect(as.boolean(0)).toBe(false)
    expect(as.boolean('true')).toBe(true)
    expect(as.boolean('false')).toBe(false)
    expect(as.boolean({})).toBe(true)
    expect(as.boolean(null)).toBe(false)
  })
})
