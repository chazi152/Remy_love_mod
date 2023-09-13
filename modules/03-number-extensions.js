/**
 * Returns true if the given number is between min and max, inclusive.
 *
 * @param {number} min Lowest value.
 * @param {number} max Highest value.
 * @returns {boolean} Whether given number between min and max, inclusive.
 */
Object.defineProperty(Number.prototype, "between", {
	configurable: true,
	writable: true,

	value(min, max) {
		if (min > max) {
			Errors.report("[Number.between]: min must be less than or equal to max.", {
				min,
				max,
				Stacktrace: Utils.GetStack(),
			});
			return false;
		}
		return this >= min && this <= max;
	},
});
