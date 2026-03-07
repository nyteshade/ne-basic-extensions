/**
 * `StringExtensions` is a patch for the JavaScript built-in `String` class. It
 * adds utility methods to the `String` class without modifying the global namespace
 * directly. This patch includes methods for key validation, object type checking,
 * and retrieving the string tag of an object. These methods are useful for
 * enhancing the capabilities of the standard `String` class with additional
 * utility functions.
 */
export const StringExtensions: Patch;
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
export const StringPrototypeExtensions: Patch;
import { Patch } from '@nejs/extension';
