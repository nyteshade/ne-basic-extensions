import { Extension } from '@nejs/extension';
const { toStringTag, hasInstance } = Symbol;
export class ProxyHandlerResponse {
    constructor(success = false, value = undefined, context = undefined) {
        Object.assign(this, { succes, value, context });
    }
    /**
     * A getter method for the toStringTag symbol.
     * This method returns the name of the constructor of the instance.
     * It is used to provide a custom string description of the object,
     * which can be useful for debugging or logging purposes.
     *
     * @example
     * const response = new ProxyHandlerResponse();
     * console.log(response[Symbol.toStringTag]); // logs: "ProxyHandlerResponse"
     *
     * @returns {string} The name of the constructor of the instance.
     */
    get [toStringTag]() { return this.constructor.name; }
    /**
     * This static method is a Symbol.hasInstance method implementation.
     * It checks if the provided instance is an instance of the class.
     * It does this by comparing the instance's toStringTag or constructor
     * to the class's name or the class itself respectively.
     *
     * @param {Object} instance - The instance to check.
     * @returns {boolean} True if the instance is of the class, false otherwise.
     *
     * @example
     * // Assuming MyClass has implemented this method
     * const myInstance = new MyClass();
     * // logs: true
     * console.log(MyClass[Symbol.hasInstance](myInstance));
     */
    static [hasInstance](instance) {
        return (instance?.[toStringTag] === this.name ||
            instance?.constructor === this);
    }
}
export class ProxyHandler {
    constructor(handler, type = ProxyHandler.type.get) {
        this.handler = handler;
        this.typeName = Array.isArray(type)
            ? ProxyHandler.nameFromType(type) ?? 'get'
            : String(type);
        this.type = Array.isArray(type) ? type : ProxyHandler.type[type ?? 'get'];
    }
    invoke(...args) {
        const context = {
            defaultValue: Reflect[this.typeName](...args),
            proxyHandler: this,
            typeHandler: this.handler,
        };
        try {
            const result = this.handler.apply(context, args);
            if (!(result?.[Symbol.toStringTag] === ProxyHandler.ResponseType)) {
                return ProxyHandler.response(!!result, result, context);
            }
            result.context = context;
            return result;
        }
        catch (error) {
            return ProxyHandler.response(false, error);
        }
    }
    /**
     * This static method is used to create a response object. The response
     * object contains the success status, the value, and the context of the
     * response. It also includes a getter for the Symbol.toStringTag property
     * that returns the ResponseType of the ProxyHandler.
     *
     * @param {boolean} success - The success status of the response.
     * @param {*} value - The value of the response.
     * @param {Object} context - The context of the response.
     * @returns {Object} The response object.
     *
     * @example
     * // Create a response object
     * const response = ProxyHandler.response(
     *   true, 'value', { key: 'context' }
     * );
     *
     * // Output: { success: true, value: 'value', context: { key: 'context' },
     * //           [Symbol.toStringTag]: 'ProxyHandlerResponse' }
     * console.log(response);
     */
    static response(success, value, context) {
        return {
            success, value, context,
            get [Symbol.toStringTag]() { return this.ResponseType; }
        };
    }
    /**
     * This static getter method is used to retrieve the response type
     * of the ProxyHandler. It returns a string that represents the
     * response type of the ProxyHandler.
     *
     * @property {function} ResponseType - A static getter method that
     * returns the response type of the ProxyHandler.
     * @returns {string} A string representing the response type of the
     * ProxyHandler.
     *
     * @example
     * // Get the response type of the ProxyHandler
     * const responseType = ProxyHandler.ResponseType;
     *
     * // Output: 'ProxyHandlerResponse'
     * console.log(responseType);
     */
    static get ResponseType() { return 'ProxyHandlerResponse'; }
    /**
     * This static method is used to retrieve the name of a ProxyHandler type
     * from a given array of arguments. If the array of arguments matches any
     * of the ProxyHandler types, the name of that type is returned. If no
     * match is found, or if the input is not an array, 'custom' is returned.
     *
     * @param {Array.<*>} proxyHandlerType - An array of arguments to match
     * against the ProxyHandler types.
     * @returns {string} The name of the matching ProxyHandler type, or 'custom'
     * if no match is found.
     *
     * @example
     * // Get the name of a type from its arguments
     * const typeName = ProxyHandler.nameFromType(
     *   ['target', 'thisArg', 'argumentsList']
     * );
     *
     * // Output: 'apply'
     * console.log(typeName);
     *
     * @throws {TypeError} If ProxyHandler.type is undefined.
     */
    static nameFromType(proxyHandlerType) {
        if (!Array.isArray(proxyHandlerType)) {
            return 'custom';
        }
        const names = Object.entries(ProxyHandler.type);
        for (const [name, args] of names) {
            if (proxyHandlerType.every(element => ~args.indexOf(element))) {
                return name;
            }
        }
        return 'custom';
    }
    /**
     * This method is used to retrieve all the types of ProxyHandler available
     * in the ProxyHandler.type object. It is useful when you need to iterate
     * over all the types or when you need to check if a certain type exists.
     *
     * @property {function} typeNames - A static getter method that returns an
     * array of keys from the ProxyHandler.type object.
     * @returns {Array.<string>} An array of strings representing the keys of
     * the ProxyHandler.type object.
     *
     * @example
     * // Get all type names
     * const types = ProxyHandler.typeNames;
     *
     * // Output: ['apply', 'construct', 'defineProperty', ...]
     * console.log(types);
     *
     * @throws {TypeError} If ProxyHandler.type is undefined.
     */
    static get typeNames() {
        return Object.keys(ProxyHandler.type);
    }
    /**
     * A static getter method that returns an object containing keyed proxy
     * trap types and their associated expected arguments list by name. A
     * docstring description complete with url shortening links for each entry
     * are provided (links go to the MDN documentation)
     *
     * @property {function} type - A static getter method that returns an object
     * of ProxyHandler types.
     * @returns {Object.<string, function>} An object where each key is a type
     * name and each value is a function that returns an array of strings
     * representing the arguments for that type.
     *
     * @example
     * // Get the 'apply' type
     * const applyType = ProxyHandler.type.apply;
     *
     * // Output: ['target', 'thisArg', 'argumentsList']
     * console.log(applyType());
     *
     * @throws {TypeError} If ProxyHandler.type is undefined.
     */
    static get type() {
        return {
            /**
             * The handler.apply() method is a trap for the [[Call]] object internal
             * method, which is used by operations such as function calls.
             * MDN link: https://t.ly/orBsG
             */
            get apply() { return ['target', 'thisArg', 'argumentsList']; },
            /**
             * The handler.construct() method is a trap for the [[Construct]] object
             * internal method, which is used by operations such as the new operator.
             * In order for the new operation to be valid on the resulting Proxy
             * object, the target used to initialize the proxy must itself be a
             * valid constructor.
             * MDN link: https://t.ly/1LukS
             */
            get construct() { return ['target', 'args']; },
            /**
             * The handler.defineProperty() method is a trap for the
             * [[DefineOwnProperty]] object internal method, which is used by
             * operations such as Object.defineProperty().
             * MDN link: https://t.ly/3Ml9y
             */
            get defineProperty() { return ['target', 'key', 'descriptor']; },
            /**
             * The handler.deleteProperty() method is a trap for the [[Delete]]
             * object internal method, which is used by operations such as the
             * delete operator.
             * MDN link: https://t.ly/neu2H
             */
            get deleteProperty() { return ['target', 'property']; },
            /**
             * The handler.get() method is a trap for the [[Get]] object internal
             * method, which is used by operations such as property accessors.
             * MDN link: https://t.ly/E419x
             */
            get get() { return ['target', 'property', 'receiver']; },
            /**
             * The handler.getOwnPropertyDescriptor() method is a trap for the
             * [[GetOwnProperty]] object internal method, which is used by operations
             * such as Object.getOwnPropertyDescriptor().
             * MDN link: https://t.ly/wzPTX
             */
            get getOwnPropertyDescriptor() { return ['target', 'property']; },
            /**
             * The handler.getPrototypeOf() method is a trap for the
             * [[GetPrototypeOf]] object internal method, which is used by operations
             * such as Object.getPrototypeOf().
             * MDN link: https://t.ly/Ww4S1
             */
            get getPrototypeOf() { return ['target']; },
            /**
             * The handler.has() method is a trap for the [[HasProperty]] object
             * internal method, which is used by operations such as the in operator.
             * MDN link: https://t.ly/UcJL-
             */
            get has() { return ['target', 'prototype']; },
            /**
             * The handler.isExtensible() method is a trap for the [[IsExtensible]]
             * object internal method, which is used by operations such as
             * Object.isExtensible().
             * MDN link: https://t.ly/MkdIK
             */
            get isExtensible() { return ['target']; },
            /**
             * The handler.ownKeys() method is a trap for the [[OwnPropertyKeys]]
             * object internal method, which is used by operations such as
             * Object.keys(), Reflect.ownKeys(), etc.
             * MDN link: https://t.ly/QkiTI
             */
            get ownKeys() { return ['target']; },
            /**
             * The handler.preventExtensions() method is a trap for the
             * [[PreventExtensions]] object internal method, which is used by
             * operations such as Object.preventExtensions().
             * MDN link: https://t.ly/nvfjJ
             */
            get preventExtensions() { return ['target']; },
            /**
             * The handler.set() method is a trap for the [[Set]] object internal
             * method, which is used by operations such as using property accessors
             * to set a property's value.
             * MDN link: https://t.ly/FDWcl
             */
            get set() { return ['target', 'property', 'value', 'receiver']; },
            /**
             * The handler.setPrototypeOf() method is a trap for the
             * [[SetPrototypeOf]] object internal method, which is used by operations
             * such as Object.setPrototypeOf().
             * MDN link: https://t.ly/pS8ej
             */
            get setPrototypeOf() { return ['target', 'prototype']; },
        };
    }
}
export class PluggableProxy {
    constructor(Class, handlers, options = {
        prototype: undefined, // undefined means extract from class
        apply: true,
    }) {
        const validHandlers = handlers.filter(h => h instanceof ProxyHandler);
        Object.assign(this, {
            class: Class instanceof Function ? Class : Class.constructor,
            instance: Class instanceof Function ? null : Class,
        });
        this.handlers = new Map();
        for (let typeName of ProxyHandler.typeNames) {
            const handlersOfType = [].concat(validHandlers.filter(h => h.typeName === typeName));
            this.handlers.set(typeName, handlersOfType);
        }
        this[PluggableProxy.kOriginal] = (options?.prototype ?? Object.getPrototypeOf(this.class));
        this[PluggableProxy.kCreated] = Object.create(this[PluggableProxy.kOriginal], this.instance);
        this[PluggableProxy.kProxy] = new Proxy(this[PluggableProxy.kCreated], this);
        if (options?.apply != true) {
            const target = this?.instance ?? this.class;
            Object.setPrototypeOf(target, this[PluggableProxy.kCreated]);
        }
    }
    handlersOfType(typeName) {
        return this.handlers.get(typeName);
    }
    tryEachOfType(type, ...args) {
        const types = ProxyHandler.typeNames;
        const failures = [];
        for (const handler of types) {
            const result = handler.invoke(...args);
            if (result.success) {
                return [result, failures];
            }
            failures.push(result);
        }
        return [undefined, failures];
    }
    apply(target, thisArg, argumentsList) {
        const type = 'apply', args = [target, thisArg, argumentsList];
        const [result, _fails] = tryEachOfType(type, ...args);
        if (result) {
            return result;
        }
        return Reflect[type](...args);
    }
    construct(target, args) {
        const type = 'construct', _args = [target, args];
        const [result, _fails] = tryEachOfType(type, ..._args);
        if (result) {
            return result;
        }
        return Reflect[type](..._args);
    }
    defineProperty(target, key, descriptor) {
        const type = 'defineProperty', args = [target, key, descriptor];
        const [result, _fails] = tryEachOfType(type, ...args);
        if (result) {
            return result;
        }
        return Reflect[type](...args);
    }
    deleteProperty(target, property) {
        const type = 'deleteProperty', args = [target, property];
        const [result, _fails] = tryEachOfType(type, ...args);
        if (result) {
            return result;
        }
        return Reflect[type](...args);
    }
    get(target, property, receiver) {
        const type = 'get', args = [target, property, receiver];
        const [result, _fails] = tryEachOfType(type, ...args);
        if (result) {
            return result;
        }
        return Reflect[type](...args);
    }
    getOwnPropertyDescriptor(target, property) {
        const type = 'getOwnPropertyDescriptor', args = [target, property];
        const [result, _fails] = tryEachOfType(type, ...args);
        if (result) {
            return result;
        }
        return Reflect[type](...args);
    }
    getPrototypeOf(target) {
        const type = 'getPrototypeOf', args = [target];
        const [result, _fails] = tryEachOfType(type, ...args);
        if (result) {
            return result;
        }
        return Reflect[type](...args);
    }
    has(target, property) {
        const type = 'has', args = [target, property];
        const [result, _fails] = tryEachOfType(type, ...args);
        if (result) {
            return result;
        }
        return Reflect[type](...args);
    }
    isExtensible(target) {
        const type = 'isExtensible', args = [target];
        const [result, _fails] = tryEachOfType(type, ...args);
        if (result) {
            return result;
        }
        return Reflect[type](...args);
    }
    ownKeys(target) {
        const type = 'ownKeys', args = [target];
        const [result, _fails] = tryEachOfType(type, ...args);
        if (result) {
            return result;
        }
        return Reflect[type](...args);
    }
    preventExtensions(target) {
        const type = 'preventExtensions', args = [target];
        const [result, _fails] = tryEachOfType(type, ...args);
        if (result) {
            return result;
        }
        return Reflect[type](...args);
    }
    set(target, property, value, receiver) {
        const type = 'set', args = [target, property, value, receiver];
        const [result, _fails] = tryEachOfType(type, ...args);
        if (result) {
            return result;
        }
        return Reflect[type](...args);
    }
    setPrototypeOf(target, prototype) {
        const type = 'setPrototypeOf', args = [target, prototype];
        const [result, _fails] = tryEachOfType(type, ...args);
        if (result) {
            return result;
        }
        return Reflect[type](...args);
    }
    static get kCreated() {
        return Symbol.for('pp.prototype.created');
    }
    static get kOriginal() {
        return Symbol.for('pp.prototype.original');
    }
    static get kProxy() {
        return Symbol.for('pp.proxy');
    }
}
export const ProxyHandlerExtensions = new Extension(ProxyHandler);
export const PluggableProxyExtensions = new Extension(PluggableProxy);
export const PluggableProxyExtensionSet = new Extension.ExtensionSet('PluggableProxyExtensionSet', ProxyHandlerExtensions, PluggableProxyExtensions);
//# sourceMappingURL=pluggable.proxy.js.map