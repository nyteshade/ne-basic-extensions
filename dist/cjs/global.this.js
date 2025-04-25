"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalFunctionsAndProps = void 0;
const extension_1 = require("@nejs/extension");
const function_extensions_js_1 = require("./function.extensions.js");
const copyObject = __importStar(require("./utils/copy.object.js"));
const toolkit_js_1 = require("./utils/toolkit.js");
const { isClass, isFunction } = function_extensions_js_1.FunctionExtensions.patches;
const CustomInspect = Symbol.for('nodejs.util.inspect.custom');
exports.GlobalFunctionsAndProps = new extension_1.Patch(globalThis, {
    [extension_1.Patch.kMutablyHidden]: {
        /** copyObject suite exports into global */
        ...copyObject,
        /** Type toolkit exports into global */
        as: toolkit_js_1.as, has: toolkit_js_1.has, is: toolkit_js_1.is, si: toolkit_js_1.si,
        /**
         * The `isThenElse` function is a utility function that behaves like a
         * ternary operator. It takes three arguments: `boolValue`, `thenValue`,
         * and `elseValue`.
         *
         * It first checks the truthiness of `boolValue`.
         *
         * If `boolValue` is truthy, it returns `thenValue`; otherwise,
         * it returns `elseValue`.
         *
         * If `thenValue` or `elseValue` is a function, it will be invoked with
         * `boolValue` as an argument.
         *
         * If `elseValue` is not provided, it returns `boolValue` or `thenValue`
         * depending on the truthiness of `boolValue`.
         *
         * If only `boolValue` is provided, it simply returns `boolValue`.
         *
         * @param {any} boolValue - Any object or value that is tested for
         * truthiness.
         * @param {function | any} [thenValue] - The value to return if `boolValue`
         * is truthy. If a function, it's invoked with `boolValue`.
         * @param {function | any} [elseValue] - The value to return if `boolValue`
         * is falsy. If a function, it's invoked with `boolValue`.
         * @returns {boolean | any} The result of the ternary operation.
         *
         * @example
         * // Using values
         * isThenElse(true, 'yes', 'no');  // Returns: 'yes'
         * isThenElse(false, 'yes', 'no'); // Returns: 'no'
         *
         * // Using functions
         * isThenElse(true, val => val ? 'yes' : 'no');  // Returns: 'yes'
         * isThenElse(false, val => val ? 'yes' : 'no'); // Returns: 'no'
         */
        isThenElse(boolValue, thenValue, elseValue) {
            if (arguments.length > 1) {
                const _then = isFunction(thenValue) ? thenValue(boolValue) : thenValue;
                if (arguments.length > 2) {
                    const _else = isFunction(elseValue) ? thenValue(boolValue) : elseValue;
                    return boolValue ? _then : _else;
                }
                return boolValue || _then;
            }
            return boolValue;
        },
        /**
         * Transforms an object to mimic a specified prototype, altering its type
         * conversion and inspection behaviors. This function is especially useful
         * for creating objects that need to behave like different primitive types
         * under various operations.
         *
         * @param {Object} object - The object to be transformed.
         * @param {Function|Object} [prototype=String.prototype] - The prototype or
         * class to emulate. If a function is provided, its prototype is used.
         * Defaults to String.prototype.
         * @param {Function} [toPrimitive=(hint, val) => String(val)] - A function
         * defining how the object should be converted to a primitive value. It
         * receives a type hint ('number', 'string', or 'default') and the object,
         * returning the primitive value.
         * @returns {Object|null} The transformed object, or null if neither a class
         * nor a prototype could be derived from the provided prototype parameter.
         */
        maskAs(object, classPrototype, options) {
            const { prototype, toPrimitive } = GenericMask({ ...options, prototype: classPrototype });
            const base = { configurable: true, enumerable: false };
            const proto = isFunction(prototype) ? prototype.prototype : prototype;
            const klass = isClass(prototype) ? prototype : proto?.constructor;
            if (!klass && !proto) {
                return null;
            }
            Object.setPrototypeOf(object, proto);
            Object.defineProperties(object, {
                valueOf: {
                    value() { return String(toPrimitive('default', object)); }, ...base
                },
                [Symbol.toPrimitive]: {
                    value(hint) { return toPrimitive(hint, object); }, ...base
                },
                [Symbol.toStringTag]: { value: klass.name, ...base },
                [Symbol.species]: { get() { return klass; }, ...base },
                [CustomInspect]: { ...base, value(depth, opts, inspect) {
                        return inspect(this[Symbol.toPrimitive](), { ...opts, depth });
                    } }
            });
            return object;
        },
        /**
         * Masks an object as a string-like object by setting its prototype to
         * String and defining how it converts to primitive types. This is
         * particularly useful when an object needs to behave like a string in
         * certain contexts, such as type coercion or logging.
         *
         * @param {Object} object - The object to be masked as a string.
         * @param {string} [stringKey='value'] - The object property key used for
         * the string representation. Defaults to 'value'.
         * @param {Function} [toPrimitive] - Optional custom function for primitive
         * conversion. If omitted, a default function handling various conversion
         * hints is used.
         * @returns {Object|null} The string-masked object, or null if the object
         * doesn't have the specified stringKey property.
         */
        maskAsString(object, stringKey, toPrimitive) {
            if (object && Reflect.has(object, stringKey)) {
                return maskAs(object, StringMask(stringKey ?? 'value', toPrimitive));
            }
            return null;
        },
        /**
         * Masks an object as a number-like object. This allows the object to
         * behave like a number in operations like arithmetic and type coercion.
         * It sets the prototype to Number and defines custom conversion behavior.
         *
         * @param {Object} object - The object to be masked as a number
         * representation. Defaults to 'value'.
         * @param {Function} [toPrimitive] - Optional custom function for primitive
         * conversion. If not provided, a default function handling different
         * conversion hints is used.
         * @returns {Object|null} The number-masked object, or null if the object
         * doesn't have the specified numberKey property.
         */
        maskAsNumber(object, numberKey, toPrimitive) {
            if (object && Reflect.has(object, numberKey)) {
                return maskAs(object, NumberMask(numberKey ?? 'value', toPrimitive));
            }
            return null;
        },
        /**
         * Generates options for generic masking of an object, providing defaults for
         * prototype and toPrimitive function if not specified.
         *
         * @param {Object} options - The options object including prototype,
         * targetKey, and toPrimitive function.
         * @returns {Object} The options object with defaults applied as necessary.
         */
        GenericMask({ prototype, targetKey = 'value', toPrimitive }) {
            const options = { targetKey, toPrimitive, prototype };
            if (!isFunction(toPrimitive)) {
                options.toPrimitive = (hint, object) => {
                    let property = object[targetKey];
                    let isNum = ((typeof property === 'number' && Number.isFinite(property)) ||
                        (typeof property === 'string' &&
                            !isNaN(parseFloat(property)) && isFinite(property)));
                    switch (hint) {
                        case 'string':
                            return isNum ? String(property) : (property ?? String(object));
                        case 'number':
                            return isNum ? Number(property) : NaN;
                        case 'default':
                        default:
                            return isNum ? Number(property) : property;
                    }
                };
            }
            return options;
        },
        /**
         * Generates options for string masking of an object, providing a default
         * toPrimitive function if not specified.
         *
         * @param {string} targetKey - The object property key for string
         * representation.
         * @param {Function} toPrimitive - Custom function for primitive conversion.
         * @returns {Object} Options for string masking.
         */
        StringMask(targetKey, toPrimitive) {
            const options = { targetKey, toPrimitive, prototype: String.prototype };
            if (!isFunction(toPrimitive)) {
                options.toPrimitive = function toPrimitive(hint, object) {
                    switch (hint) {
                        case 'default': return object[targetKey];
                        case 'number': return parseInt(object[targetKey], 36);
                        case 'string': return String(object[targetKey]);
                        default: return object;
                    }
                };
            }
            return options;
        },
        /**
         * Generates options for number masking of an object, providing a default
         * toPrimitive function if not specified.
         *
         * @param {string} targetKey - The object property key for number
         * representation.
         * @param {Function} toPrimitive - Custom function for primitive conversion.
         * @returns {Object} Options for number masking.
         */
        NumberMask(targetKey, toPrimitive) {
            const options = { targetKey, toPrimitive, prototype: Number.prototype };
            if (!isFunction(toPrimitive)) {
                options.toPrimitive = function toPrimitive(hint, object) {
                    switch (hint) {
                        case 'default': return object[targetKey];
                        case 'number': return Number(object[targetKey]);
                        case 'string': return String(object[targetKey]);
                        default: return object;
                    }
                };
            }
            return options;
        },
        /**
         * Blends the properties of multiple objects into a new object. This
         * function creates a new object that inherits the prototype from the
         * root object and the properties of the other objects and their parent
         * prototypes.
         *
         * @param {Object} root - The root object to blend prototypes into.
         * @param {...Object} objects - The objects whose prototypes to blend.
         * @returns {Object} The new object with blended prototypes.
         *
         * @example
         * // Define some objects with properties
         * const obj1 = { prop1: 'value1' }
         * const obj2 = { prop2: 'value2' }
         * const obj3 = { prop3: 'value3' }
         *
         * // Blend the prototypes of obj2 and obj3 into obj1
         * const blended = blendProtos(obj1, obj2, obj3)
         *
         * // Now blended has properties from obj1, obj2, and obj3
         * console.log(blended.prop1) // Outputs: 'value1'
         * console.log(blended.prop2) // Outputs: 'value2'
         * console.log(blended.prop3) // Outputs: 'value3'
         */
        blendProtos(root, ...objects) {
            const descriptor = (o, k) => Object.getOwnPropertyDescriptor(o, k);
            const parent = o => Object.getPrototypeOf(o);
            const all = o => (Reflect
                .ownKeys(o)
                .reduce((a, k) => ({ ...a, [k]: descriptor(o, k) }), {}));
            const newRoot = Object.create(parent(root), objects.reduce);
            const protos = objects.map(object => parent(object));
            let descriptors = Object.create(null);
            let uniques = new Set;
            for (let object of protos) {
                let current = object;
                while (current) {
                    if (!uniques.has(current)) {
                        uniques.add(current);
                        descriptors = { ...descriptors, ...all(current) };
                    }
                    current = parent(current);
                }
            }
            const blendedPrototype = Object.create(parent(root), descriptors);
            return Object.setPrototypeOf(newRoot, blendedPrototype);
        },
    },
});
//# sourceMappingURL=global.this.js.map