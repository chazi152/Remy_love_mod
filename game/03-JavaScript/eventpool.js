/*
 * Usage:
 *
 * 1. Registering events as widgets
 * <<widget "EVENT_NAME">>
 *   (Event content)
 * <</widget>>
 *
 * 2. Calling events
 *
 * <<cleareventpool>>
 *
 * <<addevent WIDGET_NAME [WEIGHT]>>
 * <<addevent WIDGET_NAME [WEIGHT]>>
 * <<addinlineevent [NAME_FOR_DEBUGGING [WEIGHT]]>>
 *   Content for an event you don't want to define as a widget
 * <</addinlineevent>>
 *
 * <<runeventpool>> - will pick a weighted random event and execute its content.
 *
 * Weight is a relative probability, so event with weight=2 would appear twice as often as event with weight=1.
 * Default weight is 1.
 */

/**
 * Return a weighted random item, that is, probability of each item is proportional to their weight,
 * probability P(event_i) = weight_i / sum_of_weights.
 *
 * Items - array of objects with optional 'weight' key - a number or a no-arg function returning number.
 * Default 1.
 * Weight of Infinity means "return this item, ignore others".
 *
 * @param {any[]} items
 */
function rollWeightedRandomFromArray(items) {
	if (!Array.isArray(items)) throw new Error("Not an array: " + items);
	// convert items to array of {weight:number, item:original_item} and filter out bad elements
	items = items
		.map(function (el) {
			if (!el || typeof el !== "object") return null;
			let w = el.weight;
			if (typeof w === "function") w = w();
			if (typeof w === "string") w = parseFloat(w);
			if (typeof w !== "number") w = 1;
			return { weight: w, item: el };
		})
		.filter(function (el) {
			if (!el || !(el.weight > 0)) {
				if (StartConfig.debug) {
					console.debug("Filtered out ", el);
				}
				return false;
			}
			return true;
		});
	if (StartConfig.debug) {
		console.debug("Picking from random pool", items);
	}
	if (items.length === 0) return null; // Or could throw an exception (no items with positive weight)
	let sum = 0;
	for (let i = 0; i < items.length; i++) {
		if (!isFinite(items[i].weight)) {
			if (StartConfig.debug) {
				console.debug("Returning infinite-weighted", items[i].item);
			}
			return items[i].item;
		}
		sum += items[i].weight;
	}
	let roll = randomFloat(sum);
	const roll0 = roll;
	for (let i = 0; i < items.length; i++) {
		roll -= items[i].weight;
		if (roll <= 0) {
			if (StartConfig.debug) {
				console.debug("Roll = ", roll0, "sum = ", sum, "returning ", items[i].item);
			}
			return items[i].item;
		}
	}
	// Should never happen
	console.warn("Weighted random math went wrong", roll0, sum, items);
	return items[0].item;
}
window.rollWeightedRandomFromArray = rollWeightedRandomFromArray;

Macro.add("cleareventpool", {
	skipArgs: true,
	handler() {
		T.eventpool = [];
	},
});

Macro.add("addinlineevent", {
	tags: null,
	handler() {
		T.eventpool.push({
			name: this.args[0] || "",
			weight: this.args.length === 2 ? +this.args[1] : 1.0,
			content: this.payload[0].contents,
		});
	},
});

Macro.add("addevent", {
	handler() {
		const widget = this.args[0];
		if (typeof widget !== "string" || !widget || this.args.length > 2) throw new Error("Bad addevent args " + JSON.stringify(this.args));
		T.eventpool.push({
			name: widget,
			content: "<<" + widget + ">>",
			weight: this.args.length === 2 ? +this.args[1] : 1.0,
		});
	},
});

Macro.add("runeventpool", {
	skipArgs: true,
	handler() {
		let pick = T.eventpool.find(e => e.name === V.eventPoolOverride);
		if (pick) {
			delete V.eventPoolOverride;
		} else if (T.eventpool.includes(V.eventPoolOverride)) {
			pick = V.eventPoolOverride;
			delete V.eventPoolOverride;
		} else {
			pick = rollWeightedRandomFromArray(T.eventpool);
		}
		if (!pick) throw new Error("Event pool is empty");
		// Jimmy: For tracking where in the code you may be.
		// E.G: ['eventAmbient', >>'autumn_anystreet_2'<<, 'generate1']
		DOL.Stack.push(pick.name);
		jQuery(this.output).wiki(pick.content);
		DOL.Stack.pop();
	},
});
