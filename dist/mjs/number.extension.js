import { Patch } from '@nejs/extension';
/**
 * A patch for the JavaScript built-in `Number` class that adds utility
 * methods without modifying the global namespace directly
 *
 * This patch includes methods for checking if a value is a number and
 * conditionally returning a value based on whether the supplied value is
 * a number or not.
 *
 * @type {Patch}
 * @property {Object} [Patch.kMutablyHidden] An object containing methods
 * that are hidden from enumeration and mutation
 *
 * @example
 * import { NumberExtensions } from 'number.extension.js'
 *
 * NumberExtensions.apply()
 * // Now the `Number` class has additional methods available
 */
export const NumberExtensions = new Patch(Number, {
    [Patch.kMutablyHidden]: {
        /**
         * Determines if the supplied `value` is a `Number`. This check is
         * performed by first converting the `value` to a `Number` using the
         * `Number()` constructor and checking to see if the result is not
         * `NaN`. If that check passes, `typeof` is used to ensure that the
         * original `value` is of type "number".
         *
         * @param {*} value The value that needs to be checked to determine if it
         * is a `Number` or not
         * @returns {boolean} `true` if the supplied `value` is a `Number`,
         * `false` otherwise
         *
         * @example
         * const num = 42
         * isNumber(num) // true
         * isNumber('42') // false
         * isNumber(NaN) // false
         * isNumber(Infinity) // true
         */
        isNumber(value) {
            return !isNaN(value) && typeof value === 'number';
        },
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
        areNumbers(which = ['every', 'some'][0], ...values) {
            if (which !== 'every' && which !== 'some') {
                return false;
            }
            return values[which](num => this.isNumber(num));
        },
        /**
         * Conditionally returns a value based on whether the supplied `value` is
         * a `Number` or not. If the `value` is a `Number`, the `thenValue` will
         * be returned. If it is not a `Number`, the `elseValue` will be
         * returned instead.
         *
         * @param {*} value The value to check to determine if it is a `Number`
         * @param {*} thenValue The value to return if the supplied `value` is
         * a `Number`
         * @param {*} elseValue The value to return if the supplied `value` is
         * not a `Number`
         * @returns {*} Either the `thenValue` or `elseValue` depending on if the
         * supplied `value` is a `Number`
         *
         * @example
         * const num = 42
         * const str = 'hello'
         * ifNumber(num, 'is a number', 'not a number') // 'is a number'
         * ifNumber(str, 'is a number', 'not a number') // 'not a number'
         */
        ifNumber(value, thenValue, elseValue) {
            return isThenElse(this.isNumber(value), thenValue, elseValue);
        },
        /**
         * Conditionally returns a value based on whether all or some of the
         * supplied values are numbers.
         *
         * This method uses the `areNumbers` method to check if all or some of
         * the supplied values are numbers, based on the `which` parameter.
         * If the condition is met, the `thenValue` is returned, otherwise
         * the `elseValue` is returned.
         *
         * @param {*} thenValue - The value to return if the condition is met.
         * @param {*} elseValue - The value to return if the condition is not met.
         * @param {string} [which='every'] - Determines the method to use for the
         * check. Can be either 'every' or 'some'. Defaults to 'every'.
         * @param {...*} numbers - The values to check.
         * @returns {*} Either the `thenValue` or `elseValue` depending on if all
         * or some of the supplied values are numbers.
         *
         * @example
         * ifNumbers('All are numbers', 'Not all are numbers', 'every', 1, 2, 3)
         * // returns 'All are numbers'
         * ifNumbers('At least one is a number', 'None are numbers', 'some', 1, '2', 3)
         * // returns 'At least one is a number'
         * ifNumbers('All are numbers', 'Not all are numbers', 'every', 1, '2', 3)
         * // returns 'Not all are numbers'
         */
        ifNumbers(thenValue, elseValue, which = ['every', 'some'][0], ...numbers) {
            return isThenElse(this.areNumbers(which, ...numbers), thenValue, elseValue);
        },
        /**
         * Clamps a value between a minimum and maximum value.
         *
         * This method checks if the provided value and the min and max bounds are
         * numbers. If they are not, it returns the original value. If they are,
         * it ensures that the value does not go below the minimum value or above
         * the maximum value.
         *
         * @param {*} value - The value to clamp.
         * @param {number} [minValue=-Infinity] - The minimum value. Defaults
         * to -Infinity.
         * @param {number} [maxValue=Infinity] - The maximum value. Defaults
         * to Infinity.
         * @returns {*} - Returns the clamped value if all parameters are numbers,
         * otherwise returns the original value.
         *
         * @example
         * clamp(10, 1, 5) // returns 5
         * clamp(-10, 1, 5) // returns 1
         * clamp(3, 1, 5) // returns 3
         * clamp('10', 1, 5) // returns '10'
         */
        clamp(value, minValue = -Infinity, maxValue = Infinity) {
            if (!this.areNumbers('every', value, minValue, maxValue)) {
                return value;
            }
            return Math.max(minValue, Math.min(maxValue, value));
        },
    }
});
const { isNumber: pIsNumber, ifNumber: pIfNumber } = NumberExtensions.patches;
/**
 * `NumberPrototypeExtensions` provides a set of utility methods that
 * are added to the `Number` prototype. This allows all number instances
 * to access new functionality directly, enhancing their capabilities
 * beyond the standard `Number` class methods.
 *
 * These extensions are applied using the `Patch` class from
 * '@nejs/extension', ensuring that they do not interfere with the
 * global namespace or existing properties.
 *
 * The extensions include methods for checking if a value is a number,
 * conditionally returning values based on whether a value is a number,
 * and more, making number-related tasks more convenient and expressive.
 *
 * @example
 * const num = 42
 * console.log(num.isNumber) // Output: true
 *
 * const notNum = "123"
 * console.log(notNum.isNumber) // Output: false
 *
 * @type {Patch}
 */
export const NumberPrototypeExtensions = new Patch(Number.prototype, {
    [Patch.kMutablyHidden]: {
        /**
         * Returns an object representation of the number instance.
         *
         * This getter method creates and returns an object that wraps the number
         * instance, allowing it to be treated as an object. The returned object
         * is created using the `Object()` constructor, which takes the number
         * instance as its argument.
         *
         * @type {Object}
         * @readonly
         *
         * @example
         * const num = 42
         * console.log(typeof num)           // 'number'
         * console.log(typeof num.instance)  // 'object'
         */
        get instance() {
            return Object(this);
        },
        /**
         * Determines if the current object is a number
         *
         * This getter uses the `pIsNumber` function from the `NumberExtensions`
         * patch to check if the current object (`this`) is a number.
         *
         * @type {boolean}
         * @readonly
         *
         * @example
         * const num = 42
         * console.log(num.isNumber) // Output: true
         *
         * const notNum = "123"
         * console.log(notNum.isNumber) // Output: false
         */
        get isNumber() {
            return pIsNumber(this);
        },
        /**
         * Checks if the current object is a number and returns the corresponding
         * value based on the result.
         *
         * This method uses the `pIfNumber` function from the `NumberExtensions`
         * patch to determine if the current object (`this`) is a number. If it is
         * a number, the `thenValue` is returned. Otherwise, the `elseValue` is
         * returned.
         *
         * @param {any} thenValue The value to return if the current object is
         * a number
         * @param {any} elseValue The value to return if the current object is not
         * a number
         * @returns {any} The `thenValue` if the current object is a number, or
         * the `elseValue` if it is not a number
         *
         * @example
         * const num = 42
         * console.log(num.ifNumber('Is a number', 'Not a number'))
         * // Output: 'Is a number'
         *
         * const notNum = '123'
         * console.log(notNum.ifNumber('Is a number', 'Not a number'))
         * // Output: 'Not a number'
         */
        ifNumber(thenValue, elseValue) {
            return pIfNumber(this, thenValue, elseValue);
        },
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
//# sourceMappingURL=number.extension.js.map