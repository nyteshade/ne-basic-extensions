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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalFunctionsAndProps = exports.Controls = exports.InstancePatches = exports.StaticPatches = exports.Patches = exports.Extensions = exports.all = exports.Classes = void 0;
const array_extensions_js_1 = require("./array.extensions.js");
const big_int_extension_js_1 = require("./big.int.extension.js");
const function_extensions_js_1 = require("./function.extensions.js");
const global_this_js_1 = require("./global.this.js");
Object.defineProperty(exports, "GlobalFunctionsAndProps", { enumerable: true, get: function () { return global_this_js_1.GlobalFunctionsAndProps; } });
const json_extensions_js_1 = require("./json.extensions.js");
const map_extensions_js_1 = require("./map.extensions.js");
const number_extension_js_1 = require("./number.extension.js");
const object_extensions_js_1 = require("./object.extensions.js");
const reflect_extensions_js_1 = require("./reflect.extensions.js");
const regular_expression_extensions_js_1 = require("./regular.expression.extensions.js");
const set_extensions_js_1 = require("./set.extensions.js");
const string_extensions_js_1 = require("./string.extensions.js");
const symbol_extensions_js_1 = require("./symbol.extensions.js");
const deferred_js_1 = require("./classes/deferred.js");
const descriptor_js_1 = require("./classes/descriptor.js");
const introspector_js_1 = require("./classes/introspector.js");
const iterable_js_1 = require("./classes/iterable.js");
const param_parser_js_1 = require("./classes/param.parser.js");
const property_js_1 = require("./classes/property.js");
const pluggable_proxy_js_1 = require("./classes/pluggable.proxy.js");
const refmap_js_1 = require("./classes/refmap.js");
const refset_js_1 = require("./classes/refset.js");
const symkeys_js_1 = require("./classes/symkeys.js");
const type_js_1 = require("./classes/type.js");
__exportStar(require("./utils/copy.object.js"), exports);
__exportStar(require("./utils/toolkit.js"), exports);
const asyncIterable_js_1 = require("./classes/asyncIterable.js");
const StaticPatches = [
    [Array, array_extensions_js_1.ArrayExtensions, Array.name],
    [BigInt, big_int_extension_js_1.BigIntExtensions, BigInt.name],
    [Function, function_extensions_js_1.FunctionExtensions, Function.name],
    [JSON, json_extensions_js_1.JSONExtensions, 'JSON'], // Missing a .name property
    [Map, map_extensions_js_1.MapExtensions, Map.name],
    [Number, number_extension_js_1.NumberExtensions, Number.name],
    [Object, object_extensions_js_1.ObjectExtensions, Object.name],
    [Reflect, reflect_extensions_js_1.ReflectExtensions, 'Reflect'], // Missing a .name property
    [RegExp, regular_expression_extensions_js_1.RegExpExtensions, RegExp.name],
    [Set, set_extensions_js_1.SetExtensions, Set.name],
    [String, string_extensions_js_1.StringExtensions, String.name],
    [Symbol, symbol_extensions_js_1.SymbolExtensions, 'Symbol'], // Missing a .name property
];
exports.StaticPatches = StaticPatches;
const InstancePatches = [
    [Array.prototype, array_extensions_js_1.ArrayPrototypeExtensions, Array.name],
    [BigInt.prototype, big_int_extension_js_1.BigIntPrototypeExtensions, BigInt.name],
    [Function.prototype, function_extensions_js_1.FunctionPrototypeExtensions, Function.name],
    [Map.prototype, map_extensions_js_1.MapPrototypeExtensions, Map.name],
    [Number.prototype, number_extension_js_1.NumberPrototypeExtensions, Number.name],
    [Object.prototype, object_extensions_js_1.ObjectPrototypeExtensions, Object.name],
    [Set.prototype, set_extensions_js_1.SetPrototypeExtensions, Set.name],
    [String.prototype, string_extensions_js_1.StringPrototypeExtensions, String.name],
    [Symbol.prototype, symbol_extensions_js_1.SymbolPrototypeExtensions, Symbol.name],
];
exports.InstancePatches = InstancePatches;
const Patches = new Map([
    ...StaticPatches,
    ...InstancePatches,
]);
exports.Patches = Patches;
const Extensions = {
    [asyncIterable_js_1.AsyncIterableExtensions.key]: asyncIterable_js_1.AsyncIterableExtensions,
    [asyncIterable_js_1.AsyncIteratorExtensions.key]: asyncIterable_js_1.AsyncIteratorExtensions,
    [deferred_js_1.DeferredExtension.key]: deferred_js_1.DeferredExtension,
    [descriptor_js_1.DescriptorExtensions.key]: descriptor_js_1.DescriptorExtensions,
    [introspector_js_1.IntrospectorExtensions.key]: introspector_js_1.IntrospectorExtensions,
    [iterable_js_1.IterableExtensions.key]: iterable_js_1.IterableExtensions,
    [iterable_js_1.IteratorExtensions.key]: iterable_js_1.IteratorExtensions,
    [param_parser_js_1.ParamParserExtensions.key]: param_parser_js_1.ParamParserExtensions,
    [pluggable_proxy_js_1.PluggableProxyExtensions.key]: pluggable_proxy_js_1.PluggableProxyExtensions,
    [pluggable_proxy_js_1.ProxyHandlerExtensions.key]: pluggable_proxy_js_1.ProxyHandlerExtensions,
    [property_js_1.PropertyExtensions.key]: property_js_1.PropertyExtensions,
    [refmap_js_1.RefMapExtensions.key]: refmap_js_1.RefMapExtensions,
    [refset_js_1.RefSetExtensions.key]: refset_js_1.RefSetExtensions,
    [symkeys_js_1.SymkeysExtension.key]: symkeys_js_1.SymkeysExtension,
    [type_js_1.TypeExtensions.key]: type_js_1.TypeExtensions,
};
exports.Extensions = Extensions;
exports.Classes = {};
for (const extension of Object.values(Extensions)) {
    const fnOrClass = extension.class || extension.function;
    exports.Classes[fnOrClass.name] = fnOrClass;
}
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
        global_this_js_1.GlobalFunctionsAndProps.apply();
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
        global_this_js_1.GlobalFunctionsAndProps.revert();
    },
});
exports.all = (() => {
    const dest = {
        patches: {},
        classes: {},
        global: {},
    };
    const entriesReducer = (accumulator, [key, entry]) => {
        const descriptor = new descriptor_js_1.Descriptor(entry.descriptor, entry.owner);
        descriptor.applyTo(accumulator, key, true);
        return accumulator;
    };
    const staticPatchReducer = (accumulator, [_, patch, ownerName]) => {
        if (!accumulator?.[ownerName]) {
            accumulator[ownerName] = {};
        }
        [...patch].reduce(entriesReducer, accumulator[ownerName]);
        return accumulator;
    };
    const instancePatchReducer = (accumulator, [_, patch, ownerName]) => {
        if (!accumulator?.[ownerName])
            accumulator[ownerName] = {};
        if (!accumulator[ownerName]?.prototype)
            accumulator[ownerName].prototype = {};
        [...patch].reduce(entriesReducer, accumulator[ownerName].prototype);
        return accumulator;
    };
    StaticPatches.reduce(staticPatchReducer, dest.patches);
    InstancePatches.reduce(instancePatchReducer, dest.patches);
    (Object.values(Extensions)
        .flatMap(extension => [...extension])
        .reduce(entriesReducer, dest.classes));
    for (const [key, entry] of global_this_js_1.GlobalFunctionsAndProps) {
        const descriptor = new descriptor_js_1.Descriptor(entry.descriptor, entry.owner);
        Object.defineProperty(dest.global, key, descriptor.toObject(true));
    }
    return dest;
})();
const results = {
    ...Controls,
    Extensions,
    Patches,
    GlobalFunctionsAndProps: global_this_js_1.GlobalFunctionsAndProps,
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