"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectPrototypeExtensions = exports.ObjectExtensions = void 0;
const extension_1 = require("@nejs/extension");
const symbol_extensions_js_1 = require("./symbol.extensions.js");
const descriptor_js_1 = require("./classes/descriptor.js");
const property_js_1 = require("./classes/property.js");
const toolkit_js_1 = require("./utils/toolkit.js");
const copy_object_js_1 = require("./utils/copy.object.js");
const { keys: symkeys } = symbol_extensions_js_1.SymbolExtensions.patches;
/**
 * `ObjectExtensions` is a constant that applies a patch to the global
 * `Object` constructor. This patch extends the `Object` with additional
 * methods and properties, enhancing its functionality.
 *
 * The `Patch` function takes two arguments: the target object to be patched
 * (in this case, `Object`), and an object containing the methods and
 * properties to be added to the target object.
 *
 * @type {Patch}
 * @memberof module:object.extensions
 */
exports.ObjectExtensions = new extension_1.Patch(Object, {
    [extension_1.Patch.kMutablyHidden]: {
        add(...args) {
            const { isDescriptor } = descriptor_js_1.Descriptor;
            const { isObject: isObj } = this;
            const { kDescriptorStore } = this;
            let obj, key, value, _get, _set, storage, storageKey;
            let _type, _flag, _desc;
            // Check to see if we received multiple arguments or an object
            if (args.length && isObj(args[0])) {
                ({
                    to: obj,
                    key,
                    value,
                    get: _get,
                    set: _set,
                    storage,
                    storageKey,
                    type: _type = ['accessor', 'data'][1],
                    flag: _flag = undefined,
                    descriptorBase: _desc = undefined,
                } = args[0]);
            }
            else if (args.length > 1) {
                ([
                    to,
                    _type,
                    key,
                    getOrValue,
                    _set,
                    storage,
                    storageKey,
                    _flag,
                    _desc,
                ] = args);
                obj = to;
                _type = (['accessor', 'data'].includes(_type.toLowerCase())
                    ? _type.toLowerCase() : 'data');
                _get = _type === 'accessor' ? getOrValue : undefined;
                _value = _type === 'data' ? getOrValue : undefined;
            }
            if (!this.isObject(obj)) {
                console.warn('Object.add() must receive an object for `toObject`');
                return obj;
            }
            const more = isDescriptor(_desc) ? _desc : {};
            const flag = _flag || Object.definitionType.mutablyVisible;
            const props = { ...extension_1.Patch.getDescriptorOverridesFromSymbol(flag), ...more };
            const type = (['accessor', 'data'].includes(_type)
                ? String(_type).toLowerCase() : 'data');
            switch (type) {
                case 'accessor':
                    let store = storage;
                    let storeKey = storageKey || key;
                    let makeStore = false;
                    let get = _get;
                    let set = _set;
                    if (!toolkit_js_1.is.truthy(get) && !toolkit_js_1.is.function(get)) {
                        get = undefined;
                    }
                    if (!toolkit_js_1.is.truthy(set) && !toolkit_js_1.is.function(set)) {
                        set = undefined;
                    }
                    if (isObj(store) || toolkit_js_1.is.true(store) || toolkit_js_1.is.function(store)) {
                        makeStore = toolkit_js_1.is.true(store);
                        store = toolkit_js_1.is.fn(store) ? store() : store;
                        store = toolkit_js_1.is.object(store) ? store : (makeStore && {} || undefined);
                    }
                    // store should be defined by here: object or undefined
                    if ((!get && !set) && makeStore) {
                        // being lazy here, someone has defined we make an accessor but
                        // wants the default accessor behaviors with an associated store
                        // made by us.
                        Object.defineProperty(obj, kDescriptorStore, {
                            value: symkeys.add('descriptor.store', store),
                            configurable: true,
                            enumerable: false,
                            writable: true,
                        });
                        get = () => this[kDescriptorStore]?.data?.[storeKey];
                        set = (value) => { this[kDescriptorStore].data[storeKey] = value; };
                    }
                    else if (get?.length && set?.length > 1 && store) {
                        // if we received a get or set that takes more arguments than
                        // expected, assume the last argument should be the store variable
                        // so we execute the supplied function with the storage and its
                        // results or byproducts are the result to the get/set we define
                        const innerGet = get;
                        const innerSet = set;
                        get = () => innerGet(store);
                        set = (value) => innerSet(value, store);
                    }
                    // get and set should be in their final state by here
                    Object.defineProperty(obj, key, { ...props, get, set });
                    break;
                case 'data':
                    Object.defineProperty(obj, key, { ...props, value });
                    break;
            }
            return obj;
        },
        addAccessor(to, key, getter, setter, storage) {
            const store = storage ?? (!getter && !setter) ? true : undefined;
            return this.add({ to, key, get: getter, set: setter, storage: store });
        },
        addData(to, key, value) {
            return this.add({ to, key, value });
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
            return (0, copy_object_js_1.copyObject)(false, destination, ...sources);
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
            return (0, copy_object_js_1.copyObject)(true, destination, ...sources);
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
            const properties = extension_1.Patch.getDescriptorOverridesFromSymbol(flag);
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
                get mutablyHidden() { return extension_1.Patch.kMutablyHidden; },
                get mutablyVisible() { return extension_1.Patch.kMutablyVisible; },
                get immutablyHidden() { return extension_1.Patch.kImmutablyHidden; },
                get immutablyVisible() { return extension_1.Patch.kImmutablyVisible; },
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
            const properties = extension_1.Patch.getDescriptorOverridesFromSymbol(flag);
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
        fromEntriesUsing(entries, prototype = Object.prototype, reducer = undefined) {
            if (!toolkit_js_1.is.array(entries)) {
                return undefined;
            }
            const entriesToUse = entries.filter(entry => toolkit_js_1.is.array(entry) && entry.length >= 2);
            if (!entriesToUse.length) {
                return undefined;
            }
            const useReducer = reducer instanceof Function
                ? reducer
                : (accumulator, [key, value]) => {
                    accumulator[key] = value;
                    return accumulator;
                };
            return entriesToUse.reduce(useReducer, Object.create(prototype ?? Object.prototype));
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
            if (toolkit_js_1.has.stringTag(value)) {
                return value[Symbol.toStringTag];
            }
            if (strict) {
                return undefined;
            }
            if (value && (typeof value === 'function')) {
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
                case 'Null': return null;
                case 'Undefined': return undefined;
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
            return toolkit_js_1.has.stringTag(value);
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
            return toolkit_js_1.is.nullish(value);
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
            return isThenElse(toolkit_js_1.is.nullish(value), thenValue, elseValue);
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
            return toolkit_js_1.is.object(value);
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
            return isThenElse(toolkit_js_1.is.object(value), thenValue, elseValue);
        },
        /**
         * Checks to see if the supplied value is a primitive value.
         *
         * @param {any} value the value to test to see if it is a primitive value type
         * @returns true if the object is considered widely to be a primitive value,
         * false otherwise.
         */
        isPrimitive(value) {
            return toolkit_js_1.is.primitive(value);
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
            return isThenElse(toolkit_js_1.is.primitive(value), thenValue, elseValue);
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
            return (typeof value === 'string' || typeof value === 'symbol');
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
            return Symbol.for('@nejs.object.descriptor.storage');
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
        prekeyed(keys, defaultValue = undefined, definedAs = ['data', 'accessor'][0], accessorMeta = { get: undefined, set: undefined, thisArg: undefined }, descriptorBase = { enumerable: true, configurable: true }, extraDescriptors = undefined, prototype = Object.prototype) {
            const object = Object.create(prototype, extraDescriptors);
            let mapped = {};
            if (Array.isArray(keys)) {
                mapped = keys.reduce((a, k) => ({ ...a, [k]: defaultValue }), {});
            }
            else if (keys && typeof keys === 'object') {
                Object.assign(mapped, keys);
            }
            else {
                console.warn('skipping');
                return object;
            }
            for (const [key, value] of Object.entries(mapped)) {
                let symKey = Symbol.for(`${key}#${Math.random().toString(36).slice(2)}`);
                let suppliedValue = mapped[key] ?? defaultValue;
                if (definedAs === 'accessor' && accessorMeta.get === undefined) {
                    Object.defineProperty(object, symKey, {
                        value: suppliedValue, enumerable: false, configurable: true
                    });
                    accessorMeta.thisArg = object;
                }
                let descriptorRest = definedAs === 'data'
                    ? { value: value ?? defaultValue, writable: true }
                    : {
                        get: accessorMeta.get ?? function () { return this[symKey]; },
                        set: accessorMeta.set ?? function (v) { this[symKey] = v; }
                    };
                if (accessorMeta.thisArg) {
                    descriptorRest.get = descriptorRest.get.bind(accessorMeta.thisArg);
                    descriptorRest.set = descriptorRest.set.bind(accessorMeta.thisArg);
                }
                Object.defineProperty(object, key, { ...descriptorBase, ...descriptorRest });
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
            if (!object || typeof object !== 'object') {
                throw new TypeError('Object.stripTo requires an object to strip. Received', object);
            }
            const result = {};
            if (!Array.isArray(keys)) {
                return result;
            }
            for (let key of keys) {
                if (Reflect.has(object, key)) {
                    const originalDescriptor = Object.getOwnPropertyDescriptor(object, key);
                    const descriptor = { ...originalDescriptor };
                    if (typeof descriptor.get === 'function' ||
                        typeof descriptor.set === 'function') {
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
            const props = properties.filter(p => p instanceof property_js_1.Property);
            const possible = properties.filter(p => Array.isArray(p));
            if (possible.length) {
                for (const [key, descriptorOrDataOrAccessorArgs, ...rest] of possible) {
                    // if arg[1] is a descriptor
                    if (property_js_1.Property.is.descriptor(descriptorOrDataOrAccessorArgs)) {
                        props.push(new property_js_1.Property(key, descriptorOrDataOrAccessorArgs));
                    }
                    else {
                        const { get, set } = descriptorOrDataOrAccessorArgs;
                        const args = [key, descriptorOrDataOrAccessorArgs, ...rest];
                        if (get || set) {
                            props.push(property_js_1.Property.accessor(...args));
                        }
                        else {
                            props.push(property_js_1.Property.data(...args));
                        }
                    }
                }
            }
            const object = Object.create(prototype ?? Object.prototype);
            const sorted = props.toSorted((a, b) => a.key < b.key ? -1 : (a.key > b.key ? 1 : 0));
            for (const property of sorted) {
                property.apply(object);
            }
            property_js_1.Property.data(Symbol.for('properties'), sorted).apply(object);
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
            return { as: toolkit_js_1.as, has: toolkit_js_1.has, is: toolkit_js_1.is, si: toolkit_js_1.si };
        },
    },
});
const { isObject: pIsObject, ifObject: pIfObject, isNullDefined: pIsNullDefined, ifNullDefined: pIfNullDefined, isPrimitive: pIsPrimitive, ifPrimitive: pIfPrimitive, isValidKey: pIsValidKey, ifValidKey: pIfValidKey, hasStringTag: pHasStringTag, getStringTag: pGetStringTag, stripTo: pStripTo, } = exports.ObjectExtensions.patches;
/**
 * `ObjectPrototypeExtensions` is a constant that applies a patch to the
 * Object prototype. This patch extends the Object prototype with additional
 * methods and properties, enhancing its functionality.
 *
 * The `Patch` function takes two arguments: the target object to be patched
 * (in this case, `Object.prototype`), and an object containing the methods
 * and properties to be added to the target object.
 *
 * @example
 * // Using a method added by ObjectPrototypeExtensions
 * const obj = {};
 * console.log(obj.isObject()); // Output: true
 *
 * @const
 * @type {Patch}
 * @memberof module:object.extensions
 */
exports.ObjectPrototypeExtensions = new extension_1.Patch(Object.prototype, {
    [extension_1.Patch.kMutablyHidden]: {
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
            return exports.ObjectExtensions.patches.getPrototypeChainEntries(this);
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
        },
    },
});
// NOTE to self; this is repeated here otherwise a circular reference from
// Object<->Function<->Global occurs. See original source in global.this.js
// {@see globalThis.isThenElse}
function isThenElse(bv, tv, ev) {
    if (arguments.length > 1) {
        var _then = toolkit_js_1.is.function(tv) ? tv(bv) : tv;
        if (arguments.length > 2) {
            var _else = toolkit_js_1.is.function(ev) ? tv(bv) : ev;
            return bv ? _then : _else;
        }
        return bv || _then;
    }
    return bv;
}
//# sourceMappingURL=object.extensions.js.map