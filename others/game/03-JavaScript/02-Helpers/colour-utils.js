/**
 * Dev note:
 * Wanted to write a module that wasn't pulled from somewhere external.
 * This is more easily manageable at least from my view. But I did write it.
 */
const ColourUtils = (() => {
	/**
	 * Conversion helper object
	 * This is an object to contain the data used to calculate
	 * the different colour format values, so we don't need to
	 * recalculate at every step.
	 *
	 * Otherwise we would have many property variables up here,
	 * and they would be prone to state changes, and possible
	 * cascading errors.
	 */
	class ConversionObject {
		constructor(rgb) {
			/* Enforce proper RGB object by default. */
			this.rgb = Object.assign({}, { r: 0, g: 0, b: 0 }, rgb);
			this.rNorm = Math.clamp(this.rgb.r, 0, 255) / 255;
			this.gNorm = Math.clamp(this.rgb.g, 0, 255) / 255;
			this.bNorm = Math.clamp(this.rgb.b, 0, 255) / 255;
			this.cMax = Math.max(this.rNorm, this.gNorm, this.bNorm);
			this.cMin = Math.min(this.rNorm, this.gNorm, this.bNorm);
			this.delta = this.cMax - this.cMin;
		}
	}

	function getHue(rgb) {
		/* Enforce proper RGB object by default. */
		rgb = Object.assign({}, { r: 0, g: 0, b: 0 }, rgb);
		const helper = rgb instanceof ConversionObject ? rgb : new ConversionObject(rgb);
		if (helper.delta === 0) {
			return 0;
		}
		let deg = 0;
		switch (helper.cMax) {
			case helper.rNorm:
				deg = 60 * (((helper.gNorm - helper.bNorm) / helper.delta) % 6);
				break;
			case helper.gNorm:
				deg = 60 * ((helper.gNorm - helper.rNorm) / helper.delta + 2);
				break;
			case helper.bNorm:
				deg = 60 * ((helper.rNorm - helper.gNorm) / helper.delta + 4);
				break;
		}
		if (deg < 0) deg += 360; /*  */
		return deg;
	}

	function getSaturation(rgb) {
		/* Enforce proper RGB object by default. */
		rgb = Object.assign({}, { r: 0, g: 0, b: 0 }, rgb);
		const helper = rgb instanceof ConversionObject ? rgb : new ConversionObject(rgb);
		if (helper.delta === 0) return 0;
		const demoninator = 1 - Math.abs(2 * getLight(helper) - 1);
		if (demoninator === 0) return 100;
		return (helper.delta / demoninator) * 100;
	}

	function getLight(rgb) {
		/* Enforce proper RGB object by default. */
		rgb = Object.assign({}, { r: 0, g: 0, b: 0 }, rgb);
		const helper = rgb instanceof ConversionObject ? rgb : new ConversionObject(rgb);
		return (helper.cMax + helper.cMin) * 50;
	}

	function hexToInt(hex) {
		if (!hex.startsWith("0x")) {
			hex = "0x" + hex;
		}
		return Number.parseInt(hex);
	}

	function invertInt(num) {
		return num ^ 0xffffff;
	}

	function intToHex(num) {
		let str = num.toString(16);
		for (let i = str.length; i < 6; i++) {
			str = "0" + str;
		}
		return str;
	}

	function invertHex(hex) {
		return intToHex(invertInt(hexToInt(hex)));
	}

	function rgbToHex(rgb) {
		rgb = Object.assign({}, { r: 0, g: 0, b: 0 }, rgb);
		const convert = num => {
			const str = num.toString(16);
			return str.length === 1 ? "0" + str : str;
		};
		const r = convert(rgb.r);
		const g = convert(rgb.g);
		const b = convert(rgb.b);
		return r + g + b;
	}

	function rgbToHsl(rgb) {
		if (typeof rgb === "string") {
			/* Extracts each segment of a hex colour string (#ffee00), ff is the red segment, ee is the green segment and 00 is the blue segment. */
			const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(rgb);
			if (result) {
				rgb = {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
				};
			}
		}
		if (typeof rgb !== "object") {
			return null;
		}
		return {
			h: getHue(rgb),
			s: getSaturation(rgb),
			l: getLight(rgb),
		};
	}

	function toHslString(hsl, fallback = "hsl(0, 100%, 50%)") {
		if (!hsl) return fallback;
		return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
	}

	function hslToFilter(hsl) {
		if (!hsl) return "hue-rotate(0deg) saturate(100%) brightness(100%) contrast(100%);";
		return `hue-rotate(${hsl.h}deg) saturate(${hsl.s}%) brightness(${hsl.l}%) contrast(100%) sepia(0);`;
	}

	function partToFilter(part, fallback = { h: 0, s: 100, l: 50 }) {
		/* This will clone all properties into {}, allowing modification without consequence to the top properties. (h, s, and l) */
		const hsl = Object.assign({}, fallback, part);
		hsl.l *= 4;
		return hslToFilter(hsl);
	}

	/* Export module */
	return Object.seal({
		partToFilter,
		hslToFilter,
		toHslString,
		hexToInt,
		rgbToHsl,
		invertInt,
		rgbToHex,
		intToHex,
		invertHex,
	});
})();

Object.defineProperty(window, "ColourUtils", {
	get: () => ColourUtils,
});
