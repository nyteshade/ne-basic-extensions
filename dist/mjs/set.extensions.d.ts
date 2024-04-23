/**
 * `SetExtensions` is a constant that applies a patch to the global
 * `Set` constructor. This patch extends the `Set` with additional
 * methods and properties, enhancing its functionality.
 *
 * The `Patch` function takes two arguments: the target object to be patched
 * (in this case, `Set`), and an object containing the methods and
 * properties to be added to the target object.
 *
 * @example
 * // Using a method added by SetExtensions
 * const set = new Set();
 * console.log(Set.isSet(set)); // Output: true
 *
 * @const
 * @type {Patch}
 * @memberof module:set.extensions
 */
export const SetExtensions: Patch;
/**
 * `SetPrototypeExtensions` is a constant that applies a patch to the
 * prototype of the built-in JavaScript `Set` object. This patch extends the
 * `Set` prototype with additional methods and properties, enhancing its
 * functionality.
 *
 * The `Patch` function takes two arguments: the target object to be patched
 * (in this case, `Set.prototype`), and an object containing the methods and
 * properties to be added to the target object.
 *
 * @example
 * // Using a method added by SetPrototypeExtensions
 * const mySet = new Set();
 * mySet.myNewMethod(); // Calls the new method added by the patch
 *
 * @const
 * @type {Patch}
 * @memberof module:set.extensions
 */
export const SetPrototypeExtensions: Patch;
import { Patch } from '@nejs/extension';
