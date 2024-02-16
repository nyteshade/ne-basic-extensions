import { Patch } from '@nejs/extension';
const parenthesisPair = ['(', ')'];
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
        if (value && (typeof value === 'string' || value instanceof String)) {
            return value.length > 0;
        }
        return false;
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
});
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
        let leading = [...this.substring(lRange[0], lRange[1])].reverse().join('');
        let reversedLeadingToken;
        try {
            reversedLeadingToken = /([^ \,\"\'\`]+)/.exec(leading)[1] ?? '';
            leadingToken = [...reversedLeadingToken].reverse().join('');
        }
        catch (ignored) { }
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
});
//# sourceMappingURL=stringextensions.js.map