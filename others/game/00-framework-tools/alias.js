Object.defineProperties(window, {
	/* Story variables property. */
	V: {
		get() {
			return State.variables;
		},
	},
	/* Temporary variables property. */
	T: {
		get() {
			return State.temporary;
		},
	},
	/* Constants property. */
	C: {
		get() {
			return Constants;
		},
	},
	/* Compute property. */
	CU: {
		value: {},
	},
});
