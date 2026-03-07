export class ProxyHandlerResponse {
    [x: symbol]: string;
    constructor(success?: boolean, value?: undefined, context?: undefined);
}
export class ProxyHandler {
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
    static response(success: boolean, value: any, context: Object): Object;
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
    static get ResponseType(): string;
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
    static nameFromType(proxyHandlerType: Array<any>): string;
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
    static get typeNames(): Array<string>;
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
    static get type(): {
        [x: string]: Function;
    };
    constructor(handler: any, type?: Function);
    handler: any;
    typeName: string;
    type: any;
    invoke(...args: any[]): any;
}
export class PluggableProxy {
    static get kCreated(): symbol;
    static get kOriginal(): symbol;
    static get kProxy(): symbol;
    constructor(Class: any, handlers: any, options?: {
        prototype: undefined;
        apply: boolean;
    });
    handlers: Map<any, any>;
    handlersOfType(typeName: any): any;
    tryEachOfType(type: any, ...args: any[]): any[];
    apply(target: any, thisArg: any, argumentsList: any): any;
    construct(target: any, args: any): any;
    defineProperty(target: any, key: any, descriptor: any): any;
    deleteProperty(target: any, property: any): any;
    get(target: any, property: any, receiver: any): any;
    getOwnPropertyDescriptor(target: any, property: any): any;
    getPrototypeOf(target: any): any;
    has(target: any, property: any): any;
    isExtensible(target: any): any;
    ownKeys(target: any): any;
    preventExtensions(target: any): any;
    set(target: any, property: any, value: any, receiver: any): any;
    setPrototypeOf(target: any, prototype: any): any;
}
export const ProxyHandlerExtensions: Extension;
export const PluggableProxyExtensions: Extension;
export const PluggableProxyExtensionSet: {
    name: string;
    extensionObjects: Set<any>;
    extensions: Set<any>;
    apply(): void;
    revert(): void;
};
import { Extension } from '@nejs/extension';
