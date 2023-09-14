/* Use the most compatible code possible for this script, it should serve as the first script to load on the page, so should have total precedence. */
(() => {
	"use strict";

	let hasErrored = false;
	let resp = "";
	try {
		// eslint-disable-next-line no-eval
		eval("const tdTest = { 'name': 'Bob', 'age': 5 };const tfTest2 = { 'hair': 'blonde', ...tdTest };");
	} catch (e) {
		hasErrored = true;
		resp += "Destructuring is not supported for your browser.\n";
	}
	if (hasErrored) {
		/* Calculate how the user should upgrade. */
		const segments = navigator.userAgent.split(" ");
		const androidTest = segments.findIndex(s => s.startsWith("Android"));
		const chromeTest = segments.findIndex(s => s.startsWith("Chrome"));
		const firefoxTest = segments.findIndex(s => s.startsWith("Firefox"));
		if (androidTest >= 0) {
			resp += "\nUpdate your Android WebView System app.\nVersion: " + segments[androidTest].slice(8);
		} else if (chromeTest >= 0) {
			resp += "\nUpdate your Chrome browser.\nVersion: " + segments[chromeTest].slice(7);
		} else if (firefoxTest >= 0) {
			resp += "\nUpdate your Firefox browser.\nVersion: " + segments[firefoxTest].slice(8);
		} else {
			resp += "\nUpdate your browser.";
		}
		alert(resp);
		console.debug(resp);
	}
})();

/* Implement hasOwn function interception for old versions of JS. */
if (!Object.hasOwn) {
	Object.defineProperty(Object, "hasOwn", {
		value(object, property) {
			if (object == null) {
				throw new TypeError("Cannot convert undefined or null to object");
			}
			return Object.prototype.hasOwnProperty.call(Object(object), property);
		},
		configurable: true,
		enumerable: false,
		writable: true,
	});
}
