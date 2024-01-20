import { FunctionExtensions } from './functionextensions.js';
import { ObjectExtensions } from './objectextensions.js';
import { ReflectExtensions } from './reflectextensions.js';
import { StringExtensions } from './stringextensions.js';
import { SymbolExtensions } from './symbolextensions.js';
import { ArrayPrototypeExtensions } from './arrayextensions.js';
import { DescriptorExtensions, Descriptor } from './ newClasses/descriptor.js';
import { GlobalFunctionsAndProps } from './globals.js';
import { RefSetExtensions } from './ newClasses/refset.js';
import { AsyncIteratorExtensions, AsyncIterableExtensions } from './ newClasses/asyncIterable.js';
import { IteratorExtensions, IterableExtensions } from './ newClasses/iterable.js';
const Patches = new Map([
    [Object, ObjectExtensions],
    [Function, FunctionExtensions],
    [Reflect, ReflectExtensions],
    [String, StringExtensions],
    [Symbol, SymbolExtensions],
    [Array.prototype, ArrayPrototypeExtensions],
    [globalThis, GlobalFunctionsAndProps],
]);
const Extensions = {
    [DescriptorExtensions.key]: DescriptorExtensions,
    [AsyncIterableExtensions.key]: AsyncIterableExtensions,
    [AsyncIteratorExtensions.key]: AsyncIteratorExtensions,
    [IterableExtensions.key]: IterableExtensions,
    [IteratorExtensions.key]: IteratorExtensions,
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
    extensions: Extensions,
    patches: Patches,
    all,
};
for (const key of Object.keys(Extensions)) {
    // Exports a constant string for each new new class that can be
    // used as a key to the Extensions map should they be referenced
    // individually. Should returned undefined and likely end up in
    // an error if the class is misreferenced or the code changes
    results[`k${key}`] = key;
}
export default results;
export { Extensions, Patches, Controls, };
//# sourceMappingURL=index.js.map