/**
 * The AsyncIterable class extends the concept of Iterable to asynchronous
 * operations. It allows creating iterable objects where each element can be
 * an asynchronous entity, like a Promise. This class is particularly useful
 * when dealing with asynchronous data sources, such as API responses, file
 * reading in chunks, or any other data that is not immediately available but
 * arrives over time.
 */
export class AsyncIterable {
    /**
     * Checks if a given value is an async iterable. This method determines if
     * the provided value has a `Symbol.asyncIterator` property that is an async
     * generator function. It's a precise way to identify if the value conforms
     * to the async iterable protocol using an async generator function.
     *
     * Note: This method specifically checks for async generator functions. Some
     * async iterables might use regular async functions that return an async
     * iterator, which this method won't identify.
     *
     * @param {*} value - The value to be checked for async iterability.
     * @returns {boolean} - Returns true if the value is an async iterable
     * implemented using an async generator function, false otherwise.
     */
    static isAsyncIterable(value: any): boolean;
    /**
     * Constructs an instance of AsyncIterable. Similar to Iterable, it can be
     * initialized with either an iterable object, an async generator function,
     * or individual elements. The elements can be promises, direct values, or a
     * mix of both. If the first argument is an iterable or an async generator
     * function, the instance is initialized with the elements from the iterable
     * or the generated elements from the async generator function, followed by
     * any additional arguments. If the first argument is not an iterable or an
     * async generator function, all arguments are treated as individual elements.
     *
     * @param {Iterable|AsyncGeneratorFunction|Promise|*} elementsOrFirstElement -
     * An iterable object, an async generator function, a Promise, or the first
     * element.
     * @param {...Promise|*} moreElements - Additional elements if the first
     * argument is not an iterable or an async generator function.
     */
    constructor(elementsOrFirstElement: Iterable<any> | AsyncGeneratorFunction | Promise<any> | any, ...moreElements: (Promise<any> | any)[]);
    /**
     * Implements the async iterable protocol. When an instance of AsyncIterable
     * is used in a `for await...of` loop, this async generator function is
     * invoked. It yields each element as a Promise, allowing asynchronous
     * iteration. Elements that are not Promises are automatically wrapped in
     * a resolved Promise to ensure consistency.
     *
     * @returns {AsyncGenerator} An async generator that yields each element as
     * a Promise.
     */
    [Symbol.asyncIterator](): AsyncGenerator;
    /**
     * Ensures that the constructor of this object instance's name
     * is returned if the string tag for this instance is queried
     *
     * @returns {string} the name of the class
     */
    get [Symbol.toStringTag](): string;
    #private;
}
/**
 * Being able to create a compliant `AsyncIterator` around any type of
 * iterable object. This can be wrapped around any type of object that
 * has a `[Symbol.asyncIterator]` property assigned to a generator
 * function.
 */
export class AsyncIterator {
    /**
     * Creates a new `AsyncIterator` object instance.
     *
     * @param {object|AsyncGeneratorFunction} asyncIterable any object that has a
     * `[Symbol.asyncIterable]` property assigned to a generator function or an
     * async generator function itself.
     */
    constructor(asyncIterable: object | AsyncGeneratorFunction);
    /**
     * Returns a new `Array` derived from the iterable this object
     * wraps.
     *
     * @returns {array} a new `Array` generated from the wrapped
     * iterable. The method is generated from using an async for of
     * loop.
     */
    asArray(): any[];
    /**
     * Returns the actual iterable object passed to the constructor that
     * created this instance.
     *
     * @returns {object} the object containing the `[Symbol.iterator]`
     */
    get asyncIterable(): object;
    /**
     * The function retrieves the next value in the iterator. If the
     * the iterator has run its course, `reset()` can be invoked to
     * reset the pointer to the beginning of the iteration.
     *
     * @returns {any} the next value
     */
    next(): any;
    /**
     * Resets the async iterator to the beginning allowing it to be
     * iterated over again.
     */
    reset(): Promise<void>;
    /**
     * The existence of this symbol on the object instances, indicates that
     * it can be used in `for(.. of ..)` loops and its values can be
     * extracted from calls to `Array.from()`
     *
     * @returns {AsyncIterable} this is returned since this object is already
     * conforming to the expected JavaScript AsyncIterator interface
     */
    [Symbol.asyncIterator](): AsyncIterable;
    /**
     * Ensures that the constructor of this object instance's name
     * is returned if the string tag for this instance is queried
     *
     * @returns {string} the name of the class
     */
    get [Symbol.toStringTag](): string;
    #private;
}
export const AsyncIterableExtensions: Extension;
export const AsyncIteratorExtensions: Extension;
import { Extension } from '@nejs/extension';
