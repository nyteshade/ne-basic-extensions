import { Patch } from '@nejs/extension';
/**
 * `Math` extensions. Building better worlds...actually just
 * providing some parity between Number and BigInt types for
 * now, but later, better worlds.
 *
 * @type {Patch}
 * @example
 * import { MathExtensions } from 'math.extension.js'
 *
 * MathExtensions.apply()
 * // Now the `Math` class has additional methods available
 */
export const MathExtensions = new Patch(Math, {
    [Patch.kMutablyHidden]: {
        /**
         * The Math.min() static method returns the smallest of the numbers given
         * as input parameters, or Infinity if there are no parameters.
         *
         * @param {bigint|number} values value1, …, valueN – Zero or more numbers
         * among which the lowest value will be selected and returned.
         * @returns {bigint|number|NaN|Infinity} The smallest of the given numbers.
         * Returns NaN if any of the parameters is or is converted into NaN or if
         * the types of numbers are mismatched (i.e., bigint vs. number types).
         * Returns Infinity if no parameters are provided.
         */
        min(...values) {
            const sorter = (l, r) => l < r ? -1 : l > r ? 1 : 0;
            if (!values.length)
                return Infinity;
            if (values.every(n => typeof n === 'bigint')) {
                return values.toSorted(sorter).at(0);
            }
            else if (values.every(n => typeof n === 'number')) {
                return values.toSorted(sorter).at(0);
            }
            else {
                return NaN;
            }
        },
        /**
         * The Math.max() static method returns the largest of the numbers given
         * as input parameters, or Infinity if there are no parameters.
         *
         * @param {bigint|number} values value1, …, valueN – Zero or more numbers
         * among which the largest value will be selected and returned.
         * @returns {bigint|number|NaN|Infinity} The largest of the given numbers.
         * Returns NaN if any of the parameters is or is converted into NaN or if
         * the types of numbers are mismatched (i.e., bigint vs. number types).
         * Returns Infinity if no parameters are provided.
         */
        max(...values) {
            const sorter = (l, r) => l < r ? -1 : l > r ? 1 : 0;
            if (!values.length)
                return Infinity;
            if (values.every(n => typeof n === 'bigint')) {
                return values.toSorted(sorter).at(-1);
            }
            else if (values.every(n => typeof n === 'number')) {
                return values.toSorted(sorter).at(-1);
            }
            else {
                return NaN;
            }
        },
    },
});
//# sourceMappingURL=math.extension.js.map