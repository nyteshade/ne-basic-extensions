import { Extension } from '@nejs/extension';
import { accessor, as, data, isDescriptor, redescribe } from '../utils/index.js';
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
export function Enum(name, values, properties) {
    const enumeration = makeBaseEnum(name);
    if (!Array.isArray(values)) {
        values = [values];
    }
    /**
    * A new base `EnumValue` type object. It contains enough custom symbols and
    * identifiers to allow things like a `compare(to)` function to also work on
    * each of the elements. Thing of this as the shared base functionality for
    * each `Enum` element.
    *
    * @param {any} enumValue the value around which an `EnumValue` type is
    * created.
    * @returns an object defined by {@link Symbol.toStringTag} as well as some
    * custom {@link Symbol} keys. The `node.js` custom inspect symbol is also
    * defined for better REPL representation.
    */
    const makeEnumValue = (property, enumValue) => ({
        toString: data(() => enumValue, false, true, false),
        [Symbol.for('Enum.name')]: data(name, false, true, false),
        [Symbol.for('Enum.is')]: data(true, false, false, false),
        [Symbol.for('nodejs.util.inspect.custom')]: data(function (depth, options, inspect) {
            const _options = { ...(options || {}), colors: true };
            const _skip = this.value === Symbol.for('Enum.NonAssociatedValue');
            const _value = _skip
                ? ''
                : ` { value: ${inspect(this.value, _options)} }`;
            return `${property}${_value}`;
        }, false, true, false),
        [Symbol.toStringTag]: accessor('EnumValue', false, true, false),
        [Symbol.for('compare')]: data(function compareValue(to) {
            const toObj = (to && typeof to === 'object') ? to : { real: to };
            const kName = Symbol.for('Enum.name');
            const hasAndIs = o => (Reflect.has(o, Symbol.for('Enum.is')) && o[Symbol.for('Enum.is')]);
            const isLEnum = hasAndIs(this);
            const isREnum = hasAndIs(toObj);
            if (!isLEnum || !isREnum)
                return false;
            const { real: lReal, value: lValue, name: lName, type: lType } = this;
            const { real: rReal, value: rValue, name: rName, type: rType } = toObj;
            return (lName === rName && lType === rType &&
                lReal === rReal && lValue === rValue);
        }, false, true, false),
        [Symbol.toPrimitive]: data(function EnumValueToPrimitive(hint) {
            const original = this.real;
            const type = typeof original;
            switch (hint) {
                case 'string':
                    if ('string' === type)
                        return original;
                    else
                        return String(original);
                case 'number':
                    if ('number' === type)
                        return original;
                    else
                        return NaN;
                case 'bigint':
                    if ('bigint' === type)
                        return original;
                    else
                        return NaN;
                default:
                    return original;
            }
        }, false, true, false),
    });
    /**
    * Given a value, determine how to represent it as both a key and a response
    * or underlying original value. The method for this is dependent on the type
    * of the value itself.
    *
    * @param {any} value the value to be converted
    * @returns {[string, any]} an array where the first value is the transformed
    * value as a key and the second element is the originally supplied value.
    */
    const fromPrimitive = (value) => {
        let valueType = typeof value;
        switch (valueType) {
            case 'string':
            case 'number':
            case 'bigint':
            case 'boolean':
            default:
                return [String(value), value];
            case 'symbol':
                return [value.description, value];
            case 'function':
                return [value.name, value];
            case 'object': {
                const str = asString(value);
                return [str, str];
            }
        }
    };
    // Determine the keys that the final proxy should be aware of when computing
    // the enumeration value itself.
    const kValueProps = ['real', 'value', 'type', 'name', 'compare', 'isEnum'];
    const kCustomPropKeys = [];
    // Capture and calculate any custom properties defined for each element
    // of the enumeration. Each custom property is appended to `kCustomPropKeys`
    const props = {};
    if (properties) {
        if (Array.isArray(properties)) {
            const entries = properties.filter(e => Array.isArray(e) && e.length === 2);
            if (entries.length)
                properties = new Map(entries);
            else
                properties = new Map();
        }
        else if (typeof properties === 'object') {
            properties = new Map(Object.entries(Object.getOwnPropertyDescriptors(properties)));
        }
        if (properties instanceof Map) {
            const applyPropertiesOf = (object, baseDescriptor) => {
                const property = {
                    configurable: baseDescriptor?.configurable ?? true,
                    enumerable: baseDescriptor?.enumerable ?? true,
                    writable: baseDescriptor?.writable ?? true,
                };
                const descriptors = Object.getOwnPropertyDescriptors(object);
                for (const [key, subvalue] of Object.entries(descriptors)) {
                    const stats = isDescriptor(subvalue, true);
                    const baseStats = isDescriptor(baseDescriptor, true);
                    if (stats.isAccessor && baseStats.isValid) {
                        props[key] = { ...subvalue, ...accessor.keys.from(baseDescriptor) };
                    }
                    else if (stats.isData && baseStats.isValid) {
                        props[key] = { ...subvalue, ...data.keys.from(baseDescriptor) };
                    }
                }
            };
            let stats = {};
            for (const [property, value] of properties.entries()) {
                kCustomPropKeys.push(property);
                if (isDescriptor(property)) {
                    if (typeof value === 'object') {
                        applyPropertiesOf(value, property);
                        continue;
                    }
                }
                props[property] = value;
            }
        }
    }
    for (const value of values) {
        const valueType = Array.isArray(value) ? 'array' : typeof value;
        let property = undefined;
        let response = undefined;
        let wasArray = false;
        let elements = value;
        switch (valueType) {
            case 'array':
                if (value.length >= 1) {
                    wasArray = true;
                    ([property, response] = fromPrimitive(elements[0]));
                }
            default:
                ([property, response] = fromPrimitive(value));
        }
        const maker = {
            [property](initialValue) {
                const storage = new Map();
                const key = property;
                const realValue = accessor(response, false, { storage, key });
                let _opts, associatedValue;
                if (wasArray) {
                    _opts = { storage, key: key + '.associated' };
                    associatedValue = elements.length === 1
                        ? accessor(initialValue, true, _opts)
                        : accessor(elements?.[1], elements?.[2], _opts);
                }
                else
                    associatedValue = accessor(Symbol.for('Enum.NonAssociatedValue'), false, false, false);
                const _prop = Object(asString(response));
                const valueProps = [...kValueProps, ...kCustomPropKeys];
                const enumResponse = Object.create(_prop, {
                    ...makeEnumValue(property, response),
                    ...props,
                });
                const proxy = new Proxy(_prop, {
                    get(target, _property, receiver) {
                        if (_property === 'real')
                            return realValue.get();
                        if (_property === 'value')
                            return associatedValue.get();
                        if (_property === 'type')
                            return name;
                        if (_property === 'name')
                            return property;
                        if (_property === 'compare')
                            return enumResponse[Symbol.for('compare')];
                        if (_property === 'isEnum')
                            return true;
                        if (!valueProps.includes(_property))
                            return undefined;
                    },
                    has(target, _property) {
                        return valueProps.includes(_property);
                    },
                    ownKeys(target) {
                        return valueProps;
                    },
                    set(target, _property, value, receiver) {
                        if (_property === 'value' && wasArray)
                            return associatedValue.set(value);
                        return false;
                    }
                });
                Object.setPrototypeOf(proxy, Object.getPrototypeOf(_prop));
                Object.setPrototypeOf(enumResponse, proxy);
                return enumResponse;
            }
        };
        enumeration[Symbol.for('Enum.valueKeys')].push(property);
        const dataValue = wasArray ? maker[property] : maker[property]();
        const baseProps = {
            writable: false,
            configurable: false,
            enumerable: true,
        };
        Object.defineProperty(enumeration, property, data(dataValue, baseProps));
    }
    return enumeration;
}
export const EnumExtension = new Extension(Enum);
/**
 * Converts a given value to a string representation with additional
 * options for description and string tag.
 *
 * @param {any} value - The value to be converted to a string. This can
 *   be of any type, including objects, arrays, numbers, etc.
 * @returns {string} A string representation of the input value, enhanced
 *   with a description and string tag if applicable.
 *
 * @example
 * // Convert a number to a string with additional options
 * const result = asString(123)
 * console.log(result) // Outputs: "123" with description and string tag
 *
 * @example
 * // Convert an object to a string with additional options
 * const obj = { key: 'value' }
 * const result = asString(obj)
 * console.log(result) // Outputs: "[object Object]" with description and
 *                     // string tag
 */
function asString(value) {
    return as.string(value, { description: true, stringTag: true });
}
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
export function makeBaseEnum(name) {
    return Object.create({}, {
        /**
         * Defines the `toStringTag` symbol on each enumeration to allow for
         * type identification and to be consistent in naming conventions.
         *
         * @type {string}
         */
        [Symbol.toStringTag]: accessor('Enum', false, true, false),
        /**
         * In addition to the `toStringTag` symbol which defines this enumeration
         * as an Enum type, the name of the enum is also codified in as a symbol
         * on the object. It can be found using `Symbol.for('Enum.name')`.
         *
         * @type {string|symbol|number}
         */
        [Symbol.for('Enum.name')]: accessor(name, false, true, false),
        /**
         * Knowing which keys of the enum are part of the keys themselves is also
         * crucial for enumerations. These can always be found on each Enum type
         * as `Symbol.for('Enum.valueKeys')` as an array, but can also be found
         * as the `.keys` property if there is no enum value of that name.
         */
        [Symbol.for('Enum.valueKeys')]: data([], false, true, false),
        /**
         * For users of the node.js REPL, this symbol represents enum types in a
         * more readily readable format. See the docs for node's `util.inspect()`
         * function for more details.
         *
         * @type {(number, object, Function) => string}
         */
        [Symbol.for('nodejs.util.inspect.custom')]: data(function (depth, options, inspect) {
            const valueKeys = this[Symbol.for('Enum.valueKeys')] ?? [];
            let valueText = valueKeys
                .map(key => `\x1b[1;2m${key}\x1b[22m`)
                .join(', ');
            if (valueText.length)
                valueText = ` { ${valueText} }`;
            return `\x1b[1menum \x1b[22m${name}${valueText}`;
        }, false, true, false),
        /**
         * This function checks the supplied `possibleEnumValue` to see if it
         * is an enum value type from this enum.
         *
         * @param {any} possibleEnumValue the value to evaluate
         * @returns {boolean} returns `true` if the value is an enum value type
         * from this `Enum`, irrespective of any associated value. Returns `false`
         * otherwise.
         */
        isValueOf: data(function isValueOf(possibleEnumValue) {
            if (!possibleEnumValue || typeof possibleEnumValue !== 'object')
                return false;
            const enumValueType = possibleEnumValue?.type;
            const enumValueName = possibleEnumValue?.name;
            const thisEnumName = this[Symbol.for('Enum.name')];
            const thisEnumKeys = this[Symbol.for('Enum.valueKeys')];
            return (enumValueType === thisEnumName &&
                thisEnumKeys.includes(enumValueName));
        }, false, true, false),
        /**
         * A simple overload of the `toString()` method to represent the enum
         * more identifiably when called. The result will be the word enum with
         * the name of the enum in parenthesis. So a Gender enum might be seen
         * as `Enum(Gender)` as a result to calling this function.
         *
         * @returns {string} a {@link String} representation of this object.
         */
        toString: data(function toString() {
            return `Enum(${name})`;
        }, false, true, false)
    });
    const applySyntacticSugar = () => {
        createSymlinks(Symbol.for('Enum.valueKeys'), 'keys');
        createSymlinks(Symbol.for('Enum.name'), 'name');
    };
    return [base, applySyntacticSugar];
}
/**
 * Creates a symlink for a property from an existing key to a new key on
 * the specified object. This function checks if the new key already
 * exists on the object and, if not, it creates a new property with the
 * same descriptor as the old key.
 *
 * Since this method creates the new link through the use of property
 * descriptors, computed getters and setters also are mapped properly.
 *
 * @param {Object} on - The target object on which the symlink is to be
 * created.
 * @param {string|symbol} oldKey - The existing key whose property
 * descriptor will be used for the new key.
 * @param {string|symbol} newKey - The new key under which the property
 * will be accessible.
 *
 * @example
 * const obj = { a: 1 }
 * createSymlink(obj, 'a', 'b')
 * console.log(obj.b) // Outputs: 1
 */
function createSymlinks(on, oldKey, ...newKeys) {
    redescribe(on, oldKey, {}, { alsoAs: newKeys });
}
//# sourceMappingURL=enum.js.map