"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to2, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to2, key) && key !== except)
        __defProp(to2, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to2;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/classes/index.js
var index_exports = {};
__export(index_exports, {
  AsyncIterable: () => AsyncIterable,
  AsyncIterableExtensions: () => AsyncIterableExtensions,
  AsyncIterator: () => AsyncIterator,
  AsyncIteratorExtensions: () => AsyncIteratorExtensions,
  Deferred: () => Deferred,
  DeferredExtension: () => DeferredExtension,
  Descriptor: () => Descriptor,
  DescriptorExtensions: () => DescriptorExtensions,
  Enum: () => Enum,
  EnumExtension: () => EnumExtension,
  Enumeration: () => Enumeration,
  EnumerationExtension: () => EnumerationExtension,
  Introspector: () => Introspector,
  IntrospectorExtensions: () => IntrospectorExtensions,
  Iterable: () => Iterable,
  IterableExtensions: () => IterableExtensions,
  Iterator: () => Iterator,
  IteratorExtensions: () => IteratorExtensions,
  NewClassesExtension: () => NewClassesExtension,
  ParamParser: () => ParamParser,
  ParamParserExtensions: () => ParamParserExtensions,
  PluggableProxy: () => PluggableProxy,
  PluggableProxyExtensionSet: () => PluggableProxyExtensionSet,
  PluggableProxyExtensions: () => PluggableProxyExtensions,
  Property: () => Property,
  PropertyExtensions: () => PropertyExtensions,
  ProxyHandler: () => ProxyHandler,
  ProxyHandlerExtensions: () => ProxyHandlerExtensions,
  ProxyHandlerResponse: () => ProxyHandlerResponse,
  RefMap: () => RefMap,
  RefMapExtensions: () => RefMapExtensions,
  RefSet: () => RefSet,
  RefSetExtensions: () => RefSetExtensions,
  SubscriptProxy: () => SubscriptProxy,
  Symkeys: () => Symkeys,
  SymkeysExtension: () => SymkeysExtension,
  Type: () => Type,
  TypeExtensions: () => TypeExtensions,
  makeBaseEnum: () => makeBaseEnum
});
module.exports = __toCommonJS(index_exports);
var import_extension20 = require("@nejs/extension");

// src/classes/asyncIterable.js
var import_extension = require("@nejs/extension");
var AsyncIterable = class {
  /**
   * Private field to store the elements of the async iterable.
   * @private
   */
  #elements = [];
  /**
   * Constructs an instance of AsyncIterable. Similar to Iterable, it can be
   * initialized with either an iterable object, an async generator function,
   * or individual elements. The elements can be promises, direct values, or a
   * mix of both. If the first argument is an iterable or an async generator
   * function, the instance is initialized with the elements from the iterable
   * or the generated elements from the async generator function, followed by
   * any additional arguments. If the first argument is not an iterable or an
   * async generator function, all arguments are treated as individual elements.
   *
   * @param {Iterable|AsyncGeneratorFunction|Promise|*} elementsOrFirstElement - 
   * An iterable object, an async generator function, a Promise, or the first 
   * element.
   * @param {...Promise|*} moreElements - Additional elements if the first
   * argument is not an iterable or an async generator function.
   */
  constructor(elementsOrFirstElement, ...moreElements) {
    if (elementsOrFirstElement != null && (typeof elementsOrFirstElement[Symbol.iterator] === "function" || typeof elementsOrFirstElement[Symbol.asyncIterator] === "function")) {
      this.#elements = [...elementsOrFirstElement, ...moreElements];
    } else if (typeof elementsOrFirstElement === "function" && elementsOrFirstElement.constructor.name === "AsyncGeneratorFunction") {
      this.#elements = elementsOrFirstElement();
    } else {
      this.#elements = [elementsOrFirstElement, ...moreElements];
    }
  }
  /**
   * Implements the async iterable protocol. When an instance of AsyncIterable
   * is used in a `for await...of` loop, this async generator function is
   * invoked. It yields each element as a Promise, allowing asynchronous
   * iteration. Elements that are not Promises are automatically wrapped in
   * a resolved Promise to ensure consistency.
   *
   * @returns {AsyncGenerator} An async generator that yields each element as
   * a Promise.
   */
  async *[Symbol.asyncIterator]() {
    for await (const element of this.#elements) {
      yield element;
    }
  }
  /**
   * Ensures that the constructor of this object instance's name
   * is returned if the string tag for this instance is queried
   *
   * @returns {string} the name of the class
   */
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  /**
   * Checks if a given value is an async iterable. This method determines if
   * the provided value has a `Symbol.asyncIterator` property that is an async
   * generator function. It's a precise way to identify if the value conforms
   * to the async iterable protocol using an async generator function.
   *
   * Note: This method specifically checks for async generator functions. Some
   * async iterables might use regular async functions that return an async
   * iterator, which this method won't identify.
   *
   * @param {*} value - The value to be checked for async iterability.
   * @returns {boolean} - Returns true if the value is an async iterable
   * implemented using an async generator function, false otherwise.
   */
  static isAsyncIterable(value) {
    const type = Object.prototype.toString.call(value?.[Symbol.asyncIterator]);
    return type === "[object AsyncGeneratorFunction]";
  }
};
var AsyncIterator = class {
  /**
   * Creates a new `AsyncIterator` object instance.
   *
   * @param {object|AsyncGeneratorFunction} asyncIterable any object that has a
   * `[Symbol.asyncIterable]` property assigned to a generator function or an
   * async generator function itself.
   */
  constructor(asyncIterable) {
    if (typeof asyncIterable === "function" && asyncIterable.constructor.name === "AsyncGeneratorFunction") {
      this.#asyncIterable = asyncIterable();
    } else if (!asyncIterable || !Reflect.has(asyncIterable, Symbol.asyncIterator)) {
      throw new TypeError(
        "Value used to instantiate AsyncIterator is not an async iterable"
      );
    } else {
      this.#asyncIterable = asyncIterable;
    }
    this.#asyncIterator = this.#asyncIterable[Symbol.asyncIterator]();
  }
  /**
   * Returns a new `Array` derived from the iterable this object
   * wraps.
   *
   * @returns {array} a new `Array` generated from the wrapped
   * iterable. The method is generated from using an async for of
   * loop.
   */
  async asArray() {
    const array = [];
    for await (const value of this) {
      array.push(value);
    }
    return array;
  }
  /**
   * Returns the actual iterable object passed to the constructor that
   * created this instance.
   *
   * @returns {object} the object containing the `[Symbol.iterator]`
   */
  get asyncIterable() {
    return this.#asyncIterable;
  }
  /**
   * The function retrieves the next value in the iterator. If the
   * the iterator has run its course, `reset()` can be invoked to
   * reset the pointer to the beginning of the iteration.
   *
   * @returns {any} the next value
   */
  async next() {
    const result = await this.#asyncIterator.next();
    if (result.done) {
      return { value: void 0, done: true };
    } else {
      return { value: result.value, done: false };
    }
  }
  /**
   * Resets the async iterator to the beginning allowing it to be
   * iterated over again.
   */
  async reset() {
    this.#asyncIterator = this.#asyncIterable[Symbol.asyncIterator]();
  }
  /**
   * The existence of this symbol on the object instances, indicates that
   * it can be used in `for(.. of ..)` loops and its values can be
   * extracted from calls to `Array.from()`
   *
   * @returns {AsyncIterable} this is returned since this object is already
   * conforming to the expected JavaScript AsyncIterator interface
   */
  [Symbol.asyncIterator]() {
    return this;
  }
  /**
   * Ensures that the constructor of this object instance's name
   * is returned if the string tag for this instance is queried
   *
   * @returns {string} the name of the class
   */
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  /**
   * The object from which its iterator functionality is derived.
   *
   * @type {object}
   * @private
   */
  #asyncIterable = null;
  /**
   * The results of a call to the iterable's `[Symbol.asyncIterator]`
   * generator function.
   *
   * @type {object}
   * @private
   */
  #asyncIterator = null;
};
var AsyncIterableExtensions = new import_extension.Extension(AsyncIterable);
var AsyncIteratorExtensions = new import_extension.Extension(AsyncIterator);

// src/classes/deferred.js
var import_extension2 = require("@nejs/extension");
var Deferred = class _Deferred extends Promise {
  /**
   * The promise backing this deferred object. Created when the constructor
   * runs, this promise is what all `Promise.prototype` functions are routed
   * to.
   *
   * @type {Promise}
   */
  #promise = null;
  /**
   * The reject() resolver that will be assigned when a new instance is
   * created. Invoking this function with or without a `reason` will cause
   * the deferred's promise to be settled.
   *
   * @type {function}
   */
  #reject = null;
  /**
   * The resolve() resolver that will be assigned when a new instance is
   * created. Invoking this function with or without a `value` will cause
   * the deferred's promise to be settled.
   *
   * @type {function}
   */
  #resolve = null;
  #rejected = false;
  #resolved = false;
  /**
   * When the Deferred is settled with {@link Deferred.resolve}, the `value`
   * passed to that function will be set here as well.
   *
   * @type {*}
   */
  value = null;
  /**
   * When the Deferred is settled with {@link Deferred.reject}, the `reason`
   * passed to that rejection will also be stored here.
   *
   * @type {*}
   */
  reason = null;
  /**
   * When either {@link Deferred.resolve} or {@link Deferred.reject} are called,
   * this property is set to `true`. Its current status at any time can be
   * queried using the {@link Deferred.settled} getter.
   *
   * @type {boolean}
   */
  #settled = false;
  /**
   * The constructor for Deferred instances. By default, a new Deferred will
   * have three important properties: `promise`, `resolve`, and `reject`.
   *
   * The constructor takes an object called `options`. It can have the
   * following properties:
   *
   * ```
   * interface BaseDeferredOptions {
   *   // Deferreds store the value or reason. To turn this off, pass true
   *   // to this option.
   *   doNotTrackAnswers?: boolean;
   * }
   *
   * interface ResolveDeferredOptions {
   *   // Passing in an option object with a resolve value will auto resolve
   *   // the Deferred with your value. An error will be raised if both
   *   // resolve and reject are supplied at the same time.
   *   resolve?: (value: any) => void;
   * }
   *
   * interface RejectDeferredOptions {
   *   // Passing in an option object with a reject reason will auto reject
   *   // the Deferred with your reason. An error will be raised if both
   *   // resolve and reject are supplied at the same time.
   *   reject?: (reason: any) => void;
   * }
   *
   * type DeferredOptions = BaseDeferredOptions &
   *   (ResolveDeferredOptions | RejectDeferredOptions)
   * ```
   *
   * @param {object} options see above for examples on supported options, but
   * when supplied, the constructor can take instructions on how to auto
   * resolve or reject the deferred created here.
   */
  constructor(options) {
    const config = options && typeof options === "object" ? options : {};
    if (config?.resolve && config?.reject) {
      throw new TypeError(
        "resolve and reject options cannot be simultaneously provided"
      );
    }
    let _resolve, _reject;
    super((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
      if (config?.executor && typeof config?.executor === "function") {
        config?.executor(resolve, reject);
      }
    });
    this.#resolve = (value) => {
      if (config?.doNotTrackAnswers !== true) {
        this.value = value;
      }
      this.#settled = true;
      this.#resolved = true;
      return _resolve(value);
    };
    this.#reject = async (reason) => {
      if (config?.doNotTrackAnswers !== true) {
        this.reason = reason;
      }
      this.#settled = true;
      this.#rejected = true;
      return _reject(reason);
    };
    this.#promise = this;
    if (config?.resolve) {
      this.#resolve(config?.resolve);
    } else if (config?.reject) {
      this.#reject(config?.reject);
    }
  }
  /**
   * Returns a boolean value that indicates whether or not this Deferred
   * has been settled (either resolve or reject have been invoked).
   *
   * @returns {boolean} `true` if either {@link Deferred.resolve} or
   * {@link Deferred.reject} have been invoked; `false` otherwise
   */
  get settled() {
    return this.#settled;
  }
  /**
   * A getter that returns a boolean indicating whether the Deferred instance
   * was rejected. This property can be used to check if the Deferred has been
   * settled with a rejection. It is particularly useful in scenarios where
   * the resolution status of the Deferred needs to be checked without
   * accessing the rejection reason or invoking any additional logic.
   *
   * @returns {boolean} `true` if the Deferred was rejected, otherwise `false`.
   */
  get wasRejected() {
    return this.#rejected;
  }
  /**
   * A getter that returns a boolean indicating whether the Deferred instance
   * was resolved. This property is useful for checking if the Deferred has been
   * settled with a resolution, allowing for checks on the Deferred's status
   * without needing to access the resolved value or trigger any additional
   * logic.
   *
   * @returns {boolean} `true` if the Deferred was resolved, otherwise `false`.
   */
  get wasResolved() {
    return this.#resolved;
  }
  /**
   * Accessor for the promise managed by this Deferred instance.
   *
   * This getter provides access to the internal promise which is controlled
   * by the Deferred's resolve and reject methods. It allows external code to
   * attach callbacks for the resolution or rejection of the Deferred without
   * the ability to directly resolve or reject it.
   *
   * @returns {Promise} The promise controlled by this Deferred instance.
   */
  get promise() {
    return this.#promise;
  }
  /**
   * Resolves the Deferred with the given value. If the value is a thenable
   * (i.e., has a "then" method), the Deferred will "follow" that thenable,
   * adopting its eventual state; otherwise, the Deferred will be fulfilled
   * with the value. This function behaves the same as Promise.resolve.
   *
   * @param {*} value - The value to resolve the Deferred with.
   * @returns {Promise} A Promise that is resolved with the given value.
   */
  resolve(value) {
    return this.#resolve(value);
  }
  /**
   * Rejects the Deferred with the given reason. This function behaves the
   * same as Promise.reject. The Deferred will be rejected with the provided
   * reason.
   *
   * @param {*} reason - The reason to reject the Deferred with.
   * @returns {Promise} A Promise that is rejected with the given reason.
   */
  reject(reason) {
    return this.#reject(reason);
  }
  /**
   * Customizes the output of `util.inspect` on instances of Deferred when
   * used in Node.js. This method is invoked by Node.js's `util.inspect`
   * utility to format the inspection output of a Deferred instance.
   *
   * The output includes the state of the Deferred (resolved, rejected, or
   * unsettled) along with the resolved value or rejection reason, if
   * applicable. This provides a quick, readable status of the Deferred
   * instance directly in the console or debugging tools.
   *
   * @param {number} depth The depth to which `util.inspect` will recurse.
   * @param {object} options Formatting options provided by `util.inspect`.
   * @param {function} inspect Reference to the `util.inspect` function.
   * @returns {string} A formatted string representing the Deferred instance.
   */
  [Symbol.for("nodejs.util.inspect.custom")](depth, options, inspect) {
    return [
      "\x1B[1mDeferred [\x1B[22;3mPromise\x1B[23;1m]\x1B[22m ",
      "{ ",
      this.settled ? this.wasResolved ? `resolved with \x1B[32m${this.value}\x1B[39m` : `rejected with \x1B[31m${this.reason?.message ?? this.reason}\x1B[39m` : "\x1B[33munsettled valued or reason\x1B[39m",
      " }"
    ].join("");
  }
  /**
   * A getter for the species symbol which returns a custom DeferredPromise
   * class. This class extends from Deferred and is used to ensure that the
   * constructor signature matches that of a Promise. The executor function
   * passed to the constructor of this class is used to initialize the Deferred
   * object with resolve and reject functions, similar to how a Promise would
   * be initialized.
   *
   * @returns {DeferredPromise} A DeferredPromise class that extends Deferred.
   */
  static get [Symbol.species]() {
    return class DeferredPromise extends _Deferred {
      /**
       * The constructor for the DeferredPromise class.
       * It takes an executor function which is used to initialize the Deferred.
       *
       * @param {Function} executor - A function that is passed with the resolve
       * and reject functions. The executor is expected to initialize the
       * Deferred by calling resolve or reject at some point.
       */
      constructor(executor) {
        super({ executor });
      }
    };
  }
};
var DeferredExtension = new import_extension2.Extension(Deferred);

// src/classes/descriptor.js
var import_extension3 = require("@nejs/extension");

// src/utils/descriptor.utils.js
var DescriptorUtils = {
  /**
   * Creates an accessor descriptor object
   *
   * This function has multiple possible overloads
   *
   * ```markdown
   *   _**zeroFn** is a function that takes no parameters_
   *   _**oneFn** is a function that takes a single parameter_
   *   _**oneOrNone** is a either a function that takes a single parameter or nullish_
   *   _**nonFn** is any value that is not a function_
   *   _**nullish** is either null or undefined_
   *   _**...** means configurable?, enumerable?, storage?, key? liaison? as
   *   subsequent following parameters in that order_
   *
   *   **accessor()**
   *     creates a storage backed accessor that is both read and write.
   *     The storage object will be a provided empty object with the key
   *     being 'value'. Configurable and enumerable flags will be set to
   *     `true`.
   *
   *   **accessor(options)**
   *     this single argument variant of accessor() consists of a single
   *     options object. If neither `get` nor `set` are provided, a
   *     storage backed read-write accessor with undefined as the initial
   *     value will be constructed.
   *
   *   **accessor(nonFn)**
   *   **accessor(any, true, options?)**
   *   **accessor(any, true, ...)**
   *     supplying only a non-function only parameter or any value and the
   *     value `true` as the second parameter, you will get a read-write
   *     accessor stored in the default or specified storage. The resultant
   *     initial value will be whatever is provided as the first parameter.
   *     See options to customize `configurable`, `enumerable`, `storage`,
   *     `key` and the `liaison` factory function.
   *
   *   **accessor(any, false, options?)**
   *   **accessor(any, false, ...)**
   *     supplying only a non-function only parameter or any value and the
   *     value `false` as the second parameter, you will get a read-only
   *     getter stored in the default or specified storage. The resultant
   *     value will be whatever is provided as the first parameter.
   *     See options to customize `configurable`, `enumerable`, `storage`,
   *     `key` and the `liaison` factory function.
   *
   *   **accessor(zeroFn)**
   *   **accessor(zeroFn, nullish, options?)**
   *   **accessor(zeroFn, nullish, ...)**
   *     creates a generic read-only accessor with the first no-argument
   *     function parameter being the getter and either null or undefined
   *     for the setter. Either an options object or the manually ordered
   *     parameters can optionally follow if a nullish value for setter
   *     is provided.
   *
   *   **accessor(zeroFn, oneOrNone, options?)**
   *   **accessor(zeroFn, oneOrNone, ...)**
   *     creates a generic read-write accessor with the first no-argument
   *     function parameter being the getter and the second single-argument
   *     function parameter being the setter. Either an options object or
   *     the manually ordered parameters can optionally follow.
   *
   *   **accessor(oneFn, oneFn, options?)**
   *   **accessor(oneFn, oneFn, ...)**
   *     this special variant of the accessor() invocation, allows a single
   *     argument getter and setter factory to be supplied. These will
   *     automatically be invoked with the specified or default storage
   *     object. The result of the getter factory should be a no argument
   *     function. And the result of the setter factory should be a single
   *     argument function. The options for `liaison` and `key` will be
   *     ignored and should be handled specifically in the factory
   *     functions to suit your own use case.
   * ```
   *
   * Options are an object oriented way of supplying the alternate
   * flags to the data descriptor. They are
   *
   *   • `get` - only referenced when an options object is the only parameter
   *   • `set` - only referenced when an options object is the only parameter
   *   • `configurable` - if true, the descriptor of the object that this
   *     accessor descriptor represents can be redefined at later time by
   *     subsequent calls to {@link Object.defineProperty} or
   *     {@link Object.defineProperties}
   *   • `enumerable` - if true, enumeration over the object this
   *     descriptor is applied to, will show the property
   *     represented by this descriptor. See the associated MDN
   *     page regarding this {@link PropertyDescriptor} if you
   *     want to know more.
   *   • `storage` - an object, usually {@link Object} or {@link Map} or
   *     nullish if unused
   *   • `key` - a {@link PropertyKey} of your choosing or the default
   *      string `"value"`
   *   • `bind` - true if you wish to have the `storage` object bound as
   *     the `thisObj` for both the `get` and `set` functions when
   *     storage is used. **note* this will not work if you supply a
   *     big arrow function for the accessor function in question. This
   *     defaults to `false`.
   *   • `liaison` - an optional factory function that must return an
   *     object with two properties. The first is a `get()` function that
   *     returns a value and the second is a `set(value)` function that
   *     stores a value. The factory function receives `storage` and
   *     `key`, in that order. The default uses {@link Map.get} and
   *     {@link Map.set} if the storage is an instance of {@link Map}.
   *     Otherwise, the typical `object[key]` format is used if the
   *     storage object is an instanceof {@link Object}
   *
   * @param {(object|any)?} value the JavaScript value representing
   * this descriptor's value or an options object if it is the
   * only parameter.
   * @param {(object|boolean)?} optionsOrConfigurable true or false if
   * you wish the `configurable` flag to be set. Optionally supply an
   * object with one of the supported options to configure the run
   * of the function.
   * @param {boolean?} enumerable true or false if you wish to
   * configure the `.enumerable` property of the descriptor
   * @param {object?} storage an object upon which data storage should
   * be written to and read from. Defaults to an empty {@link Object}
   * when storage is needed and not supplied via this parameter or
   * an options object.
   * @param {PropertyKey?} key the key used to store content on the
   * storage object.
   * @param {(object, PropertyKey) => { get: ()=>any, set: (v)=>void}} liaison
   * an optional function that, given a storage object and property key,
   * returns an object with a no argument `get()` function that returns
   * the value on the storage object with a given key and a single argument
   * `set(value)` function that stores a new value using the property key
   * on the supplied storage object. This exists because access to a
   * {@link Map} and {@link Object} values are handled differently. If you
   * need support for some other class than `Map` or `Object` then you
   * should provide a liaison function to define access.
   *
   * @returns {PropertyDescriptor}
   *
   * @see {@link PropertyDescriptor}
   * @note More info on this can be found at the
   * [MDN Object.defineProperty/ies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
   * page
   *
   * @type {Function & { keys: string[] }}
   */
  get accessor() {
    function accessor2(get, set, optionsOrConfigurable = true, enumerable = true, storage, key = "value", liaison) {
      const count = arguments.length;
      const storageKeys = ["storage", "key", "liaison", "initial", "bind"];
      const optionKeys = [
        // accessor functions
        "get",
        "set",
        // descriptor flags
        "configurable",
        "enumerable",
        // storage configuration keys
        ...storageKeys
      ];
      const has3 = (object, key2) => isObject(object) && Reflect.has(object, key2);
      const isOpts = (object) => optionKeys.some((key2) => has3(object, key2));
      let configurable = !!optionsOrConfigurable;
      let initial = void 0;
      let bind = false;
      let options = {};
      if (count === 1 && isObject(get) && hasSome(get, ...optionKeys)) {
        options = { ...get };
        ({ get, set } = get);
      }
      if (isObject(optionsOrConfigurable) || isObject(set)) {
        options = isObject(set) && count === 2 ? { ...set } : { ...optionsOrConfigurable };
        ({ configurable, enumerable, storage, key, bind, initial } = options);
      }
      liaison = options?.liaison ?? liaison ?? ((storage2, key2) => ({
        get() {
          if (storage2 instanceof Map)
            return storage2.get(key2);
          else if (isObject(storage2))
            return storage2[key2];
        },
        set(value) {
          if (storage2 instanceof Map)
            storage2.set(key2, value);
          else if (isObject(storage2))
            storage2[key2] = value;
        }
      }));
      configurable = configurable ?? true;
      enumerable = enumerable ?? true;
      key = key ?? "value";
      bind = bind ?? false;
      const nullish = (value) => value === null || value === void 0;
      const nonFn = (value) => !nullish(value) && typeof value !== "function";
      const yesFn = (value) => typeof value === "function";
      const zeroFn = (value) => yesFn(value) && value.length === 0;
      const oneFn = (value) => yesFn(value) && value.length === 1;
      const isTrue = (value) => value === true;
      const isFalse = (value) => value === false;
      const addRefs = (fn, value) => Object.defineProperties(fn, {
        storage: { value, configurable: true, enumerable: false },
        key: { value: key, configurable: true, enumerable: false }
      });
      if (count === 0 || !get && !set) {
        storage = { [key]: initial };
        const _ = liaison(storage, key);
        get = addRefs(function() {
          return _.get();
        }, storage);
        set = addRefs(function(value) {
          _.set(value);
        }, storage);
        return { get, set, configurable, enumerable };
      }
      if (count === 1 && oneFn(get)) {
        set = false;
      }
      if (count === 1 && nonFn(get) || (isTrue(set) || isFalse(set))) {
        const skipSet = isFalse(set);
        if (!storage || !(storage instanceof Map) || !isObject(storage)) {
          storage = {};
        }
        const _ = liaison(storage, key);
        _.set(get);
        let _get = function() {
          return _.get();
        };
        let _set = function(value) {
          _.set(value);
        };
        if (bind) {
          _get = _get.bind(storage);
          _set = _set.bind(storage);
        }
        get = addRefs(_get, storage);
        set = addRefs(_set, storage);
        if (skipSet) {
          set = void 0;
        }
        return { get, set, configurable, enumerable };
      }
      if (zeroFn(get) && !set || zeroFn(get) && oneFn(set)) {
        const descriptor = { get, set, configurable, enumerable };
        if (isObject(options) && Reflect.has(options, "initial"))
          descriptor.set(initial);
        return descriptor;
      }
      if (oneFn(get) && oneFn(set)) {
        storage = storage || {};
        let _get = get(storage);
        let _set = set(storage);
        if (bind) {
          _get = _get.bind(storage);
          _set = _set.bind(storage);
        }
        return {
          get: addRefs(_get, storage),
          set: addRefs(_set, storage),
          configurable,
          enumerable
        };
      }
      return { get, set, configurable, enumerable };
    }
    Object.defineProperty(accessor2, "keys", {
      get() {
        return Object.defineProperties(
          ["get", "set", "configurable", "enumerable"],
          {
            from: {
              value: function extractKeysFrom(object) {
                const response = {
                  get: void 0,
                  set: void 0,
                  configurable: void 0,
                  enumerable: void 0
                };
                if (!object || !(object instanceof Object))
                  return response;
                for (const key of DescriptorUtils.accessor.keys) {
                  if (Reflect.has(object, key))
                    response[key] = object[key];
                }
              },
              writable: false,
              configurable: false,
              enumerable: false
            }
          }
        );
      },
      configurable: true,
      enumerable: false
    });
    return accessor2;
  },
  /**
   * Creates a data descriptor object
   *
   * This function has multiple possible overloads
   *
   * ```markdown
   *   **data()**
   *     creates a data descriptor with a value of `undefined` that
   *     is writable, configurable and enumerable.
   *
   *   **data(options)**
   *     if the only parameter is an object and that object contains
   *     at least a `.value` property, this funtion will return a
   *     data descriptor with the associated values. This variant
   *     is useful if you want to extract the normal data descriptor
   *     properties: value, writable, configurable and/or enumerable
   *     from an object that has properties with these names, in
   *     addition to other properties or functions. Note that if you
   *     wish for the value of the descriptor to be an object that
   *     also contains a `.value` property, use `data({value: obj})`
   *     instead.
   *
   *   **data(value)**
   *   **data(value, options?)**
   *     creates a data descriptor from the supplied `value`,
   *     optionally augmented by additional `options`. The defaults
   *     for this writable, configurable and enumerable values set
   *     to `true`
   *
   *   **data(value, writable?, configurable?, enumerable?)**
   *     if writable, configurable or enumerable or true or false
   *     then this function creates a data descriptor with those
   *     flags and the supplied value (there's no real reason to
   *     invoke this function if you're supplying all four values)
   * ```
   *
   * Options are an object oriented way of supplying the alternate
   * flags to the data descriptor. They are
   *
   *   • `value` - only referenced when an options object is the
   *     only parameter
   *   • `writable` - true if the value represented by this data
   *     descriptor can be reassigned a new value.
   *   • `configurable` - if true, the descriptor of the object
   *     that this data descriptor represents can be redefined at
   *     later time by subsequent calls to `Object.defineProperty`
   *     or `Object.defineProperties`. If `.configurable` is true
   *     this can be done even if `.writable` is set to false
   *   • `enumerable` - if true, enumeration over the object this
   *     descriptor is applied to, will show the property
   *     represented by this descriptor. See the associated MDN
   *     page regarding this `PropertyDescriptor` if you want to
   *     know more.
   *
   * @param {(object|any)?} value the JavaScript value representing
   * this descriptor's value or an options object if it is the
   * only parameter.
   * @param {(object|boolean)?} optionsOrWritable true or false if
   * you wish the writable flag to be set. Optionally supply an
   * object with one of the supported options to configure the run
   * of the function.
   * @param {boolean?} configurable true or false if you wish to
   * configure the `.configurable` property of the descriptor
   * @param {boolean?} enumerable true or false if you wish to
   * configure the `.enumerable` property of the descriptor
   * @returns {PropertyDescriptor}
   *
   * @note More info on this can be found at the
   * [MDN Object.defineProperty/ies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
   * page
   *
   * @type {Function & { keys: string[] }}
   */
  get data() {
    function data2(value, optionsOrWritable, configurable, enumerable) {
      const count = arguments.length;
      let valueIsDescriptor = false;
      if (count === 0) {
        return {
          value: void 0,
          writable: true,
          configurable: true,
          enumerable: true
        };
      }
      if (count === 1) {
        const stats = DescriptorUtils.isDescriptor(value, true);
        if (stats.isValid && stats.isData) {
          valueIsDescriptor = true;
        }
      }
      let writable = optionsOrWritable === void 0 ? true : !!optionsOrWritable;
      let options = typeof optionsOrWritable === "boolean" ? {} : Object(optionsOrWritable);
      configurable = configurable === void 0 ? true : !!configurable;
      enumerable = enumerable === void 0 ? true : !!enumerable;
      if (valueIsDescriptor && !options?.allowDescriptorValue) {
        options = {
          writable: value?.writable ?? true,
          configurable: value?.configurable ?? true,
          enumerable: value?.enumerable ?? true
        };
        value = value?.value;
      }
      if (options) {
        ({ writable, configurable, enumerable } = {
          ...{ writable, configurable, enumerable },
          ...options
        });
      }
      return { value, writable, configurable, enumerable };
    }
    Object.defineProperty(data2, "keys", {
      value: Object.defineProperties(
        ["value", "writable", "configurable", "enumerable"],
        {
          from: {
            value: function extractKeysFrom(object) {
              const response = {
                value: void 0,
                writable: void 0,
                configurable: void 0,
                enumerable: void 0
              };
              if (!object || !(object instanceof Object))
                return response;
              for (const key of DescriptorUtils.data.keys) {
                if (Reflect.has(object, key))
                  response[key] = object[key];
              }
            },
            writable: false,
            configurable: false,
            enumerable: false
          }
        }
      ),
      writable: false,
      configurable: true,
      enumerable: false
    });
    return data2;
  },
  describe(object, key, value, detectDescriptorValues = true) {
    const { isAccessor: isAccessor2, isData: isData2, data: data2 } = DescriptorUtils;
    if (!(object && object instanceof Object))
      return void 0;
    if (!["string", "number", "symbol"].includes(typeof key))
      return void 0;
    if (detectDescriptorValues && isAccessor2(value) || isData2(value)) {
      return Object.defineProperty(object, key, value);
    } else {
      return Object.defineProperty(object, key, data2(value));
    }
  },
  describeMany(object, keyValues, detectDescriptorValues = true) {
    const { isAccessor: isAccessor2, isData: isData2, isDescriptor: isDescriptor2, data: data2, describe: describe2 } = DescriptorUtils;
    const isKey = (k) => ["string", "number", "symbol"].includes(typeof k);
    let map3 = void 0;
    if (Array.isArray(keyValues)) {
      map3 = new Map(keyValues.filter((keyValue) => {
        return typeof keyValue === "function" && keyValue.length === 2;
      }));
    } else if (keyValues instanceof Map) {
      map3 = keyValues;
    } else if (keyValues instanceof Object) {
      const descriptors = Object.getOwnPropertyDescriptors(keyValues);
      map3 = new Object.entries(descriptors);
    } else {
      return [];
    }
    for (const [key, value] of map3) {
      if (detectDescriptorValues) {
        if (isDescriptor2(key)) {
        }
      }
    }
    const accessorBase = { enumerable: true, configurable: true };
    const dataBase = { writable: true, ...accessorBase };
    const extractBase = (descriptor) => {
      if (isAccessor2(descriptor)) {
        const { configurable, enumerable } = descriptor;
        return { configurable, enumerable };
      } else if (isData2(descriptor)) {
        const { writable, configurable, enumerable } = descriptor;
        return { writable, configurable, enumerable };
      }
      return void 0;
    };
    for (const [key, value] of map3.entries()) {
      const descriptor = detectDescriptorValues && isDescriptor2(value) ? value : data2(value, dataBase);
    }
  },
  extract(fromObject, keysToExtract, defaultIfMissing = void 0, extractDescriptors = false) {
    const { data: data2 } = DescriptorUtils;
    const output = {};
    if (!fromObject || typeof fromObject !== "object")
      return output;
    if (!Array.isArray(keysToExtract))
      keysToExtract = [keysToExtract];
    for (const key of keysToExtract) {
      let descriptor = Object.getOwnPropertyDescriptor(fromObject, key);
      if (!descriptor)
        descriptor = data2(defaultIfMissing);
      if (extractDescriptors)
        descriptor.value = data2(descriptor, { allowDescriptorValue: true });
      Object.defineProperty(output, key, descriptor);
    }
    return output;
  },
  /**
   * Determines if a given value is an accessor descriptor.
   *
   * An accessor descriptor is a property descriptor that defines
   * getter and/or setter functions for a property. This function
   * checks the validity of the descriptor and whether it qualifies
   * as an accessor.
   *
   * @param {Object} value - The descriptor object to evaluate.
   * @param {boolean} [strict=true] - If true, performs a strict
   *   validation of the descriptor.
   * @returns {boolean} Returns true if the descriptor is valid and
   *   is an accessor descriptor, otherwise false.
   *
   * @example
   * // Example usage:
   * const descriptor = { get: () => 42, set: (val) => {} }
   * const result = DescriptorUtils.isAccessor(descriptor)
   * console.log(result) // Outputs: true
   */
  isAccessor(value, strict = true) {
    const stats = DescriptorUtils.isDescriptor(value, true, strict);
    return stats.isValid && stats.isAccessor;
  },
  /**
   * Checks if a given value is a data descriptor.
   *
   * A data descriptor is a property descriptor that defines a value
   * and optionally a writable attribute for a property. This function
   * evaluates the descriptor's validity and whether it qualifies as
   * a data descriptor.
   *
   * @param {Object} value - The descriptor object to evaluate.
   * @param {boolean} [strict=true] - If true, performs a strict
   *   validation of the descriptor.
   * @returns {boolean} Returns true if the descriptor is valid and
   *   is a data descriptor, otherwise false.
   *
   * @example
   * // Example usage:
   * const descriptor = { value: 42, writable: true }
   * const result = DescriptorUtils.isData(descriptor)
   * console.log(result) // Outputs: true
   */
  isData(value, strict = true) {
    const stats = DescriptorUtils.isDescriptor(value, true, strict);
    return stats.isValid && stats.isData;
  },
  /**
   * A function that, given a value that might be a `PropertyDescriptor`,
   * calculates a deterministic probability that the supplied value is
   * an object that either is a `PropertyDescriptor` or that can function
   * as one.
   *
   * @param {unknown} value a JavaScript value that might be a
   * `PropertyDescriptor` type.
   * @param {boolean?} returnStats if this value is true, instead of returning
   * a determined boolean value indicating the supplied value might be a
   * `PropertyDescriptor`, an object containing the determined flags and score
   * the led to the determination instead is returned.
   * @param {boolean?} strict if this value is `true`, which is the default,
   * then the function will not allow descriptor compatible objects, rather it
   * will only return true if the object has keys that belong in a descriptor
   * and do not form an invalid combination.
   * @returns {IsDescriptorResponse} if `returnStats` is `true`
   * an object of type {@link IsDescriptorStats} is returned. This object
   * will have a lot of {@link Boolean} flags pertaining to the `true`/`false`
   * evaluation. If `returnStats` is `false`, then a boolean value denoting
   * whether or not the value is a {@link PropertyDescriptor} is returned
   * instead. This is effectively the same as the `isValid` parameter from the
   * stats block.
   */
  isDescriptor(value, returnStats = false, strict = true) {
    const areBools = (...props) => props.flat().every(
      (prop) => boolTypes.includes(typeof value[prop])
    );
    const areFuncs = (...props) => props.flat().every(
      (prop) => funcTypes.includes(typeof value[prop])
    );
    const hasKeyFn = (property2) => Reflect.has(value, property2);
    const isOfType = (type) => (element) => typeof element === type;
    const baseProps = ["configurable", "enumerable"];
    const dataProps = ["value", "writable"];
    const accessorProps = ["get", "set"];
    const anyDescProps = [...baseProps, ...dataProps, ...accessorProps];
    const boolTypes = ["undefined", "boolean"];
    const funcTypes = ["undefined", "function"];
    const stats = {
      confidence: 0,
      hasAccessorKeys: false,
      hasBaseDescriptorKeys: false,
      hasDataKeys: false,
      isAccessor: false,
      isData: false,
      isValid: false,
      isBase: false
    };
    if (!value || typeof value !== "object" || !(value instanceof Object))
      return returnStats ? stats : false;
    let score = 0;
    if (value && typeof value === "object") {
      const objKeys = Reflect.ownKeys(value);
      const nonDescKeys = objKeys.filter((k) => !anyDescProps.includes(k));
      if (strict && nonDescKeys.length)
        return false;
      if (objKeys.length <= 4)
        score++;
      stats.hasAccessorKeys = accessorProps.some(hasKeyFn) && areFuncs(accessorProps);
      stats.hasDataKeys = dataProps.some(hasKeyFn) && areBools("writable");
      stats.hasBaseDescriptorKeys = baseProps.some(hasKeyFn) && areBools(baseProps);
      if (stats.hasBaseDescriptorKeys)
        score++;
      if (stats.hasAccessorKeys || stats.hasDataKeys)
        score++;
      if (score > 0)
        stats.isValid = true;
      if (score > 0 && stats.hasAccessorKeys)
        stats.isAccessor = true;
      if (score > 0 && stats.hasDataKeys)
        stats.isData = true;
      if (stats.isValid && !["get", "set", "value"].some(hasKeyFn))
        stats.isBase = true;
      if (stats.isValid && stats.isData && Reflect.has(value, "value"))
        score++;
      else if (stats.isValid && stats.isAccessor) {
        if ([value?.get, value?.set].some(isOfType("function")))
          score++;
      }
      if (stats.hasAccessorKeys && stats.hasDataKeys) {
        score = 0;
        stats.isValid = false;
      }
      stats.confidence = parseFloat(score / 4);
    }
    if (returnStats)
      return stats;
    return score >= 0 ? true : false;
  },
  /**
   * Redefines a property on an object with new descriptors and options.
   * This function allows renaming, aliasing, and redefining property
   * descriptors such as configurable, enumerable, writable, get, and set.
   *
   * @param {Object} object - The target object whose property is to be
   * redefined.
   * @param {string|symbol} key - The key of the property to redefine.
   * @param {Object} as - An object containing new property descriptors.
   * @param {Object} [options] - Optional settings for renaming and aliasing.
   * @param {string|symbol} [options.rename] - New key name for the property.
   * @param {Array<string|symbol>} [options.alsoAs] - Additional aliases for
   * the property.
   * @param {Object} [options.moveTo] optionally move the descriptor from this
   * object to another.
   * @returns {any} the result of `object[key]` in its final state
   *
   * @example
   * const obj = { a: 1 }
   * redescribe(obj, 'a', { writable: false }, { rename: 'b', alsoAs: ['c'] })
   * console.log(obj.b) // Outputs: 1
   * console.log(obj.c) // Outputs: 1
   */
  redescribe(object, key, as2, options) {
    const { isAccessor: isAccessor2, isData: isData2 } = DescriptorUtils;
    const ifThen = (condition, fn, ...args) => condition && fn(...args);
    const isBool = (value) => typeof value === "boolean" || value instanceof Boolean;
    const isFunction = (value) => typeof value === "function";
    const isObject4 = (value) => value && value instanceof Object;
    const isDefined = (value, key2) => isObject4(value) && Reflect.has(value, key2);
    const isObjectKey = (v) => ["string", "number", "symbol"].includes(typeof v);
    const define = (key2, values) => Object.defineProperty(object, key2, values);
    const assign = (object2, ...values) => Object.assign(object2, ...values);
    const isAnObject = isObject4(object);
    let asIsObject = isObject4(as2);
    const descriptor = isAnObject && Object.getOwnPropertyDescriptor(object, key);
    const aliases = [];
    if (descriptor && !asIsObject) {
      asIsObject = true;
      as2 = {};
    }
    if (isObject4(options)) {
      if (isDefined(options, "rename")) {
        const successfulDelete = delete object[key];
        if (successfulDelete)
          key = options.rename;
      }
      if (isDefined(options, "alsoAs")) {
        if (Array.isArray(options.alsoAs)) {
          for (const value of options.alsoAs.filter((v) => isObjectKey(v)))
            aliases.push(value);
        } else if (isObjectKey(options.alsoAs)) {
          aliases.push(options.alsoAs);
        }
      }
      if (isDefined(options, "moveTo")) {
        ifThen(isObject4(options.moveTo), () => object = options.moveTo);
      }
    }
    if (isAnObject && asIsObject) {
      let { configurable, enumerable, writable, get, set, value } = as2;
      if (isAccessor2(descriptor)) {
        ifThen(isFunction(get), () => assign(descriptor, { get }));
        ifThen(isFunction(set), () => assign(descriptor, { set }));
      }
      ifThen(isBool(writable) && isData2(descriptor), () => {
        assign(descriptor, {
          writable,
          value: isDefined(as2, "value") ? value : descriptor.value
        });
      });
      ifThen(isBool(configurable), () => assign(descriptor, { configurable }));
      ifThen(isBool(enumerable), () => assign(descriptor, { enumerable }));
      define(key, descriptor);
      for (const alias of aliases) {
        define(alias, descriptor);
      }
      return object[key];
    }
  },
  /**
   * Retrieves the keys associated with accessor descriptors.
   *
   * Accessor descriptors are property descriptors that define
   * getter and/or setter functions for a property.
   *
   * @type {string[]}
   *
   * @example
   * // Example usage:
   * const keys = DescriptorUtils.kAccessorDescriptorKeys
   * console.log(keys) // Output: ['get', 'set']
   */
  get kAccessorDescriptorKeys() {
    return ["get", "set"];
  },
  /**
   * Retrieves the keys associated with data descriptors.
   *
   * Data descriptors are property descriptors that define a value
   * and optionally a writable attribute for a property.
   *
   * @type {string[]}
   *
   * @example
   * // Example usage:
   * const keys = DescriptorUtils.kDataDescriptorKeys
   * console.log(keys) // Output: ['value', 'writable']
   */
  get kDataDescriptorKeys() {
    return ["value", "writable"];
  },
  /**
   * Retrieves the keys associated with shared descriptors.
   *
   * Shared descriptors are property descriptors that define
   * common attributes for a property, such as whether the
   * property is configurable or enumerable.
   *
   * @type {string[]}
   *
   * @example
   * // Example usage:
   * const keys = DescriptorUtils.kSharedDescriptorKeys
   * console.log(keys) // Output: ['configurable', 'enumerable']
   */
  get kSharedDescriptorKeys() {
    return ["configurable", "enumerable"];
  },
  /**
   * Retrieves all descriptor keys, combining accessor, data, and shared
   * descriptor keys.
   *
   * This getter method aggregates keys from accessor descriptors,
   * data descriptors, and shared descriptors into a single array.
   * This can be useful when you need to validate or inspect all
   * possible descriptor keys.
   *
   * @type {string[]}
   *
   * @example
   * // Example usage:
   * const allKeys = DescriptorUtils.kDescriptorKeys
   * console.log(allKeys)
   * // Output: [
   * //   'get', 'set', 'value', 'writable', 'configurable', 'enumerable'
   * // ]
   */
  get kDescriptorKeys() {
    return [
      ...this.kAccessorDescriptorKeys,
      ...this.kDataDescriptorKeys,
      ...this.kSharedDescriptorKeys
    ];
  }
};
var {
  accessor,
  data,
  describe,
  describeMany,
  extract,
  isDescriptor,
  isAccessor,
  isData,
  redescribe
} = DescriptorUtils;
var {
  kAccessorDescriptorKeys,
  kDataDescriptorKeys,
  kDescriptorKeys,
  kSharedDescriptorKeys
} = DescriptorUtils;
function isObject(o) {
  return o && typeof o === "object";
}
function hasSome(object, ...keys) {
  return hasQuantity("some", object, keys);
}
function hasQuantity(quantityFn, object, keys) {
  return isObject(object) && keys.flat(Infinity).map((key) => Reflect.has(object, key))[quantityFn]((has3) => has3);
}

// src/classes/descriptor.js
var Descriptor = class _Descriptor {
  /**
   * The default private descriptor value is that of `enigmatic`
   *
   * @private
   * @type {object}
   */
  _desc = void 0;
  /**
   * An optionally associated object, usually the parent from which
   * the descriptor was taken, or undefined if none was able to be
   * derived.
   *
   * @type {object}
   */
  _object = void 0;
  /**
   * Constructs a Descriptor instance which wraps and manages an object
   * property descriptor. The constructor can handle an existing descriptor
   * object or create a new one based on an object and a property key.
   *
   * @param {object|Descriptor} object - The target object or an existing
   * Descriptor instance. If it's an object, it is used in conjunction with
   * `key` to create a descriptor. If it's a Descriptor instance, it is used
   * directly as the descriptor.
   * @param {string|symbol} [key] - The property key for which the descriptor
   * is to be created. This parameter is ignored if `object` is a Descriptor
   * instance. If `key` is an object and `object` is a valid descriptor, `key`
   * is treated as the associated object.
   * @throws {Error} Throws an error if the constructed descriptor is not
   * valid.
   */
  constructor(object, key) {
    if (arguments.length === 0) {
      this._desc = _Descriptor.enigmatic;
    } else if (_Descriptor.isDescriptor(object)) {
      this._desc = object;
      this._object = isObject2(key) ? key : void 0;
    } else if (isObject2(object) && isValidKey(key)) {
      console.log("new Descriptor(%o, %o)", object, key);
      this._desc = Object.getOwnPropertyDescriptor(object, key);
      this._object = object;
    }
    if (!this.isDescriptor) {
      const objectMsg = object === globalThis ? "[GLOBAL]" : typeof key === "object" ? JSON.stringify(object) : String(object);
      const keyMsg = key === globalThis ? "[GLOBAL]" : typeof key === "object" ? JSON.stringify(key) : String(key);
      console.error(
        `
      Descriptor(object: ${object}, key: ${key}) FAILED:
        object:      ${objectMsg}
        key:         ${keyMsg}
        descriptor:  `,
        this._desc
      );
      throw new Error(`Not a valid descriptor:`, this._desc);
    }
  }
  /**
   * Detects whether or not this instance is an accessor object descriptor
   *
   * @returns {boolean} true if this object has a getter or setter and is not
   * a data descriptor
   */
  get isAccessor() {
    return isDescriptor(this._desc, true).isAccessor;
  }
  /**
   * Detects whether or not this instance is an data object descriptor
   *
   * @returns {boolean} true if this object has a value property and is not
   * an accessor descriptor
   */
  get isData() {
    return isDescriptor(this._desc, true).isData;
  }
  /**
   * Detects whether or not this instance is a valid object descriptor
   *
   * @returns {boolean} true if this descriptor store is a valid descriptor
   */
  get isDescriptor() {
    return isDescriptor(this._desc);
  }
  /**
   * Retrieves the {@link get} function for this accessor and binds it to
   * the object from which the descriptor was derived, if that value is set.
   * Otherwise this method is identical to the {@link get} accessor.
   *
   * @returns {function} the getter if one is defined. If possible this
   * getter will be bound the associated and previously set `object`.
   */
  get boundGet() {
    return isObject2(this._object) ? this.get?.bind(this._object) : this.get;
  }
  /**
   * Retrieves the {@link set} function for this accessor and binds it to
   * the object from which the descriptor was derived, if that value is set.
   * Otherwise this method is identical to the {@link set} accessor.
   *
   * @returns {function} the setter if one is defined. If possible this
   * setter will be bound the associated and previously set `object`.
   */
  get boundSet() {
    return isObject2(this._object) ? this.set?.bind(this._object) : this.set;
  }
  /**
   * The function checks the descriptor's associated object has been set on this
   * instance of `Descriptor`.
   *
   * @returns {boolean} `true` if the `object` property has been set,
   * `false` otherwise
   */
  get hasObject() {
    return isObject2(this._object);
  }
  /**
   * Returns the descriptor's associated `object` value. This is usually the
   * parent object from which the descriptor was derived. If the value is preset
   * it will be returned. Undefined will be returned otherwise
   *
   * @returns {object} the associated object for this descriptor or undefined
   * if it has not yet been set.
   */
  get object() {
    return this._object;
  }
  /**
   * Sets the descriptor's associated `object` value. This is usually the
   * parent object from which the descriptor was derived.
   *
   * @param {object} value sets the object for which this descriptor is to
   * be associated with.
   */
  set object(value) {
    this._object = Object(value);
  }
  /**
   * Take the descriptor defined by this objects values and apply them to
   * the specified object using the specified key.
   *
   * @param {object} object the object to apply this descriptor to
   * @param {string|symbol} forKey the string or symbol for which this
   * descriptor will abe applied
   */
  applyTo(object, forKey, bindAccessors = false) {
    if (!isObject2(object) || !isValidKey(forKey)) {
      throw new Error(`Cannot apply descriptor to non-object or invalid key`);
    }
    return Object.defineProperty(object, forKey, this.toObject(bindAccessors));
  }
  /**
   * Converts this Descriptor class instance into a basic object descriptor
   * that is accepted by all the standard JavaScript runtime methods that
   * deal with object descriptors.
   *
   * @param {boolean|object} bindAccessors if `true`, a non-fatal attempt to
   * bind accessor getter and setter methods is made before returning the
   * object. If `bindAccessors` is truthy and is also an object, this is the
   * object the accessors will be bound to. If the value is falsy or if the
   * descriptor instance represents a data descriptor, nothing happens.
   * @returns {object} the object instance's basic object representation as
   * a descriptor.
   */
  toObject(bindAccessors = false) {
    let descriptor = { ...this._desc };
    if (bindAccessors && this.isAccessor) {
      if (this.hasObject) {
        descriptor = {
          ...descriptor,
          get: this.boundGet,
          set: this.boundSet
        };
      } else if (isObject2(bindAccessors)) {
        descriptor = {
          ...descriptor,
          get: this.get?.bind(bindAccessors),
          set: this.set?.bind(bindAccessors)
        };
      }
    }
    return descriptor;
  }
  /**
   * The function returns a string representation of a descriptor object with
   * additional information about its type when used in the NodeJS repl.
   *
   * @param {number} depth - The `depth` parameter is used to specify the
   * maximum depth to which nested objects and arrays will be formatted. If
   * the depth is exceeded, the output will be truncated with ellipses.
   * @param {object} options - The `options` parameter is an object that
   * contains various configuration options for the `inspect` function.
   * These options can be used to customize the output of the inspection.
   * @param {function} inspect - The `inspect` parameter is a function that
   * is used to convert an object into a string representation. It is
   * typically used for debugging purposes or when displaying an object's
   * properties.
   * @returns a string that represents a descriptor. The string includes the
   * type of the descriptor (either "Accessor" or "Data") and the result of
   * inspecting the descriptor object using the provided options and depth.
   */
  [Symbol.for("nodejs.util.inspect.custom")](depth, options, inspect) {
    const type = this.isAccessor ? " (Accessor)" : this.isData ? " (Data)" : "";
    return `Descriptor${type} ${inspect(this._desc, { ...options, depth })}`;
  }
  /**
   * Converts this descriptor object into a base representation
   *
   * @param {string} hint one of `string`, `number` or default;
   * @returns if the hint is 'string', then a string identifying the enum
   * and its type is returned. `number` will always be NaN since it is incoret
   */
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case "string":
        if (this.isAccessor) {
          const props = [];
          if (Reflect.has(this._desc, "get")) props.push("getter");
          if (Reflect.has(this._desc, "set")) props.push("setter");
          return `Accessor (${props.join(", ")})`;
        } else if (this.isData) {
          const props = [];
          if (Reflect.has(this._desc, "value")) props.push("value");
          if (Reflect.has(this._desc, "writable")) props.push("writable");
          return `Data (${props.join(", ")})`;
        }
        break;
      case "number":
        return NaN;
      default:
        return this.toObject();
    }
  }
  /**
   * Ensures that the constructor of this object instance's name
   * is returned if the string tag for this instance is queried
   *
   * @returns {string} the name of the class
   */
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  /**
   * The function `getData` retrieves the value of a property from an object
   * if it exists and is a data property.
   *
   * @param {object} object - The "object" parameter is the object from which
   * we want to retrieve data.
   * @param {string|symbol} property - The `property` parameter is the name of
   * the property that you want to retrieve the data from.
   * @returns either the value of the specified property if it exists and is
   * a data property, or undefined if the property does not exist or is not
   * a data property.
   */
  static getData(object, property2) {
    if (!isObject2(object) || !Reflect.has(object, property2)) {
      return void 0;
    }
    const descriptor = _Descriptor.for(object, property2, true);
    if (!descriptor.isData) {
      return null;
    }
    return descriptor.value;
  }
  /**
   * The function `getAccessor` checks if an object has a getter/setter accessor
   * for a given property and returns the accessor functions if found.
   *
   * @param object - The `object` parameter is the object from which we want to
   * retrieve the accessor for a specific property.
   * @param property - The `property` parameter is the name of the property for
   * which we want to get the accessor.
   * @returns an object that contains the getter and setter functions for the
   * specified property of the given object. If the property is an accessor
   * property (defined with a getter and/or setter), the returned object will
   * also have additional properties such as "accessor" and "descriptor". If
   * the property is not found or is not an accessor property, the function
   * returns undefined.
   */
  static getAccessor(object, property2) {
    if (!isObject2(object) || !Reflect.has(object, property2)) {
      return void 0;
    }
    const descriptor = _Descriptor.for(object, property2, true);
    if (!descriptor.isAccessor) {
      return null;
    }
    return descriptor.get.bind(object)();
  }
  /**
   * The function returns an object with enumerable and configurable properties
   * based on the input parameters.
   *
   * @param [enumerable=false] - A boolean value indicating whether the property
   * can be enumerated (listed) when iterating over the object's properties.
   * @param [configurable=false] - The `configurable` parameter determines
   * whether the property can be deleted or its attributes can be modified.
   * If `configurable` is set to `true`, the property can be deleted and its
   * attributes can be changed. If `configurable` is set to `false`, the
   * property cannot be deleted and
   * @returns An object with the properties `enumerable` and `configurable` is
   * being returned. The values of these properties are determined by the
   * arguments passed to the `base` function.
   */
  static base(enumerable = false, configurable = false) {
    return {
      enumerable,
      configurable
    };
  }
  /**
   * The function "newAccessor" creates a new property descriptor object with a
   * getter and setter function, along with optional enumerable and configurable
   * flags.
   *
   * @param getter - The getter parameter is a function that will be used as the
   * getter for the property. It will be called when the property is accessed.
   * @param setter - The `setter` parameter is a function that will be used as
   * the setter for the property. It will be called whenever the property is
   * assigned a new value.
   * @param [] - - `getter`: A function that will be used as the getter for the
   * property.
   * @returns an object with properties "get", "set", "enumerable", and
   * "configurable".
   */
  static accessor() {
    return accessor(...arguments);
  }
  /**
   * The function "newData" creates a new data object with customizable
   * properties.
   *
   * @param value - The value parameter represents the value that will be
   * assigned to the property.
   * @param [writable=true] - The `writable` parameter determines whether the
   * value of the property can be changed. If `writable` is set to `true`, the
   * value can be changed. If `writable` is set to `false`, the value cannot be
   * changed.
   * @param [] - - `value`: The value to be assigned to the property.
   * @returns an object with properties `value`, `enumerable`, `writable`, and
   * `configurable`.
   */
  static data(value, writable = true, { enumerable, configurable } = { configurable: true, enumerable: true }) {
    return data(value, writable, enumerable, configurable);
  }
  /**
   * Shorthand for Object.getOwnPropertyDescriptor()
   *
   * @param {object} object a non-null object instance
   * @param {string|symbol} key a symbol or string referencing which key on the
   * object to return a descriptor for.
   * @returns an object descriptor for the requested field or null
   */
  static for(object, key, wrap = false) {
    if (!isObject2(object) || !isValidKey(key) || !Reflect.has(object, key)) {
      return null;
    }
    return wrap ? new _Descriptor(Object.getOwnPropertyDescriptor(object, key)) : Object.getOwnPropertyDescriptor(object, key);
  }
  /**
   * The function checks if an object is a likely an object descriptor in
   * JavaScript. This is determined as an object with some of the known
   * descriptor keys (e.g. enumerable, configurable, value, writable, get,
   * or set). Technically, any object could serve as a descriptor but this
   * function only returns true if known descriptor keys are found.
   *
   * @param {any} object - Any value we want to check for being a descriptor.
   * @param {boolean} returnStatsInstead defaults to false, but if the value
   * is `true` then an object with reasoning behind the decision of whether
   * or not the
   * @returns {IsDescriptorResponse} either a {@link boolean} value or
   * an object conforming to {@link IsDescriptorStats} if `returnStatsInstead`
   * is `true`
   *
   * @see {@link DescriptorUtils.isDescriptor}
   */
  static isDescriptor(object, returnStatsInstead = false) {
    return isDescriptor(object, returnStatsInstead);
  }
  /**
   * The function checks if a given property descriptor or property of an
   * object is an accessor.
   *
   * @param {object} objectOrDescriptor - The `objectOrDescriptor` parameter
   * can be either a descriptor object or a property name.
   * @param {(string|number|symbol)?} property the property name you wish to
   * check the validity as an accessor descriptor. Only expected if the
   * `objectOrDescriptor` parameter is the object that would contain this
   * property.
   * @returns {@link Boolean} returning `true` if the `descriptor` object
   * has any keys that match the {@link Descriptor.ACCESSOR_KEYS} array,
   * otherwise it returns `false`.
   */
  static isAccessor(objectOrDescriptor, property2) {
    const needsDescriptor = objectOrDescriptor && property2 && isObject2(objectOrDescriptor) && isValidKey(property2);
    const descriptor = needsDescriptor ? _Descriptor.for(objectOrDescriptor, property2) : objectOrDescriptor;
    return isDescriptor(descriptor, true).isAccessor;
  }
  /**
   * The function checks if a given property or descriptor is a data property.
   *
   * @param {object} objectOrDescriptor - The `objectOrDescriptor` parameter
   * can be either a descriptor object or a property name.
   * @param {(string|number|symbol)?} property the property name you wish to
   * check the validity as an accessor descriptor. Only expected if the
   * `objectOrDescriptor` parameter is the object that would contain this
   * property.
   * @returns {@link Boolean} returning `true` if the `descriptor` object
   * has any keys that match the {@link Descriptor.DATA_KEYS} array, otherwise
   * it returns `false`.
   */
  static isData(objectOrDescriptor, property2) {
    const needsDescriptor = objectOrDescriptor && property2 && isObject2(objectOrDescriptor) && isValidKey(property2);
    const descriptor = needsDescriptor ? _Descriptor.for(objectOrDescriptor, property2) : objectOrDescriptor;
    return isDescriptor(descriptor, true).isData;
  }
  /**
   * A base descriptor (new for each read) that is both enumerable and
   * configurable
   *
   * @returns `{ enumerable: true, configurable: true }`
   */
  static get flexible() {
    return { enumerable: true, configurable: true };
  }
  /**
   * A base descriptor (new for each read) that is not enumerable but is
   * configurable
   *
   * @returns `{ enumerable: false, configurable: true }`
   */
  static get enigmatic() {
    return { enumerable: false, configurable: true };
  }
  /**
   * A base descriptor (new for each read) that is neither enumerable
   * nor configurable.
   *
   * @returns `{ enumerable: false, configurable: false }`
   */
  static get intrinsic() {
    return { enumerable: false, configurable: false };
  }
  /**
   * A base descriptor (new for each read) that is enumerable but
   * not configurable
   *
   * @returns `{ enumerable: true, configurable: false }`
   */
  static get transparent() {
    return { enumerable: true, configurable: false };
  }
  /**
   * The function returns an array of shared descriptor keys.
   *
   * @returns An array containing the strings 'configurable' and 'enumerable'.
   */
  static get SHARED_KEYS() {
    return kSharedDescriptorKeys;
  }
  /**
   * The function returns an array of accessor descriptor keys.
   *
   * @returns An array containing the strings 'get' and 'set' is being returned.
   */
  static get ACCESSOR_KEYS() {
    return kAccessorDescriptorKeys;
  }
  /**
   * The function returns an array of data descriptor keys.
   *
   * @returns An array containing the strings 'value' and 'writable' is being
   * returned.
   */
  static get DATA_KEYS() {
    return kDataDescriptorKeys;
  }
  static {
    for (const key of kDescriptorKeys) {
      Object.defineProperties(_Descriptor.prototype, {
        [key]: accessor(
          function getMaker(storage) {
            return function get() {
              return this._desc[key];
            };
          },
          function setMaker(storage) {
            return function set(value) {
              this._desc[key] = value;
            };
          }
        )
      });
    }
  }
};
var DescriptorExtensions = new import_extension3.Extension(Descriptor);
function typeOrType(type, Class, notNullish = true) {
  return (value) => (!notNullish || notNullish && value !== null && value !== void 0) && (typeof value === type || value && value instanceof Class);
}
function isObject2(o) {
  return typeOrType("object", Object)(o);
}
function isString(o) {
  return typeOrType("string", String)(o);
}
function isNumber2(o) {
  return typeOrType("number", Number)(o);
}
function isSymbol(o) {
  return typeOrType("symbol", Symbol)(o);
}
function isValidKey(o) {
  return isString(o) || isNumber2(o) || isSymbol(o);
}

// src/classes/enum.js
var import_extension5 = require("@nejs/extension");

// src/utils/copy.object.js
function tryIgnore(code) {
  try {
    return code();
  } catch (ignore) {
    return void 0;
  }
}
function transduceFrom(array, transform, into = {}) {
  if (typeof transform !== "function") {
    return into;
  }
  return array.reduce((accumulator, element) => {
    const { key, value } = transform?.(element) ?? {};
    if (key && value) {
      accumulator[key] = value;
    }
    return accumulator;
  }, into);
}
function transduceFromCOHandler(element) {
  const result = {};
  if (element instanceof COPropertyHandler) {
    result.key = element.property;
    result.value = element;
  }
  return result;
}
function makeTransducer(array, transform) {
  return transduceFrom.bind(null, array, transform);
}
var COPropertyHandler = class _COPropertyHandler {
  /**
   * The name of the property this handler is responsible for.
   * @type {string|undefined}
   */
  property = void 0;
  /**
   * The property handler. When provided and invoked, it will receive
   * a the property name of the value being handled, the current
   * descriptor to transform, and the object into which values are
   * currently being copied into.
   *
   * The result must be a COPropertyHandler response type, which can
   * be made with {@link COPropertyHandler.makeResponse} and which
   * can be validated with {@link COPropertyHandler.isResponse}.
   *
   * The handler should have the following parameters
   *  - {string} property - The name of the property being handled.
   *  - {Object} curDescriptor - The property descriptor to handle.
   *  - {Object} destination - The destination object into which
   *    properties are being copied.
   *
   * An should return
   *  - {Object} a `COPropertyHandler.Response` type object which
   *    can be made with {@link COPropertyHandler.makeResponse}.
   *
   * @type {function|undefined}
   */
  handler = void 0;
  /**
   * Creates a new COPropertyHandler instance.
   * @param {string} [property] - The name of the property to handle.
   * @param {function} [handler] - The function to handle the property
   * descriptor.
   */
  constructor(property2, handler) {
    Object.assign(this, { property: property2, handler });
  }
  /**
   * Handles a property descriptor using the registered handler function.
   * @param {string} property - The name of the property being handled.
   * @param {Object} descriptor - The property descriptor to handle.
   * @returns {Object} The resulting property descriptor after handling.
   */
  handle(property2, descriptor, destination) {
    if (this.handler) {
      return _COPropertyHandler.defaultHandle(
        property2,
        descriptor,
        this.handler
      );
    }
    return descriptor;
  }
  /**
   * The default property descriptor handler.
   *
   * @param {string} property - The name of the property being handled.
   * @param {Object} curDescriptor - The property descriptor to handle.
   * @param {Object} destination - The destination object into which
   * properties are being copied.
   * @param {function} handler - The function to handle the property
   * descriptor.
   * @returns {Object} a `COPropertyHandler.Response` type object which
   * can be made with {@link COPropertyHandler.makeResponse}.
   */
  static defaultHandle(property2, curDescriptor, destination, handler) {
    if (typeof handler === "function") {
      try {
        const {
          descriptor,
          flow
        } = handler(property2, curDescriptor, destination);
        return this.makeResponse(descriptor, flow);
      } catch (ignore) {
      }
    }
    return this.makeResponse(curDescriptor);
  }
  /**
   * Creates a COPropertyHandler response object.
   *
   * @param {Object} descriptor - The property descriptor.
   * @param {string} [flow=COPropertyHandler.kNoChange] - The flow control
   * directive. Must be one of the values from
   * {@link COPropertyHandler.flowTypes} if provided.
   * @returns {COPropertyHandler.Response} The response object.
   * @example
   * COPropertyHandler.makeResponse({ value: 42, writable: false })
   * // => {
   * //   newDescriptor: { value: 42, writable: false },
   * //   flow: 'nochange'
   * // }
   */
  static makeResponse(descriptor, flow) {
    return {
      newDescriptor: descriptor,
      flow: flow ?? this.kNoChange,
      get [Symbol.toStringTag]() {
        return "COPropertyHandler.Response";
      }
    };
  }
  /**
   * Checks if a value is a valid COPropertyHandler response object.
   * @param {*} value - The value to check.
   * @returns {boolean} `true` if the value is a response object, `false`
   * otherwise.
   * @example
   * COPropertyHandler.isResponse({
   *   newDescriptor: { value: 42 },
   *   flow: 'nochange'
   * })
   * // => true
   */
  static isResponse(value) {
    return value && typeof value === "object" && value[Symbol.toStringTag] === "COPropertyHandler.Response";
  }
  /**
   * The flow control directive indicating no change in flow.
   * @type {string}
   */
  static get kNoChange() {
    return "nochange";
  }
  /**
   * The flow control directive indicating to continue the loop.
   * @type {string}
   */
  static get kContinue() {
    return "continue";
  }
  /**
   * The flow control directive indicating to break the loop.
   * @type {string}
   */
  static get kBreak() {
    return "break";
  }
  /**
   * An array of all valid flow control directive values.
   * @type {string[]}
   */
  static get flowTypes() {
    return [this.kNoChange, this.kContinue, this.kBreak];
  }
  /**
   * An object mapping flow control directive values to their
   * corresponding string representations.
   * @type {Object.<string, string>}
   */
  static get flowEnum() {
    return {
      [this.kNoChange]: this.kNoChange,
      [this.kContinue]: this.kContinue,
      [this.kBreak]: this.kBreak
    };
  }
};
function kVisibilityKeys() {
  const keys = {
    get mutablyHidden() {
      return Symbol.for(JSON.stringify({
        enumerable: false,
        configurable: true
      }));
    },
    get mutablyVisible() {
      return Symbol.for(JSON.stringify({
        enumerable: true,
        configurable: true
      }));
    },
    get immutablyHidden() {
      return Symbol.for(JSON.stringify({
        enumerable: false,
        configurable: false
      }));
    },
    get immutablyVisible() {
      return Symbol.for(JSON.stringify({
        enumerable: true,
        configurable: false
      }));
    },
    get flexiblyHidden() {
      return Symbol.for(JSON.stringify({
        enumerable: false,
        configurable: false,
        writable: true
      }));
    },
    get flexiblyVisible() {
      return Symbol.for(JSON.stringify({
        enumerable: true,
        configurable: false,
        writable: true
      }));
    }
  };
  const enumerated = {
    mutablyHidden: keys.mutablyHidden,
    mutablyVisible: keys.mutablyVisible,
    immutablyHidden: keys.immutablyHidden,
    immutablyVisible: keys.immutablyVisible,
    flexiblyHidden: keys.flexiblyHidden,
    flexiblyVisible: keys.flexiblyVisible
  };
  function* keyGenerator() {
    for (const key of Object.keys(enumerated)) {
      yield key;
    }
  }
  function* symbolGenerator() {
    for (const value of Object.values(enumerated)) {
      yield value;
    }
  }
  function* entryGenerator() {
    for (const entry of Object.entries(enumerated)) {
      yield entry;
    }
  }
  function* descriptorGenertor() {
    for (const [key, value] of entryGenerator()) {
      yield [key, JSON.parse(value.description)];
    }
  }
  Object.defineProperties(keys, {
    enumeration: { get() {
      return enumerated;
    }, enumerable: false },
    keys: { get() {
      return keyGenerator();
    }, enumerable: false },
    symbols: { get() {
      return symbolGenerator();
    }, enumerable: false },
    entries: { get() {
      return entryGenerator();
    }, enumerable: false },
    descriptors: { get() {
      return descriptorGenertor();
    }, enumerable: false },
    descriptorFor: {
      value(symbol) {
        try {
          return JSON.parse(symbol.description);
        } catch (ignored) {
        }
        return void 0;
      },
      enumerable: false
    },
    [Symbol.iterator]: { get() {
      return symbolGenerator();
    } }
  });
  return keys;
}
var VisibilityKeys = kVisibilityKeys();
var VisibilityScopeHandler = class extends COPropertyHandler {
  overrides = void 0;
  /**
   * Creates a new VisibilityScopeHandler instance.
   *
   * @constructor
   * @param {symbol} visibilityKey - The visibility key to use for handling
   *   property descriptors.
   */
  constructor(visibilityKey) {
    super(visibilityKey, (property2, descriptor, dest, source) => {
      let data2 = descriptor?.value;
      if (!descriptor || typeof descriptor.value !== "object") {
        return COPropertyHandler.makeResponse(descriptor, "nochange");
      }
      if (!data2 && (descriptor?.get || descriptor?.set)) {
        const newDescriptor = this.applyOverridesTo(descriptor);
        return COPropertyHandler.makeResponse(newDescriptor, "nochange");
      }
      data2 = customCopyObject({ deep: false }, {}, data2 ?? {});
      this.walkAndApply(data2);
      descriptor.value = data2;
      return COPropertyHandler.makeResponse(descriptor, "continue");
    });
    tryIgnore(() => this.overrides = JSON.parse(property.description));
  }
  applyOverridesTo(existingDescriptor, overwrite = false) {
    const allowed = ["value", "get", "set", "writable", "configurable", "enumerable"];
    const output = overwrite ? existingDescriptor : { ...existingDescriptor };
    for (let [key, value] of Object.entries(this.overrides ?? {})) {
      if (!~allowed.indexOf(key)) {
        continue;
      }
      if (!(["get", "set"].some((k) => k === key) && ["undefined", "function"].some((t) => typeof value === t))) {
        continue;
      }
      if (!(["enumerable", "configurable", "writable"].some((k) => k === key) && typeof value !== "boolean")) {
        value = !!value;
      }
      delete output[key];
      output[key] = value;
    }
    return output;
  }
  walkAndApply(to2) {
    Reflect.ownKeys(to2).forEach((key) => {
      tryIgnore(() => {
        let result = Object.getOwnPropertyDescriptor(to2, key);
        this.applyOverridesTo(result, true);
        Object.defineProperty(to2, key, result);
      });
    });
  }
};
var MutablyVisibleHandler = class extends VisibilityScopeHandler {
  constructor() {
    super(VisibilityKeys.mutablyVisible);
  }
  static get shared() {
    return this.#singleton ?? (this.#singleton = new this());
  }
  static #singleton;
};
var MutablyHiddenHandler = class extends VisibilityScopeHandler {
  constructor() {
    super(VisibilityKeys.mutablyHidden);
  }
  static get shared() {
    return this.#singleton ?? (this.#singleton = new this());
  }
  static #singleton;
};
var ImmutablyVisibleHandler = class extends VisibilityScopeHandler {
  constructor() {
    super(VisibilityKeys.immutablyVisible);
  }
  static get shared() {
    return this.#singleton ?? (this.#singleton = new this());
  }
  static #singleton;
};
var ImmutablyHiddenHandler = class extends VisibilityScopeHandler {
  constructor() {
    super(VisibilityKeys.immutablyHidden);
  }
  static get shared() {
    return this.#singleton ?? (this.#singleton = new this());
  }
  static #singleton;
};
var FlexiblyVisibleHandler = class extends VisibilityScopeHandler {
  constructor() {
    super(VisibilityKeys.flexiblyVisible);
  }
  static get shared() {
    return this.#singleton ?? (this.#singleton = new this());
  }
  static #singleton;
};
var FlexiblyHiddenHandler = class extends VisibilityScopeHandler {
  constructor() {
    super(VisibilityKeys.flexiblyHidden);
  }
  static get shared() {
    return this.#singleton ?? (this.#singleton = new this());
  }
  static #singleton;
};
Object.defineProperties(COPropertyHandler, {
  MutablyHiddenHandler: { get() {
    return MutablyHiddenHandler.shared;
  } },
  MutablyVisibleHandler: { get() {
    return MutablyVisibleHandler.shared;
  } },
  ImmutablyHiddenHandler: { get() {
    return ImmutablyHiddenHandler.shared;
  } },
  ImmutablyVisibleHandler: { get() {
    return ImmutablyVisibleHandler.shared;
  } },
  FlexiblyHiddenHandler: { get() {
    return FlexiblyHiddenHandler.shared;
  } },
  FlexiblyVisibleHandler: { get() {
    return FlexiblyVisibleHandler.shared;
  } },
  handlers: {
    value: [
      MutablyHiddenHandler,
      MutablyVisibleHandler,
      ImmutablyHiddenHandler,
      ImmutablyVisibleHandler,
      FlexiblyHiddenHandler,
      FlexiblyVisibleHandler
    ].map((klass) => klass.shared),
    configurable: true,
    enumerable: true
  }
});
function copyObject(deep, destination, ...sources) {
  const options = {
    deep: deep || false,
    propertyHandlers: COPropertyHandler?.handlers ?? []
  };
  return customCopyObject(options, destination, ...sources);
}
function customCopyObject(_options, _destination, ..._sources) {
  const visited = /* @__PURE__ */ new Set();
  const [options, destination, sources] = ccoParseArgs(
    _options,
    _destination,
    ..._sources
  );
  let { deep } = options;
  for (const source of sources) {
    if (source === null || typeof source !== "object" || visited.has(source)) {
      continue;
    }
    visited.add(source);
    const keys = Reflect.ownKeys(source);
    for (let key of keys) {
      let descriptor;
      try {
        descriptor = Object.getOwnPropertyDescriptor(source, key);
      } catch (err) {
        console.warn(`Failed to get descriptor for key "${key}": ${err}`);
        continue;
      }
      const isDataDesc = Reflect.has(descriptor, "value");
      const keyedValue = descriptor?.value;
      const conditionsMet = [
        isDataDesc,
        keyedValue,
        typeof keyedValue === "object",
        !visited.has(keyedValue)
      ].every((condition) => condition);
      if (conditionsMet) {
        visited.add(keyedValue);
        const prototype = Object.getPrototypeOf(keyedValue);
        const descriptors = Object.getOwnPropertyDescriptors(keyedValue);
        const replacement = Object.create(prototype, descriptors);
        descriptor.value = deep ? customCopyObject(options, replacement, keyedValue) : replacement;
      }
      try {
        Object.defineProperty(destination, key, descriptor);
      } catch (err) {
        console.error(`Failed to define property "${key}": ${err}`);
      }
    }
  }
  return destination;
}
function ccoParseArgs(options, destination, ...sources) {
  let { deep = true, propertyHandlers = [] } = options;
  deep = !!deep;
  propertyHandlers = (Array.isArray(propertyHandlers) ? propertyHandlers : [propertyHandlers]).filter((element) => element instanceof COPropertyHandler);
  const transducer = makeTransducer(propertyHandlers, transduceFromCOHandler);
  propertyHandlers = transducer({});
  options = { deep, propertyHandlers };
  sources = sources.filter((source) => source && typeof source === "object");
  if (!destination) {
    destination = {};
  }
  return [options, destination, sources];
}

// src/utils/stdout.js
var import_extension4 = require("@nejs/extension");
function captureStdout(callback, args = [], thisArg = console) {
  let captured = "";
  const originalWrite = process.stdout.write;
  if (typeof callback !== "function") {
    let newArgs = [callback];
    if (thisArg) {
      newArgs.push(thisArg);
    }
    newArgs = newArgs.concat(args);
    callback = function() {
      console.log(...newArgs);
    };
    thisArg = console;
    args = [];
  }
  process.stdout.write = (chunk, encoding, callback2) => {
    captured += chunk;
  };
  try {
    callback.apply(thisArg, args);
  } finally {
    process.stdout.write = originalWrite;
  }
  return captured.substring(0, captured.length - 1);
}
var StringConsole = class _StringConsole {
  /**
   * @type {Array}
   * @description
   * The buffer array is used to store captured console output. It is
   * initialized as an empty array and can be populated with strings
   * representing console messages. This buffer serves as a temporary
   * storage for output that can be manipulated or inspected later.
   *
   * @example
   * const console = new StringConsole()
   * console.buffer.push('Hello, World!')
   * console.buffer // ['Hello, World!']
   */
  buffer = [];
  /**
   * The last index of the buffer when capture began. This number should be
   * set to `NaN` when not in use.
   *
   * @type {number|NaN}
   */
  capturedAt = NaN;
  /**
   * If this is `true`, all "logged" output will be captured in an ever
   * growing buffer.
   *
   * @type {boolean}
   * @see {@link StringConsole.buffer}
   */
  captureOutput = true;
  /**
   * @typedef {
   *   Int8Array|Int16Array|Int32Array|Float32Array|Float64Array
   * } TypedArray
   */
  /**
   * @typedef {(
   *   chunk: string|Buffer|TypedArray|DataView,
   *   encoding: string|null,
   *   callback: ()=>{}
   * )=>boolean} StringConsoleRecorder
   * @property {boolean} [Symbol.for('StringConsole.recorder')]
   */
  /**
   * The recorder function is what is subsituted for the `process.stdout.write`
   * function whenever we need to temporarily capture the output of data bound
   * for the bidirectional read-write stream, `stdout`.
   *
   * @type {StringConsoleRecorder}
   * @param {string|Buffer|TypedArray|DataView|any} chunk Optional data to
   * write. For streams not operating in object mode, chunk must be a
   * {@link String}, {@link Buffer}, {@link Int8Array}, {@link Int16Array},
   * {@link Int32Array}, {@link Float32Array}, {@link Float64Array} or
   * {@link DataView}. For object mode streams, chunk may be any JavaScript
   * value other than `null`.
   * @param {string|null} encoding the encoding, if chunk is a string.
   * Default: `'utf8'`
   * @param {Function} callback callback for when this chunk of data is
   * flushed.
   *
   * @returns {boolean} false if the stream wishes for the calling code to
   * wait for the 'drain' event to be emitted before continuing to write
   * additional data; otherwise true.
   */
  recorder = Object.defineProperty(
    function recorder(chunk, encoding, callback) {
      this.buffer.push(chunk);
    },
    Symbol.for(`StringConsole.recorder`),
    { value: true, configurable: true }
  );
  /**
   * Initializes a new instance of the StringConsole class.
   *
   * @param {string|string[]} [initialContents] - The initial contents to
   * populate the buffer. If an array is provided, it will be used directly
   * as the buffer. If a single string is provided, it will be converted
   * to a string and added to the buffer.
   *
   * @example
   * const console1 = new StringConsole('Hello')
   * console1.buffer // ['Hello']
   *
   * const console2 = new StringConsole(['Hello', 'World'])
   * console2.buffer // ['Hello', 'World']
   */
  constructor(captureOutput = true, initialContents = void 0) {
    this.recorder = this.recorder.bind(this);
    if (Array.isArray(initialContents))
      this.buffer = initialContents;
    else if (initialContents)
      this.buffer.push(String(initialContents));
  }
  /**
   * Clears the buffer by removing all elements.
   *
   * This method utilizes the `splice` function to remove all elements
   * from the buffer array, effectively resetting it to an empty state.
   * This is useful when you want to discard all previously captured
   * console output and start fresh.
   *
   * @returns {StringConsole} `this` to allow for calling `clear()`
   * before immediately invoking a console method.
   *
   * @example
   * const console = new StringConsole(['Hello', 'World'])
   * console.clear()
   * console.buffer // []
   */
  clear() {
    this.buffer.splice(0, this.buffer.length);
    return this;
  }
  /**
   * Checks if the console output is currently being captured.
   *
   * This method determines if the `process.stdout.write` function has been
   * overridden to capture console output by checking for the presence of
   * a specific symbol.
   *
   * @returns {boolean} True if capturing is active, false otherwise.
   *
   * @example
   * const stringConsole = new StringConsole()
   * stringConsole.startCapture()
   * console.log(stringConsole.isCapturing()) // Stores 'true' in the buffer
   */
  isCapturing() {
    return Reflect.has(
      process.stdout.write,
      Symbol.for("StringConsole.recorder")
    );
  }
  /**
   * Starts capturing console output.
   *
   * This method overrides the `process.stdout.write` function with a custom
   * recorder function to capture all console output.
   *
   * @returns {number} the last index of the buffer in its current state or
   * 0 if it is empty
   *
   * @example
   * const stringConsole = new StringConsole()
   * stringConsole.startCapture()
   * console.log('This will be stored in stringConsole.buffer')
   */
  startCapture() {
    if (this.captureOutput === false)
      this.buffer = [];
    process.stdout.write = this.recorder;
    process.stderr.write = this.recorder;
    this.capturedAt = this.buffer.length ? this.buffer.length : 0;
    return this.capturedAt;
  }
  /**
   * An object containing two properties covering the captured content
   * while `process.stdout.write` was swapped. It should contain the
   * range of line indicies as well as the content as an array of strings
   *
   * @typedef {object} StringConsoleCapturedOutput
   * @property {number[]} range an array of two numbers, a starting index
   * and an ending index. This value will be [NaN,NaN] if this instance
   * has indicated that storing captured output is disabled.
   * @property {string[]} lines an array of strings of captured output
   * that occurred in between calls to {@link ~startCapture} and then
   * ending call to {@link ~stopCapture}
   */
  /**
   * Stops capturing console output.
   *
   * This method restores the original `process.stdout.write` function,
   * ceasing the capture of console output.
   *
   * @returns {StringConsoleCapturedOutput} the range of indices capturing
   * the lines of the buffer that have been added since capturing was
   * started.
   *
   * @example
   * const stringConsole = new StringConsole()
   * stringConsole.startCapture()
   * console.log('This will be stored in stringConsole.buffer')
   * stringConsole.stopCapture()
   * console.log('This will not be captured')
   */
  stopCapture() {
    const range = [this.capturedAt || 0, this.buffer.length - 1];
    const lines = this.buffer.slice(range[0], range[1] + 1);
    if (this.captureOutput === false)
      this.buffer = [];
    process.stdout.write = _StringConsole[Symbol.for("process.stdout.write")];
    process.stderr.write = _StringConsole[Symbol.for("process.stderr.write")];
    this.capturedAt = NaN;
    return { range, lines };
  }
  /**
   * Joins the StringConsole output as a single string. By default, each entry
   * captured so far is joined on a new line. Pass a different joiner such as
   * an empty string or a whitespace character, as examples, to change the
   * output string.
   *
   * @param {string} joinOn the string to join the output buffer on, defaults
   * to a new line character
   * @returns a single string of contatenated entries so far to this buffer.
   */
  toString(joinOn = "") {
    return this.buffer.join(joinOn);
  }
  /**
   * Captures formatted debug messages as though they'd been printed. The
   * resulting output that would have been printed is stored in the buffer
   * as well as being returned.
   *
   * This method formats the provided arguments with color coding specific
   * to the 'debug' level as though `console.debug` were used. The output
   * is captured and stored in the buffer for later inspection, but not
   * actually printed to the standard output.
   *
   * @param {any[]} args - The arguments to be log captured. These can be
   * of any type and will be formatted with color coding without being logged.
   *
   * @returns {string} The captured console output as a string.
   *
   * @example
   * const stringConsole = new StringConsole()
   * stringConsole.debug('[debug]', 'message')
   * stringConsole.buffer // Contains the captured messages so far as an array
   */
  debug(...args) {
    args = this.constructor.colorArgs("debug", args);
    this.startCapture();
    console.debug(...args);
    return this.stopCapture().lines.join("\n");
  }
  /**
   * Captures formatted error messages as though they'd been printed. The
   * resulting output that would have been printed is stored in the buffer
   * as well as being returned.
   *
   * This method formats the provided arguments with color coding specific
   * to the 'error' level as though `console.error` were used. The output
   * is captured and stored in the buffer for later inspection, but not
   * actually printed to the standard output.
   *
   * @param {any[]} args - The arguments to be log captured. These can be
   * of any type and will be formatted with color coding without being logged.
   *
   * @returns {string} The captured console output as a string.
   *
   * @example
   * const stringConsole = new StringConsole()
   * stringConsole.error('[error]', 'message')
   * stringConsole.buffer // Contains the captured messages so far as an array
   */
  error(...args) {
    args = this.constructor.colorArgs("error", args);
    this.startCapture();
    console.error(...args);
    return this.stopCapture().lines.join("\n");
  }
  /**
   * Groups console output under a specified group name and captures the
   * output. No content will actually be logged to the console, just
   * the output that normally would be is formatted in a string and returned
   * instead.
   *
   * This method allows you to format multiple messages under a single
   * group name. It captures the output of each invocation and stores it in
   * a buffer. The captured output is returned as a single string.
   *
   * @param {string} groupName - The name of the group under which the
   * messages will be logged.
   * @param {...Array} invocations - An array of invocations where each
   * invocation is an array. The first element is the log level (e.g.,
   * 'log', 'info'), and the remaining elements are the arguments to be
   * logged.
   *
   * @returns {string} The captured console output as a string.
   *
   * @example
   * const console = new StringConsole()
   * const output = console.group('MyGroup',
   *   ['log', 'Hello'],
   *   ['warn', 'Warning!']
   * )
   *
   * console.buffer // Contains the captured group output
   */
  group(groupName, ...invocations) {
    const commands = ["log", "info", "warn", "error", "debug", "trace"];
    const buffer = [];
    invocations = invocations.filter((i) => commands.includes(i?.[0]));
    if (groupName)
      groupName = this.constructor.style(groupName, ["underline", "bold"]);
    else
      groupName = this.constructor.style("grouped", ["underline", "bold"]);
    this.startCapture();
    console.group(groupName);
    for (const invocation of invocations) {
      if (!Array.isArray(invocation) || invocation.length < 2)
        continue;
      const [level, ...args] = invocation;
      console[level](...this.constructor.colorArgs(level, args));
    }
    console.groupEnd(groupName);
    return this.stopCapture().lines.join("");
  }
  /**
   * Captures formatted info messages as though they'd been printed. The
   * resulting output that would have been printed is stored in the buffer
   * as well as being returned.
   *
   * This method formats the provided arguments with color coding specific
   * to the 'info' level as though `console.info` were used. The output
   * is captured and stored in the buffer for later inspection, but not
   * actually printed to the standard output.
   *
   * @param {any[]} args - The arguments to be log captured. These can be
   * of any type and will be formatted with color coding without being logged.
   *
   * @returns {string} The captured console output as a string.
   *
   * @example
   * const stringConsole = new StringConsole()
   * stringConsole.info('[info]', 'message')
   * stringConsole.buffer // Contains the captured messages so far as an array
   */
  info(...args) {
    args = this.constructor.colorArgs("info", args);
    this.startCapture();
    console.info(...args);
    return this.stopCapture().lines.join("\n");
  }
  /**
   * Captures formatted log messages as though they'd been printed. The
   * resulting output that would have been printed is stored in the buffer
   * as well as being returned.
   *
   * This method formats the provided arguments with color coding specific
   * to the 'log' level as though `console.log` were used. The output
   * is captured and stored in the buffer for later inspection, but not
   * actually printed to the standard output.
   *
   * @param {any[]} args - The arguments to be log captured. These can be
   * of any type and will be formatted with color coding without being logged.
   *
   * @returns {string} The captured console output as a string.
   *
   * @example
   * const stringConsole = new StringConsole()
   * stringConsole.log('[log]', 'message')
   * stringConsole.buffer // Contains the captured messages so far as an array
   */
  log(...args) {
    args = this.constructor.colorArgs("log", args);
    this.startCapture();
    console.log(...args);
    return this.stopCapture().lines.join("\n");
  }
  /**
   * Captures formatted trace messages as though they'd been printed. The
   * resulting output that would have been printed is stored in the buffer
   * as well as being returned.
   *
   * This method formats the provided arguments with color coding specific
   * to the 'trace' level as though `console.trace` were used. The output
   * is captured and stored in the buffer for later inspection, but not
   * actually printed to the standard output.
   *
   * @param {any[]} args - The arguments to be log captured. These can be
   * of any type and will be formatted with color coding without being logged.
   *
   * @returns {string} The captured console output as a string.
   *
   * @example
   * const stringConsole = new StringConsole()
   * stringConsole.trace('[trace]', 'message')
   * stringConsole.buffer // Contains the captured messages so far as an array
   */
  trace(...args) {
    args = this.constructor.colorArgs("trace", args);
    this.startCapture();
    console.trace(...args);
    return this.stopCapture().lines.join("\n");
  }
  /**
   * Captures formatted warn messages as though they'd been printed. The
   * resulting output that would have been printed is stored in the buffer
   * as well as being returned.
   *
   * This method formats the provided arguments with color coding specific
   * to the 'warn' level as though `console.warn` were used. The output
   * is captured and stored in the buffer for later inspection, but not
   * actually printed to the standard output.
   *
   * @param {any[]} args - The arguments to be log captured. These can be
   * of any type and will be formatted with color coding without being logged.
   *
   * @returns {string} The captured console output as a string.
   *
   * @example
   * const stringConsole = new StringConsole()
   * stringConsole.warn('[warn]', 'message')
   * stringConsole.buffer // Contains the captured messages so far as an array
   */
  warn(...args) {
    args = this.constructor.colorArgs("warn", args);
    this.startCapture();
    console.warn(...args);
    return this.stopCapture().lines.join("\n");
  }
  /**
   * Captures a single line of text that would be logged to the console if
   * the console function of the same name were to be invoked. The string
   * is formatted according to the log colors, or any pre-existing colors as
   * those are untouched. After formatting, the string is returned.
   *
   * @param {...*} args the arguments to be logged. These can be of any
   *   type and will be passed to the underlying console's method of the same
   *   name.
   *
   * @returns {string}
   *
   * @example
   * const string = StringConsole.debug('[debug]: %o', someVariable)
   */
  static debug(...args) {
    return this.#console.clear().debug(...args);
  }
  /**
   * Captures a single line of text that would be logged to the console if
   * the console function of the same name were to be invoked. The string
   * is formatted according to the log colors, or any pre-existing colors as
   * those are untouched. After formatting, the string is returned.
   *
   * @param {...*} args the arguments to be logged. These can be of any
   *   type and will be passed to the underlying console's method of the same
   *   name.
   *
   * @returns {string}
   *
   * @example
   * const string = StringConsole.error('[error]: %o', someVariable)
   */
  static error(...args) {
    return this.#console.clear().error(...args);
  }
  /**
   * Groups console output under a specified group name and captures the
   * output. No content will actually be logged to the console, just
   * the output that normally would be is formatted in a string and returned
   * instead.
   *
   * This method allows you to format multiple messages under a single
   * group name. It captures the output of each invocation and stores it in
   * a buffer. The captured output is returned as a single string.
   *
   * @param {string} groupName - The name of the group under which the
   * messages will be logged.
   * @param {...Array} invocations - An array of invocations where each
   * invocation is an array. The first element is the log level (e.g.,
   * 'log', 'info'), and the remaining elements are the arguments to be
   * logged.
   *
   * @returns {string} The captured console output as a string.
   *
   * @example
   * const console = new StringConsole()
   * const output = console.group('MyGroup',
   *   ['log', 'Hello'],
   *   ['warn', 'Warning!']
   * )
   *
   * console.buffer // Contains the captured group output
   */
  static group(groupName, ...invocations) {
    return this.#console.clear().group(groupName, ...invocations);
  }
  /**
   * Captures a single line of text that would be logged to the console if
   * the console function of the same name were to be invoked. The string
   * is formatted according to the log colors, or any pre-existing colors as
   * those are untouched. After formatting, the string is returned.
   *
   * @param {...*} args the arguments to be logged. These can be of any
   *   type and will be passed to the underlying console's method of the same
   *   name.
   *
   * @returns {string}
   *
   * @example
   * const string = StringConsole.info('[info]: %o', someVariable)
   */
  static info(...args) {
    return this.#console.clear().info(...args);
  }
  /**
   * Captures a single line of text that would be logged to the console if
   * the console function of the same name were to be invoked. The string
   * is formatted according to the log colors, or any pre-existing colors as
   * those are untouched. After formatting, the string is returned.
   *
   * @param {...*} args the arguments to be logged. These can be of any
   *   type and will be passed to the underlying console's method of the same
   *   name.
   *
   * @returns {string}
   *
   * @example
   * const string = StringConsole.log('[log]: %o', someVariable)
   */
  static log(...args) {
    return this.#console.clear().log(...args);
  }
  /**
   * Captures a single line of text that would be logged to the console if
   * the console function of the same name were to be invoked. The string
   * is formatted according to the log colors, or any pre-existing colors as
   * those are untouched. After formatting, the string is returned.
   *
   * @param {...*} args the arguments to be logged. These can be of any
   *   type and will be passed to the underlying console's method of the same
   *   name.
   *
   * @returns {string}
   *
   * @example
   * const string = StringConsole.trace('[trace]: %o', someVariable)
   */
  static trace(...args) {
    return this.#console.clear().trace(...args);
  }
  /**
   * Captures a single line of text that would be logged to the console if
   * the console function of the same name were to be invoked. The string
   * is formatted according to the log colors, or any pre-existing colors as
   * those are untouched. After formatting, the string is returned.
   *
   * @param {...*} args the arguments to be logged. These can be of any
   *   type and will be passed to the underlying console's method of the same
   *   name.
   *
   * @returns {string}
   *
   * @example
   * const string = StringConsole.warn('[warn]: %o', someVariable)
   */
  static warn(...args) {
    return this.#console.clear().warn(...args);
  }
  /**
   * Internal instance of {@link StringConsole} used for static logging
   * methods.
   *
   * @type {StringConsole}
   */
  static #console = new _StringConsole(false);
  /**
   * A static map defining color codes for console output. Each color is
   * associated with an array containing two numbers, which represent
   * the ANSI escape codes for styling text in the terminal.
   *
   * The first number in the array is the suffix code for the standard
   * color, while the second number suffix code to undo the color. These
   * codes are useless without the pen prefix code.
   *
   * @type {Map<string, number[]>}
   * @see {@link StringConsole.pens}
   *
   * @example
   * // Accessing the color codes for 'red'
   * const redCodes = StringConsole.colors.get('red')
   * const fgCodes = StringConsole.pens.get('foreground')
   * const prefix = `\x1b[${fgCodes[0]}${redCodes[0]}m`
   * const suffix = `\x1b[${fgCodes[1]}${redCodes[1]}m`
   * // Outputs: "Text" in red but "!!" in the default color
   * console.log(`${prefix}Text!!${suffix}`)
   *
   * @description
   * This map is used to apply color coding to console messages, enhancing
   * readability and providing visual cues for different log levels.
   */
  static colors = /* @__PURE__ */ new Map([
    ["black", [0, 9]],
    ["red", [1, 9]],
    ["green", [2, 9]],
    ["yellow", [3, 9]],
    ["blue", [4, 9]],
    ["magenta", [5, 9]],
    ["cyan", [6, 9]],
    ["white", [7, 9]]
  ]);
  /**
   * A static map defining the color schemes for different logging levels.
   * Each log level is associated with an array of color styles that are
   * applied to the console output for that level.
   *
   * The available log levels and their corresponding color styles are:
   * - 'log': White
   * - 'info': Cyan
   * - 'warn': Yellow
   * - 'error': Red
   * - 'trace': Magenta
   * - 'debug': Bold Yellow
   *
   * @type {Map<string, string[]>}
   *
   * @example
   * const logColor = StringConsole.levels.get('log') // ['white']
   * const errorColor = StringConsole.levels.get('error') // ['red']
   */
  static levels = Object.defineProperties(/* @__PURE__ */ new Map([
    ["log", ["white"]],
    ["info", ["cyan"]],
    ["warn", ["yellow"]],
    ["error", ["red"]],
    ["trace", ["magenta"]],
    ["debug", ["bold", "yellow"]]
  ]), {
    color: {
      value: function color(key) {
        for (const value of this.get(key)) {
          if (_StringConsole.colors.has(value)) {
            return _StringConsole.colors.get(value);
          }
        }
        return _StringConsole.colors.get("white");
      },
      configurable: true
    },
    styles: {
      value: function styles(key) {
        const styles2 = [];
        for (const value of this.get(key)) {
          if (_StringConsole.styles.has(value)) {
            styles2.push(_StringConsole.styles.get(value));
          }
        }
        return styles2;
      },
      configurable: true
    }
  });
  /**
   * A static map defining the ANSI escape codes for different pen styles
   * used in console output. Each pen style is associated with an array
   * containing two numbers: the first for setting the style and the second
   * for resetting it.
   *
   * The available pen styles and their corresponding ANSI codes are:
   * - 'foreground': [3, 3] - Standard foreground color
   * - 'background': [4, 4] - Standard background color
   * - 'bright.foreground': [9, 3] - Bright foreground color
   * - 'bright.background': [10, 4] - Bright background color
   *
   * These are prefixes for both enabling and disabling. Normally a red color
   * is represented using SGR (Select Graphic Rendition) codes like \x1b[31m
   * for the foreground and \x1b[39m to return to normal color. So the 3
   * determines a foreground prefix for starting and stopping (the 3's in 31
   * and 39). Background prefixes are usually 4. These change for bright
   * colors which use 9 and 3, and 10 and 4, respectively.
   *
   * @type {Map<string, number[]>}
   *
   * @example
   * // [3, 3]
   * const foregroundPen = StringConsole.pens.get('foreground')
   *
   * // [10, 4]
   * const brightBackgroundPen = StringConsole.pens.get('bright.background')
   */
  static pens = /* @__PURE__ */ new Map([
    ["foreground", [3, 3]],
    ["background", [4, 4]],
    ["bright.foreground", [9, 3]],
    ["bright.background", [10, 4]]
  ]);
  /**
   * A static map defining ANSI escape codes for various text styles used
   * in console output. Each style is associated with an array containing
   * two escape codes: one for enabling the style and one for disabling it.
   *
   * The available styles and their corresponding ANSI codes are:
   * - 'reset': Resets all styles to default.
   * - 'blink': Enables blinking text.
   * - 'bold': Makes text bold.
   * - 'conceal': Conceals text.
   * - 'dim': Dims the text.
   * - 'italics': Italicizes the text.
   * - 'negative': Inverts the foreground and background colors.
   * - 'strike': Strikes through the text.
   * - 'underline': Underlines the text.
   *
   * @type {Map<string, string[]>}
   *
   * @example
   * const boldStyle = StringConsole.styles.get('bold')
   * // ['\x1b[1m', '\x1b[22m']
   */
  static styles = /* @__PURE__ */ new Map([
    ["reset", ["\x1B[0m"]],
    ["blink", ["\x1B[5m", "\x1B[25m"]],
    ["bold", ["\x1B[1m", "\x1B[22m"]],
    ["conceal", ["\x1B[8m", "\x1B[28m"]],
    ["dim", ["\x1B[2m", "\x1B[22m"]],
    ["italics", ["\x1B[3m", "\x1B[23m"]],
    ["negative", ["\x1B[7m", "\x1B[27m"]],
    ["strike", ["\x1B[9m", "\x1B[29m"]],
    ["underline", ["\x1B[4m", "\x1B[24m"]]
  ]);
  /**
   * Applies ANSI color codes to a given string based on specified options.
   * This method checks if the string already contains color codes or if
   * the input is not a string, in which case it returns the original input.
   * Otherwise, it formats the string with the specified color and pen
   * options.
   *
   * @param {string} string - The string to be colorized.
   * @param {Object} [options] - Configuration options for colorization.
   * @param {string} [options.level] - The log level determining
   *   which colors to apply.
   * @param {number[]} [options.rgb8] a single color code where 0 - 7, for
   * the 'standard' colors specified by the SGR sequences 30 to 37; 8-15 are
   * high intensity or bright colors,
   * @param {number[]} [options.rgb24] An array of three values, ordered, red,
   *   green and then blue. The values should range from 0 to 255.
   * @param {string|string[]} [options.styles] defaulting to an empty array, if
   *   supplied with a single known style {@link ~styles}, or an array of them.
   * @param {string} [options.pen='foreground'] - The pen type for color
   *   application, either 'foreground' or 'background'.
   * @param {Array} [options.buffer=[]] - An array to prepend to the
   *   formatted string.
   * @param {Array} [options.before=[]] - An array of strings to prepend
   *   before the main string.
   * @param {Array} [options.after=[]] - An array of strings to append
   *   after the main string. 16 - 231, for the colors in the 6 × 6 × 6 cube
   *   defined by 16 + 36 × r + 6 × g + b (0 ≤ r, g, b ≤ 5); 232-255:
   *   grayscale from dark to light in 24 steps.
   *
   * @returns {string} The colorized string with ANSI codes applied.
   *
   * @example
   * const coloredString = StringConsole.color('Hello', {
   *   level: 'info',
   *   pen: 'bright.foreground'
   * })
   * console.log(coloredString)
   */
  static color(string, options = {
    level: void 0,
    color: void 0,
    pen: "foreground",
    rgb8: void 0,
    rgb24: [186, 186, 186],
    styles: [],
    buffer: [],
    before: [],
    after: []
  }) {
    const { colors: Colors, styles: Styles, pens: Pens, levels: Levels } = this;
    let useColors = void 0;
    let useRGB = false;
    let styles = [];
    const pens = this.pens.get(options?.pen ?? "foreground");
    const [p0, p1] = pens;
    if (options?.styles) {
      if (Array.isArray(options.styles))
        styles = options.styles.filter((s) => Styles.has(s)).map((s) => Styles.get(s));
      else if (typeof options.styles === "string" && Styles.has(options.styles))
        styles = Styles.get(options.styles);
    }
    if (options?.level && Levels.has(options.level)) {
      useColors = Levels.color(options.level);
      const addlStyles = Levels.styles(options.level);
      if (addlStyles.length)
        styles = styles.concat(addlStyles);
    } else if (options?.color && Colors.has(options.color))
      useColors = Colors.get(options.color);
    else if (options?.rgb24 && Array.isArray(options.rgb24)) {
      useColors = [`\x1B[${p0}8;2;${options.rgb24.join(";")};m`, `\x1B[${p1}9m`];
      useRGB = true;
    } else if (options?.rgb8 && typeof options.rgb8 === "number") {
      useColors = [`\x1B[${p0}8;5;${options.rgb8}m`, `\x1B[${p1}9m`];
      useRGB = true;
    } else useColors = [9, 9];
    const [c0, c1] = useRGB ? useColors : useColors?.map((c, i) => `\x1B[${pens[i]}${c}m`) ?? [`\x1B[39;49m`];
    if (this.hasColor(string)) return string;
    if (typeof string !== "string") return string;
    if (string instanceof String) string = String(string);
    if (!useColors) return string;
    if (options?.buffer && !Array.isArray(options.buffer))
      options.buffer = [String(options.buffer)];
    if (options?.before && !Array.isArray(options.before))
      options.before = [String(options.before)];
    if (options?.after && !Array.isArray(options.after))
      options.after = [String(options.after)];
    const buffer = [].concat(options?.buffer ?? []);
    const before = [].concat(options?.before ?? []);
    const after = [].concat(options?.after ?? []);
    if (c0)
      before.push(c0);
    if (c1)
      after.push(c1);
    for (const style of styles) {
      if (style?.[0])
        before.push(style[0]);
      if (style?.[1])
        after.push(style[1]);
    }
    return [...buffer, before.join(""), string, after.join("")].join("");
  }
  /**
   * Applies color formatting to each argument based on the specified log level.
   *
   * This method processes an array of arguments, applying color formatting
   * to each one according to the provided log level. The color formatting
   * is determined by the `color` method, which uses the log level to
   * select the appropriate color scheme.
   *
   * @param {string} level - The log level that determines the color scheme
   * to be applied. Common levels include 'log', 'info', 'warn', 'error',
   * etc.
   * @param {Array} args - An array of arguments to be formatted. Each
   * argument will be processed individually to apply the color formatting.
   *
   * @returns {Array} A new array containing the formatted arguments with
   * color applied.
   *
   * @example
   * const formattedArgs = StringConsole.colorArgs(
   *   'info',
   *   ['Message 1', 'Message 2']
   * )
   * // formattedArgs will contain the messages with 'info' level
   * // color formatting
   */
  static colorArgs(level, args) {
    const newArgs = [];
    if (args === null || args === void 0 || !Array.isArray(args))
      return args;
    for (const arg of args) {
      newArgs.push(this.color(arg, { level }));
    }
    return newArgs;
  }
  /**
   * Determines if a given string contains ANSI color codes.
   *
   * This method checks for the presence of ANSI escape codes in the
   * provided string, which are used for color formatting in terminal
   * outputs. The presence of these codes indicates that the string
   * has color formatting applied.
   *
   * @param {string} string - The string to be checked for ANSI color codes.
   *
   * @returns {boolean} Returns true if the string contains ANSI color codes,
   * otherwise false.
   *
   * @example
   * const hasColor = StringConsole.hasColor('\x1b[31mRed Text\x1b[0m')
   * // hasColor will be true
   *
   * const noColor = StringConsole.hasColor('Plain Text')
   * // noColor will be false
   */
  static hasColor(string) {
    return string.includes("\x1B[");
  }
  /**
   * Applies a series of styles to a given string using ANSI escape codes.
   *
   * This method takes a string and an array of style names or style arrays,
   * and applies the corresponding ANSI escape codes to the string. The
   * styles are defined in the `styles` map, which associates style names
   * with their respective ANSI codes.
   *
   * @param {string} string - The string to which styles will be applied.
   * @param {string|string[]} styles - A style name or an array of style
   *   names/arrays to be applied. Each style can be a string that matches
   *   a key in the `styles` map or an array containing ANSI codes.
   *
   * @returns {string} The styled string with ANSI escape codes applied.
   *
   * @example
   * const styledText = StringConsole.style('Hello', ['bold', 'underline'])
   * // styledText will have 'Hello' with bold and underline styles
   */
  static style(string, styles) {
    const before = [];
    const after = [];
    const buffer = [];
    if (typeof styles === "string" && this.styles.has(styles)) {
      styles = [styles];
    }
    for (const style of styles) {
      let group = [];
      if (this.styles.has(style))
        group = this.styles.get(style);
      else if (Array.isArray(style) && style.length >= 1)
        group = style;
      if (group?.[0])
        before.push(group?.[0]);
      if (group?.[1])
        after.push(group?.[1]);
    }
    return [before.join(""), string, after.join("")].join("");
  }
  static {
    Object.defineProperties(_StringConsole, {
      [Symbol.for("process.stdout.write")]: {
        value: Object.defineProperties(process.stdout.write, {
          [Symbol.for("original")]: { value: true, configurable: true },
          isOriginal: { get() {
            return true;
          }, configurable: true }
        }),
        configurable: true
      },
      [Symbol.for("process.stderr.write")]: {
        value: Object.defineProperties(process.stderr.write, {
          [Symbol.for("original")]: { value: true, configurable: true },
          isOriginal: { get() {
            return true;
          }, configurable: true }
        }),
        configurable: true
      }
    });
    if (!Reflect.has(_StringConsole, "writer")) {
      Object.defineProperties(_StringConsole, {
        writer: {
          value: _StringConsole[Symbol.for("process.stdout.write")],
          configurable: true
        },
        errorWriter: {
          value: _StringConsole[Symbol.for("process.stderr.write")],
          configurable: true
        }
      });
    }
  }
};
var StringConsoleExtension = new import_extension4.Extension(StringConsole);
var StdoutGlobalPatches = new import_extension4.Patch(globalThis, {
  [import_extension4.Patch.kMutablyHidden]: {
    captureStdout
  }
});

// src/utils/toolkit.js
var map2 = /* @__PURE__ */ new Map([
  ["object", Object],
  [Object, "object"],
  ["Object", Object],
  ["number", Number],
  [Number, "number"],
  ["Number", Number],
  ["string", String],
  [String, "string"],
  ["String", String],
  ["function", Function],
  [Function, "function"],
  ["Function", Function],
  ["boolean", Boolean],
  [Boolean, "boolean"],
  ["Boolean", Boolean],
  ["bigint", BigInt],
  [BigInt, "bigint"],
  ["BigInt", BigInt],
  ["symbol", Symbol],
  [Symbol, "symbol"],
  ["Symbol", Symbol],
  ["undefined", void 0],
  [void 0, "undefined"],
  ["null", null],
  [null, "null"]
]);
var is = {
  /**
   * Checks if a value matches a specified type or class.
   *
   * This function determines if the provided value matches the specified
   * type or class. It supports both primitive types and class constructors.
   *
   * @param {*} value - The value to check.
   * @param {*} typeOrClass - The type or class to compare against.
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
  a(value, typeOrClass) {
    const valueType = typeof value;
    const valueTag = this.object(value) && value[Symbol.toStringTag];
    if (value === typeOrClass)
      return true;
    if (this.function(typeOrClass)) {
      const typeTag = this.object(typeOrClass) && typeOrClass[Symbol.toStringTag];
      if (valueTag && valueTag === typeOrClass.name)
        return true;
      if (typeOrClass?.prototype && value instanceof typeOrClass)
        return true;
      return map2.get(valueType) === typeOrClass;
    } else if (map2.get(valueType)?.name === typeOrClass)
      return true;
    else if (valueType === typeOrClass || valueTag === typeOrClass)
      return true;
    return false;
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
   * is.accessorDescriptor({ get: () => 42, set: () => {} })
   *
   * // Returns false
   * is.accessorDescriptor({ value: 42, writable: true })
   */
  accessorDescriptor(value) {
    return !!(this.descriptor(value) && (value?.get || value?.set) && value?.writable === void 0 && value?.value === void 0);
  },
  /**
   * Check if a value is an array.
   *
   * @param value The value to check.
   * @returns True if the value is an array, false otherwise.
   *
   * @example
   * is.array([1, 2, 3]) // true
   * is.array('string') // false
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
   * is.bigint(123n) // true
   * is.bigint(123) // false
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
   * is.boolean(true) // true
   * is.boolean(false) // true
   * is.boolean(1) // false
   * is.boolean("true") // false
   */
  boolean(value) {
    return [true, false].some((bool) => bool === value);
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
   * is.callable(function() {}) // true
   */
  callable(object) {
    return this.function(object);
  },
  /**
   * Check if an object is a callable descriptor. It looks to see if the
   * object represents a descriptor that is callable by checking object
   * properties named `value`, `get`, and `set`. If any of the three
   * yields a function type, true is returned.
   *
   * @param object The object to check.
   * @returns True if the object is a callable descriptor, false otherwise.
   *
   * @example
   * is.callableDescriptor({ get: function() {} }) // true
   * is.callableDescriptor(123) // false
   *
   * // Note the differences between these
   * const object = { get name() { return "Brie"; } }
   * const descriptor = Object.getOwnPropertyDescriptor(object, 'name')
   * is.callableDescriptor(object) // false
   * is.callableDescriptor(descriptor) // true
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
   * the accessor descriptors `get` or `set`.
   *
   * @param value The value to check.
   * @returns True if the value is a data descriptor, false otherwise.
   *
   * @example
   * // Returns true
   * is.dataDescriptor({ value: 42, writable: true })
   *
   * // Returns false
   * is.dataDescriptor({ get: () => 42, set: () => {} })
   */
  dataDescriptor(value) {
    return !!(this.descriptor(value) && (value?.value !== void 0 || value?.writable !== void 0) && value?.get === void 0 && value?.set === void 0);
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
   * is.descriptor({ configurable: true, enumerable: false }) // true
   * is.descriptor({ get: () => {}, set: () => {} }) // true
   * is.descriptor({}) // false
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
   * is.false(false) // true
   * is.false(true) // false
   * is.false(0) // false
   */
  false(value) {
    return value === false;
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
   * is.falsy(0) // true
   * is.falsy("") // true
   * is.falsy(1) // false
   * is.falsy("hello") // false
   */
  falsy(value) {
    return !!!value;
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
   * is.falsey(0) // true
   * is.falsey("") // true
   * is.falsey(1) // false
   * is.falsey("hello") // false
   */
  falsey(value) {
    return this.falsy(value);
  },
  /**
   * Check if a value is a function.
   *
   * @param value The value to check.
   * @returns True if the value is a function, false otherwise.
   *
   * @example
   * is.function(function() {}) // true
   * is.function(123) // false
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
   * is.iterable([1, 2, 3]) // true
   * is.iterable('string') // true
   * is.iterable(123) // false
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
   * is.nullish(null) // true
   * is.nullish(undefined) // true
   * is.nullish('value') // false
   */
  nullish(value) {
    return value === null || value === void 0;
  },
  /**
   * Check if a value is a number.
   *
   * @param value The value to check.
   * @returns True if the value is a number, false otherwise.
   *
   * @example
   * is.number(123) // true
   * is.number('123') // false
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
   * is.object({}) // true
   * is.object(null) // false
   */
  object(value) {
    return !!(value && typeof value === "object");
  },
  /**
   * The {@link Object#entries} function returns the properties of a given
   * value as an array of arrays where each element of the inner arrays is
   * a valid object key (so one of {@link String}, {@link Number}, or
   * {@link Symbol}) and the second element is the value of the pair which
   * can be any type.
   *
   * This function vets this criteria and would return true for each entry
   * in the returned outer array of a call to {@link Object#entries}.
   *
   * @param {any} value the value to test
   * @returns {boolean} true if the value is a valid object entry in the
   * form of `[key, value]`.
   */
  objectEntry(value) {
    if (!// Must be an array
    (Array.isArray(value) && // Must have only two elements
    value.length == 2 && // Must have its first element be string|number|symbol
    (this.string(value[0]) || this.number(value[0]) || this.symbol(value[0])))) {
      return false;
    }
    return true;
  },
  /**
   * Check if a value is a valid object key. Valid object keys are strings,
   * numbers, or symbols — the same types accepted as property keys in
   * JavaScript objects.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is a string, number, or symbol,
   * false otherwise.
   *
   * @example
   * is.objectKey('name') // true
   * is.objectKey(0) // true
   * is.objectKey(Symbol('id')) // true
   * is.objectKey({}) // false
   * is.objectKey(null) // false
   */
  objectKey(value) {
    return this.string(value) || this.number(value) || this.symbol(value);
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
   * is.primitive('hello')
   *
   * // Returns true
   * is.primitive(123)
   *
   * // Returns true
   * is.primitive(true)
   *
   * // Returns true
   * is.primitive(123n)
   *
   * // Returns true
   * is.primitive(Symbol('symbol'))
   *
   * // Returns false
   * is.primitive({})
   *
   * // Returns false
   * is.primitive([])
   */
  primitive(value) {
    if (this.nullish(value))
      return true;
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
   * is.shiny({}) // true
   * is.shiny(function() {}) // true
   * is.shiny(123) // false
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
   * is.string('hello') // true
   * is.string(123) // false
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
   * is.symbol(Symbol('foo')) // Returns true
   * is.symbol('foo') // Returns false
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
   * is.true(true) // true
   * is.true(false) // false
   * is.true(1) // false
   */
  true(value) {
    return value === true;
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
   * is.truthy(1) // true
   * is.truthy("hello") // true
   * is.truthy(0) // false
   * is.truthy("") // false
   */
  truthy(value) {
    return !!value;
  }
};
var si = {
  /**
   * Inline if-then-else based on whether value matches a specified type or
   * class. Delegates the condition check to {@link is#a}.
   *
   * @param {*} value - The value to check.
   * @param {*} typeOrClass - The type or class to compare against.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value matches typeOrClass.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value does not match typeOrClass.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.a(42, 'number', 'yes', 'no') // 'yes'
   * si.a('str', Number, 'yes', 'no') // 'no'
   * si.a(42, 'number', () => 'computed', 'no') // 'computed'
   */
  a(value, typeOrClass, thenValue, elseValue) {
    return ifThenElse(is.a(value, typeOrClass), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is an accessor descriptor.
   * Delegates the condition check to {@link is#accessorDescriptor}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is an accessor descriptor.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not an accessor descriptor.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.accessorDescriptor({ get: () => 42 }, 'yes', 'no') // 'yes'
   * si.accessorDescriptor({ value: 42 }, 'yes', 'no') // 'no'
   * si.accessorDescriptor({ get: () => 42 }, () => 'computed', 'no') // 'computed'
   */
  accessorDescriptor(value, thenValue, elseValue) {
    return ifThenElse(is.accessorDescriptor(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is an array.
   * Delegates the condition check to {@link is#array}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is an array.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not an array.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.array([1, 2, 3], 'yes', 'no') // 'yes'
   * si.array('string', 'yes', 'no') // 'no'
   * si.array([1, 2, 3], () => 'computed', 'no') // 'computed'
   */
  array(value, thenValue, elseValue) {
    return ifThenElse(is.array(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a bigint.
   * Delegates the condition check to {@link is#bigint}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a bigint.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a bigint.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.bigint(123n, 'yes', 'no') // 'yes'
   * si.bigint(123, 'yes', 'no') // 'no'
   * si.bigint(123n, () => 'computed', 'no') // 'computed'
   */
  bigint(value, thenValue, elseValue) {
    return ifThenElse(is.bigint(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a boolean.
   * Delegates the condition check to {@link is#boolean}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a boolean.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a boolean.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.boolean(true, 'yes', 'no') // 'yes'
   * si.boolean(1, 'yes', 'no') // 'no'
   * si.boolean(false, () => 'computed', 'no') // 'computed'
   */
  boolean(value, thenValue, elseValue) {
    return ifThenElse(is.boolean(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether object is callable.
   * Delegates the condition check to {@link is#callable}.
   *
   * @param {*} object - The object to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if object is callable.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if object is not callable.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.callable(function() {}, 'yes', 'no') // 'yes'
   * si.callable(123, 'yes', 'no') // 'no'
   * si.callable(function() {}, () => 'computed', 'no') // 'computed'
   */
  callable(object, thenValue, elseValue) {
    return ifThenElse(is.callable(object), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether object is a callable descriptor.
   * Delegates the condition check to {@link is#callableDescriptor}.
   *
   * @param {*} object - The object to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if object is a callable descriptor.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if object is not a callable descriptor.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.callableDescriptor({ get: function() {} }, 'yes', 'no') // 'yes'
   * si.callableDescriptor(123, 'yes', 'no') // 'no'
   * si.callableDescriptor({ get: function() {} }, () => 'computed', 'no') // 'computed'
   */
  callableDescriptor(object, thenValue, elseValue) {
    return ifThenElse(is.callableDescriptor(object), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a data property descriptor.
   * Delegates the condition check to {@link is#dataDescriptor}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a data descriptor.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a data descriptor.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.dataDescriptor({ value: 42, writable: true }, 'yes', 'no') // 'yes'
   * si.dataDescriptor({ get: () => 42 }, 'yes', 'no') // 'no'
   * si.dataDescriptor({ value: 42 }, () => 'computed', 'no') // 'computed'
   */
  dataDescriptor(value, thenValue, elseValue) {
    return ifThenElse(is.dataDescriptor(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a property descriptor.
   * Delegates the condition check to {@link is#descriptor}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a property descriptor.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a property descriptor.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.descriptor({ configurable: true }, 'yes', 'no') // 'yes'
   * si.descriptor({}, 'yes', 'no') // 'no'
   * si.descriptor({ get: () => {} }, () => 'computed', 'no') // 'computed'
   */
  descriptor(value, thenValue, elseValue) {
    return ifThenElse(is.descriptor(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is strictly false.
   * Delegates the condition check to {@link is#false}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is strictly false.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not strictly false.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.false(false, 'yes', 'no') // 'yes'
   * si.false(0, 'yes', 'no') // 'no'
   * si.false(false, () => 'computed', 'no') // 'computed'
   */
  false(value, thenValue, elseValue) {
    return ifThenElse(is.false(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is falsy.
   * Delegates the condition check to {@link is#falsy}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is falsy.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not falsy.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.falsy(0, 'yes', 'no') // 'yes'
   * si.falsy(1, 'yes', 'no') // 'no'
   * si.falsy('', () => 'computed', 'no') // 'computed'
   */
  falsy(value, thenValue, elseValue) {
    return ifThenElse(is.falsy(value), thenValue, elseValue);
  },
  /**
   * Alias for {@link si#falsy}. Inline if-then-else based on whether value
   * is falsy. Delegates the condition check to {@link is#falsey}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is falsy.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not falsy.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.falsey(0, 'yes', 'no') // 'yes'
   * si.falsey(1, 'yes', 'no') // 'no'
   * si.falsey('', () => 'computed', 'no') // 'computed'
   */
  falsey(value, thenValue, elseValue) {
    return ifThenElse(is.falsey(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a function.
   * Delegates the condition check to {@link is#function}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a function.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a function.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.function(function() {}, 'yes', 'no') // 'yes'
   * si.function(123, 'yes', 'no') // 'no'
   * si.function(function() {}, () => 'computed', 'no') // 'computed'
   */
  function(value, thenValue, elseValue) {
    return ifThenElse(is.function(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is iterable.
   * Delegates the condition check to {@link is#iterable}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is iterable.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not iterable.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.iterable([1, 2, 3], 'yes', 'no') // 'yes'
   * si.iterable(123, 'yes', 'no') // 'no'
   * si.iterable('string', () => 'computed', 'no') // 'computed'
   */
  iterable(value, thenValue, elseValue) {
    return ifThenElse(is.iterable(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is null or undefined.
   * Delegates the condition check to {@link is#nullish}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is nullish.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not nullish.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.nullish(null, 'yes', 'no') // 'yes'
   * si.nullish('value', 'yes', 'no') // 'no'
   * si.nullish(undefined, () => 'computed', 'no') // 'computed'
   */
  nullish(value, thenValue, elseValue) {
    return ifThenElse(is.nullish(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a number.
   * Delegates the condition check to {@link is#number}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a number.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a number.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.number(123, 'yes', 'no') // 'yes'
   * si.number('123', 'yes', 'no') // 'no'
   * si.number(123, () => 'computed', 'no') // 'computed'
   */
  number(value, thenValue, elseValue) {
    return ifThenElse(is.number(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is an object.
   * Delegates the condition check to {@link is#object}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is an object.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not an object.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.object({}, 'yes', 'no') // 'yes'
   * si.object(null, 'yes', 'no') // 'no'
   * si.object({}, () => 'computed', 'no') // 'computed'
   */
  object(value, thenValue, elseValue) {
    return ifThenElse(is.object(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a valid object entry.
   * Delegates the condition check to {@link is#objectEntry}.
   *
   * @param {any} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a valid object entry.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a valid object entry.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.objectEntry(['key', 42], 'yes', 'no') // 'yes'
   * si.objectEntry([1, 2, 3], 'yes', 'no') // 'no'
   * si.objectEntry(['key', 42], () => 'computed', 'no') // 'computed'
   */
  objectEntry(value, thenValue, elseValue) {
    return ifThenElse(is.objectEntry(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a valid object key.
   * Delegates the condition check to {@link is#objectKey}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a valid object key.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a valid object key.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.objectKey('name', 'yes', 'no') // 'yes'
   * si.objectKey({}, 'yes', 'no') // 'no'
   * si.objectKey(Symbol('id'), () => 'computed', 'no') // 'computed'
   */
  objectKey(value, thenValue, elseValue) {
    return ifThenElse(is.objectKey(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a primitive type.
   * Delegates the condition check to {@link is#primitive}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a primitive.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a primitive.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.primitive('hello', 'yes', 'no') // 'yes'
   * si.primitive({}, 'yes', 'no') // 'no'
   * si.primitive(123, () => 'computed', 'no') // 'computed'
   */
  primitive(value, thenValue, elseValue) {
    return ifThenElse(is.primitive(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is shiny (object or function).
   * Delegates the condition check to {@link is#shiny}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is shiny.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not shiny.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.shiny({}, 'yes', 'no') // 'yes'
   * si.shiny(123, 'yes', 'no') // 'no'
   * si.shiny(function() {}, () => 'computed', 'no') // 'computed'
   */
  shiny(value, thenValue, elseValue) {
    return ifThenElse(is.shiny(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a string.
   * Delegates the condition check to {@link is#string}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a string.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a string.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.string('hello', 'yes', 'no') // 'yes'
   * si.string(123, 'yes', 'no') // 'no'
   * si.string('hello', () => 'computed', 'no') // 'computed'
   */
  string(value, thenValue, elseValue) {
    return ifThenElse(is.string(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a symbol.
   * Delegates the condition check to {@link is#symbol}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a symbol.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a symbol.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.symbol(Symbol('foo'), 'yes', 'no') // 'yes'
   * si.symbol('foo', 'yes', 'no') // 'no'
   * si.symbol(Symbol('foo'), () => 'computed', 'no') // 'computed'
   */
  symbol(value, thenValue, elseValue) {
    return ifThenElse(is.symbol(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else using an arbitrary condition. If condition is a
   * function, it is called and its result is used as the condition; otherwise
   * the condition value is evaluated directly.
   *
   * @param {function|*} condition - The condition to evaluate. If a function,
   *   it is called and its return value is used as the condition.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if the condition is truthy.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if the condition is falsy.
   * @returns {*} The result of thenValue if the condition is truthy,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.then(true, 'yes', 'no') // 'yes'
   * si.then(false, 'yes', 'no') // 'no'
   * si.then(() => true, 'yes', 'no') // 'yes'
   * si.then(() => false, () => 'computed', 'no') // 'no'
   */
  then(condition, thenValue, elseValue) {
    return ifThenElse(
      is.function(condition) ? condition() : condition,
      thenValue,
      elseValue
    );
  },
  /**
   * Inline if-then-else based on whether value is strictly true.
   * Delegates the condition check to {@link is#true}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is strictly true.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not strictly true.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.true(true, 'yes', 'no') // 'yes'
   * si.true(1, 'yes', 'no') // 'no'
   * si.true(true, () => 'computed', 'no') // 'computed'
   */
  true(value, thenValue, elseValue) {
    return ifThenElse(is.true(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is truthy.
   * Delegates the condition check to {@link is#truthy}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is truthy.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not truthy.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.truthy(1, 'yes', 'no') // 'yes'
   * si.truthy(0, 'yes', 'no') // 'no'
   * si.truthy("hello", () => 'computed', 'no') // 'computed'
   */
  truthy(value, thenValue, elseValue) {
    return ifThenElse(is.truthy(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is undefined.
   * Delegates the condition check to {@link is#a} with type 'undefined'.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is undefined.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not undefined.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.undefined(undefined, 'yes', 'no') // 'yes'
   * si.undefined('value', 'yes', 'no') // 'no'
   * si.undefined(undefined, () => 'computed', 'no') // 'computed'
   */
  undefined(value, thenValue, elseValue) {
    return ifThenElse(is.a(value, "undefined"), thenValue, elseValue);
  }
};
var has = function has2(object, key) {
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
   * ]), ['key1', 'key2'])
   *
   * @example
   * // Returns false
   * has.all({}, ['key1', 'key2'])
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
   * has.some(new Map([['key1', 'value1'], ['key2', 'value2']]), ['key1'])
   *
   * @example
   * // Returns false
   * has.some({}, ['key1', 'key2'])
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
    return is.shiny(object) && has(object, "prototype");
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
   * const obj = { [Symbol.toStringTag]: 'CustomObject' }
   * has.stringTag(obj) // Returns true
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
   * const obj = { [Symbol.toPrimitive]: () => 42 }
   * has.toPrimitive(obj) // Returns true
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
   * const obj = { valueOf: () => 42 }
   * has.valueOfFn(obj) // Returns true
   */
  valueOfFn(object) {
    return is.object(object) && Object.hasOwn(object, "valueOf") && is.function(object.valueOf);
  }
});
var as = {
  /**
   * Converts a value to an array if it is iterable.
   *
   * @param value The value to convert.
   * @returns The converted array if the value is iterable, otherwise undefined.
   *
   * @example
   * // Returns [1, 2, 3]
   * as.array([1, 2, 3])
   *
   * @example
   * // Returns ['s', 't', 'r', 'i', 'n', 'g']
   * as.array('string')
   *
   * @example
   * // Returns undefined
   * as.array(123)
   */
  array(value) {
    return is.iterable(value) && Array.from(value) || void 0;
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
   * as.object({ key: 'value' })
   *
   * @example
   * // String instance as oppposed to primitive string
   * typeof as.object('string') // 'object'
   * as.object('string') instanceof String // true
   * 'string' instanceof String // false
   *
   * @example
   * // Returns {}
   * as.object(null)
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
   * as.string(null)
   *
   * @example
   * // Returns '123'
   * as.string(123)
   *
   * @example
   * // Returns 'custom'
   * const obj = {
   *   [Symbol.toPrimitive](hint) {
   *     if (hint === 'string') return 'custom'
   *     return null
   *   }
   * }
   * as.string(obj)
   *
   * @example
   * // Returns 'mySymbol'
   * as.string(Symbol('mySymbol'), { description: true })
   *
   * @example
   * // Returns 'Array'
   * as.string([], { stringTag: true })
   */
  string(value, use = {
    description: false,
    stringTag: false
  }) {
    if (value === null || value === void 0) {
      return String(value);
    }
    if (is.symbol(value) && use?.description) {
      return value.description;
    }
    if (has.stringTag(value) && use?.stringTag) {
      return value[Symbol.toStringTag];
    }
    if (is.function(value?.[Symbol.toPrimitive])) {
      const primitiveValue = value[Symbol.toPrimitive]("string");
      if (is.string(primitiveValue)) {
        return primitiveValue;
      }
    }
    if (is.function(value?.valueOf)) {
      const valueOfValue = value.valueOf();
      if (is.string(valueOfValue)) {
        return valueOfValue;
      }
      if (!is.object(valueOfValue)) {
        return String(valueOfValue);
      }
    }
    if (is.function(value?.toString)) {
      const stringValue = value.toString();
      if (is.string(stringValue)) {
        return stringValue;
      }
    }
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
   * as.integerString(123.456)
   *
   * @example
   * // Returns '0'
   * as.integerString('0.789')
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
   * as.numberString('  123.456abc  ')
   *
   * @example
   * // Returns '-0.789'
   * as.numberString('-0.789xyz')
   */
  numberString(value) {
    const string = this.string(value).trim().replace(/[^0-9.eE+-]/g, "");
    const sanitizedStr = string.match(/^[-+]?\d*\.?\d+([eE][-+]?\d+)?/);
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
   * as.number('123.456abc')
   *
   * @example
   * // Returns -0.789
   * as.number('-0.789xyz')
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
   * as.bigint('123.456abc')
   *
   * @example
   * // Returns 0n
   * as.bigint('0.789xyz')
   */
  bigint(value) {
    const BigInt2 = globalThis?.BigInt;
    return BigInt2(this.integerString(value));
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
   * as.boolean("yes")
   *
   * @example
   * // Returns false
   * as.boolean("no")
   *
   * @example
   * // Returns true
   * as.boolean(1)
   *
   * @example
   * // Returns false
   * as.boolean(0)
   *
   * @example
   * // Returns true
   * as.boolean("true")
   *
   * @example
   * // Returns false
   * as.boolean("false")
   *
   * @example
   * // Returns true
   * as.boolean({})
   *
   * @example
   * // Returns false
   * as.boolean(null)
   */
  boolean(value) {
    switch (String(value).toLowerCase()) {
      case "1":
      case "yes":
      case "true":
        return true;
      case "0":
      case "no":
      case "false":
        return false;
      default:
        return Boolean(value);
    }
  }
};
function ifThenElse(condition, thenCase, elseCase) {
  if (typeof thenCase === "undefined" && typeof elseCase === "undefined")
    return !!condition;
  if (typeof thenCase === "undefined")
    thenCase = condition;
  if (condition) {
    if (is.function(thenCase))
      return thenCase();
    else
      return thenCase;
  } else {
    if (is.function(elseCase))
      return elseCase();
    else
      return elseCase;
  }
}

// src/classes/enum.js
function Enum(name, values, properties) {
  const enumeration = makeBaseEnum(name);
  if (!Array.isArray(values)) {
    values = [values];
  }
  const makeEnumValue = (property2, enumValue) => ({
    toString: data(() => enumValue, false, true, false),
    [Symbol.for("Enum.name")]: data(name, false, true, false),
    [Symbol.for("Enum.is")]: data(true, false, false, false),
    [Symbol.for("nodejs.util.inspect.custom")]: data(
      function(depth, options, inspect) {
        const _options = { ...options || {}, colors: true };
        const _skip = this.value === Symbol.for("Enum.NonAssociatedValue");
        const _value2 = _skip ? "" : ` { value: ${inspect(this.value, _options)} }`;
        return `${property2}${_value2}`;
      },
      false,
      true,
      false
    ),
    [Symbol.toStringTag]: accessor("EnumValue", false, true, false),
    [Symbol.for("compare")]: data(
      function compareValue(to2) {
        const toObj = to2 && typeof to2 === "object" ? to2 : { real: to2 };
        const kName = Symbol.for("Enum.name");
        const hasAndIs = (o) => Reflect.has(o, Symbol.for("Enum.is")) && o[Symbol.for("Enum.is")];
        const isLEnum = hasAndIs(this);
        const isREnum = hasAndIs(toObj);
        if (!isLEnum || !isREnum)
          return false;
        const { real: lReal, value: lValue, name: lName, type: lType } = this;
        const { real: rReal, value: rValue, name: rName, type: rType } = toObj;
        return lName === rName && lType === rType && lReal === rReal && lValue === rValue;
      },
      false,
      true,
      false
    ),
    [Symbol.toPrimitive]: data(
      function EnumValueToPrimitive(hint) {
        const original = this.real;
        const type = typeof original;
        switch (hint) {
          case "string":
            if ("string" === type)
              return original;
            else
              return String(original);
          case "number":
            if ("number" === type)
              return original;
            else
              return NaN;
          case "bigint":
            if ("bigint" === type)
              return original;
            else
              return NaN;
          default:
            return original;
        }
      },
      false,
      true,
      false
    )
  });
  const fromPrimitive = (value) => {
    let valueType = typeof value;
    switch (valueType) {
      case "string":
      case "number":
      case "bigint":
      case "boolean":
      default:
        return [String(value), value];
      case "symbol":
        return [value.description, value];
      case "function":
        return [value.name, value];
      case "object": {
        const str = asString(value);
        return [str, str];
      }
    }
  };
  const kValueProps = ["real", "value", "type", "name", "compare", "isEnum"];
  const kCustomPropKeys = [];
  const props = {};
  if (properties) {
    if (Array.isArray(properties)) {
      const entries = properties.filter((e) => Array.isArray(e) && e.length === 2);
      if (entries.length)
        properties = new Map(entries);
      else
        properties = /* @__PURE__ */ new Map();
    } else if (typeof properties === "object") {
      properties = new Map(
        Object.entries(Object.getOwnPropertyDescriptors(properties))
      );
    }
    if (properties instanceof Map) {
      const applyPropertiesOf = (object, baseDescriptor) => {
        const property2 = {
          configurable: baseDescriptor?.configurable ?? true,
          enumerable: baseDescriptor?.enumerable ?? true,
          writable: baseDescriptor?.writable ?? true
        };
        const descriptors = Object.getOwnPropertyDescriptors(object);
        for (const [key, subvalue] of Object.entries(descriptors)) {
          const stats2 = isDescriptor(subvalue, true);
          const baseStats = isDescriptor(baseDescriptor, true);
          if (stats2.isAccessor && baseStats.isValid) {
            props[key] = { ...subvalue, ...accessor.keys.from(baseDescriptor) };
          } else if (stats2.isData && baseStats.isValid) {
            props[key] = { ...subvalue, ...data.keys.from(baseDescriptor) };
          }
        }
      };
      let stats = {};
      for (const [property2, value] of properties.entries()) {
        kCustomPropKeys.push(property2);
        if (isDescriptor(property2)) {
          if (typeof value === "object") {
            applyPropertiesOf(value, property2);
            continue;
          }
        }
        props[property2] = value;
      }
    }
  }
  for (const value of values) {
    const valueType = Array.isArray(value) ? "array" : typeof value;
    let property2 = void 0;
    let response = void 0;
    let wasArray = false;
    let elements = value;
    switch (valueType) {
      case "array":
        if (value.length >= 1) {
          wasArray = true;
          [property2, response] = fromPrimitive(elements[0]);
        }
      default:
        [property2, response] = fromPrimitive(value);
    }
    const maker = {
      [property2](initialValue) {
        const storage = /* @__PURE__ */ new Map();
        const key = property2;
        const realValue = accessor(response, false, { storage, key });
        let _opts, associatedValue;
        if (wasArray) {
          _opts = { storage, key: key + ".associated" };
          associatedValue = elements.length === 1 ? accessor(initialValue, true, _opts) : accessor(elements?.[1], elements?.[2], _opts);
        } else
          associatedValue = accessor(
            Symbol.for("Enum.NonAssociatedValue"),
            false,
            false,
            false
          );
        const _prop = Object(asString(response));
        const valueProps = [...kValueProps, ...kCustomPropKeys];
        const enumResponse = Object.create(_prop, {
          ...makeEnumValue(property2, response),
          ...props
        });
        const proxy = new Proxy(_prop, {
          get(target, _property, receiver) {
            if (_property === "real")
              return realValue.get();
            if (_property === "value")
              return associatedValue.get();
            if (_property === "type")
              return name;
            if (_property === "name")
              return property2;
            if (_property === "compare")
              return enumResponse[Symbol.for("compare")];
            if (_property === "isEnum")
              return true;
            if (!valueProps.includes(_property))
              return void 0;
          },
          has(target, _property) {
            return valueProps.includes(_property);
          },
          ownKeys(target) {
            return valueProps;
          },
          set(target, _property, value2, receiver) {
            if (_property === "value" && wasArray)
              return associatedValue.set(value2);
            return false;
          }
        });
        Object.setPrototypeOf(proxy, Object.getPrototypeOf(_prop));
        Object.setPrototypeOf(enumResponse, proxy);
        return enumResponse;
      }
    };
    enumeration[Symbol.for("Enum.valueKeys")].push(property2);
    const dataValue = wasArray ? maker[property2] : maker[property2]();
    const baseProps = {
      writable: false,
      configurable: false,
      enumerable: true
    };
    Object.defineProperty(enumeration, property2, data(dataValue, baseProps));
  }
  return enumeration;
}
var EnumExtension = new import_extension5.Extension(Enum);
function asString(value) {
  return as.string(value, { description: true, stringTag: true });
}
function makeBaseEnum(name) {
  return Object.create({}, {
    /**
     * Defines the `toStringTag` symbol on each enumeration to allow for
     * type identification and to be consistent in naming conventions.
     *
     * @type {string}
     */
    [Symbol.toStringTag]: accessor("Enum", false, true, false),
    /**
     * In addition to the `toStringTag` symbol which defines this enumeration
     * as an Enum type, the name of the enum is also codified in as a symbol
     * on the object. It can be found using `Symbol.for('Enum.name')`.
     *
     * @type {string|symbol|number}
     */
    [Symbol.for("Enum.name")]: accessor(name, false, true, false),
    /**
     * Knowing which keys of the enum are part of the keys themselves is also
     * crucial for enumerations. These can always be found on each Enum type
     * as `Symbol.for('Enum.valueKeys')` as an array, but can also be found
     * as the `.keys` property if there is no enum value of that name.
     */
    [Symbol.for("Enum.valueKeys")]: data([], false, true, false),
    /**
     * For users of the node.js REPL, this symbol represents enum types in a
     * more readily readable format. See the docs for node's `util.inspect()`
     * function for more details.
     *
     * @type {(number, object, Function) => string}
     */
    [Symbol.for("nodejs.util.inspect.custom")]: data(
      function(depth, options, inspect) {
        const valueKeys = this[Symbol.for("Enum.valueKeys")] ?? [];
        let valueText = valueKeys.map((key) => `\x1B[1;2m${key}\x1B[22m`).join(", ");
        if (valueText.length)
          valueText = ` { ${valueText} }`;
        return `\x1B[1menum \x1B[22m${name}${valueText}`;
      },
      false,
      true,
      false
    ),
    /**
     * This function checks the supplied `possibleEnumValue` to see if it
     * is an enum value type from this enum.
     *
     * @param {any} possibleEnumValue the value to evaluate
     * @returns {boolean} returns `true` if the value is an enum value type
     * from this `Enum`, irrespective of any associated value. Returns `false`
     * otherwise.
     */
    isValueOf: data(function isValueOf(possibleEnumValue) {
      if (!possibleEnumValue || typeof possibleEnumValue !== "object")
        return false;
      const enumValueType = possibleEnumValue?.type;
      const enumValueName = possibleEnumValue?.name;
      const thisEnumName = this[Symbol.for("Enum.name")];
      const thisEnumKeys = this[Symbol.for("Enum.valueKeys")];
      return enumValueType === thisEnumName && thisEnumKeys.includes(enumValueName);
    }, false, true, false),
    /**
     * A simple overload of the `toString()` method to represent the enum
     * more identifiably when called. The result will be the word enum with
     * the name of the enum in parenthesis. So a Gender enum might be seen
     * as `Enum(Gender)` as a result to calling this function.
     *
     * @returns {string} a {@link String} representation of this object.
     */
    toString: data(function toString() {
      return `Enum(${name})`;
    }, false, true, false)
  });
  const applySyntacticSugar = () => {
    createSymlinks(Symbol.for("Enum.valueKeys"), "keys");
    createSymlinks(Symbol.for("Enum.name"), "name");
  };
  return [base, applySyntacticSugar];
}
function createSymlinks(on, oldKey, ...newKeys) {
  redescribe(on, oldKey, {}, { alsoAs: newKeys });
}

// src/classes/enumeration.js
var import_extension6 = require("@nejs/extension");
var Enumeration = class {
  /**
   * The case name for this {@link Enumeration} instance.
   *
   * @type {string|symbol}
   */
  key;
  /**
   * The value for this case name, defaults to the same as the
   * case name unless specifically supplied.
   *
   * @type {any}
   */
  value;
  /**
   * For {@link Enumeration} instances that have instance level associated
   * values. This is uncommon but is modeled after Swift's enums with
   * associated values. This object is `null` if there are no associations.
   *
   * @type {object}
   */
  associations;
  /**
   * Creates a new simple {@link Enumeration} case with a key (case name)
   * and associated value of any type. If no value is supplied, it will be
   * set to the value of the key unless `acceptUndefinedValue` is set to
   * true.
   *
   * @param {string|number|symbol} key the case name represented by this
   * instance of {@link Enumeration}.
   * @param {any} value any value for this enumeration case. If this is
   * `undefined` and `acceptUndefinedValue` is set to false (the default)
   * then the value will be identical to the `key`.
   * @param {boolean} [acceptUndefinedValue=false] a flag that allows the
   * rare case of setting a case's value explicitly to `undefined`
   * @returns {Enumeration} a new {@link Enumeration} value, or instance of
   * whatever child class has extended `Enumeration`.
   */
  constructor(key, value, acceptUndefinedValue = false) {
    if (value === void 0 && !acceptUndefinedValue) value = key;
    Object.assign(this, { key, value });
    Object.defineProperty(this, "associations", {
      value: null,
      configurable: true,
      enumerable: false,
      writable: true
    });
    Object.setPrototypeOf(
      this.constructor.prototype,
      SubscriptProxy(
        Object.create(Object.getPrototypeOf(this.constructor.prototype))
      )
    );
    return this;
  }
  /**
   * Creates a duplicate of this enumeration case, and assigns instance
   * level associated key/value pairs on the copy. It is still of the
   * same enum class type, but has instance level associated value.
   *
   * @param {...(object|string|number|symbol|[string|number|symbol,any])} entries
   * a variadic list of objects (whose key/value pairs will be flattened
   * and added to the associations), a key (string|number|symbol) whose
   * value will be the same as the key, or an Object entry (i.e. an array with
   * the first value being the key and the second value being the value).
   * @returns {*} an instance of this class
   */
  associate(...entries) {
    const associations = {};
    for (const entry of entries) {
      if (is.object(entry, Object)) {
        Object.assign(associations, ...entries);
      } else if (is.array(entry)) {
        const key = is.objectKey(entry[0]);
        associations[key] = entry[1];
      } else if (is.objectKey(entry)) {
        associations[entry] = entry;
      }
    }
    if (this.hasAssociatedValues) {
      Object.assign(this.associations, associations);
      return this;
    }
    const variantCase = Object.create(this);
    variantCase.associations = associations;
    return variantCase;
  }
  /**
   * Shorthand for retrieving an internal associated value
   *
   * @param {string|number|symbol} key a key into the internal
   * associations store. Typically, this value is null.
   * @returns {any|null} null if there is no such named association
   * or if there are no associations stored on this enum value.
   */
  associated(key) {
    return this.associations?.[key];
  }
  /**
   * Returns true if there is an associated value for this enumeration case.
   *
   * @returns {boolean} true if associations exist, denoting this is as
   * a variant case; false otherwise.
   */
  get hasAssociatedValues() {
    return this.associations !== null;
  }
  /**
   * Checks to see if this object is, or is loosely, the same as
   * the supplied `someCase` value. This is determined by comparing
   * the `.key` property.
   *
   * @param {any} someCase some object value that might have a
   * matching (double equals) key property value
   * @returns {boolean} true if the objects are loosely equal (==)
   * or if each of `.key` values are loosely equal (==)
   */
  is(someCase) {
    return this == someCase || this?.key == someCase?.key;
  }
  /**
   * Define the string representation of any given {@link Enumeration}
   * instance to be its `.key` value.
   *
   * @returns {string} the value of the `.key` property wrapped in
   * a call to `String()` to ensure conversion.
   */
  toString() {
    return String(this.key);
  }
  /**
   * Returns a combination of the this class' name followed by this
   * instances key value. This can be more explicit than just using
   * the `.key` property.
   *
   * @example
   * class Shape extends Enumeration {
   *   static {
   *     Shape.define('circle')
   *     Shape.define('square')
   *   }
   * }
   *
   * console.log(Shape.circle.case) // 'Shape.circle'
   *
   * // ['Shape.circle', 'Shape.square']
   * console.log([...Shape.values()].map(s => s.case))
   *
   * @type {string}
   */
  get case() {
    return `${this.constructor.name}.${String(this.key)}`;
  }
  /**
   * Define the result of a call to {@link #valueOf} to always be
   * the contents of the `.value` property.
   *
   * @returns {any} the contents of the `.value` property
   */
  valueOf() {
    return this.value;
  }
  /**
   * Returns the `.key` value as a primitive, unless a conversion to
   * number is requested. In which case, if the `.value` propert is
   * of type {@link Number} then it will be returned. In all other
   * cases the result will be `String(this.key)`.
   *
   * @returns {string|number|NaN} returns a {@link String} representation
   * of the `.key` property unless a number is requested. See above
   * for custom logic pertaining to number coercion.
   */
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      default:
      case "string":
        return String(this.key);
      case "number":
        return isNumber(this.value) ? this.value : Number(this.key);
    }
  }
  /**
   * Generates a custom tag name that matches this instances class name.
   *
   * @example
   * class Shape extends Enumeration {
   *   static { Shape.define('circle') }
   * }
   *
   * console.log(Shape.circle[Symbol.toStringTag]) // 'Shape'
   */
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  /**
   * Static variant of {@link Enumeration#is} that takes a left and
   * right hand value, then checks to see if both objects are, or are
   * loosely, the same as each other's `.key` value.
   *
   * @param {any} leftCase some object value that might have a
   * matching (double equals) key property value
   * @param {any} rightCase some object value that might have a
   * matching (double equals) key property value
   * @returns {boolean} true if the objects are loosely equal (==)
   * or if each of `.key` values are loosely equal (==)
   */
  static is(leftCase, rightCase) {
    return leftCase == rightCase || leftCase?.key == rightCase?.key;
  }
  /**
   * Used when creating a static instance of {@link Enumeration}. Generally
   * this is done as follows:
   *
   * @example
   * class Shape extends Enumeration {
   *   static {
   *     Shape.define('cylinder')
   *     Shape.define('cube')
   *     Shade.define('other')
   *   }
   * }
   *
   * @param {string|number|symbol} key the case name of the this particular
   * enumeration instance.
   * @param {any|[string|number|symbol, any]} value the value of the newly
   * defined {@link Enumeration} instance.
   * @param {function|object} [customizeInstance=undefined] defaults to
   * `undefined`, but when it is passed in as a function, the signature
   * would be to take an instance of this Enumeration class and return
   * one (presumably after modification), or in the form of an object whose
   * property descriptors are copied onto the defined instance. This later
   * approach retains getter and setter application as well as other rare
   * descriptor modifications.
   * @returns {*} an instance of this {@link Enumeration} class type.
   */
  static define(key, value, customizeInstance) {
    if (!is.objectKey(key)) {
      throw new TypeError(
        "Enumeration.define() must have a string/number/symbol key"
      );
    }
    let caseName = key;
    let caseValue = value;
    if (is.objectEntry(value)) {
      [caseName, caseValue] = value;
    }
    let instance = new this(key, value);
    if (customizeInstance instanceof Function) {
      const newInstance = customizeInstance(instance);
      if (newInstance instanceof this)
        instance = newInstance;
    } else if (is.object(customizeInstance)) {
      const descriptors = Object.getOwnPropertyDescriptors(customizeInstance);
      Object.defineProperties(instance, descriptors);
    }
    Object.defineProperty(this, key, {
      get() {
        return instance;
      },
      configurable: true,
      enumerable: true
    });
  }
  /**
   * Creates an iterator of all {@link Enumeration} derived instances that
   * are statically assigned to this class. Generally this is only useful
   * if applied to child class of `Enumeration`.
   *
   * @returns {Generator<string, void, *>} an iterator that walks instances
   * of derived {@link Enumeration} classes and returns their `.key` values
   */
  static *cases() {
    for (let [key, _] of this) yield key;
  }
  /**
   * Creates an iterator of all {@link Enumeration} derived instances that
   * are statically assigned to this class. Generally this is only useful
   * if applied to child class of `Enumeration`.
   *
   * @returns {Generator<string, void, *>} an iterator that walks instances
   * of derived {@link Enumeration} classes and returns their `.value` values
   */
  static *values() {
    for (let [_, value] of this) yield value;
  }
  /**
   * Creates an iterator of all {@link Enumeration} derived instances that
   * are statically assigned to this class. Generally this is only useful
   * if applied to child class of `Enumeration`.
   *
   * @returns {Generator<string, void, *>} an iterator that walks instances
   * of derived {@link Enumeration} classes and returns each key/value pair
   * as arrays. **This is the same as `Object.entries(ChildEnumerationClass)`
   * and then filter the results for pairs whose values are instances of
   * `ChildEnumerationClass`**
   */
  static *[Symbol.iterator]() {
    const keys = Object.keys(this);
    for (const key of keys) {
      const value = this[key];
      if (value instanceof this) yield [key, value];
    }
  }
};
function SubscriptProxy(proxied) {
  return new Proxy(proxied, {
    get(target, property2, receiver) {
      if (!Reflect.has(target, property2) && receiver.hasAssociatedValues) {
        return receiver.associated(property2);
      }
      return Reflect.get(target, property2, receiver);
    },
    set(target, property2, newValue, receiver) {
      if (!Reflect.has(target, property2) && receiver.hasAssociatedValues && Reflect.has(receiver.associations, property2)) {
        receiver.associations[property2] = newValue;
        return;
      }
      return Reflect.set(target, property2, newValue, receiver);
    }
  });
}
var EnumerationExtension = new import_extension6.Extension(Enumeration);

// src/classes/introspector.js
var import_extension7 = require("@nejs/extension");
var Introspector = class {
  static addExpansion(array) {
    const toEntriesFrom = (owner = globalThis) => {
      return (accumulator, key) => {
        const count = accumulator.length;
        try {
          const value = owner[key];
          accumulator.splice(count, 0, [key, value], [value, key]);
        } catch (error) {
          accumulator.splice(count, 0, [key, error]);
        }
        return accumulator;
      };
    };
    return Object.defineProperty(array, "expand", {
      get() {
        return new Map(
          this.reduce(toEntriesFrom(globalThis), [])
        );
      },
      configurable: true,
      enumerable: true
    });
  }
  static accessors(owner = globalThis, keys = []) {
    const entries = [];
    for (const key of keys) {
      try {
        const metadata = this.metadata(owner, key);
        if (metadata.get || metadata.set) {
          entries.push([key, metadata]);
        }
        continue;
      } catch (error) {
        entries.push([key, error]);
      }
    }
    return new Map(entries);
  }
  static classes(owner = globalThis) {
    return this.fetcher(
      "function",
      /^[A-Z]/,
      Object,
      "getOwnPropertyNames",
      owner
    );
  }
  static functions(owner = globalThis) {
    return this.fetcher(
      "function",
      /^[a-z]/,
      Object,
      "getOwnPropertyNames",
      owner
    );
  }
  static objects(owner = globalThis) {
    return this.fetcher("object", null, Object, "getOwnPropertyNames", owner);
  }
  static properties(owner = globalThis) {
    return this.fetcher(
      (v, t, d) => t !== "object" && t !== "function",
      null,
      Object,
      "getOwnPropertyNames",
      owner
    );
  }
  static symbols(owner = globalThis) {
    return this.addExpansion(Object.getOwnPropertySymbols(owner));
  }
  static metadata(owner, key) {
    const metadata = {
      owner,
      key,
      descriptor: void 0,
      value: void 0,
      get type() {
        return typeof this.value;
      }
    };
    try {
      metadata.descriptor = Object.getOwnPropertyDescriptor(owner, key);
    } catch (error) {
      metadata.descriptor = error;
    }
    try {
      metadata.value = metadata.descriptor?.value ?? metadata.descriptor?.get?.bind(owner)?.() ?? owner[key];
    } catch (error) {
      metadata.value = error;
    }
    return metadata;
  }
  static fetcher(typeNameOrTyperFn, regExp = void 0, searchClass = Object, searchFunction = "getOwnPropertyNames", owner = globalThis) {
    let typer = typeNameOrTyperFn;
    if (typeof typeNameOrTyperFn !== "function") {
      const type = String(typeNameOrTyperFn);
      typer = function(value, typeName, descriptor) {
        return typeName === type;
      }.bind(this);
    }
    return this.addExpansion(
      searchClass[searchFunction](owner).filter((key) => {
        const metadata = this.metadata(owner, key);
        return (!regExp || regExp.exec(String(key))) && typer(metadata.value, metadata.type, metadata.descriptor);
      }).toSorted()
    );
  }
  static makeReport(owner = globalThis) {
    let names = [
      "classes",
      "functions",
      "objects",
      "properties",
      "symbols",
      "accessors"
    ];
    let bound = names.reduce(
      (a, n) => {
        a[n] = this[n].bind(this);
        return a;
      },
      {}
    );
    const { classes, functions, objects, properties, symbols, accessors } = bound;
    const result = {};
    Object.assign(result, {
      accessors: {
        classes: void 0,
        functions: void 0,
        objects: void 0,
        properties: void 0,
        symbols: void 0
      },
      classes: this[classes.name](),
      functions: this[functions.name](),
      objects: this[objects.name](),
      properties: this[properties.name](),
      symbols: this[symbols.name](),
      expandAll() {
        names.forEach((reportName) => {
          result[reportName] = result?.[reportName]?.expand;
        });
      }
    })(
      names.forEach((type) => {
        debugger;
        result.accessors[type] = accessors(globalThis, result[type]);
      })
    );
    return result;
  }
};
var IntrospectorExtensions = new import_extension7.Extension(Introspector);

// src/classes/iterable.js
var import_extension8 = require("@nejs/extension");
var Iterable = class {
  /**
   * Private field to store the elements of the iterable.
   * @private
   */
  #elements = [];
  /**
   * Constructs an instance of Iterable. It can be initialized with either an
   * iterable object (such as an array, Set, Map, string, or any object
   * implementing the iterable protocol) or individual elements. If the first
   * argument is an iterable, the class instance is initialized with the
   * elements from the iterable, followed by any additional arguments. If the
   * first argument is not an iterable, all arguments are treated as individual
   * elements.
   *
   * @param {Iterable|*} elementsOrFirstElement - An iterable object or the
   * first element.
   * @param {...*} moreElements - Additional elements if the first argument is
   * not an iterable.
   */
  constructor(elementsOrFirstElement, ...moreElements) {
    if (elementsOrFirstElement != null && typeof elementsOrFirstElement[Symbol.iterator] === "function") {
      this.#elements = [...elementsOrFirstElement, ...moreElements];
    } else {
      this.#elements = [elementsOrFirstElement, ...moreElements];
    }
  }
  /**
   * Implements the iterable protocol. When an instance of Iterable is used
   * in a `for...of` loop or spread syntax, this generator function is invoked
   * to yield the elements one by one in a synchronous manner.
   *
   * @returns {Generator} A generator that yields each element of the iterable.
   */
  *[Symbol.iterator]() {
    for (const element of this.#elements) {
      yield element;
    }
  }
  /**
   * Provides access to the elements as a standard array. Useful for scenarios
   * where array methods and behaviors are needed.
   *
   * @returns {Array} An array containing all the elements of the iterable.
   */
  get asArray() {
    return this.#elements;
  }
  /**
   * Ensures that the constructor of this object instance's name
   * is returned if the string tag for this instance is queried
   *
   * @returns {string} the name of the class
   */
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  /**
   * Checks if a given value is an iterable. This method determines if the
   * provided value has a `Symbol.iterator` property that is a generator
   * function. It's a precise way to identify if the value conforms to the
   * iterable protocol using a generator function.
   *
   * Note: This method specifically checks for generator functions. Some
   * iterables might use regular functions that return an iterator, which
   * this method won't identify.
   *
   * @param {*} value - The value to be checked for iterability.
   * @returns {boolean} - Returns true if the value is an iterable implemented
   * using a generator function, false otherwise.
   */
  static isIterable(value) {
    const type = Object.prototype.toString.call(value?.[Symbol.iterator]);
    return type === "[object GeneratorFunction]";
  }
};
var Iterator = class _Iterator {
  /**
   * A private function that when provided has the following signature:
   * `function mapEach(entry) -> entry`. This allows any changes to be made
   * to each element, conditionally and programmatically, as needed before
   * they are returned to the called code.
   */
  #mapEach = void 0;
  /**
   * Creates a new `Iterator` object instance.
   *
   * @param {object} iterable any object that has a `[Symbol.iterator]`
   * property assigned to a generator function.
   * @param {function} mapEach when provided `mapEach` is a callback that
   * takes an entry as input and receives one as output.
   */
  constructor(iterable, mapEach) {
    if (!iterable || !Reflect.has(iterable, Symbol.iterator)) {
      throw new TypeError(
        "Value used to instantiate Iterator is not iterable"
      );
    }
    this.#iterable = iterable;
    this.#iterator = iterable[Symbol.iterator]();
    this.#mapEach = typeof mapEach === "function" ? mapEach : void 0;
  }
  /**
   * Returns a new `Array` derived from the iterable this object
   * wraps.
   *
   * @returns {array} a new `Array` generated from the wrapped
   * iterable. The method is generated from `Array.from()`
   */
  get asArray() {
    return Array.from(this.#iterable);
  }
  /**
   * Returns the actual iterable object passed to the constructor that
   * created this instance.
   *
   * @returns {object} the object containing the `[Symbol.iterator]`
   */
  get iterable() {
    return this.#iterable;
  }
  /**
   * The function retrieves the next value in the iterator. If the
   * the iterator has run its course, `reset()` can be invoked to
   * reset the pointer to the beginning of the iteration.
   *
   * @returns {any} the next value
   */
  next() {
    const input = this.#iterator.next();
    let output = input;
    if (output.done) {
      return { value: void 0, done: true };
    } else {
      if (this.#mapEach && typeof this.#mapEach === "function") {
        output.value = this.#mapEach(input.value);
      }
      return { value: output.value, done: false };
    }
  }
  /**
   * Resets the iterator to the beginning allowing it to be
   * iterated over again.
   */
  reset() {
    this.#iterator = this.#iterable[Symbol.iterator]();
  }
  /**
   * The existence of this symbol on the object instances, indicates that
   * it can be used in `for(.. of ..)` loops and its values can be
   * extracted from calls to `Array.from()`
   *
   * @returns {Iterator} this is returned since this object is already
   * conforming to the expected JavaScript Iterator interface
   */
  [Symbol.iterator]() {
    return this;
  }
  /**
   * Ensures that the constructor of this object instance's name
   * is returned if the string tag for this instance is queried
   *
   * @returns {string} the name of the class
   */
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  /**
   * The object from which its iterator functionality is derived.
   *
   * @type {object}
   * @private
   */
  #iterable = null;
  /**
   * The results of a call to the iterable's `[Symbol.iterator]`
   * generator function.
   *
   * @type {object}
   * @private
   */
  #iterator = null;
  /**
   * Creates an Iterator for the keys of the given object.
   *
   * @note alternatives to keyFetcher might be `Reflect.ownKeys` or even
   * `Object.keys`. Each type of fetcher has their own requirements but
   * any function that takes an object and returns keys will suffice.
   *
   * @param {Object} object - The object whose keys will be iterated.
   * @param {Function} [mapEach] - Optional function to map each key.
   * @param {Function} [keyFetcher=Object.getOwnPropertyNames] - Function to
   * fetch keys from the object. Defaults to Object.getOwnPropertyNames.
   * @returns {Iterator} An Iterator instance containing the object's keys.
   */
  static keys(object, mapEach, keyFetcher) {
    keyFetcher ??= Object.getOwnPropertyNames;
    const keys = keyFetcher(object);
    return new _Iterator(keys, mapEach);
  }
  /**
   * Creates an Iterator for the entries of the given object.
   *
   * @note alternatives to keyFetcher might be `Reflect.ownKeys` or even
   * `Object.keys`. Each type of fetcher has their own requirements but
   * any function that takes an object and returns keys will suffice.
   *
   * @param {Object} object - The object whose entries will be iterated.
   * @param {Function} [mapEach] - Optional function to map each entry.
   * @param {Function} [keyFetcher=Object.getOwnPropertyNames] - Function to
   * fetch keys from the object. Defaults to Object.getOwnPropertyNames.
   * @returns {Iterator} An Iterator instance containing the object's entries.
   */
  static entries(object, mapEach, keyFetcher) {
    keyFetcher ??= Object.getOwnPropertyNames;
    const keys = keyFetcher(object);
    const entries = [];
    for (const key of keys) {
      entries.push([key, object[key]]);
    }
    return new _Iterator(entries, mapEach);
  }
  /**
   * Creates an Iterator for the property descriptors of the given object.
   *
   * @note alternatives to keyFetcher might be `Reflect.ownKeys` or even
   * `Object.keys`. Each type of fetcher has their own requirements but
   * any function that takes an object and returns keys will suffice.
   *
   * @param {Object} object - The object whose descriptors will be iterated.
   * @param {Function} [mapEach] - Optional function to map each descriptor
   * entry.
   * @param {Function} [keyFetcher=Object.getOwnPropertyNames] - Function to
   * fetch keys from the object. Defaults to Object.getOwnPropertyNames.
   * @returns {Iterator} An Iterator instance containing entries of [key,
   * descriptor] pairs.
   */
  static descriptors(object, mapEach, keyFetcher) {
    keyFetcher ??= Object.getOwnPropertyNames;
    const keys = keyFetcher(object);
    const entries = [];
    for (const key of keys) {
      entries.push([key, Object.getOwnPropertyDescriptor(object, key)]);
    }
    return new _Iterator(entries, mapEach);
  }
};
var IterableExtensions = new import_extension8.Extension(Iterable);
var IteratorExtensions = new import_extension8.Extension(Iterator);

// src/classes/param.parser.js
var import_extension9 = require("@nejs/extension");
var ParamParser = class _ParamParser {
  /**
   * Constructs an instance of ParamParser. It takes in parameters, an optional
   * validator function, and an optional parser function. The parameters are
   * validated and if successful, parsed.
   *
   * @param {any[]} parameters - Arguments passed in by the process.
   * @param {((any[]) => boolean)?} [validator=() => {}] - An optional function
   * to specify a validator without subclassing ParamParser. It should return
   * a boolean indicating the validity of the parameters.
   * @param {((any[]) => object)?} [parser=() => {}] - An optional function to
   * specify a parser without subclassing ParamParser. It should return an
   * object after parsing the input parameters.
   *
   * @example
   * const parameters = ['param1', 'param2']
   * const validator = params => params.every(param => typeof param === 'string')
   * const parser = params => ({ params })
   * const paramParser = new ParamParser(parameters, validator, parser)
   * if (paramParser.success) {
   *   console.log('Parsing successful:', paramParser.results)
   * } else {
   *   console.error('Parsing failed.')
   * }
   */
  constructor(parameters, validator = () => {
  }, parser = () => {
  }) {
    this.args = parameters;
    this.parser = parser;
    this.validator = validator;
    this.result = void 0;
    this.success = this.validate(this.args);
    if (this.success) {
      this.results = this.parse(this.args);
    }
  }
  /**
   * @param {object} args arguments that were previously validated
   * by either the overloaded validate() method or the supplied
   * validator closure.
   * @returns {object} returns the output object, or an empty
   * object, after parsing the input arguments or parameters.
   */
  parse(args) {
    return this.parser?.(args);
  }
  /**
   * Walk the arguments and determine if the supplied input is
   * a valid parsing.
   *
   * @param {any[]} args arguments supplied by the process.
   * @returns {boolean} `true` if the validation is successful,
   * `false` otherwise.
   */
  validate(args) {
    return this.validator?.(args);
  }
  /**
   * Attempts to parse the given parameters using the provided parsers, throwing an
   * error if no valid parser is found. This method serves as a convenience wrapper
   * around `safeTryParsers`, enforcing strict parsing by automatically enabling
   * error throwing on failure.
   *
   * @param {any[]} parameters - The parameters to be parsed.
   * @param {Function[]} parsers - An array of `ParamParser` subclasses to attempt
   * parsing with.
   * @returns {Object} An object containing the parsing result, with a `success`
   * property indicating if parsing was successful, and a `data` property containing
   * the parsed data if successful.
   * @example
   * const parameters = ['param1', 'param2'];
   * const parsers = [Parser1, Parser2];
   * const result = ParamParser.tryParsers(parameters, parsers);
   * if (result.success) {
   *   console.log('Parsing successful:', result.data);
   * } else {
   *   console.error('Parsing failed.');
   * }
   */
  static tryParsers(parameters, parsers) {
    return this.safeTryParsers(parameters, parsers, true);
  }
  /**
   * Tries parsing `parameters` with each parser in `parsers`. If
   * `throwOnFail` is true, throws an error when validation fails or
   * no valid parser is found.
   *
   * This method attempts to parse the given parameters using the
   * provided list of parsers. It validates the input to ensure both
   * `parameters` and `parsers` are arrays and that `parsers`
   * contains at least one valid `ParamParser` subclass. If
   * `throwOnFail` is set to true, it will throw specific errors for
   * invalid inputs or when no parser succeeds. Otherwise, it returns
   * an object indicating the success status and the result of
   * parsing, if successful.
   *
   * @param {any[]} parameters - The parameters to be parsed.
   * @param {Function[]} parsers - An array of `ParamParser`
   * subclasses to attempt parsing with.
   * @param {boolean} [throwOnFail=false] - Whether to throw an
   * error on failure.
   * @returns {{success: boolean, data: any}} An object with a
   * `success` flag and `data` containing the parsing result, if
   * successful.
   * @throws {ParametersMustBeArrayError} If `parameters` or
   * `parsers` are not arrays when `throwOnFail` is true.
   * @throws {ParsersArrayMustContainParsersError} If `parsers`
   * does not contain at least one valid `ParamParser` subclass
   * when `throwOnFail` is true.
   * @throws {NoValidParsersFound} If no valid parser is found
   * and `throwOnFail` is true.
   * @example
   * const parameters = ['param1', 'param2'];
   * const parsers = [Parser1, Parser2];
   * const result = ParamParser.safeTryParsers(
   *   parameters, parsers, true
   * );
   *
   * if (result.success) {
   *   console.log('Parsing successful:', result.data);
   * } else {
   *   console.error('Parsing failed.');
   * }
   */
  static safeTryParsers(parameters, parsers, throwOnFail = false) {
    if (!Array.isArray(parameters) || !Array.isArray(parsers)) {
      if (throwOnFail) {
        throw new this.ParametersMustBeArrayError(
          `${this.name}.tryParsers must receive two arrays as args`
        );
      }
    }
    if (!parsers.some((parser) => parser?.prototype instanceof _ParamParser && typeof parser === "function")) {
      if (throwOnFail) {
        throw new this.ParsersArrayMustContainParsersError(
          `${this.name}.tryParsers parsers argument must contain at least one ParamParser derived class`
        );
      }
    }
    let success = false;
    let result = void 0;
    for (let Parser of parsers) {
      const parser = new Parser(parameters);
      if (parser.success) {
        success = true;
        result = parser.result;
        break;
      }
    }
    if (!success && throwOnFail) {
      throw new this.NoValidParsersFound("No valid parsers found");
    }
    return { success, data: result };
  }
  /**
   * A custom error class that signifies no valid parsers were found
   * during the parsing process. This error is thrown when all
   * parsers fail to parse the given parameters and the `throwOnFail`
   * flag is set to true in the `safeTryParsers` method.
   *
   * @returns {Function} A class extending Error, representing a
   * specific error when no valid parsers are found.ound.
   *
   * @example
   * try {
   *   const result = ParamParser.safeTryParsers(
   *     parameters, parsers, true
   *   );
   * } catch (error) {
   *   if (error instanceof ParamParser.NoValidParsersFound) {
   *     console.error(
   *       'No valid parsers could process the parameters.'
   *     );
   *   }
   * }
   */
  static get NoValidParsersFound() {
    return class NoValidParsersFound extends Error {
    };
  }
  /**
   * Represents an error thrown when the parameters provided to a method
   * are not in an array format as expected. This class extends the
   * native JavaScript `Error` class, allowing for instances of this
   * error to be thrown and caught using standard error handling
   * mechanisms in JavaScript.
   *
   * This error is specifically used in scenarios where a method
   * expects its arguments to be provided as an array, and the
   * validation of those arguments fails because they were not
   * provided in an array format. It serves as a clear indicator
   * of the nature of the error to developers, enabling them to
   * quickly identify and rectify the issue in their code.
   *
   * @example
   * try {
   *   ParamParser.safeTryParsers(nonArrayParameters, parsers, true);
   * } catch (error) {
   *   if (error instanceof ParamParser.ParametersMustBeArrayError) {
   *     console.error('Parameters must be provided as an array.');
   *   }
   * }
   */
  static get ParametersMustBeArrayError() {
    return class ParametersMustBeArrayError extends Error {
    };
  }
  /**
   * A custom error class indicating that the parsers array does not
   * contain valid parser functions. This error is thrown when the
   * validation of parsers within `ParamParser.safeTryParsers` fails
   * to find any instance that is a subclass of `ParamParser`. It
   * extends the native JavaScript `Error` class, allowing it to be
   * thrown and caught using standard error handling mechanisms.
   *
   * This error serves as a clear indicator to developers that the
   * provided array of parsers does not meet the expected criteria,
   * specifically that it must contain at least one valid parser
   * that extends `ParamParser`. This ensures that the parsing
   * process can be executed with at least one valid parser function.
   *
   * @example
   * try {
   *   ParamParser.safeTryParsers(parameters, [], true);
   * } catch (error) {
   *   const { ParsersArrayMustContainParsersError } = ParamParser
   *   if (error instanceof ParsersArrayMustContainParsersError) {
   *     console.error(
   *       'The parsers array must contain at least one valid parser.'
   *     );
   *   }
   * }
   */
  static get ParsersArrayMustContainParsersError() {
    return class ParsersArrayMustContainParsersError extends Error {
    };
  }
};
var ParamParserExtensions = new import_extension9.Extension(ParamParser);

// src/classes/pluggable.proxy.js
var import_extension10 = require("@nejs/extension");
var { toStringTag, hasInstance } = Symbol;
var ProxyHandlerResponse = class {
  constructor(success = false, value = void 0, context = void 0) {
    Object.assign(this, { succes, value, context });
  }
  /**
   * A getter method for the toStringTag symbol.
   * This method returns the name of the constructor of the instance.
   * It is used to provide a custom string description of the object,
   * which can be useful for debugging or logging purposes.
   *
   * @example
   * const response = new ProxyHandlerResponse();
   * console.log(response[Symbol.toStringTag]); // logs: "ProxyHandlerResponse"
   *
   * @returns {string} The name of the constructor of the instance.
   */
  get [toStringTag]() {
    return this.constructor.name;
  }
  /**
   * This static method is a Symbol.hasInstance method implementation.
   * It checks if the provided instance is an instance of the class.
   * It does this by comparing the instance's toStringTag or constructor
   * to the class's name or the class itself respectively.
   *
   * @param {Object} instance - The instance to check.
   * @returns {boolean} True if the instance is of the class, false otherwise.
   *
   * @example
   * // Assuming MyClass has implemented this method
   * const myInstance = new MyClass();
   * // logs: true
   * console.log(MyClass[Symbol.hasInstance](myInstance));
   */
  static [hasInstance](instance) {
    return instance?.[toStringTag] === this.name || instance?.constructor === this;
  }
};
var ProxyHandler = class _ProxyHandler {
  constructor(handler, type = _ProxyHandler.type.get) {
    this.handler = handler;
    this.typeName = Array.isArray(type) ? _ProxyHandler.nameFromType(type) ?? "get" : String(type);
    this.type = Array.isArray(type) ? type : _ProxyHandler.type[type ?? "get"];
  }
  invoke(...args) {
    const context = {
      defaultValue: Reflect[this.typeName](...args),
      proxyHandler: this,
      typeHandler: this.handler
    };
    try {
      const result = this.handler.apply(context, args);
      if (!(result?.[Symbol.toStringTag] === _ProxyHandler.ResponseType)) {
        return _ProxyHandler.response(!!result, result, context);
      }
      result.context = context;
      return result;
    } catch (error) {
      return _ProxyHandler.response(false, error);
    }
  }
  /**
   * This static method is used to create a response object. The response
   * object contains the success status, the value, and the context of the
   * response. It also includes a getter for the Symbol.toStringTag property
   * that returns the ResponseType of the ProxyHandler.
   *
   * @param {boolean} success - The success status of the response.
   * @param {*} value - The value of the response.
   * @param {Object} context - The context of the response.
   * @returns {Object} The response object.
   *
   * @example
   * // Create a response object
   * const response = ProxyHandler.response(
   *   true, 'value', { key: 'context' }
   * );
   *
   * // Output: { success: true, value: 'value', context: { key: 'context' },
   * //           [Symbol.toStringTag]: 'ProxyHandlerResponse' }
   * console.log(response);
   */
  static response(success, value, context) {
    return {
      success,
      value,
      context,
      get [Symbol.toStringTag]() {
        return this.ResponseType;
      }
    };
  }
  /**
   * This static getter method is used to retrieve the response type
   * of the ProxyHandler. It returns a string that represents the
   * response type of the ProxyHandler.
   *
   * @property {function} ResponseType - A static getter method that
   * returns the response type of the ProxyHandler.
   * @returns {string} A string representing the response type of the
   * ProxyHandler.
   *
   * @example
   * // Get the response type of the ProxyHandler
   * const responseType = ProxyHandler.ResponseType;
   *
   * // Output: 'ProxyHandlerResponse'
   * console.log(responseType);
   */
  static get ResponseType() {
    return "ProxyHandlerResponse";
  }
  /**
   * This static method is used to retrieve the name of a ProxyHandler type
   * from a given array of arguments. If the array of arguments matches any
   * of the ProxyHandler types, the name of that type is returned. If no
   * match is found, or if the input is not an array, 'custom' is returned.
   *
   * @param {Array.<*>} proxyHandlerType - An array of arguments to match
   * against the ProxyHandler types.
   * @returns {string} The name of the matching ProxyHandler type, or 'custom'
   * if no match is found.
   *
   * @example
   * // Get the name of a type from its arguments
   * const typeName = ProxyHandler.nameFromType(
   *   ['target', 'thisArg', 'argumentsList']
   * );
   *
   * // Output: 'apply'
   * console.log(typeName);
   *
   * @throws {TypeError} If ProxyHandler.type is undefined.
   */
  static nameFromType(proxyHandlerType) {
    if (!Array.isArray(proxyHandlerType)) {
      return "custom";
    }
    const names = Object.entries(_ProxyHandler.type);
    for (const [name, args] of names) {
      if (proxyHandlerType.every((element) => ~args.indexOf(element))) {
        return name;
      }
    }
    return "custom";
  }
  /**
   * This method is used to retrieve all the types of ProxyHandler available
   * in the ProxyHandler.type object. It is useful when you need to iterate
   * over all the types or when you need to check if a certain type exists.
   *
   * @property {function} typeNames - A static getter method that returns an
   * array of keys from the ProxyHandler.type object.
   * @returns {Array.<string>} An array of strings representing the keys of
   * the ProxyHandler.type object.
   *
   * @example
   * // Get all type names
   * const types = ProxyHandler.typeNames;
   *
   * // Output: ['apply', 'construct', 'defineProperty', ...]
   * console.log(types);
   *
   * @throws {TypeError} If ProxyHandler.type is undefined.
   */
  static get typeNames() {
    return Object.keys(_ProxyHandler.type);
  }
  /**
   * A static getter method that returns an object containing keyed proxy
   * trap types and their associated expected arguments list by name. A
   * docstring description complete with url shortening links for each entry
   * are provided (links go to the MDN documentation)
   *
   * @property {function} type - A static getter method that returns an object
   * of ProxyHandler types.
   * @returns {Object.<string, function>} An object where each key is a type
   * name and each value is a function that returns an array of strings
   * representing the arguments for that type.
   *
   * @example
   * // Get the 'apply' type
   * const applyType = ProxyHandler.type.apply;
   *
   * // Output: ['target', 'thisArg', 'argumentsList']
   * console.log(applyType());
   *
   * @throws {TypeError} If ProxyHandler.type is undefined.
   */
  static get type() {
    return {
      /**
       * The handler.apply() method is a trap for the [[Call]] object internal
       * method, which is used by operations such as function calls.
       * MDN link: https://t.ly/orBsG
       */
      get apply() {
        return ["target", "thisArg", "argumentsList"];
      },
      /**
       * The handler.construct() method is a trap for the [[Construct]] object
       * internal method, which is used by operations such as the new operator.
       * In order for the new operation to be valid on the resulting Proxy
       * object, the target used to initialize the proxy must itself be a
       * valid constructor.
       * MDN link: https://t.ly/1LukS
       */
      get construct() {
        return ["target", "args"];
      },
      /**
       * The handler.defineProperty() method is a trap for the
       * [[DefineOwnProperty]] object internal method, which is used by
       * operations such as Object.defineProperty().
       * MDN link: https://t.ly/3Ml9y
       */
      get defineProperty() {
        return ["target", "key", "descriptor"];
      },
      /**
       * The handler.deleteProperty() method is a trap for the [[Delete]]
       * object internal method, which is used by operations such as the
       * delete operator.
       * MDN link: https://t.ly/neu2H
       */
      get deleteProperty() {
        return ["target", "property"];
      },
      /**
       * The handler.get() method is a trap for the [[Get]] object internal
       * method, which is used by operations such as property accessors.
       * MDN link: https://t.ly/E419x
       */
      get get() {
        return ["target", "property", "receiver"];
      },
      /**
       * The handler.getOwnPropertyDescriptor() method is a trap for the
       * [[GetOwnProperty]] object internal method, which is used by operations
       * such as Object.getOwnPropertyDescriptor().
       * MDN link: https://t.ly/wzPTX
       */
      get getOwnPropertyDescriptor() {
        return ["target", "property"];
      },
      /**
       * The handler.getPrototypeOf() method is a trap for the
       * [[GetPrototypeOf]] object internal method, which is used by operations
       * such as Object.getPrototypeOf().
       * MDN link: https://t.ly/Ww4S1
       */
      get getPrototypeOf() {
        return ["target"];
      },
      /**
       * The handler.has() method is a trap for the [[HasProperty]] object
       * internal method, which is used by operations such as the in operator.
       * MDN link: https://t.ly/UcJL-
       */
      get has() {
        return ["target", "prototype"];
      },
      /**
       * The handler.isExtensible() method is a trap for the [[IsExtensible]]
       * object internal method, which is used by operations such as
       * Object.isExtensible().
       * MDN link: https://t.ly/MkdIK
       */
      get isExtensible() {
        return ["target"];
      },
      /**
       * The handler.ownKeys() method is a trap for the [[OwnPropertyKeys]]
       * object internal method, which is used by operations such as
       * Object.keys(), Reflect.ownKeys(), etc.
       * MDN link: https://t.ly/QkiTI
       */
      get ownKeys() {
        return ["target"];
      },
      /**
       * The handler.preventExtensions() method is a trap for the
       * [[PreventExtensions]] object internal method, which is used by
       * operations such as Object.preventExtensions().
       * MDN link: https://t.ly/nvfjJ
       */
      get preventExtensions() {
        return ["target"];
      },
      /**
       * The handler.set() method is a trap for the [[Set]] object internal
       * method, which is used by operations such as using property accessors
       * to set a property's value.
       * MDN link: https://t.ly/FDWcl
       */
      get set() {
        return ["target", "property", "value", "receiver"];
      },
      /**
       * The handler.setPrototypeOf() method is a trap for the
       * [[SetPrototypeOf]] object internal method, which is used by operations
       * such as Object.setPrototypeOf().
       * MDN link: https://t.ly/pS8ej
       */
      get setPrototypeOf() {
        return ["target", "prototype"];
      }
    };
  }
};
var PluggableProxy = class _PluggableProxy {
  constructor(Class, handlers, options = {
    prototype: void 0,
    // undefined means extract from class
    apply: true
  }) {
    const validHandlers = handlers.filter((h) => h instanceof ProxyHandler);
    Object.assign(this, {
      class: Class instanceof Function ? Class : Class.constructor,
      instance: Class instanceof Function ? null : Class
    });
    this.handlers = /* @__PURE__ */ new Map();
    for (let typeName of ProxyHandler.typeNames) {
      const handlersOfType = [].concat(
        validHandlers.filter((h) => h.typeName === typeName)
      );
      this.handlers.set(typeName, handlersOfType);
    }
    this[_PluggableProxy.kOriginal] = options?.prototype ?? Object.getPrototypeOf(this.class);
    this[_PluggableProxy.kCreated] = Object.create(
      this[_PluggableProxy.kOriginal],
      this.instance
    );
    this[_PluggableProxy.kProxy] = new Proxy(this[_PluggableProxy.kCreated], this);
    if (options?.apply != true) {
      const target = this?.instance ?? this.class;
      Object.setPrototypeOf(target, this[_PluggableProxy.kCreated]);
    }
  }
  handlersOfType(typeName) {
    return this.handlers.get(typeName);
  }
  tryEachOfType(type, ...args) {
    const types = ProxyHandler.typeNames;
    const failures = [];
    for (const handler of types) {
      const result = handler.invoke(...args);
      if (result.success) {
        return [result, failures];
      }
      failures.push(result);
    }
    return [void 0, failures];
  }
  apply(target, thisArg, argumentsList) {
    const type = "apply", args = [target, thisArg, argumentsList];
    const [result, _fails] = tryEachOfType(type, ...args);
    if (result) {
      return result;
    }
    return Reflect[type](...args);
  }
  construct(target, args) {
    const type = "construct", _args = [target, args];
    const [result, _fails] = tryEachOfType(type, ..._args);
    if (result) {
      return result;
    }
    return Reflect[type](..._args);
  }
  defineProperty(target, key, descriptor) {
    const type = "defineProperty", args = [target, key, descriptor];
    const [result, _fails] = tryEachOfType(type, ...args);
    if (result) {
      return result;
    }
    return Reflect[type](...args);
  }
  deleteProperty(target, property2) {
    const type = "deleteProperty", args = [target, property2];
    const [result, _fails] = tryEachOfType(type, ...args);
    if (result) {
      return result;
    }
    return Reflect[type](...args);
  }
  get(target, property2, receiver) {
    const type = "get", args = [target, property2, receiver];
    const [result, _fails] = tryEachOfType(type, ...args);
    if (result) {
      return result;
    }
    return Reflect[type](...args);
  }
  getOwnPropertyDescriptor(target, property2) {
    const type = "getOwnPropertyDescriptor", args = [target, property2];
    const [result, _fails] = tryEachOfType(type, ...args);
    if (result) {
      return result;
    }
    return Reflect[type](...args);
  }
  getPrototypeOf(target) {
    const type = "getPrototypeOf", args = [target];
    const [result, _fails] = tryEachOfType(type, ...args);
    if (result) {
      return result;
    }
    return Reflect[type](...args);
  }
  has(target, property2) {
    const type = "has", args = [target, property2];
    const [result, _fails] = tryEachOfType(type, ...args);
    if (result) {
      return result;
    }
    return Reflect[type](...args);
  }
  isExtensible(target) {
    const type = "isExtensible", args = [target];
    const [result, _fails] = tryEachOfType(type, ...args);
    if (result) {
      return result;
    }
    return Reflect[type](...args);
  }
  ownKeys(target) {
    const type = "ownKeys", args = [target];
    const [result, _fails] = tryEachOfType(type, ...args);
    if (result) {
      return result;
    }
    return Reflect[type](...args);
  }
  preventExtensions(target) {
    const type = "preventExtensions", args = [target];
    const [result, _fails] = tryEachOfType(type, ...args);
    if (result) {
      return result;
    }
    return Reflect[type](...args);
  }
  set(target, property2, value, receiver) {
    const type = "set", args = [target, property2, value, receiver];
    const [result, _fails] = tryEachOfType(type, ...args);
    if (result) {
      return result;
    }
    return Reflect[type](...args);
  }
  setPrototypeOf(target, prototype) {
    const type = "setPrototypeOf", args = [target, prototype];
    const [result, _fails] = tryEachOfType(type, ...args);
    if (result) {
      return result;
    }
    return Reflect[type](...args);
  }
  static get kCreated() {
    return Symbol.for("pp.prototype.created");
  }
  static get kOriginal() {
    return Symbol.for("pp.prototype.original");
  }
  static get kProxy() {
    return Symbol.for("pp.proxy");
  }
};
var ProxyHandlerExtensions = new import_extension10.Extension(ProxyHandler);
var PluggableProxyExtensions = new import_extension10.Extension(PluggableProxy);
var PluggableProxyExtensionSet = new import_extension10.Extension.ExtensionSet(
  "PluggableProxyExtensionSet",
  ProxyHandlerExtensions,
  PluggableProxyExtensions
);

// src/classes/property.js
var import_extension11 = require("@nejs/extension");
var Property = class _Property {
  constructor(key, descriptor) {
    if (key.startsWith(":")) key = Symbol.for(key.slice(1));
    if (typeof key !== "string" && typeof key !== "symbol") {
      throw new TypeError("Key or symbol or :symbol must be supplied!");
    }
    this.key = key;
    if (!_Property.is.descriptor(descriptor)) {
      this.descriptor = {
        value: descriptor,
        writable: true,
        configurable: true,
        enumerable: true
      };
    } else {
      this.descriptor = descriptor;
    }
  }
  apply(toObject, asKey) {
    if (!toObject || !["object", "function"].some((k) => k == typeof toObject))
      return;
    return Object.defineProperty(toObject, asKey ?? this.key, this.descriptor);
  }
  get descriptor() {
    const baseline = { configurable: true, enumerable: false };
    const result = {
      enumerable: this.meta.enumerable,
      configurable: this.meta.configurable
    };
    if (this.is.accessor) {
      result.get = this.meta.accessor.get;
      result.set = this.meta.accessor.set;
    } else {
      result.value = this.meta.data.value;
      result.writable = this.meta.data.writable;
    }
    return Object.defineProperties(result, {
      make: {
        ...baseline,
        get() {
          const self = this;
          return {
            get enumerable() {
              self.enumerable = true;
              return self;
            },
            get hidden() {
              self.enumerable = false;
              return self;
            },
            get writable() {
              self.writable = true;
              return self;
            },
            get readonly() {
              self.writable = false;
              return self;
            },
            get configurable() {
              self.configurable = true;
              return self;
            },
            get immutable() {
              self.configurable = false;
              return self;
            }
          };
        }
      },
      is: {
        ...baseline,
        get() {
          const self = this;
          return {
            get accessor() {
              return self.is.accssor;
            },
            get data() {
              return self.is.data;
            }
          };
        }
      }
    });
  }
  set descriptor(descriptor) {
    const { is: is2 } = this.constructor;
    if (!is2.descriptor(descriptor))
      return;
    this.meta.configurable = descriptor.configurable ?? true;
    this.meta.enumerable = descriptor.enumerable ?? true;
    if (Reflect.has(descriptor, "get") || Reflect.has(descriptor, "set")) {
      const { get, set } = descriptor;
      if (get !== void 0) this.meta.accessor.get = get;
      if (set !== void 0) this.meta.accessor.set = set;
    } else {
      const { value, writable } = descriptor;
      this.meta.data.value = value;
      this.meta.data.writable = writable ?? true;
    }
  }
  get is() {
    const self = this;
    return {
      get accessor() {
        return !!(self.meta.accessor.get || self.meta.accessor.set);
      },
      get data() {
        return !!!this.accessor;
      }
    };
  }
  toString(colors = false, { key, descriptor } = {}) {
    const bold = (s) => colors ? `\x1B[1m${s}\x1B[22m` : s;
    const dim = (s) => colors ? `\x1B[2m${s}\x1B[22m` : s;
    const red = (s) => colors ? `\x1B[31m${s}\x1B[39m` : s;
    const green = (s) => colors ? `\x1B[32m${s}\x1B[39m` : s;
    const blue = (s) => colors ? `\x1B[34m${s}\x1B[39m` : s;
    if (!key) ({ key } = this);
    if (!descriptor || !_Property.is.descriptor(descriptor))
      ({ descriptor } = this);
    const buffer = [`${bold(key)} { `];
    const keyPresent = (object) => (key2) => Reflect.has(object, key2);
    const eqeq = (value, compare = (a, b) => a === b) => (element) => compare(element, value);
    if (["get", "set"].some(keyPresent(descriptor))) {
      if (descriptor.get) {
        buffer.push(blue("getter"));
        if (descriptor.set) {
          buffer.push(bold("|"));
        }
      }
      if (descriptor.set) {
        buffer.push(blue("setter"));
      }
    } else {
      buffer.push(green("value"));
      buffer.push(bold("|"));
      buffer.push(descriptor.writable ? green("writable") : red("readonly"));
    }
    buffer.push(" ");
    buffer.push(descriptor.configurable ? green("mutable") : red("immuatable"));
    buffer.push(" ");
    buffer.push(descriptor.enumerable ? green("visible") : red("hidden"));
    buffer.push(" }");
    return buffer.join("");
  }
  [Symbol.for("nodejs.util.inspect.custom")](depth, options, inspect) {
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
  static accessor(name, { get, set, prototype }, { configurable, enumerable, storage } = {}) {
    if (!get && !set && prototype) {
      const constructor = prototype?.constructor;
      if (constructor?.name === "get") {
        get = constructor;
      } else if (constructor?.name === "set") {
        set = constructor;
      }
    }
    if (get && storage && get.length == 1) {
      get = get(storage);
    }
    if (set && storage && set.length == 1) {
      set = set(storage);
    }
    if (!name && !get && !set) throw new TypeError("Cannot create accessor");
    configurable ??= true;
    enumerable ??= true;
    return new _Property(name, { get, set, configurable, enumerable });
  }
  static data(name, value, { writable, configurable, enumerable } = {}) {
    if (!name) throw new TypeError("Cannot create data property without name");
    writable ??= true;
    configurable ??= true;
    enumerable ??= true;
    return new _Property(name, { value, writable, configurable, enumerable });
  }
  static from(object, name) {
    const descriptor = Object.getOwnPropertyDescriptor(object, name);
    return new _Property(name, descriptor);
  }
  static get is() {
    return {
      object(value) {
        return value && ["object", "function"].some((k) => k == typeof value);
      },
      descriptor(object) {
        if (!_Property.is.object(object)) {
          return false;
        }
        const present = (element) => Reflect.has(object, element);
        const props = {
          base: ["configurable", "enumerable"],
          data: ["writable", "value"],
          accessor: ["get", "set"]
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
    };
  }
  static {
    const storage = Object.assign(/* @__PURE__ */ Object.create(null), {
      key: void 0,
      meta: {
        enumerable: true,
        configurable: true,
        accessor: {
          get: void 0,
          set: void 0
        },
        data: {
          value: void 0,
          writable: true
        }
      }
    });
    basic_accessor(this.prototype, "key", storage.key, storage);
    basic_accessor(this.prototype, "meta", storage.meta, storage);
  }
};
var PropertyExtensions = new import_extension11.Extension(Property);
function basic_accessor(prototype, key, initialValue, storage = {}) {
  storage[key] = initialValue;
  Object.defineProperty(prototype, key, {
    get() {
      return storage[key];
    },
    set(value) {
      storage[key] = value;
    },
    enumerable: true,
    configurable: true
  });
  return Object.getOwnPropertyDescriptor(prototype, key);
}

// src/classes/refmap.js
var import_extension17 = require("@nejs/extension");

// src/object.extensions.js
var import_extension15 = require("@nejs/extension");

// src/symbol.extensions.js
var import_extension14 = require("@nejs/extension");

// src/classes/symkeys.js
var import_extension12 = require("@nejs/extension");
var Symkeys = class _Symkeys {
  /**
   * Adds a new symbol to the Symkeys instance with the given name and
   * associated data.
   *
   * This method generates a unique symbol based on the provided name,
   * optional domain, separator, and token. It also allows embedding
   * additional data into the symbol's name.
   *
   * @param {string} named - The base name for the new symbol.
   * @param {Object} options - Additional options for the symbol.
   * @param {*} [options.associate={}] - Data to associate with the symbol.
   * @param {Object} [options.embed] - Optional data to embed in the symbol.
   * @param {string} [options.useDomain] - Optional domain to include in the
   * symbol's name.
   * @param {string} [options.useSeparator] - Optional separator to use in
   * the symbol's name.
   * @param {string} [options.useToken] - Optional token to use for the
   * symbol. If not provided, a random token is generated.
   * @returns {Symbol} The newly created symbol.
   *
   * @example
   * // Add a symbol with associated data
   * const mySymbol = symkeys.add('myIdentifier', {
   *   associate: { foo: 'bar' },
   *   embed: { baz: 'qux' },
   *   useDomain: 'exampleDomain',
   *   useSeparator: '-',
   *   useToken: 'customToken',
   * })
   * console.log(mySymbol)
   * // Symbol(@exampleDomain-myIdentifier {"baz":"qux"} #customToken)
   */
  add(named, {
    associate = {},
    embed = void 0,
    useDomain = void 0,
    useSeparator = void 0,
    useToken = void 0
  }) {
    const token = useToken ?? _Symkeys.token;
    let symName = this.calculateName(named, useDomain, useSeparator);
    if (embed && typeof embed === "object") {
      try {
        symName += ` ${JSON.stringify(embed)}`;
      } catch (error) {
        console.warn(`Cannot create JSON from ${embed}; skipping`);
      }
    }
    const symbol = Symbol.for(`@${symName} #${token}`);
    this[_Symkeys.kDataKey].set(symbol, associate ?? {});
    return symbol;
  }
  /**
   * Creates or retrieves a shared symbol key with the given name and
   * optional associated data.
   *
   * This method generates a shared symbol key using the provided name
   * and optional parameters. If the symbol already exists in the
   * Symkeys's internal map, it updates the associated data if provided.
   * Otherwise, it creates a new symbol with the specified parameters.
   *
   * @param {string} named - The name to use for the shared symbol key.
   * @param {Object} options - Optional parameters for the shared symbol key.
   * @param {Object} [options.associate] - Data to associate with the symbol.
   * @param {Object} [options.embed] - Data to embed in the symbol's name.
   * @param {string} [options.useDomain] - Domain to include in the symbol's name.
   * @param {string} [options.useSeparator] - Separator to use in the symbol's name.
   * @returns {Symbol} The shared symbol key.
   *
   * @example
   * // Create or retrieve a shared symbol key with associated data
   * const sharedSymbol = symkeys.sharedKey('mySharedKey', {
   *   associate: { foo: 'bar' },
   *   embed: { baz: 'qux' },
   *   useDomain: 'exampleDomain',
   *   useSeparator: '-',
   * })
   * console.log(sharedSymbol)
   * // Symbol(@exampleDomain-mySharedKey {"baz":"qux"} #shared)
   */
  sharedKey(named, { associate, embed, useDomain, useSeparator }) {
    const symName = this.calculateName(named, useDomain, useSeparator);
    let json = "";
    if (embed && typeof embed === "object") {
      try {
        json = ` ${JSON.stringify(embed)}`;
      } catch (ignored) {
      }
    }
    const symbol = Symbol.for(`@${symName}${json} #shared`);
    if (this[_Symkeys.kDataKey].has(symbol)) {
      if (associate && symbol.isSymkey) {
        symbol.data = associate;
      }
      return symbol;
    }
    return this.add(named, {
      associate: associate ?? {},
      embed,
      useDomain,
      useSeparator,
      useToken: "shared"
    });
  }
  /**
   * Retrieves the data associated with a given symbol from the Symkeys.
   *
   * This method allows access to the data that has been associated with a
   * particular symbol in the Symkeys. It is useful for retrieving stored
   * information when only the symbol is known.
   *
   * @param symbol - The symbol whose associated data is to be
   * retrieved.
   * @returns The data associated with the symbol, or undefined if
   *                   the symbol is not found in the Symkeys.
   *
   * @example
   * // Assuming 'mySymbol' is a symbol that has been added to the Symkeys
   * // with associated data
   * const data = Symkeys.dataFor(mySymbol);
   * console.log(data); // Output: The data associated with 'mySymbol'
   */
  data(forSymbol) {
    return this[_Symkeys.kDataKey].get(forSymbol);
  }
  /**
   * Deletes the data associated with a given symbol from the Symkeys.
   *
   * This method allows removal of the data that has been associated with a
   * particular symbol in the Symkeys. It is useful when you want to clean up
   * or remove stored information associated with a symbol.
   *
   * @param {Symbol} forSymbol - The symbol whose associated data is to be
   * deleted.
   * @param {*} replaceWith - Optionally, if `replaceWith` is not `undefined`,
   * a new value can be set after the original is deleted
   * @returns {boolean} - Returns true if an element in the Symkeys existed and
   * has been removed, or false if the element does not exist
   *
   * @example
   * // Assuming 'mySymbol' is a symbol that has been added to the Symkeys
   * // with associated data
   * const isDeleted = Symkeys.deleteData(mySymbol);
   * console.log(isDeleted); // Output: true if data was deleted, false otherwise
   */
  deleteData(forSymbol, replaceWith = void 0) {
    if (this.hasData(forSymbol)) {
      const result = this[_Symkeys.kDataKey].delete(forSymbol);
      if (replaceWith !== void 0) {
        this[_Symkeys.kDataKey].set(forSymbol, replaceWith);
      }
      return result;
    }
    return false;
  }
  /**
   * Checks if the Symkeys instance has data associated with a given symbol.
   *
   * This method checks if the Symkeys instance has any data associated with
   * the provided symbol. It is useful when you need to verify if data exists
   * for a particular symbol before attempting to retrieve or manipulate it.
   *
   * @param {Symbol} forSymbol - The symbol to check for associated data.
   * @returns {boolean} Returns true if data exists for the symbol, false otherwise.
   *
   * @example
   * // Assuming 'mySymbol' is a symbol that has been added to the Symkeys
   * // with associated data
   * const hasData = Symkeys.hasData(mySymbol);
   * console.log(hasData); // Output: true if data exists, false otherwise
   */
  hasData(forSymbol) {
    return this[_Symkeys.kDataKey].has(forSymbol);
  }
  /**
   * Sets the data associated with a given symbol in the Symkeys.
   *
   * This method allows you to associate data with a particular symbol in the
   * Symkeys. It is useful when you want to store information that can be
   * retrieved later using the symbol.
   *
   * Note that setting only succeeds if the Symkey symbol has already been
   * added via {@link Symkeys.add}
   *
   * @param {Symbol} forSymbol - The symbol with which the data is to be
   * associated.
   * @param {*} value - The data to be associated with the symbol.
   * @returns {boolean} true if the value has been set, false if the key
   * has not yet been added via {@link Symkeys.add}
   *
   * @example
   * // Assuming 'mySymbol' is a symbol that has been added to the Symkeys
   * // and 'myData' is the data to be associated with 'mySymbol'
   * Symkeys.setData(mySymbol, myData);
   */
  setData(forSymbol, value) {
    if (this.hasData(forSymbol)) {
      this[_Symkeys.kDataKey].set(forSymbol, value);
      return true;
    }
    return false;
  }
  /**
   * Extracts the token part from a symbol created by the `add` method.
   *
   * This method parses the string representation of a symbol to retrieve
   * the unique token that was appended to the symbol's name upon creation.
   * It is useful for debugging or for operations that require knowledge of
   * the token associated with a symbol.
   *
   * @param symbol - The symbol whose token is to be extracted.
   * @returns The extracted token or undefined if the
   * token cannot be extracted.
   *
   * @example
   * // Assuming 'mySymbol' is a symbol created with the name 'myEntry'
   * // and a token 'agftofxob6f'
   * const token = Symkeys.tokenFor(mySymbol);
   * console.log(token); // Output: 'agftofxob6f'
   */
  token(forSymbol) {
    return /^.* \#(.*?)$/.exec(forSymbol)?.description?.[1];
  }
  /**
   * Retrieves the separator used in the Symkeys instance.
   *
   * This getter method allows access to the separator that is used to
   * distinguish between different parts of a symbol in the Symkeys instance.
   * It is useful when you need to know the separator for parsing symbols or
   * constructing new ones.
   *
   * @returns {string} The separator used in the Symkeys instance.
   *
   * @example
   * // Assuming the Symkeys instance has a separator '.'
   * const separator = Symkeys.separator;
   * console.log(separator); // Output: '.'
   */
  get separator() {
    return this[kSeparator];
  }
  /**
   * Retrieves an iterator for the symbols stored in the Symkeys.
   *
   * This method provides access to the symbols that have been stored in
   * the Symkeys. It returns an iterator which can be used to loop over
   * all the symbols. This is particularly useful for iterating through
   * all stored data without knowing the individual symbols in advance.
   *
   * @returns An iterator that yields all the symbols
   * stored in the Symkeys.
   *
   * @example
   * // Assuming the Symkeys has symbols stored
   * for (const symbol of Symkeys.symbols()) {
   *   console.log(symbol);
   * }
   */
  symbols() {
    return this[_Symkeys.kDataKey].keys();
  }
  /**
   * Calculates a name by combining a provided name, domain, and separator.
   *
   * This method takes a provided name, domain, and separator as input and
   * constructs a new name by combining these elements. If the domain or
   * separator are not provided, it uses the default domain and separator
   * stored in the Symkeys instance. If the provided name starts with the
   * separator, it removes the leading separator from the name.
   *
   * If the domain ends with the separator, it removes the trailing separator
   * from the domain. If the domain is empty, it sets the separator to an
   * empty string.
   *
   * @param {string} providedName - The name to be used in the calculation.
   * @param {string} [useDomain] - The domain to be used in the calculation.
   * If not provided, the default domain of the Symkeys instance is used.
   * @param {string} [useSeparator] - The separator to be used in the
   * calculation. If not provided, the default separator of the Symkeys
   * instance is used.
   * @returns {string} The calculated name.
   *
   * @example
   * // Assuming the Symkeys instance has a domain 'symkeys.internal'
   * // and a separator '.'
   * const name = Symkeys.calculateName('feature', 'symkeys.public', '/');
   * console.log(name); // Output: 'symkeys.public/feature'
   */
  calculateName(providedName, useDomain, useSeparator) {
    let domain = String(useDomain || this[_Symkeys.kDomain]);
    let separator = String(useSeparator || this[_Symkeys.kSeparator]);
    let postfix = String(providedName).startsWith(separator) ? providedName.substring(1) : providedName;
    if (domain.length) {
      if (domain.endsWith(separator)) {
        domain = domain.substring(0, domain.length - 1);
      }
    } else {
      separator = "";
    }
    return `${domain}${separator}${postfix}`;
  }
  /**
   * Constructs a new instance of the Symkeys, setting up a proxy to
   * intercept and manage access to properties.
   *
   * This constructor initializes the Symkeys with a proxy that
   * overrides the default behavior for property access, checking, and
   * enumeration. It allows the Symkeys to behave like a map for its
   * own properties, while also maintaining the prototype chain.
   *
   * @param {string} domain an optional prefix string, to which the
   * `separator` parameter value will be guaranteed to have in between
   * the domain (if truthy) and the name of the added key.
   * @param {string} separator defaults to a period. So if your domain
   * is 'symkeys.internal' then calling {@link add()} with a name of
   * `"feature"` will result in the full name being
   * `"symkeys.internal.feature"`
   *
   * @example
   * const Symkeys = new Symkeys();
   * Symkeys[Symbol.for('myProperty')] = 'myValue';
   * console.log(Symkeys[Symbol.for('myProperty')]); // 'myValue'
   */
  constructor(domain = "", separator = ".") {
    const prototype = Object.create(Object.getPrototypeOf(this));
    this[_Symkeys.kPrototype] = prototype;
    this[_Symkeys.kDataKey] = /* @__PURE__ */ new Map();
    this[_Symkeys.kDomain] = typeof domain === "string" && domain;
    this[_Symkeys.kSeparator] = separator;
    const map3 = this[_Symkeys.kDataKey];
    Object.setPrototypeOf(
      this,
      new Proxy(Object.create(prototype), {
        // Return the stored prototype for the target.
        getPrototypeOf(_) {
          return prototype;
        },
        // Intercept property access.
        get(target, property2, receiver) {
          if (map3.has(property2)) {
            return map3.get(property2);
          }
          return Reflect.get(target, property2, receiver);
        },
        // Check for property existence. Check both the Symkeys map and the target for
        // the property.
        has(target, property2) {
          return map3.has(property2) || Reflect.has(target, property2);
        },
        // Retrieve all property keys. Combine keys from the Symkeys map and the target.
        ownKeys(target) {
          return [...Array.from(map3.keys()), ...Reflect.ownKeys(target)];
        },
        // Intercept property assignment.
        set(_, property2, value, __) {
          if (map3.has(property2)) {
            map3.set(property2, value);
            return true;
          }
          return false;
        },
        // Retrieve property descriptors.
        getOwnPropertyDescriptor(_, property2) {
          const object = [...map3.entries()].reduce(
            (a, e) => Object.assign(a, { [e[0]]: e[1] }),
            {}
          );
          return Object.getOwnPropertyDescriptor(object, property2);
        }
      })
    );
  }
  /**
   * Checks if a given value is a Symkey.
   *
   * This method checks if the provided value is a Symkey. A Symkey is a
   * symbol that matches a specific pattern. The pattern is defined as a
   * symbol that starts with '@', followed by any characters, a space, a '#',
   * and ends with one or more word characters.
   *
   * @param {Symbol} value - The value to check.
   * @returns {boolean} Returns true if the value is a Symkey, false otherwise.
   *
   * @example
   * // Check if a symbol is a Symkey:
   * const sym = Symbol('@nejs.prototype #rwiy2o905d');
   * console.log(Symkeys.isSymkey(sym)); // Outputs: true
   */
  static isSymkey(value) {
    if (!(typeof value === "symbol" || value instanceof Symbol)) {
      return false;
    }
    return !!/^@.*? #\w+$/.exec(value?.description);
  }
  /**
   * Generates a random token string.
   *
   * This method creates a pseudo-random token that can be used for various
   * purposes within the library, such as generating unique identifiers or
   * keys. The token is generated using a base 36 encoding, which includes
   * numbers and lowercase letters.
   *
   * @returns A random token string.
   *
   * @example
   * // Example of getting a random token:
   * const token = MyClass.token;
   * console.log(token); // Outputs a string like 'qg6k1zr0is'
   */
  static get token() {
    return Math.random().toString(36).slice(2);
  }
  /**
   * Reusable publicly static key for identifying where data is stored.
   */
  static get kDataKey() {
    return Symbol.for("symkeys.data");
  }
  /**
   * Reusable publicly static key for identifying where data is stored.
   */
  static get kPrototype() {
    return Symbol.for("symkeys.prototype");
  }
  /**
   * A static getter that returns a unique, reusable symbol for 'symkeys.domain'.
   *
   * This getter is used to create a unique symbol that can be used as a key
   * for storing and retrieving domain-specific data in the Symkeys. The symbol
   * is created using the `Symbol.for` method, which ensures that the same
   * symbol is returned for a given key, in this case 'symkeys.domain'.
   *
   * @returns {Symbol} A unique symbol for 'symkeys.domain'.
   *
   * @example
   * // Retrieve the 'symkeys.domain' symbol
   * const domainSymbol = Symkeys.kDomain;
   * console.log(domainSymbol); // Outputs: Symbol(symkeys.domain)
   */
  static get kDomain() {
    return Symbol.for("symkeys.domain");
  }
  /**
   * A static getter that returns a unique, reusable symbol for 'symkeys.separator'.
   *
   * This getter is used to create a unique symbol that can be used as a key
   * for storing and retrieving separator-specific data in the Symkeys. The symbol
   * is created using the `Symbol.for` method, which ensures that the same
   * symbol is returned for a given key, in this case 'symkeys.separator'.
   *
   * @returns {Symbol} A unique symbol for 'symkeys.separator'.
   *
   * @example
   * // Retrieve the 'symkeys.separator' symbol
   * const separatorSymbol = Symkeys.kSeparator;
   * console.log(separatorSymbol); // Outputs: Symbol(symkeys.separator)
   */
  static get kSeparator() {
    return Symbol.for("symkeys.separator");
  }
};
var SymkeysExtension = new import_extension12.Extension(Symkeys);

// src/json.extensions.js
var import_extension13 = require("@nejs/extension");
var JSONExtensions = new import_extension13.Patch(JSON, {
  [import_extension13.Patch.kMutablyHidden]: {
    extractAllFrom(string) {
      const pattern = this.JSONStartPattern;
      const notJSON = Symbol("Value is not valid JSON");
      const decoder = (part2) => {
        try {
          return JSON.parse(part2);
        } catch (_) {
          return notJSON;
        }
      };
      const parts = [];
      let part = void 0;
      while (part = pattern.exec(string)) {
        parts.push(decoder(part?.[0]));
      }
      return parts.filter((isJSON) => isJSON !== notJSON);
    },
    /**
     * The `extractFrom` method attempts to extract a JSON object from a string.
     * It uses a regular expression to identify potential JSON objects in the
     * string and attempts to parse them. If a valid JSON object is found, it is
     * returned. If no valid JSON object is found, the method returns undefined.
     *
     * NOTE: This method will only find JSON from an iterated upon start spot
     * until the end of the string. So `'JSON follows {"count": 0}'` will
     * return `{count: 0}` but `'JSON follows {"count": 0} and more'` will
     * fail to locate any JSON in the String. You've been warned.
     *
     * @param {string} string - The string from which to extract a JSON object.
     * @returns {Object|undefined} - The first valid JSON object found in the
     * string, or undefined if no valid JSON object is found.
     *
     * @example
     * // Suppose we have a string with embedded JSON
     * const str1 = 'Hello {"name":"John", "age":30} World'
     * const str2 = 'Hello {"name": "John", "age": 30}'
     *
     * // Using `extractFrom`
     * console.log(JSON.extractFrom(str1))  // Output: undefined
     * console.log(JSON.extractFrom(str2))  // Output: {name: 'John', age: 30}
     */
    extractFrom(string) {
      this.extractAllFrom(string)?.[0];
    },
    /**
     * The `mightContain` method checks if a string might contain a JSON object.
     * It uses the `JSONStartPattern` regular expression to search for potential
     * JSON objects in the string. If a potential JSON object is found, the method
     * returns true. If no potential JSON object is found, the method returns false.
     *
     * @param {string} string - The string to check for potential JSON objects.
     * @returns {boolean} - Returns true if the string might contain a JSON object,
     * false otherwise.
     *
     * @example
     * // Suppose we have a string with embedded JSON
     * const str = 'Hello {"name":"John", "age":30} World'
     *
     * // Using `mightContain`
     * console.log(JSON.mightContain(str))  // Output: true
     */
    mightContain(string, detail = false) {
      const results = this.JSONStartPattern.exec(string);
      return detail ? [!!results, results?.index ?? -1, results] : !!results;
    },
    /**
     * Getter method for the JSONStartPattern.
     *
     * This method constructs a regular expression pattern that is used to
     * identify potential JSON objects in a string. The pattern is designed
     * to match various JSON data types including null, boolean, number,
     * string, object, and array.
     *
     * The pattern is constructed using an array of strings, each representing
     * a part of the pattern. The array is then joined into a single string
     * and passed to the RegExp constructor to create the pattern.
     *
     * @returns {RegExp} - The constructed regular expression pattern.
     *
     * @example
     * // Using `JSONStartPattern`
     * const pattern = JSONStartPattern;
     * const str = 'Hello {"name":"John", "age":30} World';
     * const match = pattern.exec(str);
     * console.log(match[0]);  // Output: '{"name":"John", "age":30}'
     */
    get JSONStartPattern() {
      const pattern = new RegExp([
        "(?:",
        // Start with a non-capturing group and match
        "(null)|",
        // ...a null
        "(true|false)|",
        // ...a bool
        "(\\d+\\.?\\d*)|",
        // ...a number (including floats)
        '("[^\\"]*(?:[^:])")|',
        // ...a double quote (start of string)
        "((?:\\{.*\\})+)|",
        // ...an open curly brace (object)
        "((?:\\[.*\\]+))",
        // ...an open square bracket (array)
        ")+"
        // End of the groups
      ].join(""), "gm");
      return pattern;
    }
  }
});

// src/symbol.extensions.js
var JSONToggle = new import_extension14.PatchToggle(JSONExtensions);
var symkeys = new Symkeys("nejs");
var SymbolExtensions = new import_extension14.Patch(Symbol, {
  /**
   * Adds a new symbol to the Symkeys instance with the given name and
   * associated data.
   *
   * This method generates a unique symbol based on the provided name,
   * optional domain, separator, and token. It also allows embedding
   * additional data into the symbol's name.
   *
   * @param {string} named - The base name for the new symbol.
   * @param {Object} options - Additional options for the symbol.
   * @param {*} [options.associate={}] - Data to associate with the symbol.
   * @param {Object} [options.embed] - Optional data to embed in the symbol.
   * @param {string} [options.useDomain] - Optional domain to include in the
   * symbol's name.
   * @param {string} [options.useSeparator] - Optional separator to use in
   * the symbol's name.
   * @param {string} [options.useToken] - Optional token to use for the
   * symbol. If not provided, a random token is generated.
   * @returns {Symbol} The newly created symbol.
   *
   * @example
   * // Add a symbol with associated data
   * const mySymbol = SymbolExtensions.add('myIdentifier', {
   *   associate: { foo: 'bar' },
   *   embed: { baz: 'qux' },
   *   useDomain: 'exampleDomain',
   *   useSeparator: '-',
   *   useToken: 'customToken',
   * })
   * console.log(mySymbol)
   * // Symbol(@exampleDomain-myIdentifier {"baz":"qux"} #customToken)
   */
  add(named, { associate = {}, embed, useToken, useDomain, useSeparator }) {
    return this.keys.add(named, {
      associate,
      embed,
      useToken,
      useDomain,
      useSeparator
    });
  },
  /**
   * Deletes the data associated with a given symbol from the Symkeys
   * instance.
   *
   * This method allows removal of the data that has been associated with a
   * particular symbol in the Symkeys instance. It is useful when you want
   * to clean up or remove stored information associated with a symbol.
   *
   * @param {Symbol} forSymbol - The symbol whose associated data is to be
   * deleted.
   * @param {*} [replaceWith=undefined] - Optionally, if `replaceWith` is
   * not `undefined`, a new value can be set after the original is deleted
   * @returns {boolean} - Returns true if an element in the Symkeys existed
   * and has been removed, or false if the element does not exist
   *
   * @example
   * // Assuming 'mySymbol' is a symbol that has been added to the Symkeys
   * // with associated data
   * const isDeleted = Symbol.deleteData(mySymbol)
   * console.log(isDeleted) // Output: true if data was deleted, false
   *
   * @example
   * // Deleting data and replacing it with a new value
   * const mySymbol = Symbol.for('mySymbol')
   * Symbol.setData(mySymbol, { foo: 'bar' })
   * Symbol.deleteData(mySymbol, { newFoo: 'newBar' })
   * console.log(Symbol.keys.data(mySymbol)) // Output: { newFoo: 'newBar' }
   */
  deleteData(forSymbol, replaceWith = void 0) {
    return this.keys.deleteData(forSymbol, replaceWith);
  },
  /**
   * Evaluates a key or value and generates a shared symbol key based on
   * the provided object name and owner name.
   *
   * This method takes a key or value, an object name, and an object owner
   * name as parameters. It determines the type of each parameter and
   * constructs a token string by concatenating the owner name, object
   * name, and key/value (if they are valid object keys).
   *
   * The token string is then used to create a shared symbol key using the
   * `sharedKey` method of the current instance. The shared symbol key is
   * returned along with the token as associated data.
   *
   * @param {string|Symbol} keyOrValue - The key or value to evaluate.
   * @param {string|Symbol} objectName - The name of the object associated
   * with the key or value.
   * @param {string|Function|Object} objectOwnerName - The name of the
   * owner of the object.
   * @returns {Symbol} The shared symbol key generated based on the
   * provided parameters.
   *
   * @example
   * const symbolKey = SymbolExtensions.evalKey('myKey', 'myObject', 'myOwner')
   * console.log(symbolKey)
   * // Output: Symbol(@nejs.internal.refkey:myOwner.myObject.myKey)
   *
   * @example
   * const symbolKey = SymbolExtensions.evalKey(
   *   'myValue', () => {}, { [Symbol.toStringTag]: 'myOwner' }
   * )
   * console.log(symbolKey)
   * // Output: Symbol(@nejs.internal.refkey:myOwner.myValue)
   */
  evalKey(keyOrValue, objectName, objectOwnerName) {
    const is2 = {
      string(v) {
        return typeof v === "string";
      },
      func(v) {
        return typeof v === "function";
      },
      object(v) {
        return typeof v === "object";
      },
      objKey(v) {
        return ["symbol", "string"].some((k) => typeof v === k);
      }
    };
    is2.key = is2.objKey(keyOrValue);
    const ownerName = is2.string(objectOwnerName) && objectOwnerName || is2.func(objectOwnerName) && objectOwnerName?.name || is2.object(objectOwnerName) && objectOwnerName?.[Symbol.toStringTag] || void 0;
    const token = [
      ownerName && `${ownerName}.` || "",
      is2.objKey(objectName) && `${objectName}.` || "",
      is2.objKey(keyOrValue) && `${keyOrValue}`
    ].join("");
    return this.sharedKey(`internal.refkey:${token}`, { token });
  },
  /**
   * Checks if the Symkeys instance has data associated with a given
   * symbol
   *
   * This method checks if the Symkeys instance has any data associated
   * with the provided symbol. It is useful when you need to verify if
   * data exists for a particular symbol before attempting to retrieve
   * or manipulate it
   *
   * @param {Symbol} forSymbol - The symbol to check for associated data
   * @returns {boolean} Returns true if data exists for the symbol,
   *                    false otherwise
   *
   * @example
   * // Assuming 'mySymbol' is a symbol that has been added to the
   * // Symkeys with associated data
   * const hasData = Symbol.hasData(mySymbol)
   * console.log(hasData) // Output: true
   *
   * @example
   * // Assuming 'nonExistentSymbol' is a symbol that has not been added
   * // to the Symkeys
   * const hasData = Symbol.hasData(nonExistentSymbol)
   * console.log(hasData) // Output: false
   */
  hasData(forSymbol) {
    return this.keys.hasData(forSymbol);
  },
  /**
   * The `isSymbol` method does exactly what one would it expect. It returns
   * true if the string matches typeof or instanceof as a symbol.
   *
   * @param {*} value checks to see if the `value` is a string
   * @returns {boolean} `true` if it is a `Symbol`, `false` otherwise
   */
  isSymbol(value) {
    return value && typeof value === "symbol";
  },
  /**
   * Returns true if the supplied value is a Symbol created using
   * `Symbol.for()`.
   *
   * @param {any} value assumption is that the supplied value is of type
   * 'symbol' however, unless `allowOnlySymbols` is set to `true`, `false`
   * will be returned for any non-symbol values.
   * @param {boolean} allowOnlySymbols true if an error should be thrown
   * if the supplied value is not of type 'symbol'
   * @returns true if the symbol is registered, meaning, none of the spec
   * static symbols (`toStringTag`, `iterator`, etc...), and no symbols
   * created by passing a value directly to the Symbol function, such as
   * `Symbol('name')`
   */
  isRegistered(value, allowOnlySymbols = false) {
    if (!Symbol.isSymbol(value)) {
      if (allowOnlySymbols) {
        throw new TypeError("allowOnlySymbols specified; value is not a symbol");
      }
      return false;
    }
    return Symbol.keyFor(value) !== void 0;
  },
  /**
   * A function that returns true if the symbol is not registered, meaning,
   * any of the spec static symbols (`toStringTag`, `iterator`, etc...), and
   * any symbols created by passing a value directly to the `Symbol` function,
   * such as `Symbol('name')`.
   *
   * @param {any} value assumption is that the supplied value is of type
   * 'symbol' however, unless allowOnlySymbols is set to true, false will
   * be returned for any non-symbol values.
   * @param {boolean} allowOnlySymbols true if an error should be thrown
   * if the supplied value is not of type 'symbol'
   * @returns true if the symbol is not registered, meaning, any of the
   * spec static symbols (`toStringTag`, `iterator`, etc...), and any symbols
   * created by passing a value directly to the `Symbol` function, such as
   * `Symbol('name')`
   * @returns true if the `value` in question is both a `symbol` and has
   * returns `undefined` if passed to `Symbol.keyFor`
   */
  isNonRegistered(value, allowOnlySymbols = false) {
    return !Symbol.isRegistered(value, allowOnlySymbols);
  },
  /**
   * `keys` is an instance of the `Symkeys` class, initialized with the
   * domain 'nejs'. The `Symkeys` class provides a way to easily generate
   * Symbol.for elements that follow particular pattern. Symkeys also
   * allows associated data storage with each generated key.
   *
   * @type {Symkeys}
   * @see {@link SymKeys}
   * @example
   * // Returns something like Symbol.for('@nejs.prototype #rwiy2o905d')
   * const kOriginal = Symbol.keys.add('prototypes')
   *
   * // Which can be used to retrieve and fetch data associated with that key
   * // The value stored is an array by default, but can be anything. It can
   * // be accessed one property at a time
   * Symbol.keys[kOriginal].original = Object.prototype
   * Symbol.keys[kOriginal].modified = Object.create(Object.prototype, ...)
   *
   * // Or wholesale replaced
   * Symbol.keys[kOriginal] = [Object.prototype, Array.prototype]
   *
   * // But if all Symbol Extensions are in place, including prototype add-ons
   * kOriginal.data.original = Object.prototype           // ...and...
   * kOriginal.data = [Object.prototype, Array.prototype] // ...both work
   */
  get keys() {
    return symkeys;
  },
  /**
   * Sets the data associated with a given symbol in the Symkeys
   * instance.
   *
   * This method allows you to store data associated with a specific
   * symbol in the Symkeys instance. It is useful when you want to
   * attach additional information or metadata to a symbol for later
   * retrieval.
   *
   * @param {Symbol} forSymbol - The symbol for which to set the
   * associated data.
   * @param {*} value - The data to be associated with the symbol.
   *
   * @example
   * // Create a symbol
   * const mySymbol = Symbol.for('mySymbol')
   *
   * // Set data for the symbol
   * Symbol.setData(mySymbol, { foo: 'bar' })
   *
   * // Retrieve the data associated with the symbol
   * const data = Symbol.keys.data(mySymbol)
   * console.log(data) // Output: { foo: 'bar' }
   */
  setData(forSymbol, value) {
    this.keys.setData(forSymbol, value);
  },
  /**
   * Creates or retrieves a shared symbol key with the given name and
   * optional associated data.
   *
   * This method generates a shared symbol key using the provided name
   * and optional parameters. If the symbol already exists in the
   * Symkeys's internal map, it updates the associated data if provided.
   * Otherwise, it creates a new symbol with the specified parameters.
   *
   * @param {string} named - The name to use for the shared symbol key.
   * @param {Object} options - Optional parameters for the shared symbol key.
   * @param {Object} [options.associate] - Data to associate with the symbol.
   * @param {Object} [options.embed] - Data to embed in the symbol's name.
   * @param {string} [options.useDomain] - Domain to include in the symbol's name.
   * @param {string} [options.useSeparator] - Separator to use in the symbol's name.
   * @returns {Symbol} The shared symbol key.
   *
   * @example
   * // Create or retrieve a shared symbol key with associated data
   * const sharedSymbol = Symbol.sharedKey('mySharedKey', {
   *   associate: { foo: 'bar' },
   *   embed: { baz: 'qux' },
   *   useDomain: 'exampleDomain',
   *   useSeparator: '-',
   * })
   * console.log(sharedSymbol)
   * // Output: Symbol(@exampleDomain-mySharedKey {"baz":"qux"} #shared)
   */
  sharedKey(named, options) {
    return this.keys.sharedKey(named, options);
  },
  /**
   * A symbol used as the storage key for the single instance of a
   * singleton.
   *
   * This getter returns a unique symbol created using `Symbol.for()`
   * with the string 'singleton'. The symbol is used to store and
   * retrieve the single instance of a singleton object.
   *
   * @type {symbol}
   * @readonly
   *
   * @example
   * const singletonKey = Symbol.singleton
   * const singletonInstance = {}
   * global[singletonKey] = singletonInstance
   */
  get singleton() {
    return Symbol.for("singleton");
  },
  /**
   * Creates a new Symbol with the given name and optional data. If data
   * is provided, it will be stringified and appended to the symbol's
   * name. This method is useful for creating unique symbols that carry
   * additional metadata.
   *
   * @param {string} name The name of the symbol.
   * @param {*} [data] Optional data to be associated with the symbol.
   * @returns {symbol} A new symbol created with Symbol.for(), using the
   * provided name and stringified data (if provided).
   *
   * @example
   * const symbolWithData = Symbol.withData('mySymbol', { foo: 'bar' })
   * console.log(symbolWithData.toString())
   * // Output: "Symbol(mySymbol {"foo":"bar"})"
   *
   * @example
   * const symbolWithoutData = Symbol.withData('mySymbol')
   * console.log(symbolWithoutData.toString())
   * // Output: "Symbol(mySymbol)"
   */
  withData(name, data2) {
    return data2 !== void 0 ? Symbol.for(`${name} ${JSON.stringify(data2)}`) : Symbol.for(name);
  }
});
var SymbolPrototypeExtensions = new import_extension14.Patch(Symbol.prototype, {
  [import_extension14.Patch.kMutablyHidden]: {
    /**
     * Returns an object representation of the symbol instance.
     *
     * This getter method creates and returns an object that wraps the
     * symbol instance, allowing it to be treated as an object. The
     * returned object is created using the `Object()` constructor,
     * which takes the symbol instance as its argument.
     *
     * @type {Object}
     * @readonly
     *
     * @example
     * const sym = Symbol('example')
     * console.log(typeof sym)        // 'symbol'
     * console.log(typeof sym.instance) // 'object'
     */
    get instance() {
      return Object(this);
    },
    /**
     * Getter method for retrieving the data associated with a symbol.
     *
     * This method first checks if the symbol is a Symkey created symbol
     * by checking the existence of Symbol.keys and if the symbol's
     * description matches the Symkey pattern. If it is a Symkey symbol,
     * it attempts to fetch its associated data.
     *
     * NOTE: Symkey data is returned as its value directly, this is because
     * it is stored in a {@link Map}. Embedded JSON data might be expensive
     * to parse and as such a function is returned when data is accessed that
     * needs to be invoked in order to decode its contents. See
     * `{@link mightHaveEmbeddedJSON}` for more information.
     *
     * If the symbol is not a Symkey symbol or if no data is associated
     * with it, the method attempts to parse the symbol's description as
     * JSON and returns the first valid JSON object found.
     *
     * If no valid JSON object is found in the description, the method
     * returns undefined.
     *
     * @type {Object|Function}
     * @readonly
     *
     * @example
     * const keys = new Symkeys
     * const key = keys.add('example', {count: 0})
     * const data = key.data // note this isn't function!!
     * const count = data.count
     *
     * @example
     * const sym = Symbol.for('fun {"name":"Brie"}')
     * let json = sym.data() // {name: 'Brie'} JS object
     *
     * @example
     * const sym = Symbol('mySymbol')
     * let data = sym.data() // undefined
     */
    get data() {
      if (Symbol?.keys && Symkeys.isSymkey(this)) {
        const possibleData = Symbol.keys[this];
        if (possibleData) {
          return possibleData;
        }
      }
      let result = void 0;
      let revertToggle = false;
      if (!JSONExtensions.applied) {
        JSONToggle.start();
        revertToggle = true;
      }
      if (JSON.mightContain(this.description)) {
        try {
          result = JSON.extractFrom(this.description);
        } catch (ignore) {
        }
      }
      if (revertToggle) {
        JSONToggle.stop();
      }
      return result;
    },
    /**
     * Sets the data associated with a symbol.
     *
     * This setter method checks if the symbol is a Symkey and if it has
     * associated data. If both conditions are met, it sets the data of the
     * symbol to the provided value and returns true. If the conditions are
     * not met, it simply returns false.
     *
     * While Symbols have been upgraded to also support embedded JSON data
     * with this extension, symbol descriptions are static. Non Symkey symbols
     * do not associated their data outside of a symbol, and cannot be changed,
     * there new data cannot be set on them.
     *
     * @param {any} value - The value to be set as the symbol's data.
     * @returns {boolean} - Returns true if the data was successfully set,
     * false otherwise.
     *
     * @example
     * const sym = Symbol.for('fun {"name":"Brie"}')
     * Symkeys.isSymkey(sym) // false; not in Symkey format
     * let json = sym.data() // {name: 'Brie'} JS object
     * sym.data = JSON.stringify({name: 'Jane'}) // fails silently
     * json = sym.data() // {name: 'Brie'} is hard-coded in description
     *
     * @example
     * const sym = Symbol('mySymbol')
     * Symkeys.isSymkey(sym) // false; not in Symkey format
     * Symkeys.hasData(sym) // false
     * sym.data = { name: 'John', age: 30 } // will fail silently
     * Symkeys.hasData(sym) // still false
     *
     * // Now let's create a Symkey with data
     * const symWithData = Symkeys.create('mySymbolWithData',
     *                                    { name: 'Jane', age: 25 })
     * Symkeys.isSymkey(symWithData) // true
     * Symkeys.hasData(symWithData) // true
     * symWithData.data = { name: 'Jane', age: 26 } // will succeed
     * Symkeys.getData(symWithData) // returns { name: 'Jane', age: 26 }
     */
    set data(value) {
      if (Symkeys.isSymkey(this)) {
        Symbol.keys.setData(this, value);
      } else {
        console.error(`The symbol ${this.description} is not a symkey`);
      }
    },
    /**
     * Retrieves the embedded JSON data from the symbol's description.
     *
     * This getter method checks if the symbol's description might contain
     * JSON data. If the description contains JSON, it parses and returns
     * the first JSON object found. If no JSON is found, it returns
     * `undefined`.
     *
     * @returns {Object|undefined} - The parsed JSON object if found,
     * otherwise `undefined`.
     *
     * @example
     * const sym = Symbol.for('example {"name":"Brie"}')
     * console.log(sym.embeddedJSON) // Output: { name: 'Brie' }
     *
     * @example
     * const sym = Symbol('noJSON')
     * console.log(sym.embeddedJSON) // Output: undefined
     */
    get embeddedJSON() {
      return JSONToggle.perform((toggle, patch) => {
        let [mightHave, index, parsed] = JSON.mightContain(
          this.description,
          true
        );
        if (mightHave) {
          return parsed?.[0];
        }
        return void 0;
      });
    },
    /**
     * Parses the embedded JSON data from the symbol's description.
     *
     * This getter method first retrieves the embedded JSON data using the
     * `embeddedJSON` getter. If JSON data is found, it attempts to parse
     * the JSON string and return the resulting object. If parsing fails,
     * an error is logged to the console.
     *
     * @returns {Object|undefined} - The parsed JSON object if parsing is
     * successful, otherwise `undefined`.
     *
     * @example
     * const sym = Symbol.for('example {"name":"Brie"}')
     * console.log(sym.embeddedJSONParsed) // Output: { name: 'Brie' }
     *
     * @example
     * const sym = Symbol('invalidJSON')
     * console.log(sym.embeddedJSONParsed) // Output: undefined
     */
    get embeddedJSONParsed() {
      const json = this.embeddedJSON;
      if (json) {
        try {
          return JSON.parse(json);
        } catch (error) {
          console.error(`Failed to parse json: "${json}"`);
        }
      }
      return void 0;
    },
    /**
     * Checks if the current symbol is a Symkey.
     *
     * This getter method determines whether the current symbol instance
     * conforms to the Symkey pattern. A Symkey is a symbol that matches
     * a specific pattern defined in the Symkeys class.
     *
     * @type {boolean}
     * @readonly
     *
     * @returns {boolean} - Returns true if the symbol is a Symkey,
     *                      otherwise false.
     *
     * @example
     * const sym = Symbol('@nejs.prototype #rwiy2o905d')
     * console.log(sym.isSymkey) // Output: true
     *
     * @example
     * const sym = Symbol('regularSymbol')
     * console.log(sym.isSymkey) // Output: false
     */
    get isSymkey() {
      return Symkeys.isSymkey(this);
    },
    /**
     * Checks if the symbol might have embedded JSON data.
     *
     * This getter method checks if the symbol's description might contain
     * JSON data and if the data property of the symbol is a function. If both
     * conditions are met, it returns true, otherwise it returns false.
     *
     * @returns {boolean} - Returns true if the symbol might have embedded
     * JSON, false otherwise.
     *
     * @example
     * const sym = Symbol.for('fun {"name":"Brie"}')
     * console.log(sym.mightHaveEmbeddedJSON) // Output: true
     *
     * @example
     * const sym = Symbol('mySymbol')
     * console.log(sym.mightHaveEmbeddedJSON) // Output: false
     */
    get mightHaveEmbeddedJSON() {
      return JSONToggle.perform((toggle, patch) => {
        return JSON.mightContain(this.description);
      });
    },
    /**
     * Retrieves the reference object associated with the symbol.
     *
     * This getter method checks if the symbol's description matches a
     * specific pattern using a regular expression. If a match is found,
     * it extracts the token from the description and constructs a shared
     * key using the token. It then retrieves the symbol associated with
     * the shared key using the `sharedKey` method of the
     * `SymbolExtensions.patches` object. Finally, it returns the data
     * associated with the retrieved symbol.
     *
     * If no match is found or the retrieved symbol has no associated
     * data, `undefined` is returned.
     *
     * @type {any}
     * @readonly
     *
     * @example
     * const sym = Symbol.for('@nejs.internal.refkey:example #shared')
     * console.log(sym.refObject) // Output: the data associated with the
     *                             // 'internal.refkey:example' shared key
     *
     * @example
     * const sym = Symbol('no_match')
     * console.log(sym.refObject) // Output: undefined
     */
    get refObject() {
      const re = /@nejs.internal.refkey:(\S+) #shared/.exec(this.description);
      if (re?.[1]) {
        const [_match, token] = re;
        const shareKey = `internal.refkey:${token}`;
        const symbol = SymbolExtensions.patches.sharedKey(shareKey);
        return symbol?.data;
      }
      return void 0;
    },
    /**
     * Returns a formatted string representation of the symbol's
     * description, highlighting any embedded JSON data.
     *
     * This getter method checks if the symbol's description contains
     * JSON data and formats it for better readability. It uses the
     * `sgr` function from the `String` object to apply color formatting
     * to the output.
     *
     * If the symbol's description contains JSON data longer than 30
     * characters, it truncates the JSON data and displays an ellipsis
     * in the middle. The JSON data is highlighted using the 'di' color
     * code.
     *
     * @type {string}
     * @readonly
     *
     * @example
     * const sym = Symbol.for('mySymbol {"name":"John Doe"}')
     * console.log(sym.sgrString)
     * // Output: Symbol.for(mySymbol {"name":"John ...hn Doe"})
     *
     * @example
     * const sym = Symbol('mySymbol')
     * console.log(sym.sgrString)
     * // Output: mySymbol
     */
    get sgrString() {
      let { sgr } = String;
      if (!sgr) {
        sgr = (string, ...args) => string;
      }
      const response = JSONToggle.perform((toggle, patch) => {
        let [mightContain, index, jsonResponse] = JSON.mightContain(this.description, true);
        let jsonText = jsonResponse?.[0];
        if (mightContain) {
          if (~index && jsonText && jsonText.length > 30) {
            let desc = this.description;
            let newDescription = [
              sgr(`Symbol.for(${desc.slice(0, index)}`, "green"),
              sgr(jsonText.slice(0, 10), "di"),
              "...",
              sgr(jsonText.slice(-5), "di"),
              sgr(`${desc.slice(index + jsonText.length + 1)})`, "green")
            ].join("");
            return `${newDescription}`;
          }
        }
      });
      return response ?? this.description;
    },
    /**
     * Custom inspect method for Node.js util.inspect.
     *
     * NOTE: this will only apply if looking at an instance of Symbol,
     * sadly; {@see SymbolPrototypeExtensions.instance}
     *
     * This method is used by Node.js util.inspect to provide a custom
     * representation of the symbol when inspected. It checks if the
     * symbol's description might contain JSON data and if so, it
     * truncates the JSON data in the description to a maximum of 30
     * characters and formats the output with colors using the `sgr`
     * function from the `String` object.
     *
     * @param {number} depth - The current depth of the recursive
     * inspection.
     * @param {Object} options - The options object passed to
     * util.inspect.
     * @param {Function} inspect - The original util.inspect function.
     *
     * @returns {string} - The formatted representation of the symbol.
     *
     * @example
     * const sym = Symbol.for('fun {"name":"John Doe"}')
     * console.log(util.inspect(sym))
     * // Output: Symbol.for(fun {"name":"John ...hn Doe"})
     */
    [Symbol.for("nodejs.util.inspect.custom")](depth, options, inspect) {
      let revert = false;
      let detail = void 0;
      let { sgr } = String;
      if (!sgr) {
        sgr = (string, ...args) => string;
      }
      if (!JSONExtensions.applied) {
        JSONToggle.start();
        revert = true;
      }
      if (detail = JSON.mightContain(this.description, true)) {
        let jsonText = detail[2]?.[0];
        let index = detail[1];
        if (~index && jsonText && jsonText.length > 30) {
          let desc = this.description;
          let newDescription = [
            sgr(`Symbol.for(${desc.slice(0, index)}`, "green"),
            sgr(jsonText.slice(0, 10), "di"),
            "...",
            sgr(jsonText.slice(-5), "di"),
            sgr(`${desc.slice(index + jsonText.length + 1)})`, "green")
          ].join("");
          if (revert) {
            JSONToggle.stop();
          }
          return `${newDescription}`;
        }
      }
      if (revert) {
        JSONToggle.stop();
      }
      return inspect(this, { colors: true });
    }
  }
});

// src/object.extensions.js
var { keys: symkeys2 } = SymbolExtensions.patches;
var ObjectExtensions = new import_extension15.Patch(Object, {
  [import_extension15.Patch.kMutablyHidden]: {
    add(...args) {
      const { isDescriptor: isDescriptor2 } = Descriptor;
      const { isObject: isObj } = this;
      const { kDescriptorStore } = this;
      let obj, key, value, _get, _set, storage, storageKey;
      let _type, _flag, _desc;
      if (args.length && isObj(args[0])) {
        ({
          to: obj,
          key,
          value,
          get: _get,
          set: _set,
          storage,
          storageKey,
          type: _type = ["accessor", "data"][1],
          flag: _flag = void 0,
          descriptorBase: _desc = void 0
        } = args[0]);
      } else if (args.length > 1) {
        [
          to,
          _type,
          key,
          getOrValue,
          _set,
          storage,
          storageKey,
          _flag,
          _desc
        ] = args;
        obj = to;
        _type = ["accessor", "data"].includes(_type.toLowerCase()) ? _type.toLowerCase() : "data";
        _get = _type === "accessor" ? getOrValue : void 0;
        _value = _type === "data" ? getOrValue : void 0;
      }
      if (!this.isObject(obj)) {
        console.warn("Object.add() must receive an object for `toObject`");
        return obj;
      }
      const more = isDescriptor2(_desc) ? _desc : {};
      const flag = _flag || Object.definitionType.mutablyVisible;
      const props = { ...import_extension15.Patch.getDescriptorOverridesFromSymbol(flag), ...more };
      const type = ["accessor", "data"].includes(_type) ? String(_type).toLowerCase() : "data";
      switch (type) {
        case "accessor":
          let store = storage;
          let storeKey = storageKey || key;
          let makeStore = false;
          let get = _get;
          let set = _set;
          if (!is.truthy(get) && !is.function(get)) {
            get = void 0;
          }
          if (!is.truthy(set) && !is.function(set)) {
            set = void 0;
          }
          if (isObj(store) || is.true(store) || is.function(store)) {
            makeStore = is.true(store);
            store = is.fn(store) ? store() : store;
            store = is.object(store) ? store : makeStore && {} || void 0;
          }
          if (!get && !set && makeStore) {
            Object.defineProperty(obj, kDescriptorStore, {
              value: symkeys2.add("descriptor.store", store),
              configurable: true,
              enumerable: false,
              writable: true
            });
            get = () => this[kDescriptorStore]?.data?.[storeKey];
            set = (value2) => {
              this[kDescriptorStore].data[storeKey] = value2;
            };
          } else if (get?.length && set?.length > 1 && store) {
            const innerGet = get;
            const innerSet = set;
            get = () => innerGet(store);
            set = (value2) => innerSet(value2, store);
          }
          Object.defineProperty(obj, key, { ...props, get, set });
          break;
        case "data":
          Object.defineProperty(obj, key, { ...props, value });
          break;
      }
      return obj;
    },
    addAccessor(to2, key, getter, setter, storage) {
      const store = storage ?? (!getter && !setter) ? true : void 0;
      return this.add({ to: to2, key, get: getter, set: setter, storage: store });
    },
    addData(to2, key, value) {
      return this.add({ to: to2, key, value });
    },
    /**
     * Creates a shallow copy of the provided object(s).
     *
     * This method uses the `copyObject` function with the `deep` parameter
     * set to `false`, indicating a shallow copy. It takes a destination
     * object and any number of source objects, and copies the properties
     * from the source objects to the destination object. If a property
     * already exists on the destination object, it will be overwritten.
     *
     * Note: This method does not copy nested objects or arrays. They are
     * copied by reference, not by value. To create a deep copy, use the
     * `deepCopy` method instead.
     *
     * @param {object} destination - The object to which properties will be
     * copied.
     * @param {...object} sources - The source object(s) from which
     * properties will be copied.
     * @returns {object} The destination object with the copied properties.
     *
     * @example
     * const obj1 = { a: 1, b: 2 };
     * const obj2 = { b: 3, c: 4 };
     * const result = ObjectExtensions.copy(obj1, obj2);
     * console.log(result); // Output: { a: 1, b: 3, c: 4 }
     */
    copy(destination, ...sources) {
      return copyObject(false, destination, ...sources);
    },
    /**
     * Creates a deep copy of the provided object(s).
     *
     * This method uses the `copyObject` function with the `deep` parameter
     * set to `true`, indicating a deep copy. It takes a destination
     * object and any number of source objects, and copies the properties
     * from the source objects to the destination object. If a property
     * already exists on the destination object, it will be overwritten.
     *
     * Note: This method copies nested objects or arrays by value, not by
     * reference. To create a shallow copy, use the `copy` method instead.
     *
     * @param {object} destination - The object to which properties will be
     * copied.
     * @param {...object} sources - The source object(s) from which
     * properties will be copied.
     * @returns {object} The destination object with the copied properties.
     *
     * @example
     * const obj1 = { a: 1, b: { c: 2 } };
     * const obj2 = { b: { d: 3 }, e: 4 };
     * const result = ObjectExtensions.deepCopy(obj1, obj2);
     * console.log(result); // Output: { a: 1, b: { d: 3 }, e: 4 }
     */
    deepCopy(destination, ...sources) {
      return copyObject(true, destination, ...sources);
    },
    /**
     * Defines a new property on an object with a specified value and
     * visibility/mutability flag. The flag determines the visibility and
     * mutability of the property. By default, the property is defined as
     * mutably hidden.
     *
     * @param {object} object - The object on which to define the property.
     * @param {string} key - The name of the property to be defined.
     * @param {any} value - The value of the property to be defined.
     * @param {symbol} [flag=Object.definitionType.mutablyHidden] - The
     * visibility/mutability flag for the property. This should be one of the
     * symbols available in `ObjectExtensions.definitionType`.
     * @returns {object} The object with the newly defined property.
     *
     * @example
     * // Define a new mutably hidden property on an object
     * const myObject = {};
     * const myValue = 'Hello, world!';
     * const hiddenSymbol = Object.definitionType.mutablyHidden;
     * Object.define(myObject, 'myProperty', myValue, hiddenSymbol);
     * // myObject now has a mutably hidden property 'myProperty' with value
     * // 'Hello, world!'
     */
    define(object, key, value, flag = Object.definitionType.mutablyHidden) {
      const properties = import_extension15.Patch.getDescriptorOverridesFromSymbol(flag);
      return Object.defineProperty(object, key, { ...properties, value });
    },
    /**
     * A getter property that provides access to the definition types used
     * for object property definitions. These types are used to control the
     * visibility and mutability of object properties.
     *
     * @returns {Object} An object with getter properties for each definition
     * type. The properties are:
     * - `mutablyHidden`: A symbol representing a mutably hidden property,
     *   non-enumerable, but configurable.
     * - `mutablyVisible`: A symbol representing a mutably visible property,
     *   enumerable, configurable
     * - `immutablyHidden`: A symbol representing an immutably hidden property,
     *   non-enumerable, non-configurable.
     * - `immutablyVisible`: A symbol representing an immutably visible
     *   property, enumerable, non-configurable.
     *
     * @example
     * // Get the symbol for a mutably hidden property
     * const hiddenSymbol = Object.definitionType.mutablyHidden;
     *
     * // Define a new mutably hidden property on an object
     * Object.define(myObject, 'myProperty', myValue, hiddenSymbol);
     */
    get definitionType() {
      return {
        get mutablyHidden() {
          return import_extension15.Patch.kMutablyHidden;
        },
        get mutablyVisible() {
          return import_extension15.Patch.kMutablyVisible;
        },
        get immutablyHidden() {
          return import_extension15.Patch.kImmutablyHidden;
        },
        get immutablyVisible() {
          return import_extension15.Patch.kImmutablyVisible;
        }
      };
    },
    /**
     * Defines a new accessor property on an object with specified getter and
     * setter functions and a visibility/mutability flag. The flag determines
     * the visibility and mutability of the property. By default, the property
     * is defined as mutably hidden.
     *
     * @param {object} object - The object on which to define the property.
     * @param {string} key - The name of the property to be defined.
     * @param {function} get - The getter function for the property.
     * @param {function} set - The setter function for the property.
     * @param {symbol} [flag=Object.definitionType.mutablyHidden] - The
     * visibility/mutability flag for the property. This should be one of the
     * symbols available in `ObjectExtensions.definitionType`.
     * @returns {object} The object with the newly defined property.
     *
     * @example
     * // Define a new mutably hidden accessor property on an object
     * const myObject = {};
     * const hiddenSymbol = ObjectExtensions.definitionType.mutablyHidden;
     * ObjectExtensions.defineAccessor(
     *   myObject,
     *   'myProperty',
     *   () => 'Hello, world!',
     *   (value) => console.log(`Setting value: ${value}`),
     *   hiddenSymbol
     * );
     * // myObject now has a mutably hidden property 'myProperty' with getter
     * // and setter functions
     */
    defineAccessor(object, key, get, set, flag = Object.definitionType.mutablyHidden) {
      const properties = import_extension15.Patch.getDescriptorOverridesFromSymbol(flag);
      return Object.defineProperty(object, key, { ...properties, get, set });
    },
    /**
     * Creates a new object from an array of key-value pairs (entries), with an
     * optional prototype and reducer function. If no prototype is provided,
     * the default Object.prototype is used. If no reducer is provided, a
     * default reducer is used that assigns each value to its corresponding key.
     *
     * @param {Array} entries - An array of key-value pairs. Each entry should
     * be an array where the first element is the key and the second element is
     * the value. Non-conforming entries are ignored.
     * @param {object} [prototype=Object.prototype] - The prototype to use for
     * the new object. If not provided, Object.prototype is used.
     * @param {Function} [reducer] - An optional reducer function to use when
     * creating the new object. If not provided, a default reducer is used that
     * assigns each value to its corresponding key.
     * @returns {object|undefined} - The new object created from the entries, or
     * undefined if the entries array is not valid or contains no valid entries.
     *
     * @example
     * // Create an object with a custom prototype and reducer
     * const myPrototype = { foo: 'bar' };
     * const myReducer = (obj, [key, value]) => {
     *   obj[key] = value.toUpperCase();
     *   return obj;
     * };
     *
     * const myEntries = [['name', 'John'], ['age', '30']];
     * const myObject = Object.fromEntriesUsing(
     *   myEntries, myPrototype, myReducer
     * );
     *
     * // myObject is now { name: 'JOHN', age: '30' }
     * // with prototype { foo: 'bar' }
     */
    fromEntriesUsing(entries, prototype = Object.prototype, reducer = void 0) {
      if (!is.array(entries)) {
        return void 0;
      }
      const entriesToUse = entries.filter(
        (entry) => is.array(entry) && entry.length >= 2
      );
      if (!entriesToUse.length) {
        return void 0;
      }
      const useReducer = reducer instanceof Function ? reducer : (accumulator, [key, value]) => {
        accumulator[key] = value;
        return accumulator;
      };
      return entriesToUse.reduce(
        useReducer,
        Object.create(prototype ?? Object.prototype)
      );
    },
    /**
     * Retrieves the prototype chain entries of a given object.
     *
     * This method traverses the prototype chain of the provided object and
     * collects an array of entries. Each entry is a pair consisting of the
     * prototype object and its property descriptors.
     *
     * The property descriptors are obtained using the `Reflect.ownKeys`
     * method and the `Object.getOwnPropertyDescriptor` function.
     *
     * @param {Object} object - The object whose prototype chain entries are
     * to be retrieved.
     * @returns {Array} An array of entries, where each entry is a pair
     * consisting of a prototype object and its property descriptors.
     *
     * @example
     * const obj = Object.create({ foo: 'bar' });
     * console.log(getPrototypeChainEntries(obj));
     * // Output: [[{ foo: 'bar' }, { foo: { value: 'bar', writable: true,
     * // enumerable: true, configurable: true } }], [Object.prototype, { ... }]]
     */
    getPrototypeChainEntries(object) {
      const entries = [];
      let prototype = Object.getPrototypeOf(object);
      while (prototype) {
        const descriptors = Reflect.ownKeys(prototype).reduce((acc, key) => {
          acc[key] = Object.getOwnPropertyDescriptor(prototype, key);
          return acc;
        }, {});
        entries.push([prototype, descriptors]);
        prototype = Object.getPrototypeOf(prototype);
      }
      return entries;
    },
    /**
     * Retrieves the string tag of an object. The string tag is a representation
     * of the object's type, as defined by its `Object.prototype.toString`
     * method. This utility method is helpful for getting a more descriptive
     * type of an object than what is returned by the `typeof` operator,
     * especially for custom objects.
     *
     * @param {*} value - The object whose string tag is to be retrieved.
     * @param {boolean} strict - if this is set to true, undefined will be
     * returned whenever a supplied object does not have a
     * `Symbol.toStringTag` defined, period. if false, the default,
     * @returns {string} - The string tag of the object, indicating its type.
     */
    getStringTag(value, strict = false) {
      if (has.stringTag(value)) {
        return value[Symbol.toStringTag];
      }
      if (strict) {
        return void 0;
      }
      if (value && typeof value === "function") {
        return value.name;
      }
      return /\s(.+)]/.exec(Object.prototype.toString.call(value))[1];
    },
    /**
     * Determines the type of the given value based on its string tag. This method
     * uses `Object.getStringTag` to obtain the string tag of the value, which
     * represents its more specific type (e.g., Array, Map, Set) rather than just
     * 'object'. The method then maps this string tag to the corresponding type
     * present in the provided `owner` object, which defaults to `globalThis`.
     * This utility method is especially useful for identifying the specific
     * constructor or class of an object, beyond the basic types identified by
     * the `typeof` operator.
     *
     * @param {any} value - The value whose type is to be determined.
     * @param {object} [owner=globalThis] - The object in which to look up the
     * constructor corresponding to the string tag. Defaults to `globalThis`,
     * which covers global constructors like `Array`, `Object`, etc.
     * @returns {Function|object|null|undefined} - Returns the constructor or
     * type of the value based on its string tag. For 'Null' and 'Undefined',
     * it returns `null` and `undefined`, respectively. For other types, it
     * returns the corresponding constructor (e.g., `Array` for arrays) if
     * available in the `owner` object.
     */
    getType(value, owner = globalThis) {
      const stringTag = Object.getStringTag(value);
      switch (stringTag) {
        case "Null":
          return null;
        case "Undefined":
          return void 0;
        default:
          return owner[stringTag];
      }
    },
    /**
     * Checks to see if the supplied `value` is both an object, and has the
     * appropriate symbol defined.
     *
     * @param {any} value the value to determine if it contains a defined
     * `Symbol.toStringTag` defined.
     * @returns true if the symbol is defined, false otherwise
     */
    hasStringTag(value) {
      return has.stringTag(value);
    },
    /**
     * The function checks if a value is either `undefined` or `null`.
     *
     * @param {any} value - The parameter "value" is a variable that can hold
     * any value.
     * @returns {boolean} `true` if the value is either `undefined` or `null`,
     * and `false` otherwise.
     */
    isNullDefined(value) {
      return is.nullish(value);
    },
    /**
     * The `ifNullDefined` function checks if a given value is either `null` or
     * `undefined` and returns one of two provided values based on the result.
     * This function is a convenience method for performing conditional
     * operations based on the type of a value.
     *
     * @param {any} value - The value to be checked. If this is either `null`
     * or `undefined`, `thenValue` is returned, otherwise `elseValue`
     * is returned.
     * @param {function | any} thenValue - The value to be returned if `value`
     * is either `null` or `undefined`.
     * @param {function | any} elseValue - The value to be returned if `value`
     * is not either `null` or `undefined`.
     * @returns {*} Returns `thenValue` if `value` is either `null` or
     * `undefined`, otherwise returns `elseValue`.
     *
     * @example
     * // Suppose we have a null value and a defined value
     * let nullValue = null;
     * let definedValue = "I'm defined";
     *
     * // Using ifNullDefined
     * // Output: 'Null or Undefined'
     * console.log(
     *   Object.ifNullDefined(nullValue, 'Null or Undefined', 'Defined')
     * );
     *
     * // Output: 'Defined'
     * console.log(
     *   Object.ifNullDefined(definedValue, 'Null or Undefined', 'Defined')
     * );
     */
    ifNullDefined(value, thenValue, elseValue) {
      return isThenElse(is.nullish(value), thenValue, elseValue);
    },
    /**
     * Checks if the provided value is an object.
     *
     * This function checks if the provided value is an instance of an Object
     * or if the value is truthy and its type is 'object'. This is used to
     * determine if a value can have properties and methods like an object.
     *
     * @param {any} value - The value to be checked.
     * @returns {boolean} Returns `true` if the value is an object, `false`
     * otherwise.
     *
     * @example
     * // Using a string
     * console.log(isObject('Hello, world!')); // Output: false
     *
     * // Using an object
     * console.log(isObject({ key: 'value' })); // Output: true
     *
     * // Using null
     * console.log(isObject(null)); // Output: false
     */
    isObject(value) {
      return is.object(value);
    },
    /**
     * Executes a conditional function based on whether the provided value
     * is an object or not. This method first checks if the value is an
     * object using the `is.object` method from the toolkit. If it is, it
     * returns the `thenValue`, otherwise it returns the `elseValue`.
     *
     * @param {any} value - The value to be checked.
     * @param {function | any} thenValue - The value to return if `value`
     * is an object.
     * @param {function | any} elseValue - The value to return if `value`
     * is not an object.
     * @returns {*} - Returns `thenValue` if the value is an object,
     * otherwise `elseValue`.
     *
     * @example
     * // returns 'Is Object'
     * ifObject({}, 'Is Object', 'Not Object')
     * // returns 'Not Object'
     * ifObject(42, 'Is Object', 'Not Object')
     */
    ifObject(value, thenValue, elseValue) {
      return isThenElse(is.object(value), thenValue, elseValue);
    },
    /**
     * Checks to see if the supplied value is a primitive value.
     *
     * @param {any} value the value to test to see if it is a primitive value type
     * @returns true if the object is considered widely to be a primitive value,
     * false otherwise.
     */
    isPrimitive(value) {
      return is.primitive(value);
    },
    /**
     * Executes a conditional function based on whether the provided value is
     * primitive or not. This method first checks if the value is primitive
     * using the `isPrimitive` method. If it is, it returns the `thenValue`,
     * otherwise it returns the `elseValue`.
     *
     * @param {any} value - The value to be checked.
     * @param {function | any} thenValue - The value to return if `value` is
     * primitive.
     * @param {function | any} elseValue - The value to return if `value` is
     * not primitive.
     * @returns {*} - Returns `thenValue` if the value is primitive, otherwise
     * `elseValue`.
     *
     * @example
     * // returns 1
     * ifPrimitive('hello', 1, 2)
     * // returns 2
     * ifPrimitive({a: 'hello'}, 1, 2)
     */
    ifPrimitive(value, thenValue, elseValue) {
      return isThenElse(is.primitive(value), thenValue, elseValue);
    },
    /**
     * Checks if the given value is a valid key for an object. In JavaScript, a
     * valid key can be either a string or a symbol. This method is useful for
     * validating object keys before using them in operations like setting or
     * getting object properties.
     *
     * @param {*} value - The value to be checked.
     * @returns {boolean} - Returns `true` if the value is a valid object key
     * (string or symbol), otherwise `false`.
     */
    isValidKey(value) {
      return typeof value === "string" || typeof value === "symbol";
    },
    /**
     * Executes a conditional function based on whether the provided
     * value is a valid key for an object. This method first checks if
     * the value is a valid key using the `isValidKey` method. If it is,
     * it returns the `thenValue`, otherwise it returns the `elseValue`.
     *
     * @param {any} value - The value to be checked.
     * @param {function | any} thenValue - The value to return if
     * `value` is a valid key.
     * @param {function | any} elseValue - The value to return if
     * `value` is not a valid key.
     * @returns {any} - Returns `thenValue` if the value is a valid key,
     * otherwise `elseValue`.
     *
     * @example
     * // returns 1
     * ifValidKey('name', 1, 2)
     * // returns 2
     * ifValidKey(123, 1, 2)
     */
    ifValidKey(value, thenValue, elseValue) {
      return isThenElse(this.isValidKey(value), thenValue, elseValue);
    },
    /**
     * A symbol constant defined on Object that can be used to reference
     * storage for an accessor descriptor created with Object.add() or
     * other descriptor assigning and creation methods used by this extension.
     *
     * The value assigned here is actually another symbol but one generated
     * by {@link Symkeys} for uniqueness and has access to data storage.
     *
     * @returns {Symbol} - Returns a symbol for the descriptor storage.
     *
     * @example
     * // returns Symbol(@nejs.object.descriptor.storage)
     * kDescriptorStore
     *
     * // add descriptor value to an object
     * const object = {}
     * Object.add({object, key: 'name', type: 'accessor'})
     * object.name = 'Jane Doe'
     *
     * // Value assigned here is another symbol with its own storage generated
     * // by Symkeys. Description might be '@nejs.descriptor.store #234sdafj'
     * object[Object.kDescriptorStore]
     *
     * // But its nested data can be accessed using the '.data' getter
     * object[Object.kDescriptorStore].data // { name: 'Jane Doe' }
     */
    get kDescriptorStore() {
      return Symbol.for("@nejs.object.descriptor.storage");
    },
    /**
     * Creates an object with predefined keys and descriptors. This method is
     * useful for creating objects with specific properties and behaviors.
     *
     * @param {Array|Object} keys - An array of keys or an object where keys
     * are the object's own properties. If an array is provided, each key will
     * be assigned the `defaultValue`. If an object is provided, its own
     * properties will be used as keys and their corresponding values as values.
     * @param {*} [defaultValue=undefined] - The default value for each key.
     * @param {string} [definedAs='data'] - Defines how the properties are
     * defined. If 'data', properties are defined with a value. If 'accessor',
     * properties are defined with get and set accessors.
     * @param {Object} [accessorMeta={ get: undefined, set: undefined,
     * thisArg: undefined }] - An object containing the get and set accessors
     * and the `thisArg` to bind to the accessors.
     * @param {Object} [descriptorBase={ enumerable: true, configurable: true }]
     * - The base descriptor for the properties.
     * @param {Object} [extraDescriptors=undefined] - Extra descriptors to be
     * added to the object.
     * @param {Object} [prototype=Object.prototype] - The prototype of the
     * created object.
     * @returns {Object} - Returns the created object.
     *
     * @example
     * // returns { name: undefined }
     * prekeyed(['name'])
     * // returns { name: 'John' }
     * prekeyed({ name: 'John' })
     * // returns { name: 'John' }
     * prekeyed(['name'], 'John')
     */
    prekeyed(keys, defaultValue = void 0, definedAs = ["data", "accessor"][0], accessorMeta = { get: void 0, set: void 0, thisArg: void 0 }, descriptorBase = { enumerable: true, configurable: true }, extraDescriptors = void 0, prototype = Object.prototype) {
      const object = Object.create(prototype, extraDescriptors);
      let mapped = {};
      if (Array.isArray(keys)) {
        mapped = keys.reduce((a, k) => ({ ...a, [k]: defaultValue }), {});
      } else if (keys && typeof keys === "object") {
        Object.assign(mapped, keys);
      } else {
        console.warn("skipping");
        return object;
      }
      for (const [key, value] of Object.entries(mapped)) {
        let symKey = Symbol.for(`${key}#${Math.random().toString(36).slice(2)}`);
        let suppliedValue = mapped[key] ?? defaultValue;
        if (definedAs === "accessor" && accessorMeta.get === void 0) {
          Object.defineProperty(
            object,
            symKey,
            {
              value: suppliedValue,
              enumerable: false,
              configurable: true
            }
          );
          accessorMeta.thisArg = object;
        }
        let descriptorRest = definedAs === "data" ? { value: value ?? defaultValue, writable: true } : {
          get: accessorMeta.get ?? function() {
            return this[symKey];
          },
          set: accessorMeta.set ?? function(v) {
            this[symKey] = v;
          }
        };
        if (accessorMeta.thisArg) {
          descriptorRest.get = descriptorRest.get.bind(accessorMeta.thisArg);
          descriptorRest.set = descriptorRest.set.bind(accessorMeta.thisArg);
        }
        Object.defineProperty(
          object,
          key,
          { ...descriptorBase, ...descriptorRest }
        );
      }
      return object;
    },
    /**
     * Strips an object down to only the keys specified. Optionally, any
     * accessors can be made to retain their context on the source object.
     *
     * @param {object} object the object to pare down
     * @param {Array<string|symbol>} keys the keys that should appear in the
     * final reduced object
     * @param {boolean} [bindAccessors = true] if this value is true then any
     * accessors from the source object will continue to have their `this`
     * value bound to the source. If the getter or setter on that object is
     * defined using an arrow function, this will not work as intended.
     * @returns {object} an object containing only the keys and symbols
     * specified in the `keys` parameter.
     */
    stripTo(object, keys, bindAccessors = true) {
      if (!object || typeof object !== "object") {
        throw new TypeError(
          "Object.stripTo requires an object to strip. Received",
          object
        );
      }
      const result = {};
      if (!Array.isArray(keys)) {
        return result;
      }
      for (let key of keys) {
        if (Reflect.has(object, key)) {
          const originalDescriptor = Object.getOwnPropertyDescriptor(object, key);
          const descriptor = { ...originalDescriptor };
          if (typeof descriptor.get === "function" || typeof descriptor.set === "function") {
            if (bindAccessors) {
              descriptor.get = descriptor.get?.bind(object);
              descriptor.set = descriptor.set?.bind(object);
            }
          }
          Object.defineProperty(result, key, descriptor);
        }
      }
      return result;
    },
    withProperties(prototype, ...properties) {
      const props = properties.filter((p) => p instanceof Property);
      const possible = properties.filter((p) => Array.isArray(p));
      if (possible.length) {
        for (const [key, descriptorOrDataOrAccessorArgs, ...rest] of possible) {
          if (Property.is.descriptor(descriptorOrDataOrAccessorArgs)) {
            props.push(new Property(key, descriptorOrDataOrAccessorArgs));
          } else {
            const { get, set } = descriptorOrDataOrAccessorArgs;
            const args = [key, descriptorOrDataOrAccessorArgs, ...rest];
            if (get || set) {
              props.push(Property.accessor(...args));
            } else {
              props.push(Property.data(...args));
            }
          }
        }
      }
      const object = Object.create(prototype ?? Object.prototype);
      const sorted = props.toSorted(
        (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0
      );
      for (const property2 of sorted) {
        property2.apply(object);
      }
      Property.data(Symbol.for("properties"), sorted).apply(object);
      return object;
    },
    /**
     * Retrieves a toolkit object containing various utility functions
     * for type checking and introspection.
     *
     * The toolkit includes many functions. It was designed to read as
     * though the toolkit were assigned to the variable `it`.
     *
     * @example
     * const is = ObjectExtensions.patches.toolkit
     * console.log(is.object({})) // Output: true
     * console.log(is.string('hello')) // Output: true
     * console.log(is.number(42)) // Output: true
     *
     * @returns {object} The toolkit object containing various utility
     * functions for type checking and introspection.
     */
    get toolkit() {
      return { as, has, is, si };
    }
  }
});
var {
  isObject: pIsObject,
  ifObject: pIfObject,
  isNullDefined: pIsNullDefined,
  ifNullDefined: pIfNullDefined,
  isPrimitive: pIsPrimitive,
  ifPrimitive: pIfPrimitive,
  isValidKey: pIsValidKey,
  ifValidKey: pIfValidKey,
  hasStringTag: pHasStringTag,
  getStringTag: pGetStringTag,
  stripTo: pStripTo
} = ObjectExtensions.patches;
var ObjectPrototypeExtensions = new import_extension15.Patch(Object.prototype, {
  [import_extension15.Patch.kMutablyHidden]: {
    /**
     * Retrieves the prototype chain entries of the current object.
     *
     * This method traverses the prototype chain of the current object
     * (`this`) and collects an array of entries. Each entry is a pair
     * consisting of the prototype object and its property descriptors.
     *
     * The property descriptors are obtained using the `Reflect.ownKeys`
     * method and the `Object.getOwnPropertyDescriptor` function.
     *
     * @returns {Array} An array of entries, where each entry is a pair
     * consisting of a prototype object and its property descriptors.
     *
     * @example
     * const obj = Object.create({ foo: 'bar' });
     * console.log(obj.getPrototypeChainEntries());
     * // Output: [[{ foo: 'bar' }, { foo: { value: 'bar', writable: true, enumerable: true, configurable: true } }], [Object.prototype, { ... }]]
     */
    getPrototypeChainEntries() {
      return ObjectExtensions.patches.getPrototypeChainEntries(this);
    },
    /**
     * Determines if the current value is an object.
     *
     * This method checks whether the current value is an object,
     * excluding null. It is a convenience wrapper around the
     * `pIsObject` function from the `ObjectExtensions` patch.
     *
     * @name isObject
     * @type {function}
     * @memberof Object.prototype
     * @returns {boolean} `true` if the current value is an object
     * (excluding null), `false` otherwise.
     *
     * @example
     * const obj = {};
     * console.log(obj.isObject());
     * // Output: true
     *
     * const str = "hello";
     * console.log(str.isObject());
     * // Output: false
     *
     * console.log(null.isObject());
     * // Output: false
     */
    get isObject() {
      return pIsObject(this);
    },
    /**
     * Checks if the current value is an object and returns one of two
     * provided values based on the result. This function is a convenience
     * method for performing conditional operations based on the type of
     * the current value.
     *
     * @name ifObject
     * @type {function}
     * @memberof Object.prototype
     * @param {function | any} thenValue - The value to be returned if the
     * current value is an object (excluding null).
     * @param {function | any} elseValue - The value to be returned if the
     * current value is not an object or is null.
     * @returns {*} Returns `thenValue` if the current value is an object
     * (excluding null), otherwise returns `elseValue`.
     *
     * @example
     * const obj = {};
     * console.log(obj.ifObject('Object', 'Not an object'));
     * // Output: 'Object'
     *
     * const str = "hello";
     * console.log(str.ifObject('Object', 'Not an object'));
     * // Output: 'Not an object'
     *
     * console.log(null.ifObject('Object', 'Not an object'));
     * // Output: 'Not an object'
     */
    ifObject(thenValue, elseValue) {
      return pIfObject(this, thenValue, elseValue);
    },
    /**
     * Checks if the current value is either `null` or `undefined`.
     *
     * @name isNullDefined
     * @type {boolean}
     * @memberof Object.prototype
     * @returns {boolean} Returns `true` if the current value is either
     * `null` or `undefined`, `false` otherwise.
     *
     * @example
     * const obj = null;
     * console.log(obj.isNullDefined);
     * // Output: true
     *
     * const str = "hello";
     * console.log(str.isNullDefined);
     * // Output: false
     */
    get isNullDefined() {
      return pIsNullDefined(this);
    },
    /**
     * Checks if the current value is either `null` or `undefined` and
     * returns one of two provided values based on the result.
     *
     * @name ifNullDefined
     * @type {function}
     * @memberof Object.prototype
     * @param {function | any} thenValue - The value to be returned if the
     * current value is either `null` or `undefined`.
     * @param {function | any} elseValue - The value to be returned if the
     * current value is not `null` or `undefined`.
     * @returns {*} Returns `thenValue` if the current value is either
     * `null` or `undefined`, otherwise returns `elseValue`.
     *
     * @example
     * const obj = null
     * console.log(obj.ifNullDefined('Null or Undefined', 'Defined'))
     * // Output: 'Null or Undefined'
     *
     * const str = "hello"
     * console.log(str.ifNullDefined('Null or Undefined', 'Defined'))
     * // Output: 'Defined'
     */
    ifNullDefined(thenValue, elseValue) {
      return pIfNullDefined(this, thenValue, elseValue);
    },
    /**
     * Checks if the current value is a primitive type.
     *
     * Primitive types in JavaScript include `string`, `number`,
     * `bigint`, `boolean`, `undefined`, `symbol`, and `null`.
     *
     * @name isPrimitive
     * @type {boolean}
     * @memberof Object.prototype
     * @returns {boolean} Returns `true` if the current value is a
     * primitive type, `false` otherwise.
     *
     * @example
     * const str = "hello"
     * console.log(str.isPrimitive)
     * // Output: true
     *
     * const obj = { key: "value" }
     * console.log(obj.isPrimitive)
     * // Output: false
     */
    get isPrimitive() {
      return pIsPrimitive(this);
    },
    /**
     * Checks if the current value is a primitive type and returns one
     * of two provided values based on the result.
     *
     * Primitive types in JavaScript include `string`, `number`,
     * `bigint`, `boolean`, `undefined`, `symbol`, and `null`.
     *
     * @name ifPrimitive
     * @type {function}
     * @memberof Object.prototype
     * @param {function | any} thenValue - The value to be returned if
     * the current value is a primitive type.
     * @param {function | any} elseValue - The value to be returned if
     * the current value is not a primitive type.
     * @returns {*} Returns `thenValue` if the current value is a
     * primitive type, otherwise returns `elseValue`.
     *
     * @example
     * const str = "hello"
     * console.log(str.ifPrimitive('Primitive', 'Not Primitive'))
     * // Output: 'Primitive'
     *
     * const obj = { key: "value" }
     * console.log(obj.ifPrimitive('Primitive', 'Not Primitive'))
     * // Output: 'Not Primitive'
     */
    ifPrimitive(thenValue, elseValue) {
      return pIfPrimitive(this, thenValue, elseValue);
    },
    /**
     * Determines if the current value is a valid key for an object.
     *
     * A valid key is either a string or a symbol. This method is a
     * convenience wrapper around the `pIsValidKey` function from the
     * `ObjectExtensions` patch.
     *
     * @name isValidKey
     * @type {boolean}
     * @memberof Object.prototype
     * @returns {boolean} `true` if the current value is a valid key for
     * an object (i.e., a string or symbol), `false` otherwise.
     *
     * @example
     * const str = "key"
     * console.log(str.isValidKey)
     * // Output: true
     *
     * const sym = Symbol("key")
     * console.log(sym.isValidKey)
     * // Output: true
     *
     * const num = 42
     * console.log(num.isValidKey)
     * // Output: false
     */
    get isValidKey() {
      return pIsValidKey(this);
    },
    /**
     * Checks if the current value is a valid key for an object and returns
     * one of two provided values based on the result. This function is a
     * convenience method for performing conditional operations based on
     * the type of the current value.
     *
     * A valid key is either a string or a symbol.
     *
     * @name ifValidKey
     * @type {function}
     * @memberof Object.prototype
     * @param {function | any} thenValue - The value to be returned if the
     * current value is a valid key for an object.
     * @param {function | any} elseValue - The value to be returned if the
     * current value is not a valid key for an object.
     * @returns {*} Returns `thenValue` if the current value is a valid key
     * for an object, otherwise returns `elseValue`.
     *
     * @example
     * const str = "key"
     * console.log(str.ifValidKey('Valid Key', 'Not a Valid Key'))
     * // Output: 'Valid Key'
     *
     * const num = 42
     * console.log(num.ifValidKey('Valid Key', 'Not a Valid Key'))
     * // Output: 'Not a Valid Key'
     */
    ifValidKey(thenValue, elseValue) {
      return pIfValidKey(this, thenValue, elseValue);
    },
    /**
     * Checks to see if the supplied `value` is both an object, and has the
     * appropriate symbol defined.
     *
     * @param {any} value the value to determine if it contains a defined
     * `Symbol.toStringTag` defined.
     * @returns true if the symbol is defined, false otherwise
     */
    get hasStringTag() {
      return pHasStringTag(this);
    },
    /**
     * Retrieves the string tag of an object. The string tag is a representation
     * of the object's type, as defined by its `Object.prototype.toString`
     * method. This utility method is helpful for getting a more descriptive
     * type of an object than what is returned by the `typeof` operator,
     * especially for custom objects.
     *
     * @param {*} value - The object whose string tag is to be retrieved.
     * @param {boolean} strict - if this is set to true, undefined will be
     * returned whenever a supplied object does not have a
     * `Symbol.toStringTag` defined, period. if false, the default,
     * @returns {string} - The string tag of the object, indicating its type.
     */
    getStringTag(strict = false) {
      return pGetStringTag(this, strict);
    },
    /**
     * Strips an object down to only the keys specified. Optionally, any
     * accessors can be made to retain their context on the source object.
     * This is a passthrough to the static {@link Object.stripTo} function
     *
     * @param {Array<string|symbol>} keys the keys that should appear in the
     * final reduced object
     * @param {boolean} [bindAccessors = true] if this value is true then any
     * accessors from the source object will continue to have their `this`
     * value bound to the source. If the getter or setter on that object is
     * defined using an arrow function, this will not work as intended.
     * @returns {object} an object containing only the keys and symbols
     * specified in the `keys` parameter.
     */
    stripTo(keys, bindAccessors = true) {
      return pStripTo(this, keys, bindAccessors);
    }
  }
});
function isThenElse(bv, tv, ev) {
  if (arguments.length > 1) {
    var _then = is.function(tv) ? tv(bv) : tv;
    if (arguments.length > 2) {
      var _else = is.function(ev) ? tv(bv) : ev;
      return bv ? _then : _else;
    }
    return bv || _then;
  }
  return bv;
}

// src/weakref.extensions.js
var import_extension16 = require("@nejs/extension");
var WeakRefExtensions = new import_extension16.Patch(WeakRef, {
  /**
   * A static method to check if a given value is a valid target for a WeakRef.
   *
   * @param {*} value - The value to check for validity as a WeakRef target.
   * @returns {boolean} - True if the value is a valid WeakRef target,
   * false otherwise.
   */
  isValidReference(value) {
    return !(typeof value === "symbol" && Symbol.keyFor(value) === void 0 || typeof value !== "object" && typeof value !== "symbol" || (value === null || value === void 0));
  }
});

// src/classes/refmap.js
var { isObject: isObject3, isNullDefined, isValidKey: isValidKey2 } = ObjectExtensions.patches;
var { isRegistered } = SymbolExtensions.patches;
var { isValidReference } = WeakRefExtensions.patches;
var RefMap = class _RefMap extends Map {
  /**
   * Private field to track whether the RefMap should objectify primitive
   * values.
   *
   * @private
   */
  #objectifyValues = false;
  constructor(...args) {
    super(...args);
  }
  /**
   * Method to control whether the RefMap should objectify its values. When
   * objectifying, primitive values (number, string, boolean, bigint) are
   * converted to their respective object types, which allows them to be used as
   * WeakRef targets.
   *
   * @param {boolean} setObjectification - Flag to enable or disable
   * objectification.
   * @returns {RefMap} - The current RefMap instance to allow method chaining.
   */
  objectifying(setObjectification = true) {
    this.objectifyValues = setObjectification;
    return this;
  }
  /**
   * The function converts a JavaScript Map object into a regular JavaScript
   * object, handling invalid keys by converting them to strings.
   *
   * @returns {object} an object; keys that are not either a `String` or a
   * `Symbol` will be converted to a string.
   */
  asObject() {
    const object = {};
    for (const [key, value] of this) {
      const useKey = isValidKey2(key) ? key : String(key);
      const useValue = value?.valueOf() || value;
      object[useKey] = useValue;
    }
    return object;
  }
  /**
   * Returns the state indicating whether or not `RefMap` will attempt to
   * convert non-valid primitives into targets that are valid input for
   * new `WeakRef` object instances. If this value is `false` then no
   * *objectification* will occur.
   *
   * @returns {boolean} The current state of objectifyValues.
   */
  get objectifyValues() {
    return this.#objectifyValues;
  }
  /**
   * The `get` function retrieves a value from a map and returns it, or returns a
   * default value if the value is null or undefined. The actual retrieved value
   * is a dereferenced `WeakRef`. If the result is `undefined` and this is not the
   * expected response, it is likely the value has been garbage collected.
   *
   * @param {any} key - The key parameter is the key of the value you want to
   * retrieve from the data structure.
   * @param {any} defaultValue - The `defaultValue` parameter is the value that
   * will be returned if the key does not exist in the map or if the value
   * associated with the key has been garbage collected (i.e., it no longer
   * exists).
   * @returns The method is returning the value associated with the given key.
   * If the value is not found or if it has been garbage collected (deref()
   * returns null), then the defaultValue is returned.
   */
  get(key, defaultValue) {
    const value = super.get(key);
    if (!value || !value?.deref()) {
      return defaultValue;
    }
    return value?.deref();
  }
  /**
   * Setting this value to true, will cause all set values to the Map to
   * be analyzed for validity as a candidate to be wrapped in a `WeakRef`
   * object. If true, and if possible, the object will be turned into an
   * `Object` variant first.
   *
   * @param {boolean} value - The new state to set for objectifyValues.
   */
  set objectifyValues(value) {
    this.#objectifyValues = !!value;
  }
  /**
   * Overrides the set method of `Map`. Adds a value to the `RefMap`,
   * converting it to a `WeakRef`. Throws an error if the value is not a
   * valid `WeakRef` target (e.g., `null`, `undefined`, or a registered
   * `symbol`). If {@link objectifyValues} is enabled, an attempt to convert
   * primitives to their object variants will be made. These are `numbers`,
   * `strings`, `boolean` values and `bigint`s.
   *
   * @param {*} key - The `key` to be set on the `RefMap`
   * @param {*} value - The value to be associated with the `key`
   * @throws {TypeError} If the value is not a valid WeakRef target.
   */
  set(key, value) {
    let useValue = value;
    if (this.#objectifyValues && (typeof useValue === "number" || typeof useValue === "string" || typeof useValue === "boolean" || typeof useValue === "bigint")) {
      useValue = Object(useValue);
    }
    if (typeof useValue === "symbol" && Symbol.keyFor(useValue) !== void 0) {
      throw new TypeError("RefMap cannot accept registered symbols as values");
    }
    if (typeof useValue !== "object" && typeof useValue !== "symbol") {
      throw new TypeError(
        "RefMap values must be objects, non-registered symbols, or objectified primitives"
      );
    }
    if (useValue === null || useValue === void 0) {
      throw new TypeError("RefMap values cannot be null or undefined");
    }
    const ref = new WeakRef(useValue);
    super.set(key, ref);
  }
  /**
   * Sets multiple values at a single time. The format is an array of array
   * or rather an array of {@link Object.entries} (for example,
   * `[[key1,value1], [key2,value2]]`). For each entry pair, if the length
   * is not 2, either missing a key or value, it will be skipped.
   *
   * @param {Iterable} values - An iterable of values to add to the RefMap.
   * @throws {TypeError} If the supplied values are falsey or non-iterable.
   * @returns {RepMap} returns `this` to allow for chaining
   */
  setAll(entries) {
    if (!Iterable.isIterable(entries)) {
      throw new TypeError(
        "The supplied list of entries must be an array of arrays in the format [[key1, value1], [key2, value2], ...]."
      );
    }
    const forEach = (entry) => {
      const [key, value] = entry;
      if (!key || !isObject3(value) || !isRegistered(value)) {
        return;
      }
      this.set(key, value);
    };
    for (const entry of entries) {
      forEach(entry);
    }
    return this;
  }
  /**
   * Removes all elements from the RefMap that have been garbage collected
   * (i.e., their WeakRef no longer points to an object).
   *
   * @returns {RefMap} - The current RefMap instance to allow method chaining.
   */
  clean() {
    for (const [key, dereferenced] of this) {
      if (!dereferenced) {
        this.delete(key);
      }
    }
    return this;
  }
  /**
   * Executes a provided function once for each value in the RefMap. The callback
   * function receives the dereferenced value, the value again (as RefMap doesn't
   * use keys), and the RefMap itself. This method provides a way to iterate over
   * and apply operations to the values stored in the RefMap, taking into account
   * that they are weak references and may have been garbage-collected.
   *
   * @param {Function} forEachFn - Function to execute for each element. It
   * takes three arguments: element, element (again, as RefMap has no key), and
   * the RefMap itself.
   * @param {*} thisArg - Value to use as `this` when executing `forEachFn`.
   */
  entries() {
    const entriesIterator = super.entries();
    const refIterator = new Iterator(entriesIterator, (entry) => {
      if (entry) {
        const [key, ref] = entry;
        const value = ref?.deref();
        return [key, value];
      }
      return entry;
    });
    return refIterator;
  }
  /**
   * Iterate over the items in the map and pass them to the supplied
   * function ala `Map.prototype.forEach`. Note however, there are no
   * indexes on Maps and as such, the index parameter of the callback
   * will always be the value's key. Subsequently the `array` or third
   * parameter will receive the map instance rather than an array.
   *
   * @param {function} forEachFn the function to use for each element in
   * the set.
   * @param {object} thisArg the `this` argument to be applied to each
   * invocation of the `forEachFn` callback. Note, this value is unable
   * to be applied if the `forEachFn` is a big arrow function
   */
  forEach(forEachFn, thisArg) {
    for (const [key, ref] of super.entries()) {
      const value = ref?.deref();
      if (!value) {
        continue;
      }
      forEachFn.call(thisArg, value, key, this);
    }
  }
  /**
   * Returns an iterator for the values in the RefMap. Each value is
   * dereferenced from its WeakRef before being returned. This method allows
   * iterating over he set's values, similar to how one would iterate over
   * values in a standard Map or Array, but with the understanding that the
   * values are weakly referenced and may no longer exist (in which case
   * they are skipped).
   *
   * @returns {Iterator} An iterator for the values.
   */
  values() {
    return new Iterator(super.values(), function perItem(value) {
      const dereferenced = value?.deref();
      return dereferenced || value;
    });
  }
  /**
   * Determines whether an element with the specified value exists in the
   * `RefMap`. For non-objectified sets, this method checks if the dereferenced
   * values of the map include the specified value.
   *
   * For objectified sets, strict is set to false which uses loose
   * equality to allow for things like `Object(5)` to equal `5`. This is important
   * because otherwise primitives could not be weakly referenced. In the grand
   * scheme of things, this is only useful if the objectified value is the
   * one being referenced.
   *
   * @param {*} value - The value to check for presence in the RefMap.
   * @param {boolean} strict - if `true`, the default, then the supplied value
   * is hard compared to the dereferenced value (`===`). If `false`, then a
   * loose comparison is used (`==`)
   * @returns {boolean} - True if an element with the specified value exists
   * in the RefMap, false otherwise.
   */
  hasValue(value, strict = true) {
    if (isNullDefined(value)) {
      return false;
    }
    if (this.#objectifyValues) {
      strict = false;
    }
    for (const [_, dereferenced] of this) {
      if (strict && value === dereferenced || !strict && value == dereferenced) {
        return true;
      }
    }
    return false;
  }
  /**
   * The `filter` function filters the entries of a `RefMap` object based on
   * a given filter function. The dereferenced entries of the values of the map
   * will be passed to the function rather than a `WeakRef` itself.
   *
   * A new resulting entry set will be generated and a new `RefMap` will be made
   * from these entries and returned. Note that this function never returns
   * `null`
   *
   * @param {function} filterFn - The `filterFn` parameter is a function that
   * will be used to filter the entries in the `RefMap`. It will be called with
   * three arguments: the value of the current entry, the key of the current
   * entry, and the `RefMap` itself. The function should return `true`
   * @param {object} thisArg - The `thisArg` parameter is an optional argument
   * that specifies the value to be used as `this` when executing the
   * `filterFn` function. It allows you to explicitly set the context in which
   * the `filterFn` function is called. If `thisArg` is not provided, `this
   * @returns {array} The `filter` method is returning an array of filtered map
   * entries
   */
  filter(filterFn, thisArg) {
    const resultingEntries = [];
    for (const [key, dereferenced] of this) {
      if (filterFn.call(thisArg, dereferenced, key, this)) {
        resultingEntries.push([key, dereferenced]);
      }
    }
    return resultingEntries;
  }
  /**
   * The `find` function iterates over a map and calls a given function on
   * each value, returning the first value for which the function returns
   * a truthy value.
   *
   * The function signature of `findFn` is
   * ```
   * function findFn(value, key, map)
   * ```
   * 'value' is passed to findFn up to two times; first with the `WeakRef`
   * value, second with the result of {@link WeakRef.deref}. If `findFn`
   * returns true for either of these the dereferenced value will be
   * returned from the call to {@link RefMap.find}.
   * `key` represents the key object that the value is mapped to.
   * `map` is simply a reference to `this` map.
   *
   * @param findFn - `findFn` is a function that will be called for each
   * element in the map. It takes three arguments: `ref`, `key`, and `map`;
   * where `ref` is the value of the current element in the map, `key` is
   * the key of the current element, and `map` is a reference to the instance
   * being searched.
   * @param thisArg - The `thisArg` parameter is the value to be used as
   * the `this` value when executing the `findFn` function. It allows you
   * to specify the context in which the `findFn` function should be called.
   * @returns the first dereferenced value that satisfies the condition
   * specified by the `findFn` function. If no value satisfies the condition,
   * it returns `null`.
   */
  find(findFn, thisArg) {
    for (const [key, dereferenced] of this) {
      const ref = super.get(key);
      let result = findFn.call(thisArg, ref, key, map);
      if (!result) {
        result = findFn.call(thisArg, dereferenced, key, map);
      }
      if (result) {
        return dereferenced;
      }
    }
    return null;
  }
  /**
   * Creates a new array or `RefMap` with the results of calling a provided
   * function on every element in the calling `RefMap`. This method dereferences
   * each value, applies the `mapFn`, and collects the results. If `toRefMap` is
   * `true`, a new `RefMap` is returned; otherwise, an array. This method
   * differs from `Array.map` in handling weak references and the potential to
   * return a new `RefMap` instead of an array.
   *
   * @param {Function} mapFn - Function that produces an element of the new
   * array or `RefMap`, taking three arguments.
   * @param {*} thisArg - Value to use as this when executing mapFn.
   * @param {boolean} toRefMap - Determines if the output should be a new
   * `RefMap` (`true`) or an array (`false`).
   * @param {boolean} mirrorObjectification - If `true` and `toRefMap` is
   * `true`, the new `RefMap` mirrors the objectification setting of the
   * original.
   * @returns {Array|RefMap} - A new array or `RefMap` with each element being
   * the result of the `mapFn`.
   */
  map(mapFn, thisArg, toRefMap, mirrorObjectification) {
    if (typeof mapFn !== "function") {
      throw new TypeError("mapFn must be a function! Received", mapFn);
    }
    const entries = [];
    const errors = [];
    let needsObjectification = mirrorObjectification && this.objectifyValues;
    let detectNeed = mirrorObjectification === void 0;
    let objectify = needsObjectification;
    for (const [key, dereferenced] of this) {
      const [, VALUE] = [0, 1];
      const transformed = mapFn.call(thisArg, [key, dereferenced], key, this);
      if (!isValidReference(transformed[VALUE])) {
        if (isValidReference(Object(transformed[VALUE]))) {
          needsObjectification = true;
          if (detectNeed && !objectify) {
            objectify = true;
            transformed[VALUE] = Object(transformed[VALUE]);
          }
        }
      }
      entries.push(transformed);
    }
    if (toRefMap) {
      return new _RefMap(entries).objectifying(objectify);
    }
    return entries;
  }
  /**
   * The function returns an iterator that iterates over the entries of an object,
   * dereferencing any weak references.
   *
   * @returns {Iterator} A new iterator object is being returned.
   */
  *[Symbol.iterator]() {
    for (const [key, ref] of this.entries()) {
      yield [key, ref];
    }
  }
  /**
   * Ensures that the constructor of this object instance's name
   * is returned if the string tag for this instance is queried
   *
   * @returns {string} the name of the class
   */
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var RefMapExtensions = new import_extension17.Extension(RefMap);

// src/classes/refset.js
var import_extension18 = require("@nejs/extension");
var RefSet = class _RefSet extends Set {
  /**
   * Private field to track whether the RefSet should objectify primitive
   * values.
   *
   * @private
   */
  #objectifyValues = false;
  /**
   * Method to control whether the RefSet should objectify its values. When
   * objectifying, primitive values (number, string, boolean, bigint) are
   * converted to their respective object types, which allows them to be used as
   * WeakRef targets.
   *
   * @param {boolean} setObjectification - Flag to enable or disable
   * objectification.
   * @returns {RefSet} - The current RefSet instance to allow method chaining.
   */
  objectifying(setObjectification = true) {
    this.objectifyValues = setObjectification;
    return this;
  }
  /**
   * Returns the state indicating whether or not `RefSet` will attempt to
   * convert non-valid primitives into targets that are valid input for
   * new `WeakRef` object instances. If this value is `false` then no
   * *objectification* will occur.
   *
   * @returns {boolean} The current state of objectifyValues.
   */
  get objectifyValues() {
    return this.#objectifyValues;
  }
  /**
   * Setting this value to true, will cause all added values to the Set to
   * be analyzed for validity as a candidate to be wrapped in a `WeakRef`
   * object. If true, and if possible, the object will be turned into an
   * `Object` variant first. This will also enable less rigid variable
   * comparison in the `.has()` method (i.e. `==` instead of `===`).
   *
   * @param {boolean} value - The new state to set for objectifyValues.
   */
  set objectifyValues(value) {
    this.#objectifyValues = !!value;
  }
  /**
   * Overrides the add method of Set. Adds a value to the RefSet, converting it
   * to a WeakRef. Throws an error if the value is not a valid WeakRef target
   * (e.g., null, undefined, or a registered symbol). If `objectifyValues` is
   * enabled, an attempt to convert primitives to their object variants will be
   * made. These are numbers, strings, boolean values and big integers.
   *
   * @param {*} value - The value to be added to the RefSet.
   * @throws {TypeError} If the value is not a valid WeakRef target.
   */
  add(value) {
    if (this.#objectifyValues && (typeof value === "number" || typeof value === "string" || typeof value === "boolean" || typeof value === "bigint")) {
      value = Object(value);
    }
    if (typeof value === "symbol" && Symbol.keyFor(value) !== void 0) {
      throw new TypeError("RefSet cannot accept registered symbols as values");
    }
    if (typeof value !== "object" && typeof value !== "symbol") {
      throw new TypeError(
        "RefSet values must be objects, non-registered symbols, or objectified primitives"
      );
    }
    if (value === null || value === void 0) {
      throw new TypeError("RefSet values cannot be null or undefined");
    }
    super.add(new WeakRef(value));
  }
  /**
   * Adds multiple values to the RefSet. The supplied `values` should be
   * iterable and truthy. This function defers to `.add()` for its logic so
   * each value from the supplied collection of values will also be subject
   * to the criteria of that function.
   *
   * @param {Iterable} values - An iterable of values to add to the RefSet.
   * @throws {TypeError} If the supplied values are falsey or non-iterable.
   */
  addAll(values) {
    if (!values || typeof values !== "object" || !Reflect.has(values, Symbol.iterator)) {
      throw new TypeError("The supplied values are either falsey or non-iterable");
    }
    for (const value of values) {
      this.add(value);
    }
  }
  /**
   * Removes all elements from the RefSet that have been garbage collected
   * (i.e., their WeakRef no longer points to an object).
   *
   * @returns {RefSet} - The current RefSet instance to allow method chaining.
   */
  clean() {
    for (const ref of this) {
      if (!ref.deref()) {
        this.delete(ref);
      }
    }
    return this;
  }
  /**
   * Executes a provided function once for each value in the RefSet. The callback
   * function receives the dereferenced value, the value again (as RefSet doesn't
   * use keys), and the RefSet itself. This method provides a way to iterate over
   * and apply operations to the values stored in the RefSet, taking into account
   * that they are weak references and may have been garbage-collected.
   *
   * @param {Function} forEachFn - Function to execute for each element. It
   * takes three arguments: element, element (again, as RefSet has no key), and
   * the RefSet itself.
   * @param {*} thisArg - Value to use as `this` when executing `forEachFn`.
   */
  entries() {
    const refEntries = Array.from(super.entries());
    return refEntries.map(([_, ref]) => [ref.deref(), ref.deref()]).filter(([_, value]) => !!value);
  }
  /**
   * Iterate over the items in the set and pass them to the supplied
   * function ala `Array.prototype.forEach`. Note however, there are no
   * indexes on Sets and as such, the index parameter of the callback
   * will always be `NaN`. Subsequently the `array` or third parameter
   * will receive the set instance rather than an array.
   *
   * @param {function} forEachFn the function to use for each element in
   * the set.
   * @param {object} thisArg the `this` argument to be applied to each
   * invocation of the `forEachFn` callback. Note, this value is unable
   * to be applied if the `forEachFn` is a big arrow function
   */
  forEach(forEachFn, thisArg) {
    const set = this;
    super.forEach(function(ref) {
      const value = ref.deref();
      if (!value) {
        return;
      }
      forEachFn.call(thisArg, value, value, set);
    });
  }
  /**
   * Returns an iterator for the values in the RefSet. Each value is
   * dereferenced from its WeakRef before being returned. This method allows
   * iterating over he set's values, similar to how one would iterate over
   * values in a standard Set or Array, but with the understanding that the
   * values are weakly referenced and may no longer exist (in which case
   * they are skipped).
   *
   * @returns {Iterator} An iterator for the values.
   */
  values() {
    const values = [];
    for (const value of this) {
      const dereferenced = value.deref();
      if (dereferenced) {
        values.push(dereferenced);
      }
    }
    return values;
  }
  /**
   * Returns an iterator for the keys of the RefSet. In RefSet, keys and
   * values are identical, so this method behaves the same as `values()`. It
   * provides compatibility with the standard Set interface and allows use in
   * contexts where keys are expected, despite RefSet not differentiating
   * between keys and values.
   *
   * @returns {Iterator} An iterator for the keys.
   */
  keys() {
    return this.values();
  }
  /**
   * Determines whether an element with the specified value exists in the
   * `RefSet`. For non-objectified sets, this method checks if the dereferenced
   * values of the set include the specified value.
   *
   * For objectified sets, it uses the `contains` method which accounts for
   * the objectification. This method differs from standard Set `has` in that
   * it works with weak references and considers objectification settings.
   *
   * @param {*} value - The value to check for presence in the RefSet.
   * @returns {boolean} - True if an element with the specified value exists
   * in the RefSet, false otherwise.
   */
  has(value) {
    if (this.#objectifyValues) {
      return this.contains(value);
    }
    for (const item of this.values()) {
      if (item === value) {
        return true;
      }
    }
    return false;
  }
  /**
   * Checks if the RefSet contains a value that is equal to the specified
   * value. This method is used primarily in objectified RefSets to determine
   * the presence of a value, taking into account objectification. It differs
   * from the `has` method in that it's tailored for sets that have
   * transformed their primitive values into objects, whereas `has` is more
   * general-purpose.
   *
   * @param {*} value - The value to search for in the RefSet.
   * @returns {boolean} - True if the RefSet contains the value, false otherwise.
   */
  contains(value) {
    return !!Array.from(this.values()).filter((dereferencedValue) => {
      return value == dereferencedValue;
    }).length;
  }
  /**
   * Creates a new array with all elements that pass the test implemented by
   * the provided function. This method iterates over each element,
   * dereferences it, and applies the filter function. Unlike Array `filter`,
   * the callback receives the dereferenced value and not an index or array,
   * reflecting the non-indexed nature of RefSet. Useful for selectively
   * creating arrays from the set based on certain conditions, especially when
   * dealing with weak references.
   *
   * @param {Function} filterFn - Function to test each element of the RefSet.
   * The function receives the dereferenced value.
   * @param {*} thisArg - Value to use as `this` when executing `filterFn`.
   * @returns {Array} - A new array with the elements that pass the test.
   */
  filter(filterFn, thisArg) {
    const results = [];
    for (const value of this) {
      const dereferenced = value?.deref();
      if (dereferenced) {
        const include = filterFn.call(thisArg, dereferenced, NaN, this);
        if (include) {
          results.push(dereferenced);
        }
      }
    }
    return results;
  }
  /**
   * Returns the value of the first element in the RefSet that satisfies the
   * provided testing function. Similar to Array `find`, this method iterates
   * over the RefSet, dereferencing each value and applying the testing
   * function. The non-indexed nature of RefSet is considered, as the
   * callback does not receive an index. This method is useful for finding a
   * specific element based on a condition.
   *
   * @param {*} thisArg - Value to use as this when executing findFn.
   * @returns {*} - The value of the first element in the RefSet that satisfies
   * the testing function, or undefined if none found.
   * @returns {any} the dereferenced value if found, or undefined otherwise
   */
  find(findFn, thisArg) {
    for (const value of this) {
      const dereferenced = value?.deref();
      if (dereferenced) {
        const found = findFn.call(thisArg, dereferenced, NaN, this);
        if (found) {
          return dereferenced;
        }
      }
    }
    return void 0;
  }
  /**
   * Creates a new array or `RefSet` with the results of calling a provided
   * function on every element in the calling `RefSet`. This method dereferences
   * each value, applies the `mapFn`, and collects the results. If `toRefSet` is
   * `true`, a new `RefSet` is returned; otherwise, an array. This method
   * differs from `Array.map` in handling weak references and the potential to
   * return a new `RefSet` instead of an array.
   *
   * @param {Function} mapFn - Function that produces an element of the new
   * array or `RefSet`, taking three arguments.
   * @param {*} thisArg - Value to use as this when executing mapFn.
   * @param {boolean} toRefSet - Determines if the output should be a new
   * `RefSet` (`true`) or an array (`false`).
   * @param {boolean} mirrorObjectification - If `true` and `toRefSet` is
   * `true`, the new `RefSet` mirrors the objectification setting of the
   * original.
   * @returns {Array|RefSet} - A new array or `RefSet` with each element being
   * the result of the `mapFn`.
   */
  map(mapFn, thisArg, toRefSet, mirrorObjectification) {
    const mapped = [];
    let validRefSetOutput = true;
    let validRefSetOutputIfObjectified = true;
    for (const value of this) {
      const dereferenced = value?.deref();
      if (dereferenced) {
        const mappedItem = mapFn.call(thisArg, dereferenced, NaN, this);
        if (validRefSetOutput || validRefSetOutputIfObjectified) {
          const weakReferenceable = this.#validWeakRefTarget(mappedItem);
          if (!weakReferenceable) {
            validRefSetOutput = false;
            if (validRefSetOutputIfObjectified) {
              validRefSetOutputIfObjectified = this.#validWeakRefTarget(Object(mappedItem));
            }
          }
        }
        mapped.push(mappedItem);
      }
    }
    if (toRefSet) {
      if (validRefSetOutput) {
        return new _RefSet(mapped).objectifying(
          mirrorObjectification ? this.objectifyValues : false
        );
      }
      if (validRefSetOutputIfObjectified) {
        return new _RefSet(mapped.map((value) => {
          return this.#validWeakRefTarget(value) ? value : Object(value);
        })).objectifying();
      }
    }
    return mapped;
  }
  /**
   * Ensures that the constructor of this object instance's name
   * is returned if the string tag for this instance is queried
   *
   * @returns {string} the name of the class
   */
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  /**
   * Private method to check if a given value is a valid target for a WeakRef.
   *
   * @param {*} value - The value to check for validity as a WeakRef target.
   * @returns {boolean} - True if the value is a valid WeakRef target,
   * false otherwise.
   * @private
   */
  #validWeakRefTarget(value) {
    return !(typeof value === "symbol" && Symbol.keyFor(value) === void 0 || typeof value !== "object" && typeof value !== "symbol" || (value === null || value === void 0));
  }
};
var RefSetExtensions = new import_extension18.Extension(RefSet);

// src/classes/type.js
var import_extension19 = require("@nejs/extension");
var Type = class _Type {
  mapped = new Map(_Type.mapped.entries());
  of(value) {
    return _Type.of(value);
  }
  class(value) {
    return _Type.class(value);
  }
  isPrimitive(value) {
    return _Type.isPrimitive(value);
  }
  static is(value, ofType) {
    const name = _Type.of(value);
    return name === _Type.name(ofType);
  }
  static of(value) {
    return typeof value;
  }
  static named(value) {
    const tag = / (.*?)\]/.exec(Object.prototype.toString.call(value))?.[1];
    const name = value?.[Symbol.toStringTag] ?? tag ?? (value instanceof Function ? value.name : void 0) ?? _Type.mapped.get(typeof value).name;
    return name;
  }
  static class(value, mapped) {
    mapped = mapped ?? _Type.mapped;
    const name = value?.[Symbol.toStringTag] ?? (value instanceof Function ? value.name : void 0) ?? typeof value;
    const type = mapped.has(name) ? _Type.mapped.get(name) : value?.constructor;
    if (_Type.of(type) === "function" && !mapped.has(name) && this !== _Type) {
      mapped.set(name, type);
      mapped.set(type, name);
    }
    return !type ? mapped.get(typeof value) : type;
  }
  static isPrimitive(value) {
    return (/* @__PURE__ */ new Set([..._Type.primitives])).has(typeof value);
  }
  static get primitives() {
    return function* () {
      yield "bigint";
      yield "boolean";
      yield "number";
      yield "string";
      yield "symbol";
      yield "undefined";
    };
  }
  static get typeOfTypes() {
    return function* () {
      yield "bigint";
      yield "boolean";
      yield "function";
      yield "number";
      yield "object";
      yield "string";
      yield "symbol";
      yield "undefined";
    };
  }
  static mapped = /* @__PURE__ */ new Map([
    ["bigint", BigInt],
    ["boolean", Boolean],
    ["function", Function],
    ["number", Number],
    ["object", Object],
    ["string", String],
    ["symbol", Symbol],
    ["undefined", void 0],
    [BigInt, "bigint"],
    [Boolean, "boolean"],
    [Function, "function"],
    [Number, "number"],
    [Object, "object"],
    [String, "string"],
    [Symbol, "symbol"],
    [BigInt.name, BigInt],
    [Boolean.name, Boolean],
    [Function.name, Function],
    [Number.name, Number],
    [Object.name, Object],
    [String.name, String],
    [Symbol.name, Symbol],
    [void 0, "undefined"]
  ]);
  serverJs = {
    nodejs: {
      "v21.1.0": {
        version: "v21.1.0",
        date: /* @__PURE__ */ new Date("2024-04-21T15:58:12.490Z"),
        classes: Introspector.addExpansion([
          "AbortController",
          "AbortSignal",
          "AggregateError",
          "Array",
          "ArrayBuffer",
          "BigInt",
          "BigInt64Array",
          "BigUint64Array",
          "Blob",
          "Boolean",
          "BroadcastChannel",
          "Buffer",
          "ByteLengthQueuingStrategy",
          "CompressionStream",
          "CountQueuingStrategy",
          "Crypto",
          "CryptoKey",
          "CustomEvent",
          "DataView",
          "Date",
          "DecompressionStream",
          "DOMException",
          "Error",
          "EvalError",
          "Event",
          "EventTarget",
          "File",
          "FinalizationRegistry",
          "Float32Array",
          "Float64Array",
          "FormData",
          "Function",
          "Headers",
          "Int16Array",
          "Int32Array",
          "Int8Array",
          "Map",
          "MessageChannel",
          "MessageEvent",
          "MessagePort",
          "Navigator",
          "Number",
          "Object",
          "Performance",
          "PerformanceEntry",
          "PerformanceMark",
          "PerformanceMeasure",
          "PerformanceObserver",
          "PerformanceObserverEntryList",
          "PerformanceResourceTiming",
          "Promise",
          "Proxy",
          "RangeError",
          "ReadableByteStreamController",
          "ReadableStream",
          "ReadableStreamBYOBReader",
          "ReadableStreamBYOBRequest",
          "ReadableStreamDefaultController",
          "ReadableStreamDefaultReader",
          "ReferenceError",
          "RegExp",
          "Request",
          "Response",
          "Set",
          "SharedArrayBuffer",
          "String",
          "SubtleCrypto",
          "Symbol",
          "SyntaxError",
          "TextDecoder",
          "TextDecoderStream",
          "TextEncoder",
          "TextEncoderStream",
          "TransformStream",
          "TransformStreamDefaultController",
          "TypeError",
          "Uint16Array",
          "Uint32Array",
          "Uint8Array",
          "Uint8ClampedArray",
          "URIError",
          "URL",
          "URLSearchParams",
          "WeakMap",
          "WeakRef",
          "WeakSet",
          "WritableStream",
          "WritableStreamDefaultController",
          "WritableStreamDefaultWriter"
        ]),
        nodeSpecificClasses: Introspector.addExpansion([
          "Buffer",
          "CryptoKey",
          "SharedArrayBuffer",
          "SubtleCrypto"
        ]),
        functions: Introspector.addExpansion([
          "assert",
          "atob",
          "btoa",
          "clearImmediate",
          "clearInterval",
          "clearTimeout",
          "decodeURI",
          "decodeURIComponent",
          "encodeURI",
          "encodeURIComponent",
          "escape",
          "eval",
          "events",
          "fetch",
          "isFinite",
          "isNaN",
          "parseFloat",
          "parseInt",
          "queueMicrotask",
          "require",
          "setImmediate",
          "setInterval",
          "setTimeout",
          "stream",
          "structuredClone",
          "unescape"
        ]),
        objects: Introspector.addExpansion([
          "Atomics",
          "Intl",
          "JSON",
          "Math",
          "Reflect",
          "WebAssembly",
          "_",
          "_error",
          "async_hooks",
          "buffer",
          "child_process",
          "cluster",
          "console",
          "constants",
          "crypto",
          "dgram",
          "diagnostics_channel",
          "dns",
          "domain",
          "fs",
          "global",
          "globalThis",
          "http",
          "http2",
          "https",
          "inspector",
          "module",
          "navigator",
          "net",
          "os",
          "path",
          "perf_hooks",
          "performance",
          "process",
          "punycode",
          "querystring",
          "readline",
          "repl",
          "string_decoder",
          "sys",
          "timers",
          "tls",
          "trace_events",
          "tty",
          "url",
          "util",
          "v8",
          "vm",
          "wasi",
          "worker_threads",
          "zlib"
        ]),
        properties: Introspector.addExpansion(["Infinity", "NaN", "undefined"]),
        symbols: Introspector.addExpansion([Symbol.toStringTag])
      }
    },
    qjs: {
      "v": {
        version: "v",
        classes: Introspector.addExpansion([
          "AggregateError",
          "Array",
          "ArrayBuffer",
          "BigInt",
          "BigInt64Array",
          "BigUint64Array",
          "Boolean",
          "DataView",
          "Date",
          "Error",
          "EvalError",
          "Float32Array",
          "Float64Array",
          "Function",
          "Int16Array",
          "Int32Array",
          "Int8Array",
          "InternalError",
          "Map",
          "Number",
          "Object",
          "Promise",
          "Proxy",
          "RangeError",
          "ReferenceError",
          "RegExp",
          "Set",
          "SharedArrayBuffer",
          "String",
          "Symbol",
          "SyntaxError",
          "TypeError",
          "URIError",
          "Uint16Array",
          "Uint32Array",
          "Uint8Array",
          "Uint8ClampedArray",
          "WeakMap",
          "WeakSet"
        ]),
        functions: Introspector.addExpansion([
          "decodeURI",
          "decodeURIComponent",
          "encodeURI",
          "encodeURIComponent",
          "escape",
          "eval",
          "isFinite",
          "isNaN",
          "parseFloat",
          "parseInt",
          "print",
          "unescape"
        ]),
        objects: Introspector.addExpansion([
          "Atomics",
          "JSON",
          "Math",
          "Reflect",
          "_",
          "console",
          "globalThis",
          "os",
          "scriptArgs",
          "std"
        ]),
        properties: Introspector.addExpansion([
          "Infinity",
          "NaN",
          "undefined"
        ]),
        symbols: Introspector.addExpansion([])
      }
    }
  };
  browser = {
    arc: {
      version: "Version 1.39.0 (48951)",
      userAgent: [
        "Mozilla/5.0",
        "(Macintosh; Intel Mac OS X 10_15_7)",
        "AppleWebKit/537.36",
        "(KHTML, like Gecko)",
        "Chrome/124.0.0.0",
        "Safari/537.36"
      ].join(" "),
      types: {
        classes: Introspector.addExpansion([
          "AbortController",
          "AbortSignal",
          "AggregateError",
          "Array",
          "ArrayBuffer",
          "BigInt",
          "BigInt64Array",
          "BigUint64Array",
          "Blob",
          "Boolean",
          "BroadcastChannel",
          "ByteLengthQueuingStrategy",
          "CompressionStream",
          "CountQueuingStrategy",
          "Crypto",
          "CustomEvent",
          "DOMException",
          "DataView",
          "Date",
          "DecompressionStream",
          "Error",
          "EvalError",
          "Event",
          "EventTarget",
          "File",
          "FinalizationRegistry",
          "Float32Array",
          "Float64Array",
          "FormData",
          "Function",
          "Headers",
          "Int16Array",
          "Int32Array",
          "Int8Array",
          "Map",
          "MessageChannel",
          "MessageEvent",
          "MessagePort",
          "Navigator",
          "Number",
          "Object",
          "Performance",
          "PerformanceEntry",
          "PerformanceMark",
          "PerformanceMeasure",
          "PerformanceObserver",
          "PerformanceObserverEntryList",
          "PerformanceResourceTiming",
          "Promise",
          "Proxy",
          "RangeError",
          "ReadableByteStreamController",
          "ReadableStream",
          "ReadableStreamBYOBReader",
          "ReadableStreamBYOBRequest",
          "ReadableStreamDefaultController",
          "ReadableStreamDefaultReader",
          "ReferenceError",
          "RegExp",
          "Request",
          "Response",
          "Set",
          "String",
          "Symbol",
          "SyntaxError",
          "TextDecoder",
          "TextDecoderStream",
          "TextEncoder",
          "TextEncoderStream",
          "TransformStream",
          "TransformStreamDefaultController",
          "TypeError",
          "URIError",
          "URL",
          "URLSearchParams",
          "Uint16Array",
          "Uint32Array",
          "Uint8Array",
          "Uint8ClampedArray",
          "WeakMap",
          "WeakRef",
          "WeakSet",
          "WritableStream",
          "WritableStreamDefaultController",
          "WritableStreamDefaultWriter"
        ]),
        browserClasses: Introspector.addExpansion([
          "AbstractRange",
          "AnalyserNode",
          "Animation",
          "AnimationEffect",
          "AnimationEvent",
          "AnimationPlaybackEvent",
          "AnimationTimeline",
          "Attr",
          "Audio",
          "AudioBuffer",
          "AudioBufferSourceNode",
          "AudioContext",
          "AudioData",
          "AudioDestinationNode",
          "AudioListener",
          "AudioNode",
          "AudioParam",
          "AudioParamMap",
          "AudioProcessingEvent",
          "AudioScheduledSourceNode",
          "AudioSinkInfo",
          "AudioWorkletNode",
          "BackgroundFetchManager",
          "BackgroundFetchRecord",
          "BackgroundFetchRegistration",
          "BarProp",
          "BaseAudioContext",
          "BeforeInstallPromptEvent",
          "BeforeUnloadEvent",
          "BiquadFilterNode",
          "BlobEvent",
          "BluetoothUUID",
          "BrowserCaptureMediaStreamTrack",
          "CDATASection",
          "CSSAnimation",
          "CSSConditionRule",
          "CSSContainerRule",
          "CSSCounterStyleRule",
          "CSSFontFaceRule",
          "CSSFontPaletteValuesRule",
          "CSSGroupingRule",
          "CSSImageValue",
          "CSSImportRule",
          "CSSKeyframeRule",
          "CSSKeyframesRule",
          "CSSKeywordValue",
          "CSSLayerBlockRule",
          "CSSLayerStatementRule",
          "CSSMathClamp",
          "CSSMathInvert",
          "CSSMathMax",
          "CSSMathMin",
          "CSSMathNegate",
          "CSSMathProduct",
          "CSSMathSum",
          "CSSMathValue",
          "CSSMatrixComponent",
          "CSSMediaRule",
          "CSSNamespaceRule",
          "CSSNumericArray",
          "CSSNumericValue",
          "CSSPageRule",
          "CSSPerspective",
          "CSSPositionValue",
          "CSSPropertyRule",
          "CSSRotate",
          "CSSRule",
          "CSSRuleList",
          "CSSScale",
          "CSSScopeRule",
          "CSSSkew",
          "CSSSkewX",
          "CSSSkewY",
          "CSSStartingStyleRule",
          "CSSStyleDeclaration",
          "CSSStyleRule",
          "CSSStyleSheet",
          "CSSStyleValue",
          "CSSSupportsRule",
          "CSSTransformComponent",
          "CSSTransformValue",
          "CSSTransition",
          "CSSTranslate",
          "CSSUnitValue",
          "CSSUnparsedValue",
          "CSSVariableReferenceValue",
          "CanvasCaptureMediaStreamTrack",
          "CanvasGradient",
          "CanvasPattern",
          "CanvasRenderingContext2D",
          "ChannelMergerNode",
          "ChannelSplitterNode",
          "CharacterBoundsUpdateEvent",
          "CharacterData",
          "ClipboardEvent",
          "CloseEvent",
          "Comment",
          "CompositionEvent",
          "ConstantSourceNode",
          "ContentVisibilityAutoStateChangeEvent",
          "ConvolverNode",
          "CropTarget",
          "CustomElementRegistry",
          "CustomStateSet",
          "DOMError",
          "DOMImplementation",
          "DOMMatrix",
          "DOMMatrixReadOnly",
          "DOMParser",
          "DOMPoint",
          "DOMPointReadOnly",
          "DOMQuad",
          "DOMRect",
          "DOMRectList",
          "DOMRectReadOnly",
          "DOMStringList",
          "DOMStringMap",
          "DOMTokenList",
          "DataTransfer",
          "DataTransferItem",
          "DataTransferItemList",
          "DelayNode",
          "DelegatedInkTrailPresenter",
          "Document",
          "DocumentFragment",
          "DocumentPictureInPictureEvent",
          "DocumentTimeline",
          "DocumentType",
          "DragEvent",
          "DynamicsCompressorNode",
          "EditContext",
          "Element",
          "ElementInternals",
          "EncodedAudioChunk",
          "EncodedVideoChunk",
          "ErrorEvent",
          "EventCounts",
          "EventSource",
          "External",
          "FeaturePolicy",
          "FileList",
          "FileReader",
          "FocusEvent",
          "FontFace",
          "FontFaceSetLoadEvent",
          "FormDataEvent",
          "FragmentDirective",
          "GainNode",
          "Gamepad",
          "GamepadButton",
          "GamepadEvent",
          "GamepadHapticActuator",
          "Geolocation",
          "GeolocationCoordinates",
          "GeolocationPosition",
          "GeolocationPositionError",
          "HTMLAllCollection",
          "HTMLAnchorElement",
          "HTMLAreaElement",
          "HTMLAudioElement",
          "HTMLBRElement",
          "HTMLBaseElement",
          "HTMLBodyElement",
          "HTMLButtonElement",
          "HTMLCanvasElement",
          "HTMLCollection",
          "HTMLDListElement",
          "HTMLDataElement",
          "HTMLDataListElement",
          "HTMLDetailsElement",
          "HTMLDialogElement",
          "HTMLDirectoryElement",
          "HTMLDivElement",
          "HTMLDocument",
          "HTMLElement",
          "HTMLEmbedElement",
          "HTMLFieldSetElement",
          "HTMLFontElement",
          "HTMLFormControlsCollection",
          "HTMLFormElement",
          "HTMLFrameElement",
          "HTMLFrameSetElement",
          "HTMLHRElement",
          "HTMLHeadElement",
          "HTMLHeadingElement",
          "HTMLHtmlElement",
          "HTMLIFrameElement",
          "HTMLImageElement",
          "HTMLInputElement",
          "HTMLLIElement",
          "HTMLLabelElement",
          "HTMLLegendElement",
          "HTMLLinkElement",
          "HTMLMapElement",
          "HTMLMarqueeElement",
          "HTMLMediaElement",
          "HTMLMenuElement",
          "HTMLMetaElement",
          "HTMLMeterElement",
          "HTMLModElement",
          "HTMLOListElement",
          "HTMLObjectElement",
          "HTMLOptGroupElement",
          "HTMLOptionElement",
          "HTMLOptionsCollection",
          "HTMLOutputElement",
          "HTMLParagraphElement",
          "HTMLParamElement",
          "HTMLPictureElement",
          "HTMLPreElement",
          "HTMLProgressElement",
          "HTMLQuoteElement",
          "HTMLScriptElement",
          "HTMLSelectElement",
          "HTMLSlotElement",
          "HTMLSourceElement",
          "HTMLSpanElement",
          "HTMLStyleElement",
          "HTMLTableCaptionElement",
          "HTMLTableCellElement",
          "HTMLTableColElement",
          "HTMLTableElement",
          "HTMLTableRowElement",
          "HTMLTableSectionElement",
          "HTMLTemplateElement",
          "HTMLTextAreaElement",
          "HTMLTimeElement",
          "HTMLTitleElement",
          "HTMLTrackElement",
          "HTMLUListElement",
          "HTMLUnknownElement",
          "HTMLVideoElement",
          "HashChangeEvent",
          "Highlight",
          "HighlightRegistry",
          "History",
          "IDBCursor",
          "IDBCursorWithValue",
          "IDBDatabase",
          "IDBFactory",
          "IDBIndex",
          "IDBKeyRange",
          "IDBObjectStore",
          "IDBOpenDBRequest",
          "IDBRequest",
          "IDBTransaction",
          "IDBVersionChangeEvent",
          "IIRFilterNode",
          "IdleDeadline",
          "Image",
          "ImageBitmap",
          "ImageBitmapRenderingContext",
          "ImageCapture",
          "ImageData",
          "ImageTrack",
          "ImageTrackList",
          "Ink",
          "InputDeviceCapabilities",
          "InputDeviceInfo",
          "InputEvent",
          "IntersectionObserver",
          "IntersectionObserverEntry",
          "Iterator",
          "KeyboardEvent",
          "KeyframeEffect",
          "LargestContentfulPaint",
          "LaunchParams",
          "LaunchQueue",
          "LayoutShift",
          "LayoutShiftAttribution",
          "Location",
          "MathMLElement",
          "MediaCapabilities",
          "MediaElementAudioSourceNode",
          "MediaEncryptedEvent",
          "MediaError",
          "MediaList",
          "MediaMetadata",
          "MediaQueryList",
          "MediaQueryListEvent",
          "MediaRecorder",
          "MediaSession",
          "MediaSource",
          "MediaSourceHandle",
          "MediaStream",
          "MediaStreamAudioDestinationNode",
          "MediaStreamAudioSourceNode",
          "MediaStreamEvent",
          "MediaStreamTrack",
          "MediaStreamTrackEvent",
          "MediaStreamTrackGenerator",
          "MediaStreamTrackProcessor",
          "MediaStreamTrackVideoStats",
          "MimeType",
          "MimeTypeArray",
          "MouseEvent",
          "MutationEvent",
          "MutationObserver",
          "MutationRecord",
          "NamedNodeMap",
          "NavigateEvent",
          "Navigation",
          "NavigationActivation",
          "NavigationCurrentEntryChangeEvent",
          "NavigationDestination",
          "NavigationHistoryEntry",
          "NavigationTransition",
          "NavigatorUAData",
          "NetworkInformation",
          "Node",
          "NodeFilter",
          "NodeIterator",
          "NodeList",
          "Notification",
          "OfflineAudioCompletionEvent",
          "OfflineAudioContext",
          "OffscreenCanvas",
          "OffscreenCanvasRenderingContext2D",
          "Option",
          "OscillatorNode",
          "OverconstrainedError",
          "PageRevealEvent",
          "PageSwapEvent",
          "PageTransitionEvent",
          "PannerNode",
          "Path2D",
          "PerformanceElementTiming",
          "PerformanceEventTiming",
          "PerformanceLongAnimationFrameTiming",
          "PerformanceLongTaskTiming",
          "PerformanceNavigation",
          "PerformanceNavigationTiming",
          "PerformancePaintTiming",
          "PerformanceScriptTiming",
          "PerformanceServerTiming",
          "PerformanceTiming",
          "PeriodicSyncManager",
          "PeriodicWave",
          "PermissionStatus",
          "Permissions",
          "PictureInPictureEvent",
          "PictureInPictureWindow",
          "Plugin",
          "PluginArray",
          "PointerEvent",
          "PopStateEvent",
          "ProcessingInstruction",
          "Profiler",
          "ProgressEvent",
          "PromiseRejectionEvent",
          "PushManager",
          "PushSubscription",
          "PushSubscriptionOptions",
          "RTCCertificate",
          "RTCDTMFSender",
          "RTCDTMFToneChangeEvent",
          "RTCDataChannel",
          "RTCDataChannelEvent",
          "RTCDtlsTransport",
          "RTCEncodedAudioFrame",
          "RTCEncodedVideoFrame",
          "RTCError",
          "RTCErrorEvent",
          "RTCIceCandidate",
          "RTCIceTransport",
          "RTCPeerConnection",
          "RTCPeerConnectionIceErrorEvent",
          "RTCPeerConnectionIceEvent",
          "RTCRtpReceiver",
          "RTCRtpSender",
          "RTCRtpTransceiver",
          "RTCSctpTransport",
          "RTCSessionDescription",
          "RTCStatsReport",
          "RTCTrackEvent",
          "RadioNodeList",
          "Range",
          "RemotePlayback",
          "ReportingObserver",
          "ResizeObserver",
          "ResizeObserverEntry",
          "ResizeObserverSize",
          "SVGAElement",
          "SVGAngle",
          "SVGAnimateElement",
          "SVGAnimateMotionElement",
          "SVGAnimateTransformElement",
          "SVGAnimatedAngle",
          "SVGAnimatedBoolean",
          "SVGAnimatedEnumeration",
          "SVGAnimatedInteger",
          "SVGAnimatedLength",
          "SVGAnimatedLengthList",
          "SVGAnimatedNumber",
          "SVGAnimatedNumberList",
          "SVGAnimatedPreserveAspectRatio",
          "SVGAnimatedRect",
          "SVGAnimatedString",
          "SVGAnimatedTransformList",
          "SVGAnimationElement",
          "SVGCircleElement",
          "SVGClipPathElement",
          "SVGComponentTransferFunctionElement",
          "SVGDefsElement",
          "SVGDescElement",
          "SVGElement",
          "SVGEllipseElement",
          "SVGFEBlendElement",
          "SVGFEColorMatrixElement",
          "SVGFEComponentTransferElement",
          "SVGFECompositeElement",
          "SVGFEConvolveMatrixElement",
          "SVGFEDiffuseLightingElement",
          "SVGFEDisplacementMapElement",
          "SVGFEDistantLightElement",
          "SVGFEDropShadowElement",
          "SVGFEFloodElement",
          "SVGFEFuncAElement",
          "SVGFEFuncBElement",
          "SVGFEFuncGElement",
          "SVGFEFuncRElement",
          "SVGFEGaussianBlurElement",
          "SVGFEImageElement",
          "SVGFEMergeElement",
          "SVGFEMergeNodeElement",
          "SVGFEMorphologyElement",
          "SVGFEOffsetElement",
          "SVGFEPointLightElement",
          "SVGFESpecularLightingElement",
          "SVGFESpotLightElement",
          "SVGFETileElement",
          "SVGFETurbulenceElement",
          "SVGFilterElement",
          "SVGForeignObjectElement",
          "SVGGElement",
          "SVGGeometryElement",
          "SVGGradientElement",
          "SVGGraphicsElement",
          "SVGImageElement",
          "SVGLength",
          "SVGLengthList",
          "SVGLineElement",
          "SVGLinearGradientElement",
          "SVGMPathElement",
          "SVGMarkerElement",
          "SVGMaskElement",
          "SVGMatrix",
          "SVGMetadataElement",
          "SVGNumber",
          "SVGNumberList",
          "SVGPathElement",
          "SVGPatternElement",
          "SVGPoint",
          "SVGPointList",
          "SVGPolygonElement",
          "SVGPolylineElement",
          "SVGPreserveAspectRatio",
          "SVGRadialGradientElement",
          "SVGRect",
          "SVGRectElement",
          "SVGSVGElement",
          "SVGScriptElement",
          "SVGSetElement",
          "SVGStopElement",
          "SVGStringList",
          "SVGStyleElement",
          "SVGSwitchElement",
          "SVGSymbolElement",
          "SVGTSpanElement",
          "SVGTextContentElement",
          "SVGTextElement",
          "SVGTextPathElement",
          "SVGTextPositioningElement",
          "SVGTitleElement",
          "SVGTransform",
          "SVGTransformList",
          "SVGUnitTypes",
          "SVGUseElement",
          "SVGViewElement",
          "Scheduler",
          "Scheduling",
          "Screen",
          "ScreenOrientation",
          "ScriptProcessorNode",
          "ScrollTimeline",
          "SecurityPolicyViolationEvent",
          "Selection",
          "ShadowRoot",
          "SharedWorker",
          "SourceBuffer",
          "SourceBufferList",
          "SpeechSynthesis",
          "SpeechSynthesisErrorEvent",
          "SpeechSynthesisEvent",
          "SpeechSynthesisUtterance",
          "SpeechSynthesisVoice",
          "StaticRange",
          "StereoPannerNode",
          "Storage",
          "StorageEvent",
          "StylePropertyMap",
          "StylePropertyMapReadOnly",
          "StyleSheet",
          "StyleSheetList",
          "SubmitEvent",
          "SyncManager",
          "TaskAttributionTiming",
          "TaskController",
          "TaskPriorityChangeEvent",
          "TaskSignal",
          "Text",
          "TextEvent",
          "TextFormat",
          "TextFormatUpdateEvent",
          "TextMetrics",
          "TextTrack",
          "TextTrackCue",
          "TextTrackCueList",
          "TextTrackList",
          "TextUpdateEvent",
          "TimeRanges",
          "ToggleEvent",
          "Touch",
          "TouchEvent",
          "TouchList",
          "TrackEvent",
          "TransitionEvent",
          "TreeWalker",
          "TrustedHTML",
          "TrustedScript",
          "TrustedScriptURL",
          "TrustedTypePolicy",
          "TrustedTypePolicyFactory",
          "UIEvent",
          "URLPattern",
          "UserActivation",
          "VTTCue",
          "ValidityState",
          "VideoColorSpace",
          "VideoFrame",
          "VideoPlaybackQuality",
          "ViewTimeline",
          "ViewTransition",
          "VirtualKeyboardGeometryChangeEvent",
          "VisibilityStateEntry",
          "VisualViewport",
          "WaveShaperNode",
          "WebGL2RenderingContext",
          "WebGLActiveInfo",
          "WebGLBuffer",
          "WebGLContextEvent",
          "WebGLFramebuffer",
          "WebGLProgram",
          "WebGLQuery",
          "WebGLRenderbuffer",
          "WebGLRenderingContext",
          "WebGLSampler",
          "WebGLShader",
          "WebGLShaderPrecisionFormat",
          "WebGLSync",
          "WebGLTexture",
          "WebGLTransformFeedback",
          "WebGLUniformLocation",
          "WebGLVertexArrayObject",
          "WebKitCSSMatrix",
          "WebKitMutationObserver",
          "WebSocket",
          "WebSocketError",
          "WebSocketStream",
          "WheelEvent",
          "Window",
          "WindowControlsOverlay",
          "WindowControlsOverlayGeometryChangeEvent",
          "Worker",
          "XMLDocument",
          "XMLHttpRequest",
          "XMLHttpRequestEventTarget",
          "XMLHttpRequestUpload",
          "XMLSerializer",
          "XPathEvaluator",
          "XPathExpression",
          "XPathResult",
          "XSLTProcessor"
        ])
      },
      methods: {
        get classes() {
          return addExpansion(fetcher("function", /^[A-Z]/));
        },
        get functions() {
        },
        get objects() {
        }
      }
    },
    safari: {}
  };
};
var TypeExtensions = new import_extension19.Extension(Type);

// src/classes/index.js
var NewClassesExtension = new import_extension20.Patch(globalThis, {
  AsyncIterable,
  AsyncIterator,
  Deferred,
  Descriptor,
  Enum,
  Enumeration,
  Introspector,
  Iterable,
  Iterator,
  ParamParser,
  PluggableProxy,
  ProxyHandler,
  Property,
  RefMap,
  RefSet,
  Symkeys,
  Type
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AsyncIterable,
  AsyncIterableExtensions,
  AsyncIterator,
  AsyncIteratorExtensions,
  Deferred,
  DeferredExtension,
  Descriptor,
  DescriptorExtensions,
  Enum,
  EnumExtension,
  Enumeration,
  EnumerationExtension,
  Introspector,
  IntrospectorExtensions,
  Iterable,
  IterableExtensions,
  Iterator,
  IteratorExtensions,
  NewClassesExtension,
  ParamParser,
  ParamParserExtensions,
  PluggableProxy,
  PluggableProxyExtensionSet,
  PluggableProxyExtensions,
  Property,
  PropertyExtensions,
  ProxyHandler,
  ProxyHandlerExtensions,
  ProxyHandlerResponse,
  RefMap,
  RefMapExtensions,
  RefSet,
  RefSetExtensions,
  SubscriptProxy,
  Symkeys,
  SymkeysExtension,
  Type,
  TypeExtensions,
  makeBaseEnum
});
//# sourceMappingURL=index.cjs.map
