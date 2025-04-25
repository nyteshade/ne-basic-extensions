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
export function Enum(name: string, values: any[] | any, properties?: Object | Map<any, any>): Object;
/**
 * Creates a base enumeration object with predefined properties and
 * symbols. This function is used to initialize an enumeration with
 * specific characteristics, such as a name and various symbolic
 * properties that enhance its functionality and identification.
 *
 * @param {string} name - The name of the enumeration. This name is
 *   used to identify the enumeration and is stored as a symbol on
 *   the object.
 * @returns {Object} A new enumeration object with specific properties
 *   and symbols set for enhanced functionality and identification.
 *
 * @example
 * // Create a base enum with the name 'Color'
 * const colorEnum = makeBaseEnum('Color')
 * console.log(colorEnum[Symbol.for('Enum.name')]) // Outputs: 'Color'
 */
export function makeBaseEnum(name: string): Object;
export const EnumExtension: Extension;
import { Extension } from '@nejs/extension';
