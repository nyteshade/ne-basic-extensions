export * from "./utils/stdout.js";
export * from "./utils/copy.object.js";
export * from "./utils/toolkit.js";
export * from "./utils/descriptor.utils.js";
export const Classes: {};
export namespace all {
    let patches: {};
    let classes: {};
    let global: {};
}
export default results;
declare namespace results {
    export { all };
    export { Controls };
    export { Extensions };
    export { Extensions as extensions };
    export { GlobalFunctionsAndProps };
    export { InstancePatches };
    export { Patches };
    export { Patches as patches };
    export { StaticPatches };
    export { StdoutGlobalPatches };
}
export const Extensions: {};
export const Patches: Map<any, any>;
export const StaticPatches: ((string | import("@nejs/extension").Patch | ArrayConstructor)[] | (string | import("@nejs/extension").Patch | BigIntConstructor)[] | (string | import("@nejs/extension").Patch | FunctionConstructor)[] | (string | import("@nejs/extension").Patch | JSON)[] | (string | import("@nejs/extension").Patch | MapConstructor)[] | (string | import("@nejs/extension").Patch | NumberConstructor)[] | (string | import("@nejs/extension").Patch | ObjectConstructor)[] | (string | import("@nejs/extension").Patch | typeof Reflect)[] | (string | import("@nejs/extension").Patch | RegExpConstructor)[] | (string | import("@nejs/extension").Patch | SetConstructor)[] | (string | import("@nejs/extension").Patch | StringConstructor)[] | (string | import("@nejs/extension").Patch | SymbolConstructor)[])[];
export const InstancePatches: ((string | import("@nejs/extension").Patch | BigInt)[] | (string | Number | import("@nejs/extension").Patch)[] | (string | Object)[])[];
export const Controls: {};
import { GlobalFunctionsAndProps } from './global.this.js';
import { StdoutGlobalPatches } from './utils/stdout.js';
export { GlobalFunctionsAndProps };
