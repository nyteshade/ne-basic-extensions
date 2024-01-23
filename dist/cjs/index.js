"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controls = exports.InstancePatches = exports.StaticPatches = exports.Patches = exports.Extensions = exports.all = void 0;
const functionextensions_js_1 = require("./functionextensions.js");
const objectextensions_js_1 = require("./objectextensions.js");
const mapextensions_js_1 = require("./mapextensions.js");
const setextensions_js_1 = require("./setextensions.js");
const reflectextensions_js_1 = require("./reflectextensions.js");
const stringextensions_js_1 = require("./stringextensions.js");
const symbolextensions_js_1 = require("./symbolextensions.js");
const arrayextensions_js_1 = require("./arrayextensions.js");
const descriptor_js_1 = require("./newClasses/descriptor.js");
const globals_js_1 = require("./globals.js");
const refset_js_1 = require("./newClasses/refset.js");
const refmap_js_1 = require("./newClasses/refmap.js");
const deferred_js_1 = require("./newClasses/deferred.js");
const asyncIterable_js_1 = require("./newClasses/asyncIterable.js");
const iterable_js_1 = require("./newClasses/iterable.js");
const StaticPatches = [
    [Object, objectextensions_js_1.ObjectExtensions],
    [Function, functionextensions_js_1.FunctionExtensions],
    [Reflect, reflectextensions_js_1.ReflectExtensions],
    [String, stringextensions_js_1.StringExtensions],
    [Symbol, symbolextensions_js_1.SymbolExtensions],
];
exports.StaticPatches = StaticPatches;
const InstancePatches = [
    [Object.prototype, objectextensions_js_1.ObjectPrototypeExtensions],
    [Function.prototype, functionextensions_js_1.FunctionPrototypeExtensions],
    [Array.prototype, arrayextensions_js_1.ArrayPrototypeExtensions],
    [Map.prototype, mapextensions_js_1.MapPrototypeExtensions],
    [Set.prototype, setextensions_js_1.SetPrototypeExtensions],
];
exports.InstancePatches = InstancePatches;
const Patches = new Map([
    ...StaticPatches,
    ...InstancePatches,
]);
exports.Patches = Patches;
const Extensions = {
    global: globals_js_1.GlobalFunctionsAndProps,
    [asyncIterable_js_1.AsyncIterableExtensions.key]: asyncIterable_js_1.AsyncIterableExtensions,
    [asyncIterable_js_1.AsyncIteratorExtensions.key]: asyncIterable_js_1.AsyncIteratorExtensions,
    [deferred_js_1.DeferredExtension.key]: deferred_js_1.DeferredExtension,
    [descriptor_js_1.DescriptorExtensions.key]: descriptor_js_1.DescriptorExtensions,
    [iterable_js_1.IterableExtensions.key]: iterable_js_1.IterableExtensions,
    [iterable_js_1.IteratorExtensions.key]: iterable_js_1.IteratorExtensions,
    [refmap_js_1.RefMapExtensions.key]: refmap_js_1.RefMapExtensions,
    [refset_js_1.RefSetExtensions.key]: refset_js_1.RefSetExtensions,
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
    enableStaticPatches(filter = ([owner, extension]) => true) {
        const patches = StaticPatches.filter(toFilterFn(filter));
        patches.forEach(([_, extension]) => extension.apply());
        return patches;
    },
    enableInstancePatches(filter = ([owner, extension]) => true) {
        const patches = InstancePatches.filter(toFilterFn(filter));
        patches.forEach(([_, extension]) => extension.apply());
        return patches;
    },
    enableExtensions() {
        Object.values(Extensions).forEach((extension) => { extension.apply(); });
    },
    disableAll() {
        Controls.disablePatches();
        Controls.disableExtensions();
    },
    disablePatches() {
        Patches.forEach((extension) => { extension.revert(); });
    },
    disableStaticPatches(filter = ([owner, extension]) => true) {
        const patches = StaticPatches.filter(toFilterFn(filter));
        patches.forEach(([_, extension]) => extension.revert());
        return patches;
    },
    disableInstancePatches(filter = ([owner, extension]) => true) {
        const patches = InstancePatches.filter(toFilterFn(filter));
        patches.forEach(([_, extension]) => extension.revert());
        return patches;
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
    Extensions,
    Patches,
    StaticPatches,
    InstancePatches,
    Controls,
    extensions: Extensions,
    patches: Patches,
    all: exports.all,
};
exports.default = results;
function toFilterFn(filter = ([owner, extension]) => true) {
    let filterFn = filter;
    if (typeof filterFn !== 'function') {
        const elements = Array.isArray(filter) ? filter : [filter];
        filterFn = ([owner, _]) => {
            for (const element of elements) {
                const elementStr = String(element);
                if (elementStr.startsWith('^')) {
                    if ((owner?.name ?? owner) != elementStr.substring(1)) {
                        return true;
                    }
                }
                if ((owner?.name ?? owner) == elementStr) {
                    return true;
                }
            }
            return false;
        };
    }
    return filterFn;
}
//# sourceMappingURL=index.js.map