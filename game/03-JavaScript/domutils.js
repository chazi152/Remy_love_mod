/* eslint-disable no-unused-vars */
function eleprop(e, k, v) {
	if (k === "$oncreate") {
		v.call(e, e);
	} else if (k.indexOf("on") === 0) {
		e.addEventListener(k.slice(2), v.bind(e));
	} else if (v !== undefined) {
		if (k in e) {
			e[k] = v;
		} else {
			e.setAttribute(k, v);
		}
	}
	return e;
}

function eleprops(e, props) {
	if (!props) return e;
	for (const kv of Object.entries(props)) {
		eleprop(e, kv[0], kv[1]);
	}
	return e;
}

function elechild(e, c) {
	if (typeof c === "string") {
		if (c) {
			e.appendChild(document.createTextNode(c));
		}
	} else if (Array.isArray(c)) {
		elechildren(e, c);
	} else {
		e.appendChild(c);
	}
	return e;
}

function elechildren(e, children) {
	if (arguments.length > 2) {
		elechildren(e, Array.from(arguments).slice(1));
	} else if (typeof children === "string" || children instanceof Node) {
		elechild(e, children);
	} else if (children) {
		for (const c of children) {
			elechild(e, c);
		}
	}
	return e;
}

/**
 * Create HTML Element with properties, attributes, events, and children. Similar to Vue h() function.
 *
 * @param {string} tag Element tag name.
 * @param {object} props With properties, attributes, and events to set.
 * @param {(string|Node|Array)} children Child elements and texts to add, either array or a single child.
 * @returns {HTMLElement} Created element.
 * @example
 * element("span", {
 *     class: "red",
 *     onhover: function() { this.className = ""; }
 * }, [
 *  "Click the ",
 *  element("a", { href:"/link" }, "Link")
 * ])
 */
function element(tag, props, children) {
	if (children === undefined && (typeof props === "string" || Array.isArray(props) || props instanceof Node)) {
		children = props;
		props = null;
	}
	const e = document.createElement(tag);
	elechildren(e, children);
	eleprops(e, props);
	return e;
}

function elecustomprops(e, props, customProps) {
	for (const kv of Object.entries(props)) {
		const k = kv[0];
		const v = kv[1];
		if (k in customProps) {
			customProps[k](e, v);
		} else {
			eleprop(e, k, v);
		}
	}
}

function customElement(tag, baseProps, props, children, customProps) {
	const e = element(tag, baseProps, children);
	elecustomprops(e, props, customProps);
	return e;
}

/**
 * Extra props:
 * - set(newValue:(string|number)) - input listener.
 *
 * @param {object} props
 */
function eInput(props) {
	return customElement("input", { type: "text" }, props, null, {
		set(e, set) {
			set = set.bind(e);
			e.addEventListener("input", () => {
				let value = e.value;
				if (e.type === "number" || e.type === "range") {
					value = parseFloat(value);
					if (!isFinite(value)) return;
				}
				set(value);
			});
		},
	});
}

/**
 * Extra props:
 * - value:boolean - same as 'checked'
 * - set(newValue:boolean) - change listener.
 *
 * @param {object} props
 */
function eCheckbox(props) {
	const checkbox = customElement("input", { type: "checkbox" }, props, null, {
		label() {},
		value(e, value) {
			e.checked = !!value;
		},
		set(e, set) {
			set = set.bind(e);
			e.addEventListener("change", () => {
				set(e.checked);
			});
		},
	});
	if (props && "label" in props) {
		return element("label", [props.label, checkbox]);
	}
	return checkbox;
}

/**
 * Extra props:
 * - items:({value:string, text:string}] | string)[] - options
 * - value:string - selected item value
 * - set(newValue:string) - change listener.
 *
 * @param {object} props
 */
function eSelect(props) {
	return customElement("select", null, props, null, {
		items(e, items) {
			for (let item of items) {
				if (typeof item === "string") item = { value: item, text: item };
				e.appendChild(
					element(
						"option",
						{
							value: item.value,
							selected: item.value === e.value,
						},
						item.text
					)
				);
			}
		},
		set(e, set) {
			set = set.bind(e);
			e.addEventListener("change", () => set(e.value));
		},
	});
}
