import { FunctionExtensions, FunctionPrototypeExtensions } from './functionextensions.js';
import { ObjectExtensions, ObjectPrototypeExtensions } from './objectextensions.js';
import { MapPrototypeExtensions } from './mapextensions.js';
import { SetPrototypeExtensions } from './setextensions.js';
import { ReflectExtensions } from './reflectextensions.js';
import { StringExtensions } from './stringextensions.js';
import { SymbolExtensions } from './symbolextensions.js';
import { ArrayPrototypeExtensions } from './arrayextensions.js';
import { DescriptorExtensions, Descriptor } from './newClasses/descriptor.js';
import { GlobalFunctionsAndProps } from './globals.js';
import { RefSetExtensions } from './newClasses/refset.js';
import { RefMapExtensions } from './newClasses/refmap.js';
import { DeferredExtension } from './newClasses/deferred.js';
import { AsyncIteratorExtensions, AsyncIterableExtensions } from './newClasses/asyncIterable.js';
import { IteratorExtensions, IterableExtensions } from './newClasses/iterable.js';
const StaticPatches = [
    [Object, ObjectExtensions],
    [Function, FunctionExtensions],
    [Reflect, ReflectExtensions],
    [String, StringExtensions],
    [Symbol, SymbolExtensions],
];
const InstancePatches = [
    [Object.prototype, ObjectPrototypeExtensions],
    [Function.prototype, FunctionPrototypeExtensions],
    [Array.prototype, ArrayPrototypeExtensions],
    [Map.prototype, MapPrototypeExtensions],
    [Set.prototype, SetPrototypeExtensions],
];
const Patches = new Map([
    ...StaticPatches,
    ...InstancePatches,
]);
const Extensions = {
    global: GlobalFunctionsAndProps,
    [AsyncIterableExtensions.key]: AsyncIterableExtensions,
    [AsyncIteratorExtensions.key]: AsyncIteratorExtensions,
    [DeferredExtension.key]: DeferredExtension,
    [DescriptorExtensions.key]: DescriptorExtensions,
    [IterableExtensions.key]: IterableExtensions,
    [IteratorExtensions.key]: IteratorExtensions,
    [RefMapExtensions.key]: RefMapExtensions,
    [RefSetExtensions.key]: RefSetExtensions,
};
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
    const extensions = [
        ...Array.from(Patches.values()),
        ...Array.from(Object.values(Extensions)),
    ];
    const dest = extensions.reduce((accumulator, extension) => {
        Reflect.ownKeys(extension.patchEntries).reduce((_, key) => {
            const entry = extension.patchEntries[key];
            if (entry.isAccessor)
                accumulator[key] = new Descriptor(entry.descriptor);
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
    all,
};
export default results;
export { Extensions, Patches, StaticPatches, InstancePatches, Controls, };
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