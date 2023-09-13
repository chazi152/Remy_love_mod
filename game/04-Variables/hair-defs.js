setup.hair = {
	hairtype: [
		{
			name: "default",
			list: [
				"default",
				"loose",
				"straight",
				"swept left",
				"curl",
				"defined curl",
				"neat",
				"curly side up",
				"heart braid",
				"ruffled",
				"sidecut",
				"space buns",
			],
			devolve: ["ruffled"],
		},
		{
			name: "single tail",
			list: ["flat ponytail", "ponytail", "side tail left", "side tail right", "fluffy ponytail", "side thicktail"],
			devolve: ["ponytail"],
		},
		{
			name: "double tail",
			list: ["pigtails", "twintails", "curly pigtails", "sailor buns", "loop braid", "thick twintails", "drill ringlets"],
			devolve: ["twintails"],
		},
		{
			name: "single braid",
			list: ["braid left", "braid right"],
			devolve: ["braid left"],
		},
		{
			name: "double braid",
			list: ["twin braids"],
			devolve: ["twin braids"],
		},
		{
			name: "short",
			list: ["messy", "short", "short spiky"],
			devolve: ["messy", "short spiky"],
		},
		{
			/* immune to being ruined (because devolve list is empty) */
			name: "special",
			list: ["dreads", "bubble tails"],
			devolve: [],
		},
	],
	fringetype: [
		{
			name: "default",
			list: [
				"default",
				"thin flaps",
				"wide flaps",
				"hime",
				"loose",
				"messy",
				"overgrown",
				"ringlets",
				"split",
				"straight",
				"swept left",
				"back",
				"parted",
				"flat",
				"quiff",
				"straight curl",
				"ringlet curl",
				"curtain",
				"trident",
				"framed",
				"sidecut",
				"drill ringlets",
				"front braids",
				"blunt sidelocks",
				"ruffled",
			],
			devolve: ["messy", "trident", "thin flaps", "ruffled"],
		},
	],
};

function hairLengthStringToNumber(hairLength) {
	return {
		short: 0,
		shoulder: 200,
		chest: 400,
		navel: 600,
		thighs: 700,
		feet: 900,
	}[hairLength];
}
window.hairLengthStringToNumber = hairLengthStringToNumber;
