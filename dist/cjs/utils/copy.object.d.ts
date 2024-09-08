/**
 * Transforms an array into an object using a provided transform
 * function.
 *
 * @function transduceFrom
 * @param {Array} array - The array to transform.
 * @param {Function} transform - The function used to transform each
 *   element of the array. It should return an object with 'key' and
 *   'value' properties.
 * @param {Object} [into={}] - The object to transform the array into.
 * @returns {Object} The transformed object.
 * @example
 * const array = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
 * const transform = (element) => ({ key: element.id, value: element.name })
 * transduceFrom(array, transform)
 * // => { 1: 'John', 2: 'Jane' }
 */
export function tryIgnore(code: any): Object;
export function transduceFrom(array: any, transform: any, into?: {}): any;
/**
 * Transforms a COHandler instance into an object with 'key' and 'value'
 * properties.
 *
 * @function transduceFromCOHandler
 * @param {COHandler} element - The COHandler instance to transform.
 * @returns {Object} An object with 'key' and 'value' properties, where
 *   'key' is the 'property' of the COHandler instance and 'value' is
 *   the COHandler instance itself.
 * @example
 * const handler = new COHandler('foo')
 * transduceFromCOHandler(handler)
 * // => { key: 'foo', value: handler }
 */
export function transduceFromCOHandler(element: COHandler): Object;
/**
 * Creates a transducer function by partially applying the 'array' and
 * 'transform' arguments to the 'transduceFrom' function.
 *
 * @function makeTransducer
 * @param {Array} array - The array to transform.
 * @param {Function} transform - The function used to transform each
 *   element of the array.
 * @returns {Function} A transducer function that takes an 'into' object
 *   and returns the result of calling 'transduceFrom' with the provided
 *   'array', 'transform', and 'into' arguments.
 * @example
 * const array = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
 * const transform = (element) => ({ key: element.id, value: element.name })
 * const transducer = makeTransducer(array, transform)
 * transducer({ 3: 'Jim' })
 * // => { 1: 'John', 2: 'Jane', 3: 'Jim' }
 */
export function makeTransducer(array: any[], transform: Function): Function;
/**
 * Returns an object containing getter functions that return Symbol
 * values representing different visibility configurations for object
 * properties.
 *
 * @function
 * @name kVisibilityKeys
 * @returns {Object} An object with the following properties:
 * @property {symbol} mutablyHidden - Returns a Symbol representing a
 *   property that is not enumerable but is configurable.
 * @property {symbol} mutablyVisible - Returns a Symbol representing a
 *   property that is both enumerable and configurable.
 * @property {symbol} immutablyHidden - Returns a Symbol representing
 *   a property that is neither enumerable nor configurable.
 * @property {symbol} immutablyVisible - Returns a Symbol representing
 *   a property that is enumerable but not configurable.
 * @property {symbol} flexiblyHidden - Returns a Symbol representing a
 *   property that is not enumerable, writable and not configurable.
 * @property {symbol} flexiblyVisible - Returns a Symbol representing
 *   a property that is both enumerable and writable, but not
 *   configurable.
 * @property {Generator} keys - Returns a generator that yields the
 *   string keys of the visibility configurations.
 * @property {Generator} symbols - Returns a generator that yields the
 *   Symbol values of the visibility configurations.
 * @property {Generator} entries - Returns a generator that yields
 *   [key, Symbol] pairs for each visibility configuration.
 * @property {Generator} descriptors - Returns a generator that yields
 *   [key, descriptor] pairs for each visibility configuration, where
 *   descriptor is the parsed JSON representation of the Symbol's
 *   description.
 * @property {Generator} [Symbol.iterator] - Returns the same generator
 *   as the symbols property, allowing the object to be iterated over
 *   directly to access the Symbol values.
 *
 * @example
 * const { mutablyHidden, mutablyVisible } = kVisibilityKeys()
 *
 * const obj = {
 *   [mutablyHidden]: 'hidden value',
 *   [mutablyVisible]: 'visible value',
 * }
 *
 * console.log(obj) // { [Symbol()]: 'visible value' }
 * console.log(obj[mutablyHidden]) // 'hidden value'
 * console.log(obj[mutablyVisible]) // 'visible value'
 *
 * @example
 * const visibilityKeys = kVisibilityKeys()
 *
 * for (const key of visibilityKeys.keys()) {
 *   console.log(key)
 * }
 * // Output:
 * // 'mutablyHidden'
 * // 'mutablyVisible'
 * // 'immutablyHidden'
 * // 'immutablyVisible'
 * // 'flexiblyHidden'
 * // 'flexiblyVisible'
 *
 * @example
 * const visibilityKeys = kVisibilityKeys()
 *
 * for (const symbol of visibilityKeys) {
 *   console.log(symbol)
 * }
 * // Output:
 * // Symbol({"enumerable":false,"configurable":true})
 * // Symbol({"enumerable":true,"configurable":true})
 * // Symbol({"enumerable":false,"configurable":false})
 * // Symbol({"enumerable":true,"configurable":false})
 * // Symbol({"enumerable":false,"writable":true})
 * // Symbol({"enumerable":true,"writable":true})
 */
export function kVisibilityKeys(): Object;
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
export function customCopyObject(_options: any, _destination: any, ..._sources: any[]): any;
/**
 * A class for handling property descriptors during object copying.
 * @class
 * @example
 * const handler = new COPropertyHandler('foo', (prop, descriptor) => {
 *   descriptor.enumerable = false
 *   return descriptor
 * })
 * handler.handle('foo', { value: 42, writable: true, enumerable: true })
 * // => { value: 42, writable: true, enumerable: false }
 */
export class COPropertyHandler {
    /**
     * The default property descriptor handler.
     *
     * @param {string} property - The name of the property being handled.
     * @param {Object} curDescriptor - The property descriptor to handle.
     * @param {Object} destination - The destination object into which
     * properties are being copied.
     * @param {function} handler - The function to handle the property
     * descriptor.
     * @returns {Object} a `COPropertyHandler.Response` type object which
     * can be made with {@link COPropertyHandler.makeResponse}.
     */
    static defaultHandle(property: string, curDescriptor: Object, destination: Object, handler: Function): Object;
    /**
     * Creates a COPropertyHandler response object.
     *
     * @param {Object} descriptor - The property descriptor.
     * @param {string} [flow=COPropertyHandler.kNoChange] - The flow control
     * directive. Must be one of the values from
     * {@link COPropertyHandler.flowTypes} if provided.
     * @returns {COPropertyHandler.Response} The response object.
     * @example
     * COPropertyHandler.makeResponse({ value: 42, writable: false })
     * // => {
     * //   newDescriptor: { value: 42, writable: false },
     * //   flow: 'nochange'
     * // }
     */
    static makeResponse(descriptor: Object, flow?: string | undefined): COPropertyHandler.Response;
    /**
     * Checks if a value is a valid COPropertyHandler response object.
     * @param {*} value - The value to check.
     * @returns {boolean} `true` if the value is a response object, `false`
     * otherwise.
     * @example
     * COPropertyHandler.isResponse({
     *   newDescriptor: { value: 42 },
     *   flow: 'nochange'
     * })
     * // => true
     */
    static isResponse(value: any): boolean;
    /**
     * The flow control directive indicating no change in flow.
     * @type {string}
     */
    static get kNoChange(): string;
    /**
     * The flow control directive indicating to continue the loop.
     * @type {string}
     */
    static get kContinue(): string;
    /**
     * The flow control directive indicating to break the loop.
     * @type {string}
     */
    static get kBreak(): string;
    /**
     * An array of all valid flow control directive values.
     * @type {string[]}
     */
    static get flowTypes(): string[];
    /**
     * An object mapping flow control directive values to their
     * corresponding string representations.
     * @type {Object.<string, string>}
     */
    static get flowEnum(): {
        [x: string]: string;
    };
    /**
     * Creates a new COPropertyHandler instance.
     * @param {string} [property] - The name of the property to handle.
     * @param {function} [handler] - The function to handle the property
     * descriptor.
     */
    constructor(property?: string | undefined, handler?: Function | undefined);
    /**
     * The name of the property this handler is responsible for.
     * @type {string|undefined}
     */
    property: string | undefined;
    /**
     * The property handler. When provided and invoked, it will receive
     * a the property name of the value being handled, the current
     * descriptor to transform, and the object into which values are
     * currently being copied into.
     *
     * The result must be a COPropertyHandler response type, which can
     * be made with {@link COPropertyHandler.makeResponse} and which
     * can be validated with {@link COPropertyHandler.isResponse}.
     *
     * The handler should have the following parameters
     *  - {string} property - The name of the property being handled.
     *  - {Object} curDescriptor - The property descriptor to handle.
     *  - {Object} destination - The destination object into which
     *    properties are being copied.
     *
     * An should return
     *  - {Object} a `COPropertyHandler.Response` type object which
     *    can be made with {@link COPropertyHandler.makeResponse}.
     *
     * @type {function|undefined}
     */
    handler: Function | undefined;
    /**
     * Handles a property descriptor using the registered handler function.
     * @param {string} property - The name of the property being handled.
     * @param {Object} descriptor - The property descriptor to handle.
     * @returns {Object} The resulting property descriptor after handling.
     */
    handle(property: string, descriptor: Object, destination: any): Object;
}
/**
 * An object containing Symbol values representing different visibility
 * configurations for object properties.
 *
 * @constant {Object} VisibilityKeys
 * @property {symbol} mutablyHidden - A Symbol representing a property
 *   that is not enumerable but is configurable.
 * @property {symbol} mutablyVisible - A Symbol representing a property
 *   that is both enumerable and configurable.
 * @property {symbol} immutablyHidden - A Symbol representing a property
 *   that is neither enumerable nor configurable.
 * @property {symbol} immutablyVisible - A Symbol representing a property
 *   that is enumerable but not configurable.
 * @property {symbol} flexiblyHidden - A Symbol representing a property
 *   that is not enumerable, writable and not configurable.
 * @property {symbol} flexiblyVisible - A Symbol representing a property
 *   that is both enumerable and writable, but not configurable.
 */
export const VisibilityKeys: Object;
/**
 * A class for handling property descriptors during object copying based
 * on a specified visibility key.
 *
 * @class VisibilityScopeHandler
 * @extends COPropertyHandler
 * @param {symbol} visibilityKey - The visibility key to use for handling
 *   property descriptors.
 * @example
 * const handler = new VisibilityScopeHandler(VisibilityKeys.mutablyHidden)
 * handler.handle('foo', { value: 42, writable: true, enumerable: true })
 * // => { value: 42, writable: true, enumerable: false }
 */
export class VisibilityScopeHandler extends COPropertyHandler {
    /**
     * Creates a new VisibilityScopeHandler instance.
     *
     * @constructor
     * @param {symbol} visibilityKey - The visibility key to use for handling
     *   property descriptors.
     */
    constructor(visibilityKey: symbol);
    overrides: undefined;
    applyOverridesTo(existingDescriptor: any, overwrite?: boolean): any;
    walkAndApply(to: any): void;
}
/**
 * A handler for mutably visible properties during object copying.
 * @class
 * @extends VisibilityScopeHandler
 * @example
 * const handler = new MutablyVisibleHandler()
 * const sharedHandler = MutablyVisibleHandler.shared
 */
export class MutablyVisibleHandler extends VisibilityScopeHandler {
    static get shared(): any;
    static "__#2@#singleton": any;
    constructor();
}
/**
 * A handler for mutably hidden properties during object copying.
 * @class
 * @extends VisibilityScopeHandler
 * @example
 * const handler = new MutablyHiddenHandler()
 * const sharedHandler = MutablyHiddenHandler.shared
 */
export class MutablyHiddenHandler extends VisibilityScopeHandler {
    static get shared(): any;
    static "__#3@#singleton": any;
    constructor();
}
/**
 * A handler for immutably visible properties during object copying.
 * @class
 * @extends VisibilityScopeHandler
 * @example
 * const handler = new ImmutablyVisibleHandler()
 * const sharedHandler = ImmutablyVisibleHandler.shared
 */
export class ImmutablyVisibleHandler extends VisibilityScopeHandler {
    static get shared(): any;
    static "__#4@#singleton": any;
    constructor();
}
/**
 * A handler for immutably hidden properties during object copying.
 * @class
 * @extends VisibilityScopeHandler
 * @example
 * const handler = new ImmutablyHiddenHandler()
 * const sharedHandler = ImmutablyHiddenHandler.shared
 */
export class ImmutablyHiddenHandler extends VisibilityScopeHandler {
    static get shared(): any;
    static "__#5@#singleton": any;
    constructor();
}
/**
 * A handler for flexibly visible properties during object copying.
 * @class
 * @extends VisibilityScopeHandler
 * @example
 * const handler = new FlexiblyVisibleHandler()
 * const sharedHandler = FlexiblyVisibleHandler.shared
 */
export class FlexiblyVisibleHandler extends VisibilityScopeHandler {
    static get shared(): any;
    static "__#6@#singleton": any;
    constructor();
}
/**
 * A handler for flexibly hidden properties during object copying.
 * @class
 * @extends VisibilityScopeHandler
 * @example
 * const handler = new FlexiblyHiddenHandler()
 * const sharedHandler = FlexiblyHiddenHandler.shared
 */
export class FlexiblyHiddenHandler extends VisibilityScopeHandler {
    static get shared(): any;
    static "__#7@#singleton": any;
    constructor();
}
export default copyObject;
