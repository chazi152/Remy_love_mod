/**
 * Example model, a 'xray-vaginal' and small part of 'close-vaginal' slots of sex animation.
 * See game/03-JavaScript/canvasmodel.js for API reference
 * and canvasmodel-example.twee for test passage (accessible in Debug/Main menu).
 */
Renderer.CanvasModels.sexdemo = {
	name: "sexdemo", // For debugging

	width: 768,
	height: 256,

	frames: 8, // For CSS animation only. JS animations can have as many frames as needed

	/**
	 * List of names of generated options, for debugging & tooling.
	 */
	generatedOptions() {
		return [];
	},

	/**
	 * Default option values.
	 * All possible options should be initialised to some non-crashing values here.
	 * Should also have a `filter:{}` option for model filters.
	 */
	defaultOptions() {
		return {
			/**
			 * Global animation speed, "" (no animation) | "slow" | "mid" | "fast" | "vfast".
			 */
			animation_speed: "",
			/**
			 * Sex position, "doggy" | "missionary".
			 */
			position: "doggy",
			/**
			 * PC penis type: "" (none) | "default" | "virgin".
			 */
			penis: "",
			/**
			 * PC has vagina.
			 */
			vagina: false,
			/**
			 * PC has balls.
			 */
			balls: false,
			/**
			 * Item index in setup.clothes.under_lower.
			 */
			worn_under_lower: 0,
			/**
			 * Item state, "" (none) | "totheside".
			 */
			worn_under_lower_state: "",
			/**
			 * Item colour, key in setup.colours.clothes.
			 */
			worn_under_lower_colour: "red",
			/**
			 * Show/hide xray-anal slot.
			 */
			xray_vaginal_show: false,
			/**
			 * Animation speed override, "" to use animation_speed.
			 */
			xray_vaginal_speed: "",
			/**
			 * Show/hide close-vaginal slot.
			 */
			close_vagina_show: false,
			/**
			 * Animation speed override, "" to use animation_speed.
			 */
			close_vagina_speed: "",
			/**
			 * Penetration state, "" (none) | "entrance" | "imminent" | "penetrated"
			 * NOT the equivalent of $vaginastate, tentacles share entrance/imminent/penetrated
			 * and $vaginastate="tentacledeep" should set options.vaginacumming=true.
			 */
			vagina_state: "",
			vagina_aroused: false,
			/**
			 * Penetrator type, "" (empty) | "penis" (human) | "beast" | "tentacle" | "machine".
			 */
			vagina_penetrator: "",
			/**
			 * Penetrator subtype, options depend on vagina_penetrator:
			 * - for "human": NPC skin colour
			 * - for "beast": beast type
			 * - for others: "default".
			 */
			vagina_penetrator_subtype: "default",
			/**
			 * Penetrator size.
			 */
			vagina_penetrator_size: 0,
			/**
			 * Cumming inside vagina.
			 */
			vagina_cumming: false,
			/**
			 * User-supplied filters go here; typically this is empty in default options.
			 */
			filters: {},
		};
	},

	/**
	 * This function is called before compiling layers for rendering or animation.
	 * Generated options and filters implementations go here.
	 *
	 * @param options
	 */
	preprocess(options) {
		if (!options.xray_vaginal_speed) {
			// "" means use global
			options.xray_vaginal_speed = options.animation_speed;
		}
		if (!options.close_vagina_speed) {
			// "" means use global
			options.close_vagina_speed = options.animation_speed;
		}
		if (options.worn_under_lower) {
			const record = setup.colours.clothes_map[options.worn_under_lower_colour];
			if (record) {
				options.filters.under_lower = record.canvasfilter;
			} else {
				console.error("Unknown under_lower colour " + options.worn_under_lower_colour);
				options.filters.under_lower = {};
			}
		}
		// Despite the name, filters can have any layer properties, including those affectign composition
		options.filters.close_vagina = {
			dx: 386,
			dy: 0,
			width: 64,
		};
	},

	/**
	 * The meat.
	 * Key is layer name, value is layer definition.
	 * Rendering order is guaranteed only via `z` property.
	 */
	layers: {
		xray_vaginal: {
			/**
			 * X and Y offsets.
			 */
			dx: 0,
			/**
			 * Shift down for futas.
			 *
			 * @param options
			 */
			dyfn(options) {
				return options.penis && options.vagina ? 64 : 0;
			},
			/**
			 * This option is required because layer takes small part of the resulting image.
			 * Without it, the 2048 pixel wide image would be treated as 3-frame animation (=2048/768).
			 */
			width: 256,
			/**
			 * As this layer has `showfn`, it will be displayed automatically when needed,
			 * without <<showlayer "xray_vaginal">>.
			 * You'll need <<set _modeloptions.xray_vaginal_show = true>> instead.
			 * Not much difference but it makes more sense when you toggle multiple layers with one option.
			 *
			 * @param options
			 */
			showfn(options) {
				return options.xray_vaginal_show && options.vagina_state === "penetrated";
			},
			srcfn(options) {
				const cum = options.vagina_cumming ? "cum" : "";
				switch (options.vagina_penetrator) {
					case "machine":
						return "img/sex/machine/vaginal/xray_vaginal.png";
					case "beast":
						switch (options.vagina_penetrator_subtype) {
							case "horse":
								return "img/sex/xrayvaginalhorse" + cum + ".png";
							default:
								return "img/sex/xrayvaginalbeast" + cum + ".png";
						}
					case "penis":
						switch (options.vagina_penetrator_subtype) {
							case "black":
								return "img/sex/black/xrayvaginal" + cum + ".png";
							default:
								return "img/sex/xrayvaginal" + cum + ".png";
						}
					case "tentacle":
						return "img/sex/xrayvaginaltentacle" + cum + ".png";
					default:
						/**
						 * Fallback value, nothing will be renderer.
						 */
						return "";
				}
			},
			/**
			 * Copied from z-index of #xrayvaginal.
			 */
			z: 3,
			/**
			 * Returns name of animation, or empty string if none.
			 *
			 * @param options
			 */
			animationfn(options) {
				/**
				 * We use the fact that option values and animation names are same.
				 */
				return options.xray_vaginal_speed ? "sex-8f-" + options.xray_vaginal_speed : "";
			},
		},
		/***
		 * CLOSEUPS
		 */
		close_vagina: {
			z: 250,
			showfn(options) {
				return options.close_vagina_show;
			},
			srcfn(options) {
				if (options.vagina_state === "penetrated") {
					return options.vagina_penetrator === "beast" && options.vagina_penetrator_size >= 5
						? "img/sex/close/" + options.position + "/vaginapenetratebig.png"
						: "img/sex/close/" + options.position + "/vaginapenetrate.png";
				} else {
					return options.vagina_aroused
						? "img/sex/close/" + options.position + "/vaginaaroused.png"
						: "img/sex/close/" + options.position + "/vagina.png";
				}
			},
			filters: ["close_vagina"],
			animationfn(options) {
				return "sex-6f-" + options.close_vagina_speed;
			},
		},
		close_vagina_aroused: {
			z: 251,
			showfn(options) {
				return options.close_vagina_show && options.vagina_aroused;
			},
			srcfn(options) {
				return "img/sex/close/" + options.position + "/vaginaaroused.png";
			},
			animationfn(options) {
				return "sex-6f-" + options.close_vagina_speed;
			},
		},
		/**
		 * Futa penis.
		 */
		close_vagina_penis: {
			z: 252,
			showfn(options) {
				/**
				 * Only exact 'false' would hide the layer (undefined etc won't),
				 * so cast non-boolean options to boolean via double negation.
				 */
				return options.close_vagina_show && !!options.penis;
			},
			srcfn(options) {
				return "img/sex/close/" + options.position + "/" + (options.balls ? "futavagina.png" : "futavaginanoballs.png");
			},
			filters: ["close_vagina"],
			animationfn(options) {
				return "sex-6f-" + options.close_vagina_speed;
			},
		},
		close_vagina_panties: {
			z: 253,
			showfn(options) {
				return options.close_vagina_show && !!options.worn_under_lower && options.worn_under_lower_state === "totheside";
			},
			srcfn(options) {
				return "img/sex/close/" + options.position + "/vaginatotheside.png";
			},
			/**
			 * One for dx,dy,width, other for colours.
			 */
			filters: ["close_vagina", "under_lower"],
			animationfn(options) {
				return "sex-6f-" + options.close_vagina_speed;
			},
		},
		close_vagina_penetrator: {
			z: 254,
			showfn(options) {
				return options.close_vagina_show && !!options.vagina_state && !!options.vagina_penetrator;
			},
			srcfn(options) {
				switch (options.vagina_state) {
					case "penetrated":
						switch (options.vagina_penetrator) {
							case "tentacle":
								return "img/sex/close/" + options.position + "/vaginatentaclepenetrated.png";
							case "machine":
								return "img/sex/close/machine/vaginal/" + options.position + "/penetrated_close.png";
							case "beast":
								if (options.vagina_penetrator_subtype === "horse" || options.vagina_penetrator_subtype === "centaur") {
									return "img/sex/close/horse/vaginapenetratedhorse.png";
								} else {
									return "img/sex/close/" + options.position + "/vaginapenetratedbeast.png";
								}
							default:
								return "img/sex/close/" + options.position + "/vaginapenetrated.png";
						}
					case "imminent":
					case "entrance":
						switch (options.vagina_penetrator) {
							case "tentacle":
								return "img/sex/close/" + options.position + "/vaginatentacleentrance.png";
							case "machine":
								return "img/sex/machine/vaginal/" + options.position + "/entrance_close.png";
							case "beast":
								if (options.vagina_penetrator_subtype === "horse" || options.vagina_penetrator_subtype === "centaur") {
									return "img/sex/close/horse/vaginaentrancehorse.png";
								} else {
									return "img/sex/close/" + options.position + "/vaginaentrancebeast.png";
								}
							default:
								return "img/sex/close/" + options.position + "/vaginaentrance.png";
						}
				}
			},
			filters: ["close_vagina"],
			animationfn(options) {
				return "sex-6f-" + options.close_vagina_speed;
			},
		},
	},
};

Renderer.Animations["sex-8f-slow"] = {
	frames: 8,
	duration: 330,
};
Renderer.Animations["sex-8f-mid"] = {
	frames: 8,
	duration: 170,
};
Renderer.Animations["sex-8f-fast"] = {
	frames: 8,
	duration: 110,
};
Renderer.Animations["sex-8f-vfast"] = {
	frames: 8,
	duration: 80,
};

Renderer.Animations["sex-6f-slow"] = {
	frames: 6,
	duration: 330,
};
Renderer.Animations["sex-6f-mid"] = {
	frames: 6,
	duration: 170,
};
Renderer.Animations["sex-6f-fast"] = {
	frames: 6,
	duration: 110,
};
Renderer.Animations["sex-6f-vfast"] = {
	frames: 6,
	duration: 80,
};
