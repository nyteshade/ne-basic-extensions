import { FunctionExtensions } from './functionextensions.js';
import { ObjectExtensions } from './objectextensions.js';
import { ReflectExtensions } from './reflectextensions.js';
import { ArrayPrototypeExtensions } from './arrayextensions.js';
import { Patch } from '@nejs/extension';
const Owners = [
    Object,
    Function,
    Reflect,
    Array.prototype,
];
export function enableAll(owners) {
    (owners || Owners).forEach(owner => {
        Patch.enableFor(owner);
    });
}
export function disableAll(owners) {
    (owners || Owners).forEach(owner => {
        Patch.disableFor(owner);
    });
}
export { ObjectExtensions, FunctionExtensions, ReflectExtensions, ArrayPrototypeExtensions, };
