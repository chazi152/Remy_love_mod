function buildEyeDetails() {
	let sentence = "";
	let concatFlag = false;
	const lenses = V.makeup.eyelenses;
	const colourMap = setup.colours.eyes_map;

	if (lenses.right !== 0 || lenses.left !== 0) {
		sentence += "你穿着";
		if (typeof lenses.left === "string") {
			sentence += setup.colours.eyes_map[lenses.left].name;
			concatFlag = true;
		}
		if (typeof lenses.right === "string") {
			if (concatFlag) sentence += "和";
			sentence += setup.colours.eyes_map[lenses.right].name;
			concatFlag = true;
		}
		if (concatFlag) {
			sentence += "隐形眼镜";
		}
		sentence += "在你";
	} else {
		sentence += "你有着";
	}
	concatFlag = false;

	const leftEyeColour = colourMap[V.leftEyeColour];
	const rightEyeColour = colourMap[V.rightEyeColour];
	if (typeof leftEyeColour === "object") {
		sentence += leftEyeColour.name;
		concatFlag = true;
	}
	if (typeof rightEyeColour === "object" && V.leftEyeColour !== V.rightEyeColour) {
		if (concatFlag) sentence += "和";
		sentence += rightEyeColour.name;
		concatFlag = true;
	}
	if (concatFlag) sentence += "眼睛";
	return sentence + ".";
}
window.buildEyeDetails = buildEyeDetails;

/**
 * Attempts to extrapolate $eyecolour and $makeup.lenses into distinct units.
 * $makeup.lenses gets turned into an object { left : 0, right : 0 }, where the values are 0 or a string.
 * $eyecolour gets assigned to both $leftEyeColour and $rightEyeColour.
 */
function restructureEyeColourVariable() {
	if (V.objectVersion.eyeRepair === undefined) {
		V.objectVersion.eyeRepair = 0;
	}

	switch (V.objectVersion.eyeRepair) {
		case 0: {
			/* Both $leftEyeColour and $rightEyeColour should be the original colours for a character's eyes.
				This function below sets it to $eyecolour, if that fails, $eyeselect, then defaults to purple, the default.
				For it to fail, it must be undefined, it is unlikely that $eyeselect is undefined, but it's likely possible. */
			const getColour = () => (typeof V.eyecolour === "string" ? V.eyecolour : V.eyeselect) || "purple";
			if (!V.leftEyeColour) {
				V.leftEyeColour = getColour();
			}
			if (!V.rightEyeColour) {
				V.rightEyeColour = getColour();
			}
			delete V.eyecolour;
			V.objectVersion.eyeRepair = 1;
		}
		/* falls through */
		case 1:
		case 2:
		case 3: {
			if (!V.makeup) return; /* back out if makeup broken */

			let lenses = V.makeup.eyelenses;
			/* If lenses is not string object or number, or null, it's bad and we hard set */
			if (!["string", "object", "number"].includes(typeof lenses) || !lenses) V.makeup.eyelenses = { left: 0, right: 0 };
			else if (typeof lenses !== "object") {
				/* String or Number so we assign in to new object */
				V.makeup.eyelenses = {
					left: lenses,
					right: lenses,
				};
			}
			lenses = V.makeup.eyelenses;
			/* object - reassign and fix number if needed */
			if (typeof lenses.left === "number") lenses.left = 0;
			if (typeof lenses.right === "number") lenses.right = 0;
			V.objectVersion.eyeRepair = 4;
			break;
		}
	}
}
window.restructureEyeColourVariable = restructureEyeColourVariable;

window.patchCorruptLensesColors = function () {
	if (V.custom_eyecolours != null) {
		for (const index in V.custom_eyecolours)
			V.custom_eyecolours[index].canvasfilter.blend = window.colorNameTranslate(V.custom_eyecolours[index].variable, "hex");
	}
};

function initCustomLenses() {
	/* push custom eye_colours into setup.colours.eyes and sync eye colour map */
	let found, i, i2;
	for (i in V.custom_eyecolours) {
		found = 0;
		for (i2 in setup.colours.eyes) {
			if (setup.colours.eyes[i2].variable === V.custom_eyecolours[i].variable) found = 1;
		}
		if (!found) setup.colours.eyes.push(V.custom_eyecolours[i]);
	}
	window.buildColourMap("eyes", "custom_eyecolours");
}
window.initCustomLenses = initCustomLenses;

function hexToRgbArray(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}

function ColorToHex(color) {
	const hexadecimal = color.toString(16);
	return hexadecimal.length === 1 ? "0" + hexadecimal : hexadecimal;
}

const eyeColourGradient = function (rgbBegin, rgbEnd, p) {
	/* rgb can be RGB value in an array, or hex value in string */
	const w = p * 2 - 1;
	const w1 = (w + 1) / 2.0;
	const w2 = 1 - w1;

	if (typeof rgbBegin === "string" && rgbBegin[0] === "#") rgbBegin = hexToRgbArray(rgbBegin);
	if (typeof rgbEnd === "string" && rgbEnd[0] === "#") rgbEnd = hexToRgbArray(rgbEnd);
	const rgb = [parseInt(rgbBegin[0] * w2 + rgbEnd[0] * w1), parseInt(rgbBegin[1] * w2 + rgbEnd[1] * w1), parseInt(rgbBegin[2] * w2 + rgbEnd[2] * w1)];
	return "#" + ColorToHex(rgb[0]) + ColorToHex(rgb[1]) + ColorToHex(rgb[2]);
};

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

window.determineCatEyeStages = function () {
	/* to change the amount of changes, you only need to change the stages variable.
	same for targetColours */
	const green = "#36f029";
	const yellow = "#fbff26";
	const blue = "#26ccff";
	const orange = "#f59b25";

	const stages = 4; // amount of stages we'll have before reaching final colour
	const totalPercentage = 0.5 + Math.random() / 4; // 50%-75%
	/* How much of targetColour the current eye colour needs to adapt into.
	0.0 to 1.0 (0%-100%) */
	const baseColour = [setup.colours.eyes_map[V.leftEyeColour].canvasfilter.blend, setup.colours.eyes_map[V.rightEyeColour].canvasfilter.blend]; // base eye colours [left, right]

	let targetColours = shuffleArray([green, yellow, blue, orange]); // can add or edit colours
	/* We've already shuffled these so they're already random */
	targetColours.splice(-2); /* keep the last 2 */

	/* The right eye is the one we see the most.
	   If this eye is light blue and the target colour is blue, the player
	   might not notice a difference.  So, swap the two eyes */
	if (V.rightEyeColour === "light blue" && targetColours[1] === blue) targetColours = [targetColours[1], targetColours[0]];
	for (let index = 1; index <= stages; index++) {
		const eyesResult = {
			left: eyeColourGradient(baseColour[0], targetColours[0], (totalPercentage / stages) * index), // left eye
			right: eyeColourGradient(baseColour[1], targetColours[1], (totalPercentage / stages) * index), // right eye
		};
		/* i goes between "left" and "right" here with these keys */
		for (const i in eyesResult) {
			const colourName = window.colorNamer(eyesResult[i]);
			const colourObject = {
				variable: "cat_tf_stage_" + (index - 1) + "_" + i,
				name: window.colorNameTranslate(colourName, "spaced name"),
				name_cap: window.colorNameTranslate(colourName, "spaced name").toUpperFirst(),
				csstext: colourName,
				natural: true,
				lens: false,
				canvasfilter: {
					blend: eyesResult[i],
					brightness: 0.27,
				},
			};
			for (const x in V.custom_eyecolours) {
				/* create new object for our new colour eye */
				/* again, 'i' is either "left" or "right" here */
				/* and x is actually a string */
				if (V.custom_eyecolours[x].variable === "cat_tf_stage_" + (index - 1) + "_" + i) V.custom_eyecolours[x] = colourObject;
				else if (x === (V.custom_eyecolours.length - 1).toString()) V.custom_eyecolours.push(colourObject);
			}
			if (V.custom_eyecolours.length === 0) V.custom_eyecolours.push(colourObject);
		}
	}
	initCustomLenses(); // sync new eye colours
};

window.defineCustomEyeColourStyle = function () {
	const normalEyes = { left: V.leftEyeColour, right: V.rightEyeColour };
	for (const side of ["left", "right"]) {
		/* This code constructs _custom_eyelenses_left_style / right_style */
		const varSideStyle = "custom_eyelenses_" + side + "_style";

		if (V.makeup.eyelenses[side] !== 0) {
			/* custom eyes colours */
			const colourArray = V.makeup.eyelenses[side].includes("colorWheelTemporary") ? setup.colours.eyes : V.custom_eyecolours;
			for (const colour of colourArray) {
				/* this does this for left and right */
				if (colour.variable === V.makeup.eyelenses[side])
					T[varSideStyle] =
						"filter: " +
						(V.makeup.eyelenses[side].includes("colorWheelTemporary")
							? window.colorNameTranslate(colour.csstext, "hue")
							: window.colorNameTranslate(V.makeup.eyelenses[side], "hue"));
			}
		} else if (normalEyes[side] !== 0 && (normalEyes[side].includes("colorWheelTemporary") || normalEyes[side].includes("cat_tf_stage"))) {
			// normal eyes colours
			const colourArray = normalEyes[side].includes("cat_tf_stage") ? V.custom_eyecolours : setup.colours.eyes;
			for (const colour of colourArray) {
				/* this does this for left and right */
				if (colour.variable === normalEyes[side]) T[varSideStyle] = "filter: " + window.colorNameTranslate(colour.csstext, "hue");
			}
		}
	}
};
