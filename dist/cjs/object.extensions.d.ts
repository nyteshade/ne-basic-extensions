/**
 * Creates a deep or shallow copy of the provided source objects and merges
 * them into the destination object. The function uses a Set to keep track
 * of visited objects to avoid circular references.
 *
 * @function
 * @name copyObject
 * @param {boolean} deep - If true, performs a deep copy, otherwise performs
 * a shallow copy.
 * @param {object} destination - The object to which properties will be copied.
 * @param {...object} sources - The source object(s) from which properties
 * will be copied.
 * @returns {object} The destination object with the copied properties.
 *
 * @example
 * // Shallow copy
 * const obj1 = { a: 1, b: { c: 2 } };
 * const obj2 = { b: { d: 3 }, e: 4 };
 * const result = copyObject(false, obj1, obj2);
 * console.log(result); // Output: { a: 1, b: { d: 3 }, e: 4 }
 *
 * @example
 * // Deep copy
 * const obj1 = { a: 1, b: { c: 2 } };
 * const obj2 = { b: { d: 3 }, e: 4 };
 * const result = copyObject(true, obj1, obj2);
 * console.log(result); // Output: { a: 1, b: { c: 2, d: 3 }, e: 4 }
 */
export function copyObject(deep: boolean, destination: object, ...sources: object[]): object;
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
