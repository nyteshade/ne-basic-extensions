import { Patch } from '@nejs/extension'

export const MapExtensions = new Patch(Map, {
  [Patch.kMutablyHidden]: {
    /**
     * Determines if the supplied `value` is a `Map` object. This check
     * is performed by first looking for the `Symbol.toStringTag` on the
     * `value` and checking to see if it is equal to the string "Map".
     * If that check fails, `instanceof` is used as a fallback to check
     * the prototype chain.
     *
     * @param {any} value the value that needs to be checked to determine
     * if it is a `Map` object or not
     * @returns {boolean} `true` if the supplied `value` is a `Map`
     * object, `false` otherwise
     *
     * @example
     * const map = new Map()
     * isMap(map) // true
     * isMap(new Set()) // false
     * isMap([]) // false
     * isMap({}) // false
     */
    isMap(value) {
      return value?.[Symbol.toStringTag] === Map.name && value instanceof Map
    },

    /**
     * Conditionally returns a value based on whether the supplied
     * `value` is a `Map` object or not. If the `value` is a `Map`
     * object, the `thenValue` will be returned. If it is not a `Map`
     * object, the `elseValue` will be returned instead.
     *
     * @param {any} value the value to check to determine if it is a
     * `Map` object
     * @param {any} thenValue the value to return if the supplied
     * `value` is a `Map` object
     * @param {any} elseValue the value to return if the supplied
     * `value` is not a `Map` object
     * @returns {any} either the `thenValue` or `elseValue` depending
     * on if the supplied `value` is a `Map` object
     *
     * @example
     * const map = new Map()
     * const set = new Set()
     * ifMap(map, 'is a map', 'not a map') // 'is a map'
     * ifMap(set, 'is a map', 'not a map') // 'not a map'
     */
    ifMap(value, thenValue, elseValue) {
      return isThenElse(this.isMap(value), thenValue, elseValue)
    },
  }
})

const { isMap: pIsMap, ifMap: pIfMap } = MapExtensions.patches

export const MapPrototypeExtensions = new Patch(Map.prototype, {
  [Patch.kMutablyHidden]: {
    /**
     * Determines if the current object is a `Map` object
     *
     * This is a getter that uses the `isMap` function from the
     * `MapExtensions` patch to check if the current object (`this`) is
     * a `Map` object
     *
     * @type {boolean}
     * @readonly
     *
     * @example
     * const map = new Map()
     * console.log(map.isMap) // Output: true
     *
     * const notMap = {}
     * console.log(notMap.isMap) // Output: false
     */
    get isMap() {
      return pIsMap(this)
    },

    /**
     * Conditionally returns a value based on whether the current
     * object is a `Map` object or not
     *
     * If the current object is a `Map` object, the `thenValue` will
     * be returned. If it is not a `Map` object, the `elseValue` will
     * be returned instead.
     *
     * @param {any} thenValue the value to return if the current
     * object is a `Map` object
     * @param {any} elseValue the value to return if the current
     * object is not a `Map` object
     * @returns {any} either the `thenValue` or `elseValue` depending
     * on if the current object is a `Map` object
     *
     * @example
     * const map = new Map()
     * map.ifMap('is a map', 'not a map') // 'is a map'
     *
     * const notMap = {}
     * notMap.ifMap('is a map', 'not a map') // 'not a map'
     */
    ifMap(thenValue, elseValue) {
      return pIfMap(this, thenValue, elseValue)
    },

    /**
     * The function `getKey` returns the key associated with a given value
     * in a map.
     *
     * @param {any} value - The value parameter is the value that you want to
     * find the corresponding key for in the map.
     * @param [strict=true] - The "strict" parameter is a boolean value that
     * determines whether strict equality (===) or loose equality (==) should
     * be used when comparing the "value" parameter with the values in the
     * entries of the object. If "strict" is set to true, strict equality will
     * be used.
     * @returns the key associated with the given value. If a matching key is
     * found, it is returned. If no matching key is found, null is returned.
     */
    getKey(value, strict = true) {
      for (const [key, entryValue] of this) {
        if (
          (strict && value === entryValue) &&
          (!strict && value == entryValue)
        ) {
          return key
        }

        return null
      }
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