"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _Descriptor_desc;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DescriptorExtension = void 0;
const extension_1 = require("@nejs/extension");
const objectextensions_js_1 = require("./objectextensions.js");
const stringextensions_js_1 = require("./stringextensions.js");
const reflectextensions_js_1 = require("./reflectextensions.js");
const isObject = objectextensions_js_1.ObjectExtensions.patchEntries?.isObject?.computed;
const isValidKey = objectextensions_js_1.ObjectExtensions.patchEntries?.isValidKey?.computed;
const isString = stringextensions_js_1.StringExtensions.patchEntries?.isString?.computed;
const hasSome = reflectextensions_js_1.ReflectExtensions.patchEntries?.hasSome?.computed;
class Descriptor {
    /**
     * Creates a new instance of Descriptor either from another object or
     * around the supplied object descriptor value.
     *
     * @param {object} object either an object descriptor or the object
     * from which to get the descriptor
     * @param {symbol|string} key a valid key for accessing the descriptor
     * on the aforesupplied object.
     */
    constructor(object, key) {
        _Descriptor_desc.set(this, _a.enigmatic
        /**
         * Creates a new instance of Descriptor either from another object or
         * around the supplied object descriptor value.
         *
         * @param {object} object either an object descriptor or the object
         * from which to get the descriptor
         * @param {symbol|string} key a valid key for accessing the descriptor
         * on the aforesupplied object.
         */
        );
        __classPrivateFieldSet(this, _Descriptor_desc, object, "f");
        if (isObject(object) && isValidKey(key)) {
            __classPrivateFieldSet(this, _Descriptor_desc, Object.getOwnPropertyDescriptor(object, key), "f");
        }
        if (!this.isDescriptor) {
            throw new Error(`Not a valid descriptor:`, __classPrivateFieldGet(this, _Descriptor_desc, "f"));
        }
    }
    /**
     * Detects whether or not this instance is an accessor object descriptor
     *
     * @returns {boolean} true if this object has a getter or setter and is not
     * a data descriptor
     */
    get isAccessor() {
        return _a.isAccessor(__classPrivateFieldGet(this, _Descriptor_desc, "f"));
    }
    /**
     * Detects whether or not this instance is an data object descriptor
     *
     * @returns {boolean} true if this object has a value property and is not
     * an accessor descriptor
     */
    get isData() {
        return _a.isData(__classPrivateFieldGet(this, _Descriptor_desc, "f"));
    }
    /**
     * Detects whether or not this instance is a valid object descriptor
     *
     * @returns {boolean} true if this descriptor store is a valid descriptor
     */
    get isDescriptor() {
        return _a.isDescriptor(__classPrivateFieldGet(this, _Descriptor_desc, "f"));
    }
    /**
     * Getter around the `configurable` object descriptor property of
     * this instance of Descriptor.
     *
     * @returns {boolean} a boolean value or undefined if the internal
     * descriptor store is invalid.
     */
    get configurable() {
        return !!__classPrivateFieldGet(this, _Descriptor_desc, "f")?.configurable;
    }
    /**
     * Sets the `configurable` value of this object. If the internal descriptor
     * store store is invalid, the value is thrown away
     *
     * @param {boolean} value the value to set for the `configurable` descriptor
     * property. If this value is not a `boolean` it will be converted to one
     */
    set configurable(value) {
        (__classPrivateFieldGet(this, _Descriptor_desc, "f") || {}).configurable = !!value;
    }
    /**
     * Getter around the `enumerable` object descriptor property of
     * this instance of Descriptor.
     *
     * @returns {boolean} a boolean value or undefined if the internal
     * descriptor store is invalid.
     */
    get enumerable() {
        return __classPrivateFieldGet(this, _Descriptor_desc, "f")?.enumerable;
    }
    /**
     * Sets the `enumerable` value of this object. If the internal descriptor
     * store is invalid, the value is thrown away
     *
     * @param {boolean} value the value to set for the `enumerable` descriptor
     * property. If this value is not a `boolean` it will be converted to one
     */
    set enumerable(value) {
        (__classPrivateFieldGet(this, _Descriptor_desc, "f") || {}).enumerable = value;
    }
    /**
     * Getter around the `writable` object descriptor property of
     * this instance of Descriptor.
     *
     * @returns {boolean} a boolean value or undefined if the internal
     * descriptor store is invalid.
     */
    get writable() {
        return __classPrivateFieldGet(this, _Descriptor_desc, "f")?.writable;
    }
    /**
     * Sets the `writable` value of this object. If the internal descriptor
     * store is invalid, the value is thrown away
     *
     * @param {boolean} value the value to set for the `writable` descriptor
     * property. If this value is not a `boolean` it will be converted to one
     */
    set writable(value) {
        (__classPrivateFieldGet(this, _Descriptor_desc, "f") || {}).writable = value;
    }
    /**
     * Getter around the `value` object descriptor property of
     * this instance of Descriptor.
     *
     * @returns {any} any value stored in this descriptor
     */
    get value() {
        return __classPrivateFieldGet(this, _Descriptor_desc, "f")?.value;
    }
    /**
     * Sets the `value` value of this object. If the internal descriptor
     * store is invalid, the value is thrown away
     *
     * @param {any} value the value to set for the `value` descriptor
     * property.
     */
    set value(value) {
        (__classPrivateFieldGet(this, _Descriptor_desc, "f") || {}).value = value;
    }
    /**
     * Getter around the `get` object descriptor property of
     * this instance of Descriptor.
     *
     * @returns {function} a function if the getter for this descriptor is
     * defined or `undefined` if the internal descriptor object or the getter
     * is undefined.
     */
    get get() {
        return __classPrivateFieldGet(this, _Descriptor_desc, "f")?.get;
    }
    /**
     * Sets the `get` value of this object. If the internal descriptor
     * store is invalid, the value is thrown away
     *
     * @param {function} value the getter function for this descriptor
     */
    set get(value) {
        (__classPrivateFieldGet(this, _Descriptor_desc, "f") || {}).get = value;
    }
    /**
     * Getter around the `set` object descriptor property of
     * this instance of Descriptor.
     *
     * @returns {function} a function if the setter for this descriptor is
     * defined or `undefined` if the internal descriptor object or the setter
     * is undefined.
     */
    get set() {
        return __classPrivateFieldGet(this, _Descriptor_desc, "f")?.writable;
    }
    /**
     * Sets the `set` value of this object. If the internal descriptor
     * store is invalid, the value is thrown away
     *
     * @param {function} value the setter function for this descriptor
     */
    set set(value) {
        (__classPrivateFieldGet(this, _Descriptor_desc, "f") || {}).set = value;
    }
    /**
     * Take the descriptor defined by this objects values and apply them to
     * the specified object using the specified key.
     *
     * @param {object} object the object to apply this descriptor to
     * @param {string|symbol} forKey the string or symbol for which this
     * descriptor will abe applied
     */
    applyTo(object, forKey) {
        if (!isObject(object) || !isValidKey(forKey)) {
            throw new Error(`Cannot apply descriptor to non-object or invalid key`);
        }
        return Object.defineProperty(object, forKey, __classPrivateFieldGet(this, _Descriptor_desc, "f"));
    }
    /**
     * Converts this descriptor object into a base representation
     *
     * @param {string} hint one of `string`, `number` or default;
     * @returns if the hint is 'string', then a string identifying the enum
     * and its type is returned. `number` will always be NaN since it is incoret
     */
    [(_Descriptor_desc = new WeakMap(), Symbol.toPrimitive)](hint) {
        switch (hint) {
            case 'string':
                if (this.isAccessor) {
                    const hasGetter = Reflect.has(__classPrivateFieldGet(this, _Descriptor_desc, "f"), 'get') ? `getter` : '';
                    const hasSetter = Reflect.has(__classPrivateFieldGet(this, _Descriptor_desc, "f"), 'set') ? `setter` : '';
                    const separator = hasGetter && hasSetter ? ', ' : '';
                    return `Accessor (${hasGetter}${separator}${hasSetter})`;
                }
                else if (this.isData) {
                    const hasGetter = Reflect.has(__classPrivateFieldGet(this, _Descriptor_desc, "f"), 'value') ? `value` : '';
                    const hasSetter = Reflect.has(__classPrivateFieldGet(this, _Descriptor_desc, "f"), 'writable') ? `writable` : '';
                    const separator = hasGetter && hasSetter ? ', ' : '';
                    return `Data (${hasGetter}${separator}${hasSetter})`;
                }
                break;
            case 'number':
                return NaN;
            default:
                return __classPrivateFieldGet(this, _Descriptor_desc, "f");
        }
    }
    /**
     * The function `getData` retrieves the value of a property from an object if it
     * exists and is a data property.
     *
     * @param object - The "object" parameter is the object from which we want to
     * retrieve data.
     * @param property - The `property` parameter is the name of the property that
     * you want to retrieve the data from.
     * @returns either the value of the specified property if it exists and is a data
     * property, or undefined if the property does not exist or is not a data
     * property.
     */
    static getData(object, property) {
        if (!isObject(object) || !isString(property)) {
            return null;
        }
        const descriptors = _a.all(object);
        if (descriptors.has(property)) {
            const descriptor = descriptors.get(property);
            if (_a.isData(descriptor)) {
                return descriptor.value;
            }
        }
        return undefined;
    }
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
     * property (defined with a getter and/or setter), the returned object will also
     * have additional properties such as "accessor" and "descriptor". If the
     * property is not found or is not an accessor property, the function returns
     * undefined.
     */
    static getAccessor(object, property) {
        if (!isObject(object))
            return null;
        const [GETTER, SETTER, OBJECT] = [0, 1, 2];
        const results = [undefined, undefined, undefined];
        const descriptors = this.all(object);
        const isDescriptor = _a.isDescriptor(object);
        if (descriptors.has(property) || isDescriptor) {
            const descriptor = isDescriptor ? object : descriptors.get(property);
            if (_a.isAccessor(descriptor)) {
                results[OBJECT] = descriptors.object(property);
                results[GETTER] = descriptor?.get;
                results[SETTER] = descriptor?.set;
                Object.assign(results, {
                    get() { this[GETTER].bind(this[OBJECT])(); },
                    set(value) { this[SETTER].bind(this[OBJECT])(value); },
                    get accessor() { return true; },
                    get descriptor() { return descriptor; },
                    get boundDescriptor() {
                        return {
                            ...descriptor,
                            get: descriptor.get?.bind(object),
                            set: descriptor.set?.bind(object),
                        };
                    }
                });
                return results;
            }
        }
        return undefined;
    }
    /**
     * The function returns an object with enumerable and configurable properties
     * based on the input parameters.
     *
     * @param [enumerable=false] - A boolean value indicating whether the property
     * can be enumerated (listed) when iterating over the object's properties.
     * @param [configurable=false] - The `configurable` parameter determines whether
     * the property can be deleted or its attributes can be modified. If
     * `configurable` is set to `true`, the property can be deleted and its
     * attributes can be changed. If `configurable` is set to `false`, the property
     * cannot be deleted and
     * @returns An object with the properties `enumerable` and `configurable` is
     * being returned. The values of these properties are determined by the arguments
     * passed to the `base` function.
     */
    static base(enumerable = false, configurable = false) {
        return {
            enumerable,
            configurable
        };
    }
    /**
     * The function "newAccessor" creates a new property descriptor object with a
     * getter and setter function, along with optional enumerable and configurable
     * flags.
     *
     * @param getter - The getter parameter is a function that will be used as the
     * getter for the property. It will be called when the property is accessed.
     * @param setter - The `setter` parameter is a function that will be used as the
     * setter for the property. It will be called whenever the property is assigned a
     * new value.
     * @param [] - - `getter`: A function that will be used as the getter for the
     * property.
     * @returns an object with properties "get", "set", "enumerable", and
     * "configurable".
     */
    static accessor(getter, setter, { enumerable, configurable } = _a.base()) {
        return {
            get: getter,
            set: setter,
            enumerable,
            configurable
        };
    }
    /**
     * The function "newData" creates a new data object with customizable properties.
     *
     * @param value - The value parameter represents the value that will be assigned
     * to the property.
     * @param [writable=true] - The `writable` parameter determines whether the value
     * of the property can be changed. If `writable` is set to `true`, the value can
     * be changed. If `writable` is set to `false`, the value cannot be changed.
     * @param [] - - `value`: The value to be assigned to the property.
     * @returns an object with properties `value`, `enumerable`, `writable`, and
     * `configurable`.
     */
    static data(value, writable = true, { enumerable, configurable } = _a.base()) {
        return {
            value,
            enumerable,
            writable,
            configurable
        };
    }
    /**
     * The function checks if an object is a valid object descriptor in JavaScript.
     *
     * @param object - The `object` parameter is the object that we want to check if
     * it is a descriptor.
     * @returns a boolean value.
     */
    static isDescriptor(object) {
        const knownKeys = [
            ..._a.SHARED_KEYS,
            ..._a.ACCESSOR_KEYS,
            ..._a.DATA_KEYS,
        ];
        return hasSome(object, knownKeys);
    }
    /**
     * The function checks if a given property or descriptor is a data property.
     *
     * @param descriptor_orProp - The `descriptor_orProp` parameter can be either a
     * descriptor or a property name.
     * @param object - The `object` parameter is the object that you want to check
     * for data properties.
     * @returns a boolean value. It returns `true` if the `descriptor` object has any
     * keys that match the `DATA_KEYS` array, otherwise it returns `false`.
     */
    static isData(object_orProp, property) {
        const needsDescriptor = (((typeof object_orProp === 'object') || object_orProp instanceof Object) &&
            property instanceof String);
        const descriptor = (needsDescriptor
            ? _a.for(object_orProp, property)
            : object_orProp);
        const { ACCESSOR_KEYS, DATA_KEYS } = this;
        let validData = false;
        if (hasSome(descriptor, ACCESSOR_KEYS)) {
            validData = false;
        }
        else if (hasSome(descriptor, DATA_KEYS)) {
            validData = true;
        }
        return validData;
    }
    /**
     * The function checks if a given property descriptor or property of an object is
     * an accessor.
     *
     * @param object_orProp - The `descriptor_orProp` parameter can be either a
     * descriptor object or a property name.
     * @param property - The `object` parameter is the object that you want to check
     * for accessor properties.
     * @returns a boolean value. It returns true if the descriptor or property passed
     * as an argument is an accessor descriptor, and false otherwise.
     */
    static isAccessor(object_orProp, property) {
        const needsDescriptor = ((object_orProp && property) &&
            ((typeof object_orProp === 'object') || object_orProp instanceof Object) &&
            (property instanceof String || (typeof property === 'symbol')));
        const descriptor = (needsDescriptor
            ? _a.for(object_orProp, property)
            : object_orProp);
        const { ACCESSOR_KEYS, DATA_KEYS } = this;
        let validAccessor = false;
        if (hasSome(descriptor, DATA_KEYS)) {
            validAccessor = false;
        }
        else if (hasSome(descriptor, ACCESSOR_KEYS)) {
            validAccessor = true;
        }
        return validAccessor;
    }
    /**
     * A base descriptor (new for each read) that is both enumerable and configurable
     *
     * @returns The method `flexible` is returning the result of calling the `base`
     * method with the arguments `true` and `true`.
     */
    static get flexible() {
        return this.base(true, true);
    }
    /**
     * A base descriptor (new for each read) that is not enumerable but is configurable
     *
     * @returns The method `enigmatic` is returning the result of calling the `base`
     * method with the arguments `false` and `true`.
     */
    static get enigmatic() {
        return this.base(false, true);
    }
    /**
     * A base descriptor (new for each read) that is neither enumerable nor configurable
     *
     * @returns The code is returning the result of calling the `base` method with
     * the arguments `false` and `false`.
     */
    static get intrinsic() {
        return this.base(false, false);
    }
    /**
     * A base descriptor (new for each read) that enumerable but not configurable
     *
     * @returns The method is returning the result of calling the `base` method with
     * the arguments `true` and `false`.
     */
    static get transparent() {
        return this.base(true, false);
    }
    /**
     * The function returns an array of shared descriptor keys.
     *
     * @returns An array containing the strings 'configurable' and 'enumerable'.
     */
    static get SHARED_KEYS() {
        return ['configurable', 'enumerable'];
    }
    /**
     * The function returns an array of accessor descriptor keys.
     *
     * @returns An array containing the strings 'get' and 'set' is being returned.
     */
    static get ACCESSOR_KEYS() {
        return ['get', 'set'];
    }
    /**
     * The function returns an array of data descriptor keys.
     *
     * @returns An array containing the strings 'value' and 'writable' is being
     * returned.
     */
    static get DATA_KEYS() {
        return ['value', 'writable'];
    }
}
_a = Descriptor;
exports.DescriptorExtension = new extension_1.Extension(Descriptor);
