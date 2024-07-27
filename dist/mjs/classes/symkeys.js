import { Extension } from '@nejs/extension';
/**
 * Represents a secure container for storing and retrieving unique symbols
 * associated with data. This class provides methods to add new symbols to
 * the Symkeys and to retrieve data associated with a particular symbol.
 *
 * @example
* // Create a new Symkeys instance
* const symkeys = new Symkeys();
*
* // Add a symbol with associated data to the Symkeys
* const mySymbol = Symkeys.add('myIdentifier', { foo: 'bar' });
*
* // Retrieve the data using the symbol
* const myData = Symkeys.dataFor(mySymbol);
* console.log(myData); // Output: { foo: 'bar' }
*/
export class Symkeys {
    /**
     * Adds a new entry to the Symkeys with a unique symbol based on the provided
     * name and associates it with the given data.
     *
     * @param named - The base name for the symbol to be created.
     * @param [associatedData={}] - The data to associate with the symbol.
     * @returns The unique symbol created for the entry.
     *
     * @example
     * // Add an entry with associated data
     * const symbol = Symkeys.add('myEntry', { foo: 'bar' });
     * // Retrieve the associated data using the symbol
     * const data = Symkeys.dataFor(symbol);
     * console.log(data); // Output: { foo: 'bar' }
     */
    add(named, associatedData = {}) {
        // Generate a unique token for the symbol
        const token = Symkeys.token;
        // Calculate a name (optionally with domain and separator)
        const symName = this.calculateName(named);
        // Create a symbol using the provided name and the unique token
        const symbol = Symbol.for(`@${symName} #${token}`);
        // Store the symbol and associated data in the Symkeys's internal map
        this[Symkeys.kDataKey].set(symbol, associatedData);
        // Return the unique symbol for external use
        return symbol;
    }
    /**
     * Retrieves the data associated with a given symbol from the Symkeys.
     *
     * This method allows access to the data that has been associated with a
     * particular symbol in the Symkeys. It is useful for retrieving stored
     * information when only the symbol is known.
     *
     * @param symbol - The symbol whose associated data is to be
     * retrieved.
     * @returns The data associated with the symbol, or undefined if
     *                   the symbol is not found in the Symkeys.
     *
     * @example
     * // Assuming 'mySymbol' is a symbol that has been added to the Symkeys
     * // with associated data
     * const data = Symkeys.dataFor(mySymbol);
     * console.log(data); // Output: The data associated with 'mySymbol'
     */
    data(forSymbol) {
        return this[Symkeys.kDataKey].get(forSymbol);
    }
    /**
     * Deletes the data associated with a given symbol from the Symkeys.
     *
     * This method allows removal of the data that has been associated with a
     * particular symbol in the Symkeys. It is useful when you want to clean up
     * or remove stored information associated with a symbol.
     *
     * @param {Symbol} forSymbol - The symbol whose associated data is to be
     * deleted.
     * @param {*} replaceWith - Optionally, if `replaceWith` is not `undefined`,
     * a new value can be set after the original is deleted
     * @returns {boolean} - Returns true if an element in the Symkeys existed and
     * has been removed, or false if the element does not exist
     *
     * @example
     * // Assuming 'mySymbol' is a symbol that has been added to the Symkeys
     * // with associated data
     * const isDeleted = Symkeys.deleteData(mySymbol);
     * console.log(isDeleted); // Output: true if data was deleted, false otherwise
     */
    deleteData(forSymbol, replaceWith = undefined) {
        if (this.hasData(forSymbol)) {
            const result = this[Symkeys.kDataKey].delete(forSymbol);
            if (replaceWith !== undefined) {
                this[Symkeys.kDataKey].set(forSymbol, replaceWith);
            }
            return result;
        }
        return false;
    }
    /**
     * Checks if the Symkeys instance has data associated with a given symbol.
     *
     * This method checks if the Symkeys instance has any data associated with
     * the provided symbol. It is useful when you need to verify if data exists
     * for a particular symbol before attempting to retrieve or manipulate it.
     *
     * @param {Symbol} forSymbol - The symbol to check for associated data.
     * @returns {boolean} Returns true if data exists for the symbol, false otherwise.
     *
     * @example
     * // Assuming 'mySymbol' is a symbol that has been added to the Symkeys
     * // with associated data
     * const hasData = Symkeys.hasData(mySymbol);
     * console.log(hasData); // Output: true if data exists, false otherwise
     */
    hasData(forSymbol) {
        return this[Symkeys.kDataKey].has(forSymbol);
    }
    /**
     * Sets the data associated with a given symbol in the Symkeys.
     *
     * This method allows you to associate data with a particular symbol in the
     * Symkeys. It is useful when you want to store information that can be
     * retrieved later using the symbol.
     *
     * Note that setting only succeeds if the Symkey symbol has already been
     * added via {@link Symkeys.add}
     *
     * @param {Symbol} forSymbol - The symbol with which the data is to be
     * associated.
     * @param {*} value - The data to be associated with the symbol.
     * @returns {boolean} true if the value has been set, false if the key
     * has not yet been added via {@link Symkeys.add}
     *
     * @example
     * // Assuming 'mySymbol' is a symbol that has been added to the Symkeys
     * // and 'myData' is the data to be associated with 'mySymbol'
     * Symkeys.setData(mySymbol, myData);
     */
    setData(forSymbol, value) {
        if (this.hasData(forSymbol)) {
            this[Symkeys.kDataKey].set(forSymbol, value);
            return true;
        }
        return false;
    }
    /**
     * Extracts the token part from a symbol created by the `add` method.
     *
     * This method parses the string representation of a symbol to retrieve
     * the unique token that was appended to the symbol's name upon creation.
     * It is useful for debugging or for operations that require knowledge of
     * the token associated with a symbol.
     *
     * @param symbol - The symbol whose token is to be extracted.
     * @returns The extracted token or undefined if the
     * token cannot be extracted.
     *
     * @example
     * // Assuming 'mySymbol' is a symbol created with the name 'myEntry'
     * // and a token 'agftofxob6f'
     * const token = Symkeys.tokenFor(mySymbol);
     * console.log(token); // Output: 'agftofxob6f'
     */
    token(forSymbol) {
        // Use a regular expression to match the token pattern in the symbol
        // description exists on symbol but our JS output target is too old
        return /^.* \#(.*?)$/.exec(forSymbol)?.description?.[1];
    }
    /**
     * Retrieves the separator used in the Symkeys instance.
     *
     * This getter method allows access to the separator that is used to
     * distinguish between different parts of a symbol in the Symkeys instance.
     * It is useful when you need to know the separator for parsing symbols or
     * constructing new ones.
     *
     * @returns {string} The separator used in the Symkeys instance.
     *
     * @example
     * // Assuming the Symkeys instance has a separator '.'
     * const separator = Symkeys.separator;
     * console.log(separator); // Output: '.'
     */
    get separator() {
        return this[kSeparator];
    }
    /**
     * Retrieves an iterator for the symbols stored in the Symkeys.
     *
     * This method provides access to the symbols that have been stored in
     * the Symkeys. It returns an iterator which can be used to loop over
     * all the symbols. This is particularly useful for iterating through
     * all stored data without knowing the individual symbols in advance.
     *
     * @returns An iterator that yields all the symbols
     * stored in the Symkeys.
     *
     * @example
     * // Assuming the Symkeys has symbols stored
     * for (const symbol of Symkeys.symbols()) {
     *   console.log(symbol);
     * }
     */
    symbols() {
        // Retrieve the keys (symbols) from the Symkeys data map and return
        // the iterator.
        return this[Symkeys.kDataKey].keys();
    }
    /**
     * Calculates a name by combining a provided name, domain, and separator.
     *
     * This method takes a provided name, domain, and separator as input and
     * constructs a new name by combining these elements. If the domain or
     * separator are not provided, it uses the default domain and separator
     * stored in the Symkeys instance. If the provided name starts with the
     * separator, it removes the leading separator from the name.
     *
     * If the domain ends with the separator, it removes the trailing separator
     * from the domain. If the domain is empty, it sets the separator to an
     * empty string.
     *
     * @param {string} providedName - The name to be used in the calculation.
     * @param {string} [useDomain] - The domain to be used in the calculation.
     * If not provided, the default domain of the Symkeys instance is used.
     * @param {string} [useSeparator] - The separator to be used in the
     * calculation. If not provided, the default separator of the Symkeys
     * instance is used.
     * @returns {string} The calculated name.
     *
     * @example
     * // Assuming the Symkeys instance has a domain 'symkeys.internal'
     * // and a separator '.'
     * const name = Symkeys.calculateName('feature', 'symkeys.public', '/');
     * console.log(name); // Output: 'symkeys.public/feature'
     */
    calculateName(providedName, useDomain, useSeparator) {
        let domain = String(useDomain || this[Symkeys.kDomain]);
        let separator = String(useSeparator || this[Symkeys.kSeparator]);
        let postfix = (String(providedName).startsWith(separator)
            ? providedName.substring(1)
            : providedName);
        if (domain.length) {
            if (domain.endsWith(separator)) {
                domain = domain.substring(0, domain.length - 1);
            }
        }
        else {
            separator = '';
        }
        return `${domain}${separator}${postfix}`;
    }
    /**
     * Constructs a new instance of the Symkeys, setting up a proxy to
     * intercept and manage access to properties.
     *
     * This constructor initializes the Symkeys with a proxy that
     * overrides the default behavior for property access, checking, and
     * enumeration. It allows the Symkeys to behave like a map for its
     * own properties, while also maintaining the prototype chain.
     *
     * @param {string} domain an optional prefix string, to which the
     * `separator` parameter value will be guaranteed to have in between
     * the domain (if truthy) and the name of the added key.
     * @param {string} separator defaults to a period. So if your domain
     * is 'symkeys.internal' then calling {@link add()} with a name of
     * `"feature"` will result in the full name being
     * `"symkeys.internal.feature"`
     *
     * @example
     * const Symkeys = new Symkeys();
     * Symkeys[Symbol.for('myProperty')] = 'myValue';
     * console.log(Symkeys[Symbol.for('myProperty')]); // 'myValue'
     */
    constructor(domain = '', separator = '.') {
        // Create a prototype from the parent class to maintain the chain.
        const prototype = Object.create(Object.getPrototypeOf(this));
        // Store the original prototype for potential future use.
        this[Symkeys.kPrototype] = prototype;
        // Create map for this instance
        this[Symkeys.kDataKey] = new Map();
        // Store the domain
        this[Symkeys.kDomain] = (typeof domain === 'string' && domain);
        // Store the separator
        this[Symkeys.kSeparator] = separator;
        // Access the internal map that stores Symkeys data.
        const map = this[Symkeys.kDataKey];
        // Replace the instance's prototype with a proxy that manages
        // property access and manipulation.
        Object.setPrototypeOf(this, new Proxy(Object.create(prototype), {
            // Return the stored prototype for the target.
            getPrototypeOf(_) {
                return prototype;
            },
            // Intercept property access.
            get(target, property, receiver) {
                // If the property exists in the Symkeys map, return its value.
                if (map.has(property)) {
                    return map.get(property);
                }
                // Otherwise, perform the default behavior.
                return Reflect.get(target, property, receiver);
            },
            // Check for property existence. Check both the Symkeys map and the target for
            // the property.
            has(target, property) {
                return map.has(property) || Reflect.has(target, property);
            },
            // Retrieve all property keys. Combine keys from the Symkeys map and the target.
            ownKeys(target) {
                return [...Array.from(map.keys()), ...Reflect.ownKeys(target)];
            },
            // Intercept property assignment.
            set(_, property, value, __) {
                // If the property exists in the Symkeys map, set its value.
                if (map.has(property)) {
                    map.set(property, value);
                    return true;
                }
                // If not, the operation is not allowed.
                return false;
            },
            // Retrieve property descriptors.
            getOwnPropertyDescriptor(_, property) {
                // Convert the Symkeys map to an object to use with
                // Object.getOwnPropertyDescriptor.
                const object = [...map.entries()].reduce((a, e) => Object.assign(a, { [e[0]]: e[1] }), {});
                // Retrieve the descriptor from the object.
                return Object.getOwnPropertyDescriptor(object, property);
            },
        }));
    }
    /**
     * Checks if a given value is a Symkey.
     *
     * This method checks if the provided value is a Symkey. A Symkey is a
     * symbol that matches a specific pattern. The pattern is defined as a
     * symbol that starts with '@', followed by any characters, a space, a '#',
     * and ends with one or more word characters.
     *
     * @param {Symbol} value - The value to check.
     * @returns {boolean} Returns true if the value is a Symkey, false otherwise.
     *
     * @example
     * // Check if a symbol is a Symkey:
     * const sym = Symbol('@nejs.prototype #rwiy2o905d');
     * console.log(Symkeys.isSymkey(sym)); // Outputs: true
     */
    static isSymkey(value) {
        if (!(typeof value === 'symbol' || value instanceof Symbol)) {
            return false;
        }
        return !!/^@.*? #\w+$/.exec(value?.description);
    }
    /**
     * Generates a random token string.
     *
     * This method creates a pseudo-random token that can be used for various
     * purposes within the library, such as generating unique identifiers or
     * keys. The token is generated using a base 36 encoding, which includes
     * numbers and lowercase letters.
     *
     * @returns A random token string.
     *
     * @example
     * // Example of getting a random token:
     * const token = MyClass.token;
     * console.log(token); // Outputs a string like 'qg6k1zr0is'
     */
    static get token() {
        return Math.random().toString(36).slice(2);
    }
    /**
     * Reusable publicly static key for identifying where data is stored.
     */
    static get kDataKey() {
        return Symbol.for('symkeys.data');
    }
    /**
     * Reusable publicly static key for identifying where data is stored.
     */
    static get kPrototype() {
        return Symbol.for('symkeys.prototype');
    }
    /**
     * A static getter that returns a unique, reusable symbol for 'symkeys.domain'.
     *
     * This getter is used to create a unique symbol that can be used as a key
     * for storing and retrieving domain-specific data in the Symkeys. The symbol
     * is created using the `Symbol.for` method, which ensures that the same
     * symbol is returned for a given key, in this case 'symkeys.domain'.
     *
     * @returns {Symbol} A unique symbol for 'symkeys.domain'.
     *
     * @example
     * // Retrieve the 'symkeys.domain' symbol
     * const domainSymbol = Symkeys.kDomain;
     * console.log(domainSymbol); // Outputs: Symbol(symkeys.domain)
     */
    static get kDomain() {
        return Symbol.for('symkeys.domain');
    }
    /**
     * A static getter that returns a unique, reusable symbol for 'symkeys.separator'.
     *
     * This getter is used to create a unique symbol that can be used as a key
     * for storing and retrieving separator-specific data in the Symkeys. The symbol
     * is created using the `Symbol.for` method, which ensures that the same
     * symbol is returned for a given key, in this case 'symkeys.separator'.
     *
     * @returns {Symbol} A unique symbol for 'symkeys.separator'.
     *
     * @example
     * // Retrieve the 'symkeys.separator' symbol
     * const separatorSymbol = Symkeys.kSeparator;
     * console.log(separatorSymbol); // Outputs: Symbol(symkeys.separator)
     */
    static get kSeparator() {
        return Symbol.for('symkeys.separator');
    }
}
export const SymkeysExtension = new Extension(Symkeys);
//# sourceMappingURL=symkeys.js.map