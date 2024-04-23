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
exports.NewClassesExtension = void 0;
const extension_1 = require("@nejs/extension");
const asyncIterable_js_1 = require("./asyncIterable.js");
__exportStar(require("./asyncIterable.js"), exports);
const deferred_js_1 = require("./deferred.js");
__exportStar(require("./deferred.js"), exports);
const descriptor_js_1 = require("./descriptor.js");
__exportStar(require("./descriptor.js"), exports);
const introspector_js_1 = require("./introspector.js");
__exportStar(require("./introspector.js"), exports);
const iterable_js_1 = require("./iterable.js");
__exportStar(require("./iterable.js"), exports);
const param_parser_js_1 = require("./param.parser.js");
__exportStar(require("./param.parser.js"), exports);
const pluggable_proxy_js_1 = require("./pluggable.proxy.js");
__exportStar(require("./pluggable.proxy.js"), exports);
const refmap_js_1 = require("./refmap.js");
__exportStar(require("./refmap.js"), exports);
const refset_js_1 = require("./refset.js");
__exportStar(require("./refset.js"), exports);
const symkeys_js_1 = require("./symkeys.js");
__exportStar(require("./symkeys.js"), exports);
const type_js_1 = require("./type.js");
__exportStar(require("./type.js"), exports);
exports.NewClassesExtension = new extension_1.Patch(globalThis, {
    AsyncIterable: asyncIterable_js_1.AsyncIterable,
    AsyncIterator: asyncIterable_js_1.AsyncIterator,
    Deferred: deferred_js_1.Deferred,
    Descriptor: descriptor_js_1.Descriptor,
    Introspector: introspector_js_1.Introspector,
    Iterable: iterable_js_1.Iterable,
    Iterator: iterable_js_1.Iterator,
    ParamParser: param_parser_js_1.ParamParser,
    PluggableProxy: pluggable_proxy_js_1.PluggableProxy,
    ProxyHandler: pluggable_proxy_js_1.ProxyHandler,
    RefMap: refmap_js_1.RefMap,
    RefSet: refset_js_1.RefSet,
    Symkeys: symkeys_js_1.Symkeys,
    Type: type_js_1.Type,
});
//# sourceMappingURL=index.js.map