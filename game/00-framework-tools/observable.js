window.inDOM = function (node) {
	return document.body.contains(node);
};

/**
 * Simple observable value framework, somewhat inspired by Vue.js.
 *
 * @example
 * var text = new ObservableValue("hello");
 * text.subscribe( (newText, oldText) => console.log('Text changed from', oldText, 'to', newText) );
 * text.bindText(document.getElementById("text"));
 * text.value = "hello world";
 */
class ObservableValue {
	constructor(defaultValue) {
		this._value = defaultValue;
		this._listeners = [];
		this._mutating = false; // we are in process of changing value
		this._nextValues = null; // queued value changes
	}

	/**
	 * Receive notifications on value change.
	 * If the onChange function returns exactly false, stop notifications.
	 * Exact equality is checked, so void-returning functions are fine too.
	 *
	 * Be careful with changing values in the listener!
	 *
	 * @param {Function} onChange Function(newValue, oldValue):any.
	 */
	subscribe(onChange) {
		this._listeners.push(onChange);
	}

	/**
	 * Don't notify {@param onChange} listener anymore.
	 *
	 * @param {any} onChange
	 */
	unsubscribe(onChange) {
		const index = this._listeners.indexOf(onChange);
		if (index >= 0) this._listeners.splice(index, 1);
	}

	/**
	 * Subscribe and auto-unsubscribe when element gets removed from DOM.
	 *
	 * @param {Node} element
	 * @param {Function} onchange Function(newValue, oldValue).
	 * @returns {Node} Element.
	 */
	domSubscribe(element, onchange) {
		this.subscribe((newValue, oldValue) => {
			if (onchange(newValue, oldValue) === false) return false;
			return inDOM(element);
		});
		return element;
	}

	/**
	 * Bind element's textContent to this value.
	 *
	 * @param {Node} element
	 * @returns {Node} Element.
	 */
	bindText(element) {
		element.textContent = this._value;
		this.domSubscribe(element, newValue => {
			element.textContent = newValue;
		});
		return element;
	}

	_notifyListeners(newValue, oldValue) {
		const remove = [];
		const listeners = this._listeners.slice();
		for (const listener of listeners) {
			try {
				const keep = listener(newValue, oldValue);
				if (keep === false) remove.push(listener);
			} catch (e) {
				remove.push(listener);
				console.error("Exception in ObservableValue listener: ", e, "listener is ", listener);
			}
		}
		for (const listener of remove) {
			this.unsubscribe(listener);
		}
	}

	/**
	 * Get current value.
	 */
	get value() {
		return this._value;
	}

	/**
	 * Change value, notifying subscribers.
	 */
	set value(newValue) {
		if (this._mutating) {
			this._nextValues.push(newValue);
			return;
		}

		let oldValue = this._value;
		if (oldValue === newValue) return;
		this._value = newValue;

		this._mutating = true;
		this._nextValues = [];

		this._notifyListeners(newValue, oldValue);

		let n = 0;
		while (this._nextValues.length > 0) {
			if (n++ > 999) {
				console.error("Possible endless loop in ObservableValue ", this);
				break;
			}
			oldValue = newValue;
			newValue = this._nextValues.shift();
			this._notifyListeners(newValue, oldValue);
		}
		this._mutating = false;
		this._nextValues = null;
	}
}

/**
 * Modify obj, wrapping every property into an ObservableValue. Not deep!
 *
 * @param {object} obj
 * @returns {object} Obj.
 */
ObservableValue.fromObject = function (obj) {
	for (const key of Object.keys(obj)) {
		obj[key] = new ObservableValue(obj[key]);
	}
	return obj;
};
window.ObservableValue = ObservableValue;
