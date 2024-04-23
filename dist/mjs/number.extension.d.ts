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
export const NumberExtensions: Patch;
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
export const NumberPrototypeExtensions: Patch;
import { Patch } from '@nejs/extension';
