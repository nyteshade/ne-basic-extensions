/** @typedef {string|symbol|number} PropertyKey */
/**
 * The `IsDescriptorStats` block contains all the information used to make
 * a determination as to whether a given value is a an instance of the type
 * {@link PropertyDescriptor} or at least compatible to used as one.
 *
 * @typedef {Object} IsDescriptorStats
 * @property {number} confidence this is going to be a number from 0.0-1.0
 * indicating the confidence ratio that the object supplied to `isDescriptor`
 * is actually a valid `PropertyDescriptor` object. If the number is greater
 * than 0 but less than 1.0, it likely indicates that the object can be used
 * as a `PropertyDescriptor` but one or more factors gives it less than 100%
 * confidence that being such is the objects intended purpose (e.g. it could
 * be that there are more properties than a descriptor might have or that
 * it is missing crucial properties such as `value`, `get` or `set`)
 * @property {boolean} isAccessor true if the object is functional as an
 * accessor descriptor; false otherwise
 * @property {boolean} isData true if the object is functional as a data
 * descriptor; false otherwise
 * @property {boolean} isValid true if the object is technically a valid
 * `PropertyDescriptor` object or compatible as one.
 * @property {boolean} hasBaseDescriptorKeys true if the object has either
 * `configurable` or `enumerable` property keys and both are `undefined` or
 * of type `boolean`.
 * @property {boolean} hasAccessorKeys true if the object has either `get`
 * or `set` property keys and both are either `undefined` or of type
 * `function`
 * @property {boolean} hasDataKeys true if the object has either `value` or
 * `writable` property keys and if `writable` is present, then it is of type
 * `boolean`
 */
/**
 * The response from a call to {@link DescriptorUtils.isDescriptor} can
 * be either a {@link boolean} or a {@link IsDescriptorStats} object.
 *
 * @typedef {IsDescriptorStats | boolean} IsDescriptorResponse
 */
/**
 * A set of utility functions work with {@link PropertyDescriptor} objects.
 * The creation of property descriptors can be large in boiler plate so
 * these tools can reduce the boiler plate and increase readability.
 *
 * @name DescriptorUtils
 * @typedef {DescriptorUtils}
 */
export const DescriptorUtils = {
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
        function accessor(get, set, optionsOrConfigurable = true, enumerable = true, storage, key = 'value', liaison) {
            const count = arguments.length;
            const storageKeys = ['storage', 'key', 'liaison', 'initial', 'bind'];
            const optionKeys = [
                // accessor functions
                'get', 'set',
                // descriptor flags
                'configurable', 'enumerable',
                // storage configuration keys
                ...storageKeys
            ];
            const has = (object, key) => isObject(object) && Reflect.has(object, key);
            const isOpts = object => optionKeys.some(key => has(object, key));
            let configurable = !!optionsOrConfigurable;
            let initial = undefined;
            let bind = false;
            let options = {};
            if (count === 1 && isObject(get) && hasSome(get, ...optionKeys)) {
                options = { ...get };
                ({ get, set } = get);
            }
            if (isObject(optionsOrConfigurable) || isObject(set)) {
                options = isObject(set) && count === 2
                    ? { ...set }
                    : { ...optionsOrConfigurable };
                ({ configurable, enumerable, storage, key, bind, initial } = options);
            }
            liaison = options?.liaison ?? liaison ?? ((storage, key) => ({
                get() {
                    if (storage instanceof Map)
                        return storage.get(key);
                    else if (isObject(storage))
                        return storage[key];
                },
                set(value) {
                    if (storage instanceof Map)
                        storage.set(key, value);
                    else if (isObject(storage))
                        storage[key] = value;
                }
            }));
            configurable = configurable ?? true;
            enumerable = enumerable ?? true;
            key = key ?? 'value';
            bind = bind ?? false;
            const nullish = (value) => value === null || value === undefined;
            const nonFn = (value) => !nullish(value) && typeof value !== 'function';
            const yesFn = (value) => typeof value === 'function';
            const zeroFn = (value) => (yesFn(value) && value.length === 0);
            const oneFn = (value) => (yesFn(value) && value.length === 1);
            const isTrue = (value) => value === true;
            const isFalse = (value) => value === false;
            const addRefs = (fn, value) => Object.defineProperties(fn, {
                storage: { value, configurable: true, enumerable: true },
                key: { value: key, configurable: true, enumerable: true },
            });
            if (count === 0 || (!get && !set)) {
                storage = { [key]: initial };
                const _ = liaison(storage, key);
                get = addRefs(function () { return _.get(); }, storage);
                set = addRefs(function (value) { _.set(value); }, storage);
                return { get, set, configurable, enumerable };
            }
            if (count === 1 && oneFn(get)) {
                set = false;
            }
            if ((count === 1 && nonFn(get)) || (isTrue(set) || isFalse(set))) {
                let skipSet = isFalse(set);
                storage = { [key]: get };
                const _ = liaison(storage, key);
                let _get = function () { return _.get(); };
                let _set = function (value) { _.set(value); };
                if (bind) {
                    _get = _get.bind(storage);
                    _set = _set.bind(storage);
                }
                get = addRefs(_get, storage);
                set = addRefs(_set, storage);
                if (skipSet) {
                    set = undefined;
                }
                return { get, set, configurable, enumerable };
            }
            if ((zeroFn(get) && !set) || (zeroFn(get) && oneFn(set))) {
                const descriptor = { get, set, configurable, enumerable };
                if (isObject(options) && Reflect.has(options, 'initial'))
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
                    enumerable,
                };
            }
            return { get, set, configurable, enumerable };
        }
        Object.defineProperty(accessor, 'keys', {
            get() { return ['get', 'set', 'configurable', 'enumerable']; },
            configurable: true,
            enumerable: true,
        });
        return accessor;
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
        function data(value, optionsOrWritable, configurable, enumerable) {
            if (arguments.length === 0) {
                return {
                    value: undefined,
                    writable: true,
                    configurable: true,
                    enumerable: true
                };
            }
            let writable = isObject(optionsOrWritable)
                ? !!optionsOrWritable // further defined below
                : true;
            let options = typeof optionsOrWritable === 'boolean'
                ? {}
                : optionsOrWritable;
            configurable = configurable ?? true;
            enumerable = enumerable ?? true;
            if (isObject(value) && hasSome(value, 'value')) {
                options = value;
                ({ value } = value);
            }
            if (isObject(optionsOrWritable)) {
                ({ writable, configurable, enumerable } = {
                    ...{ writable: true, configurable: true, enumerable: true, },
                    ...optionsOrWritable
                });
            }
            return { value, writable, configurable, enumerable };
        }
        Object.defineProperty(data, 'keys', {
            value: ['value', 'writable', 'configurable', 'enumerable'],
            writable: false,
            configurable: true,
            enumerable: true
        });
        return data;
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
        if (!value || typeof value !== 'object' || !(value instanceof Object))
            return false;
        const areBools = (...props) => props.flat().every(prop => boolTypes.includes(typeof value[prop]));
        const areFuncs = (...props) => props.flat().every(prop => funcTypes.includes(typeof value[prop]));
        const hasKeyFn = (property) => Reflect.has(value, property);
        const isOfType = (type) => (element) => typeof element === type;
        const baseProps = ['configurable', 'enumerable'];
        const dataProps = ['value', 'writable'];
        const accessorProps = ['get', 'set'];
        const anyDescProps = [...baseProps, ...dataProps, ...accessorProps];
        const boolTypes = ['undefined', 'boolean'];
        const funcTypes = ['undefined', 'function'];
        const stats = {
            confidence: 0,
            hasAccessorKeys: false,
            hasBaseDescriptorKeys: false,
            hasDataKeys: false,
            isAccessor: false,
            isData: false,
            isValid: false,
        };
        let score = 0;
        if (value && typeof value === 'object') {
            const objKeys = Reflect.ownKeys(value);
            const nonDescKeys = objKeys.filter(k => !(anyDescProps.includes(k)));
            if (strict && nonDescKeys.length)
                return false;
            if (objKeys.length <= 4)
                score++;
            stats.hasAccessorKeys =
                accessorProps.some(hasKeyFn) && areFuncs(accessorProps);
            stats.hasDataKeys =
                dataProps.some(hasKeyFn) && areBools('writable');
            stats.hasBaseDescriptorKeys =
                baseProps.some(hasKeyFn) && areBools(baseProps);
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
            if (stats.isValid && stats.isData && Reflect.has(value, 'value'))
                score++;
            else if (stats.isValid && stats.isAccessor) {
                if ([value?.get, value?.set].some(isOfType('function')))
                    score++;
            }
            if (stats.hasAccessorKeys && stats.hasDataKeys) {
                score = 0;
                stats.isValid = false;
            }
            stats.confidence = parseFloat(score / 4.0);
        }
        if (returnStats)
            return stats;
        return score >= 0.0
            ? true
            : false;
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
        return ['get', 'set'];
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
        return ['value', 'writable'];
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
        return ['configurable', 'enumerable'];
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
            ...(this.kAccessorDescriptorKeys),
            ...(this.kDataDescriptorKeys),
            ...(this.kSharedDescriptorKeys),
        ];
    }
};
// Destructure the functions individually...
const { accessor, data, isDescriptor } = DescriptorUtils;
// ...also destructure the constants individually....
const { kAccessorDescriptorKeys, kDataDescriptorKeys, kDescriptorKeys, kSharedDescriptorKeys } = DescriptorUtils;
// ... so they can also be individually exported.
export { accessor, data, isDescriptor, kAccessorDescriptorKeys, kDataDescriptorKeys, kDescriptorKeys, kSharedDescriptorKeys };
// Provide default exports as well
export default {
    DescriptorUtils,
    accessor,
    data,
    isDescriptor,
    kAccessorDescriptorKeys,
    kDataDescriptorKeys,
    kDescriptorKeys,
    kSharedDescriptorKeys
};
// ---- non-exported helper functions ----
function isObject(o) { return o && typeof o === 'object'; }
function hasSome(object, ...keys) { return hasQuantity('some', object, keys); }
function hasQuantity(quantityFn, object, keys) {
    return isObject(object) && (keys.flat(Infinity)
        .map(key => Reflect.has(object, key))[quantityFn](has => has));
}
function hasOne(object, ...keys) {
    return isObject(object) && (keys.flat(Infinity)
        .map(key => Reflect.has(object, key))
        .filter(has => has)
        .length === 1);
}
//# sourceMappingURL=descriptor.utils.js.map