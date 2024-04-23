export class Type {
    static is(value: any, ofType: any): boolean;
    static of(value: any): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
    static named(value: any): any;
    static class(value: any, mapped: any): any;
    static isPrimitive(value: any): boolean;
    static get primitives(): () => Generator<"number" | "bigint" | "string" | "symbol" | "boolean" | "undefined", void, unknown>;
    static get typeOfTypes(): () => Generator<"number" | "object" | "bigint" | "function" | "string" | "symbol" | "boolean" | "undefined", void, unknown>;
    static mapped: Map<string | undefined, BigIntConstructor | undefined>;
    mapped: Map<string | undefined, BigIntConstructor | undefined>;
    of(value: any): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
    class(value: any): any;
    isPrimitive(value: any): boolean;
    serverJs: {
        nodejs: {
            'v21.1.0': {
                version: string;
                date: Date;
                classes: any;
                nodeSpecificClasses: any;
                functions: any;
                objects: any;
                properties: any;
                symbols: any;
            };
        };
        qjs: {
            v: {
                version: string;
                classes: any;
                functions: any;
                objects: any;
                properties: any;
                symbols: any;
            };
        };
    };
    browser: {
        arc: {
            version: string;
            userAgent: string;
            types: {
                classes: any;
                browserClasses: any;
            };
            methods: {
                readonly classes: any;
                readonly functions: void;
                readonly objects: void;
            };
        };
        safari: {};
    };
}
export const TypeExtensions: Extension;
import { Extension } from '@nejs/extension';
