import { Extension } from '@nejs/extension'

export class Property {
  constructor(key, descriptor) {
    if (key.startsWith(':')) key = Symbol.for(key.slice(1))
    if (typeof key !== 'string' && typeof key !== 'symbol') {
      throw new TypeError('Key or symbol or :symbol must be supplied!');
    }

    this.key = key;

    if (!Property.is.descriptor(descriptor)) {
      this.descriptor = {
        value: descriptor,
        writable: true,
        configurable: true,
        enumerable: true,
      }
    }
    else {
      this.descriptor = descriptor;
    }
  }

  apply(toObject, asKey) {
    if (!toObject || !['object','function'].some(k => k == typeof toObject))
      return;

    return Object.defineProperty(toObject, asKey ?? this.key, this.descriptor)
  }

  get descriptor() {
    const baseline = { configurable: true, enumerable: false };
    const result = {
      enumerable: this.meta.enumerable,
      configurable: this.meta.configurable,
    };

    if (this.is.accessor) {
      result.get = this.meta.accessor.get;
      result.set = this.meta.accessor.set;
    }
    else {
      result.value = this.meta.data.value;
      result.writable = this.meta.data.writable;
    }

    return Object.defineProperties(result, {
      make: {
        ...baseline,
        get() {
          const self = this;

          return {
            get enumerable() {self.enumerable = true; return self},
            get hidden() {self.enumerable = false; return self},

            get writable() {self.writable = true; return self},
            get readonly() {self.writable = false; return self},

            get configurable() {self.configurable = true; return self},
            get immutable() {self.configurable = false; return self},
          }
        }
      },

      is: {
        ...baseline,
        get() {
          const self = this;

          return {
            get accessor() {return self.is.accssor},
            get data() {return self.is.data}
          }
        }
      },
    })
  }

  set descriptor(descriptor) {
    const { is } = this.constructor;

    if (!is.descriptor(descriptor))
      return;

    this.meta.configurable = descriptor.configurable ?? true
    this.meta.enumerable = descriptor.enumerable ?? true

    if (Reflect.has(descriptor, 'get') || Reflect.has(descriptor, 'set')) {
      const { get, set } = descriptor;

      if (get !== undefined) this.meta.accessor.get = get;
      if (set !== undefined) this.meta.accessor.set = set;
    }
    else {
      const { value, writable } = descriptor;

      this.meta.data.value = value;
      this.meta.data.writable = writable ?? true;
    }
  }

  get is() {
    const self = this;

    return {
      get accessor() {
        return !!(
          self.meta.accessor.get ||
          self.meta.accessor.set
        );
      },

      get data() {
        return !!!this.accessor
      },
    }
  }

  toString(colors = false, {key, descriptor} = {}) {
    const bold = s => colors ? `\x1b[1m${s}\x1b[22m` : s;
    const dim = s => colors ? `\x1b[2m${s}\x1b[22m` : s;
    const red = s => colors ? `\x1b[31m${s}\x1b[39m` : s;
    const green = s => colors ? `\x1b[32m${s}\x1b[39m` : s;
    const blue = s => colors ? `\x1b[34m${s}\x1b[39m` : s;

    if (!key) ({key} = this);
    if (!descriptor || !Property.is.descriptor(descriptor))
      ({descriptor} = this);

    const buffer = [`${bold(key)} { `]
    const keyPresent = (object) => (key) => Reflect.has(object, key)
    const eqeq = (value, compare = (a,b) => a === b) =>
      (element) => compare(element, value);

    if (['get', 'set'].some(keyPresent(descriptor))) {
      if (descriptor.get) {
        buffer.push(blue('getter'))
        if (descriptor.set) {
          buffer.push(bold('|'))
        }
      }

      if (descriptor.set) {
        buffer.push(blue('setter'))
      }
    }
    else {
      buffer.push(green('value'))
      buffer.push(bold('|'))
      buffer.push(descriptor.writable ? green('writable') : red('readonly'))
    }

    buffer.push(' ')
    buffer.push(descriptor.configurable ? green('mutable') : red('immuatable'))

    buffer.push(' ')
    buffer.push(descriptor.enumerable ? green('visible') : red('hidden'))

    buffer.push(' }')

    return buffer.join('')
  }

  [Symbol.for('nodejs.util.inspect.custom')](depth, options, inspect) {
    return this.toString(true);
  }

  /**
   * Creates an accessor property with customizable getter and setter functions.
   *
   * This method offers flexible ways to define accessor properties, including
   * support for storage-based getters and setters. It can handle various input
   * formats, making it versatile for different use cases.
   *
   * @param {string} name - The name of the accessor property.
   * @param {Object} accessors - Object containing getter and/or setter functions.
   * @param {Function} [accessors.get] - Getter function for the property.
   * @param {Function} [accessors.set] - Setter function for the property.
   * @param {Object} [accessors.prototype] - Prototype object for getter/setter.
   * @param {Object} [options] - Additional options for the accessor property.
   * @param {boolean} [options.configurable=true] - Whether property is configurable.
   * @param {boolean} [options.enumerable=true] - Whether property is enumerable.
   * @param {Object} [options.storage] - Storage object for getter/setter closures.
   * @returns {Property} A new Property instance representing the accessor.
   * @throws {TypeError} If no name, getter, or setter is provided.
   *
   * @example
   * // Basic usage
   * Property.accessor('color', {
   *   get() { return this._color; },
   *   set(value) { this._color = value; }
   * });
   *
   * @example
   * // Using storage
   * Property.accessor('keyword', {
   *   get(storage) { return () => storage.keyword; },
   *   set(storage) { return (value) => { storage.keyword = value; } }
   * }, { storage: { keyword: 'initial' } });
   *
   * @example
   * // Using named getter function
   * Property.accessor('color', function get() { return 'red' })
   *
   * @example
   * // Using prototype
   * const ColorAccessors = {
   *   red: { get() { return this._red; } }
   * };
   * Property.accessor('red', ColorAccessors.red);
   */
  static accessor(
    name,
    {get, set, prototype},
    {configurable, enumerable, storage} = {}
  ) {
    if (!get && !set && prototype) {
      const constructor = prototype?.constructor;

      if (constructor?.name === 'get') {
        get = constructor;
      }
      else if (constructor?.name === 'set') {
        set = constructor
      }
    }

    if (get && storage && get.length == 1) {
      get = get(storage);
    }

    if (set && storage && set.length == 1) {
      set = set(storage);
    }

    if (!name && !get && !set) throw new TypeError('Cannot create accessor');

    configurable ??= true
    enumerable ??= true

    return new Property(name, { get, set, configurable, enumerable });
  }

  static data(name, value, { writable, configurable, enumerable } = {}) {
    if (!name) throw new TypeError('Cannot create data property without name')

    writable ??= true
    configurable ??= true
    enumerable ??= true

    return new Property(name, { value, writable, configurable, enumerable })
  }

  static from(object, name) {
    const descriptor = Object.getOwnPropertyDescriptor(object, name);
    return new Property(name, descriptor);
  }

  static get is() {
    return {
      object(value) {
        return value && ['object','function'].some(k => k == typeof value);
      },

      descriptor(object) {
        if (!Property.is.object(object)) {
          return false;
        }

        const present = element => Reflect.has(object, element);
        const props = {
          base: ['configurable', 'enumerable'],
          data: ['writable', 'value'],
          accessor: ['get', 'set'],
        };

        if (Object.getOwnPropertyNames(object).length > 4)
          return false;

        if (props.data.some(present) && props.accessor.some(present))
          return false;

        if (props.base.some(present)) return true;
        if (props.data.some(present)) return true;
        if (props.accessor.some(present)) return true;

        return false;
      }
    }
  }

  static {
    const storage = Object.assign(Object.create(null), {
      key: undefined,
      meta: {
        enumerable: true,
        configurable: true,
        accessor: {
          get: undefined,
          set: undefined
        },
        data: {
          value: undefined,
          writable: true
        },
      },
    });

    basic_accessor(this.prototype, 'key', storage.key, storage)
    basic_accessor(this.prototype, 'meta', storage.meta, storage);
  }
}

export const PropertyExtensions = new Extension(Property);

function basic_accessor(prototype, key, initialValue, storage = {}) {
  storage[key] = initialValue;

  Object.defineProperty(prototype, key, {
    get() {
      return storage[key]
    },
    set(value) {
      storage[key] = value
    },
    enumerable: true,
    configurable: true,
  });

  return Object.getOwnPropertyDescriptor(prototype, key);
}