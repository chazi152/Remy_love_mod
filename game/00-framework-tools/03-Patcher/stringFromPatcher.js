/*
	Returns the simple string representation of the given value or, if there is
	none, a square bracketed representation.
*/
// eslint-disable-next-line no-global-assign
stringFrom = function (value) {
	switch (typeof value) {
		case "function":
			return "[function]";

		case "number":
			if (Number.isNaN(value)) {
				return "[number NaN]";
			}

			break;

		case "object":
			if (value === null) {
				return "[null]";
			} else if (value instanceof Array) {
				return value.map(val => stringFrom(val)).join(", ");
			} else if (value instanceof Set) {
				return Array.from(value)
					.map(val => stringFrom(val))
					.join(", ");
			} else if (value instanceof Map) {
				const result = Array.from(value).map(([key, val]) => `${stringFrom(key)} \u2192 ${stringFrom(val)}`);
				return `{\u202F${result.join(", ")}\u202F}`;
			} else if (value instanceof Date) {
				return value.toLocaleString();
			} else if (value instanceof Element) {
				if (value === document.documentElement || value === document.head || value === document.body) {
					throw new Error("illegal operation; attempting to convert the <html>, <head>, or <body> tags to string is not allowed");
				}

				return value.outerHTML;
			} else if (value instanceof Node) {
				return value.textContent;
			} else if (typeof value.toString === "function") {
				return value.toString();
			}

			return Object.prototype.toString.call(value);

		case "symbol": {
			const desc = typeof value.description !== "undefined" ? ` "${value.description}"` : "";
			return `[symbol${desc}]`;
		}

		case "undefined":
			if (V && (V.options.debugdisable === "f" || V.debug === 1)) {
				Errors.report("Print macro attempted to return an undefined variable in " + Utils.GetStack());
			}
			return V && V.debug ? "[undefined]" : "";
	}

	return String(value);
};
