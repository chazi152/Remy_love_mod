setup.colours = {
	// Canvas renderer filters applied to different sprite palettes
	sprite_prefilters: {
		grayscale: {
			// For grayscale sprites with #808080 base
			desaturate: false,
			brightness: 0.0,
			contrast: 1.0,
		},
		hair: {
			desaturate: true,
			brightness: 0.0,
			contrast: 1.0,
		},
		hair_fringe: {
			desaturate: true,
			brightness: 0.0,
			contrast: 1.0,
		},
		brows: {
			desaturate: true,
			brightness: 0.0,
			contrast: 1.0,
		},
		pbhair: {
			desaturate: true,
			brightness: 0.0,
			contrast: 1.0,
		},
		eyes: {
			desaturate: true,
			brightness: 0.0,
			contrast: 1.0,
		},
		clothes: {
			// For red-base clothes
			desaturate: true,
			brightness: 0.4,
			contrast: 1.0,
		},
		clothes_bright: {
			// For red-base clothes with brighter, hair-like palette
			desaturate: true,
			brightness: 0.0,
			contrast: 1.0,
		},
		mascara: {
			desaturate: true,
			brightness: 0.4,
			contrast: 1.0,
		},
		lipstick: {
			desaturate: true,
			brightness: 0.4,
			contrast: 1.0,
		},
		eyeshadow: {
			desaturate: true,
			brightness: 0.4,
			contrast: 1.0,
		},
		condom: {
			desaturate: true,
			brightness: 0.4,
			contrast: 1.0,
		},
	},

	// Empty collections are populated later in this file
	hair: [],
	hair_map: {}, // Maps are auto-generated in the end of file
	hair_default: {
		// Default canvas filter options
		blendMode: "hard-light",
	},
	eyes: [],
	eyes_map: {},
	eyes_default: {
		blendMode: "hard-light",
	},
	clothes: [],
	clothes_map: {},
	clothes_default: {
		blendMode: "hard-light",
	},
	mascara: [],
	mascara_map: {},
	mascara_default: {
		blendMode: "hard-light",
	},
	lipstick: [],
	lipstick_map: {},
	lipstick_default: {
		blendMode: "hard-light",
	},
	eyeshadow: [],
	eyeshadow_map: {},
	eyeshadow_default: {
		blendMode: "hard-light",
	},
	condom: [],
	condom_map: {},
	condom_default: {
		blendMode: "hard-light",
	},

	skin_gradients: {
		light: ["#ffffff", "#ffd2ac"],
		medium: ["#ffd2ac", "#8a614d"],
		dark: ["#8a614d", "#39241a"],
		gyaru: ["#ffffff", "#ffd2ac", "#8a614d", "#39241a"],
		ylight: ["#f0ffe6", "#f0e4bc"],
		ymedium: ["#f0e4bc", "#8e7f68"],
		ydark: ["#8e7f68", "#483f35"],
		ygyaru: ["#f0ffe6", "#f0e4bc", "#8e7f68", "#483f35"],
	},
	/**
	 * Get canvas filter for skin of given type and tan progression (0..1).
	 *
	 * @param {any} type
	 * @param {any} tan
	 */
	getSkinFilter(type, tan) {
		return {
			blend: setup.colours.getSkinRgb(type, tan),
			blendMode: "multiply",
		};
	},
	getSkinRgb(type, tan) {
		tan = Math.clamp(0, tan, 1);
		const gradient = setup.colours.skin_gradients[type];
		if (!gradient) {
			Errors.report("Unknown skin gradient " + type);
			return "#ffffff";
		}
		return Renderer.lintRgbStaged(tan, gradient).toHexString();
	},
	/**
	 * Get CSS style filter that, when applied, transforms #FF0000 colour to a skin colour.
	 *
	 * @param {string} type One of [ light, medium, dark, gyaru, ylight, ymedium, ydark, ygyaru ].
	 * @param {number} tan How tanned the skin is, where 0 = the lightest, 100 = full tan.
	 * @returns {string} - CSS filter value. Note: return string doesn't start with 'filter:', you have to prepend it yourself
	 * Return example: 'hue-rotate(50deg) saturate(0.40) brightness(0.60)'.
	 */
	getSkinCSSFilter(type, tan = 0) {
		const slidersValues = setup.skinColor[type];
		return skinColor(true, tan, slidersValues);
	},
};

/**
 * Hair colour record:
 * - variable:string - Value of variables
 * - name:string - Display name
 * - name_cap:string - Display name, capitalised
 * - csstext:string - CSS class added to text
 * - natural:boolean - Is option for natural hair
 * - dye:boolean - Is option for hair dyes
 * - canvasfilter:object - Canvas model filter.
 */
setup.colours.hair = [
	{
		variable: "random", // Only used at the start for a randomised colour
		name: "随机",
		name_cap: "随机",
		csstext: "Random",
		natural: true,
		dye: false,
		canvasfilter: {
			blend: "#f53d43",
		},
	},
	{
		variable: "red",
		name: "红色",
		name_cap: "红色",
		csstext: "red",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#f53d43",
		},
	},
	{
		variable: "jetblack",
		name: "乌黑色",
		name_cap: "乌黑色",
		csstext: "black",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#454545",
			brightness: -0.3,
		},
	},
	{
		variable: "black",
		name: "黑色",
		name_cap: "黑色",
		csstext: "black",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#504949",
			brightness: -0.3,
		},
	},
	{
		variable: "blond",
		name: "金色",
		name_cap: "金色",
		csstext: "gold",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#d5b43f",
		},
	},
	{
		variable: "softblond",
		name: "柔金色",
		name_cap: "柔金色",
		csstext: "softblond",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#d1b761",
		},
	},
	{
		variable: "platinumblond",
		name: "白金色",
		name_cap: "白金色",
		csstext: "platinum",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#ead27b",
		},
	},
	{
		variable: "golden",
		name: "金黄色",
		name_cap: "金黄色",
		csstext: "gold",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#ffc800",
		},
	},
	{
		variable: "ashyblond",
		name: "灰金色",
		name_cap: "灰金色",
		csstext: "ashy",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#b19981",
		},
	},
	{
		variable: "strawberryblond",
		name: "草莓金色",
		name_cap: "草莓金",
		csstext: "strawberry",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#eb9e47",
		},
	},
	{
		variable: "darkbrown",
		name: "深棕色",
		name_cap: "深棕色",
		csstext: "brown",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#784a3a",
			brightness: -0.3,
		},
	},
	{
		variable: "brown",
		name: "棕色",
		name_cap: "棕色",
		csstext: "brown",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#8f6e56",
			brightness: -0.3,
		},
	},
	{
		variable: "softbrown",
		name: "淡棕色",
		name_cap: "柔褐色",
		csstext: "softbrown",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#bf7540",
			brightness: -0.3,
		},
	},
	{
		variable: "lightbrown",
		name: "浅棕色",
		name_cap: "亮褐色",
		csstext: "lightbrown",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#e49b67",
			brightness: -0.3,
		},
	},
	{
		variable: "burntorange",
		name: "焦橙色",
		name_cap: "焦黄色",
		csstext: "burntorange",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#e08d52",
			brightness: -0.3,
		},
	},
	{
		variable: "ginger",
		name: "姜黄色",
		name_cap: "橘黄色",
		csstext: "tangerine",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#ff6a00",
		},
	},
	{
		variable: "bloodorange",
		name: "血橙色",
		name_cap: "血橙色",
		csstext: "bloodorange",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#ff4000",
		},
	},
	{
		variable: "blue",
		name: "蓝色",
		name_cap: "蓝色",
		csstext: "bluehair",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#3973ac",
			brightness: -0.3,
		},
	},
	{
		variable: "deepblue",
		name: "深蓝色",
		name_cap: "深蓝色",
		csstext: "deepblue",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#1349b5",
			brightness: -0.3,
		},
	},
	{
		variable: "neonblue",
		name: "霓虹蓝色",
		name_cap: "霓虹蓝",
		csstext: "neonblue",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#00d5ff",
		},
	},
	{
		variable: "green",
		name: "绿色",
		name_cap: "绿色",
		csstext: "greenhair",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#007400",
		},
	},
	{
		variable: "darklime",
		name: "暗橙色",
		name_cap: "暗橙色",
		csstext: "darklime",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#4a8000",
		},
	},
	{
		variable: "toxicgreen",
		name: "墨绿色",
		name_cap: "荧光绿",
		csstext: "toxicgreen",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#99e600",
		},
	},
	{
		variable: "teal",
		name: "蓝绿色",
		name_cap: "蓝绿色",
		csstext: "tealhair",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#008040",
		},
	},
	{
		variable: "pink",
		name: "粉色",
		name_cap: "粉色",
		csstext: "pinkhair",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#e05281",
		},
	},
	{
		variable: "brightpink",
		name: "亮粉色",
		name_cap: "浅粉色",
		csstext: "brightpink",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#ff80aa",
		},
	},
	{
		variable: "hotpink",
		name: "亮玫瑰色",
		name_cap: "艳粉色",
		csstext: "hotpink",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#ff4dc4",
		},
	},
	{
		variable: "softpink",
		name: "浅粉色",
		name_cap: "柔粉色",
		csstext: "softpink",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#d6855c",
			brightness: 0.2,
		},
	},
	{
		variable: "crimson",
		name: "深红色",
		name_cap: "深红色",
		csstext: "crimson",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#b30000",
		},
	},
	{
		variable: "purple",
		name: "紫色",
		name_cap: "紫色",
		csstext: "purplehair",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#6a0d89",
		},
	},
	{
		variable: "mediumpurple",
		name: "中紫色",
		name_cap: "蓝紫色",
		csstext: "mediumpurple",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#5113df",
		},
	},
	{
		variable: "brightpurple",
		name: "浅紫色",
		name_cap: "亮紫色",
		csstext: "brightpurple",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#ab66ff",
		},
	},
	{
		variable: "white",
		name: "白色",
		name_cap: "白色",
		csstext: "whitehair",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#BBBBBB",
			brightness: 0.3,
		},
	},
	{
		variable: "snowwhite",
		name: "雪白色",
		name_cap: "雪白色",
		csstext: "snowwhitehair",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#FFFFFF",
		},
	},
];

/**
 * The records are split based on whether they are for fringe or sides,
 * then furhter based on hairstyles. Fallback entry is called 'all'.
 * Gradient hair record:
 *   gradient - canvas gradient type
 *   values - vector specifying the direction of the gradient
 *   lengthFunctions - functions specifying how the stops should move according to the hair length
 *   colors - pairs of stops and colors (colors will be replaced in renderer).
 */

setup.colours.hairgradients_prototypes = {
	fringe: {
		"high-ombre": {
			all: {
				gradient: "linear",
				values: [300, 200, 300, 0],
				lengthFunctions: [(length, value) => value, (length, value) => value],
				colors: [
					[0.6, "rgba(0, 0, 0, 1)"],
					[0.85, "rgba(0, 0, 0, 1)"],
				],
			},
		},
		"low-ombre": {
			all: {
				gradient: "linear",
				values: [300, 200, 300, 0],
				lengthFunctions: [(length, value) => value - length / 1000 / 2, (length, value) => value - length / 1000 / 2],
				colors: [
					[0.6, "rgba(0, 0, 0, 1)"],
					[0.85, "rgba(0, 0, 0, 1)"],
				],
			},
		},
		split: {
			parted: {
				gradient: "linear",
				values: [21, 255, 234, 0],
				lengthFunctions: [(length, value) => value, (length, value) => value],
				colors: [
					[0.63, "rgba(0, 0, 0, 1)"],
					[0.65, "rgba(0, 0, 0, 1)"],
				],
			},
			mohawk: {
				gradient: "radial",
				values: [93, 60, 0, 93, 60, 170],
				lengthFunctions: [(length, value) => value, (length, value) => value],
				colors: [
					[0.155, "rgba(0, 0, 0, 1)"],
					[0.16, "rgba(0, 0, 0, 1)"],
				],
			},
			overgrown: {
				gradient: "radial",
				values: [93, 60, 0, 93, 60, 200],
				lengthFunctions: [(length, value) => value, (length, value) => value],
				colors: [
					[0.155, "rgba(0, 0, 0, 1)"],
					[0.16, "rgba(0, 0, 0, 1)"],
				],
			},
			all: {
				gradient: "radial",
				values: [-40, 100, 0, -40, 100, 1070],
				lengthFunctions: [(length, value) => value, (length, value) => value],
				colors: [
					[0.155, "rgba(0, 0, 0, 1)"],
					[0.16, "rgba(0, 0, 0, 1)"],
				],
			},
		},
		"face-frame": {
			all: {
				gradient: "radial",
				values: [125, 103, 0, 125, 103, 350],
				lengthFunctions: [(length, value) => value, (length, value) => value],
				colors: [
					[0.15, "rgba(0, 0, 0, 1)"],
					[0.175, "rgba(0, 0, 0, 1)"],
				],
			},
		},
	},
	sides: {
		"high-ombre": {
			all: {
				gradient: "linear",
				values: [300, 200, 300, 0],
				lengthFunctions: [(length, value) => value, (length, value) => value],
				colors: [
					[0.6, "rgba(0, 0, 0, 1)"],
					[0.85, "rgba(0, 0, 0, 1)"],
				],
			},
		},
		"low-ombre": {
			all: {
				gradient: "linear",
				values: [300, 200, 300, 0],
				lengthFunctions: [(length, value) => value - length / 1000 / 2, (length, value) => value - length / 1000 / 2],
				colors: [
					[0.6, "rgba(0, 0, 0, 1)"],
					[0.85, "rgba(0, 0, 0, 1)"],
				],
			},
		},
		split: {
			all: {
				gradient: "linear",
				values: [0, 100, 600, 100],
				lengthFunctions: [(length, value) => value, (length, value) => value],
				colors: [
					[0.19, "rgba(0, 0, 0, 1)"],
					[0.21, "rgba(0, 0, 0, 1)"],
				],
			},
		},
		"face-frame": {
			all: {
				gradient: "linear",
				values: [0, 100, 600, 100],
				lengthFunctions: [(length, value) => value, (length, value) => value],
				colors: [
					[0.0, "rgba(0, 0, 0, 1)"],
					[0.0, "rgba(0, 0, 0, 1)"],
				],
			},
		},
	},
};

/**
 * Eyes colour record:
 * - variable:string - Value of variables
 * - name:string - Display name
 * - name_cap:string - Display name, capitalised
 * - csstext:string - CSS class added to text
 * - natural:boolean - Is option for natural eyes
 * - lens:boolean - Is option for contact lenses
 * - canvasfilter:object - Canvas model filter.
 */
setup.colours.eyes = [
	{
		variable: "random", // Only used at the start for a randomised colour
		name: "随机",
		name_cap: "随机",
		csstext: "Random",
		natural: true,
		lens: false,
		canvasfilter: {
			blend: "#b016d8",
		},
	},
	{
		variable: "purple",
		name: "紫色",
		name_cap: "紫色",
		csstext: "purple",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#b016d8",
		},
	},
	{
		variable: "dark blue",
		name: "深蓝色",
		name_cap: "深蓝色",
		csstext: "blue",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#3b6ba4",
		},
	},
	{
		variable: "light blue",
		name: "浅蓝色",
		name_cap: "浅蓝色",
		csstext: "lblue",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#00D9F7",
			brightness: +0.2,
		},
	},
	{
		variable: "amber",
		name: "琥珀色",
		name_cap: "琥珀色",
		csstext: "tangerine",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#f6ca70",
		},
	},
	{
		variable: "hazel",
		name: "榛子色",
		name_cap: "榛子色",
		csstext: "brown",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#917742",
		},
	},
	{
		variable: "green",
		name: "绿色",
		name_cap: "绿色",
		csstext: "green",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#95b521",
		},
	},
	{
		variable: "lime green",
		name: "柠檬绿",
		name_cap: "柠檬绿",
		csstext: "green",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#3ae137",
			brightness: +0.2,
		},
	},
	{
		variable: "light green",
		name: "浅绿色",
		name_cap: "浅绿色",
		csstext: "green",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#D5F075",
		},
	},
	{
		variable: "red",
		name: "红色",
		name_cap: "红色",
		csstext: "red",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#f45b08",
		},
	},
	{
		variable: "pink",
		name: "粉色",
		name_cap: "粉色",
		csstext: "pink",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#F76EF7",
			brightness: +0.2,
		},
	},
	{
		variable: "grey",
		name: "灰色",
		name_cap: "灰色",
		csstext: "grey",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#a9a9a9",
		},
	},
	{
		variable: "light grey",
		name: "浅灰色",
		name_cap: "浅灰色",
		csstext: "grey",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#d1d1d1",
			brightness: +0.2,
		},
	},
	{
		variable: "colorWheelTemporary0",
		name: "灰白色",
		name_cap: "灰白色",
		csstext: "colorWheelTemporary0",
		natural: false,
		lens: true,
		canvasfilter: {
			blend: "#d1d1d1",
			brightness: +0.2,
		},
	},
	{
		variable: "colorWheelTemporary1",
		name: "灰白色",
		name_cap: "灰白色",
		csstext: "colorWheelTemporary1",
		natural: false,
		lens: true,
		canvasfilter: {
			blend: "#d1d1d1",
			brightness: +0.2,
		},
	},
	{
		variable: "red possessed",
		name: "鲜红色",
		name_cap: "鲜红色",
		csstext: "redPossessed",
		natural: false,
		lens: false,
		canvasfilter: {
			blend: "#f40101",
			brightness: +0.2,
		},
	},
	{
		variable: "blue possessed",
		name: "布蓝色",
		name_cap: "布蓝色",
		csstext: "bluePossessed",
		natural: false,
		lens: false,
		canvasfilter: {
			blend: "#0F52BA",
			brightness: +0.4,
		},
	},
];

/**
 * Clothes colour record:
 * - variable:string - Value of variables
 * - name:string - Display name
 * - name_cap:string - Display name, capitalised
 * - csstext:string - CSS class added to text
 * - canvasfilter:object - Canvas model filter.
 */
setup.colours.clothes = [
	{
		variable: "blue",
		name: "蓝色",
		name_cap: "蓝色",
		csstext: "blue",
		canvasfilter: { blend: "#0132ff" },
	},
	{
		variable: "light blue",
		name: "浅蓝色",
		name_cap: "浅蓝色",
		csstext: "light-blue",
		canvasfilter: { blend: "#559BC0" },
	},
	{
		variable: "white",
		name: "白色",
		name_cap: "白色",
		csstext: "white",
		canvasfilter: { blend: "#ffffff" },
	},
	{
		variable: "pale white",
		name: "苍白色",
		name_cap: "苍白色",
		csstext: "white",
		canvasfilter: { blend: "#949494" },
	},
	{
		variable: "red",
		name: "红色",
		name_cap: "红色",
		csstext: "red",
		canvasfilter: { blend: "#ff0000" },
	},
	{
		variable: "green",
		name: "绿色",
		name_cap: "绿色",
		csstext: "green",
		canvasfilter: { blend: "#00aa00" },
	},
	{
		variable: "light green",
		name: "浅绿色",
		name_cap: "浅绿色",
		csstext: "green",
		canvasfilter: { blend: "#72AC72" },
	},
	{
		variable: "black",
		name: "黑色",
		name_cap: "黑色",
		csstext: "black",
		canvasfilter: { blend: "#353535" },
	},
	{
		variable: "pink",
		name: "粉色",
		name_cap: "粉色",
		csstext: "pink",
		canvasfilter: { blend: "#fe3288" },
	},
	{
		variable: "light pink",
		name: "浅粉色",
		name_cap: "亮粉色",
		csstext: "light-pink",
		canvasfilter: { blend: "#d67caf" },
	},
	{
		variable: "purple",
		name: "紫色",
		name_cap: "紫色",
		csstext: "purple",
		canvasfilter: { blend: "#8f09f3" },
	},
	{
		variable: "tangerine",
		name: "橘色",
		name_cap: "橘色",
		csstext: "tangerine",
		canvasfilter: { blend: "#ff6f00" },
	},
	{
		variable: "pale tangerine",
		name: "红橙色",
		name_cap: "淡橘色",
		csstext: "pale-tangerine",
		canvasfilter: { blend: "#ff3300" },
	},
	{
		variable: "teal",
		name: "蓝绿色",
		name_cap: "蓝绿色",
		csstext: "teal",
		canvasfilter: { blend: "#2bcece" },
	},
	{
		variable: "yellow",
		name: "黄色",
		name_cap: "黄色",
		csstext: "yellow",
		canvasfilter: { blend: "#ffdd33", brightness: 0.2 },
	},
	{
		variable: "pale yellow",
		name: "淡黄色",
		name_cap: "淡黄色",
		csstext: "pale-yellow",
		canvasfilter: { blend: "#ffaa00" },
	},
	{
		variable: "brown",
		name: "棕色",
		name_cap: "棕色",
		csstext: "brown",
		canvasfilter: { blend: "#703000" },
	},
	{
		variable: "tan",
		name: "浅褐色",
		name_cap: "浅褐色",
		csstext: "tan",
		canvasfilter: { blend: "#c3ad91" },
	},
	{
		variable: "grey",
		name: "灰色",
		name_cap: "灰色",
		csstext: "grey",
		canvasfilter: { blend: "#b5aea6" },
	},
	{
		variable: "sand",
		name: "沙色",
		name_cap: "沙色",
		csstext: "sand",
		canvasfilter: { blend: "#ebd1ad" },
	},
	{
		variable: "off-white",
		name: "米色",
		name_cap: "米色",
		csstext: "off-white",
		canvasfilter: { blend: "#ecece8" },
	},
	{
		variable: "navy",
		name: "海蓝色",
		name_cap: "海蓝色",
		csstext: "navy",
		canvasfilter: { blend: "#292934" },
	},
	{
		variable: "olive",
		name: "橄榄色",
		name_cap: "橄榄色",
		csstext: "olive",
		canvasfilter: { blend: "#5f5a44" },
	},
	{
		variable: "wine",
		name: "酒红色",
		name_cap: "酒红色",
		csstext: "wine",
		canvasfilter: { blend: "#65252d" },
	},
	{
		variable: "apocalypse",
		name: "浓咖啡色",
		name_cap: "浓咖啡色",
		csstext: "apocalypse",
		canvasfilter: { blend: "#5c271d" },
	},
	{
		variable: "steel",
		name: "钢银色",
		name_cap: "钢银色",
		csstext: "steel",
		canvasfilter: { blend: "#999999" },
	},
	{
		variable: "blue steel",
		name: "蓝钢色",
		name_cap: "蓝钢色",
		csstext: "blue-steel",
		canvasfilter: { blend: "#646e82" },
	},
	{
		variable: "bronze",
		name: "青铜色",
		name_cap: "青铜色",
		csstext: "bronze",
		canvasfilter: { blend: "#cd9932" },
	},
	{
		variable: "gold",
		name: "黄金色",
		name_cap: "黄金色",
		csstext: "gold",
		canvasfilter: { blend: "#ffbf00", brightness: 0.1 },
	},
	{
		variable: "silver",
		name: "银色",
		name_cap: "银色",
		csstext: "silver",
		canvasfilter: { blend: "#C0C0C0" },
	},
];
/**
 * Makeup colour records:
 * - variable:string - Value of variables
 * - name:string - Display name
 * - name_cap:string - Display name, capitalised
 * - csstext:string - CSS class added to text
 * - canvasfilter:object - Canvas model filter.
 */
setup.colours.lipstick = [
	{
		variable: "red",
		name: "红色",
		name_cap: "红色",
		csstext: "red",
		canvasfilter: {
			blend: "#EC3535",
		},
	},
	{
		variable: "blue",
		name: "蓝色",
		name_cap: "蓝色",
		csstext: "blue",
		canvasfilter: {
			blend: "#4372FF",
		},
	},
	{
		variable: "green",
		name: "绿色",
		name_cap: "绿色",
		csstext: "green",
		canvasfilter: {
			blend: "#195205",
		},
	},
	{
		variable: "purple",
		name: "紫色",
		name_cap: "紫色",
		csstext: "purple",
		canvasfilter: {
			blend: "#AA4BC8",
		},
	},
	{
		variable: "orange",
		name: "橘黄色",
		name_cap: "柑橘色",
		csstext: "orange",
		canvasfilter: {
			blend: "#f28500",
		},
	},
	{
		variable: "lime",
		name: "酸橙色",
		name_cap: "酸橙色",
		csstext: "lime",
		canvasfilter: {
			blend: "#38B20A",
		},
	},
	{
		variable: "pink",
		name: "粉色",
		name_cap: "粉色",
		csstext: "pink",
		canvasfilter: {
			blend: "#E40081",
		},
	},
	{
		variable: "light pink",
		name: "浅粉色",
		name_cap: "亮粉色",
		csstext: "light-pink",
		canvasfilter: {
			blend: "#d67caf",
		},
	},
	{
		variable: "dark red",
		name: "深红色",
		name_cap: "暗红色",
		csstext: "red",
		canvasfilter: {
			blend: "#BD0000",
		},
	},
	{
		variable: "black",
		name: "黑色",
		name_cap: "黑色",
		csstext: "black",
		canvasfilter: {
			blend: "#292929",
		},
	},
];
setup.colours.eyeshadow = [
	{
		variable: "red",
		name: "红色",
		name_cap: "红色",
		csstext: "red",
		canvasfilter: {
			blend: "#EC3535",
		},
	},
	{
		variable: "pink",
		name: "粉色",
		name_cap: "粉色",
		csstext: "pink",
		canvasfilter: {
			blend: "#E40081",
		},
	},
	{
		variable: "light pink",
		name: "浅粉色",
		name_cap: "亮粉色",
		csstext: "light-pink",
		canvasfilter: {
			blend: "#d67caf",
		},
	},
	{
		variable: "green",
		name: "绿色",
		name_cap: "绿色",
		csstext: "green",
		canvasfilter: {
			blend: "#38B20A",
		},
	},
	{
		variable: "light green",
		name: "浅绿色",
		name_cap: "浅绿色",
		csstext: "green",
		canvasfilter: {
			blend: "#7caf7c",
		},
	},
	{
		variable: "blue",
		name: "蓝色",
		name_cap: "蓝色",
		csstext: "blue",
		canvasfilter: {
			blend: "#4372FF",
		},
	},
	{
		variable: "light blue",
		name: "浅蓝色",
		name_cap: "浅蓝色",
		csstext: "light-blue",
		canvasfilter: {
			blend: "#559BC0",
		},
	},
	{
		variable: "purple",
		name: "紫色",
		name_cap: "紫色",
		csstext: "purple",
		canvasfilter: {
			blend: "#AA4BC8",
		},
	},
	{
		variable: "orange",
		name: "橘黄色",
		name_cap: "柑橘色",
		csstext: "orange",
		canvasfilter: {
			blend: "#f28500",
		},
	},
	{
		variable: "yellow",
		name: "黄色",
		name_cap: "黄色",
		csstext: "yellow",
		canvasfilter: {
			blend: "#FFD700",
		},
	},
	{
		variable: "brown",
		name: "棕色",
		name_cap: "棕色",
		csstext: "brown",
		canvasfilter: {
			blend: "#4C2217",
		},
	},
	{
		variable: "light brown",
		name: "浅棕色",
		name_cap: "亮褐色",
		csstext: "lightbrown",
		canvasfilter: {
			blend: "#C5793A",
		},
	},
	{
		variable: "dark brown",
		name: "深棕色",
		name_cap: "深棕色",
		csstext: "brown",
		canvasfilter: {
			blend: "#4C2217",
		},
	},
	{
		variable: "black",
		name: "黑色",
		name_cap: "黑色",
		csstext: "black",
		canvasfilter: {
			blend: "#292929",
		},
	},
	{
		variable: "white",
		name: "白色",
		name_cap: "白色",
		csstext: "",
		canvasfilter: {
			blend: "#EEEEEE",
		},
	},
	{
		variable: "silver",
		name: "银色",
		name_cap: "银色",
		csstext: "silver",
		canvasfilter: {
			blend: "#C0C0C0",
		},
	},
];
setup.colours.mascara = [
	{
		variable: "black",
		name: "黑色",
		name_cap: "黑色",
		csstext: "black",
		canvasfilter: {
			blend: "#292929",
		},
	},
	{
		variable: "black waterproof",
		name: "黑色(防水的)",
		name_cap: "黑色(防水)",
		csstext: "black",
		canvasfilter: {
			blend: "#292929",
		},
	},
];
setup.colours.condom = [
	{
		variable: "red",
		name: "红色",
		name_cap: "红色",
		csstext: "red",
		canvasfilter: {
			blend: "#EC3535",
		},
	},
	{
		variable: "blue",
		name: "蓝色",
		name_cap: "蓝色",
		csstext: "blue",
		canvasfilter: {
			blend: "#4372FF",
		},
	},
	{
		variable: "lblue",
		name: "浅蓝色",
		name_cap: "浅蓝色",
		csstext: "lblue",
		canvasfilter: {
			blend: "#559BC0",
		},
	},
	{
		variable: "green",
		name: "绿色",
		name_cap: "绿色",
		csstext: "green",
		canvasfilter: {
			blend: "#38B20A",
		},
	},
	{
		variable: "lime",
		name: "酸橙色",
		name_cap: "酸橙色",
		csstext: "lime",
		canvasfilter: {
			blend: "#7caf7c",
		},
	},
	{
		variable: "purple",
		name: "紫色",
		name_cap: "紫色",
		csstext: "purple",
		canvasfilter: {
			blend: "#AA4BC8",
		},
	},
	{
		variable: "orange",
		name: "橘黄色",
		name_cap: "柑橘色",
		csstext: "orange",
		canvasfilter: {
			blend: "#f28500",
		},
	},
	{
		variable: "pink",
		name: "粉色",
		name_cap: "粉色",
		csstext: "pink",
		canvasfilter: {
			blend: "#E40081",
		},
	},
	{
		variable: "plain",
		name: "素色",
		name_cap: "素色",
		csstext: "plain",
		canvasfilter: {
			blend: "#f28500",
		},
	},
];

/*
 * Maps to easily access colour record by its variable code, ex. setup.colours.hair_map[$haircolour]
 */

function buildColourMap(name, mode) {
	const array = mode === "custom_eyecolours" ? V.custom_eyecolours : setup.colours[name];
	const map = setup.colours[name + "_map"];
	const defaultFilter = setup.colours[name + "_default"];
	for (const item of array) {
		if (defaultFilter) Renderer.mergeLayerData(item.canvasfilter, defaultFilter);
		const key = item.variable;
		if (key in map) {
			if (mode !== "custom_eyecolours") console.error("Duplicate " + name + " '" + key + "'");
		}
		map[key] = item;
	}
	return map;
}

window.buildColourMap = buildColourMap;

buildColourMap("hair");
buildColourMap("eyes");
buildColourMap("clothes");
buildColourMap("lipstick");
buildColourMap("mascara");
buildColourMap("eyeshadow");
buildColourMap("condom");

/**
 * Tries to guess colour in the map by removing spaces or replacing them with '-' and checking against name.
 * Return colour record if found, and null if no.
 *
 * @param {any} map
 * @param {any} colour
 */
setup.guessColourInMap = function (map, colour) {
	if (colour in map) return map[colour];

	let testname = colour.replace(/ /g, "");
	if (testname in map) return map[testname];

	testname = colour.replace(/ /g, "-");
	if (testname in map) return map[testname];

	for (const record of Object.values(map)) {
		if (record.name === colour) return record;
	}
	return null;
};
/**
 * Tries to guess readable name of the colour by looking it in all known maps.
 * If not found, return unchanged.
 *
 * @param {any} colour
 */
setup.colourName = function (colour) {
	for (const map of [
		setup.colours.hair_map,
		setup.colours.eyes_map,
		setup.colours.clothes_map,
		setup.colours.mascara_map,
		setup.colours.lipstick_map,
		setup.colours.eyeshadow_map,
		setup.colours.condom_map,
	]) {
		if (colour in map) return map[colour].name;
	}
	return colour;
};
