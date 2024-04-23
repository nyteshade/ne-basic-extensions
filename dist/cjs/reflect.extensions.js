"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectExtensions = void 0;
const extension_1 = require("@nejs/extension");
/**
 * The `ReflectExtensions` class is a patch applied to the built-in JavaScript
 * `Reflect` object. It extends `Reflect` with additional utility methods that
 * enhance its capabilities. These methods provide more advanced ways of
 * interacting with object properties, such as checking for the presence of
 * multiple keys at once (`hasAll`) or verifying if at least one specified key
 * exists in an object (`hasSome`). This class is part of the `@nejs/extension`
 * library and is designed to offer these extended functionalities in a way
 * that is consistent with the existing `Reflect` API, making it intuitive for
 * developers who are already familiar with standard reflection methods in
 * JavaScript.
 */
exports.ReflectExtensions = new extension_1.Patch(Reflect, {
    /**
     * The function checks if an object has all the specified keys.
     *
     * @param object - The `object` parameter is the object that we want to
     * check if it has all the specified keys.
     * @param keys - The `keys` parameter is a rest parameter, which means
     * it can accept any number of arguments. In this case, it is expected
     * to receive multiple keys as arguments.
     * @returns a boolean value.
     */
    hasAll(object, ...keys) {
        return Object.isObject(object) && (keys.flat(Infinity)
            .map(key => Reflect.has(object, key))
            .every(has => has));
    },
    /**
     * The function checks if an object has at least one of the specified keys.
     *
     * @param object - The `object` parameter is the object that we want to check
     * for the presence of certain keys.
     * @param keys - The `keys` parameter is a rest parameter, which means it can
     * accept any number of arguments. These arguments are the keys that we want
     * to check if they exist in the `object`.
     * @returns The function `hasSome` returns a boolean value indicating whether
     * at least one of the keys provided as arguments exists in the given object.
     */
    hasSome(object, ...keys) {
        return isObject(object) && (keys.flat(Infinity)
            .map(key => Reflect.has(object, key))
            .some(has => has));
    },
    /**
     * The `metadata` method retrieves metadata about a property of an object.
     * It returns an object containing information about the property, such as
     * its value, descriptor, and whether it is read-only, assignable, an
     * accessor, or a data descriptor.
     *
     * @param {string} key - The name of the property.
     * @param {object} [owner=globalThis] - The object that owns the property.
     * If not provided, it defaults to the global object.
     * @returns {object|undefined} An object containing metadata about the
     * property, or `undefined` if the property does not exist or the owner is
     * not an object.
     *
     * @example
     * const obj = { foo: 'bar' }
     * const meta = ReflectExtensions.metadata('foo', obj)
     * console.log(meta.value) // Outputs: 'bar'
     * console.log(meta.isReadOnly) // Outputs: false
     */
    metadata(key, owner = globalThis) {
        const args = [{ key }, { owner }];
        const variants = applyVariants(args)();
        if (variants.check(0)) {
            key = variants.object.key;
            owner = variants.object.owner;
        }
        const descriptor = isObject(owner) && isValidKey(key)
            ? Object.getOwnPropertyDescriptor(owner, key)
            : undefined;
        const value = () => descriptor?.get?.bind(owner)?.() ?? owner[key];
        if (!descriptor) {
            return undefined;
        }
        const meta = {
            /**
             * A getter method that returns the owner of the property.
             * The owner is the object that owns the property.
             *
             * @returns {object} The owner of the property.
             *
             * @example
             * const obj = { foo: 'bar' }
             * const meta = Reflect.metadata('foo', obj)
             * console.log(meta.owner) // Outputs: obj
             */
            get owner() { return owner; },
            /**
             * A getter method that returns the key of the property.
             * The key is the name of the property.
             *
             * @returns {string} The key of the property.
             *
             * @example
             * const obj = { foo: 'bar' }
             * const meta = Reflect.metadata('foo', obj)
             * console.log(meta.key) // Outputs: 'foo'
             */
            get key() { return key; },
            /**
             * A getter method that returns the value of the property.
             * The value is obtained by invoking the `value` function.
             *
             * @returns {*} The value of the property.
             *
             * @example
             * const obj = { foo: 'bar' }
             * const meta = Reflect.metadata('foo', obj)
             * console.log(meta.value) // Outputs: 'bar'
             */
            get value() { return value(); },
            /**
             * A getter method that returns the descriptor of the property.
             * The descriptor is an object that describes a property's configuration.
             * It includes properties like value, writable, enumerable, configurable,
             * get, and set.
             *
             * @returns {object} The descriptor of the property.
             *
             * @example
             * const obj = { foo: 'bar' }
             * const meta = Reflect.metadata('foo', obj)
             * console.log(meta.descriptor)
             *
             * // Outputs: {
             * //   value: 'bar',
             * //   writable: true,
             * //   enumerable: true,
             * //   configurable: true
             * // }
             */
            get descriptor() { return descriptor; },
            /**
             * A getter method that checks if the property is read-only.
             * A property is considered read-only if it is an accessor property
             * (i.e., it has a getter or a setter) and it does not have a setter.
             * This means that the property can be read, but not written to.
             *
             * @returns {boolean} `true` if the property is read-only,
             * `false` otherwise.
             *
             * @example
             * const obj = {
             *   get foo() { return 'bar' }
             * }
             * const meta = Reflect.metadata('foo', obj)
             * console.log(meta.isReadOnly) // Outputs: true
             */
            get isReadOnly() {
                return this.isAccessor && !descriptor?.set;
            },
            /**
             * A getter method that checks if the property is assignable.
             * A property is considered assignable if it is either configurable
             * or writable. Configurable properties can be modified and deleted,
             * while writable properties can have their values changed.
             *
             * @returns {boolean} `true` if the property is assignable,
             * `false` otherwise.
             *
             * @example
             * const obj = { foo: 'bar' }
             * const meta = Reflect.metadata('foo', obj)
             * console.log(meta.isAssignable) // Outputs: true
             */
            get isAssignable() {
                return descriptor?.configurable ?? descriptor?.writable;
            },
            /**
             * A getter method that checks if the property is an accessor.
             * An accessor property is a property that has a getter method, a setter
             * method, or both. This method returns `true` if the property has either
             * a getter or a setter, and `false` otherwise.
             *
             * @returns {boolean} `true` if the property is an accessor,
             * `false` otherwise.
             *
             * @example
             * const obj = {
             *   get foo() { return 'bar' },
             *   set foo(value) { console.log('Setting foo to', value) }
             * }
             * const meta = Reflect.metadata('foo', obj)
             * console.log(meta.isAccessor) // Outputs: true
             */
            get isAccessor() {
                return !!(this?.descriptor?.get || this?.descriptor?.set);
            },
            /**
             * A getter method that checks if the property is a data property.
             * A data property is a property that has a value and can be written to.
             * This method returns `true` if the property has a value or is writable,
             * and `false` otherwise.
             *
             * @returns {boolean} `true` if the property is a data property,
             * `false` otherwise.
             *
             * @example
             * const obj = { foo: 'bar' }
             * const meta = Reflect.metadata('foo', obj)
             * console.log(meta.isData) // Outputs: true
             */
            get isData() {
                return !!(this?.descriptor?.value || this?.descriptor?.writable);
            },
        };
        return meta;
    },
    /**
     * Fetches all descriptors of an object, including those mapped to a
     * symbol descriptor value.
     *
     * @param {object} object the object from whose descriptors need to be
     * retrieved.
     * @returns {object} with keys mapped to object descriptors
     * @throws {TypeError} if the supplied `object` is null or not an object
     * a TypeError exception will be thrown
     */
    ownDescriptors(object) {
        if (!isObject(object)) {
            throw new TypeError('The supplied object must be non-null and an object');
        }
        const result = {};
        const keys = Reflect.ownKeys(object);
        for (const key of keys) {
            result[key] = Object.getOwnPropertyDescriptor(key);
        }
        return result;
    },
    /**
     * Retrieves an array of [key, descriptor] pairs for each property of the
     * provided object. This method is akin to `Object.entries` but includes
     * property descriptors instead of the property values. It's useful for cases
     * where you need detailed information about properties, including their
     * configurability, enumerability, and accessors.
     *
     * @param {object} object - The object whose property entries are to be
     * retrieved.
     * @returns {Array} An array of [key, descriptor] pairs, where each pair
     * consists of the property name (key) and its descriptor. Returns an empty
     * array if the input is not a valid object.
     */
    entries(object) {
        if (!object || typeof object !== 'object') {
            return [];
        }
        return Reflect.ownKeys(object).map(key => [
            key, Object.getOwnPropertyDescriptor(object, key)
        ]);
    },
    /**
     * Retrieves an array of values from the property descriptors of the given
     * object. This method works similarly to `Object.values` but operates on
     * property descriptors instead. It's useful when you need the values of
     * properties including getters, setters, and other descriptor-specific
     * attributes.
     *
     * @param {object} object - The object whose property values are to be
     * retrieved.
     * @returns {Array} An array of values extracted from the object's property
     * descriptors. The values correspond to the `value` attribute in each
     * property's descriptor. Returns an empty array if the input is not a valid
     * object.
     */
    values(object) {
        return Reflect.entries.map(([, value]) => value);
    },
});
function isObject(value) {
    return value && typeof value === 'object';
}
function isValidKey(value) {
    return ['string', 'symbol'].some(type => typeof value === type);
}
function applyVariants(thisArg) {
    return ((function variants() {
        const keys = this.map(o => Object.keys(o)?.[0]);
        const entries = this.map(o => Object.entries(o)?.[0]);
        const object = entries.reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
        const result = {
            order: keys,
            entries: entries,
            object: object,
        };
        Object.defineProperty(result, 'check', {
            value(position) {
                if (typeof position !== 'number' &&
                    position >= 0 &&
                    position < this.order.length) {
                    return false;
                }
                const value = this.entries[position][1];
                if (typeof value === 'object' && value) {
                    if (Object.keys(value).every(key => ~this.order.indexOf(key))) {
                        return true;
                    }
                }
                return false;
            },
            enumerable: false,
            configurable: true
        });
        return result;
    }).bind(thisArg));
}
//# sourceMappingURL=reflect.extensions.js.map