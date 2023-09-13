/* 	Used to give the pseudo enumerators a couple of functions.
	I had used defineProperties to ensure that VSCode can correctly
	ensure the structure of the enumerators, without overcomplicating
	every enumerator's definition.
*/
function getEnumBase() {
	return {
		from: {
			value(toFind) {
				return Object.entries(this).find(e => e[1] === toFind)[0];
			},
			writable: false,
			enumerable: false,
		},
	};
}

/* Using var so that they are hoisted within the output file. */

/**
 * An enumerator containing the types of sexes a group is.
 */
// eslint-disable-next-line no-var
var SexTypes = Object.freeze(
	Object.defineProperties(
		{
			ALL_DICKS: 3,
			ALL_MALES: 2,
			ALL_DICKGIRLS: 1,
			BOTH: 0,
			ALL_CUNTBOYS: -1,
			ALL_FEMALES: -2,
			ALL_VAGINAS: -3,
		},
		getEnumBase()
	)
);
window.SexTypes = SexTypes;
