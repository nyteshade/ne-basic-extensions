export function createToolkit(): {
    si: {
        /**
         * Inline if-then-else based on whether value matches a specified type or
         * class. Delegates the condition check to {@link is#a}.
         *
         * @param {*} value - The value to check.
         * @param {*} typeOrClass - The type or class to compare against.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value matches typeOrClass.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value does not match typeOrClass.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.a(42, 'number', 'yes', 'no') // 'yes'
         * si.a('str', Number, 'yes', 'no') // 'no'
         * si.a(42, 'number', () => 'computed', 'no') // 'computed'
         */
        a(value: any, typeOrClass: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is an accessor descriptor.
         * Delegates the condition check to {@link is#accessorDescriptor}.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is an accessor descriptor.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not an accessor descriptor.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.accessorDescriptor({ get: () => 42 }, 'yes', 'no') // 'yes'
         * si.accessorDescriptor({ value: 42 }, 'yes', 'no') // 'no'
         * si.accessorDescriptor({ get: () => 42 }, () => 'computed', 'no') // 'computed'
         */
        accessorDescriptor(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is an array.
         * Delegates the condition check to {@link is#array}.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is an array.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not an array.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.array([1, 2, 3], 'yes', 'no') // 'yes'
         * si.array('string', 'yes', 'no') // 'no'
         * si.array([1, 2, 3], () => 'computed', 'no') // 'computed'
         */
        array(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is a bigint.
         * Delegates the condition check to {@link is#bigint}.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is a bigint.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not a bigint.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.bigint(123n, 'yes', 'no') // 'yes'
         * si.bigint(123, 'yes', 'no') // 'no'
         * si.bigint(123n, () => 'computed', 'no') // 'computed'
         */
        bigint(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is a boolean.
         * Delegates the condition check to {@link is#boolean}.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is a boolean.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not a boolean.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.boolean(true, 'yes', 'no') // 'yes'
         * si.boolean(1, 'yes', 'no') // 'no'
         * si.boolean(false, () => 'computed', 'no') // 'computed'
         */
        boolean(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether object is callable.
         * Delegates the condition check to {@link is#callable}.
         *
         * @param {*} object - The object to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if object is callable.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if object is not callable.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.callable(function() {}, 'yes', 'no') // 'yes'
         * si.callable(123, 'yes', 'no') // 'no'
         * si.callable(function() {}, () => 'computed', 'no') // 'computed'
         */
        callable(object: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether object is a callable descriptor.
         * Delegates the condition check to {@link is#callableDescriptor}.
         *
         * @param {*} object - The object to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if object is a callable descriptor.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if object is not a callable descriptor.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.callableDescriptor({ get: function() {} }, 'yes', 'no') // 'yes'
         * si.callableDescriptor(123, 'yes', 'no') // 'no'
         * si.callableDescriptor({ get: function() {} }, () => 'computed', 'no') // 'computed'
         */
        callableDescriptor(object: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is a data property descriptor.
         * Delegates the condition check to {@link is#dataDescriptor}.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is a data descriptor.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not a data descriptor.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.dataDescriptor({ value: 42, writable: true }, 'yes', 'no') // 'yes'
         * si.dataDescriptor({ get: () => 42 }, 'yes', 'no') // 'no'
         * si.dataDescriptor({ value: 42 }, () => 'computed', 'no') // 'computed'
         */
        dataDescriptor(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is a property descriptor.
         * Delegates the condition check to {@link is#descriptor}.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is a property descriptor.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not a property descriptor.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.descriptor({ configurable: true }, 'yes', 'no') // 'yes'
         * si.descriptor({}, 'yes', 'no') // 'no'
         * si.descriptor({ get: () => {} }, () => 'computed', 'no') // 'computed'
         */
        descriptor(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is strictly false.
         * Delegates the condition check to {@link is#false}.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is strictly false.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not strictly false.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.false(false, 'yes', 'no') // 'yes'
         * si.false(0, 'yes', 'no') // 'no'
         * si.false(false, () => 'computed', 'no') // 'computed'
         */
        false(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is falsy.
         * Delegates the condition check to {@link is#falsy}.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is falsy.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not falsy.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.falsy(0, 'yes', 'no') // 'yes'
         * si.falsy(1, 'yes', 'no') // 'no'
         * si.falsy('', () => 'computed', 'no') // 'computed'
         */
        falsy(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Alias for {@link si#falsy}. Inline if-then-else based on whether value
         * is falsy. Delegates the condition check to {@link is#falsey}.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is falsy.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not falsy.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.falsey(0, 'yes', 'no') // 'yes'
         * si.falsey(1, 'yes', 'no') // 'no'
         * si.falsey('', () => 'computed', 'no') // 'computed'
         */
        falsey(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is a function.
         * Delegates the condition check to {@link is#function}.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is a function.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not a function.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.function(function() {}, 'yes', 'no') // 'yes'
         * si.function(123, 'yes', 'no') // 'no'
         * si.function(function() {}, () => 'computed', 'no') // 'computed'
         */
        function(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is iterable.
         * Delegates the condition check to {@link is#iterable}.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is iterable.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not iterable.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.iterable([1, 2, 3], 'yes', 'no') // 'yes'
         * si.iterable(123, 'yes', 'no') // 'no'
         * si.iterable('string', () => 'computed', 'no') // 'computed'
         */
        iterable(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is null or undefined.
         * Delegates the condition check to {@link is#nullish}.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is nullish.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not nullish.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.nullish(null, 'yes', 'no') // 'yes'
         * si.nullish('value', 'yes', 'no') // 'no'
         * si.nullish(undefined, () => 'computed', 'no') // 'computed'
         */
        nullish(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is a number.
         * Delegates the condition check to {@link is#number}.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is a number.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not a number.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.number(123, 'yes', 'no') // 'yes'
         * si.number('123', 'yes', 'no') // 'no'
         * si.number(123, () => 'computed', 'no') // 'computed'
         */
        number(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is an object.
         * Delegates the condition check to {@link is#object}.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is an object.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not an object.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.object({}, 'yes', 'no') // 'yes'
         * si.object(null, 'yes', 'no') // 'no'
         * si.object({}, () => 'computed', 'no') // 'computed'
         */
        object(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is a valid object entry.
         * Delegates the condition check to {@link is#objectEntry}.
         *
         * @param {any} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is a valid object entry.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not a valid object entry.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.objectEntry(['key', 42], 'yes', 'no') // 'yes'
         * si.objectEntry([1, 2, 3], 'yes', 'no') // 'no'
         * si.objectEntry(['key', 42], () => 'computed', 'no') // 'computed'
         */
        objectEntry(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is a valid object key.
         * Delegates the condition check to {@link is#objectKey}.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is a valid object key.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not a valid object key.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.objectKey('name', 'yes', 'no') // 'yes'
         * si.objectKey({}, 'yes', 'no') // 'no'
         * si.objectKey(Symbol('id'), () => 'computed', 'no') // 'computed'
         */
        objectKey(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is a primitive type.
         * Delegates the condition check to {@link is#primitive}.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is a primitive.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not a primitive.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.primitive('hello', 'yes', 'no') // 'yes'
         * si.primitive({}, 'yes', 'no') // 'no'
         * si.primitive(123, () => 'computed', 'no') // 'computed'
         */
        primitive(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is shiny (object or function).
         * Delegates the condition check to {@link is#shiny}.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is shiny.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not shiny.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.shiny({}, 'yes', 'no') // 'yes'
         * si.shiny(123, 'yes', 'no') // 'no'
         * si.shiny(function() {}, () => 'computed', 'no') // 'computed'
         */
        shiny(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is a string.
         * Delegates the condition check to {@link is#string}.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is a string.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not a string.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.string('hello', 'yes', 'no') // 'yes'
         * si.string(123, 'yes', 'no') // 'no'
         * si.string('hello', () => 'computed', 'no') // 'computed'
         */
        string(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is a symbol.
         * Delegates the condition check to {@link is#symbol}.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is a symbol.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not a symbol.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.symbol(Symbol('foo'), 'yes', 'no') // 'yes'
         * si.symbol('foo', 'yes', 'no') // 'no'
         * si.symbol(Symbol('foo'), () => 'computed', 'no') // 'computed'
         */
        symbol(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else using an arbitrary condition. If condition is a
         * function, it is called and its result is used as the condition; otherwise
         * the condition value is evaluated directly.
         *
         * @param {function|*} condition - The condition to evaluate. If a function,
         *   it is called and its return value is used as the condition.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if the condition is truthy.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if the condition is falsy.
         * @returns {*} The result of thenValue if the condition is truthy,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.then(true, 'yes', 'no') // 'yes'
         * si.then(false, 'yes', 'no') // 'no'
         * si.then(() => true, 'yes', 'no') // 'yes'
         * si.then(() => false, () => 'computed', 'no') // 'no'
         */
        then(condition: Function | any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is strictly true.
         * Delegates the condition check to {@link is#true}.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is strictly true.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not strictly true.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.true(true, 'yes', 'no') // 'yes'
         * si.true(1, 'yes', 'no') // 'no'
         * si.true(true, () => 'computed', 'no') // 'computed'
         */
        true(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is truthy.
         * Delegates the condition check to {@link is#truthy}.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is truthy.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not truthy.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.truthy(1, 'yes', 'no') // 'yes'
         * si.truthy(0, 'yes', 'no') // 'no'
         * si.truthy("hello", () => 'computed', 'no') // 'computed'
         */
        truthy(value: any, thenValue: Function | any, elseValue: Function | any): any;
        /**
         * Inline if-then-else based on whether value is undefined.
         * Delegates the condition check to {@link is#a} with type 'undefined'.
         *
         * @param {*} value - The value to check.
         * @param {function|*} thenValue - Returned (or called and its result
         *   returned) if value is undefined.
         * @param {function|*} elseValue - Returned (or called and its result
         *   returned) if value is not undefined.
         * @returns {*} The result of thenValue if the condition is true,
         *   elseValue otherwise. If thenValue or elseValue is a function,
         *   its return value is used instead.
         *
         * @example
         * si.undefined(undefined, 'yes', 'no') // 'yes'
         * si.undefined('value', 'yes', 'no') // 'no'
         * si.undefined(undefined, () => 'computed', 'no') // 'computed'
         */
        undefined(value: any, thenValue: Function | any, elseValue: Function | any): any;
    };
    is: {
        /**
         * Checks if a value matches a specified type or class.
         *
         * This function determines if the provided value matches the specified
         * type or class. It supports both primitive types and class constructors.
         *
         * @param {*} value - The value to check.
         * @param {*} typeOrClass - The type or class to compare against.
         * @returns {boolean} True if the value matches the type or class,
         *   false otherwise.
         *
         * @example
         * // Returns true
         * is.a(42, 'number')
         *
         * @example
         * // Returns true
         * is.a(new Date(), Date)
         *
         * @example
         * // Returns false
         * is.a('string', Number)
         */
        a(value: any, typeOrClass: any): boolean;
        /**
         * Check if a value is an accessor descriptor.
         *
         * An accessor descriptor is an object that describes the configuration of a
         * property on an object, specifically focusing on the 'get' and 'set'
         * attributes. Computed accessor descriptors are invalid if they also have
         * a `value` and/or `writable` property.
         *
         * @param value The value to check.
         * @returns True if the value is an accessor descriptor, false otherwise.
         *
         * @example
         * // Returns true
         * is.accessorDescriptor({ get: () => 42, set: () => {} })
         *
         * // Returns false
         * is.accessorDescriptor({ value: 42, writable: true })
         */
        accessorDescriptor(value: any): boolean;
        /**
         * Check if a value is an array.
         *
         * @param value The value to check.
         * @returns True if the value is an array, false otherwise.
         *
         * @example
         * is.array([1, 2, 3]) // true
         * is.array('string') // false
         */
        array(value: any): value is any[];
        /**
         * Check if a value is a bigint.
         *
         * @param value The value to check.
         * @returns True if the value is a bigint, false otherwise.
         *
         * @example
         * is.bigint(123n) // true
         * is.bigint(123) // false
         */
        bigint(value: any): value is bigint | BigInt;
        /**
         * Checks if a value is strictly a boolean (true or false).
         *
         * This method verifies if the provided value is either `true` or `false`.
         *
         * @param {*} value - The value to check.
         * @returns {boolean} True if the value is a boolean, false otherwise.
         *
         * @example
         * is.boolean(true) // true
         * is.boolean(false) // true
         * is.boolean(1) // false
         * is.boolean("true") // false
         */
        boolean(value: any): boolean;
        /**
         * Check if an object is callable. This function is more or less a
         * synonym or alias for `is.function()`.
         *
         * @param object The object to check.
         * @returns True if the object is callable, false otherwise.
         *
         * @note if you wish to know if a descriptor has a callable `value`,
         * `get`, or `set` function, use `is.callableDescriptor` instead.
         *
         * @example
         * is.callable(function() {}) // true
         */
        callable(object: any): boolean;
        /**
         * Check if an object is a callable descriptor. It looks to see if the
         * object represents a descriptor that is callable by checking object
         * properties named `value`, `get`, and `set`. If any of the three
         * yields a function type, true is returned.
         *
         * @param object The object to check.
         * @returns True if the object is a callable descriptor, false otherwise.
         *
         * @example
         * is.callableDescriptor({ get: function() {} }) // true
         * is.callableDescriptor(123) // false
         *
         * // Note the differences between these
         * const object = { get name() { return "Brie"; } }
         * const descriptor = Object.getOwnPropertyDescriptor(object, 'name')
         * is.callableDescriptor(object) // false
         * is.callableDescriptor(descriptor) // true
         */
        callableDescriptor(object: any): boolean;
        /**
         * Check if a value is a data property descriptor.
         *
         * A data descriptor is an object that describes the configuration of a
         * property on an object, specifically focusing on the 'value' and
         * 'writable' attributes. The descriptor is invalid if it contains
         * the accessor descriptors `get` or `set`.
         *
         * @param value The value to check.
         * @returns True if the value is a data descriptor, false otherwise.
         *
         * @example
         * // Returns true
         * is.dataDescriptor({ value: 42, writable: true })
         *
         * // Returns false
         * is.dataDescriptor({ get: () => 42, set: () => {} })
         */
        dataDescriptor(value: any): boolean;
        /**
         * Check if a value is a property descriptor.
         *
         * A property descriptor is an object that describes the configuration of a
         * property on an object. This function checks if the provided value is an
         * object and contains any of the standard property descriptor keys.
         *
         * @param value The value to check.
         * @returns True if the value is a property descriptor, false otherwise.
         *
         * @example
         * is.descriptor({ configurable: true, enumerable: false }) // true
         * is.descriptor({ get: () => {}, set: () => {} }) // true
         * is.descriptor({}) // false
         */
        descriptor(value: any): boolean;
        /**
         * Checks if a value is strictly false.
         *
         * This method verifies if the provided value is strictly `false`.
         *
         * @param {*} value - The value to check.
         * @returns {boolean} True if the value is strictly false, false otherwise.
         *
         * @example
         * is.false(false) // true
         * is.false(true) // false
         * is.false(0) // false
         */
        false(value: any): boolean;
        /**
         * Checks if a value is falsy.
         *
         * This method converts the provided value to a boolean and returns
         * `true` if the value is falsy (i.e., false, 0, "", null, undefined,
         * or NaN).
         *
         * @param {*} value - The value to check.
         * @returns {boolean} True if the value is falsy, false otherwise.
         *
         * @example
         * is.falsy(0) // true
         * is.falsy("") // true
         * is.falsy(1) // false
         * is.falsy("hello") // false
         */
        falsy(value: any): boolean;
        /**
         * Alias for the `falsy` method.
         *
         * This method is an alias for `is.falsy` and performs the same check.
         *
         * @param {*} value - The value to check.
         * @returns {boolean} True if the value is falsy, false otherwise.
         *
         * @example
         * is.falsey(0) // true
         * is.falsey("") // true
         * is.falsey(1) // false
         * is.falsey("hello") // false
         */
        falsey(value: any): boolean;
        /**
         * Check if a value is a function.
         *
         * @param value The value to check.
         * @returns True if the value is a function, false otherwise.
         *
         * @example
         * is.function(function() {}) // true
         * is.function(123) // false
         */
        function(value: any): boolean;
        /**
         * Check if a value is iterable. Depending on the environment, JavaScript
         * will permit `'string'[Symbol.iterator]()` whereas in some places, you
         * will need to wrap string in an object first. Since other JSVM provided
         * environments may or may not be leniant with this, we play it safe by
         * implicitly object converting values before checking for the symbol. If
         * a value is already an object, it will simply be passed through.
         *
         * @param value The value to check.
         * @returns True if the value is iterable, false otherwise.
         *
         * @example
         * is.iterable([1, 2, 3]) // true
         * is.iterable('string') // true
         * is.iterable(123) // false
         */
        iterable(value: any): any;
        /**
         * Check if a value is null or undefined.
         *
         * @param value The value to check.
         * @returns True if the value is null or undefined, false otherwise.
         *
         * @example
         * is.nullish(null) // true
         * is.nullish(undefined) // true
         * is.nullish('value') // false
         */
        nullish(value: any): boolean;
        /**
         * Check if a value is a number.
         *
         * @param value The value to check.
         * @returns True if the value is a number, false otherwise.
         *
         * @example
         * is.number(123) // true
         * is.number('123') // false
         */
        number(value: any): value is number | Number;
        /**
         * Check if a value is an object.
         *
         * @param value The value to check.
         * @returns True if the value is an object, false otherwise.
         *
         * @example
         * is.object({}) // true
         * is.object(null) // false
         */
        object(value: any): boolean;
        /**
         * The {@link Object#entries} function returns the properties of a given
         * value as an array of arrays where each element of the inner arrays is
         * a valid object key (so one of {@link String}, {@link Number}, or
         * {@link Symbol}) and the second element is the value of the pair which
         * can be any type.
         *
         * This function vets this criteria and would return true for each entry
         * in the returned outer array of a call to {@link Object#entries}.
         *
         * @param {any} value the value to test
         * @returns {boolean} true if the value is a valid object entry in the
         * form of `[key, value]`.
         */
        objectEntry(value: any): boolean;
        /**
         * Check if a value is a valid object key. Valid object keys are strings,
         * numbers, or symbols — the same types accepted as property keys in
         * JavaScript objects.
         *
         * @param {*} value - The value to check.
         * @returns {boolean} True if the value is a string, number, or symbol,
         * false otherwise.
         *
         * @example
         * is.objectKey('name') // true
         * is.objectKey(0) // true
         * is.objectKey(Symbol('id')) // true
         * is.objectKey({}) // false
         * is.objectKey(null) // false
         */
        objectKey(value: any): boolean;
        /**
         * Check if a value is a primitive type.
         *
         * This function determines if the provided value is one of the JavaScript
         * primitive types: string, number, boolean, bigint, or symbol.
         *
         * @param value The value to check.
         * @returns True if the value is a primitive type, false otherwise.
         *
         * @example
         * // Returns true
         * is.primitive('hello')
         *
         * // Returns true
         * is.primitive(123)
         *
         * // Returns true
         * is.primitive(true)
         *
         * // Returns true
         * is.primitive(123n)
         *
         * // Returns true
         * is.primitive(Symbol('symbol'))
         *
         * // Returns false
         * is.primitive({})
         *
         * // Returns false
         * is.primitive([])
         */
        primitive(value: any): boolean;
        /**
         * The use of `typeof` is not a safe guarantor when it comes to Reflect
         * supported values. Any non-null value that returns a `typeof` either
         * `object` or `function` should suffice. Note that arrays return 'object'
         * when run through `typeof`. Shiny is clearly a reference to something
         * reflective and is much shorter to type. Also, Mal says shiny. :)
         *
         * @param value The value to check.
         * @returns True if the value is an object or a function, false otherwise.
         *
         * @example
         * is.shiny({}) // true
         * is.shiny(function() {}) // true
         * is.shiny(123) // false
         */
        shiny(value: any): boolean;
        /**
         * Check if a value is a string.
         *
         * @param value The value to check.
         * @returns True if the value is a string, false otherwise.
         *
         * @example
         * is.string('hello') // true
         * is.string(123) // false
         */
        string(value: any): value is string | String;
        /**
         * Checks if a value is a symbol.
         *
         * This function determines whether the provided value is of type
         * 'symbol' or an instance of the Symbol object.
         *
         * @param value - The value to check.
         * @returns True if the value is a symbol, false otherwise.
         *
         * @example
         * is.symbol(Symbol('foo')) // Returns true
         * is.symbol('foo') // Returns false
         */
        symbol(value: any): value is symbol | Symbol;
        /**
         * Checks if a value is strictly true.
         *
         * This method verifies if the provided value is strictly `true`.
         *
         * @param {*} value - The value to check.
         * @returns {boolean} True if the value is strictly true, false otherwise.
         *
         * @example
         * is.true(true) // true
         * is.true(false) // false
         * is.true(1) // false
         */
        true(value: any): boolean;
        /**
         * Checks if a value is truthy.
         *
         * This method converts the provided value to a boolean and returns
         * `true` if the value is truthy (i.e., not false, 0, "", null, undefined,
         * or NaN).
         *
         * @param {*} value - The value to check.
         * @returns {boolean} True if the value is truthy, false otherwise.
         *
         * @example
         * is.truthy(1) // true
         * is.truthy("hello") // true
         * is.truthy(0) // false
         * is.truthy("") // false
         */
        truthy(value: any): boolean;
    };
    has: (object: any, key: any) => any;
    as: {
        /**
         * Converts a value to an array if it is iterable.
         *
         * @param value The value to convert.
         * @returns The converted array if the value is iterable, otherwise undefined.
         *
         * @example
         * // Returns [1, 2, 3]
         * as.array([1, 2, 3])
         *
         * @example
         * // Returns ['s', 't', 'r', 'i', 'n', 'g']
         * as.array('string')
         *
         * @example
         * // Returns undefined
         * as.array(123)
         */
        array(value: any): any;
        /**
         * Converts a value to an object. If the supplied value is a primitive
         * value, in many cases, this will convert it to an object instance of
         * that type. Numbers, strings, symbols, and big integers, all have
         * object instance variants. Wrapping them in a call to `Object()` will
         * convert the primitive into this instance variant.
         *
         * @param value The value to convert.
         * @returns The converted object.
         *
         * @example
         * // Returns { key: 'value' }
         * as.object({ key: 'value' })
         *
         * @example
         * // String instance as oppposed to primitive string
         * typeof as.object('string') // 'object'
         * as.object('string') instanceof String // true
         * 'string' instanceof String // false
         *
         * @example
         * // Returns {}
         * as.object(null)
         */
        object(value: any): any;
        /**
         * Converts a given value to a string. This function handles various types
         * of values, including null, undefined, objects with custom
         * [Symbol.toPrimitive] methods, and objects with toString or valueOf
         * methods.
         *
         * @param value The value to convert to a string.
         * @param use Optional configuration object:
         *        - description: If true, returns the description of a Symbol.
         *        - stringTag: If true, returns the [Symbol.toStringTag] value if present.
         * @returns The string representation of the value.
         *
         * @example
         * // Returns 'null'
         * as.string(null)
         *
         * @example
         * // Returns '123'
         * as.string(123)
         *
         * @example
         * // Returns 'custom'
         * const obj = {
         *   [Symbol.toPrimitive](hint) {
         *     if (hint === 'string') return 'custom'
         *     return null
         *   }
         * }
         * as.string(obj)
         *
         * @example
         * // Returns 'mySymbol'
         * as.string(Symbol('mySymbol'), { description: true })
         *
         * @example
         * // Returns 'Array'
         * as.string([], { stringTag: true })
         */
        string(value: any, use?: {
            description: boolean;
            stringTag: boolean;
        }): any;
        /**
         * Converts a given value to a string representing an integer.
         *
         * This method first converts the value to a number string and then extracts
         * the integer part by splitting the string at the decimal point.
         *
         * @param value The value to convert to an integer string.
         * @returns The integer part of the value as a string.
         *
         * @example
         * // Returns '123'
         * as.integerString(123.456)
         *
         * @example
         * // Returns '0'
         * as.integerString('0.789')
         */
        integerString(value: any): any;
        /**
         * Converts a given value to a string representing a number.
         *
         * This method first converts the value to a string, trims any whitespace,
         * and removes any non-numeric characters except for '.', 'e', 'E', '+',
         * and '-'. It then uses a regular expression to match a floating-point
         * number, allowing an optional leading '+' or '-' sign, digits before
         * and after a single decimal point.
         *
         * @param value The value to convert to a number string.
         * @returns The sanitized number string or an empty string if no valid
         * float was found.
         *
         * @example
         * // Returns '123.456'
         * as.numberString('  123.456abc  ')
         *
         * @example
         * // Returns '-0.789'
         * as.numberString('-0.789xyz')
         */
        numberString(value: any): any;
        /**
         * Converts a given value to a number.
         *
         * This method uses the `numberString` method to sanitize the input value
         * and then converts it to a number.
         *
         * @param value The value to convert to a number.
         * @returns The numeric representation of the value.
         *
         * @example
         * // Returns 123.456
         * as.number('123.456abc')
         *
         * @example
         * // Returns -0.789
         * as.number('-0.789xyz')
         */
        number(value: any): number;
        /**
         * Converts a given value to a bigint.
         *
         * This method uses the `integerString` method to sanitize the input value
         * and then converts it to a bigint.
         *
         * @param value The value to convert to a bigint.
         * @returns The bigint representation of the value.
         *
         * @example
         * // Returns 123n
         * as.bigint('123.456abc')
         *
         * @example
         * // Returns 0n
         * as.bigint('0.789xyz')
         */
        bigint(value: any): bigint;
        /**
         * Converts a given value to a boolean.
         *
         * This method takes a value, converts it to a string, and then checks
         * if it matches common representations of boolean values. It returns
         * `true` for "1", "yes", and "true" (case insensitive), and `false`
         * for "0", "no", and "false" (case insensitive). For any other values,
         * it returns the boolean representation of the value.
         *
         * @param {*} value - The value to convert to a boolean.
         * @returns {boolean} The boolean representation of the value.
         *
         * @example
         * // Returns true
         * as.boolean("yes")
         *
         * @example
         * // Returns false
         * as.boolean("no")
         *
         * @example
         * // Returns true
         * as.boolean(1)
         *
         * @example
         * // Returns false
         * as.boolean(0)
         *
         * @example
         * // Returns true
         * as.boolean("true")
         *
         * @example
         * // Returns false
         * as.boolean("false")
         *
         * @example
         * // Returns true
         * as.boolean({})
         *
         * @example
         * // Returns false
         * as.boolean(null)
         */
        boolean(value: any): boolean;
    };
};
export namespace is {
    /**
     * Checks if a value matches a specified type or class.
     *
     * This function determines if the provided value matches the specified
     * type or class. It supports both primitive types and class constructors.
     *
     * @param {*} value - The value to check.
     * @param {*} typeOrClass - The type or class to compare against.
     * @returns {boolean} True if the value matches the type or class,
     *   false otherwise.
     *
     * @example
     * // Returns true
     * is.a(42, 'number')
     *
     * @example
     * // Returns true
     * is.a(new Date(), Date)
     *
     * @example
     * // Returns false
     * is.a('string', Number)
     */
    export function a(value: any, typeOrClass: any): boolean;
    /**
     * Check if a value is an accessor descriptor.
     *
     * An accessor descriptor is an object that describes the configuration of a
     * property on an object, specifically focusing on the 'get' and 'set'
     * attributes. Computed accessor descriptors are invalid if they also have
     * a `value` and/or `writable` property.
     *
     * @param value The value to check.
     * @returns True if the value is an accessor descriptor, false otherwise.
     *
     * @example
     * // Returns true
     * is.accessorDescriptor({ get: () => 42, set: () => {} })
     *
     * // Returns false
     * is.accessorDescriptor({ value: 42, writable: true })
     */
    export function accessorDescriptor(value: any): boolean;
    /**
     * Check if a value is an array.
     *
     * @param value The value to check.
     * @returns True if the value is an array, false otherwise.
     *
     * @example
     * is.array([1, 2, 3]) // true
     * is.array('string') // false
     */
    export function array(value: any): value is any[];
    /**
     * Check if a value is a bigint.
     *
     * @param value The value to check.
     * @returns True if the value is a bigint, false otherwise.
     *
     * @example
     * is.bigint(123n) // true
     * is.bigint(123) // false
     */
    export function bigint(value: any): value is bigint | BigInt;
    /**
     * Checks if a value is strictly a boolean (true or false).
     *
     * This method verifies if the provided value is either `true` or `false`.
     *
     * @param {*} value - The value to check.
     * @returns {boolean} True if the value is a boolean, false otherwise.
     *
     * @example
     * is.boolean(true) // true
     * is.boolean(false) // true
     * is.boolean(1) // false
     * is.boolean("true") // false
     */
    export function boolean(value: any): boolean;
    /**
     * Check if an object is callable. This function is more or less a
     * synonym or alias for `is.function()`.
     *
     * @param object The object to check.
     * @returns True if the object is callable, false otherwise.
     *
     * @note if you wish to know if a descriptor has a callable `value`,
     * `get`, or `set` function, use `is.callableDescriptor` instead.
     *
     * @example
     * is.callable(function() {}) // true
     */
    export function callable(object: any): boolean;
    /**
     * Check if an object is a callable descriptor. It looks to see if the
     * object represents a descriptor that is callable by checking object
     * properties named `value`, `get`, and `set`. If any of the three
     * yields a function type, true is returned.
     *
     * @param object The object to check.
     * @returns True if the object is a callable descriptor, false otherwise.
     *
     * @example
     * is.callableDescriptor({ get: function() {} }) // true
     * is.callableDescriptor(123) // false
     *
     * // Note the differences between these
     * const object = { get name() { return "Brie"; } }
     * const descriptor = Object.getOwnPropertyDescriptor(object, 'name')
     * is.callableDescriptor(object) // false
     * is.callableDescriptor(descriptor) // true
     */
    export function callableDescriptor(object: any): boolean;
    /**
     * Check if a value is a data property descriptor.
     *
     * A data descriptor is an object that describes the configuration of a
     * property on an object, specifically focusing on the 'value' and
     * 'writable' attributes. The descriptor is invalid if it contains
     * the accessor descriptors `get` or `set`.
     *
     * @param value The value to check.
     * @returns True if the value is a data descriptor, false otherwise.
     *
     * @example
     * // Returns true
     * is.dataDescriptor({ value: 42, writable: true })
     *
     * // Returns false
     * is.dataDescriptor({ get: () => 42, set: () => {} })
     */
    export function dataDescriptor(value: any): boolean;
    /**
     * Check if a value is a property descriptor.
     *
     * A property descriptor is an object that describes the configuration of a
     * property on an object. This function checks if the provided value is an
     * object and contains any of the standard property descriptor keys.
     *
     * @param value The value to check.
     * @returns True if the value is a property descriptor, false otherwise.
     *
     * @example
     * is.descriptor({ configurable: true, enumerable: false }) // true
     * is.descriptor({ get: () => {}, set: () => {} }) // true
     * is.descriptor({}) // false
     */
    export function descriptor(value: any): boolean;
    /**
     * Checks if a value is strictly false.
     *
     * This method verifies if the provided value is strictly `false`.
     *
     * @param {*} value - The value to check.
     * @returns {boolean} True if the value is strictly false, false otherwise.
     *
     * @example
     * is.false(false) // true
     * is.false(true) // false
     * is.false(0) // false
     */
    function _false(value: any): boolean;
    export { _false as false };
    /**
     * Checks if a value is falsy.
     *
     * This method converts the provided value to a boolean and returns
     * `true` if the value is falsy (i.e., false, 0, "", null, undefined,
     * or NaN).
     *
     * @param {*} value - The value to check.
     * @returns {boolean} True if the value is falsy, false otherwise.
     *
     * @example
     * is.falsy(0) // true
     * is.falsy("") // true
     * is.falsy(1) // false
     * is.falsy("hello") // false
     */
    export function falsy(value: any): boolean;
    /**
     * Alias for the `falsy` method.
     *
     * This method is an alias for `is.falsy` and performs the same check.
     *
     * @param {*} value - The value to check.
     * @returns {boolean} True if the value is falsy, false otherwise.
     *
     * @example
     * is.falsey(0) // true
     * is.falsey("") // true
     * is.falsey(1) // false
     * is.falsey("hello") // false
     */
    export function falsey(value: any): boolean;
    /**
     * Check if a value is a function.
     *
     * @param value The value to check.
     * @returns True if the value is a function, false otherwise.
     *
     * @example
     * is.function(function() {}) // true
     * is.function(123) // false
     */
    function _function(value: any): boolean;
    export { _function as function };
    /**
     * Check if a value is iterable. Depending on the environment, JavaScript
     * will permit `'string'[Symbol.iterator]()` whereas in some places, you
     * will need to wrap string in an object first. Since other JSVM provided
     * environments may or may not be leniant with this, we play it safe by
     * implicitly object converting values before checking for the symbol. If
     * a value is already an object, it will simply be passed through.
     *
     * @param value The value to check.
     * @returns True if the value is iterable, false otherwise.
     *
     * @example
     * is.iterable([1, 2, 3]) // true
     * is.iterable('string') // true
     * is.iterable(123) // false
     */
    export function iterable(value: any): any;
    /**
     * Check if a value is null or undefined.
     *
     * @param value The value to check.
     * @returns True if the value is null or undefined, false otherwise.
     *
     * @example
     * is.nullish(null) // true
     * is.nullish(undefined) // true
     * is.nullish('value') // false
     */
    export function nullish(value: any): boolean;
    /**
     * Check if a value is a number.
     *
     * @param value The value to check.
     * @returns True if the value is a number, false otherwise.
     *
     * @example
     * is.number(123) // true
     * is.number('123') // false
     */
    export function number(value: any): value is number | Number;
    /**
     * Check if a value is an object.
     *
     * @param value The value to check.
     * @returns True if the value is an object, false otherwise.
     *
     * @example
     * is.object({}) // true
     * is.object(null) // false
     */
    export function object(value: any): boolean;
    /**
     * The {@link Object#entries} function returns the properties of a given
     * value as an array of arrays where each element of the inner arrays is
     * a valid object key (so one of {@link String}, {@link Number}, or
     * {@link Symbol}) and the second element is the value of the pair which
     * can be any type.
     *
     * This function vets this criteria and would return true for each entry
     * in the returned outer array of a call to {@link Object#entries}.
     *
     * @param {any} value the value to test
     * @returns {boolean} true if the value is a valid object entry in the
     * form of `[key, value]`.
     */
    export function objectEntry(value: any): boolean;
    /**
     * Check if a value is a valid object key. Valid object keys are strings,
     * numbers, or symbols — the same types accepted as property keys in
     * JavaScript objects.
     *
     * @param {*} value - The value to check.
     * @returns {boolean} True if the value is a string, number, or symbol,
     * false otherwise.
     *
     * @example
     * is.objectKey('name') // true
     * is.objectKey(0) // true
     * is.objectKey(Symbol('id')) // true
     * is.objectKey({}) // false
     * is.objectKey(null) // false
     */
    export function objectKey(value: any): boolean;
    /**
     * Check if a value is a primitive type.
     *
     * This function determines if the provided value is one of the JavaScript
     * primitive types: string, number, boolean, bigint, or symbol.
     *
     * @param value The value to check.
     * @returns True if the value is a primitive type, false otherwise.
     *
     * @example
     * // Returns true
     * is.primitive('hello')
     *
     * // Returns true
     * is.primitive(123)
     *
     * // Returns true
     * is.primitive(true)
     *
     * // Returns true
     * is.primitive(123n)
     *
     * // Returns true
     * is.primitive(Symbol('symbol'))
     *
     * // Returns false
     * is.primitive({})
     *
     * // Returns false
     * is.primitive([])
     */
    export function primitive(value: any): boolean;
    /**
     * The use of `typeof` is not a safe guarantor when it comes to Reflect
     * supported values. Any non-null value that returns a `typeof` either
     * `object` or `function` should suffice. Note that arrays return 'object'
     * when run through `typeof`. Shiny is clearly a reference to something
     * reflective and is much shorter to type. Also, Mal says shiny. :)
     *
     * @param value The value to check.
     * @returns True if the value is an object or a function, false otherwise.
     *
     * @example
     * is.shiny({}) // true
     * is.shiny(function() {}) // true
     * is.shiny(123) // false
     */
    export function shiny(value: any): boolean;
    /**
     * Check if a value is a string.
     *
     * @param value The value to check.
     * @returns True if the value is a string, false otherwise.
     *
     * @example
     * is.string('hello') // true
     * is.string(123) // false
     */
    export function string(value: any): value is string | String;
    /**
     * Checks if a value is a symbol.
     *
     * This function determines whether the provided value is of type
     * 'symbol' or an instance of the Symbol object.
     *
     * @param value - The value to check.
     * @returns True if the value is a symbol, false otherwise.
     *
     * @example
     * is.symbol(Symbol('foo')) // Returns true
     * is.symbol('foo') // Returns false
     */
    export function symbol(value: any): value is symbol | Symbol;
    /**
     * Checks if a value is strictly true.
     *
     * This method verifies if the provided value is strictly `true`.
     *
     * @param {*} value - The value to check.
     * @returns {boolean} True if the value is strictly true, false otherwise.
     *
     * @example
     * is.true(true) // true
     * is.true(false) // false
     * is.true(1) // false
     */
    function _true(value: any): boolean;
    export { _true as true };
    /**
     * Checks if a value is truthy.
     *
     * This method converts the provided value to a boolean and returns
     * `true` if the value is truthy (i.e., not false, 0, "", null, undefined,
     * or NaN).
     *
     * @param {*} value - The value to check.
     * @returns {boolean} True if the value is truthy, false otherwise.
     *
     * @example
     * is.truthy(1) // true
     * is.truthy("hello") // true
     * is.truthy(0) // false
     * is.truthy("") // false
     */
    export function truthy(value: any): boolean;
}
export namespace si {
    /**
     * Inline if-then-else based on whether value matches a specified type or
     * class. Delegates the condition check to {@link is#a}.
     *
     * @param {*} value - The value to check.
     * @param {*} typeOrClass - The type or class to compare against.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value matches typeOrClass.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value does not match typeOrClass.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.a(42, 'number', 'yes', 'no') // 'yes'
     * si.a('str', Number, 'yes', 'no') // 'no'
     * si.a(42, 'number', () => 'computed', 'no') // 'computed'
     */
    export function a(value: any, typeOrClass: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else based on whether value is an accessor descriptor.
     * Delegates the condition check to {@link is#accessorDescriptor}.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is an accessor descriptor.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not an accessor descriptor.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.accessorDescriptor({ get: () => 42 }, 'yes', 'no') // 'yes'
     * si.accessorDescriptor({ value: 42 }, 'yes', 'no') // 'no'
     * si.accessorDescriptor({ get: () => 42 }, () => 'computed', 'no') // 'computed'
     */
    export function accessorDescriptor(value: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else based on whether value is an array.
     * Delegates the condition check to {@link is#array}.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is an array.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not an array.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.array([1, 2, 3], 'yes', 'no') // 'yes'
     * si.array('string', 'yes', 'no') // 'no'
     * si.array([1, 2, 3], () => 'computed', 'no') // 'computed'
     */
    export function array(value: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else based on whether value is a bigint.
     * Delegates the condition check to {@link is#bigint}.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is a bigint.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not a bigint.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.bigint(123n, 'yes', 'no') // 'yes'
     * si.bigint(123, 'yes', 'no') // 'no'
     * si.bigint(123n, () => 'computed', 'no') // 'computed'
     */
    export function bigint(value: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else based on whether value is a boolean.
     * Delegates the condition check to {@link is#boolean}.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is a boolean.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not a boolean.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.boolean(true, 'yes', 'no') // 'yes'
     * si.boolean(1, 'yes', 'no') // 'no'
     * si.boolean(false, () => 'computed', 'no') // 'computed'
     */
    export function boolean(value: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else based on whether object is callable.
     * Delegates the condition check to {@link is#callable}.
     *
     * @param {*} object - The object to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if object is callable.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if object is not callable.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.callable(function() {}, 'yes', 'no') // 'yes'
     * si.callable(123, 'yes', 'no') // 'no'
     * si.callable(function() {}, () => 'computed', 'no') // 'computed'
     */
    export function callable(object: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else based on whether object is a callable descriptor.
     * Delegates the condition check to {@link is#callableDescriptor}.
     *
     * @param {*} object - The object to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if object is a callable descriptor.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if object is not a callable descriptor.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.callableDescriptor({ get: function() {} }, 'yes', 'no') // 'yes'
     * si.callableDescriptor(123, 'yes', 'no') // 'no'
     * si.callableDescriptor({ get: function() {} }, () => 'computed', 'no') // 'computed'
     */
    export function callableDescriptor(object: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else based on whether value is a data property descriptor.
     * Delegates the condition check to {@link is#dataDescriptor}.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is a data descriptor.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not a data descriptor.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.dataDescriptor({ value: 42, writable: true }, 'yes', 'no') // 'yes'
     * si.dataDescriptor({ get: () => 42 }, 'yes', 'no') // 'no'
     * si.dataDescriptor({ value: 42 }, () => 'computed', 'no') // 'computed'
     */
    export function dataDescriptor(value: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else based on whether value is a property descriptor.
     * Delegates the condition check to {@link is#descriptor}.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is a property descriptor.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not a property descriptor.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.descriptor({ configurable: true }, 'yes', 'no') // 'yes'
     * si.descriptor({}, 'yes', 'no') // 'no'
     * si.descriptor({ get: () => {} }, () => 'computed', 'no') // 'computed'
     */
    export function descriptor(value: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else based on whether value is strictly false.
     * Delegates the condition check to {@link is#false}.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is strictly false.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not strictly false.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.false(false, 'yes', 'no') // 'yes'
     * si.false(0, 'yes', 'no') // 'no'
     * si.false(false, () => 'computed', 'no') // 'computed'
     */
    function _false(value: any, thenValue: Function | any, elseValue: Function | any): any;
    export { _false as false };
    /**
     * Inline if-then-else based on whether value is falsy.
     * Delegates the condition check to {@link is#falsy}.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is falsy.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not falsy.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.falsy(0, 'yes', 'no') // 'yes'
     * si.falsy(1, 'yes', 'no') // 'no'
     * si.falsy('', () => 'computed', 'no') // 'computed'
     */
    export function falsy(value: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Alias for {@link si#falsy}. Inline if-then-else based on whether value
     * is falsy. Delegates the condition check to {@link is#falsey}.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is falsy.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not falsy.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.falsey(0, 'yes', 'no') // 'yes'
     * si.falsey(1, 'yes', 'no') // 'no'
     * si.falsey('', () => 'computed', 'no') // 'computed'
     */
    export function falsey(value: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else based on whether value is a function.
     * Delegates the condition check to {@link is#function}.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is a function.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not a function.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.function(function() {}, 'yes', 'no') // 'yes'
     * si.function(123, 'yes', 'no') // 'no'
     * si.function(function() {}, () => 'computed', 'no') // 'computed'
     */
    function _function(value: any, thenValue: Function | any, elseValue: Function | any): any;
    export { _function as function };
    /**
     * Inline if-then-else based on whether value is iterable.
     * Delegates the condition check to {@link is#iterable}.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is iterable.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not iterable.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.iterable([1, 2, 3], 'yes', 'no') // 'yes'
     * si.iterable(123, 'yes', 'no') // 'no'
     * si.iterable('string', () => 'computed', 'no') // 'computed'
     */
    export function iterable(value: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else based on whether value is null or undefined.
     * Delegates the condition check to {@link is#nullish}.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is nullish.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not nullish.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.nullish(null, 'yes', 'no') // 'yes'
     * si.nullish('value', 'yes', 'no') // 'no'
     * si.nullish(undefined, () => 'computed', 'no') // 'computed'
     */
    export function nullish(value: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else based on whether value is a number.
     * Delegates the condition check to {@link is#number}.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is a number.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not a number.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.number(123, 'yes', 'no') // 'yes'
     * si.number('123', 'yes', 'no') // 'no'
     * si.number(123, () => 'computed', 'no') // 'computed'
     */
    export function number(value: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else based on whether value is an object.
     * Delegates the condition check to {@link is#object}.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is an object.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not an object.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.object({}, 'yes', 'no') // 'yes'
     * si.object(null, 'yes', 'no') // 'no'
     * si.object({}, () => 'computed', 'no') // 'computed'
     */
    export function object(value: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else based on whether value is a valid object entry.
     * Delegates the condition check to {@link is#objectEntry}.
     *
     * @param {any} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is a valid object entry.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not a valid object entry.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.objectEntry(['key', 42], 'yes', 'no') // 'yes'
     * si.objectEntry([1, 2, 3], 'yes', 'no') // 'no'
     * si.objectEntry(['key', 42], () => 'computed', 'no') // 'computed'
     */
    export function objectEntry(value: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else based on whether value is a valid object key.
     * Delegates the condition check to {@link is#objectKey}.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is a valid object key.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not a valid object key.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.objectKey('name', 'yes', 'no') // 'yes'
     * si.objectKey({}, 'yes', 'no') // 'no'
     * si.objectKey(Symbol('id'), () => 'computed', 'no') // 'computed'
     */
    export function objectKey(value: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else based on whether value is a primitive type.
     * Delegates the condition check to {@link is#primitive}.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is a primitive.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not a primitive.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.primitive('hello', 'yes', 'no') // 'yes'
     * si.primitive({}, 'yes', 'no') // 'no'
     * si.primitive(123, () => 'computed', 'no') // 'computed'
     */
    export function primitive(value: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else based on whether value is shiny (object or function).
     * Delegates the condition check to {@link is#shiny}.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is shiny.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not shiny.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.shiny({}, 'yes', 'no') // 'yes'
     * si.shiny(123, 'yes', 'no') // 'no'
     * si.shiny(function() {}, () => 'computed', 'no') // 'computed'
     */
    export function shiny(value: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else based on whether value is a string.
     * Delegates the condition check to {@link is#string}.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is a string.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not a string.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.string('hello', 'yes', 'no') // 'yes'
     * si.string(123, 'yes', 'no') // 'no'
     * si.string('hello', () => 'computed', 'no') // 'computed'
     */
    export function string(value: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else based on whether value is a symbol.
     * Delegates the condition check to {@link is#symbol}.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is a symbol.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not a symbol.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.symbol(Symbol('foo'), 'yes', 'no') // 'yes'
     * si.symbol('foo', 'yes', 'no') // 'no'
     * si.symbol(Symbol('foo'), () => 'computed', 'no') // 'computed'
     */
    export function symbol(value: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else using an arbitrary condition. If condition is a
     * function, it is called and its result is used as the condition; otherwise
     * the condition value is evaluated directly.
     *
     * @param {function|*} condition - The condition to evaluate. If a function,
     *   it is called and its return value is used as the condition.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if the condition is truthy.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if the condition is falsy.
     * @returns {*} The result of thenValue if the condition is truthy,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.then(true, 'yes', 'no') // 'yes'
     * si.then(false, 'yes', 'no') // 'no'
     * si.then(() => true, 'yes', 'no') // 'yes'
     * si.then(() => false, () => 'computed', 'no') // 'no'
     */
    export function then(condition: Function | any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else based on whether value is strictly true.
     * Delegates the condition check to {@link is#true}.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is strictly true.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not strictly true.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.true(true, 'yes', 'no') // 'yes'
     * si.true(1, 'yes', 'no') // 'no'
     * si.true(true, () => 'computed', 'no') // 'computed'
     */
    function _true(value: any, thenValue: Function | any, elseValue: Function | any): any;
    export { _true as true };
    /**
     * Inline if-then-else based on whether value is truthy.
     * Delegates the condition check to {@link is#truthy}.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is truthy.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not truthy.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.truthy(1, 'yes', 'no') // 'yes'
     * si.truthy(0, 'yes', 'no') // 'no'
     * si.truthy("hello", () => 'computed', 'no') // 'computed'
     */
    export function truthy(value: any, thenValue: Function | any, elseValue: Function | any): any;
    /**
     * Inline if-then-else based on whether value is undefined.
     * Delegates the condition check to {@link is#a} with type 'undefined'.
     *
     * @param {*} value - The value to check.
     * @param {function|*} thenValue - Returned (or called and its result
     *   returned) if value is undefined.
     * @param {function|*} elseValue - Returned (or called and its result
     *   returned) if value is not undefined.
     * @returns {*} The result of thenValue if the condition is true,
     *   elseValue otherwise. If thenValue or elseValue is a function,
     *   its return value is used instead.
     *
     * @example
     * si.undefined(undefined, 'yes', 'no') // 'yes'
     * si.undefined('value', 'yes', 'no') // 'no'
     * si.undefined(undefined, () => 'computed', 'no') // 'computed'
     */
    export function undefined(value: any, thenValue: Function | any, elseValue: Function | any): any;
}
export function has(object: any, key: any): any;
export namespace as {
    /**
     * Converts a value to an array if it is iterable.
     *
     * @param value The value to convert.
     * @returns The converted array if the value is iterable, otherwise undefined.
     *
     * @example
     * // Returns [1, 2, 3]
     * as.array([1, 2, 3])
     *
     * @example
     * // Returns ['s', 't', 'r', 'i', 'n', 'g']
     * as.array('string')
     *
     * @example
     * // Returns undefined
     * as.array(123)
     */
    function array(value: any): any;
    /**
     * Converts a value to an object. If the supplied value is a primitive
     * value, in many cases, this will convert it to an object instance of
     * that type. Numbers, strings, symbols, and big integers, all have
     * object instance variants. Wrapping them in a call to `Object()` will
     * convert the primitive into this instance variant.
     *
     * @param value The value to convert.
     * @returns The converted object.
     *
     * @example
     * // Returns { key: 'value' }
     * as.object({ key: 'value' })
     *
     * @example
     * // String instance as oppposed to primitive string
     * typeof as.object('string') // 'object'
     * as.object('string') instanceof String // true
     * 'string' instanceof String // false
     *
     * @example
     * // Returns {}
     * as.object(null)
     */
    function object(value: any): any;
    /**
     * Converts a given value to a string. This function handles various types
     * of values, including null, undefined, objects with custom
     * [Symbol.toPrimitive] methods, and objects with toString or valueOf
     * methods.
     *
     * @param value The value to convert to a string.
     * @param use Optional configuration object:
     *        - description: If true, returns the description of a Symbol.
     *        - stringTag: If true, returns the [Symbol.toStringTag] value if present.
     * @returns The string representation of the value.
     *
     * @example
     * // Returns 'null'
     * as.string(null)
     *
     * @example
     * // Returns '123'
     * as.string(123)
     *
     * @example
     * // Returns 'custom'
     * const obj = {
     *   [Symbol.toPrimitive](hint) {
     *     if (hint === 'string') return 'custom'
     *     return null
     *   }
     * }
     * as.string(obj)
     *
     * @example
     * // Returns 'mySymbol'
     * as.string(Symbol('mySymbol'), { description: true })
     *
     * @example
     * // Returns 'Array'
     * as.string([], { stringTag: true })
     */
    function string(value: any, use?: {
        description: boolean;
        stringTag: boolean;
    }): any;
    /**
     * Converts a given value to a string representing an integer.
     *
     * This method first converts the value to a number string and then extracts
     * the integer part by splitting the string at the decimal point.
     *
     * @param value The value to convert to an integer string.
     * @returns The integer part of the value as a string.
     *
     * @example
     * // Returns '123'
     * as.integerString(123.456)
     *
     * @example
     * // Returns '0'
     * as.integerString('0.789')
     */
    function integerString(value: any): any;
    /**
     * Converts a given value to a string representing a number.
     *
     * This method first converts the value to a string, trims any whitespace,
     * and removes any non-numeric characters except for '.', 'e', 'E', '+',
     * and '-'. It then uses a regular expression to match a floating-point
     * number, allowing an optional leading '+' or '-' sign, digits before
     * and after a single decimal point.
     *
     * @param value The value to convert to a number string.
     * @returns The sanitized number string or an empty string if no valid
     * float was found.
     *
     * @example
     * // Returns '123.456'
     * as.numberString('  123.456abc  ')
     *
     * @example
     * // Returns '-0.789'
     * as.numberString('-0.789xyz')
     */
    function numberString(value: any): any;
    /**
     * Converts a given value to a number.
     *
     * This method uses the `numberString` method to sanitize the input value
     * and then converts it to a number.
     *
     * @param value The value to convert to a number.
     * @returns The numeric representation of the value.
     *
     * @example
     * // Returns 123.456
     * as.number('123.456abc')
     *
     * @example
     * // Returns -0.789
     * as.number('-0.789xyz')
     */
    function number(value: any): number;
    /**
     * Converts a given value to a bigint.
     *
     * This method uses the `integerString` method to sanitize the input value
     * and then converts it to a bigint.
     *
     * @param value The value to convert to a bigint.
     * @returns The bigint representation of the value.
     *
     * @example
     * // Returns 123n
     * as.bigint('123.456abc')
     *
     * @example
     * // Returns 0n
     * as.bigint('0.789xyz')
     */
    function bigint(value: any): bigint;
    /**
     * Converts a given value to a boolean.
     *
     * This method takes a value, converts it to a string, and then checks
     * if it matches common representations of boolean values. It returns
     * `true` for "1", "yes", and "true" (case insensitive), and `false`
     * for "0", "no", and "false" (case insensitive). For any other values,
     * it returns the boolean representation of the value.
     *
     * @param {*} value - The value to convert to a boolean.
     * @returns {boolean} The boolean representation of the value.
     *
     * @example
     * // Returns true
     * as.boolean("yes")
     *
     * @example
     * // Returns false
     * as.boolean("no")
     *
     * @example
     * // Returns true
     * as.boolean(1)
     *
     * @example
     * // Returns false
     * as.boolean(0)
     *
     * @example
     * // Returns true
     * as.boolean("true")
     *
     * @example
     * // Returns false
     * as.boolean("false")
     *
     * @example
     * // Returns true
     * as.boolean({})
     *
     * @example
     * // Returns false
     * as.boolean(null)
     */
    function boolean(value: any): boolean;
}
declare namespace _default {
    export { as };
    export { has };
    export { is };
    export { si };
    export { createToolkit };
}
export default _default;
