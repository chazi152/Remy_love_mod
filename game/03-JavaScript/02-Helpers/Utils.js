const Utils = (() => {
	function getStack() {
		let output = `:: ${V.passage}`;
		if (DOL.Stack.length >= 1) {
			output += ` [${DOL.Stack.join(", ")}]`;
		}
		return output;
	}

	function defer(func, ...params) {
		if (Engine.isIdle()) {
			$(() => func(...params));
		} else {
			$(document).one(":passageend", () => func(...params));
		}
	}

	return Object.preventExtensions({
		GetStack: getStack,
		Defer: defer,
	});
})();

window.Utils = Utils;
