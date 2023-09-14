/* eslint-disable no-new */
/* eslint-disable jsdoc/require-description-complete-sentence */
/* eslint-disable no-undef */
function setfemininitymultiplierfromgender(gender) {
	if (gender === "f") {
		T.femininity_multiplier = 1;
	} else if (gender === "m") {
		T.femininity_multiplier = -1;
	} else {
		T.femininity_multiplier = 0;
	}
}
DefineMacro("setfemininitymultiplierfromgender", setfemininitymultiplierfromgender);

function addfemininityfromfactor(femininityBoost, factorDescription, noOverwearCheck) {
	if (noOverwearCheck) {
		T.gender_appearance_factors_noow.push({
			femininity: femininityBoost,
			factor: factorDescription,
		});
		T.apparent_femininity_noow += femininityBoost;
	} else {
		T.apparent_femininity += femininityBoost;
		T.gender_appearance_factors.push({
			femininity: femininityBoost,
			factor: factorDescription,
		});
	}
}
DefineMacro("addfemininityfromfactor", addfemininityfromfactor);

function addfemininityofclothingarticle(slot, clothingArticle, noOverwearCheck) {
	if (setup.clothes[slot][clothesIndex(slot, clothingArticle)].femininity) {
		addfemininityfromfactor(
			setup.clothes[slot][clothesIndex(slot, clothingArticle)].femininity,
			setup.clothes[slot][clothesIndex(slot, clothingArticle)].cn_name_cap,
			noOverwearCheck
		);
	}
}
DefineMacro("addfemininityofclothingarticle", addfemininityofclothingarticle);

const hairStyleCap = {
	hairtype: {
		"flat ponytail": 300,
		messy: 200,
		pigtails: 300,
		ponytail: 300,
		short: 100,
	},
	fringetype: {
		default: 100,
		"thin flaps": 300,
		"wide flaps": 300,
		hime: 300,
		loose: 300,
		messy: 200,
		overgrown: 200,
		ringlets: 300,
		split: 300,
		straight: 300,
		"swept left": 200,
		back: 100,
		parted: 100,
		flat: 100,
		quiff: 100,
		"straight curl": 200,
		"ringlet curl": 300,
		curtain: 200,
		trident: 200,
	},
};

window.calculatePenisBulge = () => {
	if (V.worn.under_lower.type.includes("strap-on")) return (V.worn.under_lower.size || 0) * 3;
	const compressed = V.player.penisExist && V.worn.genitals.type.includes("hidden");
	if (!V.player.penisExist || compressed) return 0;

	if (V.worn.genitals.type.includes("cage")) {
		return Math.clamp(V.player.penissize, 0, Infinity);
	}
	// Mentioned in combat about npcs `trying to force an erection`, when below the specific arousal checks
	if ((V.arousal > 9000 && V.player.penissize === -1) || (V.arousal > 9500 && V.player.penissize === -2)) return 1;

	let erectionState = 1;
	if (V.arousal >= 8000) {
		erectionState = 3;
	} else if (V.arousal >= 6000) {
		erectionState = 2;
	}
	return Math.clamp((V.player.penissize + 1) * erectionState, 0, Infinity);
};

/** Calculate the player's gender appearance */
function genderappearancecheck() {
	/* Calculate bulge size */
	T.bulge_size = calculatePenisBulge();
	/* T.penis_compressed = V.player.penisExist && V.worn.genitals.type.includes("hidden");
	if (V.worn.genitals.type.includes("cage")) {
		T.bulge_size = Math.clamp(V.player.penissize, 0, Infinity);
	} else {
		if (!V.player.penisExist) {
			T.erection_state = 0;
		} else if (T.penis_compressed) {
			T.erection_state = 0;
		} else if (V.arousal < 6000) {
			T.erection_state = 0;
		} else if (V.arousal < 8000) {
			T.erection_state = 1;
		} else {
			T.erection_state = 2;
		}
		T.bulge_size = Math.clamp(V.player.penissize * T.erection_state, 0, Infinity);
	} */
	/* Determine how visible the player's bottom is */
	if (
		(setup.clothes.lower[clothesIndex("lower", V.worn.lower)].skirt === 1 && V.worn.lower.skirt_down === 1 && V.worn.lower.state === "waist") ||
		(setup.clothes.over_lower[clothesIndex("over_lower", V.worn.over_lower)].skirt === 1 &&
			V.worn.over_lower.skirt_down === 1 &&
			V.worn.over_lower.state === "waist")
	) {
		T.bottom_visibility = 0;
	} else {
		T.bottom_visibility = 1;
	}
	/* Gender appearance factors */
	T.gender_appearance_factors = [];
	T.apparent_femininity = 0;
	T.breast_indicator = 0;
	/* Head clothing */
	addfemininityofclothingarticle("over_head", V.worn.over_head);
	addfemininityofclothingarticle("head", V.worn.head);
	/* Always visible clothing */
	addfemininityofclothingarticle("face", V.worn.face);
	addfemininityofclothingarticle("neck", V.worn.neck);
	addfemininityofclothingarticle("legs", V.worn.legs);
	addfemininityofclothingarticle("feet", V.worn.feet);
	/* Hair length */
	if (V.worn.over_head.hood !== 1 && V.worn.head.hood !== 1) {
		let lengthCap;
		/* Set Hair Style cap */
		if (hairStyleCap.hairtype[V.hairtype] && hairStyleCap.fringetype[V.fringetype]) {
			lengthCap = Math.max(hairStyleCap.hairtype[V.hairtype], hairStyleCap.fringetype[V.fringetype]);
		}
		const femininityfactor = Math.trunc((V.hairlength - 200) / 2);
		if (lengthCap && femininityfactor >= lengthCap) {
			addfemininityfromfactor(lengthCap, "头发长度 (因发型而有上限)");
		} else {
			addfemininityfromfactor(femininityfactor, "头发长度");
		}
	}
	/* Makeup */
	addfemininityfromfactor(V.makeup.lipstick ? 50 : 0, "口红");
	addfemininityfromfactor(V.makeup.eyeshadow ? 50 : 0, "眼影");
	addfemininityfromfactor(V.makeup.mascara ? 50 : 0, "睫毛膏");
	/* Body structure */
	setfemininitymultiplierfromgender(V.player.gender_body);
	addfemininityfromfactor(T.femininity_multiplier * 200, "自然特征");
	addfemininityfromfactor(Math.trunc(((V.physique + V.physiquesize / 2) / V.physiquesize) * -100), "肌肉发达");
	/* Behaviour */
	setfemininitymultiplierfromgender(V.player.gender_posture);
	T.acting_multiplier = V.englishtrait + 1;
	addfemininityfromfactor(T.femininity_multiplier * 100 * T.acting_multiplier, "姿势(x" + T.acting_multiplier + "因英语技能而产生的效果)");
	/* Special handling for calculating topless gender */
	T.over_lower_protected = V.worn.over_lower.exposed < 2;
	T.lower_protected = V.worn.lower.exposed < 2;
	T.under_lower_protected = !V.worn.under_lower.exposed;
	T.apparent_femininity_noow = T.apparent_femininity;
	T.gender_appearance_factors_noow = clone(T.gender_appearance_factors);
	T.over_lower_femininity = setup.clothes.over_lower[clothesIndex("over_lower", V.worn.over_lower)].femininity
		? setup.clothes.over_lower[clothesIndex("over_lower", V.worn.over_lower)].femininity
		: 0;
	T.lower_femininity = setup.clothes.lower[clothesIndex("lower", V.worn.lower)].femininity
		? setup.clothes.lower[clothesIndex("lower", V.worn.lower)].femininity
		: 0;
	T.under_lower_femininity = setup.clothes.under_lower[clothesIndex("under_lower", V.worn.under_lower)].femininity
		? setup.clothes.under_lower[clothesIndex("under_lower", V.worn.under_lower)].femininity
		: 0;
	/* find maximum possible femininity of the last lower piece you can strip down to, and add it to the counter */
	addfemininityfromfactor(Math.max(T.over_lower_femininity, T.lower_femininity, T.under_lower_femininity), "下装", "noow");
	/* bulge and genitals checks for topless gender */
	if (T.under_lower_protected && V.NudeGenderDC > 0) {
		addfemininityfromfactor(T.bulge_size * -60, "隔着内裤也能看到鼓起", "noow");
	} else if ((T.over_lower_protected || T.lower_protected) && V.NudeGenderDC > 0) {
		addfemininityfromfactor(Math.clamp((T.bulge_size - 6) * -60, 0, Infinity), "隔着衣服也能看到鼓起", "noow");
	} else if (V.worn.genitals.exposed && V.NudeGenderDC === 1) {
		if (V.player.penisExist) {
			addfemininityfromfactor((V.player.penissize + 2.5) * -150, "肉棒外露", "noow");
		}
		if (V.player.vaginaExist) {
			addfemininityfromfactor(450, "小穴外露", "noow");
		}
	} else if (V.worn.genitals.exposed && V.NudeGenderDC === 2) {
		addfemininityfromfactor(V.player.vaginaExist * 100000 - V.player.penisExist * 100000, "生殖器外露", "noow");
	}
	/* plain breasts factor */
	addfemininityfromfactor((V.player.perceived_breastsize - 0.5) * 100, "裸露的乳房", "noow");
	/* Lower clothing, bulge, and genitals */
	addfemininityofclothingarticle("over_lower", V.worn.over_lower);
	if (!T.over_lower_protected) {
		addfemininityofclothingarticle("lower", V.worn.lower);
	}
	if (!T.over_lower_protected && !T.lower_protected) {
		/* Lower underwear is visible */
		addfemininityofclothingarticle("under_lower", V.worn.under_lower);
		if (!T.under_lower_protected) {
			/* Genitals slot is visible */
			addfemininityofclothingarticle("genitals", V.worn.genitals);
			if (V.worn.genitals.exposed) {
				/* Bare genitals are visible */
				if (V.NudeGenderDC === 1) {
					if (V.player.penisExist) {
						addfemininityfromfactor((-V.player.penissize - 2.5) * 150, "肉棒可见");
					}
					if (V.player.vaginaExist) {
						addfemininityfromfactor(450, "小穴可见");
					}
				} else if (V.NudeGenderDC === 2) {
					if (V.player.penisExist) {
						addfemininityfromfactor(-100000, "肉棒可见");
					}
					if (V.player.vaginaExist) {
						addfemininityfromfactor(100000, "小穴可见");
					}
				}
			}
		} else {
			/* Bottom visible through underwear */
			T.bottom_visibility *= 0.75;
			/* Bulge visible through underwear */
			if (V.NudeGenderDC > 0) {
				addfemininityfromfactor(T.bulge_size * -60, "隔着内裤也能看到鼓起");
			}
		}
	} else {
		/* Bottom covered by lower clothes */
		T.bottom_visibility *= 0.75;
		/* Bulge covered by lower clothes */
		if (V.NudeGenderDC > 0) {
			addfemininityfromfactor(-Math.clamp((T.bulge_size - 6) * 60, 0, Infinity), "隔着衣服也能看到鼓起");
		}
	}
	/* Upper clothing and breasts */
	addfemininityofclothingarticle("over_upper", V.worn.over_upper);
	if (V.worn.over_upper.exposed >= 2) {
		addfemininityofclothingarticle("upper", V.worn.upper);
	}
	if (V.worn.over_upper.exposed >= 2 && V.worn.upper.exposed >= 2) {
		/* Upper underwear is visible */
		addfemininityofclothingarticle("under_upper", V.worn.under_upper);
		if (V.worn.under_upper.exposed >= 1) {
			/* Exposed breasts */
			T.breast_indicator = 1;
			addfemininityfromfactor((V.player.perceived_breastsize - 0.5) * 100, "裸露的乳房");
		} else {
			/* Breasts covered by only underwear */
			addfemininityfromfactor(Math.clamp((V.player.perceived_breastsize - 2) * 100, 0, Infinity), "隔着内衣也能看到胸部大小");
		}
	} else {
		/* Breast fully covered */
		addfemininityfromfactor(Math.clamp((V.player.perceived_breastsize - 4) * 100, 0, Infinity), "隔着衣服也能看到乳房大小");
	}
	/* Bottom */
	addfemininityfromfactor(Math.trunc(V.player.bottomsize * T.bottom_visibility * 50), "臀部(" + Math.trunc(T.bottom_visibility * 100) + "%的可见率)");
	/* Pregnant Belly */
	if (V.sexStats === undefined || !playerBellyVisible()) {
		// do glorious nothing
	} else if (playerBellySize() >= 18) {
		addfemininityfromfactor(Math.clamp(10000, 0, Infinity), playerAwareTheyArePregnant() ? "孕肚" : "看起来像怀孕的肚子");
	} else if (playerBellySize() >= 8) {
		addfemininityfromfactor(
			Math.clamp((playerBellySize() - 7) * 250, 0, Infinity),
			playerAwareTheyArePregnant() ? "孕肚" : "起来像怀孕的肚子"
		);
	}
	/* Body writing */
	bodywritingExposureCheck(true);
	T.skinValue = 0;
	T.skinValue_noow = 0;
	Object.keys(V.skin).forEach(label => {
		const value = V.skin[label];
		if (T.skin_array.includes(label)) {
			if (value.gender === "m") {
				T.skinValue -= 50 * (value.pen !== "pen" ? 2 : 1);
			} else if (value.gender === "f") {
				T.skinValue += 50 * (value.pen !== "pen" ? 2 : 1);
			}
		} else {
			if (value.gender === "m") {
				T.skinValue_noow -= 50 * (value.pen !== "pen" ? 2 : 1);
			} else if (V.skin.breasts.gender === "f") {
				T.skinValue_noow += 50 * (value.pen !== "pen" ? 2 : 1);
			}
		}
	});
	addfemininityfromfactor(T.skinValue, "明显的身体涂鸦");
	addfemininityfromfactor(T.skinValue + T.skinValue_noow, "可见的身体涂鸦", "noow");
	if (T.apparent_femininity > 0) {
		T.gender_appearance = "f";
	} else if (T.apparent_femininity < 0) {
		T.gender_appearance = "m";
	} else if (V.player.gender === "h") {
		// if herm pc and perfect 0 apparent_femininity
		T.gender_appearance = genderAppearanceHermTiebreak();
	} else {
		T.gender_appearance = V.player.gender;
	}
	if (T.apparent_femininity_noow > 0) {
		T.gender_appearance_noow = "f";
	} else if (T.apparent_femininity_noow < 0) {
		T.gender_appearance_noow = "m";
	} else if (V.player.gender === "h") {
		T.gender_appearance_noow = genderAppearanceHermTiebreak();
	} else {
		T.gender_appearance_noow = V.player.gender;
	}
}

function genderAppearanceHermTiebreak() {
	// Reminder: this is only if the player has an *exactly* 0 femininity score. This should be nearly impossible to reach, but we still need to handle it.

	// The general principle here is that these factors are things that indicate which gender is the player's preference for this character.
	// We rely on as many manually-chosen details as possible to break the tie in a way that favours the player's preference.

	if (["m", "f"].includes(V.player.gender_body)) {
		return V.player.gender_body; // break the tie with natural features, if player has masculine or feminine features.
	} else if (["m", "f"].includes(V.player.gender_posture)) {
		return V.player.gender_posture; // break the tie with gender posture, if gender posture is "m" or "f"
	} else {
		return "f"; // you've done it. you've broken me. default to "f".
	}
}

function apparentbreastsizecheck() {
	T.tempbreast = V.player.breastsize;
	if (clothingData("upper", V.worn.upper, "bustresize") != null) {
		T.tempbreast += clothingData("upper", V.worn.upper, "bustresize");
	}
	if (clothingData("under_upper", V.worn.under_upper, "bustresize") != null) {
		T.tempbreast += clothingData("under_upper", V.worn.under_upper, "bustresize");
	}
	if (clothingData("over_upper", V.worn.over_upper, "bustresize") != null) {
		T.tempbreast += clothingData("over_upper", V.worn.over_upper, "bustresize");
	}
	V.player.perceived_breastsize = Math.clamp(V.breastsizemin, T.tempbreast, V.breastsizemax);
}

function apparentbottomsizecheck() {
	T.tempbutt = V.player.bottomsize;
	if (V.worn.lower.rearresize != null) {
		T.tempbutt += V.worn.lower.rearresize;
	}
	if (V.worn.under_lower.rearresize != null) {
		T.tempbutt += V.worn.under_lower.rearresize;
	}
	if (V.worn.lower.rearresize != null) {
		T.tempbutt += V.worn.over_lower.rearresize;
	}
	V.player.perceived_bottomsize = Math.clamp(V.bottomsizemin, T.tempbutt, V.bottomsizemax);
}

function exposedcheck(alwaysRun) {
	if (!V.combat || alwaysRun) {
		apparentbreastsizecheck();
		apparentbottomsizecheck();
		genderappearancecheck();

		V.player.gender_appearance = T.gender_appearance;
		T.gender_appearance_factors.sort((a, b) => a.femininity > b.femininity);
		V.player.gender_appearance_factors = T.gender_appearance_factors;
		V.player.femininity = T.apparent_femininity;

		V.player.gender_appearance_without_overwear = T.gender_appearance_noow;
		T.gender_appearance_factors_noow.sort((a, b) => a.femininity > b.femininity);
		V.player.gender_appearance_without_overwear_factors = T.gender_appearance_factors_noow;
		V.player.femininity_without_overwear = T.apparent_femininity_noow;

		V.breastindicator = T.breast_indicator;
	}
}
DefineMacro("exposedcheck", exposedcheck);

/* Checks if bodywriting or tattoos are visible to NPCs. */
function bodywritingExposureCheck(overwrite, skipRng) {
	if (!T.skin_array || overwrite) {
		T.visible_areas = ["forehead"];
		T.bodywriting_exposed = 0;

		if (!V.worn.face.type.includes("mask")) T.visible_areas.push("left_cheek", "right_cheek");
		if (
			(V.worn.over_upper.exposed >= 1 || V.worn.over_upper.open === 1) &&
			(V.worn.upper.exposed >= 1 || V.worn.upper.open === 1) &&
			(V.worn.under_upper.exposed >= 1 || V.worn.under_upper.open === 1)
		) {
			T.visible_areas.push("left_shoulder", "right_shoulder");
		}
		if (V.worn.over_upper.exposed >= 1 && V.worn.upper.exposed >= 1 && V.worn.under_upper.exposed >= 1) {
			T.visible_areas.push("breasts");
		}
		if (
			(V.worn.over_upper.exposed >= 1 || V.worn.over_upper.state !== "waist") &&
			(V.worn.upper.exposed >= 1 || V.worn.upper.state !== "waist") &&
			(V.worn.under_upper.exposed >= 1 || V.worn.under_upper.state !== "waist")
		) {
			T.visible_areas.push("back");
		}
		if (
			(V.worn.over_lower.exposed >= 1 || V.worn.over_lower.anus_exposed >= 1) &&
			(V.worn.lower.exposed >= 1 || V.worn.lower.anus_exposed >= 1) &&
			(V.worn.under_lower.exposed >= 1 || !V.worn.under_lower.type.includes("athletic"))
		) {
			T.visible_areas.push("left_bottom", "right_bottom");
		}
		if (V.worn.over_lower.exposed >= 1 && V.worn.lower.exposed >= 1 && (V.worn.under_lower.exposed >= 1 || !V.worn.under_lower.type.includes("athletic"))) {
			T.visible_areas.push("pubic");
		}
		if (V.worn.over_lower.vagina_exposed >= 1 && V.worn.lower.vagina_exposed >= 1 && !V.worn.under_lower.type.includes("athletic")) {
			T.visible_areas.push("left_thigh", "right_thigh");
		}

		// second: filter out every area where there is no writing and store it in _skin_array
		T.skin_array = T.visible_areas.filter(loc => V.skin[loc].writing);

		// third: make an array of all the special properties of the visible bodywriting
		T.skin_array_special = T.skin_array.map(loc => V.skin[loc].special);

		if (T.skin_array.length >= 1) T.bodywriting_exposed = 1;
	}
	if (!skipRng) T.bodypart = T.skin_array.random();
}
DefineMacro("bodywritingExposureCheck", bodywritingExposureCheck);

/**
 * Jimmy: A potential improvement is to not wikify the hints that are appended to the ends of the links,
 *         I chose to keep this format for now to keep <<promiscuous>>, <<exhibitionist>> and <<deviant>> centralised.
 * 		   If someone wants to change those widgets, this won't need updating.
 */
Macro.add("reqSkill", {
	tags: ["reqE", "reqElse"],
	reqs: [0, 1, 15, 35, 55, 75, 95],
	handler() {
		/* The function below (some) will immediately end and not iterate further if TRUE is returned, it will continue to iterate if FALSE is returned. */
		this.payload.some(section => {
			if (section.args.length === 0) {
				/* If <<reqSkill>> has no arguments, report an error.
				   However, if <<reqElse>> had none, print out the section as normal, no need to add skill hints to the links. */
				if (section.name === "reqSkill") {
					throwError(this.output, `Missing arguments for <<${section.name}>>`, `${this.source}`, exportable);
				} else {
					new Wikifier(this.output, section.contents);
				}
				return true;
			}
			/* Output variable to store what will be appended to EVERY link in the section. */
			let output = "";
			const cancel = section.args.some(arg => {
				/* Splits up the arguments so that everything but the last character goes into type, and the last character goes into tier.
				   If arg is "deviancy5", type would be "deviancy" and tier would be 5. */
				const type = arg.slice(0, -1);
				const tier = Number.parseInt(arg.slice(-1));
				/* Check if parseInt returned an actual number, and not NaN. */
				if (!Number.isInteger(tier)) {
					throwError(this.output, `Invalid argument (${arg}) for <<${section.name}>> | Tier`, `${this.source}`, exportable);
					return true;
				}
				switch (type) {
					case "promiscuity":
					case "p":
						if (V.promiscuity < this.self.reqs[tier]) return true;
						output += `<<promiscuous${tier}>>`;
						return false;
					case "exhibitionism":
					case "e":
						if (V.exhibitionism < this.self.reqs[tier]) return true;
						output += `<<exhibitionist${tier}>>`;
						return false;
					case "deviancy":
					case "d":
						if (V.deviancy < this.self.reqs[tier]) return true;
						output += `<<deviant${tier}>>`;
						return false;
					default:
						throwError(this.output, `Invalid argument (${arg}) for <<${section.name}>> | Type`, `${this.source}`, exportable);
						return true;
				}
			});
			/* If cancel signals true, exit but continue next payloads. */
			if (cancel) return false;
			/* Final render, and insertion of elements.
			   Renders the section defined within the block that was successful. */
			new Wikifier(this.output, section.contents);
			/* Renders the HTML elements that are inserted after every link. */
			const wikiOutput = new Wikifier(null, output);
			/* Scan through macro outfit for valid links to append hints to. */
			jQuery(this.output).children().filter("a.link-internal, a.link-external").after(wikiOutput.output);
			/* Successful render, no need to process anymore segments. */
			return true;
		});
	},
});

/**
 * Turns an array into a formatted list for printing.
 *
 * @param {any[]} arr An Array, ie ["a","b","c","d"]
 * @param {string} conjunction ("and") - A conjunction for the formatted list
 * @param {boolean} useOxfordComma (false) - A boolean deciding whether to prepend a separator before conjunction
 * @param {string} separator (", ") - A separator between elements of the formatted list
 * @returns {string} A formatted list, ie "a, b, c and d"
 */
function formatList(arr, conjunction = "and", useOxfordComma = false, separator = ", ") {
	if (!(Array.isArray(arr) && arr.length > 0)) {
		Errors.report("Error in formatList: Missing or invalid array argument", { Stacktrace: Utils.GetStack(), arguments });
		return "";
	}
	/*
	conjunction += " ";
	if (arr.length <= 2) return arr.join(" " + conjunction);
	const oxConj = (useOxfordComma ? separator : " ") + conjunction;
	return arr.slice(0,-1).join(separator) + oxConj + arr.at(-1);
	*/
	return arr.formatList({ conjunction, useOxfordComma, separator });
}
window.formatList = formatList;
DefineMacroS("formatList", formatList);
