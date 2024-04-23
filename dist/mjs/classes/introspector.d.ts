export class Introspector {
    static addExpansion(array: any): any;
    static accessors(owner?: typeof globalThis, keys?: any[]): Map<any, any>;
    static classes(owner?: typeof globalThis): any;
    static functions(owner?: typeof globalThis): any;
    static objects(owner?: typeof globalThis): any;
    static properties(owner?: typeof globalThis): any;
    static symbols(owner?: typeof globalThis): any;
    static metadata(owner: any, key: any): {
        owner: any;
        key: any;
        descriptor: undefined;
        value: undefined;
        readonly type: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
    };
    static fetcher(typeNameOrTyperFn: any, regExp?: undefined, searchClass?: ObjectConstructor, searchFunction?: string, owner?: typeof globalThis): any;
    static makeReport(owner?: typeof globalThis): {};
}
export const IntrospectorExtensions: Extension;
import { Extension } from '@nejs/extension';
