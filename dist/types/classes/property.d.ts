export class Property {
    /**
     * Creates an accessor property with customizable getter and setter functions.
     *
     * This method offers flexible ways to define accessor properties, including
     * support for storage-based getters and setters. It can handle various input
     * formats, making it versatile for different use cases.
     *
     * @param {string} name - The name of the accessor property.
     * @param {Object} accessors - Object containing getter and/or setter functions.
     * @param {Function} [accessors.get] - Getter function for the property.
     * @param {Function} [accessors.set] - Setter function for the property.
     * @param {Object} [accessors.prototype] - Prototype object for getter/setter.
     * @param {Object} [options] - Additional options for the accessor property.
     * @param {boolean} [options.configurable=true] - Whether property is configurable.
     * @param {boolean} [options.enumerable=true] - Whether property is enumerable.
     * @param {Object} [options.storage] - Storage object for getter/setter closures.
     * @returns {Property} A new Property instance representing the accessor.
     * @throws {TypeError} If no name, getter, or setter is provided.
     *
     * @example
     * // Basic usage
     * Property.accessor('color', {
     *   get() { return this._color; },
     *   set(value) { this._color = value; }
     * });
     *
     * @example
     * // Using storage
     * Property.accessor('keyword', {
     *   get(storage) { return () => storage.keyword; },
     *   set(storage) { return (value) => { storage.keyword = value; } }
     * }, { storage: { keyword: 'initial' } });
     *
     * @example
     * // Using named getter function
     * Property.accessor('color', function get() { return 'red' })
     *
     * @example
     * // Using prototype
     * const ColorAccessors = {
     *   red: { get() { return this._red; } }
     * };
     * Property.accessor('red', ColorAccessors.red);
     */
    static accessor(name: string, { get, set, prototype }: {
        get?: Function | undefined;
        set?: Function | undefined;
        prototype?: Object | undefined;
    }, { configurable, enumerable, storage }?: {
        configurable?: boolean | undefined;
        enumerable?: boolean | undefined;
        storage?: Object | undefined;
    }): Property;
    static data(name: any, value: any, { writable, configurable, enumerable }?: {}): Property;
    static from(object: any, name: any): Property;
    static get is(): {
        object(value: any): any;
        descriptor(object: any): boolean;
    };
    constructor(key: any, descriptor: any);
    key: string | symbol;
    set descriptor(descriptor: {
        enumerable: any;
        configurable: any;
    });
    get descriptor(): {
        enumerable: any;
        configurable: any;
    };
    apply(toObject: any, asKey: any): any;
    get is(): {
        readonly accessor: boolean;
        readonly data: boolean;
    };
    toString(colors?: boolean, { key, descriptor }?: {}): string;
}
export const PropertyExtensions: Extension;
import { Extension } from '@nejs/extension';
