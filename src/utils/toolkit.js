const map = new Map([
  ['object', Object],       [Object, 'object'],       ['Object', Object],
  ['number', Number],       [Number, 'number'],       ['Number', Number],
  ['string', String],       [String, 'string'],       ['String', String],
  ['function', Function],   [Function, 'function'],   ['Function', Function],
  ['boolean', Boolean],     [Boolean, 'boolean'],     ['Boolean', Boolean],
  ['bigint', BigInt],       [BigInt, 'bigint'],       ['BigInt', BigInt],
  ['symbol', Symbol],       [Symbol, 'symbol'],       ['Symbol', Symbol],
  ['undefined', undefined], [undefined, 'undefined'],
  ['null', null],           [null, 'null'],
])

/**
 * Utility functions to check the type and properties of a value.
 */
export const is = {
  /**
   * Checks if a value matches a specified type or class.
   *
   * This function determines if the provided value matches the specified
   * type or class. It supports both primitive types and class constructors.
   *
   * @param {*} value - The value to check.
   * @param {*} typeOrClass - The type or class to compare against.
   * @param {boolean} [alreadyReversed=false] - Internal flag to prevent
   *   infinite recursion. Not intended for external use.
   * @returns {boolean} True if the value matches the type or class,
   *   false otherwise.
   *
   * @example
   * // Returns true
   * is.a(42, 'number')
   *
   * @example
   * // Returns true
   * is.a(new Date(), Date)
   *
   * @example
   * // Returns false
   * is.a('string', Number)
   */
  a(value, typeOrClass, alreadyReversed = false) {
    const valueType = typeof value
    const valueTag = this.object(value) && value[Symbol.toStringTag]

    if (value === typeOrClass)
      return true

    if (this.function(typeOrClass)) {
      const typeTag = this.object(typeOrClass) && typeOrClass[Symbol.toStringTag]

      if (valueTag && valueTag === typeOrClass.name)
        return true

      if (typeOrClass?.prototype && value instanceof typeOrClass)
        return true

      return map.get(valueType) === typeOrClass
    }

    else if (map.get(valueType)?.name === typeOrClass)
      return true

    else if (valueType === typeOrClass || valueTag === typeOrClass)
      return true

    return false
  },

  /**
   * Check if a value is an accessor descriptor.
   *
   * An accessor descriptor is an object that describes the configuration of a
   * property on an object, specifically focusing on the 'get' and 'set'
   * attributes. Computed accessor descriptors are invalid if they also have
   * a `value` and/or `writable` property.
   *
   * @param value The value to check.
   * @returns True if the value is an accessor descriptor, false otherwise.
   *
   * @example
   * // Returns true
   * is.accessorDescriptor({ get: () => 42, set: () => {} });
   *
   * // Returns false
   * is.accessorDescriptor({ value: 42, writable: true });
   */
  accessorDescriptor(value) {
    return (
      this.descriptor(value) &&
      (value?.get || value?.set) &&
      value?.writable === undefined &&
      value?.value === undefined
    );
  },

  /**
   * Check if a value is an array.
   *
   * @param value The value to check.
   * @returns True if the value is an array, false otherwise.
   *
   * @example
   * is.array([1, 2, 3]); // true
   * is.array('string'); // false
   */
  array(value) {
    return Array.isArray(value);
  },

  /**
   * Check if a value is a bigint.
   *
   * @param value The value to check.
   * @returns True if the value is a bigint, false otherwise.
   *
   * @example
   * is.bigint(123n); // true
   * is.bigint(123); // false
   */
  bigint(value) {
    return typeof value === "bigint" || value instanceof globalThis?.BigInt;
  },

  /**
   * Checks if a value is strictly a boolean (true or false).
   *
   * This method verifies if the provided value is either `true` or `false`.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is a boolean, false otherwise.
   *
   * @example
   * is.boolean(true); // true
   * is.boolean(false); // true
   * is.boolean(1); // false
   * is.boolean("true"); // false
   */
  boolean(value) {
    return [true, false].some(bool => bool === value)
  },

  /**
   * Check if an object is callable. This function is more or less a
   * synonym or alias for `is.function()`.
   *
   * @param object The object to check.
   * @returns True if the object is callable, false otherwise.
   *
   * @note if you wish to know if a descriptor has a callable `value`,
   * `get`, or `set` function, use `is.callableDescriptor` instead.
   *
   * @example
   * is.callable(function() {}); // true
   */
  callable(object) {
    return this.function(object);
  },

  /**
   * Check if an object is callable. It looks to see if the object
   * represents a descriptor that is callable by checking object
   * properties named `value`, `get`, and `set`. If any three variations
   * yields a function type, true is returned.
   *
   * @param object The object to check.
   * @returns True if the object is callable, false otherwise.
   *
   * @example
   * is.callable({ get: function() {} }); // true
   * is.callable(123); // false
   *
   * // Note the differences between these
   * const object = { get name() { return "Brie"; } };
   * const descriptor = Object.getOwnPropertyDescriptor(object, 'name');
   * is.callable(object); // false
   * is.callable(descriptor); // true
   */
  callableDescriptor(object) {
    const { value, get, set } = this.shiny(object) ? object : {};
    return [value, get, set].some((val) => this.function(val));
  },

  /**
   * Check if a value is a data property descriptor.
   *
   * A data descriptor is an object that describes the configuration of a
   * property on an object, specifically focusing on the 'value' and
   * 'writable' attributes. The descriptor is invalid if it contains
   * thew accessor descriptors `get` or `set`.
   *
   * @param value The value to check.
   * @returns True if the value is a data descriptor, false otherwise.
   *
   * @example
   * // Returns true
   * is.dataDescriptor({ value: 42, writable: true });
   *
   * // Returns false
   * is.dataDescriptor({ get: () => 42, set: () => {} });
   */
  dataDescriptor(value) {
    return (
      this.descriptor(value) &&
      (value?.value || value?.writable) &&
      value?.get === undefined &&
      value?.set === undefined
    );
  },

  /**
   * Check if a value is a property descriptor.
   *
   * A property descriptor is an object that describes the configuration of a
   * property on an object. This function checks if the provided value is an
   * object and contains any of the standard property descriptor keys.
   *
   * @param value The value to check.
   * @returns True if the value is a property descriptor, false otherwise.
   *
   * @example
   * is.descriptor({ configurable: true, enumerable: false }); // true
   * is.descriptor({ get: () => {}, set: () => {} }); // true
   * is.descriptor({}); // false
   */
  descriptor(value) {
    if (!is.object(value)) {
      return false;
    }


    const _has = (key) => Reflect.has(value, key);
    const hasBase = ["configurable", "enumerable"].some((key) => _has(key));
    const hasData = ["value", "writable"].some((key) => _has(key));
    const hasAccess = ["get", "set"].some((key) => _has(key));
    return hasBase || hasData || hasAccess;
  },

  /**
   * Checks if a value is strictly false.
   *
   * This method verifies if the provided value is strictly `false`.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is strictly false, false otherwise.
   *
   * @example
   * is.false(false); // true
   * is.false(true); // false
   * is.false(0); // false
   */
  false(value) {
    return value === false
  },

  /**
   * Checks if a value is falsy.
   *
   * This method converts the provided value to a boolean and returns
   * `true` if the value is falsy (i.e., false, 0, "", null, undefined,
   * or NaN).
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is falsy, false otherwise.
   *
   * @example
   * is.falsy(0); // true
   * is.falsy(""); // true
   * is.falsy(1); // false
   * is.falsy("hello"); // false
   */
  falsy(value) {
    return !!!value
  },

  /**
   * Alias for the `falsy` method.
   *
   * This method is an alias for `is.falsy` and performs the same check.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is falsy, false otherwise.
   *
   * @example
   * is.falsey(0); // true
   * is.falsey(""); // true
   * is.falsey(1); // false
   * is.falsey("hello"); // false
   */
  falsey(value) {
    return this.falsy(value)
  },

  /**
   * Check if a value is a function.
   *
   * @param value The value to check.
   * @returns True if the value is a function, false otherwise.
   *
   * @example
   * is.function(function() {}); // true
   * is.function(123); // false
   */
  function(value) {
    return typeof value === "function" || value instanceof Function;
  },

  /**
   * Check if a value is iterable. Depending on the environment, JavaScript
   * will permit `'string'[Symbol.iterator]()` whereas in some places, you
   * will need to wrap string in an object first. Since other JSVM provided
   * environments may or may not be leniant with this, we play it safe by
   * implicitly object converting values before checking for the symbol. If
   * a value is already an object, it will simply be passed through.
   *
   * @param value The value to check.
   * @returns True if the value is iterable, false otherwise.
   *
   * @example
   * is.iterable([1, 2, 3]); // true
   * is.iterable('string'); // true
   * is.iterable(123); // false
   */
  iterable(value) {
    const object = Object(value);
    return object && Reflect.has(object, Symbol.iterator);
  },

  /**
   * Check if a value is null or undefined.
   *
   * @param value The value to check.
   * @returns True if the value is null or undefined, false otherwise.
   *
   * @example
   * is.nullish(null); // true
   * is.nullish(undefined); // true
   * is.nullish('value'); // false
   */
  nullish(value) {
    return value === null || value === undefined;
  },

  /**
   * Check if a value is a number.
   *
   * @param value The value to check.
   * @returns True if the value is a number, false otherwise.
   *
   * @example
   * is.number(123); // true
   * is.number('123'); // false
   */
  number(value) {
    return typeof value === "number" || value instanceof Number;
  },

  /**
   * Check if a value is an object.
   *
   * @param value The value to check.
   * @returns True if the value is an object, false otherwise.
   *
   * @example
   * is.object({}); // true
   * is.object(null); // false
   */
  object(value) {
    return !!(value && typeof value === "object");
  },

  /**
   * Check if a value is a primitive type.
   *
   * This function determines if the provided value is one of the JavaScript
   * primitive types: string, number, boolean, bigint, or symbol.
   *
   * @param value The value to check.
   * @returns True if the value is a primitive type, false otherwise.
   *
   * @example
   * // Returns true
   * is.primitive('hello');
   *
   * // Returns true
   * is.primitive(123);
   *
   * // Returns true
   * is.primitive(true);
   *
   * // Returns true
   * is.primitive(123n);
   *
   * // Returns true
   * is.primitive(Symbol('symbol'));
   *
   * // Returns false
   * is.primitive({});
   *
   * // Returns false
   * is.primitive([]);
   */
  primitive(value) {
    if (this.nullish(value))
      return true

    return ["string", "number", "boolean", "bigint", "symbol"].some(
      (type) => typeof value === type
    );
  },

  /**
   * The use of `typeof` is not a safe guarantor when it comes to Reflect
   * supported values. Any non-null value that returns a `typeof` either
   * `object` or `function` should suffice. Note that arrays return 'object'
   * when run through `typeof`. Shiny is clearly a reference to something
   * reflective and is much shorter to type. Also, Mal says shiny. :)
   *
   * @param value The value to check.
   * @returns True if the value is an object or a function, false otherwise.
   *
   * @example
   * is.shiny({}); // true
   * is.shiny(function() {}); // true
   * is.shiny(123); // false
   */
  shiny(value) {
    return !!(this.object(value) || this.function(value));
  },

  /**
   * Check if a value is a string.
   *
   * @param value The value to check.
   * @returns True if the value is a string, false otherwise.
   *
   * @example
   * is.string('hello'); // true
   * is.string(123); // false
   */
  string(value) {
    return typeof value === "string" || value instanceof String;
  },

  /**
   * Checks if a value is a symbol.
   *
   * This function determines whether the provided value is of type
   * 'symbol' or an instance of the Symbol object.
   *
   * @param value - The value to check.
   * @returns True if the value is a symbol, false otherwise.
   *
   * @example
   * is.symbol(Symbol('foo')); // Returns true
   * is.symbol('foo'); // Returns false
   */
  symbol(value) {
    return typeof value === "symbol" || value instanceof Symbol;
  },

  /**
   * Checks if a value is strictly true.
   *
   * This method verifies if the provided value is strictly `true`.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is strictly true, false otherwise.
   *
   * @example
   * is.true(true); // true
   * is.true(false); // false
   * is.true(1); // false
   */
  true(value) {
    return value === true
  },

  /**
   * Checks if a value is truthy.
   *
   * This method converts the provided value to a boolean and returns
   * `true` if the value is truthy (i.e., not false, 0, "", null, undefined,
   * or NaN).
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is truthy, false otherwise.
   *
   * @example
   * is.truthy(1); // true
   * is.truthy("hello"); // true
   * is.truthy(0); // false
   * is.truthy(""); // false
   */
  truthy(value) {
    return !!value
  },
};

export const si = {
  /**
   * Checks if a value matches a specified type or class.
   *
   * This function determines if the provided value matches the specified
   * type or class. It supports both primitive types and class constructors.
   *
   * @param {*} value - The value to check.
   * @param {*} typeOrClass - The type or class to compare against.
   * @param {boolean} [alreadyReversed=false] - Internal flag to prevent
   *   infinite recursion. Not intended for external use.
   * @returns {boolean} True if the value matches the type or class,
   *   false otherwise.
   *
   * @example
   * // Returns true
   * is.a(42, 'number')
   *
   * @example
   * // Returns true
   * is.a(new Date(), Date)
   *
   * @example
   * // Returns false
   * is.a('string', Number)
   */
  a(value, typeOrClass, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.a(value, typeOrClass) ? thenValue : elseValue
  },

  /**
   * Check if a value is an accessor descriptor.
   *
   * An accessor descriptor is an object that describes the configuration of a
   * property on an object, specifically focusing on the 'get' and 'set'
   * attributes. Computed accessor descriptors are invalid if they also have
   * a `value` and/or `writable` property.
   *
   * @param value The value to check.
   * @returns True if the value is an accessor descriptor, false otherwise.
   *
   * @example
   * // Returns true
   * is.accessorDescriptor({ get: () => 42, set: () => {} });
   *
   * // Returns false
   * is.accessorDescriptor({ value: 42, writable: true });
   */
  accessorDescriptor(value, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.accessorDescriptor(value) ? thenVal : elseVal
  },

  /**
   * Check if a value is an array.
   *
   * @param value The value to check.
   * @returns True if the value is an array, false otherwise.
   *
   * @example
   * is.array([1, 2, 3]); // true
   * is.array('string'); // false
   */
  array(value, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.array(value) ? thenVal : elseVal

  },

  /**
   * Check if a value is a bigint.
   *
   * @param value The value to check.
   * @returns True if the value is a bigint, false otherwise.
   *
   * @example
   * is.bigint(123n); // true
   * is.bigint(123); // false
   */
  bigint(value, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.bigint(value) ? thenVal : elseVal
  },

  /**
   * Checks if a value is strictly a boolean (true or false).
   *
   * This method verifies if the provided value is either `true` or `false`.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is a boolean, false otherwise.
   *
   * @example
   * is.boolean(true); // true
   * is.boolean(false); // true
   * is.boolean(1); // false
   * is.boolean("true"); // false
   */
  boolean(value, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.boolean(value) ? thenVal : elseVal
  },

  /**
   * Check if an object is callable. This function is more or less a
   * synonym or alias for `is.function()`.
   *
   * @param object The object to check.
   * @returns True if the object is callable, false otherwise.
   *
   * @note if you wish to know if a descriptor has a callable `value`,
   * `get`, or `set` function, use `is.callableDescriptor` instead.
   *
   * @example
   * is.callable(function() {}); // true
   */
  callable(object, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.callable(object) ? thenVal : elseVal
  },

  /**
   * Check if an object is callable. It looks to see if the object
   * represents a descriptor that is callable by checking object
   * properties named `value`, `get`, and `set`. If any three variations
   * yields a function type, true is returned.
   *
   * @param object The object to check.
   * @returns True if the object is callable, false otherwise.
   *
   * @example
   * is.callable({ get: function() {} }); // true
   * is.callable(123); // false
   *
   * // Note the differences between these
   * const object = { get name() { return "Brie"; } };
   * const descriptor = Object.getOwnPropertyDescriptor(object, 'name');
   * is.callable(object); // false
   * is.callable(descriptor); // true
   */
  callableDescriptor(object, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.callableDescriptor(object) ? thenVal : elseVal
  },

  /**
   * Check if a value is a data property descriptor.
   *
   * A data descriptor is an object that describes the configuration of a
   * property on an object, specifically focusing on the 'value' and
   * 'writable' attributes. The descriptor is invalid if it contains
   * thew accessor descriptors `get` or `set`.
   *
   * @param value The value to check.
   * @returns True if the value is a data descriptor, false otherwise.
   *
   * @example
   * // Returns true
   * is.dataDescriptor({ value: 42, writable: true });
   *
   * // Returns false
   * is.dataDescriptor({ get: () => 42, set: () => {} });
   */
  dataDescriptor(value, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.dataDescriptor(value) ? thenVal : elseVal
  },

  /**
   * Check if a value is a property descriptor.
   *
   * A property descriptor is an object that describes the configuration of a
   * property on an object. This function checks if the provided value is an
   * object and contains any of the standard property descriptor keys.
   *
   * @param value The value to check.
   * @returns True if the value is a property descriptor, false otherwise.
   *
   * @example
   * is.descriptor({ configurable: true, enumerable: false }); // true
   * is.descriptor({ get: () => {}, set: () => {} }); // true
   * is.descriptor({}); // false
   */
  descriptor(value, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.descriptor(value) ? thenVal : elseVal
  },

  /**
   * Checks if a value is strictly false.
   *
   * This method verifies if the provided value is strictly `false`.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is strictly false, false otherwise.
   *
   * @example
   * is.false(false); // true
   * is.false(true); // false
   * is.false(0); // false
   */
  false(value, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.false(value) ? thenVal : elseVal
  },

  /**
   * Checks if a value is falsy.
   *
   * This method converts the provided value to a boolean and returns
   * `true` if the value is falsy (i.e., false, 0, "", null, undefined,
   * or NaN).
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is falsy, false otherwise.
   *
   * @example
   * is.falsy(0); // true
   * is.falsy(""); // true
   * is.falsy(1); // false
   * is.falsy("hello"); // false
   */
  falsy(value, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.falsy(value) ? thenVal : elseVal
  },

  /**
   * Alias for the `falsy` method.
   *
   * This method is an alias for `is.falsy` and performs the same check.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is falsy, false otherwise.
   *
   * @example
   * is.falsey(0); // true
   * is.falsey(""); // true
   * is.falsey(1); // false
   * is.falsey("hello"); // false
   */
  falsey(value, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.falsey(value) ? thenVal : elseVal
  },

  /**
   * Check if a value is a function.
   *
   * @param value The value to check.
   * @returns True if the value is a function, false otherwise.
   *
   * @example
   * is.function(function() {}); // true
   * is.function(123); // false
   */
  function(value, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.function(value) ? thenVal : elseVal
  },

  /**
   * Check if a value is iterable. Depending on the environment, JavaScript
   * will permit `'string'[Symbol.iterator]()` whereas in some places, you
   * will need to wrap string in an object first. Since other JSVM provided
   * environments may or may not be leniant with this, we play it safe by
   * implicitly object converting values before checking for the symbol. If
   * a value is already an object, it will simply be passed through.
   *
   * @param value The value to check.
   * @returns True if the value is iterable, false otherwise.
   *
   * @example
   * is.iterable([1, 2, 3]); // true
   * is.iterable('string'); // true
   * is.iterable(123); // false
   */
  iterable(value, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.iterable(value) ? thenVal : elseVal
  },

  /**
   * Check if a value is null or undefined.
   *
   * @param value The value to check.
   * @returns True if the value is null or undefined, false otherwise.
   *
   * @example
   * is.nullish(null); // true
   * is.nullish(undefined); // true
   * is.nullish('value'); // false
   */
  nullish(value, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.nullish(value) ? thenVal : elseVal
  },

  /**
   * Check if a value is a number.
   *
   * @param value The value to check.
   * @returns True if the value is a number, false otherwise.
   *
   * @example
   * is.number(123); // true
   * is.number('123'); // false
   */
  number(value, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.number(value) ? thenVal : elseVal
  },

  /**
   * Check if a value is an object.
   *
   * @param value The value to check.
   * @returns True if the value is an object, false otherwise.
   *
   * @example
   * is.object({}); // true
   * is.object(null); // false
   */
  object(value, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.object(value) ? thenVal : elseVal
  },

  /**
   * Check if a value is a primitive type.
   *
   * This function determines if the provided value is one of the JavaScript
   * primitive types: string, number, boolean, bigint, or symbol.
   *
   * @param value The value to check.
   * @returns True if the value is a primitive type, false otherwise.
   *
   * @example
   * // Returns true
   * is.primitive('hello');
   *
   * // Returns true
   * is.primitive(123);
   *
   * // Returns true
   * is.primitive(true);
   *
   * // Returns true
   * is.primitive(123n);
   *
   * // Returns true
   * is.primitive(Symbol('symbol'));
   *
   * // Returns false
   * is.primitive({});
   *
   * // Returns false
   * is.primitive([]);
   */
  primitive(value, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.primitive(value) ? thenVal : elseVal
  },

  /**
   * The use of `typeof` is not a safe guarantor when it comes to Reflect
   * supported values. Any non-null value that returns a `typeof` either
   * `object` or `function` should suffice. Note that arrays return 'object'
   * when run through `typeof`. Shiny is clearly a reference to something
   * reflective and is much shorter to type. Also, Mal says shiny. :)
   *
   * @param value The value to check.
   * @returns True if the value is an object or a function, false otherwise.
   *
   * @example
   * is.shiny({}); // true
   * is.shiny(function() {}); // true
   * is.shiny(123); // false
   */
  shiny(value, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.shiny(value) ? thenVal : elseVal
  },

  /**
   * Check if a value is a string.
   *
   * @param value The value to check.
   * @returns True if the value is a string, false otherwise.
   *
   * @example
   * is.string('hello'); // true
   * is.string(123); // false
   */
  string(value, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.string(value) ? thenVal : elseVal
  },

  /**
   * Checks if a value is a symbol.
   *
   * This function determines whether the provided value is of type
   * 'symbol' or an instance of the Symbol object.
   *
   * @param value - The value to check.
   * @returns True if the value is a symbol, false otherwise.
   *
   * @example
   * is.symbol(Symbol('foo')); // Returns true
   * is.symbol('foo'); // Returns false
   */
  symbol(value, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.symbol(value) ? thenVal : elseVal
  },

  then(condition, thenValue, elseValue) {
    const condVal = is.function(condition) ? condition() : condition
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return condVal ? thenVal : elseVal
  },

  /**
   * Checks if a value is strictly true.
   *
   * This method verifies if the provided value is strictly `true`.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is strictly true, false otherwise.
   *
   * @example
   * is.true(true); // true
   * is.true(false); // false
   * is.true(1); // false
   */
  true(value, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.true(value) ? thenVal : elseVal
  },

  /**
   * Checks if a value is truthy.
   *
   * This method converts the provided value to a boolean and returns
   * `true` if the value is truthy (i.e., not false, 0, "", null, undefined,
   * or NaN).
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is truthy, false otherwise.
   *
   * @example
   * is.truthy(1); // true
   * is.truthy("hello"); // true
   * is.truthy(0); // false
   * is.truthy(""); // false
   */
  truthy(value, thenValue, elseValue) {
    const thenVal = is.function(thenValue) ? thenValue() : thenValue
    const elseVal = is.function(elseValue) ? elseValue() : elseValue
    return is.truthy(value) ? thenVal : elseVal
  },
};

/**

 * Checks if an object contains a specific key.
 *
 * This function determines if the provided object contains the specified key.
 * It supports various types of objects including Map, Set, WeakMap, and
 * WeakSet. For other objects, it uses the Reflect API to check for the key.
 *
 * @param object The object to check.
 * @param key The key to look for in the object.
 * @returns True if the object contains the key, false otherwise.
 *
 * @example
 * // Returns true
 * has(new Map([['key', 'value']]), 'key');
 *
 * @example
 * // Returns false
 * has({}, 'key');
 */
export const has = function has(object, key) {
  if ([Map, Set, WeakMap, WeakSet].some((i) => object instanceof i)) {
    return object.has(key);
  }

  return is.shiny(object) && Reflect.has(object, key);
};

Object.assign(has, {
  /**
   * Checks if an object contains all specified keys.
   *
   * This function determines if the provided object contains all the keys
   * specified in the keys array. It supports various types of objects
   * including Map, Set, WeakMap, and WeakSet. For other objects, it uses
   * the Reflect API to check for the keys.
   *
   * @param object The object to check.
   * @param keys The array of keys to look for in the object.
   * @returns True if the object contains all the keys, false otherwise.
   *
   * @example
   * // Returns true
   * has.all(new Map([
   *   ['key1', 'value1'], ['key2', 'value2']
   * ]), ['key1', 'key2']);
   *
   * @example
   * // Returns false
   * has.all({}, ['key1', 'key2']);
   */
  all(object, keys) {
    if (!is.shiny(object) || !is.array(keys) || !keys.length) {
      return false;
    }

    return keys.every((key) => has(object, key));
  },

  /**
   * Checks if an object contains at least one of the specified keys.
   *
   * This function determines if the provided object contains at least one
   * of the keys specified in the keys array. It supports various types of
   * objects including Map, Set, WeakMap, and WeakSet. For other objects,
   * it uses the Reflect API to check for the keys.
   *
   * @param object The object to check.
   * @param keys The array of keys to look for in the object.
   * @returns True if the object contains at least one of the keys, false
   * otherwise.
   *
   * @example
   * // Returns true
   * has.some(new Map([['key1', 'value1'], ['key2', 'value2']]), ['key1']);
   *
   * @example
   * // Returns false
   * has.some({}, ['key1', 'key2']);
   */
  some(object, keys) {
    if (!is.shiny(object) || !is.array(keys) || !keys.length) {
      return false;
    }

    return keys.some((key) => has(object, key));
  },

  /**
   * Checks if an object has a 'prototype' property.
   *
   * This function is one way to determine if a supplied function is a big
   * arrow function or not. Regular functions and class functions, both
   * static and instance level, all have prototypes. Only big arrow functions
   * do not.
   *
   * @param {Object} object - The object to check.
   * @returns {boolean} True if the object has a 'prototype' property,
   * false otherwise.
   *
   * @example
   * // Returns true
   * has.prototype(function() {})
   *
   * @example
   * // Returns false
   * has.prototype(() => {})
   * has.prototype(5)
   * has.prototype(true)
   */
  prototype(object) {
    // Shiny objects work with calls to Reflect.has
    return is.shiny(object) && has(object, 'prototype')
  },

  /**
   * Checks if an object has a custom string tag.
   *
   * This method determines if the object has a Symbol.toStringTag property,
   * which is used to customize the behavior of Object.prototype.toString().
   *
   * @param object - The object to check.
   * @returns True if the object has a custom string tag, false otherwise.
   *
   * @example
   * const obj = { [Symbol.toStringTag]: 'CustomObject' };
   * has.stringTag(obj); // Returns true
   */
  stringTag(object) {
    return is.object(object) && has(object, Symbol.toStringTag);
  },

  /**
   * Checks if an object has a custom toPrimitive method.
   *
   * This method determines if the object has a Symbol.toPrimitive property,
   * which is used to convert an object to a primitive value.
   *
   * @param object - The object to check.
   * @returns True if the object has a custom toPrimitive method,
   * false otherwise.
   *
   * @example
   * const obj = { [Symbol.toPrimitive]: () => 42 };
   * has.toPrimitive(obj); // Returns true
   */
  toPrimitive(object) {
    return is.object(object) && has(object, Symbol.toPrimitive);
  },

  /**
   * Checks if an object has a custom valueOf method.
   *
   * This method determines if the object has a valueOf property that is a
   * function, which is used to convert an object to a primitive value.
   *
   * @param object - The object to check.
   * @returns True if the object has a custom valueOf method, false otherwise.
   *
   * @example
   * const obj = { valueOf: () => 42 };
   * has.valueOf(obj); // Returns true
   */
  valueOfFn(object) {
    return (
      is.object(object) && has(object, "valueOf") && is.function(object.valueOf)
    );
  },
});

export const as = {
  /**
   * Converts a value to an array if it is iterable.
   *
   * @param value The value to convert.
   * @returns The converted array if the value is iterable, otherwise undefined.
   *
   * @example
   * // Returns [1, 2, 3]
   * as.array([1, 2, 3]);
   *
   * @example
   * // Returns ['s', 't', 'r', 'i', 'n', 'g']
   * as.array('string');
   *
   * @example
   * // Returns undefined
   * as.array(123);
   */
  array(value) {
    return (is.iterable(value) && Array.from(value)) || undefined;
  },

  /**
   * Converts a value to an object. If the supplied value is a primitive
   * value, in many cases, this will convert it to an object instance of
   * that type. Numbers, strings, symbols, and big integers, all have
   * object instance variants. Wrapping them in a call to `Object()` will
   * convert the primitive into this instance variant.
   *
   * @param value The value to convert.
   * @returns The converted object.
   *
   * @example
   * // Returns { key: 'value' }
   * as.object({ key: 'value' });
   *
   * @example
   * // String instance as oppposed to primitive string
   * typeof as.object('string') // 'object'
   * as.object('string') instanceof String // true
   * 'string' instanceof String // false
   *
   * @example
   * // Returns {}
   * as.object(null);
   */
  object(value) {
    return Object(value);
  },

  /**
   * Converts a given value to a string. This function handles various types
   * of values, including null, undefined, objects with custom
   * [Symbol.toPrimitive] methods, and objects with toString or valueOf
   * methods.
   *
   * @param value The value to convert to a string.
   * @param use Optional configuration object:
   *        - description: If true, returns the description of a Symbol.
   *        - stringTag: If true, returns the [Symbol.toStringTag] value if present.
   * @returns The string representation of the value.
   *
   * @example
   * // Returns 'null'
   * as.string(null);
   *
   * @example
   * // Returns '123'
   * as.string(123);
   *
   * @example
   * // Returns 'custom'
   * const obj = {
   *   [Symbol.toPrimitive](hint) {
   *     if (hint === 'string') return 'custom';
   *     return null;
   *   }
   * };
   * as.string(obj);
   *
   * @example
   * // Returns 'mySymbol'
   * as.string(Symbol('mySymbol'), { description: true });
   *
   * @example
   * // Returns 'Array'
   * as.string([], { stringTag: true });
   */
  string(
    value,
    use = {
      description: false,
      stringTag: false,
    }
  ) {
    // Check if the value is null or undefined directly
    if (value === null || value === undefined) {
      return String(value);
    }

    if (is.symbol(value) && use?.description) {
      return value.description;
    }

    if (has.stringTag(value) && use?.stringTag) {
      return value[Symbol.toStringTag];
    }

    // Check if the value has a [Symbol.toPrimitive] method
    if (is.function(value?.[Symbol.toPrimitive])) {
      const primitiveValue = value[Symbol.toPrimitive]("string");
      if (is.string(primitiveValue)) {
        return primitiveValue;
      }
    }

    // Check if the value has a valueOf method
    if (is.function(value?.valueOf)) {
      const valueOfValue = value.valueOf();
      if (is.string(valueOfValue)) {
        return valueOfValue;
      }
      // If valueOf returns a primitive other than string, convert it to string
      if (!is.object(valueOfValue)) {
        return String(valueOfValue);
      }
    }

    // Check if the value has a toString method
    if (is.function(value?.toString)) {
      const stringValue = value.toString();
      if (is.string(stringValue)) {
        return stringValue;
      }
    }

    // Fallback to String() function
    return String(value);
  },

  /**
   * Converts a given value to a string representing an integer.
   *
   * This method first converts the value to a number string and then extracts
   * the integer part by splitting the string at the decimal point.
   *
   * @param value The value to convert to an integer string.
   * @returns The integer part of the value as a string.
   *
   * @example
   * // Returns '123'
   * as.integerString(123.456);
   *
   * @example
   * // Returns '0'
   * as.integerString('0.789');
   */
  integerString(value) {
    return this.numberString(value).split(".")[0];
  },

  /**
   * Converts a given value to a string representing a number.
   *
   * This method first converts the value to a string, trims any whitespace,
   * and removes any non-numeric characters except for '.', 'e', 'E', '+',
   * and '-'. It then uses a regular expression to match a floating-point
   * number, allowing an optional leading '+' or '-' sign, digits before
   * and after a single decimal point.
   *
   * @param value The value to convert to a number string.
   * @returns The sanitized number string or an empty string if no valid
   * float was found.
   *
   * @example
   * // Returns '123.456'
   * numberString('  123.456abc  ');
   *
   * @example
   * // Returns '-0.789'
   * numberString('-0.789xyz');
   */
  numberString(value) {
    // Trim the input string

    const string = this.string(value)
      .trim()
      .replace(/[^0-9.eE+-]/g, "");
    // Use a regular expression to match a floating-point number
    // Allow an optional leading '+' or '-' sign, digits before and after a
    // single decimal point
    const sanitizedStr = string.match(/^[-+]?\d*\.?\d+([eE][-+]?\d+)?/);

    // Return the sanitized string or an empty string if no valid float
    // was found
    return sanitizedStr ? sanitizedStr[0] : "";
  },

  /**
   * Converts a given value to a number.
   *
   * This method uses the `numberString` method to sanitize the input value
   * and then converts it to a number.
   *
   * @param value The value to convert to a number.
   * @returns The numeric representation of the value.
   *
   * @example
   * // Returns 123.456
   * number('123.456abc');
   *
   * @example
   * // Returns -0.789
   * number('-0.789xyz');
   */
  number(value) {
    return Number(this.numberString(value));
  },

  /**
   * Converts a given value to a bigint.
   *
   * This method uses the `integerString` method to sanitize the input value
   * and then converts it to a bigint.
   *
   * @param value The value to convert to a bigint.
   * @returns The bigint representation of the value.
   *
   * @example
   * // Returns 123n
   * bigint('123.456abc');
   *
   * @example
   * // Returns 0n
   * bigint('0.789xyz');
   */
  bigint(value) {
    const BigInt = globalThis?.BigInt;
    return BigInt(this.integerString(value));
  },

  /**
   * Converts a given value to a boolean.
   *
   * This method takes a value, converts it to a string, and then checks
   * if it matches common representations of boolean values. It returns
   * `true` for "1", "yes", and "true" (case insensitive), and `false`
   * for "0", "no", and "false" (case insensitive). For any other values,
   * it returns the boolean representation of the value.
   *
   * @param {*} value - The value to convert to a boolean.
   * @returns {boolean} The boolean representation of the value.
   *
   * @example
   * // Returns true
   * is.boolean("yes")
   *
   * @example
   * // Returns false
   * is.boolean("no")
   *
   * @example
   * // Returns true
   * is.boolean(1)
   *
   * @example
   * // Returns false
   * is.boolean(0)
   *
   * @example
   * // Returns true
   * is.boolean("true")
   *
   * @example
   * // Returns false
   * is.boolean("false")
   *
   * @example
   * // Returns true
   * is.boolean({})
   *
   * @example
   * // Returns false
   * is.boolean(null)
   */
  boolean(value) {
    switch (String(value).toLowerCase()) {
      case "1":
      case "yes":
      case "true":
        return true

      case "0":
      case "no":
      case "false":
        return false

      default:
        return Boolean(value)
    }
  },
};

export function createToolkit() {
  return { si, is, has, as }
}

export default {
  is,
  si,
  has,
  as,
}