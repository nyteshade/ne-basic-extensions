"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyExtensions = void 0;
const extension_1 = require("@nejs/extension");
const object_extensions_js_1 = require("./object.extensions.js");
const string_extensions_js_1 = require("./string.extensions.js");
const symkeys_js_1 = require("./classes/symkeys.js");
const { isObject } = object_extensions_js_1.ObjectExtensions.patches;
const { isString } = string_extensions_js_1.StringExtensions.patches;
const keys = new symkeys_js_1.Symkeys('nejs.proxy');
exports.ProxyExtensions = new extension_1.Patch(Proxy, {
    [extension_1.Patch.kImmutablyHidden]: {
        /**
         * Getter method for the 'keys' property.
         *
         * This method returns the 'keys' object which is an instance of the
         * Symkeys class. The Symkeys class provides a way to easily generate
         * Symbol.for elements that follow a particular pattern and also allows
         * associated data storage with each generated key.
         *
         * @returns {Symkeys} The 'keys' object.
         *
         * @example
         * const proxyExtensions = new ProxyExtensions();
         * const kCustomKeyForMyProxy = Proxy.keys.add('mything', { thing: ... })
         *
         * new Proxy(object, {
         *   get(target, property, receiver) {
         *     if (property === kCustomKeyForMyProxy) {
         *       // use associated data
         *       return kCustomKeyForMyProxy.data.thing
         *     }
         *     return Reflect.get(target, property, receiver)
         *   }
         * })
         */
        get keys() {
            return keys;
        },
    },
    [extension_1.Patch.kMutablyHidden]: {
        /**
         * This method generates an object based on the trap type and values
         * provided. The trap type is a string that corresponds to a Proxy handler
         * method, and the values are either an array or an object that maps to
         * the parameters of the handler method.
         *
         * If the trap type is not a valid Proxy handler method, the function
         * returns undefined. If the values are an array, they are mapped to the
         * parameters of the handler method in order. If the values are an object,
         * only the entries that correspond to the parameters of the handler
         * method are used.
         *
         * @param {array | string} trapType - Either a key into the Proxy.types
         * object or the value that such a key might point to (i.e. an array of
         * string names, in order, that the trap of the same name expects)
         * @param {array | object} values - The values to be used for the trap
         * parameters.
         * @returns {object} An object that maps the trap parameters to the
         * provided values.
         *
         * @example
         * // note that when values is an array, the order needs to match the
         * // order of expected parameters for the trap function or the behavior
         * // is undefined.
         * trapParams('get', [
         *   'target',
         *   'property',
         *   'receiver'
         * ])
         * // Returns: {
         * //   target: 'target', property: 'property', receiver: 'receiver'
         * // }
         *
         * trapParams(Proxy.types.get, {
         *   target: 'target',
         *   property: 'property',
         *   receiver: 'receiver'
         * })
        * // Returns: {
        * //   target: 'target', property: 'property', receiver: 'receiver'
        * // }
        */
        trapParams(trapType, values) {
            if ((isString(trapType) && !(~Proxy.types.indexOf(trapType))) ||
                !Array.isArray(trapType)) {
                return undefined;
            }
            let argumentNames = isString(trapType)
                ? Proxy.types[trapType]
                : trapType.map(element => String(element));
            let object = Object.create(Object.prototype);
            if (!Array.isArray(values) && !Object.isObject(values)) {
                values = [values];
                for (let i = 1; i < argumentNames.length; i++) {
                    values.push(undefined);
                }
            }
            if (Array.isArray(values)) {
                argumentNames.reduce((acc, argName, index) => {
                    acc[argName] = values?.[index];
                }, object);
            }
            else if (isObject(values)) {
                for (let [key, value] of Object.entries(values)) {
                    if (key in argumentNames) {
                        object[key] = value;
                    }
                }
            }
            return object;
        },
        types: {
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
        },
    }
});
//# sourceMappingURL=proxy.extensions.js.map