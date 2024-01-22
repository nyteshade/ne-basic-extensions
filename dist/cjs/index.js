"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controls = exports.Patches = exports.Extensions = exports.all = void 0;
const functionextensions_js_1 = require("./functionextensions.js");
const objectextensions_js_1 = require("./objectextensions.js");
const mapextensions_js_1 = require("./mapextensions.js");
const reflectextensions_js_1 = require("./reflectextensions.js");
const stringextensions_js_1 = require("./stringextensions.js");
const symbolextensions_js_1 = require("./symbolextensions.js");
const arrayextensions_js_1 = require("./arrayextensions.js");
const descriptor_js_1 = require("./newClasses/descriptor.js");
const globals_js_1 = require("./globals.js");
const refset_js_1 = require("./newClasses/refset.js");
const refmap_js_1 = require("./newClasses/refmap.js");
const asyncIterable_js_1 = require("./newClasses/asyncIterable.js");
const iterable_js_1 = require("./newClasses/iterable.js");
const Patches = new Map([
    [Object, objectextensions_js_1.ObjectExtensions],
    [Function, functionextensions_js_1.FunctionExtensions],
    [Reflect, reflectextensions_js_1.ReflectExtensions],
    [String, stringextensions_js_1.StringExtensions],
    [Symbol, symbolextensions_js_1.SymbolExtensions],
    [Object.prototype, objectextensions_js_1.ObjectPrototypeExtensions],
    [Array.prototype, arrayextensions_js_1.ArrayPrototypeExtensions],
    [Map.prototype, mapextensions_js_1.MapPrototypeExtensions],
    [globalThis, globals_js_1.GlobalFunctionsAndProps],
]);
exports.Patches = Patches;
const Extensions = {
    [descriptor_js_1.DescriptorExtensions.key]: descriptor_js_1.DescriptorExtensions,
    [asyncIterable_js_1.AsyncIterableExtensions.key]: asyncIterable_js_1.AsyncIterableExtensions,
    [asyncIterable_js_1.AsyncIteratorExtensions.key]: asyncIterable_js_1.AsyncIteratorExtensions,
    [iterable_js_1.IterableExtensions.key]: iterable_js_1.IterableExtensions,
    [iterable_js_1.IteratorExtensions.key]: iterable_js_1.IteratorExtensions,
    [refset_js_1.RefSetExtensions.key]: refset_js_1.RefSetExtensions,
    [refmap_js_1.RefMapExtensions.key]: refmap_js_1.RefMapExtensions,
};
exports.Extensions = Extensions;
const Controls = {};
exports.Controls = Controls;
Object.assign(Controls, {
    enableAll() {
        Controls.enablePatches();
        Controls.enableExtensions();
    },
    enablePatches() {
        Patches.forEach((extension) => { extension.apply(); });
    },
    enableExtensions() {
        Object.values(Extensions).forEach((extension) => { extension.apply(); });
    },
    disableAll(owners) {
        Controls.disablePatches();
        Controls.disableExtensions();
    },
    disablePatches() {
        Patches.forEach((extension) => { extension.revert(); });
    },
    disableExtensions() {
        Object.values(Extensions).forEach((extension) => { extension.revert(); });
    },
});
exports.all = (() => {
    const extensions = [
        ...Array.from(Patches.values()),
        ...Array.from(Object.values(Extensions)),
    ];
    const dest = extensions.reduce((accumulator, extension) => {
        Reflect.ownKeys(extension.patchEntries).reduce((_, key) => {
            const entry = extension.patchEntries[key];
            if (entry.isAccessor)
                accumulator[key] = new descriptor_js_1.Descriptor(entry.descriptor);
            else
                accumulator[key] = entry.computed;
            return accumulator;
        }, accumulator);
        return accumulator;
    }, {});
    return dest;
})();
const results = {
    ...Controls,
    extensions: Extensions,
    patches: Patches,
    all: exports.all,
};
exports.default = results;
//# sourceMappingURL=index.js.map