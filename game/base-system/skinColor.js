function skinColorInit() {
	if (V.skinColor !== undefined) {
		T.natural = V.skinColor.natural;
		T.init = V.skinColor.init;
	} else {
		T.natural = "light";
		T.init = false;
		T.tanning = false;
		T.enable = "f";
	}

	V.skinColor = {
		natural: T.natural,
		init: T.init,
		range: 0,
		current: {
			test: "",
			body: "",
			breasts: "",
			penis: "",
			swimshorts: "",
			swimsuitTop: "",
			swimsuitBottom: "",
			bikiniTop: "",
			bikiniBottom: "",
			tshirt: "",
			mouth: "",
		},
		tanValues: [0, 0, 0, 0, 0, 0, 0, 0, 0],
		overwriteEnable: false,
		sunBlock: false,
		overwrite: null,
		overwriteValues: {
			hStart: 45,
			hEnd: 45,
			sStart: 0.2,
			sEnd: 0.4,
			bStart: 4.5,
			bEnd: 0.7,
		},
	};

	V.objectVersion.skinColor = 1;
}
DefineMacro("skinColorInit", skinColorInit);

function skinColorInitOldSave() {
	V.skinColor = {
		natural: null,
		init: false,
		range: 0,
		current: {
			test: "",
			body: "",
			breasts: "",
			penis: "",
			swimshorts: "",
			swimsuitTop: "",
			swimsuitBottom: "",
			bikiniTop: "",
			bikiniBottom: "",
			tshirt: "",
			mouth: "",
		},
		tanValues: [0, 0, 0, 0, 0, 0, 0, 0, 0],
		overwriteEnable: false,
		sunBlock: false,
		overwrite: null,
		overwriteValues: {
			hStart: 45,
			hEnd: 45,
			sStart: 0.2,
			sEnd: 0.4,
			bStart: 4.5,
			bEnd: 0.7,
		},
	};
	V.objectVersion.skinColor = 1;
}
DefineMacro("skinColorInitOldSave", skinColorInitOldSave);

function setSkinColorBase() {
	if (V.skinColor === undefined) return;

	if (V.skinColor.overwriteEnable === false) {
		V.skinColor.overwrite = setup.skinColor[V.skinColor.natural];
	} else {
		V.skinColor.overwrite = V.skinColor.overwriteValues;
	}
	if (V.skinColor.init === false) {
		V.skinColor.init = true;
		V.skinColor.tanValues = [];

		for (let i = 0; i < setup.skinColor.tanLoc.length; i++) {
			V.skinColor.tanValues.push(V.skinColor.range);
			V.skinColor.current[setup.skinColor.tanLoc[i]] = skinColor(V.options.tanImgEnabled, V.skinColor.range, V.skinColor.overwrite);
		}
		V.skinColor.current.mouth = skinColor(V.options.tanImgEnabled, V.skinColor.range, V.skinColor.overwrite);
	}
}
DefineMacro("setSkinColorBase", setSkinColorBase);

function skinColor(enabled, percent, overwrite) {
	if (enabled === false) return "";

	const defaultSkinColorRanges = {
		hStart: 45,
		hEnd: 45,
		sStart: 0.2,
		sEnd: 0.4,
		bStart: 4.5,
		bEnd: 0.7,
	};

	const ranges = window.ensureIsArray(overwrite || defaultSkinColorRanges);

	const totalProgress = percent / 100;

	const scaledProgress = ranges.length * totalProgress;
	const rangeIndex = totalProgress === 1 ? ranges.length - 1 : Math.floor(scaledProgress);
	const progress = totalProgress === 1 ? 1 : scaledProgress - rangeIndex;

	const { hStart, hEnd, sStart, sEnd, bStart, bEnd } = ranges[rangeIndex];

	const hue = (hEnd - hStart) * progress + hStart;
	const saturation = (sEnd - sStart) * progress + sStart;
	const brightness = (bEnd - bStart) * progress + bStart;

	const hueCss = `hue-rotate(${hue}deg)`;
	const saturationCss = `saturate(${saturation.toFixed(2)})`;
	const brightnessCss = `brightness(${brightness.toFixed(2)})`;

	return `${hueCss} ${saturationCss} ${brightnessCss}`;
}
window.skinColor = skinColor;

function tannedCoverage() {
	const clothesList = [];
	window.getVisibleClothesList().forEach(i => clothesList.push(i.name));

	if (clothesList.includes("bikini top")) {
		T.coverage[setup.skinColor.tanLoc.indexOf("bikiniTop")] = 1;
		T.coverage[setup.skinColor.tanLoc.indexOf("breasts")] = 1;
	} else if (clothesList.includesAny(["school swimsuit", "foreign school swimsuit"])) {
		T.coverage[setup.skinColor.tanLoc.indexOf("bikiniTop")] = 1;
		T.coverage[setup.skinColor.tanLoc.indexOf("swimsuitTop")] = 1;
		T.coverage[setup.skinColor.tanLoc.indexOf("breasts")] = 1;
	}

	if (clothesList.includesAny("bikini bottoms", "school swimsuit bottom", "foreign school swimsuit bottom")) {
		T.coverage[setup.skinColor.tanLoc.indexOf("bikiniBottom")] = 1;
		T.coverage[setup.skinColor.tanLoc.indexOf("swimsuitBottom")] = 1;
		T.coverage[setup.skinColor.tanLoc.indexOf("penis")] = 1;
	} else if (clothesList.includes("school swim shorts")) {
		T.coverage[setup.skinColor.tanLoc.indexOf("bikiniBottom")] = 1;
		T.coverage[setup.skinColor.tanLoc.indexOf("swimshortsBottom")] = 1;
		T.coverage[setup.skinColor.tanLoc.indexOf("penis")] = 1;
	}
}

function tanned(amount, flag) {
	if (V.options.tanningEnabled === true) {
		T.coverage = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		if (flag === "ignoreCoverage") {
			T.coverage = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		} else if (flag === "tanLines") {
			tannedCoverage();
		}
		if (V.skinColor.sunBlock === true && amount > 0) {
			T.tanChange = 0;
		} else {
			T.tanChange = amount / 24;
		}

		for (let i = 0; i < setup.skinColor.tanLoc.length; i++) {
			if (T.coverage[i] === 0) {
				T.tanLoc = setup.skinColor.tanLoc[i];
				V.skinColor.tanValues[i] = Math.clamp((V.skinColor.tanValues[i] + T.tanChange).toFixed(1), 0, 100);
				V.skinColor.current[T.tanLoc] = skinColor(V.options.tanImgEnabled, V.skinColor.tanValues[i], V.skinColor.overwrite);
			}
		}
		V.skinColor.current.mouth = skinColor(V.options.tanImgEnabled, V.skinColor.tanValues[0], V.skinColor.overwrite);
		return;
	}
	if (!V.options.tanImgEnabled) {
		V.skinColor.current = {
			test: "",
			body: "",
			breasts: "",
			penis: "",
			swimshorts: "",
			swimsuitTop: "",
			swimsuitBottom: "",
			bikiniTop: "",
			bikiniBottom: "",
			tshirt: "",
			mouth: "",
		};
	}
	if (V.options.tanImgEnabled) {
		for (let s = 0; s < setup.skinColor.tanLoc.length; s++) {
			V.skinColor.current[setup.skinColor.tanLoc[s]] = skinColor(V.options.tanImgEnabled, V.skinColor.tanValues[s], V.skinColor.overwrite);
		}
		V.skinColor.current.mouth = skinColor(V.options.tanImgEnabled, V.skinColor.tanValues[0], V.skinColor.overwrite);
	}
}
DefineMacro("tanned", tanned);
window.tanned = tanned;
