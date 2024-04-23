import { Patch } from '@nejs/extension';
export const RegExpExtensions = new Patch(RegExp, {
    [Patch.kMutablyHidden]: {
        /**
         * Generates a regular expression pattern that matches any character.
         *
         * This method creates a regular expression pattern that matches any
         * character. The pattern can be configured to be greedy or non-greedy,
         * and to include or exclude newline characters.
         *
         * @param {boolean} [greedy=false] - If true, the pattern will be greedy,
         * meaning it will match as many characters as possible. If false, the
         * pattern will be non-greedy, meaning it will match as few characters
         * as possible.
         * @param {boolean} [includeNewlines=false] - If true, the pattern will
         * include newline characters ('\n' and '\r'). If false, newline
         * characters will be excluded from the pattern.
         * @returns {string} - The generated regular expression pattern.
         *
         * @example
         * // Generate a non-greedy pattern that excludes newlines
         * console.log(anything())  // Output: '[.]*?'
         *
         * @example
         * // Generate a greedy pattern that includes newlines
         * console.log(anything(true, true))  // Output: '[.\\n\\r]*'
         */
        anything(greedy = false, includeNewlines = false) {
            return `[.${includeNewlines ? '\\n\\r' : ''}]*${greedy ? '' : '?'}`;
        },
        /**
         * Creates a non-capturing group in a regular expression.
         *
         * This method wraps the provided string in a non-capturing group,
         * which is denoted by the syntax `(?:...)` in a regular expression.
         * Non-capturing groups match the pattern inside the group but do not
         * capture the matched content for later use.
         *
         * @param {string} string - The string to be wrapped in a non-capturing group.
         * @returns {string} - The string wrapped in a non-capturing group.
         *
         * @example
         * // Suppose we have a string 'abc'
         * const str = 'abc'
         *
         * // Using `nonCaptureGroup`
         * console.log(nonCaptureGroup(str))  // Output: '(?:abc)'
         */
        nonCaptureGroup(string) {
            return `(?:${string})`;
        },
        /**
         * Creates a capturing group in a regular expression.
         *
         * This method wraps the provided string in a capturing group,
         * which is denoted by the syntax `(...)` in a regular expression.
         * Capturing groups match the pattern inside the group and capture
         * the matched content for later use.
         *
         * @param {string} string - The string to be wrapped in a capturing group.
         * @returns {string} - The string wrapped in a capturing group.
         *
         * @example
         * // Suppose we have a string 'abc'
         * const str = 'abc'
         *
         * // Using `captureGroup`
         * console.log(captureGroup(str))  // Output: '(abc)'
         */
        captureGroup(string) {
            return `(${string})`;
        },
        /**
         * Creates a regular expression pattern that matches any one of the
         * provided strings.
         *
         * This method takes any number of strings as arguments, and returns a
         * string that represents a regular expression pattern. The pattern
         * matches any one of the provided strings. The strings are joined
         * together with the '|' character, which represents the OR operator
         * in regular expressions.
         *
         * @param {...string} strings - The strings to be included in the pattern.
         * @returns {string} - A string representing a regular expression pattern
         * that matches any one of the provided strings.
         *
         * @example
         * // Suppose we have strings 'abc', 'def', and 'ghi'
         * const str1 = 'abc'
         * const str2 = 'def'
         * const str3 = 'ghi'
         *
         * // Using `oneOf`
         * console.log(oneOf(str1, str2, str3))  // Output: 'abc|def|ghi'
         */
        oneOf(...strings) {
            return strings.join('|');
        },
        /**
         * Creates a regular expression pattern that matches zero or more
         * occurrences of the provided string.
         *
         * This method wraps the provided string in a non-capturing group,
         * which is denoted by the syntax `(?:...)` in a regular expression,
         * and appends the `*` character, which represents zero or more
         * occurrences in regular expressions.
         *
         * @param {string} string - The string to be matched zero or more times.
         * @returns {string} - A string representing a regular expression pattern
         * that matches zero or more occurrences of the provided string.
         *
         * @example
         * // Suppose we have a string 'abc'
         * const str = 'abc'
         *
         * // Using `zeroOrMore`
         * console.log(zeroOrMore(str))  // Output: '(?:abc)*'
         */
        zeroOrMore(string) {
            return `(?:${string})*`;
        },
        /**
         * Creates a regular expression pattern that matches zero or one
         * occurrence of the provided string.
         *
         * This method wraps the provided string in a non-capturing group,
         * which is denoted by the syntax `(?:...)` in a regular expression,
         * and appends the `?` character, which represents zero or one
         * occurrence in regular expressions.
         *
         * @param {string} string - The string to be matched zero or one time.
         * @returns {string} - A string representing a regular expression pattern
         * that matches zero or one occurrence of the provided string.
         *
         * @example
         * // Suppose we have a string 'abc'
         * const str = 'abc'
         *
         * // Using `zeroOrOne`
         * console.log(zeroOrOne(str))  // Output: '(?:abc)?'
         */
        zeroOrOne(string) {
            return `(?:${string})?`;
        },
        /**
         * Escapes special characters in a string for use in a regular expression.
         *
         * This method checks if the `RegExp.escape` method is available. If it is,
         * it uses that method to escape the string. If it's not, it uses a polyfill
         * method to escape the string.
         *
         * The polyfill method replaces all special characters in the string with
         * their escaped equivalents. The special characters are defined by the
         * regular expression `/[-[\]{}()*+?.,\\^$|#\s]/g`.
         *
         * @param {string} string - The string to be escaped.
         * @returns {string} - The escaped string.
         *
         * @example
         * // Suppose we have a string with special characters
         * const str = 'Hello, [World]!'
         *
         * // Using `escape` or `escapePolyfill`
         * console.log(RegExp[RegExp.escape ? 'escapePolyfill' : 'escape'](str))
         * // Output: 'Hello\\, \\[World\\]\\!'
         */
        escape(string) {
            return RegExpEscape(string);
        },
        /**
         * Getter method that returns a string 'null'.
         *
         * This method is used when you need a string representation of null
         * in your regular expressions. It simply returns the string 'null'.
         *
         * @returns {string} - A string 'null'.
         *
         * @example
         * // Using `null`
         * console.log(this.null)  // Output: 'null'
         */
        get null() {
            return 'null';
        },
        /**
         * Getter method that returns a regular expression string for boolean
         * values.
         *
         * This method uses the `oneOf` method to create a regular expression
         * string that matches either 'true' or 'false'. This is useful when you
         * need to match boolean values in a string using a regular expression.
         *
         * @returns {string} - A regular expression string that matches 'true'
         * or 'false'.
         *
         * @example
         * // Using `bool`
         * const boolRegex = new RegExp(this.bool)
         * console.log(boolRegex.test('true'))  // Output: true
         * console.log(boolRegex.test('false')) // Output: true
         * console.log(boolRegex.test('maybe')) // Output: false
         */
        get bool() {
            return this.oneOf('true', 'false');
        },
        /**
         * Generates a regular expression string that matches the symbols of
         * specified currencies.
         *
         * This method uses the Intl API to get the symbols of the specified
         * currencies and constructs a regular expression string that matches
         * these symbols. If no specific currencies are provided, it defaults
         * to all known currencies. If a single currency is provided as a
         * string, it is converted to an array. If the symbols array is empty
         * after filtering out unknown currencies, it defaults back to all
         * known currencies.
         *
         * @param {Array|string} [symbols=[['*'], ['USD','GBP']][0]] - The
         * currencies to include in the regular expression. Can be an array
         * of currency codes or a single currency code as a string. Defaults
         * to all known currencies.
         * @param {string} [locale='en-US'] - The locale to use when getting
         * the currency symbols. Defaults to 'en-US'.
         * @returns {string} - A regular expression string that matches the
         * symbols of the specified currencies.
         *
         * @example
         * // Using `currencySymbols` with default parameters
         * console.log(this.currencySymbols())
         * // Output: A regular expression string that matches all known
         * // currency symbols
         *
         * @example
         * // Using `currencySymbols` with specific currencies
         * console.log(this.currencySymbols(['USD', 'EUR']))
         * // Output: A regular expression string that matches the symbols
         * // of USD and EUR
         */
        currencySymbols(symbols = [['*'], ['USD', 'GBP']][0], locale = 'en-US') {
            const known = Intl.supportedValuesOf('currency');
            const has = code => !!~known.indexOf(code);
            if (typeof symbols === 'string' && has(symbols)) {
                symbols = [symbols];
            }
            if (!Array.isArray(symbols)) {
                symbols = known;
            }
            symbols = symbols.filter(symbol => has(symbol));
            if (!symbols.length) {
                symbols = known;
            }
            const opts = (currency) => ({ style: 'currency', currency });
            const fmt = (place, currency) => Intl.NumberFormat(place, opts(currency));
            const codes = (((symbols.length === 1 && symbols[0] === '*') ? known : symbols)
                .filter(code => has(code))
                .map(currency => {
                const symbol = fmt(locale, currency).formatToParts()?.[0].value;
                return symbol && `(?:${RegExp.escape(symbol)})`;
            })
                .join('|'));
            return codes;
        },
        /**
         * Getter method that returns a regular expression string for numbers.
         *
         * This method returns a regular expression string that matches both
         * integer and floating point numbers. The returned regular expression
         * string is '\\d+\\.?\\d*', which matches one or more digits followed
         * by an optional decimal point and zero or more digits.
         *
         * @returns {string} - A regular expression string that matches numbers.
         *
         * @example
         * // Using `number`
         * const numberRegex = new RegExp(this.number)
         * console.log(numberRegex.test('123'))    // Output: true
         * console.log(numberRegex.test('123.45')) // Output: true
         * console.log(numberRegex.test('abc'))    // Output: false
         */
        get number() {
            const instance = Object(`\\d+\\.?\\d*`);
            const self = this;
            Object.defineProperties(instance, {
                // alias for .float
                any: { get() { return String(instance); } },
                /**
                 * Getter method that returns a regular expression string for floating
                 * point numbers.
                 *
                 * This method returns a regular expression string that matches floating
                 * point numbers. It leverages the 'number' getter method which matches
                 * both integer and floating point numbers. The returned regular expression
                 * string is '\\d+\\.?\\d*', which matches one or more digits followed by
                 * an optional decimal point and zero or more digits.
                 *
                 * @returns {string} - A regular expression string that matches floating
                 * point numbers.
                 *
                 * @example
                 * // Using `float`
                 * const floatRegex = new RegExp(this.float)
                 * console.log(floatRegex.test('123.45')) // Output: true
                 * console.log(floatRegex.test('123'))    // Output: false
                 * console.log(floatRegex.test('abc'))    // Output: false
                 */
                float: { get() { return String(instance); } },
                // any known locale currency symbol + .float
                money: { get() { return `(?:${self.currencySymbols()})?${this.float}`; } },
                /**
                 * Getter method that returns a regular expression string for integers.
                 *
                 * This method returns a regular expression string that matches integer
                 * numbers. The returned regular expression string is '\\d+', which matches
                 * one or more digits.
                 *
                 * @returns {string} - A regular expression string that matches integers.
                 *
                 * @example
                 * // Using `integer`
                 * const integerRegex = new RegExp(this.integer)
                 * console.log(integerRegex.test('123'))    // Output: true
                 * console.log(integerRegex.test('123.45')) // Output: false
                 * console.log(integerRegex.test('abc'))    // Output: false
                 */
                integer: { get() { return `\\d+`; } },
                /**
                 * Getter method that returns a regular expression string for pretty
                 * numbers.
                 *
                 * This method returns a regular expression string that matches numbers
                 * with commas or spaces for thousands separators. The returned regular
                 * expression string is '[\\d\\$]+\\.?[\\d,\\$]*', which matches one or
                 * more digits or dollar signs, followed by an optional decimal point,
                 * and zero or more digits, commas, or dollar signs.
                 *
                 * @returns {string} - A regular expression string that matches pretty
                 * numbers.
                 *
                 * @example
                 * // Using `pretty`
                 * const prettyRegex = new RegExp(this.pretty)
                 * console.log(prettyRegex.test('1,234.56')) // Output: true
                 * console.log(prettyRegex.test('1234.56'))  // Output: true
                 * console.log(prettyRegex.test('1 234.56')) // Output: true
                 * console.log(prettyRegex.test('abc'))      // Output: false
                 */
                pretty: {
                    value(locale = 'en-US') {
                        const symbols = self.zeroOrMore(self.currencySymbols(['*'], locale));
                        return `${symbols}[\\d,]+\\.?[\\d]*`;
                    }
                },
                /**
                 * Getter method that returns a regular expression string for JavaScript
                 * literals.
                 *
                 * This method returns a regular expression string that matches JavaScript
                 * literals. The returned regular expression string is '[\\d_]+', which
                 * matches one or more digits or underscores.
                 *
                 * @returns {string} - A regular expression string that matches JavaScript
                 * literals.
                 *
                 * @example
                 * // Using `jsLiteral`
                 * const jsLiteralRegex = new RegExp(this.jsLiteral)
                 * console.log(jsLiteralRegex.test('123_456')) // Output: true
                 * console.log(jsLiteralRegex.test('abc'))     // Output: false
                 */
                jsLiteral: { get() { return `[\\d_]+`; } }
            });
            return instance;
        },
        /**
         * Getter method that returns a regular expression string for integers.
         *
         * This method returns a regular expression string that matches integer
         * numbers. The returned regular expression string is '\\d+', which matches
         * one or more digits.
         *
         * @returns {string} - A regular expression string that matches integers.
         *
         * @example
         * // Using `integer`
         * const integerRegex = new RegExp(this.integer)
         * console.log(integerRegex.test('123'))    // Output: true
         * console.log(integerRegex.test('123.45')) // Output: false
         * console.log(integerRegex.test('abc'))    // Output: false
         */
        get integer() {
            return `\\d+`;
        },
        get string() {
            return {
                get doubleQuoted() {
                    return '"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"';
                },
                get singleQuoted() {
                    return "'[^'\\\\]*(?:\\\\.[^'\\\\]*)*'";
                }
            };
        },
        get whitespace() {
            return `\\s*`;
        },
        get comma() {
            return `,${this.whitespace}`;
        },
    }
}, {
    conditions: {
        ['escape']() { return !Reflect.has(RegExp, 'escape'); },
    }
});
// Simple variant that does not require external dependencies; may not cover
// all known use cases.
function RegExpEscape(string) {
    return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
//# sourceMappingURL=regular.expression.extensions.js.map