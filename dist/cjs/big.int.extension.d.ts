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
export const BigIntExtensions: Patch;
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
export const BigIntPrototypeExtensions: Patch;
import { Patch } from '@nejs/extension';
