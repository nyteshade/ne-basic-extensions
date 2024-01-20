export const all: any;
export default results;
declare namespace results {
    export { Extensions as extensions };
    export { Patches as patches };
    export { all };
}
export const Extensions: {};
export const Patches: Map<ObjectConstructor, import("@nejs/extension").Patch>;
export const Controls: {};
