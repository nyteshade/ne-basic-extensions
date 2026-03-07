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
export function SubscriptProxy(proxied: object): any | null | object;
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
    static is(leftCase: any, rightCase: any): boolean;
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
    static define(key: string | number | symbol, value: any | [string | number | symbol, any], customizeInstance?: Function | object): any;
    /**
     * Creates an iterator of all {@link Enumeration} derived instances that
     * are statically assigned to this class. Generally this is only useful
     * if applied to child class of `Enumeration`.
     *
     * @returns {Generator<string, void, *>} an iterator that walks instances
     * of derived {@link Enumeration} classes and returns their `.key` values
     */
    static cases(): Generator<string, void, any>;
    /**
     * Creates an iterator of all {@link Enumeration} derived instances that
     * are statically assigned to this class. Generally this is only useful
     * if applied to child class of `Enumeration`.
     *
     * @returns {Generator<string, void, *>} an iterator that walks instances
     * of derived {@link Enumeration} classes and returns their `.value` values
     */
    static values(): Generator<string, void, any>;
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
    static [Symbol.iterator](): Generator<string, void, any>;
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
    constructor(key: string | number | symbol, value: any, acceptUndefinedValue?: boolean);
    /**
     * The case name for this {@link Enumeration} instance.
     *
     * @type {string|symbol}
     */
    key: string | symbol;
    /**
     * The value for this case name, defaults to the same as the
     * case name unless specifically supplied.
     *
     * @type {any}
     */
    value: any;
    /**
     * For {@link Enumeration} instances that have instance level associated
     * values. This is uncommon but is modeled after Swift's enums with
     * associated values. This object is `null` if there are no associations.
     *
     * @type {object}
     */
    associations: object;
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
    associate(...entries: (object | string | number | symbol | [string | number | symbol, any])[]): any;
    /**
     * Shorthand for retrieving an internal associated value
     *
     * @param {string|number|symbol} key a key into the internal
     * associations store. Typically, this value is null.
     * @returns {any|null} null if there is no such named association
     * or if there are no associations stored on this enum value.
     */
    associated(key: string | number | symbol): any | null;
    /**
     * Returns true if there is an associated value for this enumeration case.
     *
     * @returns {boolean} true if associations exist, denoting this is as
     * a variant case; false otherwise.
     */
    get hasAssociatedValues(): boolean;
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
    is(someCase: any): boolean;
    /**
     * Define the string representation of any given {@link Enumeration}
     * instance to be its `.key` value.
     *
     * @returns {string} the value of the `.key` property wrapped in
     * a call to `String()` to ensure conversion.
     */
    toString(): string;
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
    get case(): string;
    /**
     * Define the result of a call to {@link #valueOf} to always be
     * the contents of the `.value` property.
     *
     * @returns {any} the contents of the `.value` property
     */
    valueOf(): any;
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
    [Symbol.toPrimitive](hint: any): string | number | number;
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
    get [Symbol.toStringTag](): string;
}
/**
 * A Extension instance wrapping Enumeration
 *
 * @type {Extension}
 */
export const EnumerationExtension: Extension;
export default Enumeration;
import { Extension } from '@nejs/extension';
