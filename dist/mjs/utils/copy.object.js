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
export function tryIgnore(code) {
    try {
        return code();
    }
    catch (ignore) {
        return undefined;
    }
}
export function transduceFrom(array, transform, into = {}) {
    if (typeof transform !== 'function') {
        return into;
    }
    return array.reduce((accumulator, element) => {
        const { key, value } = (transform?.(element) ?? {});
        if (key && value) {
            accumulator[key] = value;
        }
        return accumulator;
    }, into);
}
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
export function transduceFromCOHandler(element) {
    const result = {};
    if (element instanceof COPropertyHandler) {
        result.key = element.property;
        result.value = element;
    }
    return result;
}
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
export function makeTransducer(array, transform) {
    return transduceFrom.bind(null, array, transform);
}
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
     * The name of the property this handler is responsible for.
     * @type {string|undefined}
     */
    property = undefined;
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
    handler = undefined;
    /**
     * Creates a new COPropertyHandler instance.
     * @param {string} [property] - The name of the property to handle.
     * @param {function} [handler] - The function to handle the property
     * descriptor.
     */
    constructor(property, handler) {
        Object.assign(this, { property, handler });
    }
    /**
     * Handles a property descriptor using the registered handler function.
     * @param {string} property - The name of the property being handled.
     * @param {Object} descriptor - The property descriptor to handle.
     * @returns {Object} The resulting property descriptor after handling.
     */
    handle(property, descriptor, destination) {
        if (this.handler) {
            return COPropertyHandler.defaultHandle(property, descriptor, this.handler);
        }
        return descriptor;
    }
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
    static defaultHandle(property, curDescriptor, destination, handler) {
        if (typeof handler === 'function') {
            try {
                const { descriptor, flow } = handler(property, curDescriptor, destination);
                return this.makeResponse(descriptor, flow);
            }
            catch (ignore) { }
        }
        return this.makeResponse(curDescriptor);
    }
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
    static makeResponse(descriptor, flow) {
        return {
            newDescriptor: descriptor,
            flow: flow ?? this.kNoChange,
            get [Symbol.toStringTag]() { return 'COPropertyHandler.Response'; }
        };
    }
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
    static isResponse(value) {
        return (value && typeof value === 'object' &&
            value[Symbol.toStringTag] === 'COPropertyHandler.Response');
    }
    /**
     * The flow control directive indicating no change in flow.
     * @type {string}
     */
    static get kNoChange() { return 'nochange'; }
    /**
     * The flow control directive indicating to continue the loop.
     * @type {string}
     */
    static get kContinue() { return 'continue'; }
    /**
     * The flow control directive indicating to break the loop.
     * @type {string}
     */
    static get kBreak() { return 'break'; }
    /**
     * An array of all valid flow control directive values.
     * @type {string[]}
     */
    static get flowTypes() {
        return [this.kNoChange, this.kContinue, this.kBreak];
    }
    /**
     * An object mapping flow control directive values to their
     * corresponding string representations.
     * @type {Object.<string, string>}
     */
    static get flowEnum() {
        return {
            [this.kNoChange]: this.kNoChange,
            [this.kContinue]: this.kContinue,
            [this.kBreak]: this.kBreak,
        };
    }
}
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
export function kVisibilityKeys() {
    const keys = {
        get mutablyHidden() {
            return Symbol.for(JSON.stringify({
                enumerable: false,
                configurable: true,
            }));
        },
        get mutablyVisible() {
            return Symbol.for(JSON.stringify({
                enumerable: true,
                configurable: true,
            }));
        },
        get immutablyHidden() {
            return Symbol.for(JSON.stringify({
                enumerable: false,
                configurable: false,
            }));
        },
        get immutablyVisible() {
            return Symbol.for(JSON.stringify({
                enumerable: true,
                configurable: false,
            }));
        },
        get flexiblyHidden() {
            return Symbol.for(JSON.stringify({
                enumerable: false,
                configurable: false,
                writable: true,
            }));
        },
        get flexiblyVisible() {
            return Symbol.for(JSON.stringify({
                enumerable: true,
                configurable: false,
                writable: true,
            }));
        },
    };
    const enumerated = {
        mutablyHidden: keys.mutablyHidden,
        mutablyVisible: keys.mutablyVisible,
        immutablyHidden: keys.immutablyHidden,
        immutablyVisible: keys.immutablyVisible,
        flexiblyHidden: keys.flexiblyHidden,
        flexiblyVisible: keys.flexiblyVisible,
    };
    function* keyGenerator() {
        for (const key of Object.keys(enumerated)) {
            yield key;
        }
    }
    function* symbolGenerator() {
        for (const value of Object.values(enumerated)) {
            yield value;
        }
    }
    function* entryGenerator() {
        for (const entry of Object.entries(enumerated)) {
            yield entry;
        }
    }
    function* descriptorGenertor() {
        for (const [key, value] of entryGenerator()) {
            yield [key, JSON.parse(value.description)];
        }
    }
    Object.defineProperties(keys, {
        enumeration: { get() { return enumerated; }, enumerable: false },
        keys: { get() { return keyGenerator(); }, enumerable: false },
        symbols: { get() { return symbolGenerator(); }, enumerable: false },
        entries: { get() { return entryGenerator(); }, enumerable: false },
        descriptors: { get() { return descriptorGenertor(); }, enumerable: false },
        descriptorFor: {
            value(symbol) {
                try {
                    return JSON.parse(symbol.description);
                }
                catch (ignored) { }
                return undefined;
            },
            enumerable: false
        },
        [Symbol.iterator]: { get() { return symbolGenerator(); } },
    });
    return keys;
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
export const VisibilityKeys = kVisibilityKeys();
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
    overrides = undefined;
    /**
     * Creates a new VisibilityScopeHandler instance.
     *
     * @constructor
     * @param {symbol} visibilityKey - The visibility key to use for handling
     *   property descriptors.
     */
    constructor(visibilityKey) {
        super(visibilityKey, (property, descriptor, dest, source) => {
            let data = descriptor?.value;
            if (!descriptor || typeof descriptor.value !== 'object') {
                return COPropertyHandler.makeResponse(descriptor, 'nochange');
            }
            if (!data && (descriptor?.get || descriptor?.set)) {
                const newDescriptor = this.applyOverridesTo(descriptor);
                return COPropertyHandler.makeResponse(newDescriptor, 'nochange');
            }
            data = customCopyObject({ deep: false }, {}, data ?? {});
            this.walkAndApply(data);
            descriptor.value = data;
            return COPropertyHandler.makeResponse(descriptor, 'continue');
        });
        tryIgnore(() => this.overrides = JSON.parse(property.description));
    }
    applyOverridesTo(existingDescriptor, overwrite = false) {
        const allowed = ['value', 'get', 'set', 'writable', 'configurable', 'enumerable'];
        const output = overwrite ? existingDescriptor : { ...existingDescriptor };
        for (let [key, value] of Object.entries(this.overrides ?? {})) {
            if (!~allowed.indexOf(key)) {
                continue;
            }
            if (!(['get', 'set'].some(k => k === key) &&
                ['undefined', 'function'].some(t => typeof value === t))) {
                continue;
            }
            if (!(['enumerable', 'configurable', 'writable'].some(k => k === key) &&
                typeof value !== 'boolean')) {
                value = !!value;
            }
            delete output[key];
            output[key] = value;
        }
        return output;
    }
    walkAndApply(to) {
        Reflect.ownKeys(to).forEach(key => {
            tryIgnore(() => {
                let result = Object.getOwnPropertyDescriptor(to, key);
                this.applyOverridesTo(result, true);
                Object.defineProperty(to, key, result);
            });
        });
    }
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
    constructor() { super(VisibilityKeys.mutablyVisible); }
    static get shared() {
        return this.#singleton ?? (this.#singleton = new this);
    }
    static #singleton;
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
    constructor() { super(VisibilityKeys.mutablyHidden); }
    static get shared() {
        return this.#singleton ?? (this.#singleton = new this);
    }
    static #singleton;
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
    constructor() { super(VisibilityKeys.immutablyVisible); }
    static get shared() {
        return this.#singleton ?? (this.#singleton = new this);
    }
    static #singleton;
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
    constructor() { super(VisibilityKeys.immutablyHidden); }
    static get shared() {
        return this.#singleton ?? (this.#singleton = new this);
    }
    static #singleton;
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
    constructor() { super(VisibilityKeys.flexiblyVisible); }
    static get shared() {
        return this.#singleton ?? (this.#singleton = new this);
    }
    static #singleton;
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
    constructor() { super(VisibilityKeys.flexiblyHidden); }
    static get shared() {
        return this.#singleton ?? (this.#singleton = new this);
    }
    static #singleton;
}
Object.defineProperties(COPropertyHandler, {
    MutablyHiddenHandler: { get() { return MutablyHiddenHandler.shared; } },
    MutablyVisibleHandler: { get() { return MutablyVisibleHandler.shared; } },
    ImmutablyHiddenHandler: { get() { return ImmutablyHiddenHandler.shared; } },
    ImmutablyVisibleHandler: { get() { return ImmutablyVisibleHandler.shared; } },
    FlexiblyHiddenHandler: { get() { return FlexiblyHiddenHandler.shared; } },
    FlexiblyVisibleHandler: { get() { return FlexiblyVisibleHandler.shared; } },
    handlers: {
        value: [
            MutablyHiddenHandler, MutablyVisibleHandler, ImmutablyHiddenHandler,
            ImmutablyVisibleHandler, FlexiblyHiddenHandler, FlexiblyVisibleHandler,
        ].map(klass => klass.shared),
        configurable: true,
        enumerable: true
    },
});
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
export function copyObject(deep, destination, ...sources) {
    const options = {
        deep: deep || false,
        propertyHandlers: COPropertyHandler?.handlers ?? [],
    };
    return customCopyObject(options, destination, ...sources);
}
export function customCopyObject(_options, _destination, ..._sources) {
    const visited = new Set();
    const [options, destination, sources] = ccoParseArgs(_options, _destination, ..._sources);
    let { deep } = options;
    for (const source of sources) {
        if (source === null || typeof source !== 'object' || visited.has(source)) {
            continue;
        }
        visited.add(source);
        const keys = Reflect.ownKeys(source);
        for (let key of keys) {
            let descriptor;
            try {
                descriptor = Object.getOwnPropertyDescriptor(source, key);
            }
            catch (err) {
                console.warn(`Failed to get descriptor for key "${key}": ${err}`);
                continue;
            }
            const isDataDesc = Reflect.has(descriptor, 'value');
            const keyedValue = descriptor?.value;
            const conditionsMet = [
                isDataDesc,
                keyedValue,
                typeof keyedValue === 'object',
                !visited.has(keyedValue)
            ].every(condition => condition);
            if (conditionsMet) {
                visited.add(keyedValue);
                const prototype = Object.getPrototypeOf(keyedValue);
                const descriptors = Object.getOwnPropertyDescriptors(keyedValue);
                const replacement = Object.create(prototype, descriptors);
                descriptor.value = deep
                    ? customCopyObject(options, replacement, keyedValue)
                    : replacement;
            }
            try {
                Object.defineProperty(destination, key, descriptor);
            }
            catch (err) {
                console.error(`Failed to define property "${key}": ${err}`);
            }
        }
    }
    return destination;
}
function ccoParseArgs(options, destination, ...sources) {
    // Parse options
    let { deep = true, propertyHandlers = [] } = options;
    // Ensure boolean'ness
    deep = !!deep;
    // Ensure propertyHandlers are converted for our ease of use
    // Transform 1: Ensure array of COPropertyHandlers at the
    // cost of potentially having none
    propertyHandlers = (Array.isArray(propertyHandlers)
        ? propertyHandlers
        : [propertyHandlers]).filter(element => element instanceof COPropertyHandler);
    // Transform 2: Convert array of handlers into an object keyed
    // as { [handler.property]: handler }
    const transducer = makeTransducer(propertyHandlers, transduceFromCOHandler);
    propertyHandlers = transducer({});
    // Rebuild options in the case that we recurse
    options = { deep, propertyHandlers };
    // Ensure sources have only objects
    sources = sources.filter(source => source && typeof source === 'object');
    // Ensure the destination is not null
    if (!destination) {
        destination = {};
    }
    return [options, destination, sources];
}
export default copyObject;
//# sourceMappingURL=copy.object.js.map