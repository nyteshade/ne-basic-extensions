export class Descriptor {
    /**
     * The function `getData` retrieves the value of a property from an object
     * if it exists and is a data property.
     *
     * @param {object} object - The "object" parameter is the object from which
     * we want to retrieve data.
     * @param {string|symbol} property - The `property` parameter is the name of
     * the property that you want to retrieve the data from.
     * @returns either the value of the specified property if it exists and is
     * a data property, or undefined if the property does not exist or is not
     * a data property.
     */
    static getData(object: object, property: string | symbol): any;
    /**
     * The function `getAccessor` checks if an object has a getter/setter accessor
     * for a given property and returns the accessor functions if found.
     *
     * @param object - The `object` parameter is the object from which we want to
     * retrieve the accessor for a specific property.
     * @param property - The `property` parameter is the name of the property for
     * which we want to get the accessor.
     * @returns an object that contains the getter and setter functions for the
     * specified property of the given object. If the property is an accessor
     * property (defined with a getter and/or setter), the returned object will
     * also have additional properties such as "accessor" and "descriptor". If
     * the property is not found or is not an accessor property, the function
     * returns undefined.
     */
    static getAccessor(object: any, property: any): any;
    /**
     * The function returns an object with enumerable and configurable properties
     * based on the input parameters.
     *
     * @param [enumerable=false] - A boolean value indicating whether the property
     * can be enumerated (listed) when iterating over the object's properties.
     * @param [configurable=false] - The `configurable` parameter determines
     * whether the property can be deleted or its attributes can be modified.
     * If `configurable` is set to `true`, the property can be deleted and its
     * attributes can be changed. If `configurable` is set to `false`, the
     * property cannot be deleted and
     * @returns An object with the properties `enumerable` and `configurable` is
     * being returned. The values of these properties are determined by the
     * arguments passed to the `base` function.
     */
    static base(enumerable?: boolean | undefined, configurable?: boolean | undefined): {
        enumerable: boolean;
        configurable: boolean;
    };
    /**
     * The function "newAccessor" creates a new property descriptor object with a
     * getter and setter function, along with optional enumerable and configurable
     * flags.
     *
     * @param getter - The getter parameter is a function that will be used as the
     * getter for the property. It will be called when the property is accessed.
     * @param setter - The `setter` parameter is a function that will be used as
     * the setter for the property. It will be called whenever the property is
     * assigned a new value.
     * @param [] - - `getter`: A function that will be used as the getter for the
     * property.
     * @returns an object with properties "get", "set", "enumerable", and
     * "configurable".
     */
    static accessor(...args: any[]): any;
    /**
     * The function "newData" creates a new data object with customizable
     * properties.
     *
     * @param value - The value parameter represents the value that will be
     * assigned to the property.
     * @param [writable=true] - The `writable` parameter determines whether the
     * value of the property can be changed. If `writable` is set to `true`, the
     * value can be changed. If `writable` is set to `false`, the value cannot be
     * changed.
     * @param [] - - `value`: The value to be assigned to the property.
     * @returns an object with properties `value`, `enumerable`, `writable`, and
     * `configurable`.
     */
    static data(value: any, writable?: boolean | undefined, { enumerable, configurable }?: {
        configurable: boolean;
        enumerable: boolean;
    } | undefined): any;
    /**
     * Shorthand for Object.getOwnPropertyDescriptor()
     *
     * @param {object} object a non-null object instance
     * @param {string|symbol} key a symbol or string referencing which key on the
     * object to return a descriptor for.
     * @returns an object descriptor for the requested field or null
     */
    static for(object: object, key: string | symbol, wrap?: boolean): PropertyDescriptor | Descriptor | null | undefined;
    /**
     * The function checks if an object is a likely an object descriptor in
     * JavaScript. This is determined as an object with some of the known
     * descriptor keys (e.g. enumerable, configurable, value, writable, get,
     * or set). Technically, any object could serve as a descriptor but this
     * function only returns true if known descriptor keys are found.
     *
     * @param {any} object - Any value we want to check for being a descriptor.
     * @param {boolean} returnStatsInstead defaults to false, but if the value
     * is `true` then an object with reasoning behind the decision of whether
     * or not the
     * @returns {IsDescriptorResponse} either a {@link boolean} value or
     * an object conforming to {@link IsDescriptorStats} if `returnStatsInstead`
     * is `true`
     *
     * @see {@link DescriptorUtils.isDescriptor}
     */
    static isDescriptor(object: any, returnStatsInstead?: boolean): IsDescriptorResponse;
    /**
     * The function checks if a given property descriptor or property of an
     * object is an accessor.
     *
     * @param {object} objectOrDescriptor - The `objectOrDescriptor` parameter
     * can be either a descriptor object or a property name.
     * @param {(string|number|symbol)?} property the property name you wish to
     * check the validity as an accessor descriptor. Only expected if the
     * `objectOrDescriptor` parameter is the object that would contain this
     * property.
     * @returns {@link Boolean} returning `true` if the `descriptor` object
     * has any keys that match the {@link Descriptor.ACCESSOR_KEYS} array,
     * otherwise it returns `false`.
     */
    static isAccessor(objectOrDescriptor: object, property: (string | number | symbol) | null): any;
    /**
     * The function checks if a given property or descriptor is a data property.
     *
     * @param {object} objectOrDescriptor - The `objectOrDescriptor` parameter
     * can be either a descriptor object or a property name.
     * @param {(string|number|symbol)?} property the property name you wish to
     * check the validity as an accessor descriptor. Only expected if the
     * `objectOrDescriptor` parameter is the object that would contain this
     * property.
     * @returns {@link Boolean} returning `true` if the `descriptor` object
     * has any keys that match the {@link Descriptor.DATA_KEYS} array, otherwise
     * it returns `false`.
     */
    static isData(objectOrDescriptor: object, property: (string | number | symbol) | null): any;
    /**
     * A base descriptor (new for each read) that is both enumerable and
     * configurable
     *
     * @returns `{ enumerable: true, configurable: true }`
     */
    static get flexible(): {
        enumerable: boolean;
        configurable: boolean;
    };
    /**
     * A base descriptor (new for each read) that is not enumerable but is
     * configurable
     *
     * @returns `{ enumerable: false, configurable: true }`
     */
    static get enigmatic(): {
        enumerable: boolean;
        configurable: boolean;
    };
    /**
     * A base descriptor (new for each read) that is neither enumerable
     * nor configurable.
     *
     * @returns `{ enumerable: false, configurable: false }`
     */
    static get intrinsic(): {
        enumerable: boolean;
        configurable: boolean;
    };
    /**
     * A base descriptor (new for each read) that is enumerable but
     * not configurable
     *
     * @returns `{ enumerable: true, configurable: false }`
     */
    static get transparent(): {
        enumerable: boolean;
        configurable: boolean;
    };
    /**
     * The function returns an array of shared descriptor keys.
     *
     * @returns An array containing the strings 'configurable' and 'enumerable'.
     */
    static get SHARED_KEYS(): string[];
    /**
     * The function returns an array of accessor descriptor keys.
     *
     * @returns An array containing the strings 'get' and 'set' is being returned.
     */
    static get ACCESSOR_KEYS(): string[];
    /**
     * The function returns an array of data descriptor keys.
     *
     * @returns An array containing the strings 'value' and 'writable' is being
     * returned.
     */
    static get DATA_KEYS(): string[];
    /**
     * Constructs a Descriptor instance which wraps and manages an object
     * property descriptor. The constructor can handle an existing descriptor
     * object or create a new one based on an object and a property key.
     *
     * @param {object|Descriptor} object - The target object or an existing
     * Descriptor instance. If it's an object, it is used in conjunction with
     * `key` to create a descriptor. If it's a Descriptor instance, it is used
     * directly as the descriptor.
     * @param {string|symbol} [key] - The property key for which the descriptor
     * is to be created. This parameter is ignored if `object` is a Descriptor
     * instance. If `key` is an object and `object` is a valid descriptor, `key`
     * is treated as the associated object.
     * @throws {Error} Throws an error if the constructed descriptor is not
     * valid.
     */
    constructor(object: object | Descriptor, key?: string | symbol | undefined, ...args: any[]);
    /**
     * The default private descriptor value is that of `enigmatic`
     *
     * @private
     * @type {object}
     */
    private _desc;
    /**
     * An optionally associated object, usually the parent from which
     * the descriptor was taken, or undefined if none was able to be
     * derived.
     *
     * @type {object}
     */
    _object: object;
    /**
     * Detects whether or not this instance is an accessor object descriptor
     *
     * @returns {boolean} true if this object has a getter or setter and is not
     * a data descriptor
     */
    get isAccessor(): boolean;
    /**
     * Detects whether or not this instance is an data object descriptor
     *
     * @returns {boolean} true if this object has a value property and is not
     * an accessor descriptor
     */
    get isData(): boolean;
    /**
     * Detects whether or not this instance is a valid object descriptor
     *
     * @returns {boolean} true if this descriptor store is a valid descriptor
     */
    get isDescriptor(): boolean;
    /**
     * Retrieves the {@link get} function for this accessor and binds it to
     * the object from which the descriptor was derived, if that value is set.
     * Otherwise this method is identical to the {@link get} accessor.
     *
     * @returns {function} the getter if one is defined. If possible this
     * getter will be bound the associated and previously set `object`.
     */
    get boundGet(): Function;
    /**
     * Retrieves the {@link set} function for this accessor and binds it to
     * the object from which the descriptor was derived, if that value is set.
     * Otherwise this method is identical to the {@link set} accessor.
     *
     * @returns {function} the setter if one is defined. If possible this
     * setter will be bound the associated and previously set `object`.
     */
    get boundSet(): Function;
    /**
     * The function checks the descriptor's associated object has been set on this
     * instance of `Descriptor`.
     *
     * @returns {boolean} `true` if the `object` property has been set,
     * `false` otherwise
     */
    get hasObject(): boolean;
    /**
     * Sets the descriptor's associated `object` value. This is usually the
     * parent object from which the descriptor was derived.
     *
     * @param {object} value sets the object for which this descriptor is to
     * be associated with.
     */
    set object(value: object);
    /**
     * Returns the descriptor's associated `object` value. This is usually the
     * parent object from which the descriptor was derived. If the value is preset
     * it will be returned. Undefined will be returned otherwise
     *
     * @returns {object} the associated object for this descriptor or undefined
     * if it has not yet been set.
     */
    get object(): object;
    /**
     * Take the descriptor defined by this objects values and apply them to
     * the specified object using the specified key.
     *
     * @param {object} object the object to apply this descriptor to
     * @param {string|symbol} forKey the string or symbol for which this
     * descriptor will abe applied
     */
    applyTo(object: object, forKey: string | symbol, bindAccessors?: boolean): object;
    /**
     * Converts this Descriptor class instance into a basic object descriptor
     * that is accepted by all the standard JavaScript runtime methods that
     * deal with object descriptors.
     *
     * @param {boolean|object} bindAccessors if `true`, a non-fatal attempt to
     * bind accessor getter and setter methods is made before returning the
     * object. If `bindAccessors` is truthy and is also an object, this is the
     * object the accessors will be bound to. If the value is falsy or if the
     * descriptor instance represents a data descriptor, nothing happens.
     * @returns {object} the object instance's basic object representation as
     * a descriptor.
     */
    toObject(bindAccessors?: boolean | object): object;
    /**
     * Converts this descriptor object into a base representation
     *
     * @param {string} hint one of `string`, `number` or default;
     * @returns if the hint is 'string', then a string identifying the enum
     * and its type is returned. `number` will always be NaN since it is incoret
     */
    [Symbol.toPrimitive](hint: string): string | number | object | undefined;
    /**
     * Ensures that the constructor of this object instance's name
     * is returned if the string tag for this instance is queried
     *
     * @returns {string} the name of the class
     */
    get [Symbol.toStringTag](): string;
}
export const DescriptorExtensions: Extension;
import { Extension } from '@nejs/extension';
