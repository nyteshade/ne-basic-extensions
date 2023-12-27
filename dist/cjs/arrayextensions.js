"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayPrototypeExtensions = void 0;
const extension_1 = require("@nejs/extension");
/**
 * The `ArrayPrototypeExtensions` patch extends the prototype of the built-in
 * JavaScript `Array` with additional properties for convenience and improved
 * readability. By applying this patch, all array instances gain new getter
 * properties `first` and `last`, which provide quick access to the first and
 * last elements of the array, respectively. This enhancement simplifies common
 * operations on arrays and makes code more expressive and concise.
 */
exports.ArrayPrototypeExtensions = new extension_1.Patch(Array.prototype, {
    /**
     * A getter property that returns the first element of the array. If the
     * array is empty, it returns `undefined`. This property is useful for
     * scenarios where you need to quickly access the first item of an array
     * without the need for additional checks or method calls.
     *
     * @returns {*} The first element of the array or `undefined` if the array
     * is empty.
     */
    get first() {
        return this[0];
    },
    /**
     * A getter property that returns the last element of the array. It
     * calculates the last index based on the array's length. If the array is
     * empty, it returns `undefined`. This property is beneficial when you need
     * to access the last item in an array, improving code readability and
     * avoiding manual index calculation.
     *
     * @returns {*} The last element of the array or `undefined` if the
     * array is empty.
     */
    get last() {
        return this[this.length - 1];
    }
});
