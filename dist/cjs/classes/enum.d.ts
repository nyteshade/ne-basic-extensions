/**
 * Creates an enumeration object with specified values and properties.
 *
 * @param {string} name - The name of the enumeration.
 * @param {Array|any} values - The values to be included in the enumeration.
 *   If not an array, it will be converted into a single-element array.
 * @param {Object|Map} [properties] - Additional properties to be added to
 *   the enumeration. Can be an object or a Map.
 * @returns {Object} The constructed enumeration object.
 *
 * @example
* const colors = Enum('Colors', ['red', 'green', 'blue'])
* console.log(colors.red) // EnumValue object for 'red'
*
* @description
* The `Enum` function constructs an enumeration object with a given name,
* values, and optional properties. It supports primitive types, arrays,
* and objects as values. The function uses a combination of `Object.create`
* and `Proxy` to define and manage the properties of the enumeration.
*
* The enumeration object includes:
* - A `toString` method that returns the enumeration name.
* - A `Symbol.toStringTag` for identifying the object as an 'Enum'.
* - A `Symbol.for('Enum.name')` for storing the enumeration name.
*
* For array values, it creates a maker function that returns an
* `EnumValue` object with properties like `real`, `value`, `type`,
* `name`, and `compare`.
*/
export function Enum(name: string, values: any[] | any, properties?: Object | Map<any, any> | undefined): Object;
export const EnumExtension: Extension;
import { Extension } from '@nejs/extension';
