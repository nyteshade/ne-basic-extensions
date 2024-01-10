import { Patch } from '@nejs/extension';
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
     * The `isSymbol` method does exactly what one would it expect. It returns
     * true if the string matches typeof or instanceof as a symbol.
     *
     * @param {*} value checks to see if the `value` is a string
     * @returns {boolean} `true` if it is a `Symbol`, `false` otherwise
     */
    isSymbol(value) {
        return value && (typeof value === 'symbol');
    },
});
