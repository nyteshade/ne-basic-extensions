import { Patch } from '@nejs/extension';
/**
 * `SetExtensions` is a constant that applies a patch to the global
 * `Set` constructor. This patch extends the `Set` with additional
 * methods and properties, enhancing its functionality.
 *
 * The `Patch` function takes two arguments: the target object to be patched
 * (in this case, `Set`), and an object containing the methods and
 * properties to be added to the target object.
 *
 * @example
 * // Using a method added by SetExtensions
 * const set = new Set();
 * console.log(Set.isSet(set)); // Output: true
 *
 * @const
 * @type {Patch}
 * @memberof module:set.extensions
 */
export const SetExtensions = new Patch(Set, {
    [Patch.kMutablyHidden]: {
        /**
         * Determines if the supplied `value` is a `Set` object. This check
         * is performed by first looking for the `Symbol.toStringTag` on the
         * `value` and checking to see if it is equal to the string "Set".
         * If that check fails, `instanceof` is used as a fallback to check
         * the prototype chain.
         *
         * @param {any} value the value that needs to be checked to determine
         * if it is a `Set` object or not
         * @returns {boolean} `true` if the supplied `value` is a `Set`
         * object, `false` otherwise
         *
         * @example
         * const set = new Set()
         * isSet(set) // true
         * isSet(new Map()) // false
         * isSet([]) // false
         * isSet({}) // false
         */
        isSet(value) {
            return value?.[Symbol.toStringTag] === Set.name || value instanceof Set;
        },
        /**
         * Conditionally returns a value based on whether the supplied
         * `value` is a `Set` object or not. If the `value` is a `Set`
         * object, the `thenValue` will be returned. If it is not a `Set`
         * object, the `elseValue` will be returned instead.
         *
         * @param {any} value the value to check to determine if it is a
         * `Set` object
         * @param {any} thenValue the value to return if the supplied
         * `value` is a `Set` object
         * @param {any} elseValue the value to return if the supplied
         * `value` is not a `Set` object
         * @returns {any} either the `thenValue` or `elseValue` depending
         * on if the supplied `value` is a `Set` object
         *
         * @example
         * const set = new Set()
         * const map = new Map()
         * ifSet(set, 'is a set', 'not a set') // 'is a set'
         * ifSet(map, 'is a set', 'not a set') // 'not a set'
         */
        ifSet(value, thenValue, elseValue) {
            return isThenElse(this.isSet(value), thenValue, elseValue);
        },
    }
});
const { isSet: pIsSet } = SetExtensions.patches;
/**
 * `SetPrototypeExtensions` is a constant that applies a patch to the
 * prototype of the built-in JavaScript `Set` object. This patch extends the
 * `Set` prototype with additional methods and properties, enhancing its
 * functionality.
 *
 * The `Patch` function takes two arguments: the target object to be patched
 * (in this case, `Set.prototype`), and an object containing the methods and
 * properties to be added to the target object.
 *
 * @example
 * // Using a method added by SetPrototypeExtensions
 * const mySet = new Set();
 * mySet.myNewMethod(); // Calls the new method added by the patch
 *
 * @const
 * @type {Patch}
 * @memberof module:set.extensions
 */
export const SetPrototypeExtensions = new Patch(Set.prototype, {
    [Patch.kMutablyHidden]: {
        /**
         * Merges multiple iterables into the set. Each element from the iterables
         * is added to the set, ensuring uniqueness of all elements. This method
         * mutates the original set.
         *
         * @param {...Iterable} iterables - One or more iterable objects (like Set
         * or Array) whose elements will be added to the set.
         */
        concat(...iterables) {
            for (const iterable of iterables) {
                if (typeof iterable === 'string' ||
                    !Reflect.has(iterable, Symbol.iterator)) {
                    this.add(iterable);
                    continue;
                }
                for (const element of iterable) {
                    this.add(element);
                }
            }
        },
        /**
         * Checks to see if any value within the `Set` loosely equals the supplied
         * value.
         *
         * @param {*} value any value that might be loosely equal to an item in the
         * set, as opposed to {@link Set.has} which is the equivalent of a strict or
         * triple equals (`===`) check
         * @returns {boolean} `true` if any value within the set is loosely equal to
         * the supplied value, `false` otherwise
         */
        contains(value) {
            for (const element of this) {
                if (value == element) {
                    return true;
                }
            }
            return false;
        },
        /**
         * Checks if every element in the set passes the test implemented by the
         * provided function. The function is called with each element of the set.
         * Note: Since sets do not have indices, the index parameter is always NaN.
         *
         * @param {Function} everyFn - The function to test each element. Receives
         * the element, index (always NaN), and the set itself.
         * @param {Object} [thisArg] - Optional. Value to use as `this` when executing
         * `everyFn`.
         * @throws {TypeError} If `everyFn` is not a function.
         * @returns {boolean} True if every element passes the test, false otherwise.
         */
        every(everyFn, thisArg) {
            if (typeof everyFn !== 'function') {
                throw new TypeError(`everyFn must be a function! Received ${String(everyFn)}`);
            }
            let found = 0;
            for (const element of this) {
                if (everyFn.call(thisArg, element, NaN, this)) {
                    found++;
                }
            }
            return (found === this.size);
        },
        /**
         * Finds the first element in the set satisfying the provided testing
         * function. If no elements satisfy the testing function, undefined is
         * returned. The function is called with each element of the set.
         * Note: Since sets do not have indices, the index parameter is always NaN.
         *
         * @param {Function} findFn - The function to execute on each element. It
         * receives the element, index (always NaN), and the set itself.
         * @param {Object} [thisArg] - Optional. Value to use as `this` when executing
         * `findFn`.
         * @throws {TypeError} If `findFn` is not a function.
         * @returns {*} The first element that satisfies `findFn`, or undefined.
         */
        find(findFn, thisArg) {
            if (typeof findFn !== 'function') {
                throw new TypeError(`findFn must be a function! Received ${String(findFn)}`);
            }
            for (const element of this) {
                const match = findFn.call(thisArg, element, NaN, this);
                if (match) {
                    return element;
                }
            }
            return undefined;
        },
        /**
         * Finds the last element in the set satisfying the provided testing function.
         * If no elements satisfy the testing function, undefined is returned. The
         * function is called with each element of the set in reverse order.
         * Note: Since sets do not have indices, the index parameter is always NaN.
         *
         * @param {Function} findFn - The function to execute on each element. It
         * receives the element, index (always NaN), and the set itself.
         * @param {Object} [thisArg] - Optional. Value to use as `this` when executing
         * `findFn`.
         * @throws {TypeError} If `findFn` is not a function.
         * @returns {*} The last element that satisfies `findFn`, or undefined.
         */
        findLast(findFn, thisArg) {
            if (typeof findFn !== 'function') {
                throw new TypeError(`findFn must be a function! Received ${String(findFn)}`);
            }
            const found = [];
            for (const element of this) {
                const match = findFn.call(thisArg, element, NaN, this);
                if (match) {
                    found.push(element);
                }
            }
            if (found.length) {
                return found[found.length - 1];
            }
            return undefined;
        },
        /**
         * Determines if the current object is a `Set` object.
         *
         * This is a getter that uses the `isSet` function from the
         * `SetExtensions` patch to check if the current object (`this`) is
         * a `Set` object.
         *
         * @type {boolean}
         * @readonly
         *
         * @example
        * const set = new Set()
        * console.log(set.isSet) // Output: true
        *
        * const notSet = {}
        * console.log(notSet.isSet) // Output: false
        */
        get isSet() {
            return pIsSet(this);
        },
        /**
         * Checks if the current object is a Set and returns the
         * corresponding value based on the result.
         *
         * This method uses the `isThenElse` function from the
         * `SetExtensions` patch to determine if the current object
         * (`this`) is a Set. If it is a Set, the `thenValue` is returned.
         * Otherwise, the `elseValue` is returned.
         *
         * @param {any} thenValue - The value to return if the current object
         * is a Set.
         * @param {any} elseValue - The value to return if the current object
         * is not a Set.
         * @returns {any} The `thenValue` if the current object is a Set, or
         * the `elseValue` if it is not a Set.
         *
         * @example
         * const set = new Set([1, 2, 3])
         * console.log(set.ifSet('Is a Set', 'Not a Set')) // 'Is a Set'
         *
         * const notSet = {}
         * console.log(notSet.ifSet('Is a Set', 'Not a Set')) // 'Not a Set'
         */
        ifSet(thenValue, elseValue) {
            return isThenElse(pIsSet(this), thenValue, elseValue);
        },
        /**
         * A getter property that returns the number of elements in the set.
         * This is an alias for the `size` property of the set.
         *
         * @returns {number} The number of elements in the set.
         */
        get length() {
            return this.size;
        },
        /**
         * Creates a new array populated with the results of calling the provided
         * function on every element in the set. The function is called with each
         * element of the set. Note: Since sets do not have indices, the index
         * parameter is always NaN.
         *
         * @param {Function} mapFn - The function to execute on each element. It
         * receives the element, index (always NaN), and the set itself.
         * @param {Object} [thisArg] - Optional. Value to use as `this` when executing
         * `mapFn`.
         * @throws {TypeError} If `mapFn` is not a function.
         * @returns {Array} A new array with each element being the result of the
         * `mapFn`.
         */
        map(mapFn, thisArg) {
            if (typeof mapFn !== 'function') {
                throw new TypeError(`mapFn must be a function! Received ${String(mapFn)}`);
            }
            const transformed = [];
            for (const element of this) {
                transformed.push(mapFn.call(thisArg, element, NaN, this));
            }
            return transformed;
        },
        /**
         * Applies a function against an accumulator and each element in the set to
         * reduce it to a single value. The function is called with each element of
         * the set. Note: Since sets do not have indices, the index parameter is
         * always NaN.
         *
         * @param {Function} reduceFn - The function to execute on each element. It
         * receives the accumulator, element, index (always NaN), and the set itself.
         * @param {*} initialValue - The initial value to start reducing from.
         * @param {Object} [thisArg] - Optional. Value to use as `this` when executing
         * `reduceFn`.
         * @throws {TypeError} If `reduceFn` is not a function.
         * @returns {*} The reduced value.
         */
        reduce(reduceFn, initialValue, thisArg) {
            if (typeof reduceFn !== 'function') {
                throw new TypeError(`reduceFn must be a Function! Received ${String(reduceFn)}`);
            }
            let accumulator = initialValue;
            for (const element of this) {
                accumulator = reduceFn.call(thisArg, accumulator, element, NaN, this);
            }
            return accumulator;
        },
        /**
         * Tests whether at least one element in the set passes the test implemented
         * by the provided function. The function is called with each element of the
         * set. Note: Since sets do not have indices, the index parameter is always NaN.
         *
         * @param {Function} someFn - The function to test each element. It receives
         * the element, index (always NaN), and the set itself.
         * @param {Object} [thisArg] - Optional. Value to use as `this` when executing
         * `someFn`.
         * @throws {TypeError} If `someFn` is not a function.
         * @returns {boolean} True if at least one element passes the test, false
         * otherwise.
         */
        some(someFn, thisArg) {
            if (typeof someFn !== 'function') {
                throw new TypeError(`someFn must be a function! Received ${String(someFn)}`);
            }
            for (const element of this) {
                if (someFn.call(thisArg, element, NaN, this)) {
                    return true;
                }
            }
            return false;
        },
    },
});
// NOTE to self; this is repeated here otherwise a circular reference from
// Object<->Function<->Global occurs. See original source in global.this.js
// {@see globalThis.isThenElse}
function isThenElse(bv, tv, ev) {
    if (arguments.length > 1) {
        var _then = isFunction(tv) ? tv(bv) : tv;
        if (arguments.length > 2) {
            var _else = isFunction(ev) ? tv(bv) : ev;
            return bv ? _then : _else;
        }
        return bv || _then;
    }
    return bv;
}
//# sourceMappingURL=set.extensions.js.map