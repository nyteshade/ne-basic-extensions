/**
 * `ArrayExtensions` is a constant that applies a patch to the global
 * `Array` constructor. This patch extends the `Array` with additional
 * methods and properties, enhancing its functionality.
 *
 * The `Patch` function takes two arguments: the target object to be patched
 * (in this case, `Array`), and an object containing the methods and
 * properties to be added to the target object.
 *
 * @example
 * // Using a method added by ArrayExtensions
 * const arr = [1, 2, 3];
 * console.log(Array.ifArray(arr, 'Array', 'Not Array')); // Output: 'Array'
 *
 * @const
 * @type {Patch}
 * @memberof module:array.extensions
 */
export const ArrayExtensions: Patch;
/**
 * `ArrayPrototypeExtensions` is a constant that applies a patch to the
 * Array prototype. This patch extends the Array prototype with additional
 * methods and properties, enhancing its functionality.
 *
 * The `Patch` function takes two arguments: the target object to be patched
 * (in this case, `Array.prototype`), and an object containing the methods
 * and properties to be added to the target object.
 *
 * @example
 * // Using a method added by ArrayPrototypeExtensions
 * const arr = [1, 2, 3];
 * console.log(arr.ifArray('Array', 'Not Array')); // Output: 'Array'
 *
 * @const
 * @type {Patch}
 * @memberof module:array.extensions
 */
export const ArrayPrototypeExtensions: Patch;
import { Patch } from '@nejs/extension';
