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
export const ObjectExtensions: Patch;
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
export const ObjectPrototypeExtensions: Patch;
import { Patch } from '@nejs/extension';
