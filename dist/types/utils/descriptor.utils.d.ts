/**
 * A set of utility functions work with {@link PropertyDescriptor} objects.
 * The creation of property descriptors can be large in boiler plate so
 * these tools can reduce the boiler plate and increase readability.
 */
export type DescriptorUtils = DescriptorUtils;
export namespace DescriptorUtils {
    const accessor: Function & {
        keys: string[];
    };
    const data: Function & {
        keys: string[];
    };
    function describe(object: any, key: any, value: any, detectDescriptorValues?: boolean): any;
    function describeMany(object: any, keyValues: any, detectDescriptorValues?: boolean): never[] | undefined;
    function extract(fromObject: any, keysToExtract: any, defaultIfMissing?: undefined, extractDescriptors?: boolean): {};
    /**
     * Determines if a given value is an accessor descriptor.
     *
     * An accessor descriptor is a property descriptor that defines
     * getter and/or setter functions for a property. This function
     * checks the validity of the descriptor and whether it qualifies
     * as an accessor.
     *
     * @param {Object} value - The descriptor object to evaluate.
     * @param {boolean} [strict=true] - If true, performs a strict
     *   validation of the descriptor.
     * @returns {boolean} Returns true if the descriptor is valid and
     *   is an accessor descriptor, otherwise false.
     *
     * @example
     * // Example usage:
     * const descriptor = { get: () => 42, set: (val) => {} }
     * const result = DescriptorUtils.isAccessor(descriptor)
     * console.log(result) // Outputs: true
     */
    function isAccessor(value: Object, strict?: boolean): boolean;
    /**
     * Checks if a given value is a data descriptor.
     *
     * A data descriptor is a property descriptor that defines a value
     * and optionally a writable attribute for a property. This function
     * evaluates the descriptor's validity and whether it qualifies as
     * a data descriptor.
     *
     * @param {Object} value - The descriptor object to evaluate.
     * @param {boolean} [strict=true] - If true, performs a strict
     *   validation of the descriptor.
     * @returns {boolean} Returns true if the descriptor is valid and
     *   is a data descriptor, otherwise false.
     *
     * @example
     * // Example usage:
     * const descriptor = { value: 42, writable: true }
     * const result = DescriptorUtils.isData(descriptor)
     * console.log(result) // Outputs: true
     */
    function isData(value: Object, strict?: boolean): boolean;
    /**
     * A function that, given a value that might be a `PropertyDescriptor`,
     * calculates a deterministic probability that the supplied value is
     * an object that either is a `PropertyDescriptor` or that can function
     * as one.
     *
     * @param {unknown} value a JavaScript value that might be a
     * `PropertyDescriptor` type.
     * @param {boolean?} returnStats if this value is true, instead of returning
     * a determined boolean value indicating the supplied value might be a
     * `PropertyDescriptor`, an object containing the determined flags and score
     * the led to the determination instead is returned.
     * @param {boolean?} strict if this value is `true`, which is the default,
     * then the function will not allow descriptor compatible objects, rather it
     * will only return true if the object has keys that belong in a descriptor
     * and do not form an invalid combination.
     * @returns {IsDescriptorResponse} if `returnStats` is `true`
     * an object of type {@link IsDescriptorStats} is returned. This object
     * will have a lot of {@link Boolean} flags pertaining to the `true`/`false`
     * evaluation. If `returnStats` is `false`, then a boolean value denoting
     * whether or not the value is a {@link PropertyDescriptor} is returned
     * instead. This is effectively the same as the `isValid` parameter from the
     * stats block.
     */
    function isDescriptor(value: unknown, returnStats?: boolean | null, strict?: boolean | null): IsDescriptorResponse;
    /**
     * Redefines a property on an object with new descriptors and options.
     * This function allows renaming, aliasing, and redefining property
     * descriptors such as configurable, enumerable, writable, get, and set.
     *
     * @param {Object} object - The target object whose property is to be
     * redefined.
     * @param {string|symbol} key - The key of the property to redefine.
     * @param {Object} as - An object containing new property descriptors.
     * @param {Object} [options] - Optional settings for renaming and aliasing.
     * @param {string|symbol} [options.rename] - New key name for the property.
     * @param {Array<string|symbol>} [options.alsoAs] - Additional aliases for
     * the property.
     * @param {Object} [options.moveTo] optionally move the descriptor from this
     * object to another.
     * @returns {any} the result of `object[key]` in its final state
     *
     * @example
     * const obj = { a: 1 }
     * redescribe(obj, 'a', { writable: false }, { rename: 'b', alsoAs: ['c'] })
     * console.log(obj.b) // Outputs: 1
     * console.log(obj.c) // Outputs: 1
     */
    function redescribe(object: Object, key: string | symbol, as: Object, options?: {
        rename?: string | symbol | undefined;
        alsoAs?: (string | symbol)[] | undefined;
        moveTo?: Object | undefined;
    }): any;
    const kAccessorDescriptorKeys: string[];
    const kDataDescriptorKeys: string[];
    const kSharedDescriptorKeys: string[];
    const kDescriptorKeys: string[];
}
declare namespace _default {
    export { DescriptorUtils };
    export { accessor };
    export { data };
    export { describe };
    export { describeMany };
    export { extract };
    export { isAccessor };
    export { isData };
    export { isDescriptor };
    export { redescribe };
    export { kAccessorDescriptorKeys };
    export { kDataDescriptorKeys };
    export { kDescriptorKeys };
    export { kSharedDescriptorKeys };
}
export default _default;
export type PropertyKey = string | symbol | number;
/**
 * The `IsDescriptorStats` block contains all the information used to make
 * a determination as to whether a given value is a an instance of the type
 * {@link PropertyDescriptor} or at least compatible to used as one.
 */
export type IsDescriptorStats = {
    /**
     * this is going to be a number from 0.0-1.0
     * indicating the confidence ratio that the object supplied to `isDescriptor`
     * is actually a valid `PropertyDescriptor` object. If the number is greater
     * than 0 but less than 1.0, it likely indicates that the object can be used
     * as a `PropertyDescriptor` but one or more factors gives it less than 100%
     * confidence that being such is the objects intended purpose (e.g. it could
     * be that there are more properties than a descriptor might have or that
     * it is missing crucial properties such as `value`, `get` or `set`)
     */
    confidence: number;
    /**
     * true if the object is functional as an
     * accessor descriptor; false otherwise
     */
    isAccessor: boolean;
    /**
     * true if the object is functional as a data
     * descriptor; false otherwise
     */
    isData: boolean;
    /**
     * true if the object is technically a valid
     * `PropertyDescriptor` object or compatible as one.
     */
    isValid: boolean;
    /**
     * true if the object has either
     * `configurable` or `enumerable` property keys and both are `undefined` or
     * of type `boolean`.
     */
    hasBaseDescriptorKeys: boolean;
    /**
     * true if the object has either `get`
     * or `set` property keys and both are either `undefined` or of type
     * `function`
     */
    hasAccessorKeys: boolean;
    /**
     * true if the object has either `value` or
     * `writable` property keys and if `writable` is present, then it is of type
     * `boolean`
     */
    hasDataKeys: boolean;
};
/**
 * The response from a call to {@link DescriptorUtils.isDescriptor} can
 * be either a {@link boolean} or a {@link IsDescriptorStats} object.
 */
export type IsDescriptorResponse = IsDescriptorStats | boolean;
export const accessor: Function & {
    keys: string[];
};
export const data: Function & {
    keys: string[];
};
export function describe(object: any, key: any, value: any, detectDescriptorValues?: boolean): any;
export function describeMany(object: any, keyValues: any, detectDescriptorValues?: boolean): never[] | undefined;
export function extract(fromObject: any, keysToExtract: any, defaultIfMissing?: undefined, extractDescriptors?: boolean): {};
/**
 * Determines if a given value is an accessor descriptor.
 *
 * An accessor descriptor is a property descriptor that defines
 * getter and/or setter functions for a property. This function
 * checks the validity of the descriptor and whether it qualifies
 * as an accessor.
 *
 * @param {Object} value - The descriptor object to evaluate.
 * @param {boolean} [strict=true] - If true, performs a strict
 *   validation of the descriptor.
 * @returns {boolean} Returns true if the descriptor is valid and
 *   is an accessor descriptor, otherwise false.
 *
 * @example
 * // Example usage:
 * const descriptor = { get: () => 42, set: (val) => {} }
 * const result = DescriptorUtils.isAccessor(descriptor)
 * console.log(result) // Outputs: true
 */
export function isAccessor(value: Object, strict?: boolean): boolean;
/**
 * Checks if a given value is a data descriptor.
 *
 * A data descriptor is a property descriptor that defines a value
 * and optionally a writable attribute for a property. This function
 * evaluates the descriptor's validity and whether it qualifies as
 * a data descriptor.
 *
 * @param {Object} value - The descriptor object to evaluate.
 * @param {boolean} [strict=true] - If true, performs a strict
 *   validation of the descriptor.
 * @returns {boolean} Returns true if the descriptor is valid and
 *   is a data descriptor, otherwise false.
 *
 * @example
 * // Example usage:
 * const descriptor = { value: 42, writable: true }
 * const result = DescriptorUtils.isData(descriptor)
 * console.log(result) // Outputs: true
 */
export function isData(value: Object, strict?: boolean): boolean;
/**
 * A function that, given a value that might be a `PropertyDescriptor`,
 * calculates a deterministic probability that the supplied value is
 * an object that either is a `PropertyDescriptor` or that can function
 * as one.
 *
 * @param {unknown} value a JavaScript value that might be a
 * `PropertyDescriptor` type.
 * @param {boolean?} returnStats if this value is true, instead of returning
 * a determined boolean value indicating the supplied value might be a
 * `PropertyDescriptor`, an object containing the determined flags and score
 * the led to the determination instead is returned.
 * @param {boolean?} strict if this value is `true`, which is the default,
 * then the function will not allow descriptor compatible objects, rather it
 * will only return true if the object has keys that belong in a descriptor
 * and do not form an invalid combination.
 * @returns {IsDescriptorResponse} if `returnStats` is `true`
 * an object of type {@link IsDescriptorStats} is returned. This object
 * will have a lot of {@link Boolean} flags pertaining to the `true`/`false`
 * evaluation. If `returnStats` is `false`, then a boolean value denoting
 * whether or not the value is a {@link PropertyDescriptor} is returned
 * instead. This is effectively the same as the `isValid` parameter from the
 * stats block.
 */
export function isDescriptor(value: unknown, returnStats?: boolean | null, strict?: boolean | null): IsDescriptorResponse;
/**
 * Redefines a property on an object with new descriptors and options.
 * This function allows renaming, aliasing, and redefining property
 * descriptors such as configurable, enumerable, writable, get, and set.
 *
 * @param {Object} object - The target object whose property is to be
 * redefined.
 * @param {string|symbol} key - The key of the property to redefine.
 * @param {Object} as - An object containing new property descriptors.
 * @param {Object} [options] - Optional settings for renaming and aliasing.
 * @param {string|symbol} [options.rename] - New key name for the property.
 * @param {Array<string|symbol>} [options.alsoAs] - Additional aliases for
 * the property.
 * @param {Object} [options.moveTo] optionally move the descriptor from this
 * object to another.
 * @returns {any} the result of `object[key]` in its final state
 *
 * @example
 * const obj = { a: 1 }
 * redescribe(obj, 'a', { writable: false }, { rename: 'b', alsoAs: ['c'] })
 * console.log(obj.b) // Outputs: 1
 * console.log(obj.c) // Outputs: 1
 */
export function redescribe(object: Object, key: string | symbol, as: Object, options?: {
    rename?: string | symbol | undefined;
    alsoAs?: (string | symbol)[] | undefined;
    moveTo?: Object | undefined;
}): any;
export const kAccessorDescriptorKeys: string[];
export const kDataDescriptorKeys: string[];
export const kDescriptorKeys: string[];
export const kSharedDescriptorKeys: string[];
