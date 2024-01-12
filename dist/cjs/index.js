"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefSetExtensions = exports.IteratorExtensions = exports.IterableExtensions = exports.AsyncIteratorExtensions = exports.AsyncIterableExtensions = exports.DescriptorExtensions = exports.GlobalFunctionsAndProps = exports.ArrayPrototypeExtensions = exports.SymbolExtensions = exports.StringExtensions = exports.ReflectExtensions = exports.FunctionExtensions = exports.ObjectExtensions = exports.all = exports.disableNetNew = exports.disableAll = exports.enableNetNew = exports.enableAll = void 0;
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
const descriptor_js_1 = require("./descriptor.js");
Object.defineProperty(exports, "DescriptorExtensions", { enumerable: true, get: function () { return descriptor_js_1.DescriptorExtensions; } });
const globals_js_1 = require("./globals.js");
Object.defineProperty(exports, "GlobalFunctionsAndProps", { enumerable: true, get: function () { return globals_js_1.GlobalFunctionsAndProps; } });
const refset_js_1 = require("./refset.js");
Object.defineProperty(exports, "RefSetExtensions", { enumerable: true, get: function () { return refset_js_1.RefSetExtensions; } });
const asyncIterable_js_1 = require("./asyncIterable.js");
Object.defineProperty(exports, "AsyncIteratorExtensions", { enumerable: true, get: function () { return asyncIterable_js_1.AsyncIteratorExtensions; } });
Object.defineProperty(exports, "AsyncIterableExtensions", { enumerable: true, get: function () { return asyncIterable_js_1.AsyncIterableExtensions; } });
const iterable_js_1 = require("./iterable.js");
Object.defineProperty(exports, "IteratorExtensions", { enumerable: true, get: function () { return iterable_js_1.IteratorExtensions; } });
Object.defineProperty(exports, "IterableExtensions", { enumerable: true, get: function () { return iterable_js_1.IterableExtensions; } });
const extension_1 = require("@nejs/extension");
const Owners = [
    Object,
    Function,
    Reflect,
    String,
    Symbol,
    Array.prototype,
];
const NetNew = [
    globals_js_1.GlobalFunctionsAndProps,
    descriptor_js_1.DescriptorExtensions,
    asyncIterable_js_1.AsyncIterableExtensions,
    asyncIterable_js_1.AsyncIteratorExtensions,
    iterable_js_1.IterableExtensions,
    iterable_js_1.IteratorExtensions,
    refset_js_1.RefSetExtensions,
];
function enableAll(owners) {
    const list = owners || Owners;
    if (!list) {
        throw new Error('Unable to enable features without owners list');
    }
    list.forEach(owner => {
        extension_1.Patch.enableFor(owner);
    });
    enableNetNew();
}
exports.enableAll = enableAll;
function enableNetNew() {
    NetNew.forEach(extension => { extension.apply(); });
}
exports.enableNetNew = enableNetNew;
function disableAll(owners) {
    const list = owners || Owners;
    if (!list) {
        throw new Error('Unable to disable features without owners list');
    }
    list.forEach(owner => {
        extension_1.Patch.disableFor(owner);
    });
    disableNetNew();
}
exports.disableAll = disableAll;
function disableNetNew() {
    NetNew.forEach(extension => { extension.revert(); });
}
exports.disableNetNew = disableNetNew;
exports.all = (() => {
    let extensions = [
        objectextensions_js_1.ObjectExtensions,
        functionextensions_js_1.FunctionExtensions,
        reflectextensions_js_1.ReflectExtensions,
        stringextensions_js_1.StringExtensions,
        symbolextensions_js_1.SymbolExtensions,
        arrayextensions_js_1.ArrayPrototypeExtensions,
        globals_js_1.GlobalFunctionsAndProps,
        descriptor_js_1.DescriptorExtensions,
    ];
    const dest = extensions.reduce((accumulator, extension) => {
        Reflect.ownKeys(extension.patchEntries).reduce((_, key) => {
            accumulator[key] = extension.patchEntries[key].computed;
            return accumulator;
        }, accumulator);
        return accumulator;
    }, {});
    return dest;
})();
