import { Patch } from '@nejs/extension';
export const JSONExtensions = new Patch(JSON, {
    [Patch.kMutablyHidden]: {
        /**
         * The `extractFrom` method attempts to extract a JSON object from a string.
         * It uses a regular expression to identify potential JSON objects in the
         * string and attempts to parse them. If a valid JSON object is found, it is
         * returned. If no valid JSON object is found, the method returns undefined.
         *
         * NOTE: This method will only find JSON from an iterated upon start spot
         * until the end of the string. So `'JSON follows {"count": 0}'` will
         * return `{count: 0}` but `'JSON follows {"count": 0} and more'` will
         * fail to locate any JSON in the String. You've been warned.
         *
         * @param {string} string - The string from which to extract a JSON object.
         * @returns {Object|undefined} - The first valid JSON object found in the
         * string, or undefined if no valid JSON object is found.
         *
         * @example
         * // Suppose we have a string with embedded JSON
         * const str1 = 'Hello {"name":"John", "age":30} World'
         * const str2 = 'Hello {"name": "John", "age": 30}'
         *
         * // Using `extractFrom`
         * console.log(JSON.extractFrom(str1))  // Output: undefined
         * console.log(JSON.extractFrom(str2))  // Output: {name: 'John', age: 30}
         */
        extractFrom(string) {
            const pattern = /([\w\{\[\"]+) ?/g;
            const decoder = part => {
                try {
                    return JSON.parse(part);
                }
                catch (_) {
                    return undefined;
                }
            };
            for (let part = pattern.exec(string); part; part = pattern.exec(string)) {
                if (part && part?.index) {
                    const decoded = decoder(string.substring(part.index));
                    if (decoded) {
                        return decoded;
                    }
                }
            }
            return undefined;
        },
        /**
         * The `mightContain` method checks if a string might contain a JSON object.
         * It uses the `JSONStartPattern` regular expression to search for potential
         * JSON objects in the string. If a potential JSON object is found, the method
         * returns true. If no potential JSON object is found, the method returns false.
         *
         * @param {string} string - The string to check for potential JSON objects.
         * @returns {boolean} - Returns true if the string might contain a JSON object,
         * false otherwise.
         *
         * @example
         * // Suppose we have a string with embedded JSON
         * const str = 'Hello {"name":"John", "age":30} World'
         *
         * // Using `mightContain`
         * console.log(JSON.mightContain(str))  // Output: true
         */
        mightContain(string) {
            return !!this.JSONStartPattern.exec(string);
        },
        /**
         * Getter method for the JSONStartPattern.
         *
         * This method constructs a regular expression pattern that is used to
         * identify potential JSON objects in a string. The pattern is designed
         * to match various JSON data types including null, boolean, number,
         * string, object, and array.
         *
         * The pattern is constructed using an array of strings, each representing
         * a part of the pattern. The array is then joined into a single string
         * and passed to the RegExp constructor to create the pattern.
         *
         * @returns {RegExp} - The constructed regular expression pattern.
         *
         * @example
         * // Using `JSONStartPattern`
         * const pattern = JSONStartPattern;
         * const str = 'Hello {"name":"John", "age":30} World';
         * const match = pattern.exec(str);
         * console.log(match[0]);  // Output: '{"name":"John", "age":30}'
         */
        get JSONStartPattern() {
            const pattern = new RegExp([
                '(?:', // Start with a non-capturing group and match
                '(null)|', // ...a null
                '(true|false)|', // ...a bool
                '(\\d+\\.?\\d*)|', // ...a number (including floats)
                '("[^\\"]*(?:[^:])")|', // ...a double quote (start of string)
                '((?:\\{.*\\})+)|', // ...an open curly brace (object)
                '((?:\\[.*\\]+))', // ...an open square bracket (array)
                ')+', // End of the groups
            ].join(''), 'gm');
            return pattern;
        },
    }
});
//# sourceMappingURL=json.extensions.js.map