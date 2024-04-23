import { Patch } from '@nejs/extension'

/**
 * The `FunctionExtensions` class is a patch applied to the built-in JavaScript
 * `Function` constructor. It extends `Function` with additional utility methods
 * for determining the specific type or nature of function-like objects. These
 * methods allow developers to distinguish between classes, regular functions,
 * async functions, and arrow functions in a more intuitive and straightforward
 * manner. This class is part of the `@nejs/extension` library and enhances the
 * capabilities of function handling and introspection in JavaScript.
 */
export const FunctionExtensions = new Patch(Function, {
  [Patch.kMutablyHidden]: {
    /**
     * Retrieves the properties of a function and its prototype.
     *
     * This method uses the `Reflect.ownKeys` function to get all the keys
     * (including non-enumerable and symbol keys) of the function and its
     * prototype. It then uses `Object.getOwnPropertyDescriptor` to get the
     * property descriptors for each key. The descriptors include information
     * about the property's value, writability, enumerability, and
     * configurability.
     *
     * @param {Function} fn - The function whose properties are to be retrieved.
     * @returns {Array} An array containing the function itself, its property
     * descriptors, its prototype, and the prototype's property descriptors.
     *
     * @example
     * function MyFunction() {}
     * MyFunction.myProp = 'hello';
     * MyFunction.prototype.myProtoProp = 'world';
     *
     * const result = getClassProperties(MyFunction);
     * console.log(result);
     * // Output: [MyFunction, { myProp: { value: 'hello', writable: true,
     * // enumerable: true, configurable: true } }, MyFunction.prototype,
     * // { myProtoProp: { value: 'world', writable: true, enumerable: true,
     * // configurable: true } }]
     */
    getClassProperties(fn) {
      const descriptors = Reflect.ownKeys(fn).reduce((acc, key) => {
        acc[key] = Object.getOwnPropertyDescriptor(fn, key)
        return acc
      }, {})

      const prototypeDescriptors = Reflect.ownKeys(fn.prototype).reduce(
        (acc, key) => {
          acc[key] = Object.getOwnPropertyDescriptor(fn.prototype, key)
          return acc
        }, {}
      )

      return [fn, descriptors, fn.prototype, prototypeDescriptors]
    },

    /**
     * Determines if a given value is an asynchronous function. It checks if the
     * value is an instance of `Function` and if its string representation
     * includes the keyword 'Async'. This method is particularly useful for
     * identifying async functions.
     *
     * @param {*} value - The value to be checked.
     * @returns {boolean} Returns `true` if the value is an async function,
     * otherwise `false`.
     */
    isAsync(value) {
      const stringTag = /(\w+)]/g.exec(Object.prototype.toString.call(value))[1]
      return (
        value instanceof Function &&
        stringTag.includes('Async')
      )
    },

    /**
     * The `ifAsync` function checks if a given value is an async function and
     * returns one of two provided values based on the result. This function is
     * a convenience method for performing conditional operations based on the
     * type of a value.
     *
     * @param {*} value - The value to be checked. If this is an async function,
     * `thenValue` is returned, otherwise `elseValue` is returned.
     * @param {*} thenValue - The value to be returned if `value` is an async
     * function.
     * @param {*} elseValue - The value to be returned if `value` is not an
     * async function.
     * @returns {*} Returns `thenValue` if `value` is an async function,
     * otherwise returns `elseValue`.
     * @see {@link isThenElse}
     *
     * @example
     * // Suppose we have an async function and a regular function
     * async function asyncFunc() { return 'I am async'; }
     * function regularFunc() { return 'I am regular'; }
     *
     * // Using ifAsync
     * console.log(Function.ifAsync(asyncFunc, 'Async', 'Not Async'));
     * // Output: 'Async'
     * console.log(Function.ifAsync(regularFunc, 'Async', 'Not Async'));
     * // Output: 'Not Async'
     */
    ifAsync(value, thenValue, elseValue) {
      return isThenElse(this.isAsync(value), thenValue, elseValue)
    },

    /**
     * The function checks if a given value is an async generator function
     *
     * @param {any} value - The `value` parameter is the value that we want to
     * check if it is a generator function.
     * @returns {boolean} `true` if the value is an instance of a function and
     * its string tag is 'AsyncGeneratorFunction', otherwise it returns `false`.
     */
    isAsyncGenerator(value) {
      const stringTag = getStringTag(value)

      return (
        value instanceof Function &&
        stringTag == 'AsyncGeneratorFunction'
      )
    },

    /**
     * The `ifAsyncGenerator` function checks if a given value is an async
     * generator function and returns one of two provided values based on the
     * result. This function is a convenience method for performing conditional
     * operations based on the type of a value.
     *
     * @param {*} value - The value to be checked. If this is an async
     * generator function, `thenValue` is returned, otherwise `elseValue` is
     * returned.
     * @param {*} thenValue - The value to be returned if `value` is an async
     * generator function.
     * @param {*} elseValue - The value to be returned if `value` is not an
     * async generator function.
     * @returns {*} Returns `thenValue` if `value` is an async generator
     * function, otherwise returns `elseValue`.
     *
     * @example
     * // Suppose we have an async generator function and a regular function
     * async function* asyncGenFunc() { yield 'I am async'; }
     * function regularFunc() { return 'I am regular'; }
     *
     * // Using ifAsyncGenerator
     * console.log(Function.ifAsyncGenerator(asyncGenFunc, 'Async', 'Not Async'));
     * // Output: 'Async'
     * console.log(Function.ifAsyncGenerator(regularFunc, 'Async', 'Not Async'));
     * // Output: 'Not Async'
     */
    ifAsyncGenerator(value, thenValue, elseValue) {
      return isThenElse(this.isAsyncGenerator(value), thenValue, elseValue)
    },

    /**
     * Checks if a given value is an arrow function. It verifies if the value is
     * an instance of `Function`, if its string representation includes the '=>'
     * symbol, and if it lacks a prototype, which is a characteristic of arrow
     * functions in JavaScript.
     *
     * @param {*} value - The value to be checked.
     * @returns {boolean} Returns `true` if the value is an arrow function,
     * otherwise `false`.
     */
    isBigArrow(value) {
      return (
        value instanceof Function &&
        String(value).includes('=>') &&
        !String(value).startsWith('bound') &&
        !Reflect.has(value, 'prototype')
      );
    },

    /**
     * The `ifBigArrow` function checks if a given value is an arrow function
     * and returns one of two provided values based on the result. This function
     * is a convenience method for performing conditional operations based on
     * the type of a value.
     *
     * @param {*} value - The value to be checked. If this is an arrow function,
     * `thenValue` is returned, otherwise `elseValue` is returned.
     * @param {*} thenValue - The value to be returned if `value` is an arrow
     * function.
     * @param {*} elseValue - The value to be returned if `value` is not an
     * arrow function.
     * @returns {*} Returns `thenValue` if `value` is an arrow function,
     * otherwise returns `elseValue`.
     *
     * @example
     * // Suppose we have an arrow function and a regular function
     * const arrowFunc = () => 'I am an arrow function';
     * function regularFunc() { return 'I am a regular function'; }
     *
     * // Using ifBigArrow
     * console.log(Function.ifBigArrow(arrowFunc, 'Arrow', 'Not Arrow'));
     * // Output: 'Arrow'
     * console.log(Function.ifBigArrow(regularFunc, 'Arrow', 'Not Arrow'));
     * // Output: 'Not Arrow'
     */
    ifBigArrow(value, thenValue, elseValue) {
      return isThenElse(this.isBigArrow(value), thenValue, elseValue)
    },

    /**
     * Determines if a given value is a bound function. Bound functions are
     * created using the `Function.prototype.bind` method, which allows setting
     * the `this` value at the time of binding. This method checks if the value
     * is an instance of `Function`, if its string representation starts with
     * 'bound', and if it lacks a `prototype` property. These characteristics
     * are indicative of bound functions in JavaScript.
     *
     * @param {*} value - The value to be checked, typically a function.
     * @returns {boolean} Returns `true` if the value is a bound function,
     * otherwise `false`. Bound functions have a specific format in their
     * string representation and do not have their own `prototype` property.
     */
    isBound(value) {
      return (
        value instanceof Function &&
        String(value).startsWith('bound') &&
        !Reflect.has(value, 'prototype')
      )
    },

    /**
     * The `ifBound` function checks if a given value is a bound function and
     * returns one of two provided values based on the result. This function
     * is a convenience method for performing conditional operations based on
     * the type of a value.
     *
     * @param {*} value - The value to be checked. If this is a bound function,
     * `thenValue` is returned, otherwise `elseValue` is returned.
     * @param {*} thenValue - The value to be returned if `value` is a bound
     * function.
     * @param {*} elseValue - The value to be returned if `value` is not a
     * bound function.
     * @returns {*} Returns `thenValue` if `value` is a bound function,
     * otherwise returns `elseValue`.
     *
     * @example
     * // Suppose we have a bound function and a regular function
     * const boundFunc = function() { return this.x }.bind({x: 'I am bound'});
     * function regularFunc() { return 'I am a regular function'; }
     *
     * // Using ifBound
     * console.log(Function.ifBound(boundFunc, 'Bound', 'Not Bound'));
     * // Output: 'Bound'
     * console.log(Function.ifBound(regularFunc, 'Bound', 'Not Bound'));
     * // Output: 'Not Bound'
     */
    ifBound(value, thenValue, elseValue) {
      return isThenElse(this.isBound(value), thenValue, elseValue)
    },

    /**
     * Determines if a given value is a class. It checks if the value is an
     * instance of `Function` and if its string representation includes the
     * keyword 'class'. This method is useful for distinguishing classes from
     * other function types in JavaScript.
     *
     * @param {*} value - The value to be checked.
     * @returns {boolean} Returns `true` if the value is a class, otherwise
     * `false`.
     */
    isClass(value) {
      return value instanceof Function && !!/^class\s/.exec(String(value))
    },

    /**
     * The `ifClass` function checks if a given value is a class and returns
     * one of two provided values based on the result. This function is a
     * convenience method for performing conditional operations based on the
     * type of a value.
     *
     * @param {*} value - The value to be checked. If this is a class,
     * `thenValue` is returned, otherwise `elseValue` is returned.
     * @param {*} thenValue - The value to be returned if `value` is a class.
     * @param {*} elseValue - The value to be returned if `value` is not a
     * class.
     * @returns {*} Returns `thenValue` if `value` is a class, otherwise returns
     * `elseValue`.
     *
     * @example
     * // Suppose we have a class and a regular function
     * class MyClass {}
     * function myFunction() {}
     *
     * // Using ifClass
     * console.log(Function.ifClass(MyClass, 'Class', 'Not Class'));
     * // Output: 'Class'
     * console.log(Function.ifClass(myFunction, 'Class', 'Not Class'));
     * // Output: 'Not Class'
     */
    ifClass(value, thenValue, elseValue) {
      return isThenElse(this.isClass(value), thenValue, elseValue)
    },

    /**
     * Checks if a given value is a regular function. This method verifies if
     * the value is an instance of `Function`, which includes regular functions,
     * classes, and async functions but excludes arrow functions.
     *
     * @param {*} value - The value to be checked.
     * @returns {boolean} Returns `true` if the value is a regular function,
     * otherwise `false`.
     */
    isFunction(value) {
      return value instanceof Function && !Function.isClass(value);
    },

    /**
     * The `ifFunction` method checks if a given value is a regular function
     * and returns one of two provided values based on the result. This method
     * is a convenience for performing conditional operations based on the
     * type of a value.
     *
     * @param {*} value - The value to be checked. If this is a function,
     * `thenValue` is returned, otherwise `elseValue` is returned.
     * @param {*} thenValue - The value to be returned if `value` is a function.
     * @param {*} elseValue - The value to be returned if `value` is not a
     * function.
     * @returns {*} Returns `thenValue` if `value` is a function, otherwise
     * returns `elseValue`.
     *
     * @example
     * // Suppose we have a function and a non-function value
     * function myFunction() {}
     * let notFunction = "I'm not a function";
     *
     * // Using ifFunction
     * console.log(Function.ifFunction(myFunction, 'Function', 'Not Function'));
     * // Output: 'Function'
     * console.log(Function.ifFunction(notFunction, 'Function', 'Not Function'));
     * // Output: 'Not Function'
     */
    ifFunction(value, thenValue, elseValue) {
      return isThenElse(this.isFunction(value), thenValue, elseValue)
    },

    /**
     * The function checks if a given value is a generator function
     *
     * @param {any} value - The `value` parameter is the value that we want to
     * check if it is a generator function.
     * @returns {boolean} `true` if the value is an instance of a function and
     * its string tag is 'GeneratorFunction', otherwise it returns `false`.
     */
    isGenerator(value) {
      const stringTag = getStringTag(value)

      return (
        value instanceof Function &&
        stringTag == 'GeneratorFunction'
      )
    },

    /**
     * The `ifGenerator` method checks if a given value is a generator function
     * and returns one of two provided values based on the result. This method
     * is a convenience for performing conditional operations based on the
     * type of a value.
     *
     * @param {*} value - The value to be checked. If this is a generator
     * function, `thenValue` is returned, otherwise `elseValue` is returned.
     * @param {*} thenValue - The value to be returned if `value` is a generator
     * function.
     * @param {*} elseValue - The value to be returned if `value` is not a
     * generator function.
     * @returns {*} Returns `thenValue` if `value` is a generator function,
     * otherwise returns `elseValue`.
     *
     * @example
     * // Suppose we have a generator function and a non-generator function
     * function* myGenerator() {}
     * function myFunction() {}
     *
     * // Using ifGenerator
     * console.log(Function.ifGenerator(myGenerator, 'Generator', 'Not Generator'));
     * // Output: 'Generator'
     * console.log(Function.ifGenerator(myFunction, 'Generator', 'Not Generator'));
     * // Output: 'Not Generator'
     */
    ifGenerator(value, thenValue, elseValue) {
      return isThenElse(this.isGenerator(value), thenValue, elseValue)
    },

    /**
     * This method modifies the behavior of the `instanceof` operator for a
     * given class. It does this by defining a custom `Symbol.hasInstance`
     * method on the class. The custom method checks if the string tag of the
     * instance matches the name of the class or if the instance is part of
     * the prototype chain of the class.
     *
     * @param {Function} Class - The class for which to modify the behavior
     * of the `instanceof` operator.
     *
     * @example
     * // Suppose we have a class `MyClass`
     * class MyClass {}
     *
     * // And an instance of the class
     * const myInstance = new MyClass();
     *
     * // Before applying `StringTagHasInstance`, `instanceof` works as usual
     * console.log(myInstance instanceof MyClass); // Output: true
     *
     * // Now we apply `StringTagHasInstance` to `MyClass`
     * FunctionExtensions.patches.StringTagHasInstance(MyClass);
     *
     * // `instanceof` now checks the string tag and the prototype chain
     * console.log(myInstance instanceof MyClass); // Output: true
     */
    StringTagHasInstance(Class) {
      Object.defineProperty(Class, Symbol.hasInstance, {
        value: function stringTagAwareHasInstance(fn) {
          const protoChain = getPrototypeChainEntries(fn)
          return (
            fn[Symbol.toStringTag] === this.name ||
            fn instanceof this
          )
        }
      })
    },
  },
})

const {
  isAsyncGenerator: pIsAsyncGenerator,  ifAsyncGenerator: pIfAsyncGenerator,
  isAsync: pIsAsync,                    ifAsync: pIfAsync,
  isBigArrow: pIsBigArrow,              ifBigArrow: pIfBigArrow,
  isBound: pIsBound,                    ifBound: pIfBound,
  isClass: pIsClass,                    ifClass: pIfClass,
  isFunction: pIsFunction,              ifFunction: pIfFunction,
  isGenerator: pIsGenerator,            ifGenerator: pIfGenerator,
} = FunctionExtensions.patches

export const FunctionPrototypeExtensions = new Patch(Function.prototype, {
  [Patch.kMutablyHidden]: {
    /**
     * Determines if a given value is an asynchronous function. It checks if the
     * value is an instance of `Function` and if its string representation
     * includes the keyword 'Async'. This method is particularly useful for
     * identifying async functions.
     *
     * @returns {boolean} Returns `true` if the value is an async function,
     * otherwise `false`.
     */
    get isAsync() {
      return pIsAsync(this)
    },

    /**
     * The `ifAsync` method checks if the current function is asynchronous and
     * returns one of two provided values based on the result. This method is
     * a convenience for performing conditional operations based on the
     * type of a function.
     *
     * @param {*} thenValue - The value to be returned if the function is
     * asynchronous.
     * @param {*} elseValue - The value to be returned if the function is not
     * asynchronous.
     * @returns {*} Returns `thenValue` if the function is asynchronous,
     * otherwise returns `elseValue`.
     * @see {@link Function.ifAsync}
     *
     * @example
     * // Suppose we have an async function and a non-async function
     * async function myAsyncFunction() {}
     * function myFunction() {}
     *
     * // Using ifAsync
     * console.log(myAsyncFunction.ifAsync('Async', 'Not Async'));
     * // Output: 'Async'
     * console.log(myFunction.ifAsync('Async', 'Not Async'));
     * // Output: 'Not Async'
     */
    ifAsync(thenValue, elseValue) {
      return pIfAsync(this, thenValue, elseValue)
    },

    /**
     * The function checks if a given value is an async generator function
     *
     * @returns {boolean} `true` if the value is an instance of a function and
     * its string tag is 'AsyncGeneratorFunction', otherwise it returns `false`.
     */
    get isAsyncGenerator() {
      return pIsAsyncGenerator(this)
    },

    /**
     * The `ifAsyncGenerator` method checks if the current function is an
     * asynchronous generator and returns one of two provided values based on
     * the result. This method is a convenience for performing conditional
     * operations based on the type of a function.
     *
     * @param {*} thenValue - The value to be returned if the function is an
     * asynchronous generator.
     * @param {*} elseValue - The value to be returned if the function is not
     * an asynchronous generator.
     * @returns {*} Returns `thenValue` if the function is an asynchronous
     * generator, otherwise returns `elseValue`.
     * @see {@link Function.ifAsyncGenerator}
     *
     * @example
     * // Suppose we have an async generator function and a non-async function
     * async function* myAsyncGeneratorFunction() {}
     * function myFunction() {}
     *
     * // Using ifAsyncGenerator
     * console.log(myAsyncGeneratorFunction.ifAsyncGenerator(
     *   'Async Generator', 'Not Async Generator'
     * ));
     * // Output: 'Async Generator'
     * console.log(myFunction.ifAsyncGenerator(
     *   'Async Generator', 'Not Async Generator'
     * ));
     * // Output: 'Not Async Generator'
     */
    ifAsyncGenerator(thenValue, elseValue) {
      return pIfAsyncGenerator(this, thenValue, elseValue)
    },

    /**
     * Checks if a given value is an arrow function. It verifies if the value is
     * an instance of `Function`, if its string representation includes the '=>'
     * symbol, and if it lacks a prototype, which is a characteristic of arrow
     * functions in JavaScript.
     *
     * @returns {boolean} Returns `true` if the value is an arrow function,
     * otherwise `false`.
     */
    get isBigArrow() {
      return pIsBigArrow(this)
    },

    /**
     * Checks if the current function is a "big arrow" function and
     * returns one of two provided values based on the result.
     *
     * A "big arrow" function is an arrow function that is not bound
     * to a specific context and does not have its own `this` value.
     *
     * @param {*} thenValue - The value to be returned if the function
     * is a "big arrow" function.
     * @param {*} elseValue - The value to be returned if the function
     * is not a "big arrow" function.
     * @returns {*} Returns `thenValue` if the function is a "big arrow"
     * function, otherwise returns `elseValue`.
     *
     * @example
     * // Suppose we have a "big arrow" function and a regular function
     * const bigArrowFn = () => {}
     * function regularFn() {}
     *
     * // Using ifBigArrow
     * console.log(bigArrowFn.ifBigArrow('Big Arrow', 'Not Big Arrow'))
     * // Output: 'Big Arrow'
     * console.log(regularFn.ifBigArrow('Big Arrow', 'Not Big Arrow'))
     * // Output: 'Not Big Arrow'
     */
    ifBigArrow(thenValue, elseValue) {
      return pIfBigArrow(this, thenValue, elseValue)
    },

    /**
     * Determines if a given value is a bound function. Bound functions are
     * created using the `Function.prototype.bind` method, which allows setting
     * the `this` value at the time of binding. This method checks if the value
     * is an instance of `Function`, if its string representation starts with
     * 'bound', and if it lacks a `prototype` property. These characteristics
     * are indicative of bound functions in JavaScript.
     *
     * @returns {boolean} Returns `true` if the value is a bound function,
     * otherwise `false`. Bound functions have a specific format in their
     * string representation and do not have their own `prototype` property.
     */
    get isBound() {
      return pIsBound(this)
    },

    /**
     * Checks if the current function is bound and returns one of two
     * provided values based on the result.
     *
     * A bound function is a function that has a fixed `this` value and
     * may have preset arguments. It is created using the
     * `Function.prototype.bind` method.
     *
     * @param {*} thenValue - The value to be returned if the function
     * is bound.
     * @param {*} elseValue - The value to be returned if the function
     * is not bound.
     * @returns {*} Returns `thenValue` if the function is bound,
     * otherwise returns `elseValue`.
     *
     * @example
     * // Suppose we have a bound function and a regular function
     * const boundFn = function() {}.bind(null)
     * function regularFn() {}
     *
     * // Using ifBound
     * console.log(boundFn.ifBound('Bound', 'Not Bound'))
     * // Output: 'Bound'
     * console.log(regularFn.ifBound('Bound', 'Not Bound'))
     * // Output: 'Not Bound'
     */
    ifBound(thenValue, elseValue) {
      return pIfBound(this, thenValue, elseValue)
    },

    /**
     * Determines if a given value is a class. It checks if the value is an
     * instance of `Function` and if its string representation includes the
     * keyword 'class'. This method is useful for distinguishing classes from
     * other function types in JavaScript.
     *
     * @returns {boolean} Returns `true` if the value is a class, otherwise
     * `false`.
     */
    get isClass() {
      return pIsClass(this)
    },

    /**
     * Checks if the current function is a class and returns one of two
     * provided values based on the result.
     *
     * A class is a special type of function in JavaScript that is
     * defined using the `class` keyword. It serves as a blueprint for
     * creating objects and encapsulates data and behavior.
     *
     * @param {any} thenValue - The value to be returned if the function
     * is a class.
     * @param {any} elseValue - The value to be returned if the function
     * is not a class.
     * @returns {any} Returns `thenValue` if the function is a class,
     * otherwise returns `elseValue`.
     *
     * @example
     * // Suppose we have a class and a regular function
     * class MyClass {}
     * function myFunction() {}
     *
     * // Using ifClass
     * console.log(MyClass.ifClass('Class', 'Not Class'))
     * // Output: 'Class'
     * console.log(myFunction.ifClass('Class', 'Not Class'))
     * // Output: 'Not Class'
     */
    ifClass(thenValue, elseValue) {
      return pIfClass(this, thenValue, elseValue)
    },

    /**
     * Checks if a given value is a regular function. This method verifies if
     * the value is an instance of `Function`, which includes regular functions,
     * classes, and async functions but excludes arrow functions.
     *
     * @returns {boolean} Returns `true` if the value is a regular function,
     * otherwise `false`.
     */
    get isFunction() {
      return pIsFunction(this)
    },

    /**
     * Checks if the current function is a regular function and returns
     * one of two provided values based on the result.
     *
     * A regular function is an instance of `Function`, which includes
     * regular functions, classes, and async functions but excludes
     * arrow functions.
     *
     * @param {any} thenValue - The value to be returned if the function
     * is a regular function.
     * @param {any} elseValue - The value to be returned if the function
     * is not a regular function.
     * @returns {any} Returns `thenValue` if the function is a regular
     * function, otherwise returns `elseValue`.
     *
     * @example
     * // Suppose we have a regular function and an arrow function
     * function regularFunction() {}
     * const arrowFunction = () => {}
     *
     * // Using ifFunction
     * console.log(regularFunction.ifFunction('Regular', 'Not Regular'))
     * // Output: 'Regular'
     * console.log(arrowFunction.ifFunction('Regular', 'Not Regular'))
     * // Output: 'Not Regular'
     */
    ifFunction(thenValue, elseValue) {
      return pIfFunction(this, thenValue, elseValue)
    },

    /**
     * The function checks if a given value is a generator function
     *
     * @returns {boolean} `true` if the value is an instance of a function and
     * its string tag is 'GeneratorFunction', otherwise it returns `false`.
     */
    get isGenerator() {
      return pIsGenerator(this)
    },

    /**
     * Checks if the current function is a generator function and
     * returns one of two provided values based on the result.
     *
     * A generator function is a special type of function that can be
     * paused and resumed, allowing it to yield multiple values over
     * time rather than returning a single value.
     *
     * @param {any} thenValue - The value to be returned if the
     * function is a generator function.
     * @param {any} elseValue - The value to be returned if the
     * function is not a generator function.
     * @returns {any} Returns `thenValue` if the function is a
     * generator function, otherwise returns `elseValue`.
     *
     * @example
     * // Suppose we have a generator function and a regular function
     * function* generatorFunction() {
     *   yield 1
     *   yield 2
     *   yield 3
     * }
     * function regularFunction() {}
     *
     * // Using ifGenerator
     * console.log(generatorFunction.ifGenerator('Generator', 'Regular'))
     * // Output: 'Generator'
     * console.log(regularFunction.ifGenerator('Generator', 'Regular'))
     * // Output: 'Regular'
     */
    ifGenerator(thenValue, elseValue) {
      return pIfGenerator(this, thenValue, elseValue)
    },

    /**
     * Retrieves the properties of the current function and its prototype.
     *
     * This method uses the `getClassProperties` function from the
     * `FunctionExtensions.patches` object to get all the properties of the
     * current function and its prototype. The properties include both
     * enumerable and non-enumerable properties, as well as properties
     * defined with symbols.
     *
     * @returns {Array} An array containing the function itself, its property
     * descriptors, its prototype, and the prototype's property descriptors.
     *
     * @example
     * // Suppose we have a function with a property and a prototype property
     * function MyFunction() {}
     * MyFunction.myProp = 'hello';
     * MyFunction.prototype.myProtoProp = 'world';
     *
     * // Using getClassProperties
     * const result = MyFunction.getClassProperties();
     * console.log(result);
     * // Output: [MyFunction, { myProp: { value: 'hello', writable: true,
     * // enumerable: true, configurable: true } }, MyFunction.prototype,
     * // { myProtoProp: { value: 'world', writable: true, enumerable: true,
     * // configurable: true } }]
     */
    getClassProperties() {
      return FunctionExtensions.patches.getClassProperties(this)
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

function hasStringTag(value) {
  return Object.isObject(value) && Reflect.has(value, Symbol.toStringTag)
}

function getStringTag(value, strict = false) {
  if (Object.hasStringTag(value)) {
    return value[Symbol.toStringTag]
  }

  if (strict) {
    return undefined
  }

  if (value && (typeof value === 'function')) {
    return value.name
  }

  return /\s(.+)]/.exec(Object.prototype.toString.call(value))[1];
}

function getPrototypeChainEntries(object) {
  const entries = []

  let prototype = Object.getPrototypeOf(object)
  while (prototype) {
    const descriptors = Reflect.ownKeys(prototype).reduce((acc, key) => {
      acc[key] = Object.getOwnPropertyDescriptor(prototype, key)
      return acc
    }, {})

    entries.push([prototype, descriptors])

    prototype = Object.getPrototypeOf(prototype)
  }

  return entries
}