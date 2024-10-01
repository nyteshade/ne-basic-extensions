import { Patch, PatchToggle } from '@nejs/extension';

import { Symkeys } from './classes/symkeys.js'
import { JSONExtensions } from './json.extensions.js'

const JSONToggle = new PatchToggle(JSONExtensions)
const symkeys = new Symkeys('nejs')

/**
 * `SymbolExtensions` is a patch for the JavaScript built-in `Symbol` class. It
 * adds utility methods to the `Symbol` class without modifying the global namespace
 * directly. This patch includes methods for key validation, object type checking,
 * and retrieving the string tag of an object. These methods are useful for
 * enhancing the capabilities of the standard `Symbol` class with additional
 * utility functions.
 */
export const SymbolExtensions = new Patch(Symbol, {
  /**
   * Adds a new symbol to the Symkeys instance with the given name and
   * associated data.
   *
   * This method generates a unique symbol based on the provided name,
   * optional domain, separator, and token. It also allows embedding
   * additional data into the symbol's name.
   *
   * @param {string} named - The base name for the new symbol.
   * @param {Object} options - Additional options for the symbol.
   * @param {*} [options.associate={}] - Data to associate with the symbol.
   * @param {Object} [options.embed] - Optional data to embed in the symbol.
   * @param {string} [options.useDomain] - Optional domain to include in the
   * symbol's name.
   * @param {string} [options.useSeparator] - Optional separator to use in
   * the symbol's name.
   * @param {string} [options.useToken] - Optional token to use for the
   * symbol. If not provided, a random token is generated.
   * @returns {Symbol} The newly created symbol.
   *
   * @example
   * // Add a symbol with associated data
   * const mySymbol = SymbolExtensions.add('myIdentifier', {
   *   associate: { foo: 'bar' },
   *   embed: { baz: 'qux' },
   *   useDomain: 'exampleDomain',
   *   useSeparator: '-',
   *   useToken: 'customToken',
   * })
   * console.log(mySymbol)
   * // Symbol(@exampleDomain-myIdentifier {"baz":"qux"} #customToken)
   */
  add(named, { associate = {}, embed, useToken, useDomain, useSeparator }) {
    return this.keys.add(named, {
      associate, embed, useToken, useDomain, useSeparator,
    })
  },

  /**
   * Deletes the data associated with a given symbol from the Symkeys
   * instance.
   *
   * This method allows removal of the data that has been associated with a
   * particular symbol in the Symkeys instance. It is useful when you want
   * to clean up or remove stored information associated with a symbol.
   *
   * @param {Symbol} forSymbol - The symbol whose associated data is to be
   * deleted.
   * @param {*} [replaceWith=undefined] - Optionally, if `replaceWith` is
   * not `undefined`, a new value can be set after the original is deleted
   * @returns {boolean} - Returns true if an element in the Symkeys existed
   * and has been removed, or false if the element does not exist
   *
   * @example
   * // Assuming 'mySymbol' is a symbol that has been added to the Symkeys
   * // with associated data
   * const isDeleted = Symbol.deleteData(mySymbol)
   * console.log(isDeleted) // Output: true if data was deleted, false
   *
   * @example
   * // Deleting data and replacing it with a new value
   * const mySymbol = Symbol.for('mySymbol')
   * Symbol.setData(mySymbol, { foo: 'bar' })
   * Symbol.deleteData(mySymbol, { newFoo: 'newBar' })
   * console.log(Symbol.keys.data(mySymbol)) // Output: { newFoo: 'newBar' }
   */
  deleteData(forSymbol, replaceWith = undefined) {
    return this.keys.deleteData(forSymbol, replaceWith)
  },

  /**
   * Evaluates a key or value and generates a shared symbol key based on
   * the provided object name and owner name.
   *
   * This method takes a key or value, an object name, and an object owner
   * name as parameters. It determines the type of each parameter and
   * constructs a token string by concatenating the owner name, object
   * name, and key/value (if they are valid object keys).
   *
   * The token string is then used to create a shared symbol key using the
   * `sharedKey` method of the current instance. The shared symbol key is
   * returned along with the token as associated data.
   *
   * @param {string|Symbol} keyOrValue - The key or value to evaluate.
   * @param {string|Symbol} objectName - The name of the object associated
   * with the key or value.
   * @param {string|Function|Object} objectOwnerName - The name of the
   * owner of the object.
   * @returns {Symbol} The shared symbol key generated based on the
   * provided parameters.
   *
   * @example
   * const symbolKey = SymbolExtensions.evalKey('myKey', 'myObject', 'myOwner')
   * console.log(symbolKey)
   * // Output: Symbol(@nejs.internal.refkey:myOwner.myObject.myKey)
   *
   * @example
   * const symbolKey = SymbolExtensions.evalKey(
   *   'myValue', () => {}, { [Symbol.toStringTag]: 'myOwner' }
   * )
   * console.log(symbolKey)
   * // Output: Symbol(@nejs.internal.refkey:myOwner.myValue)
   */
  evalKey(keyOrValue, objectName, objectOwnerName) {
    const is = {
      string(v) { return typeof v === 'string' },
      func(v) { return typeof v === 'function' },
      object(v) { return typeof v === 'object' },
      objKey(v) { return ['symbol', 'string'].some(k => typeof v === k) },
    }
    is.key = is.objKey(keyOrValue)

    const ownerName = (
      (is.string(objectOwnerName) && objectOwnerName) ||
      (is.func(objectOwnerName) && objectOwnerName?.name) ||
      (is.object(objectOwnerName) && objectOwnerName?.[Symbol.toStringTag]) ||
      undefined
    )

    const token = [
      ownerName && `${ownerName}.` || '',
      is.objKey(objectName) && `${objectName}.` || '',
      is.objKey(keyOrValue) && `${keyOrValue}`,
    ].join('')

    return this.sharedKey(`internal.refkey:${token}`, { token })
  },

  /**
   * Checks if the Symkeys instance has data associated with a given
   * symbol
   *
   * This method checks if the Symkeys instance has any data associated
   * with the provided symbol. It is useful when you need to verify if
   * data exists for a particular symbol before attempting to retrieve
   * or manipulate it
   *
   * @param {Symbol} forSymbol - The symbol to check for associated data
   * @returns {boolean} Returns true if data exists for the symbol,
   *                    false otherwise
   *
   * @example
   * // Assuming 'mySymbol' is a symbol that has been added to the
   * // Symkeys with associated data
   * const hasData = Symbol.hasData(mySymbol)
   * console.log(hasData) // Output: true
   *
   * @example
   * // Assuming 'nonExistentSymbol' is a symbol that has not been added
   * // to the Symkeys
   * const hasData = Symbol.hasData(nonExistentSymbol)
   * console.log(hasData) // Output: false
   */
  hasData(forSymbol) {
    return this.keys.hasData(forSymbol)
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
        throw new TypeError('allowOnlySymbols specified; value is not a symbol')
      }
      return false
    }

    return Symbol.keyFor(value) !== undefined
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
    return !Symbol.isRegistered(value, allowOnlySymbols)
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
  get keys() { return symkeys },

  /**
   * Sets the data associated with a given symbol in the Symkeys
   * instance.
   *
   * This method allows you to store data associated with a specific
   * symbol in the Symkeys instance. It is useful when you want to
   * attach additional information or metadata to a symbol for later
   * retrieval.
   *
   * @param {Symbol} forSymbol - The symbol for which to set the
   * associated data.
   * @param {*} value - The data to be associated with the symbol.
   *
   * @example
   * // Create a symbol
   * const mySymbol = Symbol.for('mySymbol')
   *
   * // Set data for the symbol
   * Symbol.setData(mySymbol, { foo: 'bar' })
   *
   * // Retrieve the data associated with the symbol
   * const data = Symbol.keys.data(mySymbol)
   * console.log(data) // Output: { foo: 'bar' }
   */
  setData(forSymbol, value) {
    this.keys.setData(forSymbol, value)
  },

  /**
   * Creates or retrieves a shared symbol key with the given name and
   * optional associated data.
   *
   * This method generates a shared symbol key using the provided name
   * and optional parameters. If the symbol already exists in the
   * Symkeys's internal map, it updates the associated data if provided.
   * Otherwise, it creates a new symbol with the specified parameters.
   *
   * @param {string} named - The name to use for the shared symbol key.
   * @param {Object} options - Optional parameters for the shared symbol key.
   * @param {Object} [options.associate] - Data to associate with the symbol.
   * @param {Object} [options.embed] - Data to embed in the symbol's name.
   * @param {string} [options.useDomain] - Domain to include in the symbol's name.
   * @param {string} [options.useSeparator] - Separator to use in the symbol's name.
   * @returns {Symbol} The shared symbol key.
   *
   * @example
   * // Create or retrieve a shared symbol key with associated data
   * const sharedSymbol = Symbol.sharedKey('mySharedKey', {
   *   associate: { foo: 'bar' },
   *   embed: { baz: 'qux' },
   *   useDomain: 'exampleDomain',
   *   useSeparator: '-',
   * })
   * console.log(sharedSymbol)
   * // Output: Symbol(@exampleDomain-mySharedKey {"baz":"qux"} #shared)
   */
  sharedKey(named, options) {
    return this.keys.sharedKey(named, options)
  },

  /**
   * A symbol used as the storage key for the single instance of a
   * singleton.
   *
   * This getter returns a unique symbol created using `Symbol.for()`
   * with the string 'singleton'. The symbol is used to store and
   * retrieve the single instance of a singleton object.
   *
   * @type {symbol}
   * @readonly
   *
   * @example
   * const singletonKey = Symbol.singleton
   * const singletonInstance = {}
   * global[singletonKey] = singletonInstance
   */
  get singleton() {
    return Symbol.for('singleton')
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
      : Symbol.for(name)
  },
});

export const SymbolPrototypeExtensions = new Patch(Symbol.prototype, {
  [Patch.kMutablyHidden]: {
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
      return Object(this)
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
      if (Symbol?.keys && Symkeys.isSymkey(this)) {
        const possibleData = Symbol.keys[this]
        if (possibleData) {
          return possibleData
        }
      }

      let result = undefined;
      let revertToggle = false
      if (!JSONExtensions.applied) {
        JSONToggle.start()
        revertToggle = true
      }

      if (JSON.mightContain(this.description)) {
        try { result = JSON.extractFrom(this.description) }
        catch (ignore) { }
      }

      if (revertToggle) {
        JSONToggle.stop()
      }

      return result
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
      if (Symkeys.isSymkey(this)) {
        Symbol.keys.setData(this, value)
      }
      else {
        console.error(`The symbol ${this.description} is not a symkey`)
      }
    },

    /**
     * Retrieves the embedded JSON data from the symbol's description.
     *
     * This getter method checks if the symbol's description might contain
     * JSON data. If the description contains JSON, it parses and returns
     * the first JSON object found. If no JSON is found, it returns
     * `undefined`.
     *
     * @returns {Object|undefined} - The parsed JSON object if found,
     * otherwise `undefined`.
     *
     * @example
     * const sym = Symbol.for('example {"name":"Brie"}')
     * console.log(sym.embeddedJSON) // Output: { name: 'Brie' }
     *
     * @example
     * const sym = Symbol('noJSON')
     * console.log(sym.embeddedJSON) // Output: undefined
     */
    get embeddedJSON() {
      return JSONToggle.perform((toggle, patch) => {
        let [mightHave, index, parsed] = JSON.mightContain(
          this.description, true
        )

        if (mightHave) {
          return parsed?.[0]
        }

        return undefined
      })
    },

    /**
     * Parses the embedded JSON data from the symbol's description.
     *
     * This getter method first retrieves the embedded JSON data using the
     * `embeddedJSON` getter. If JSON data is found, it attempts to parse
     * the JSON string and return the resulting object. If parsing fails,
     * an error is logged to the console.
     *
     * @returns {Object|undefined} - The parsed JSON object if parsing is
     * successful, otherwise `undefined`.
     *
     * @example
     * const sym = Symbol.for('example {"name":"Brie"}')
     * console.log(sym.embeddedJSONParsed) // Output: { name: 'Brie' }
     *
     * @example
     * const sym = Symbol('invalidJSON')
     * console.log(sym.embeddedJSONParsed) // Output: undefined
     */
    get embeddedJSONParsed() {
      const json = this.embeddedJSON

      if (json) {
        try {
          return JSON.parse(json)
        }
        catch (error) {
          console.error(`Failed to parse json: "${json}"`)
        }
      }

      return undefined
    },

    /**
     * Checks if the current symbol is a Symkey.
     *
     * This getter method determines whether the current symbol instance
     * conforms to the Symkey pattern. A Symkey is a symbol that matches
     * a specific pattern defined in the Symkeys class.
     *
     * @type {boolean}
     * @readonly
     *
     * @returns {boolean} - Returns true if the symbol is a Symkey,
     *                      otherwise false.
     *
     * @example
     * const sym = Symbol('@nejs.prototype #rwiy2o905d')
     * console.log(sym.isSymkey) // Output: true
     *
     * @example
     * const sym = Symbol('regularSymbol')
     * console.log(sym.isSymkey) // Output: false
     */
    get isSymkey() {
      return Symkeys.isSymkey(this)
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
      return JSONToggle.perform((toggle, patch) => {
        return JSON.mightContain(this.description)
      })
    },

    /**
     * Retrieves the reference object associated with the symbol.
     *
     * This getter method checks if the symbol's description matches a
     * specific pattern using a regular expression. If a match is found,
     * it extracts the token from the description and constructs a shared
     * key using the token. It then retrieves the symbol associated with
     * the shared key using the `sharedKey` method of the
     * `SymbolExtensions.patches` object. Finally, it returns the data
     * associated with the retrieved symbol.
     *
     * If no match is found or the retrieved symbol has no associated
     * data, `undefined` is returned.
     *
     * @type {any}
     * @readonly
     *
     * @example
     * const sym = Symbol.for('@nejs.internal.refkey:example #shared')
     * console.log(sym.refObject) // Output: the data associated with the
     *                             // 'internal.refkey:example' shared key
     *
     * @example
     * const sym = Symbol('no_match')
     * console.log(sym.refObject) // Output: undefined
     */
    get refObject() {
      const re = /@nejs.internal.refkey:(\S+) #shared/.exec(this.description)
      if (re?.[1]) {
        const [_match, token] = re
        const shareKey = `internal.refkey:${token}`
        const symbol = SymbolExtensions.patches.sharedKey(shareKey)
        return symbol?.data
      }

      return undefined
    },

    /**
     * Returns a formatted string representation of the symbol's
     * description, highlighting any embedded JSON data.
     *
     * This getter method checks if the symbol's description contains
     * JSON data and formats it for better readability. It uses the
     * `sgr` function from the `String` object to apply color formatting
     * to the output.
     *
     * If the symbol's description contains JSON data longer than 30
     * characters, it truncates the JSON data and displays an ellipsis
     * in the middle. The JSON data is highlighted using the 'di' color
     * code.
     *
     * @type {string}
     * @readonly
     *
     * @example
     * const sym = Symbol.for('mySymbol {"name":"John Doe"}')
     * console.log(sym.sgrString)
     * // Output: Symbol.for(mySymbol {"name":"John ...hn Doe"})
     *
     * @example
     * const sym = Symbol('mySymbol')
     * console.log(sym.sgrString)
     * // Output: mySymbol
     */
    get sgrString() {
      let { sgr } = String

      if (!sgr) {
        sgr = (string, ...args) => string
      }

      const response = JSONToggle.perform((toggle, patch) => {
        let [mightContain, index, jsonResponse] =
          JSON.mightContain(this.description, true)
        let jsonText = jsonResponse?.[0]

        if (mightContain) {
          if (~index && jsonText && jsonText.length > 30) {
            let desc = this.description
            let newDescription = [
              sgr(`Symbol.for(${desc.slice(0, index)}`, 'green'),
              sgr(jsonText.slice(0, 10), 'di'),
              '...',
              sgr(jsonText.slice(-5), 'di'),
              sgr(`${desc.slice(index + jsonText.length + 1)})`, 'green')
            ].join('')

            return `${newDescription}`
          }
        }
      })

      return response ?? this.description
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
      let revert = false
      let detail = undefined

      let { sgr } = String
      if (!sgr) { sgr = (string, ...args) => string }

      if (!JSONExtensions.applied) { JSONToggle.start(); revert = true }
      if ((detail = JSON.mightContain(this.description, true))) {
        let jsonText = detail[2]?.[0]
        let index = detail[1]

        if (~index && jsonText && jsonText.length > 30) {
          let desc = this.description
          let newDescription = [
            sgr(`Symbol.for(${desc.slice(0, index)}`, 'green'),
            sgr(jsonText.slice(0, 10), 'di'),
            '...',
            sgr(jsonText.slice(-5), 'di'),
            sgr(`${desc.slice(index + jsonText.length + 1)})`, 'green'),
          ].join('')

          if (revert) { JSONToggle.stop() }
          return `${newDescription}`
        }
      }

      if (revert) { JSONToggle.stop() }
      return inspect(this, { colors: true })
    },
  },
})
