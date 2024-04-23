import { Patch } from '@nejs/extension';
/**
 * `BigIntExtensions` is a patch for the JavaScript built-in `BigInt` class.
 * It adds utility methods to the `BigInt` class without modifying the global
 * namespace directly. This patch includes methods for checking if a value is
 * a `BigInt` and conditionally returning a value based on whether the supplied
 * value is a `BigInt` or not.
 *
 * @type {Patch}
 * @example
 * import { BigIntExtensions } from 'big.int.extension.js'
 *
 * BigIntExtensions.apply()
 * // Now the `BigInt` class has additional methods available
 */
export const BigIntExtensions = new Patch(BigInt, {
    /**
     * Determines if the supplied `value` is a `BigInt`. This check is
     * performed by first checking the `typeof` the `value` and then
     * checking to see if the `value` is an `instanceof` `BigInt`
     *
     * @param {*} value The value that needs to be checked to determine
     * if it is a `BigInt` or not
     * @returns {boolean} `true` if the supplied `value` is a `BigInt`,
     * `false` otherwise
     *
     * @example
     * const bigInt = 1234567890123456789012345678901234567890n
     * isBigInt(bigInt) // true
     * isBigInt(1234567890123456789012345678901234567890) // false
     * isBigInt('1234567890123456789012345678901234567890') // false
     * isBigInt(BigInt('1234567890123456789012345678901234567890')) // true
     */
    isBigInt(value) {
        return typeof value === 'bigint' || value instanceof BigInt;
    },
    /**
     * Conditionally returns a value based on whether the supplied
     * `value` is a `BigInt` or not. If the `value` is a `BigInt`,
     * the `thenValue` will be returned. If it is not a `BigInt`,
     * the `elseValue` will be returned instead.
     *
     * @param {any} value The value to check to determine if it is a
     * `BigInt`
     * @param {any} thenValue The value to return if the supplied
     * `value` is a `BigInt`
     * @param {any} elseValue The value to return if the supplied
     * `value` is not a `BigInt`
     * @returns {any} Either the `thenValue` or `elseValue` depending
     * on if the supplied `value` is a `BigInt`
     *
     * @example
     * const bigInt = 1234567890123456789012345678901234567890n
     * const num = 42
     * ifBigInt(bigInt, 'is a BigInt', 'not a BigInt')
     * // 'is a BigInt'
     * ifBigInt(num, 'is a BigInt', 'not a BigInt')
     * // 'not a BigInt'
     */
    ifBigInt(value, thenValue, elseValue) {
        return isThenElse(this.isBigInt(value), thenValue, elseValue);
    },
});
const { isBigInt: pIsBigInt, ifBigInt: pIfBigInt } = BigIntExtensions.patches;
/**
 * `BigIntPrototypeExtensions` is a patch for the JavaScript built-in
 * `BigInt.prototype`. It adds utility methods to the `BigInt` prototype
 * without modifying the global namespace directly. This patch includes
 * methods for checking if a value is a BigInt and conditionally returning
 * a value based on whether the supplied value is a BigInt or not.
 *
 * @type {Patch}
 * @example
 * import { BigIntPrototypeExtensions } from 'big.int.extension.js'
 *
 * BigIntPrototypeExtensions.apply()
 * // Now the `BigInt` prototype has additional methods available
 */
export const BigIntPrototypeExtensions = new Patch(BigInt.prototype, {
    /**
     * A getter method that returns an object representation of the BigInt
     * instance.
     *
     * This method wraps the BigInt instance in an object, allowing it to be
     * treated as an object. The returned object is created using the `Object()`
     * constructor, which takes the BigInt instance as its argument.
     *
     * @type {Object}
     * @readonly
     *
     * @example
     * const bigInt = 1234567890123456789012345678901234567890n
     * console.log(typeof bigInt)           // 'bigint'
     * console.log(typeof bigInt.instance)  // 'object'
     */
    get instance() {
        return Object(this);
    },
    /**
     * A getter method that checks if the current instance is a BigInt.
     *
     * This method uses the `pIsBigInt` function from the `BigIntExtensions`
     * patch to determine if the current instance (`this`) is a BigInt.
     *
     * @type {boolean}
     * @readonly
     *
     * @example
     * const bigInt = 1234567890123456789012345678901234567890n
     * console.log(bigInt.isBigInt) // Output: true
     *
     * const notBigInt = 42
     * console.log(notBigInt.isBigInt) // Output: false
     */
    get isBigInt() {
        return pIsBigInt(this);
    },
    /**
     * Checks if the current object is a BigInt and returns the corresponding
     * value based on the result.
     *
     * This method uses the `pIfBigInt` function from the `BigIntExtensions`
     * patch to determine if the current object (`this`) is a BigInt. If it is
     * a BigInt, the `thenValue` is returned. Otherwise, the `elseValue` is
     * returned.
     *
     * @param {any} thenValue - The value to return if the current object
     * is a BigInt.
     * @param {any} elseValue - The value to return if the current object
     * is not a BigInt.
     * @returns {any} The `thenValue` if the current object is a BigInt, or
     * the `elseValue` if it is not a BigInt.
     *
     * @example
     * const bigInt = 1234567890123456789012345678901234567890n
     * // 'Is a BigInt'
     * console.log(bigInt.ifBigInt('Is a BigInt', 'Not a BigInt'))
     *
     * const notBigInt = 42
     * // 'Not a BigInt'
     * console.log(notBigInt.ifBigInt('Is a BigInt', 'Not a BigInt'))
     */
    ifBigInt(thenValue, elseValue) {
        return pIfBigInt(this, thenValue, elseValue);
    },
});
// NOTE to self; this is repeated here otherwise a circular reference from
// Object<->Function<->Global occurs. See original source in global.this.js
// {@see globalThis.isThenElse}
function isThenElse(bv, tv, ev) {
    if (arguments.length > 1) {
        var _then = isFunction(tv) ? tv(bv) : tv;
        if (arguments.length > 2) {
            var _else = isFunction(ev) ? tv(bv) : ev;
            return bv ? _then : _else;
        }
        return bv || _then;
    }
    return bv;
}
//# sourceMappingURL=big.int.extension.js.map