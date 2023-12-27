"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionExtensions = void 0;
const extension_1 = require("@nejs/extension");
/**
 * The `FunctionExtensions` class is a patch applied to the built-in JavaScript `Function`
 * constructor. It extends `Function` with additional utility methods for determining the
 * specific type or nature of function-like objects. These methods allow developers to
 * distinguish between classes, regular functions, async functions, and arrow functions
 * in a more intuitive and straightforward manner. This class is part of the `@nejs/extension`
 * library and enhances the capabilities of function handling and introspection in JavaScript.
 */
exports.FunctionExtensions = new extension_1.Patch(Function, {
    /**
     * Determines if a given value is a class. It checks if the value is an instance of
     * `Function` and if its string representation includes the keyword 'class'. This method
     * is useful for distinguishing classes from other function types in JavaScript.
     *
     * @param {*} value - The value to be checked.
     * @returns {boolean} Returns `true` if the value is a class, otherwise `false`.
     */
    isClass(value) {
        return value instanceof Function && String(value).includes('class');
    },
    /**
     * Checks if a given value is a regular function. This method verifies if the value is
     * an instance of `Function`, which includes regular functions, classes, and async
     * functions but excludes arrow functions.
     *
     * @param {*} value - The value to be checked.
     * @returns {boolean} Returns `true` if the value is a regular function, otherwise `false`.
     */
    isFunction(value) {
        return value instanceof Function;
    },
    /**
     * Determines if a given value is an asynchronous function. It checks if the value is an
     * instance of `Function` and if its string representation includes the keyword 'Async'.
     * This method is particularly useful for identifying async functions.
     *
     * @param {*} value - The value to be checked.
     * @returns {boolean} Returns `true` if the value is an async function, otherwise `false`.
     */
    isAsync(value) {
        const stringTag = /(\w+)]/g.exec(Object.prototype.toString.call(value))[1];
        return (value instanceof Function &&
            stringTag.includes('Async'));
    },
    /**
     * Checks if a given value is an arrow function. It verifies if the value is an instance
     * of `Function`, if its string representation includes the '=>' symbol, and if it lacks
     * a prototype, which is a characteristic of arrow functions in JavaScript.
     *
     * @param {*} value - The value to be checked.
     * @returns {boolean} Returns `true` if the value is an arrow function, otherwise `false`.
     */
    isBigArrow(value) {
        return (value instanceof Function &&
            String(value).includes('=>') &&
            !String(value).startsWith('bound') &&
            !Reflect.has(value, 'prototype'));
    },
    /**
     * Determines if a given value is a bound function. Bound functions are created using
     * the `Function.prototype.bind` method, which allows setting the `this` value at the
     * time of binding. This method checks if the value is an instance of `Function`, if
     * its string representation starts with 'bound', and if it lacks a `prototype`
     * property. These characteristics are indicative of bound functions in JavaScript.
     *
     * @param {*} value - The value to be checked, typically a function.
     * @returns {boolean} Returns `true` if the value is a bound function, otherwise
     * `false`. Bound functions have a specific format in their string representation
     * and do not have their own `prototype` property.
     */
    isBound(value) {
        return (value instanceof Function &&
            String(value).startsWith('bound') &&
            !Reflect.has(value, 'prototype'));
    },
});
