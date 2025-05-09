import { ArrayExtensions, ArrayPrototypeExtensions } from './array.extensions.js';
import { BigIntExtensions, BigIntPrototypeExtensions } from './big.int.extension.js';
import { FunctionExtensions, FunctionPrototypeExtensions } from './function.extensions.js';
import { GlobalFunctionsAndProps } from './global.this.js';
import { JSONExtensions } from './json.extensions.js';
import { MapExtensions, MapPrototypeExtensions } from './map.extensions.js';
import { NumberExtensions, NumberPrototypeExtensions } from './number.extension.js';
import { ObjectExtensions, ObjectPrototypeExtensions } from './object.extensions.js';
import { ReflectExtensions } from './reflect.extensions.js';
import { RegExpExtensions } from './regular.expression.extensions.js';
import { SetExtensions, SetPrototypeExtensions } from './set.extensions.js';
import { StringExtensions, StringPrototypeExtensions } from './string.extensions.js';
import { SymbolExtensions, SymbolPrototypeExtensions } from './symbol.extensions.js';
import { DeferredExtension } from './classes/deferred.js';
import { DescriptorExtensions, Descriptor } from './classes/descriptor.js';
import { EnumExtension, Enum } from './classes/enum.js';
import { IntrospectorExtensions } from './classes/introspector.js';
import { IteratorExtensions, IterableExtensions } from './classes/iterable.js';
import { ParamParserExtensions } from './classes/param.parser.js';
import { PropertyExtensions } from './classes/property.js';
import { PluggableProxyExtensions, ProxyHandlerExtensions, PluggableProxyExtensionSet } from './classes/pluggable.proxy.js';
import { RefMapExtensions } from './classes/refmap.js';
import { RefSetExtensions } from './classes/refset.js';
import { SymkeysExtension } from './classes/symkeys.js';
import { TypeExtensions } from './classes/type.js';
export * from './utils/stdout.js';
import { StringConsole, StdoutGlobalPatches, StringConsoleExtension, captureStdout, } from './utils/stdout.js';
export * from './utils/copy.object.js';
export * from './utils/toolkit.js';
export * from './utils/descriptor.utils.js';
import { AsyncIteratorExtensions, AsyncIterableExtensions } from './classes/asyncIterable.js';
const StaticPatches = [
    [Array, ArrayExtensions, Array.name],
    [BigInt, BigIntExtensions, BigInt.name],
    [Function, FunctionExtensions, Function.name],
    [JSON, JSONExtensions, 'JSON'], // Missing a .name property
    [Map, MapExtensions, Map.name],
    [Number, NumberExtensions, Number.name],
    [Object, ObjectExtensions, Object.name],
    [Reflect, ReflectExtensions, 'Reflect'], // Missing a .name property
    [RegExp, RegExpExtensions, RegExp.name],
    [Set, SetExtensions, Set.name],
    [String, StringExtensions, String.name],
    [Symbol, SymbolExtensions, 'Symbol'], // Missing a .name property
];
const InstancePatches = [
    [Array.prototype, ArrayPrototypeExtensions, Array.name],
    [BigInt.prototype, BigIntPrototypeExtensions, BigInt.name],
    [Function.prototype, FunctionPrototypeExtensions, Function.name],
    [Map.prototype, MapPrototypeExtensions, Map.name],
    [Number.prototype, NumberPrototypeExtensions, Number.name],
    [Object.prototype, ObjectPrototypeExtensions, Object.name],
    [Set.prototype, SetPrototypeExtensions, Set.name],
    [String.prototype, StringPrototypeExtensions, String.name],
    [Symbol.prototype, SymbolPrototypeExtensions, Symbol.name],
];
const Patches = new Map([
    ...StaticPatches,
    ...InstancePatches,
    [globalThis, GlobalFunctionsAndProps, 'globalThis'], // Missing .name property
    [globalThis, StdoutGlobalPatches, 'globalThis'], // Missing .name property
]);
const Extensions = {
    [AsyncIterableExtensions.key]: AsyncIterableExtensions,
    [AsyncIteratorExtensions.key]: AsyncIteratorExtensions,
    [DeferredExtension.key]: DeferredExtension,
    [DescriptorExtensions.key]: DescriptorExtensions,
    [EnumExtension.key]: EnumExtension,
    [IntrospectorExtensions.key]: IntrospectorExtensions,
    [IterableExtensions.key]: IterableExtensions,
    [IteratorExtensions.key]: IteratorExtensions,
    [ParamParserExtensions.key]: ParamParserExtensions,
    [PluggableProxyExtensions.key]: PluggableProxyExtensions,
    [ProxyHandlerExtensions.key]: ProxyHandlerExtensions,
    [PropertyExtensions.key]: PropertyExtensions,
    [RefMapExtensions.key]: RefMapExtensions,
    [RefSetExtensions.key]: RefSetExtensions,
    [StringConsoleExtension.key]: StringConsoleExtension,
    [SymkeysExtension.key]: SymkeysExtension,
    [TypeExtensions.key]: TypeExtensions,
};
export const Classes = {};
for (const extension of Object.values(Extensions)) {
    const fnOrClass = extension.class || extension.function;
    Classes[fnOrClass.name] = fnOrClass;
}
const Controls = {};
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
export const all = (() => {
    const dest = {
        patches: {},
        classes: {},
        global: {},
    };
    const entriesReducer = (accumulator, [key, entry]) => {
        const descriptor = new Descriptor(entry.descriptor, entry.owner);
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
    const globals = [...GlobalFunctionsAndProps].concat([...StdoutGlobalPatches]);
    for (const [key, entry] of globals) {
        const descriptor = new Descriptor(entry.descriptor, entry.owner);
        Object.defineProperty(dest.global, key, descriptor.toObject(true));
    }
    return dest;
})();
const results = {
    ...Controls,
    all,
    Controls,
    Extensions,
    extensions: Extensions,
    GlobalFunctionsAndProps,
    InstancePatches,
    Patches,
    patches: Patches,
    StaticPatches,
    StdoutGlobalPatches,
};
export default results;
export { Extensions, Patches, StaticPatches, InstancePatches, Controls, GlobalFunctionsAndProps, };
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