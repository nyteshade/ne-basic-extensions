"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolPrototypeExtensions = exports.SymbolExtensions = void 0;
const extension_1 = require("@nejs/extension");
const symkeys_js_1 = require("./classes/symkeys.js");
const json_extensions_js_1 = require("./json.extensions.js");
const JSONToggle = new extension_1.PatchToggle(json_extensions_js_1.JSONExtensions);
/**
 * `SymbolExtensions` is a patch for the JavaScript built-in `Symbol` class. It
 * adds utility methods to the `Symbol` class without modifying the global namespace
 * directly. This patch includes methods for key validation, object type checking,
 * and retrieving the string tag of an object. These methods are useful for
 * enhancing the capabilities of the standard `Symbol` class with additional
 * utility functions.
 */
exports.SymbolExtensions = new extension_1.Patch(Symbol, {
    add(named, associatedData = {}) {
        return this.keys.add(named, associatedData);
    },
    deleteData(forSymbol, replaceWith = undefined) {
        return this.keys.deleteData(forSymbol, replaceWith);
    },
    hasData(forSymbol) {
        return this.keys.hasData(forSymbol);
    },
    /**
     * The `isSymbol` method does exactly what one would it expect. It returns
     * true if the string matches typeof or instanceof as a symbol.
     *
     * @param {*} value checks to see if the `value` is a string
     * @returns {boolean} `true` if it is a `Symbol`, `false` otherwise
     */
    isSymbol(value) {
        return value && (typeof value === 'symbol');
    },
    /**
     * Returns true if the supplied value is a Symbol created using
     * `Symbol.for()`.
     *
     * @param {any} value assumption is that the supplied value is of type
     * 'symbol' however, unless `allowOnlySymbols` is set to `true`, `false`
     * will be returned for any non-symbol values.
     * @param {boolean} allowOnlySymbols true if an error should be thrown
     * if the supplied value is not of type 'symbol'
     * @returns true if the symbol is registered, meaning, none of the spec
     * static symbols (`toStringTag`, `iterator`, etc...), and no symbols
     * created by passing a value directly to the Symbol function, such as
     * `Symbol('name')`
     */
    isRegistered(value, allowOnlySymbols = false) {
        if (!Symbol.isSymbol(value)) {
            if (allowOnlySymbols) {
                throw new TypeError('allowOnlySymbols specified; value is not a symbol');
            }
            return false;
        }
        return Symbol.keyFor(value) !== undefined;
    },
    /**
     * A function that returns true if the symbol is not registered, meaning,
     * any of the spec static symbols (`toStringTag`, `iterator`, etc...), and
     * any symbols created by passing a value directly to the `Symbol` function,
     * such as `Symbol('name')`.
     *
     * @param {any} value assumption is that the supplied value is of type
     * 'symbol' however, unless allowOnlySymbols is set to true, false will
     * be returned for any non-symbol values.
     * @param {boolean} allowOnlySymbols true if an error should be thrown
     * if the supplied value is not of type 'symbol'
     * @returns true if the symbol is not registered, meaning, any of the
     * spec static symbols (`toStringTag`, `iterator`, etc...), and any symbols
     * created by passing a value directly to the `Symbol` function, such as
     * `Symbol('name')`
     * @returns true if the `value` in question is both a `symbol` and has
     * returns `undefined` if passed to `Symbol.keyFor`
     */
    isNonRegistered(value, allowOnlySymbols = false) {
        return !Symbol.isRegistered(value, allowOnlySymbols);
    },
    /**
     * `keys` is an instance of the `Symkeys` class, initialized with the
     * domain 'nejs'. The `Symkeys` class provides a way to easily generate
     * Symbol.for elements that follow particular pattern. Symkeys also
     * allows associated data storage with each generated key.
     *
     * @type {Symkeys}
     * @see {@link SymKeys}
     * @example
     * // Returns something like Symbol.for('@nejs.prototype #rwiy2o905d')
     * const kOriginal = Symbol.keys.add('prototypes')
     *
     * // Which can be used to retrieve and fetch data associated with that key
     * // The value stored is an array by default, but can be anything. It can
     * // be accessed one property at a time
     * Symbol.keys[kOriginal].original = Object.prototype
     * Symbol.keys[kOriginal].modified = Object.create(Object.prototype, ...)
     *
     * // Or wholesale replaced
     * Symbol.keys[kOriginal] = [Object.prototype, Array.prototype]
     *
     * // But if all Symbol Extensions are in place, including prototype add-ons
     * kOriginal.data.original = Object.prototype           // ...and...
     * kOriginal.data = [Object.prototype, Array.prototype] // ...both work
     */
    keys: new symkeys_js_1.Symkeys('nejs'),
    setData(forSymbol, value) {
        this.keys.setData(forSymbol, value);
    },
    /**
     * Creates a new Symbol with the given name and optional data. If data
     * is provided, it will be stringified and appended to the symbol's
     * name. This method is useful for creating unique symbols that carry
     * additional metadata.
     *
     * @param {string} name The name of the symbol.
     * @param {*} [data] Optional data to be associated with the symbol.
     * @returns {symbol} A new symbol created with Symbol.for(), using the
     * provided name and stringified data (if provided).
     *
     * @example
     * const symbolWithData = Symbol.withData('mySymbol', { foo: 'bar' })
     * console.log(symbolWithData.toString())
     * // Output: "Symbol(mySymbol {"foo":"bar"})"
     *
     * @example
     * const symbolWithoutData = Symbol.withData('mySymbol')
     * console.log(symbolWithoutData.toString())
     * // Output: "Symbol(mySymbol)"
     */
    withData(name, data) {
        return data !== undefined
            ? Symbol.for(`${name} ${JSON.stringify(data)}`)
            : Symbol.for(name);
    },
});
exports.SymbolPrototypeExtensions = new extension_1.Patch(Symbol.prototype, {
    [extension_1.Patch.kMutablyHidden]: {
        /**
         * Returns an object representation of the symbol instance.
         *
         * This getter method creates and returns an object that wraps the
         * symbol instance, allowing it to be treated as an object. The
         * returned object is created using the `Object()` constructor,
         * which takes the symbol instance as its argument.
         *
         * @type {Object}
         * @readonly
         *
         * @example
         * const sym = Symbol('example')
         * console.log(typeof sym)        // 'symbol'
         * console.log(typeof sym.instance) // 'object'
         */
        get instance() {
            return Object(this);
        },
        /**
         * Getter method for retrieving the data associated with a symbol.
         *
         * This method first checks if the symbol is a Symkey created symbol
         * by checking the existence of Symbol.keys and if the symbol's
         * description matches the Symkey pattern. If it is a Symkey symbol,
         * it attempts to fetch its associated data.
         *
         * NOTE: Symkey data is returned as its value directly, this is because
         * it is stored in a {@link Map}. Embedded JSON data might be expensive
         * to parse and as such a function is returned when data is accessed that
         * needs to be invoked in order to decode its contents. See
         * `{@link mightHaveEmbeddedJSON}` for more information.
         *
         * If the symbol is not a Symkey symbol or if no data is associated
         * with it, the method attempts to parse the symbol's description as
         * JSON and returns the first valid JSON object found.
         *
         * If no valid JSON object is found in the description, the method
         * returns undefined.
         *
         * @type {Object|Function}
         * @readonly
         *
         * @example
         * const keys = new Symkeys
         * const key = keys.add('example', {count: 0})
         * const data = key.data // note this isn't function!!
         * const count = data.count
         *
         * @example
         * const sym = Symbol.for('fun {"name":"Brie"}')
         * let json = sym.data() // {name: 'Brie'} JS object
         *
         * @example
         * const sym = Symbol('mySymbol')
         * let data = sym.data() // undefined
         */
        get data() {
            if (Symbol?.keys && symkeys_js_1.Symkeys.isSymkey(this)) {
                const possibleData = Symbol.keys[this];
                if (possibleData) {
                    return possibleData;
                }
            }
            let result = undefined;
            let revertToggle = false;
            if (!json_extensions_js_1.JSONExtensions.applied) {
                JSONToggle.start();
                revertToggle = true;
            }
            if (JSON.mightContain(this.description)) {
                try {
                    result = JSON.extractFrom(this.description);
                }
                catch (ignore) { }
            }
            if (revertToggle) {
                JSONToggle.stop();
            }
            return result;
        },
        /**
         * Sets the data associated with a symbol.
         *
         * This setter method checks if the symbol is a Symkey and if it has
         * associated data. If both conditions are met, it sets the data of the
         * symbol to the provided value and returns true. If the conditions are
         * not met, it simply returns false.
         *
         * While Symbols have been upgraded to also support embedded JSON data
         * with this extension, symbol descriptions are static. Non Symkey symbols
         * do not associated their data outside of a symbol, and cannot be changed,
         * there new data cannot be set on them.
         *
         * @param {any} value - The value to be set as the symbol's data.
         * @returns {boolean} - Returns true if the data was successfully set,
         * false otherwise.
         *
         * @example
         * const sym = Symbol.for('fun {"name":"Brie"}')
         * Symkeys.isSymkey(sym) // false; not in Symkey format
         * let json = sym.data() // {name: 'Brie'} JS object
         * sym.data = JSON.stringify({name: 'Jane'}) // fails silently
         * json = sym.data() // {name: 'Brie'} is hard-coded in description
         *
         * @example
         * const sym = Symbol('mySymbol')
         * Symkeys.isSymkey(sym) // false; not in Symkey format
         * Symkeys.hasData(sym) // false
         * sym.data = { name: 'John', age: 30 } // will fail silently
         * Symkeys.hasData(sym) // still false
         *
         * // Now let's create a Symkey with data
         * const symWithData = Symkeys.create('mySymbolWithData',
         *                                    { name: 'Jane', age: 25 })
         * Symkeys.isSymkey(symWithData) // true
         * Symkeys.hasData(symWithData) // true
         * symWithData.data = { name: 'Jane', age: 26 } // will succeed
         * Symkeys.getData(symWithData) // returns { name: 'Jane', age: 26 }
         */
        set data(value) {
            if (symkeys_js_1.Symkeys.isSymkey(this) && symkeys_js_1.Symkeys.hasData(this)) {
                Symbol.keys.setData(this, value);
            }
        },
        /**
         * Checks if the symbol might have embedded JSON data.
         *
         * This getter method checks if the symbol's description might contain
         * JSON data and if the data property of the symbol is a function. If both
         * conditions are met, it returns true, otherwise it returns false.
         *
         * @returns {boolean} - Returns true if the symbol might have embedded
         * JSON, false otherwise.
         *
         * @example
         * const sym = Symbol.for('fun {"name":"Brie"}')
         * console.log(sym.mightHaveEmbeddedJSON) // Output: true
         *
         * @example
         * const sym = Symbol('mySymbol')
         * console.log(sym.mightHaveEmbeddedJSON) // Output: false
         */
        get mightHaveEmbeddedJSON() {
            return mightContain(this.description);
        },
        get sgrString() {
            let revert = false;
            let detail = undefined;
            let { sgr } = String;
            if (!sgr) {
                sgr = (string, ...args) => string;
            }
            if (!json_extensions_js_1.JSONExtensions.applied) {
                JSONToggle.start();
                revert = true;
            }
            if ((detail = JSON.mightContain(this.description, true))) {
                let jsonText = detail[2][0];
                let index = detail[1];
                if (~index && jsonText && jsonText.length > 30) {
                    let desc = this.description;
                    let newDescription = [
                        sgr(`Symbol.for(${desc.slice(0, index)}`, 'green'),
                        sgr(jsonText.slice(0, 10), 'di'),
                        '...',
                        sgr(jsonText.slice(-5), 'di'),
                        sgr(`${desc.slice(index + jsonText.length + 1)})`, 'green'),
                    ].join('');
                    if (revert) {
                        JSONToggle.stop();
                    }
                    return `${newDescription}`;
                }
            }
            if (revert) {
                JSONToggle.stop();
            }
            return newDescription;
        },
        /**
         * Custom inspect method for Node.js util.inspect.
         *
         * NOTE: this will only apply if looking at an instance of Symbol,
         * sadly; {@see SymbolPrototypeExtensions.instance}
         *
         * This method is used by Node.js util.inspect to provide a custom
         * representation of the symbol when inspected. It checks if the
         * symbol's description might contain JSON data and if so, it
         * truncates the JSON data in the description to a maximum of 30
         * characters and formats the output with colors using the `sgr`
         * function from the `String` object.
         *
         * @param {number} depth - The current depth of the recursive
         * inspection.
         * @param {Object} options - The options object passed to
         * util.inspect.
         * @param {Function} inspect - The original util.inspect function.
         *
         * @returns {string} - The formatted representation of the symbol.
         *
         * @example
         * const sym = Symbol.for('fun {"name":"John Doe"}')
         * console.log(util.inspect(sym))
         * // Output: Symbol.for(fun {"name":"John ...hn Doe"})
         */
        [Symbol.for('nodejs.util.inspect.custom')](depth, options, inspect) {
            let revert = false;
            let detail = undefined;
            let { sgr } = String;
            if (!sgr) {
                sgr = (string, ...args) => string;
            }
            if (!json_extensions_js_1.JSONExtensions.applied) {
                JSONToggle.start();
                revert = true;
            }
            if ((detail = JSON.mightContain(this.description, true))) {
                let jsonText = detail[2][0];
                let index = detail[1];
                if (~index && jsonText && jsonText.length > 30) {
                    let desc = this.description;
                    let newDescription = [
                        sgr(`Symbol.for(${desc.slice(0, index)}`, 'green'),
                        sgr(jsonText.slice(0, 10), 'di'),
                        '...',
                        sgr(jsonText.slice(-5), 'di'),
                        sgr(`${desc.slice(index + jsonText.length + 1)})`, 'green'),
                    ].join('');
                    if (revert) {
                        JSONToggle.stop();
                    }
                    return `${newDescription}`;
                }
            }
            if (revert) {
                JSONToggle.stop();
            }
            return inspect(this, { colors: true });
        },
    },
});
//# sourceMappingURL=symbol.extensions.js.map