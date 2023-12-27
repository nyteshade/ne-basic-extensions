import { Patch } from '@nejs/extension';
/**
 * `ObjectExtensions` is a patch for the JavaScript built-in `Object` class. It
 * adds utility methods to the `Object` class without modifying the global namespace
 * directly. This patch includes methods for key validation, object type checking,
 * and retrieving the string tag of an object. These methods are useful for
 * enhancing the capabilities of the standard `Object` class with additional
 * utility functions.
 */
export const ObjectExtensions = new Patch(Object, {
    /**
     * Checks if the given value is a valid key for an object. In JavaScript, a valid
     * key can be either a string or a symbol. This method is useful for validating
     * object keys before using them in operations like setting or getting object properties.
     *
     * @param {*} value - The value to be checked.
     * @returns {boolean} - Returns `true` if the value is a valid object key (string or symbol),
     *                      otherwise `false`.
     */
    isValidKey(value) {
        return (typeof value === 'string' || typeof value === 'symbol');
    },
    /**
     * Determines if the provided value is an object. This method checks whether the
     * value is an instance of `Object` or if its type is 'object'. It's a utility
     * method for type-checking, ensuring that a value is an object before performing
     * operations that are specific to objects.
     *
     * @param {*} value - The value to be checked.
     * @returns {boolean} - Returns `true` if the value is an object, otherwise `false`.
     */
    isObject(value) {
        return value && (value instanceof Object || typeof value === 'object');
    },
    /**
     * Retrieves the string tag of an object. The string tag is a representation of
     * the object's type, as defined by its `Object.prototype.toString` method. This
     * utility method is helpful for getting a more descriptive type of an object than
     * what is returned by the `typeof` operator, especially for custom objects.
     *
     * @param {*} value - The object whose string tag is to be retrieved.
     * @returns {string} - The string tag of the object, indicating its type.
     */
    getStringTag(value) {
        return /(\w+)]/.exec(Object.prototype.toString.call(value))[1];
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
     * constructor corresponding to the string tag. Defaults to `globalThis`, which
     * covers global constructors like `Array`, `Object`, etc.
     * @returns {Function|object|null|undefined} - Returns the constructor or type
     * of the value based on its string tag. For 'Null' and 'Undefined', it returns
     * `null` and `undefined`, respectively. For other types, it returns the
     * corresponding constructor (e.g., `Array` for arrays) if available in the
     * `owner` object.
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
});
