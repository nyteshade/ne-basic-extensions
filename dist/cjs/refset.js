"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _RefSet_instances, _RefSet_objectifyValues, _RefSet_validWeakRefTarget;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefSetExtensions = void 0;
const extension_1 = require("@nejs/extension");
/**
 * RefSet class extends the standard Set object to manage a collection of
 * WeakRef objects. It provides additional functionality such as objectification
 * of values and various utility methods.
 *
 * Unlike standard Sets or Arrays, RefSet stores weak references to objects,
 * allowing them to be garbage-collected if there are no other references to
 * them. This behavior is different from Arrays and standard Sets, which
 * maintain strong references to their elements.
 *
 * @extends Set
 */
class RefSet extends Set {
    constructor() {
        super(...arguments);
        _RefSet_instances.add(this);
        /**
         * Private field to track whether the RefSet should objectify primitive
         * values.
         *
         * @private
         */
        _RefSet_objectifyValues.set(this, false
        /**
         * Method to control whether the RefSet should objectify its values. When
         * objectifying, primitive values (number, string, boolean, bigint) are
         * converted to their respective object types, which allows them to be used as
         * WeakRef targets.
         *
         * @param {boolean} setObjectification - Flag to enable or disable
         * objectification.
         * @returns {RefSet} - The current RefSet instance to allow method chaining.
         */
        );
    }
    /**
     * Method to control whether the RefSet should objectify its values. When
     * objectifying, primitive values (number, string, boolean, bigint) are
     * converted to their respective object types, which allows them to be used as
     * WeakRef targets.
     *
     * @param {boolean} setObjectification - Flag to enable or disable
     * objectification.
     * @returns {RefSet} - The current RefSet instance to allow method chaining.
     */
    objectifying(setObjectification = true) {
        this.objectifyValues = setObjectification;
        return this;
    }
    /**
     * Returns the state indicating whether or not `RefSet` will attempt to
     * convert non-valid primitives into targets that are valid input for
     * new `WeakRef` object instances. If this value is `false` then no
     * *objectification* will occur.
     *
     * @returns {boolean} The current state of objectifyValues.
     */
    get objectifyValues() {
        return __classPrivateFieldGet(this, _RefSet_objectifyValues, "f");
    }
    /**
     * Setting this value to true, will cause all added values to the Set to
     * be analyzed for validity as a candidate to be wrapped in a `WeakRef`
     * object. If true, and if possible, the object will be turned into an
     * `Object` variant first. This will also enable less rigid variable
     * comparison in the `.has()` method (i.e. `==` instead of `===`).
     *
     * @param {boolean} value - The new state to set for objectifyValues.
     */
    set objectifyValues(value) {
        __classPrivateFieldSet(this, _RefSet_objectifyValues, !!value, "f");
    }
    /**
     * Overrides the add method of Set. Adds a value to the RefSet, converting it
     * to a WeakRef. Throws an error if the value is not a valid WeakRef target
     * (e.g., null, undefined, or a registered symbol). If `objectifyValues` is
     * enabled, an attempt to convert primitives to their object variants will be
     * made. These are numbers, strings, boolean values and big integers.
     *
     * @param {*} value - The value to be added to the RefSet.
     * @throws {TypeError} If the value is not a valid WeakRef target.
     */
    add(value) {
        // Objectify the value if needed
        if (__classPrivateFieldGet(this, _RefSet_objectifyValues, "f") && (typeof value === 'number' ||
            typeof value === 'string' ||
            typeof value === 'boolean' ||
            typeof value === 'bigint')) {
            value = Object(value);
        }
        // Check if the value is an object, and if it's a symbol, ensure it's not registered
        if (typeof value === 'symbol' && Symbol.keyFor(value) !== undefined) {
            throw new TypeError('RefSet cannot accept registered symbols as values');
        }
        if (typeof value !== 'object' && typeof value !== 'symbol') {
            throw new TypeError('RefSet values must be objects, non-registered symbols, or objectified primitives');
        }
        // If the value is null or undefined, throw an error
        if (value === null || value === undefined) {
            throw new TypeError('RefSet values cannot be null or undefined');
        }
        super.add(new WeakRef(value));
    }
    /**
     * Adds multiple values to the RefSet. The supplied `values` should be
     * iterable and truthy. This function defers to `.add()` for its logic so
     * each value from the supplied collection of values will also be subject
     * to the criteria of that function.
     *
     * @param {Iterable} values - An iterable of values to add to the RefSet.
     * @throws {TypeError} If the supplied values are falsey or non-iterable.
     */
    addAll(values) {
        if (!values ||
            (typeof values !== 'object') ||
            !Reflect.has(values, Symbol.iterator)) {
            throw new TypeError('The supplied values are either falsey or non-iterable');
        }
        for (const value of values) {
            this.add(value);
        }
    }
    /**
     * Removes all elements from the RefSet that have been garbage collected
     * (i.e., their WeakRef no longer points to an object).
     *
     * @returns {RefSet} - The current RefSet instance to allow method chaining.
     */
    clean() {
        for (const ref of this) {
            if (!ref.deref()) {
                this.delete(ref);
            }
        }
        return this;
    }
    /**
     * Executes a provided function once for each value in the RefSet. The callback
     * function receives the dereferenced value, the value again (as RefSet doesn't
     * use keys), and the RefSet itself. This method provides a way to iterate over
     * and apply operations to the values stored in the RefSet, taking into account
     * that they are weak references and may have been garbage-collected.
     *
     * @param {Function} forEachFn - Function to execute for each element. It
     * takes three arguments: element, element (again, as RefSet has no key), and
     * the RefSet itself.
     * @param {*} thisArg - Value to use as `this` when executing `forEachFn`.
     */
    entries() {
        const refEntries = super.entries();
        return refEntries
            .map(([_, ref]) => [ref.deref(), ref.deref()])
            .filter(([_, value]) => !!value);
    }
    forEach(forEachFn, thisArg) {
        const set = this;
        super.forEach(function (ref) {
            const value = ref.deref();
            if (!value) {
                return;
            }
            forEachFn.call(thisArg, value, value, set);
        });
    }
    /**
     * Returns an iterator for the values in the RefSet. Each value is
     * dereferenced from its WeakRef before being returned. This method allows
     * iterating over he set's values, similar to how one would iterate over
     * values in a standard Set or Array, but with the understanding that the
     * values are weakly referenced and may no longer exist (in which case
     * they are skipped).
     *
     * @returns {Iterator} An iterator for the values.
     */
    values() {
        const values = [];
        for (const value of this) {
            const dereferenced = value.deref();
            if (dereferenced) {
                values.push(dereferenced);
            }
        }
        return values;
    }
    /**
     * Returns an iterator for the keys of the RefSet. In RefSet, keys and
     * values are identical, so this method behaves the same as `values()`. It
     * provides compatibility with the standard Set interface and allows use in
     * contexts where keys are expected, despite RefSet not differentiating
     * between keys and values.
     *
     * @returns {Iterator} An iterator for the keys.
     */
    keys() {
        return this.values();
    }
    /**
     * Determines whether an element with the specified value exists in the
     * `RefSet`. For non-objectified sets, this method checks if the dereferenced
     * values of the set include the specified value.
     *
     * For objectified sets, it uses the `contains` method which accounts for
     * the objectification. This method differs from standard Set `has` in that
     * it works with weak references and considers objectification settings.
     *
     * @param {*} value - The value to check for presence in the RefSet.
     * @returns {boolean} - True if an element with the specified value exists
     * in the RefSet, false otherwise.
     */
    has(value) {
        if (__classPrivateFieldGet(this, _RefSet_objectifyValues, "f")) {
            return this.contains(value);
        }
        for (const item of this.values()) {
            if (item === value) {
                return true;
            }
        }
        return false;
    }
    /**
     * Checks if the RefSet contains a value that is equal to the specified
     * value. This method is used primarily in objectified RefSets to determine
     * the presence of a value, taking into account objectification. It differs
     * from the `has` method in that it's tailored for sets that have
     * transformed their primitive values into objects, whereas `has` is more
     * general-purpose.
     *
     * @param {*} value - The value to search for in the RefSet.
     * @returns {boolean} - True if the RefSet contains the value, false otherwise.
     */
    contains(value) {
        return !!(Array.from(this.values())
            .filter(dereferencedValue => {
            return value == dereferencedValue;
        })
            .length);
    }
    /**
     * Creates a new array with all elements that pass the test implemented by
     * the provided function. This method iterates over each element,
     * dereferences it, and applies the filter function. Unlike Array `filter`,
     * the callback receives the dereferenced value and not an index or array,
     * reflecting the non-indexed nature of RefSet. Useful for selectively
     * creating arrays from the set based on certain conditions, especially when
     * dealing with weak references.
     *
     * @param {Function} filterFn - Function to test each element of the RefSet.
     * The function receives the dereferenced value.
     * @param {*} thisArg - Value to use as `this` when executing `filterFn`.
     * @returns {Array} - A new array with the elements that pass the test.
     */
    filter(filterFn, thisArg) {
        const results = [];
        for (const value of this) {
            const dereferenced = value?.deref();
            if (dereferenced) {
                const include = filterFn.call(thisArg, dereferenced, NaN, this);
                if (include) {
                    results.push(dereferenced);
                }
            }
        }
        return results;
    }
    /**
     * Returns the value of the first element in the RefSet that satisfies the
     * provided testing function. Similar to Array `find`, this method iterates
     * over the RefSet, dereferencing each value and applying the testing
     * function. The non-indexed nature of RefSet is considered, as the
     * callback does not receive an index. This method is useful for finding a
     * specific element based on a condition.
     *
     * @param {*} thisArg - Value to use as this when executing findFn.
     * @returns {*} - The value of the first element in the RefSet that satisfies
     * the testing function, or undefined if none found.
     * @returns
     */
    find(findFn, thisArg) {
        for (const value of this) {
            const dereferenced = value?.deref();
            if (dereferenced) {
                const found = findFn.call(thisArg, dereferenced, NaN, this);
                if (found) {
                    return dereferenced;
                }
            }
        }
        return undefined;
    }
    /**
     * Creates a new array or `RefSet` with the results of calling a provided
     * function on every element in the calling `RefSet`. This method dereferences
     * each value, applies the `mapFn`, and collects the results. If `toRefSet` is
     * `true`, a new `RefSet` is returned; otherwise, an array. This method
     * differs from `Array.map` in handling weak references and the potential to
     * return a new `RefSet` instead of an array.
     *
     * @param {Function} mapFn - Function that produces an element of the new
     * array or `RefSet`, taking three arguments.
     * @param {*} thisArg - Value to use as this when executing mapFn.
     * @param {boolean} toRefSet - Determines if the output should be a new
     * `RefSet` (`true`) or an array (`false`).
     * @param {boolean} mirrorObjectification - If `true` and `toRefSet` is
     * `true`, the new `RefSet` mirrors the objectification setting of the
     * original.
     * @returns {Array|RefSet} - A new array or `RefSet` with each element being
     * the result of the `mapFn`.
     */
    map(mapFn, thisArg, toRefSet, mirrorObjectification) {
        const mapped = [];
        let validRefSetOutput = true;
        let validRefSetOutputIfObjectified = true;
        for (const value of this) {
            const dereferenced = value?.deref();
            if (dereferenced) {
                const mappedItem = mapFn.call(thisArg, dereferenced, NaN, this);
                if (validRefSetOutput || validRefSetOutputIfObjectified) {
                    const weakReferenceable = __classPrivateFieldGet(this, _RefSet_instances, "m", _RefSet_validWeakRefTarget).call(this, mappedItem);
                    if (!weakReferenceable) {
                        validRefSetOutput = false;
                        if (validRefSetOutputIfObjectified) {
                            validRefSetOutputIfObjectified =
                                __classPrivateFieldGet(this, _RefSet_instances, "m", _RefSet_validWeakRefTarget).call(this, Object(mappedItem));
                        }
                    }
                }
                mapped.push(mappedItem);
            }
        }
        if (toRefSet) {
            if (validRefSetOutput) {
                return new RefSet(mapped).objectifying(mirrorObjectification ? this.objectifyValues : false);
            }
            if (validRefSetOutputIfObjectified) {
                return new RefSet(mapped.map(value => {
                    return __classPrivateFieldGet(this, _RefSet_instances, "m", _RefSet_validWeakRefTarget).call(this, value) ? value : Object(value);
                })).objectifying();
            }
        }
        return mapped;
    }
    /**
     * Ensures that the constructor of this object instance's name
     * is returned if the string tag for this instance is queried
     *
     * @returns {string} the name of the class
     */
    get [(_RefSet_objectifyValues = new WeakMap(), _RefSet_instances = new WeakSet(), Symbol.toStringTag)]() {
        return this.constructor.name;
    }
}
_RefSet_validWeakRefTarget = function _RefSet_validWeakRefTarget(value) {
    return !((typeof value === 'symbol' && Symbol.keyFor(value) === undefined) ||
        (typeof value !== 'object' && typeof value !== 'symbol') ||
        (value === null || value === undefined));
};
exports.RefSetExtensions = new extension_1.Extension(RefSet);
