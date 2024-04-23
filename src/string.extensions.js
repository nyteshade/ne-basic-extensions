import { Patch } from '@nejs/extension'

const parenthesisPair = ['(', ')']

/**
 * `StringExtensions` is a patch for the JavaScript built-in `String` class. It
 * adds utility methods to the `String` class without modifying the global namespace
 * directly. This patch includes methods for key validation, object type checking,
 * and retrieving the string tag of an object. These methods are useful for
 * enhancing the capabilities of the standard `String` class with additional
 * utility functions.
 */
export const StringExtensions = new Patch(String, {
  /**
   * The `isString` method does exactly what one would it expect. It returns
   * true if the string matches typeof or instanceof as a string.
   *
   * @param {*} value checks to see if the `value` is a string
   * @returns {boolean} `true` if it is a `String`, `false` otherwise
   */
  isString(value) {
    return (
      value !== null && value !== undefined &&
      (typeof value === 'string' || value instanceof String)
    )
  },

  /**
   * Conditionally returns a value based on whether the supplied
   * `value` is a `String` or not. If the `value` is a `String`,
   * the `thenValue` will be returned. If it is not a `String`,
   * the `elseValue` will be returned instead.
   *
   * @param {any} value the value to check to determine if it is a
   * `String`
   * @param {any} thenValue the value to return if the supplied
   * `value` is a `String`
   * @param {any} elseValue the value to return if the supplied
   * `value` is not a `String`
   * @returns {any} either the `thenValue` or `elseValue` depending
   * on if the supplied `value` is a `String`
   *
   * @example
   * const str = 'hello'
   * const num = 42
   * ifString(str, 'is a string', 'not a string') // 'is a string'
   * ifString(num, 'is a string', 'not a string') // 'not a string'
   */
  ifString(value, thenValue, elseValue) {
    return isThenElse(this.isString(value), thenValue, elseValue)
  },

  /**
   * A getter property that returns a pair of parentheses as an array.
   * This property can be used when operations require a clear distinction
   * between the opening and closing parentheses, such as parsing or
   * matching balanced expressions in strings.
   *
   * @returns {[string, string]} An array containing a pair of strings: the
   * opening parenthesis '(' as the first element, and the closing parenthesis
   * ')' as the second element.
   */
  get parenthesisPair() {
    return ['(', ')'];
  },

  /**
   * A getter property that returns a pair of square brackets as an array.
   * This property is particularly useful for operations that require a clear
   * distinction between the opening and closing square brackets, such as
   * parsing arrays in strings or matching balanced expressions within
   * square brackets.
   *
   * @returns {[string, string]} An array containing a pair of strings: the
   * opening square bracket '[' as the first element, and the closing square
   * bracket ']' as the second element.
   */
  get squareBracketsPair() {
    return ['[', ']'];
  },

  /**
   * A getter property that returns a pair of curly brackets as an array.
   * This property is particularly useful for operations that require a clear
   * distinction between the opening and closing curly brackets, such as
   * parsing objects in strings or matching balanced expressions within
   * curly brackets. The returned array consists of the opening curly bracket
   * '{' as the first element, and the closing curly bracket '}' as the
   * second element.
   *
   * @returns {[string, string]} An array containing a pair of strings: the
   * opening curly bracket '{' as the first element, and the closing curly
   * bracket '}' as the second element.
   */
  get curlyBracketsPair() {
    return ['{', '}'];
  },

  /**
   * Generates a random string using base 36 (numbers and lowercase letters).
   * This method is useful when you need a random string that includes both
   * numbers and letters. The generated string does not include the leading
   * '0.' that is part of the string representation of a random number in
   * base 36.
   *
   * @returns {string} A random string of characters in base 36.
   *
   * @example
   * const randomStr = StringExtensions.random36();
   * console.log(randomStr); // Output: "3n5yzxjkf2o"
   */
  random36() {
    return Math.random().toString(36).slice(2)
  },

  /**
   * Generates a random string using base 16 (hexadecimal numbers).
   * This method is useful when you need a random string that includes both
   * numbers and letters in hexadecimal format. The generated string does not
   * include the leading '0.' that is part of the string representation of a
   * random number in base 16.
   *
   * @returns {string} A random string of characters in base 16.
   *
   * @example
   * const randomStr = StringExtensions.random16();
   * console.log(randomStr); // Output: "3a5f4c"
   */
  random16() {
    return Math.random().toString(16).slice(2)
  },

  /**
   * Generates a random RGB color code.
   *
   * This method generates a random hexadecimal number, slices off the
   * leading '0.' and takes the first 6 characters. It then pads the
   * end of the string with '0' until it is 6 characters long. The
   * result is a string that can be used as a color code in CSS.
   *
   * @param {string} [prefix='#'] - The prefix to prepend to the color
   * code. Defaults to '#'.
   *
   * @returns {string} A random RGB color code.
   *
   * @example
   * const randomColor = StringExtensions.randomRGB();
   * console.log(randomColor); // Output: "#3a5f4c"
   */
  randomRGBHex(prefix = '#') {
    const hex = Math.random().toString(16).slice(2).substring(0,6)
    return `${prefix}${hex.padEnd(6, '0')}`
  },

  /**
   * Generates a random ARGB color code.
   *
   * This method generates a random hexadecimal number, slices off the
   * leading '0.' and takes the first 8 characters. It then pads the
   * start of the string with '0' until it is 6 characters long and the
   * end of the string with '0' until it is 8 characters long. The
   * result is a string that can be used as a color code in CSS.
   *
   * @param {string} [prefix='#'] - The prefix to prepend to the color
   * code. Defaults to '#'.
   *
   * @returns {string} A random ARGB color code.
   *
   * @example
   * const randomColor = StringExtensions.randomARGB();
   * console.log(randomColor); // Output: "#3a5f4c00"
   */
  randomARGBHex(prefix = '#') {
    const hex = Math.random().toString(16).slice(2).substring(0,8)
    return `${prefix}${hex.padStart(6, '0').padEnd(8, '0')}`
  },

  /**
   * Generates a random RGBA color code.
   *
   * This method generates a random hexadecimal number, slices off the
   * leading '0.' and takes the first 8 characters. It then pads the
   * start of the string with '0' until it is 6 characters long and the
   * end of the string with '0' until it is 8 characters long. The
   * result is a string that can be used as a color code in CSS.
   *
   * @param {string} [prefix='#'] - The prefix to prepend to the color
   * code. Defaults to '#'.
   *
   * @returns {string} A random RGBA color code.
   *
   * @example
   * const randomColor = StringExtensions.randomRGBA();
   * console.log(randomColor); // Output: "#3a5f4c00"
   */
  randomRGBAHex(prefix = '#') {
    const hex = Math.random().toString(16).slice(2).substring(0,8)
    return `${prefix}${hex.padStart(6, '0').padStart(8, '0')}`
  },

  /**
   * Generates a random RGB color code.
   *
   * This method generates a random hexadecimal number, slices off the
   * leading '0.' and pads the end of the string with '0' until it is
   * 8 characters long. It then parses the first 6 characters into
   * three separate 2-character strings, each representing a color
   * component (red, green, blue) in hexadecimal format. These strings
   * are then converted into decimal format and used to construct an
   * RGB color code.
   *
   * @returns {string} A random RGB color code.
   *
   * @example
   * const randomColor = StringExtensions.randomRGB();
   * console.log(randomColor); // Output: "rgb(58,95,76)"
   */
  randomRGB() {
    const hex = Math.random().toString(16).slice(2).padEnd(8, '0')
    const red = parseInt(hex.substring(0,2), 16)
    const green = parseInt(hex.substring(2,4), 16)
    const blue = parseInt(hex.substring(4, 6), 16)
    return `rgb(${red}, ${green}, ${blue})`
  },

  /**
   * Generates a random RGBA color code with optional forced color values.
   *
   * This method generates a random hexadecimal number, slices off the
   * leading '0.' and pads the end of the string with '0' until it is
   * 8 characters long. It then parses the first 8 characters into
   * four separate 2-character strings, each representing a color
   * component (red, green, blue, alpha) in hexadecimal format. These strings
   * are then converted into decimal format and used to construct an
   * RGBA color code.
   *
   * If a color component is provided in the `force` parameter, it will
   * be used instead of a random value for that component.
   *
   * @param {Object} force - An object with properties for each color
   * component (red, green, blue, alpha) that should be forced to a
   * specific value. If a property is undefined or not provided, a
   * random value will be used for that component.
   * @param {number} force.red - The red component (0-255).
   * @param {number} force.green - The green component (0-255).
   * @param {number} force.blue - The blue component (0-255).
   * @param {number} force.alpha - The alpha component (0.0-1.0).
   *
   * @returns {string} A random RGBA color code.
   *
   * @example
   * const randomColor = StringExtensions.randomRGBA();
   * console.log(randomColor); // Output: "rgba(58,95,76,0.50)"
   *
   * const forcedGreen = StringExtensions.randomRGBA({ green: 255 });
   * console.log(forcedGreen); // Output: "rgba(58,255,76,0.50)"
   */
  randomRGBA(
    force = {
      red: undefined,
      green: undefined,
      blue: undefined,
      alpha: undefined
    }
  ) {
    const hex = Math.random().toString(16).slice(2).padEnd(8, '0')
    const red = force.red ?? parseInt(hex.substring(0,2), 16)
    const green = force.green ?? parseInt(hex.substring(2,4), 16)
    const blue = force.blue ?? parseInt(hex.substring(4, 6), 16)
    const alpha = force.alpha ??
      (parseInt(hex.substring(6, 8), 16) / 255.0) * 1.0

    return `rgba(${red}, ${green}, ${blue}, ${alpha.toFixed(2)})`
  },

  wrap(
    object = globalThis,
    options = {
      indent: 2,
      separator: ', ',
      indentCharacter: ' ',
      lineEnding: '\n',
      inspector: [Object, 'getOwnPropertyNames'],
      mapValues: undefined,
      mapLine: undefined,
    }
  ) {
    const {
      indent = 2,
      separator = ', ',
      indentCharacter = ' ',
      lineEnding = '\n',
      inspector = [Object, 'getOwnPropertyNames'],
      mapValues,
      mapLine,
    } = options ?? {}

    let tab = indent === 0 ? '' : indentCharacter.repeat(Number(indent) || 2);
    let maxLen = 76 - tab.length;
    let line = [];
    let getElements = inspector[0][inspector[1]]
    let values = Array.isArray(object) ? object : getElements(Object(object));

    if (typeof mapValues === 'function') {
      values = values.map(mapValues)
    }

    return values.reduce((acc,key,index,{length}) => {
      const endOfLine = index < (length - 1) ? separator : '';
      let ifCombined = [
        tab,...line.join(separator), key, endOfLine
      ].join('').trim();

      if (ifCombined.length < maxLen) {
        line.push(key)
      }
      else {

        let lineElements = [...line, key ]
        let debug = `<-- (len: ${[tab,...line.join(separator),key,endOfLine].join('').trim().length})`
        if (typeof mapLine === 'function') {
          lineElements = lineElements.map(mapLine)
        }

        const completeLine = (
          tab +
          lineElements.slice(1).join(separator) +
          endOfLine
        ).trim()

        acc.push(completeLine + debug);

        line = [];
      };

      return acc;
    }, []).join(lineEnding)
  },
});

const { isString: pIsString, ifString: pIfString } = StringExtensions.patches

/**
 * `StringPrototypeExtensions` provides a set of utility methods that are
 * added to the `String` prototype. This allows all string instances to
 * access new functionality directly, enhancing their capabilities beyond
 * the standard `String` class methods. These extensions are applied using
 * the `Patch` class from '@nejs/extension', ensuring that they do not
 * interfere with the global namespace or existing properties.
 *
 * The extensions include methods for extracting substrings based on
 * specific tokens, checking the presence of certain patterns, and more,
 * making string manipulation tasks more convenient and expressive.
 */
export const StringPrototypeExtensions = new Patch(String.prototype, {
  [Patch.kMutablyHidden]: {
    /**
     * Determines if the current object is a string.
     *
     * This getter uses the `pIsString` function from the
     * `StringExtensions` patch to check if the current object
     * (`this`) is a string.
     *
     * @type {boolean}
     * @readonly
     *
     * @example
     * const str = "Hello, World!"
     * console.log(str.isString) // Output: true
     *
     * const notStr = 123
     * console.log(notStr.isString) // Output: false
     */
    get isString() {
      return pIsString(this)
    },

    /**
     * Checks if the current object is a string and returns the
     * corresponding value based on the result.
     *
     * This method uses the `pIfString` function from the
     * `StringExtensions` patch to determine if the current object
     * (`this`) is a string. If it is a string, the `thenValue` is returned.
     * Otherwise, the `elseValue` is returned.
     *
     * @param {any} thenValue - The value to return if the current object
     * is a string.
     * @param {any} elseValue - The value to return if the current object
     * is not a string.
     * @returns {any} The `thenValue` if the current object is a string, or
     * the `elseValue` if it is not a string.
     *
     * @example
     * const str = "Hello, World!"
     * // 'Is a string'
     * console.log(str.ifString('Is a string', 'Not a string'))
     *
     * const notStr = 123
     * // 'Not a string'
     * console.log(notStr.ifString('Is a string', 'Not a string'))
     */
    ifString(thenValue, elseValue) {
      return pIfString(this, thenValue, elseValue)
    },

    /**
     * Returns an object representation of the string instance.
     *
     * This getter method creates and returns an object that wraps
     * the string instance, allowing it to be treated as an object.
     * The returned object is created using the `Object()`
     * constructor, which takes the string instance as its argument.
     *
     * @type {Object}
     * @readonly
     *
     * @example
     * const str = 'Hello, World!'
     * console.log(typeof str)        // 'string'
     * console.log(typeof str.instance) // 'object'
     */
    get instance() {
      return Object(this)
    },

    /**
     * Extracts a substring from the current string, starting at a given offset
     * and bounded by specified opening and closing tokens. This method is
     * particularly useful for parsing nested structures or quoted strings,
     * where the level of nesting or the presence of escape characters must
     * be considered.
     *
     * @param {number} offset The position in the string from which to start the
     * search for the substring.
     * @param {[string, string]} tokens An array containing two strings: the
     * opening and closing tokens that define the boundaries of the substring
     * to be extracted.
     * @returns {Object} An object with two properties: `extracted`, the
     * extracted substring, and `newOffset`, the position in the original
     * string immediately after the end of the extracted substring. If no
     * substring is found, `extracted` is `null` and `newOffset` is the same
     * as the input offset.
     */
    extractSubstring(offset = 0, tokens = parenthesisPair) {
      let [openToken, closeToken] = tokens;
      let depth = 0;
      let start = -1;
      let end = -1;
      let leadingToken = '';
      let firstToken = 0;

      for (let i = offset; i < this.length; i++) {
        const char = this[i];

        if (char === openToken) {
          depth++;
          if (start === -1)
            start = i;
        }
        else if (char === closeToken) {
          depth--;
          if (depth === 0) {
            end = i;
            break;
          }
        }
      }

      let lRange = [
        Math.max(0, start - 100),
        start
      ];
      let leading = [...this.substring(lRange[0], lRange[1])].reverse().join('')
      let reversedLeadingToken;

      try {
        reversedLeadingToken = /([^ \,\"\'\`]+)/.exec(leading)[1] ?? '';
        leadingToken = [...reversedLeadingToken].reverse().join('');
      }
      catch(ignored) { }

      if (start !== -1 && end !== -1) {
        const sliceRange = [start, end + 1];
        const extracted = this.slice(sliceRange[0], sliceRange[1]);

        return {
          extracted,
          range: [start, end],
          newOffset: end + 1,
          leadingToken,
        };
      }
      else {
        return {
          extracted: null,
          range: [start, end],
          newOffset: offset,
          leadingToken,
        };
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