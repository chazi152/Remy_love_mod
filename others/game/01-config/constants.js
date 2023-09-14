const constants = {
	crime: {
		max: 50000,
		min: 0,
	},
	penisSize: {
		max: 5,
		min: -2,
	},
	tiredness: {
		max: 2000,
		min: 0,
	},
};

/* Hoist Constants to the top (For statevars.js) */
// eslint-disable-next-line no-var
var Constants = ConstantsLoader.init(constants);
window.Constants = Constants;
