/* eslint-disable jsdoc/require-description-complete-sentence */
// adjust mousetrap behavior, see mousetrap.js
Mousetrap.prototype.stopCallback = function (e, element, combo) {
	// game uses V.tempDisable to indicate when the keyboard shortcuts shouldn't trigger
	// e.g. when typing a name of a new outfit
	if (V.tempDisable) return true; // don't trigger shortcut actions when it's set
	return false;
};

// add binds for "next" link in combat
// eslint-disable-next-line no-undef
Mousetrap.bind(["z", "n", "enter", "space"], function () {
	$("#passages #next a.macro-link").trigger("click");
});

/*
 * Similar to <<script>>, but preprocesses the contents, so $variables are accessible.
 * The variable "output" is also exposed (unlike <<run>>, <<set>>)
 *
 * Example:
 * <<twinescript>>
 *     output.textContent = $text
 * <</twinescript>>
 */
Macro.add("twinescript", {
	skipArgs: true,
	tags: null,

	handler() {
		const output = document.createDocumentFragment();

		try {
			Scripting.evalTwineScript(this.payload[0].contents, output);
		} catch (ex) {
			return this.error(`bad evaluation: ${typeof ex === "object" ? ex.message : ex}`);
		}

		// Custom debug view setup.
		if (Config.debug) {
			this.createDebugView();
		}

		if (output.hasChildNodes()) {
			this.output.appendChild(output);
		}
	},
});

/**
 * JS version of SugarCube's <<for _index, _value range _array>>.
 * Can iterate over
 *
 * Copied from SugarCube sources.
 *
 * @param {any} range Can be String or Object.
 * @param {function(string,any):void} handler Function for each key and value pair.
 */
function rangeIterate(range, handler) {
	let list;
	switch (typeof range) {
		case "string":
			list = [];
			for (let i = 0; i < range.length; true) {
				const obj = Util.charAndPosAt(range, i);
				list.push([i, obj.char]);
				i = 1 + obj.end;
			}
			break;
		case "object":
			if (Array.isArray(range)) {
				list = range.map((val, i) => [i, val]);
			} else if (range instanceof Set) {
				list = Array.from(range).map((val, i) => [i, val]);
			} else if (range instanceof Map) {
				list = Array.from(range);
			} else if (Util.toStringTag(range) === "Object") {
				list = Object.keys(range).map(key => [key, range[key]]);
			} else {
				throw new Error(`unsupported range expression type: ${Util.toStringTag(range)}`);
			}
			break;
		default:
			throw new Error(`unsupported range expression type: ${typeof range}`);
	}
	for (let i = 0; i < list.length; i++) {
		const entry = list[i];
		handler(entry[0], entry[1]);
	}
}
window.rangeIterate = rangeIterate;

/**
 * Define macro, passing arguments to function and store them in $args, preserving & restoring previous $args.
 *
 * @param {string} macroName
 * @param {Function} macroFunction
 * @param {object} tags
 * @param {boolean} skipArgs
 */
function DefineMacro(macroName, macroFunction, tags, skipArgs) {
	Macro.add(macroName, {
		isWidget: true,
		tags,
		skipArgs,
		handler() {
			DOL.Perflog.logWidgetStart(macroName);
			try {
				const oldArgs = State.temporary.args;
				State.temporary.args = this.args.slice();
				macroFunction.apply(this, this.args);
				if (typeof oldArgs === "undefined") {
					delete State.temporary.args;
				} else {
					State.temporary.args = oldArgs;
				}
			} finally {
				DOL.Perflog.logWidgetEnd(macroName);
			}
		},
	});
}

/**
 * Define macro, passing arguments to function and store them in $args, preserving & restoring previous $args.
 *
 * Expectation: macroFunction returns text to wikify & print.
 *
 * @param {string} macroName
 * @param {Function} macroFunction
 * @param {object} tags
 * @param {boolean} skipArgs
 * @param {boolean} maintainContext
 */
function DefineMacroS(macroName, macroFunction, tags, skipArgs, maintainContext) {
	DefineMacro(
		macroName,
		function () {
			$(this.output).wiki(macroFunction.apply(maintainContext ? this : null, this.args));
		},
		tags,
		skipArgs
	);
}

/**
 * Creates and returns the keyword describing the integrity of a clothing article.
 *
 * @param {object} worn clothing article, State.variables.worn.XXXX
 * @param {string} slot clothing article slot used
 * @returns {string} condition key word ("tattered"|"torn|"frayed"|"full")
 */
function integrityKeyword(worn, slot) {
	const i = worn.integrity / clothingData(slot, worn, "integrity_max");
	if (i <= 0.2) {
		return "tattered";
	} else if (i <= 0.5) {
		return "torn";
	} else if (i <= 0.9) {
		return "frayed";
	} else {
		return "full";
	}
}
window.integrityKeyword = integrityKeyword;

/**
 * Returns the integrity prefix of the clothing object.
 *
 * @param {object} worn clothing article, State.variables.worn.XXXX
 * @param {string} slot clothing article slot used
 * @param {string} alt alt version for metal/plastic devices
 * @returns {string} printable integrity prefix
 */
function integrityWord(worn, slot) {
	const kw = integrityKeyword(worn, slot);
	const alt = setup.clothes[slot][clothesIndex(slot, worn)].altDamage;
	if (alt) {
		switch (kw) {
			case "tattered":
				T.text_output = "破损的";
				break;
			case "torn":
				T.text_output = "划伤的";
				break;
			case "frayed":
				T.text_output = alt === "metal" ? "暗淡的" : "褪色的";
				break;
			case "full":
			default:
				T.text_output = "";
		}
	} else {
		switch (kw) {
			case "tattered":
			case "torn":
			case "frayed":
				T.text_output = kw.replace("tattered","破碎的").replace("torn","撕裂的").replace("frayed","磨损的") + "";
				break;
			case "full":
			default:
				T.text_output = "";
		}
	}
	return T.text_output;
}
window.integrityWord = integrityWord;
DefineMacroS("integrityWord", integrityWord);

function underlowerintegrity() {
	return integrityWord(V.worn.under_lower, "under_lower");
}
DefineMacroS("underlowerintegrity", underlowerintegrity);

function underupperintegrity() {
	return integrityWord(V.worn.under_upper, "under_upper");
}
DefineMacroS("underupperintegrity", underupperintegrity);

function overlowerintegrity() {
	return integrityWord(V.worn.over_lower, "over_lower");
}
DefineMacroS("overlowerintegrity", overlowerintegrity);

function lowerintegrity() {
	return integrityWord(V.worn.lower, "lower");
}
DefineMacroS("lowerintegrity", lowerintegrity);

function overupperintegrity() {
	return integrityWord(V.worn.over_upper, "over_upper");
}
DefineMacroS("overupperintegrity", overupperintegrity);

function upperintegrity() {
	return integrityWord(V.worn.upper, "upper");
}
DefineMacroS("upperintegrity", upperintegrity);

function genitalsintegrity() {
	return integrityWord(V.worn.genitals, "genitals");
}
DefineMacroS("genitalsintegrity", genitalsintegrity);

function faceintegrity() {
	return integrityWord(V.worn.face, "face");
}
DefineMacroS("faceintegrity", faceintegrity);

/**
 * @param {object} worn clothing article, State.variables.worn.XXXX
 * @returns {string} printable clothing colour
 */
function clothesColour(worn) {
	if (!worn.colour) return (T.text_output = "");
	if (worn.colour_sidebar) {
		// eslint-disable-next-line no-undef
		if (worn.colour === "custom") return (T.text_output = getCustomColourName(worn.colourCustom)); // defined in clothing-shop-v2.js
		return (T.text_output = setup.colours.clothes.find((e) => e.variable === worn.colour)?.name || worn.colour);
	}
	return (T.text_output = "");
}
window.clothesColour = clothesColour;

/**
 * set temporary vars for outfit checks
 *
 * @returns {void}
 */
function outfitChecks() {
	T.underOutfit = (V.worn.under_lower.outfitSecondary && V.worn.under_lower.outfitSecondary[1] === V.worn.under_upper.name) || false;
	T.middleOutfit = (V.worn.lower.outfitSecondary && V.worn.lower.outfitSecondary[1] === V.worn.upper.name) || false;
	T.overOutfit = (V.worn.over_lower.outfitSecondary && V.worn.over_lower.outfitSecondary[1] === V.worn.over_upper.name) || false;

	T.underNaked = V.worn.under_lower.name === "naked" && V.worn.under_upper.name === "naked";
	T.middleNaked = V.worn.lower.name === "naked" && V.worn.upper.name === "naked";
	T.overNaked = V.worn.over_lower.name === "naked" && V.worn.over_upper.name === "naked";
	T.topless = V.worn.over_upper.name === "naked" && V.worn.upper.name === "naked" && V.worn.under_upper.name === "naked";
	T.bottomless = V.worn.over_lower.name === "naked" && V.worn.lower.name === "naked" && V.worn.under_lower.name === "naked";
	T.fullyNaked = T.topless && T.bottomless;
}
window.outfitChecks = outfitChecks;
DefineMacro("outfitChecks", outfitChecks);

/**
 * @returns {boolean} whether or not any main-body clothing is out of place or wet
 */
function checkForExposedClothing() {
	return setup.clothingLayer.torso.some(clothingLayer => {
		const wetstage = V[clothingLayer.replace("_", "") + "wetstage"];
		return V.worn[clothingLayer].state !== setup.clothes[clothingLayer][clothesIndex(clothingLayer, V.worn[clothingLayer])].state_base || wetstage >= 3;
	});
}
window.checkForExposedClothing = checkForExposedClothing;

function processedSvg(width, height) {
	const svgElem = jQuery(document.createElementNS("http://www.w3.org/2000/svg", "svg"))
		.attr("xmlns", "http://www.w3.org/2000/svg")
		.attr("viewBox", "0 0 " + width + " " + height)
		// eslint-disable-next-line object-shorthand
		.css({ width: width, height: height })
		.wiki(this.payload[0].contents.replace(/^\n/, ""));

	const supportedChildElements = ["img", "image", "a", "rect"];
	const commonAttributes = ["class", "x", "y", "width", "height", "style", "onclick"];

	// Some browsers really don't like working with svg elements unless you specify their namespace upon creation, raw insertion won't render.
	const fixSVGNameSpace = (type, elem, newParent = null) => {
		if (type === "img") type = "image";

		const oldElem = $(elem);
		const newElem = document.createElementNS("http://www.w3.org/2000/svg", type);

		// Set common attributes of new svg namespaced element
		for (const attr of commonAttributes) {
			if (oldElem.attr(attr)) newElem.setAttribute(attr, oldElem.attr(attr));
		}

		// Set unique attributes of specific types of elements
		switch (type) {
			case "image":
				newElem.setAttributeNS("http://www.w3.org/1999/xlink", "href", oldElem.attr("href") || oldElem.attr("xlink:href") || "");
				break;
			case "rect":
				// No unique properties
				break;
			case "a":
				newElem.setAttributeNS("http://www.w3.org/1999/xlink", "title", oldElem.attr("alt") || oldElem.attr("xlink:alt") || "");
				newElem.setAttributeNS("http://www.w3.org/1999/xlink", "alt", oldElem.attr("title") || oldElem.attr("xlink:title") || "");
				break;
			default:
				break;
		}

		if (newParent) newParent.appendChild(newElem);
		else oldElem.replaceWith(newElem);

		// Recursively process nested children if they exist
		for (const htmlElem of supportedChildElements) {
			$(oldElem)
				.children(htmlElem)
				.each((i, elem) => {
					fixSVGNameSpace(htmlElem, elem, newElem);
				});
		}
	};

	// Because the payload got processed as HTML, fix the namespacing and rendering issues to make it a proper SVG again
	$(document).one(":passagerender", function (ev) {
		for (const htmlElem of supportedChildElements) {
			$(ev.content)
				.find("svg " + htmlElem)
				.each((i, elem) => {
					fixSVGNameSpace(htmlElem, elem);
				});
		}
	});

	// This macro works a little different because we can't rely on the normal wikify method to properly translate SVG elements.
	// We need to manually edit the output variable.
	svgElem.appendTo(this.output);

	return "";
}
DefineMacroS("svg", processedSvg, null, false, true);

function numberify(selector) {
	$(() => Links.generateLinkNumbers($(selector)));
	return "";
}
DefineMacroS("numberify", numberify);

function saveDataCompare(save1, save2) {
	const result = {};
	const keys = Object.keys(save1);
	keys.forEach(key => {
		const save1Json = JSON.stringify(save1[key]);
		const save2Json = JSON.stringify(save2[key]);
		if (save1Json !== save2Json) {
			result[key] = [save1[key], save2[key]];
		}
	});
	return result;
}
window.saveDataCompare = saveDataCompare;

/**
 * @returns {object} decoded session state
 */
function getSessionState() {
	if (Config.history.maxSessionStates === 0) return;

	const sessionState = session.get("state");
	if (Object.hasOwn(sessionState, "delta")) {
		sessionState.history = State.deltaDecode(sessionState.delta);
		delete sessionState.delta;
	}
	return sessionState;
}
window.getSessionState = getSessionState;

/**
 * Tries saving sessionState into sessionStorage until it fits the quota.
 * sessionState must have history property.
 *
 * @param {object} sessionState decoded session state
 */
function setSessionState(sessionState) {
	if (!sessionState || !sessionState.history) throw new Error("setSessionState error: not a valid sessionState object");
	let pass = false;
	let sstates = Config.history.maxSessionStates;
	if (sstates === 0) return pass;

	try {
		// if history is bigger than session states limit, reduce the history to match
		if (sessionState.history.length > sstates) sessionState.history = State.marshalForSave(sstates).history;
		if (sstates) session.set("state", sessionState); // don't do session writes if sstates is 0, NaN, undefined, etc.
		pass = true;
	} catch (ex) {
		console.log("session.set failed, recovering");
		if (sstates > sessionState.history.length) sstates = sessionState.length;
		while (sstates && !pass) {
			try {
				sstates--;
				sessionState.history = State.marshalForSave(sstates).history;
				sessionState.history.forEach(s => (s.variables.options.maxStates = sstates));
				session.set("state", sessionState);
				pass = true;
			} catch (ex) {
				continue;
			}
		}
		V.options.maxStates = Config.history.maxStates = Config.history.maxSessionStates = sstates;
		Errors.report("Save data is too big for current History depth setting. It's value was automatically adjusted to " + V.maxStates);
	}
	return pass;
}
window.setSessionState = setSessionState;

/**
 * Replays current passage with different RNG and records updated RNG into sessionStorage
 */
function updateSessionRNG() {
	if (!(V.debug || V.cheatdisable === "f" || V.testing)) return; // do nothing unless debug is enabled
	if (!State.restore()) return; // restore game state before the passage was processed. do nothing if failed
	const sessionState = getSessionState(); // get game state from session storage
	const frame = sessionState.history[sessionState.index]; // current history frame
	State.random(); // re-roll rng
	frame.prng = State.prng.state; // save new rng state
	setSessionState(sessionState); // send altered session data back into storage
	Engine.show(); // replay the passage with new rng
}
window.updateSessionRNG = updateSessionRNG;

// Add binds for going back and forth in history and re-rolling RNG
Mousetrap.bind("/", () => {
	Engine.backward();
	return false;
});
Mousetrap.bind("*", () => {
	updateSessionRNG();
	return false;
});
Mousetrap.bind("-", () => {
	Engine.forward();
	return false;
});

// For the optional numpad to the right of the screen
function mobClick(index) {
	if (index <= Links.currentLinks.length) Links.currentLinks[index - 1].click();
}
window.mobClick = mobClick;
function mobBtnHide() {
	$(".mob-btn").hide();
	$(".mob-btn-h").show();
}
window.mobBtnHide = mobBtnHide;
function mobBtnShow() {
	$(".mob-btn").show();
	$(".mob-btn-h").hide();
}
window.mobBtnShow = mobBtnShow;

/**
 * This function takes a value, and weights it by exponential curve.
 *
 * Value should be between 0.0 and 1.0 (use normalise to get a percentage of a max).
 *
 * An exponent of 1.0 returns 1 every time.
 *
 * Exponents between 1.0 and 2.0 return a curve favoring higher results (closer to 1)
 *
 * An exponent of 2.0 will return a flat line distribution, and is identical to random()
 *
 * Exponents greater than 2.0 return a curve favoring lower results (closer to 0), reaching to 0 at infinity.
 *
 * For example, see:
 * https://www.desmos.com/calculator/87hhrjfixi
 *
 * @param {number} value Value to be weighted
 * @param {number} exp Exponent used to generate the curve
 * @returns {number} value weighted against exponential curve
 */
function expCurve(value, exp) {
	return value ** exp / value;
}
window.expCurve = expCurve;

/**
 * This function creates a random float 0.0-1.0, weighted by exponential curve.
 *
 * A value of 1.0 returns 1 every time.
 *
 * Values between 1.0 and 2.0 return a curve favoring higher results (closer to 1)
 *
 * A value of 2.0 will return a flat line distribution, and is identical to random()
 *
 * Values greater than 2.0 return a curve favoring lower results (closer to 0), reaching to 0 at infinity.
 *
 * For example, see:
 * https://www.desmos.com/calculator/87hhrjfixi
 *
 * @param {number} exp Exponent used to generate the curve
 * @returns {number} random number weighted against exponential curve
 */
function randomExp(exp) {
	return expCurve(State.random(), exp);
}
window.randomExp = randomExp;

/**
 * Normalises value to a decimal number 0.0-1.0, a percentage of the range specified in min and max.
 *
 * @param {number} value The value to be normalised
 * @param {number} max The highest value of the range
 * @param {number} min The lowest value of the range, default 0
 * @returns {number} Normalised value
 */
function normalise(value, max, min = 0) {
	const denominator = max - min;
	if (denominator === 0) {
		Errors.report("[normalise]: min and max params must be different.", { value, max, min });
		return 0;
	}
	if (denominator < 0) {
		Errors.report("[normalise]: max param must be greater than min param.", { value, max, min });
		return 0;
	}
	return Math.clamp((value - min) / denominator, 0, 1);
}
window.normalise = normalise;

/**
 * This macro sets $rng. If the variable $rngOverride is set, $rng will always be set to that.
 * Set $rngOverride in the console for bugtesting purposes. Remember to unset it after testing is finished.
 * With two arguments, it sets $rng to a random value between the first arg and the second arg. This can be used to guarantee $rng is set to a specific value.
 * With one argument, it sets $rng to a random value between 1 and the arg.
 * With no arguments, it sets $rng to a random value between 1 and 100.
 */
Macro.add("rng", {
	handler() {
		if (typeof V.rngOverride === "number" && V.debug === 1) {
			console.log(`rng override: ${V.rngOverride}`);
			V.rng = V.rngOverride;
		} else {
			let min = 1;
			let max = 100;

			if (this.args.length === 2) {
				[min, max] = this.args;
			} else if (this.args.length === 1) {
				max = this.args[0];
			}
			if (typeof min === "number" && typeof max === "number") {
				V.rng = random(min, max);
			} else {
				throw new Error(`invalid arguments: ${min} | ${max}`);
			}
		}
	},
});

/**
 * Returns the object, or a blank object if null. Replaces ?. operator.
 *
 * @param {object} obj
 * @returns {object} - Either the passed arg or {}
 */
const nullable = obj => obj || {};
window.nullable = nullable;

/**
 * This inputs an icon img tag, using the given filename.
 * Files are all in img/misc/icon/
 * Example: <<icon "bed.png">>
 * <<icon "bed.png" "nowhitespace">> does not add a trailing whitespace for formatting.
 */
Macro.add("icon", {
	handler() {
		if (!V.options.images) return;
		const name = typeof this.args[0] === "string" ? this.args[0] : "error";
		const iconImg = document.createElement("img");
		iconImg.className = "icon";
		iconImg.src = "img/misc/icon/" + name;
		this.output.append(iconImg);
		// append a whitespace for compatibility with old icon behavior
		if (!this.args.includes("nowhitespace")) this.output.append(" ");
	},
});

/**
 * Adds a foldout, which can be expanded and collapsed
 * It uses the first element in the content as a header (which can be clicked on), and all other elements as the body (which gets expanded/collapsed)
 * First argument defines whether it starts expanded or not.
 * Second argument defines the variable where the foldout state is saved (if no variable is defined, the foldout will reset to default if you leave the page)
 * Example: <<foldout true "_tempVar">><div>header here</div>body here<</foldout>>
 */
Macro.add("foldout", {
	tags: null,
	handler() {
		if (window.foldoutStates == null) {
			window.foldoutStates = {};
		}
		function setFoldoutState(state, transition = 0) {
			if (state) {
				toggle.addClass("extended");
				body.slideDown(transition);
			} else {
				toggle.removeClass("extended");
				body.slideUp(transition);
			}
			window.foldoutStates[varname] = foldoutState;
		}
		const def = this.args[0] !== undefined ? this.args[0] : true;
		const varname = this.args[1] || "_lastAction";
		let foldoutState = window.foldoutStates[varname] != null ? window.foldoutStates[varname] : def;
		const content = this.payload[0].contents;

		const e = $("<div>").addClass("foldout").append(Wikifier.wikifyEval(content));
		const header = e.children().first().addClass("foldoutHeader");
		const toggle = $("<span>").addClass("foldoutToggle").appendTo(header);
		const body = e.contents().not(header).wrapAll("<div>").parent().insertAfter(header);

		setFoldoutState(foldoutState);

		header.on("click", function () {
			foldoutState = !foldoutState;
			setFoldoutState(foldoutState, 100);
		});
		e.appendTo(this.output);
	},
});
