// eslint-disable-next-line no-var, no-unused-vars
var ConstantsLoader = (() => {
	const allowedTypes = ["boolean", "bigint", "number", "string"];

	function init(data) {
		/* Use a modified cloning function to protect data. */
		return clone(data);
	}

	function clone(obj) {
		const fragment = Object.create({});
		Object.entries(obj).forEach(([key, value]) => {
			if (typeof value === "object") {
				/* Sub object within object. */
				Object.defineProperty(fragment, key, {
					value: clone(value),
					writable: false,
					configurable: false,
				});
			} else if (allowedTypes.includes(typeof value)) {
				/* A value type, ready for getter conversion. */
				Object.defineProperty(fragment, key, {
					set() {
						if (!V.debug) return;
						Errors.report("A modification of a constant was attempted.", {
							key,
							value,
							fragment,
						});
					},
					get() {
						return value;
					},
					configurable: false,
				});
			}
		});
		return fragment;
	}

	return Object.seal({
		init,
		clone,
	});
})();
