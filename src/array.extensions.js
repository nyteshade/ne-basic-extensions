import { Patch } from '@nejs/extension'

/**
 * `ArrayExtensions` is a constant that applies a patch to the global
 * `Array` constructor. This patch extends the `Array` with additional
 * methods and properties, enhancing its functionality.
 *
 * The `Patch` function takes two arguments: the target object to be patched
 * (in this case, `Array`), and an object containing the methods and
 * properties to be added to the target object.
 *
 * @example
 * // Using a method added by ArrayExtensions
 * const arr = [1, 2, 3];
 * console.log(Array.ifArray(arr, 'Array', 'Not Array')); // Output: 'Array'
 *
 * @const
 * @type {Patch}
 * @memberof module:array.extensions
 */
export const ArrayExtensions = new Patch(Array, {
  /**
   * Checks if the provided value is an array and returns one of two
   * provided values based on the result. This function is a convenience
   * method for performing conditional operations based on the type of
   * the provided value.
   *
   * @name ifArray
   * @type {function}
   * @memberof ArrayExtensions
   * @param {any} value - The value to be checked.
   * @param {function | any} thenValue - The value to be returned if the
   * provided value is an array.
   * @param {function | any} elseValue - The value to be returned if the
   * provided value is not an array.
   * @returns {any} Returns `thenValue` if the provided value is an array,
   * otherwise returns `elseValue`.
   *
   * @example
   * const arr = [1, 2, 3];
   * console.log(ArrayExtensions.ifArray(arr, 'Array', 'Not Array'));
   * // Output: 'Array'
   *
   * const notArr = "I'm not an array";
   * console.log(ArrayExtensions.ifArray(notArr, 'Array', 'Not Array'));
   * // Output: 'Not Array'
   */
  ifArray(value, thenValue, elseValue) {
    return isThenElse(Array.isArray(value), thenValue, elseValue)
  },
})

const { ifArray: pIfArray } = ArrayExtensions.patches

/**
 * `ArrayPrototypeExtensions` is a constant that applies a patch to the
 * Array prototype. This patch extends the Array prototype with additional
 * methods and properties, enhancing its functionality.
 *
 * The `Patch` function takes two arguments: the target object to be patched
 * (in this case, `Array.prototype`), and an object containing the methods
 * and properties to be added to the target object.
 *
 * @example
 * // Using a method added by ArrayPrototypeExtensions
 * const arr = [1, 2, 3];
 * console.log(arr.ifArray('Array', 'Not Array')); // Output: 'Array'
 *
 * @const
 * @type {Patch}
 * @memberof module:array.extensions
 */
export const ArrayPrototypeExtensions = new Patch(Array.prototype, {
  [Patch.kMutablyHidden]: {
    /**
     * Sometimes defining even a short function for the invocation of `find`
     * can be troublesome. This helper function performs that job for you. If
     * the specified element is in the array, `true` will be returned.
     *
     * @param {*} value the value to search for. This value must triple equals
     * the array element in order to return true.
     * @returns true if the exact element exists in the array, false otherwise
     */
    contains(value) {
      return !!this.find(entry => entry === value)
    },

    /**
     * The `findEntry` function searches the entries of the object and returns
     * the `[index, value]` entry array for the first matching value found.
     *
     * @param {function} findFn a function that takes the element to be checked
     * and returns a boolean value
     * @returns if `findFn` returns `true`, an array with two elements, the first
     * being the index, the second being the value, is returned.
     */
    findEntry(findFn) {
      const entries = this.entries()
      const VALUE = 1

      for (let entry of entries) {
        if (findFn(entry[VALUE])) {
          return entry
        }
      }

      return undefined
    },

    /**
     * A getter property that returns the first element of the array. If the
     * array is empty, it returns `undefined`. This property is useful for
     * scenarios where you need to quickly access the first item of an array
     * without the need for additional checks or method calls.
     *
     * @returns {*} The first element of the array or `undefined` if the array
     * is empty.
     */
    get first() {
      return this[0];
    },

    /**
     * A getter property that checks if the current context (`this`) is an
     * array. This is a convenience method that wraps the native
     * `Array.isArray` function.
     *
     * @name isArray
     * @type {function}
     * @memberof Array.prototype
     * @returns {boolean} `true` if the current context is an array,
     * `false` otherwise.
     *
     * @example
     * const arr = [1, 2, 3];
     * console.log(arr.isArray); // Output: true
     *
     * const notArr = "I'm not an array";
     * console.log(notArr.isArray); // Output: false
     */
    get isArray() {
      return Array.isArray(this)
    },

    /**
     * Checks if the current context (`this`) is an array and returns one of
     * two provided values based on the result. This function is a convenience
     * method for performing conditional operations based on the type of
     * the current context.
     *
     * @name ifArray
     * @type {function}
     * @memberof Array.prototype
     * @param {function | any} thenValue - The value to be returned if the
     * current context is an array.
     * @param {function | any} elseValue - The value to be returned if the
     * current context is not an array.
     * @returns {*} Returns `thenValue` if the current context is an array,
     * otherwise returns `elseValue`.
     *
     * @example
     * const arr = [1, 2, 3];
     * console.log(arr.ifArray('Array', 'Not Array')); // Output: 'Array'
     *
     * const notArr = "I'm not an array";
     * console.log(notArr.ifArray('Array', 'Not Array')); // Output: 'Not Array'
     */
    ifArray(thenValue, elseValue) {
      return pIfArray(this, thenValue, elseValue)
    },

    /**
     * Checks if at least one element in the array is equal to the provided
     * value. This method uses the `Array.prototype.some` function to iterate
     * over the array and compare each element with the provided value.
     *
     * @name oneIs
     * @type {function}
     * @memberof Array.prototype
     * @param {*} value - The value to be compared with the array elements.
     * @param {boolean} [doubleEqualsOkay=true] - A flag indicating whether to
     * use loose equality (`==`) or strict equality (`===`) for the comparison.
     * If `true`, loose equality is used. If `false`, strict equality is used.
     * @returns {boolean} Returns `true` if at least one element in the array
     * is equal to the provided value, otherwise `false`.
     *
     * @example
     * const arr = [1, 2, 3];
     * console.log(arr.oneIs(2)); // Output: true
     *
     * const arr2 = ['1', '2', '3'];
     * console.log(arr2.oneIs(2, false)); // Output: false
     */
    oneIs(value, doubleEqualsOkay = true) {
      return this.some(element => (
        doubleEqualsOkay ? element == value : element === value
      ))
    },

    /**
     * Checks if some elements in the array are included in the provided values.
     * This method uses the `Array.prototype.some` function to iterate over the
     * array and checks if any of the elements are included in the provided values.
     *
     * @name someAre
     * @type {function}
     * @memberof Array.prototype
     * @param {...*} values - The values to be checked against the array elements.
     * @returns {boolean} Returns `true` if at least one element in the array
     * is included in the provided values, otherwise `false`.
     *
     * @example
     * const arr = [1, 2, 3];
     * console.log(arr.someAre(2, 4)); // Output: true
     *
     * const arr2 = ['1', '2', '3'];
     * console.log(arr2.someAre(4, 5)); // Output: false
     */
    someAre(...values) {
      return this.some(element => !!~values.indexOf(element))
    },

    /**
     * Checks if all elements in the array are equal to the provided value.
     * This method uses the `Array.prototype.every` function to iterate over
     * the array and compare each element with the provided value.
     *
     * @name allAre
     * @type {function}
     * @memberof Array.prototype
     * @param {*} value - The value to be compared with the array elements.
     * @param {boolean} [doubleEqualsOkay=true] - A flag indicating whether to
     * use loose equality (`==`) or strict equality (`===`) for the comparison.
     * If `true`, loose equality is used. If `false`, strict equality is used.
     * @returns {boolean} Returns `true` if all elements in the array are equal
     * to the provided value, otherwise `false`.
     *
     * @example
     * const arr = [2, 2, 2];
     * console.log(arr.allAre(2)); // Output: true
     *
     * const arr2 = ['2', '2', '2'];
     * console.log(arr2.allAre(2, false)); // Output: false
     */
    allAre(value, doubleEqualsOkay = true) {
      return this.every(element => (
        doubleEqualsOkay ? element == value : element === value
      ))
    },

   /**
     * A getter property that returns the last element of the array. It
     * calculates the last index based on the array's length. If the array is
     * empty, it returns `undefined`. This property is beneficial when you need
     * to access the last item in an array, improving code readability and
     * avoiding manual index calculation.
     *
     * @returns {*} The last element of the array or `undefined` if the
     * array is empty.
     */
    get last() {
      return this[this.length - 1];
    },

    // expected usage:
    // function example(name, age) {
    //   const variants = [{name}, {age}].variants()
    //   if (typeof name === 'object')
    // }
    variants() {
      const keys = this.map(o => Object.keys(o)?.[0])
      const entries = this.map(o => Object.entries(o)?.[0])
      const object = entries.reduce((acc,[key, value]) => {
        acc[key] = value;
        return acc;
      }, {})

      const result = {
        order: keys,
        entries: entries,
        object: object,
      }

      Object.defineProperty(result, 'check', {
        value(position) {
          if (
            typeof position !== 'number' &&
            position >= 0 &&
            position < this.order.length
          ) {
            return false
          }

          const value = this.entries[position][1]

          if (typeof value === 'object' && value) {
            if (Object.keys(value).every(key => ~this.order.indexOf(key))) {
              return true
            }
          }

          return false
        },
        enumerable: false,
        configurable: true
      })

      return result
    },
  },
})

// NOTE to self; this is repeated here otherwise a circular reference from
// Object<->Function<->Global occurs. See original source in global.this.js
// {@see globalThis.isThenElse}
function isThenElse(bv, tv, ev) {
  if (arguments.length > 1) {
    var _then = isFunction(tv) ? tv(bv) : tv; if (arguments.length > 2) {
      var _else = isFunction(ev) ? tv(bv) : ev; return bv ? _then : _else
    } return bv || _then;
  } return bv
}