export const all: any;
export default results;
declare namespace results {
    export { Extensions };
    export { Patches };
    export { StaticPatches };
    export { InstancePatches };
    export { Controls };
    export { Extensions as extensions };
    export { Patches as patches };
    export { all };
}
export namespace Extensions {
    export { GlobalFunctionsAndProps as global };
}
export const Patches: Map<any, any>;
export const StaticPatches: ((import("@nejs/extension").Patch | ObjectConstructor)[] | (import("@nejs/extension").Patch | FunctionConstructor)[] | (import("@nejs/extension").Patch | typeof Reflect)[] | (import("@nejs/extension").Patch | StringConstructor)[] | (import("@nejs/extension").Patch | SymbolConstructor)[])[];
export const InstancePatches: Object[][];
export const Controls: {};
import { GlobalFunctionsAndProps } from './globals.js';
