"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigIntPrototypeExtensions = exports.BigIntExtensions = void 0;
const extension_1 = require("@nejs/extension");
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
exports.BigIntExtensions = new extension_1.Patch(BigInt, {
    [extension_1.Patch.kMutablyHidden]: {
        /**
         * Checks if all or some of the supplied values are numbers.
         *
         * This method uses the `Array.prototype.every` or `Array.prototype.some`
         * method to check if all or some of the supplied values are numbers,
         * respectively. The method to use is determined by the `which` parameter.
         *
         * @param {string} [which='every'] - Determines the method to use for the
         * check. Can be either 'every' or 'some'. Defaults to 'every'.
         * @param {...*} values - The values to check.
         * @returns {boolean} - Returns `true` if all or some of the values are
         * numbers (based on the `which` parameter), `false` otherwise.
         *
         * @example
         * areNumbers('every', 1, 2, 3) // true
         * areNumbers('some', 1, '2', 3) // true
         * areNumbers('every', 1, '2', 3) // false
         */
        areBigInts(which = ['every', 'some'][0], ...values) {
            if (which !== 'every' && which !== 'some') {
                return false;
            }
            return values[which](num => this.isBigInt(num));
        },
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
        /**
         * The Math.min() static method returns the smallest of the numbers given
         * as input parameters, or Infinity if there are no parameters.
         *
         * @param {bigint|number} values value1, …, valueN – Zero or more numbers
         * among which the lowest value will be selected and returned.
         * @returns {bigint|number|Infinity} The smallest of the given numbers.
         * Returns Infinity if no parameters are provided.
         */
        min(...values) {
            const sorter = (l, r) => l < r ? -1 : l > r ? 1 : 0;
            if (!values.length)
                return Infinity;
            if (values.every(n => typeof n === 'bigint')) {
                return values.toSorted(sorter).at(0);
            }
            else {
                throw new TypeError('All supplied values must be of type bigint');
            }
        },
        /**
         * The Math.max() static method returns the largest of the numbers given
         * as input parameters, or Infinity if there are no parameters.
         *
         * @param {bigint|number} values value1, …, valueN – Zero or more numbers
         * among which the largest value will be selected and returned.
         * @returns {bigint|number|Infinity} The largest of the given numbers.
         * Returns Infinity if no parameters are provided.
         */
        max(...values) {
            const sorter = (l, r) => l < r ? -1 : l > r ? 1 : 0;
            if (!values.length)
                return Infinity;
            if (values.every(n => typeof n === 'bigint')) {
                return values.toSorted(sorter).at(-1);
            }
            else {
                throw new TypeError('All supplied values must be of type bigint');
            }
        },
    },
});
const { isBigInt: pIsBigInt, ifBigInt: pIfBigInt } = exports.BigIntExtensions.patches;
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
exports.BigIntPrototypeExtensions = new extension_1.Patch(BigInt.prototype, {
    /**
     * Clamps a value between a minimum and maximum value.
     *
     * This method checks if the provided value and the min and max bounds are
     * numbers. If they are not, it returns the original value. If they are,
     * it ensures that the value does not go below the minimum value or above
     * the maximum value.
     *
     * @param {bigint} [minValue=BigInt(-Number.MAX_VALUE)] - The minimum value.
     * Defaults to BigInt(-Number.MAX_VALUE).
     * @param {bigint} [maxValue=BigInt(Number.MAX_VALUE)] - The maximum value.
     * Defaults to BigInt(Number.MAX_VALUE).
     * @returns {bigint} - Returns the clamped value if all parameters are
     * big integers.
     *
     * @example
     * (10n).clamp(1n, 5n) // returns 5n
     * (-10n).clamp(1n, 5n) // returns 1n
     * (3n).clamp(1n, 5n) // returns 3n
     */
    clamp(minValue = BigInt(-Number.MAX_VALUE), maxValue = BigInt(Number.MAX_VALUE)) {
        if (typeof minValue !== 'bigint' || typeof maxValue !== 'bigint')
            throw new TypeError('All values must be big integers');
        return BigInt.max(minValue, BigInt.min(maxValue, this));
    },
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
    /**
     * Provides a way when dealing with numbers to determine if
     * a given number is within a range of values. By default, if
     * no parameters are supplied, it always returns true since
     * the default range is -Infinity to +Infinity. Additionally,
     * by default, the number will always be less than the supplied
     * max unless inclusive is set to true.
     *
     * @param min the lower range value, defaults to -Infinity
     * @param max the upper range value, defaults to +Infinity
     * @param inclusive defaults to false, set to true if you
     * want the max value to less than and equals to
     * @returns {boolean} true if within the range, false otherwise
     */
    within(min = BigInt(-Infinity), max = BigInt(Infinity), inclusive = false) {
        return this >= min && (inclusive ? this <= max : this < max);
    }
});
// NOTE to self; this is repeated here otherwise a circular reference from
// Object<->Function<->Global occurs. See original source in global.this.js
// {@see globalThis.isThenElse}
function isThenElse(bv, tv, ev) {
    function isFunction(value) { typeof value === 'function'; }
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