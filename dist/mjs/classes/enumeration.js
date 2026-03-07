import { Extension } from '@nejs/extension';
import { is } from '../utils/toolkit.js';
/**
 * Allows the creation of static, complex, enumeration values
 * that can be used and identified at runtime (as opposed to
 * TypeScript enum values).
 *
 * @example
 * class Color extends Enumeration {
 *   static {
 *     Color.define('red', {r: 255, g: 0, b: 0})
 *     Color.define('green', {r: 0, g:255, b: 0})
 *     Color.define('blue', {r: 0, g: 0, b: 255})
 *
 *     // Color.rgb instances that have no associated
 *     // r,g,b values will return a value of 0 for
 *     // all r, g, and b values, dynamically.
 *     Color.define('rgb', undefined, {
 *       get value() {
 *         const { r, g, b } = this;
 *         return { r: r ?? 0, g: g ?? 0, b: b ?? 0 };
 *       }
 *     })
 *   }
 * }
 *
 * let thing = {name: 'pole', color: Color.rgb.associate({
 *   r: 200,
 *   g: 200,
 *   b: 200
 * })}
 *
 * switch (thing.key) {
 *   case Color.red.key:
 *   case Color.green.key:
 *   case Color.blue.key:
 *     return thing.value;
 *
 *   case Color.rgb.key: {
 *     // Uses SubscriptProxy to get at custom associations
 *     const { r, g, b } = thing
 *
 *     return { r, g, b }
 *   }
 * }
 *
 */
export class Enumeration {
    /**
     * The case name for this {@link Enumeration} instance.
     *
     * @type {string|symbol}
     */
    key;
    /**
     * The value for this case name, defaults to the same as the
     * case name unless specifically supplied.
     *
     * @type {any}
     */
    value;
    /**
     * For {@link Enumeration} instances that have instance level associated
     * values. This is uncommon but is modeled after Swift's enums with
     * associated values. This object is `null` if there are no associations.
     *
     * @type {object}
     */
    associations;
    /**
     * Creates a new simple {@link Enumeration} case with a key (case name)
     * and associated value of any type. If no value is supplied, it will be
     * set to the value of the key unless `acceptUndefinedValue` is set to
     * true.
     *
     * @param {string|number|symbol} key the case name represented by this
     * instance of {@link Enumeration}.
     * @param {any} value any value for this enumeration case. If this is
     * `undefined` and `acceptUndefinedValue` is set to false (the default)
     * then the value will be identical to the `key`.
     * @param {boolean} [acceptUndefinedValue=false] a flag that allows the
     * rare case of setting a case's value explicitly to `undefined`
     * @returns {Enumeration} a new {@link Enumeration} value, or instance of
     * whatever child class has extended `Enumeration`.
     */
    constructor(key, value, acceptUndefinedValue = false) {
        if (value === undefined && !acceptUndefinedValue)
            value = key;
        Object.assign(this, { key, value });
        Object.defineProperty(this, 'associations', {
            value: null,
            configurable: true,
            enumerable: false,
            writable: true,
        });
        /**
         * Enables a subscript proxy on the instances of each {@link Enumeration}
         * derived instance such that if there is no actual relevant property of
         * the same name, and the instance has associated values, then it returns
         * the value of the property of the same name on the associations object
         * within.
         *
         * @example
         * class Shapes extends Enumeration {
         *   static {
         *     Shapes.define('other')
         *   }
         * }
         *
         * let customShape = Shapes.other.associate({name: 'Dodecahedron'})
         *
         * console.log(customShape.name) // "Dodecahedron"
         *
         * @note if there is an existing property of the same name, such as the
         * `.key` or `.value`, it is safer to use the {@link Enumeration#associated}
         * function retrieve the value. You have been warned.
         */
        Object.setPrototypeOf(this.constructor.prototype, SubscriptProxy(Object.create(Object.getPrototypeOf(this.constructor.prototype))));
        return this;
    }
    /**
     * Creates a duplicate of this enumeration case, and assigns instance
     * level associated key/value pairs on the copy. It is still of the
     * same enum class type, but has instance level associated value.
     *
     * @param {...(object|string|number|symbol|[string|number|symbol,any])} entries
     * a variadic list of objects (whose key/value pairs will be flattened
     * and added to the associations), a key (string|number|symbol) whose
     * value will be the same as the key, or an Object entry (i.e. an array with
     * the first value being the key and the second value being the value).
     * @returns {*} an instance of this class
     */
    associate(...entries) {
        const associations = {};
        for (const entry of entries) {
            if (is.object(entry, Object)) {
                Object.assign(associations, ...entries);
            }
            else if (is.array(entry)) {
                const key = is.objectKey(entry[0]);
                associations[key] = entry[1];
            }
            else if (is.objectKey(entry)) {
                associations[entry] = entry;
            }
        }
        if (this.hasAssociatedValues) {
            Object.assign(this.associations, associations);
            return this;
        }
        // Create a duplicate of this case instance
        const variantCase = Object.create(this);
        // Assign the associations object we created
        variantCase.associations = associations;
        return variantCase;
    }
    /**
     * Shorthand for retrieving an internal associated value
     *
     * @param {string|number|symbol} key a key into the internal
     * associations store. Typically, this value is null.
     * @returns {any|null} null if there is no such named association
     * or if there are no associations stored on this enum value.
     */
    associated(key) {
        return this.associations?.[key];
    }
    /**
     * Returns true if there is an associated value for this enumeration case.
     *
     * @returns {boolean} true if associations exist, denoting this is as
     * a variant case; false otherwise.
     */
    get hasAssociatedValues() {
        return this.associations !== null;
    }
    /**
     * Checks to see if this object is, or is loosely, the same as
     * the supplied `someCase` value. This is determined by comparing
     * the `.key` property.
     *
     * @param {any} someCase some object value that might have a
     * matching (double equals) key property value
     * @returns {boolean} true if the objects are loosely equal (==)
     * or if each of `.key` values are loosely equal (==)
     */
    is(someCase) {
        // noinspection EqualityComparisonWithCoercionJS
        return this == someCase || this?.key == someCase?.key;
    }
    /**
     * Define the string representation of any given {@link Enumeration}
     * instance to be its `.key` value.
     *
     * @returns {string} the value of the `.key` property wrapped in
     * a call to `String()` to ensure conversion.
     */
    toString() {
        return String(this.key);
    }
    /**
     * Returns a combination of the this class' name followed by this
     * instances key value. This can be more explicit than just using
     * the `.key` property.
     *
     * @example
     * class Shape extends Enumeration {
     *   static {
     *     Shape.define('circle')
     *     Shape.define('square')
     *   }
     * }
     *
     * console.log(Shape.circle.case) // 'Shape.circle'
     *
     * // ['Shape.circle', 'Shape.square']
     * console.log([...Shape.values()].map(s => s.case))
     *
     * @type {string}
     */
    get case() {
        return `${this.constructor.name}.${String(this.key)}`;
    }
    /**
     * Define the result of a call to {@link #valueOf} to always be
     * the contents of the `.value` property.
     *
     * @returns {any} the contents of the `.value` property
     */
    valueOf() {
        return this.value;
    }
    /**
     * Returns the `.key` value as a primitive, unless a conversion to
     * number is requested. In which case, if the `.value` propert is
     * of type {@link Number} then it will be returned. In all other
     * cases the result will be `String(this.key)`.
     *
     * @returns {string|number|NaN} returns a {@link String} representation
     * of the `.key` property unless a number is requested. See above
     * for custom logic pertaining to number coercion.
     */
    [Symbol.toPrimitive](hint) {
        switch (hint) {
            default:
            case 'string':
                return String(this.key);
            case 'number':
                return isNumber(this.value)
                    ? this.value
                    : Number(this.key);
        }
    }
    /**
     * Generates a custom tag name that matches this instances class name.
     *
     * @example
     * class Shape extends Enumeration {
     *   static { Shape.define('circle') }
     * }
     *
     * console.log(Shape.circle[Symbol.toStringTag]) // 'Shape'
     */
    get [Symbol.toStringTag]() {
        return this.constructor.name;
    }
    /**
     * Static variant of {@link Enumeration#is} that takes a left and
     * right hand value, then checks to see if both objects are, or are
     * loosely, the same as each other's `.key` value.
     *
     * @param {any} leftCase some object value that might have a
     * matching (double equals) key property value
     * @param {any} rightCase some object value that might have a
     * matching (double equals) key property value
     * @returns {boolean} true if the objects are loosely equal (==)
     * or if each of `.key` values are loosely equal (==)
     */
    static is(leftCase, rightCase) {
        // noinspection EqualityComparisonWithCoercionJS
        return leftCase == rightCase || leftCase?.key == rightCase?.key;
    }
    /**
     * Used when creating a static instance of {@link Enumeration}. Generally
     * this is done as follows:
     *
     * @example
     * class Shape extends Enumeration {
     *   static {
     *     Shape.define('cylinder')
     *     Shape.define('cube')
     *     Shade.define('other')
     *   }
     * }
     *
     * @param {string|number|symbol} key the case name of the this particular
     * enumeration instance.
     * @param {any|[string|number|symbol, any]} value the value of the newly
     * defined {@link Enumeration} instance.
     * @param {function|object} [customizeInstance=undefined] defaults to
     * `undefined`, but when it is passed in as a function, the signature
     * would be to take an instance of this Enumeration class and return
     * one (presumably after modification), or in the form of an object whose
     * property descriptors are copied onto the defined instance. This later
     * approach retains getter and setter application as well as other rare
     * descriptor modifications.
     * @returns {*} an instance of this {@link Enumeration} class type.
     */
    static define(key, value, customizeInstance) {
        if (!is.objectKey(key)) {
            throw new TypeError('Enumeration.define() must have a string/number/symbol key');
        }
        let caseName = key;
        let caseValue = value;
        if (is.objectEntry(value)) {
            ([caseName, caseValue] = value);
        }
        let instance = new this(key, value);
        if (customizeInstance instanceof Function) {
            const newInstance = customizeInstance(instance);
            if (newInstance instanceof this)
                instance = newInstance;
        }
        else if (is.object(customizeInstance)) {
            const descriptors = Object.getOwnPropertyDescriptors(customizeInstance);
            Object.defineProperties(instance, descriptors);
        }
        Object.defineProperty(this, key, {
            get() {
                return instance;
            },
            configurable: true,
            enumerable: true,
        });
    }
    /**
     * Creates an iterator of all {@link Enumeration} derived instances that
     * are statically assigned to this class. Generally this is only useful
     * if applied to child class of `Enumeration`.
     *
     * @returns {Generator<string, void, *>} an iterator that walks instances
     * of derived {@link Enumeration} classes and returns their `.key` values
     */
    static *cases() {
        for (let [key, _] of this)
            yield key;
    }
    /**
     * Creates an iterator of all {@link Enumeration} derived instances that
     * are statically assigned to this class. Generally this is only useful
     * if applied to child class of `Enumeration`.
     *
     * @returns {Generator<string, void, *>} an iterator that walks instances
     * of derived {@link Enumeration} classes and returns their `.value` values
     */
    static *values() {
        for (let [_, value] of this)
            yield value;
    }
    /**
     * Creates an iterator of all {@link Enumeration} derived instances that
     * are statically assigned to this class. Generally this is only useful
     * if applied to child class of `Enumeration`.
     *
     * @returns {Generator<string, void, *>} an iterator that walks instances
     * of derived {@link Enumeration} classes and returns each key/value pair
     * as arrays. **This is the same as `Object.entries(ChildEnumerationClass)`
     * and then filter the results for pairs whose values are instances of
     * `ChildEnumerationClass`**
     */
    static *[Symbol.iterator]() {
        const keys = Object.keys(this);
        for (const key of keys) {
            const value = this[key];
            if (value instanceof this)
                yield [key, value];
        }
    }
}
/**
 * Creates a prototype safe {@link Proxy} object, specific to
 * {@link Enumeration} instances, that if a getter tries to reach a named
 * property that doesn't exist on the enum, **and** `.hasAssociatedValues`
 * is `true`, then it will attempt to return `this.associations[property]`
 * instead.
 *
 * @param {object} proxied the object to the behavior to; typically this is
 * the prototype of the class itself. See the constructor in Enumeration for
 * usage.
 * @returns {*|null|object} a {@link Proxy} instance around the supplied
 * object to be proxied with the above defined behavior.
 */
export function SubscriptProxy(proxied) {
    return new Proxy(proxied, {
        get(target, property, receiver) {
            if (!Reflect.has(target, property) && receiver.hasAssociatedValues) {
                return receiver.associated(property);
            }
            return Reflect.get(target, property, receiver);
        },
        set(target, property, newValue, receiver) {
            if (!Reflect.has(target, property) &&
                receiver.hasAssociatedValues &&
                Reflect.has(receiver.associations, property)) {
                receiver.associations[property] = newValue;
                return;
            }
            return Reflect.set(target, property, newValue, receiver);
        },
    });
}
/**
 * A Extension instance wrapping Enumeration
 *
 * @type {Extension}
 */
export const EnumerationExtension = new Extension(Enumeration);
export default Enumeration;
//# sourceMappingURL=enumeration.js.map