"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayPrototypeExtensions = exports.SymbolExtensions = exports.StringExtensions = exports.ReflectExtensions = exports.FunctionExtensions = exports.ObjectExtensions = exports.disableAll = exports.enableAll = void 0;
const functionextensions_js_1 = require("./functionextensions.js");
Object.defineProperty(exports, "FunctionExtensions", { enumerable: true, get: function () { return functionextensions_js_1.FunctionExtensions; } });
const objectextensions_js_1 = require("./objectextensions.js");
Object.defineProperty(exports, "ObjectExtensions", { enumerable: true, get: function () { return objectextensions_js_1.ObjectExtensions; } });
const reflectextensions_js_1 = require("./reflectextensions.js");
Object.defineProperty(exports, "ReflectExtensions", { enumerable: true, get: function () { return reflectextensions_js_1.ReflectExtensions; } });
const stringextensions_js_1 = require("./stringextensions.js");
Object.defineProperty(exports, "StringExtensions", { enumerable: true, get: function () { return stringextensions_js_1.StringExtensions; } });
const symbolextensions_js_1 = require("./symbolextensions.js");
Object.defineProperty(exports, "SymbolExtensions", { enumerable: true, get: function () { return symbolextensions_js_1.SymbolExtensions; } });
const arrayextensions_js_1 = require("./arrayextensions.js");
Object.defineProperty(exports, "ArrayPrototypeExtensions", { enumerable: true, get: function () { return arrayextensions_js_1.ArrayPrototypeExtensions; } });
const extension_1 = require("@nejs/extension");
const Owners = [
    Object,
    Function,
    Reflect,
    String,
    Symbol,
    Array.prototype,
];
function enableAll(owners) {
    (owners || Owners).forEach(owner => {
        extension_1.Patch.enableFor(owner);
    });
}
exports.enableAll = enableAll;
function disableAll(owners) {
    (owners || Owners).forEach(owner => {
        extension_1.Patch.disableFor(owner);
    });
}
exports.disableAll = disableAll;