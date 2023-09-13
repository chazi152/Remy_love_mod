/* eslint-disable no-undef */
function getHe() {
	switch (V.pronoun) {
		case "m":
			return "he";
		case "f":
			return "she";
		case "i":
			return "it";
		case "n":
			return "one";
		case "t":
			return "they";
		default:
			Errors.report(`Used ?${this.name} without selecting the NPC. Typically requires <<person1>>. ${Utils.GetStack()}`);
			return "they";
	}
}
/**
 * ?he - Returns the pronoun based on whatever $pronoun is set to.
 *		  Call ?he in TwineScript after calling <<person1>> to use.
 */
/** ?He - Capitalised version of above. */
Template.add(["he", "He"], function () {
	return this.name === "He" ? getHe.call(this).toUpperFirst() : getHe.call(this);
});

function getHim() {
	switch (V.pronoun) {
		case "m":
			return "him";
		case "f":
			return "her";
		case "i":
			return "it";
		case "n":
		case "t":
			return "them";
		default:
			Errors.report(`Used ?${this.name} without selecting the NPC. Typically requires <<person1>>. ${Utils.GetStack()}`);
			return "them";
	}
}
/**
 * ?him - Returns the pronoun based on whatever $pronoun is set to.
 *		   Call ?him in TwineScript after calling <<person1>> to use.
 */
/** ?Him - Capitalised version of above. */
Template.add(["him", "Him"], function () {
	return this.name === "Him" ? getHim.call(this).toUpperFirst() : getHim.call(this);
});

function getHis() {
	switch (V.pronoun) {
		case "m":
			return "his";
		case "f":
			return "her";
		case "i":
			return "its";
		case "n":
			return "the";
		case "t":
			return "their";
		default:
			Errors.report(`Used ?${this.name} without selecting the NPC. Typically requires <<person1>>. ${Utils.GetStack()}`);
			return "their";
	}
}
/**
 * ?his - Returns the pronoun based on whatever $pronoun is set to.
 *		   Call ?his in TwineScript after calling <<person1>> to use.
 */
/** ?His - Capitalised version of above. */
Template.add(["his", "His"], function () {
	return this.name === "His" ? getHis.call(this).toUpperFirst() : getHis.call(this);
});

function getHeIs() {
	switch (V.pronoun) {
		case "m":
		case "f":
		case "i":
		case "n":
			return getHe.call(this) + "'s";
		case "t":
			return getHe.call(this) + "'re";
		default:
			DOL.Errors.report(`Used ?${this.name} without selecting the NPC. Typically requires <<person1>>. ${Utils.GetStack()}`);
			return "they're";
	}
}
/**
 * ?hes - Returns the pronoun based on whatever $pronoun is set to.
 *		   Call ?hes in TwineScript after calling <<person1>> to use.
 */
/** ?Hes - Capitalised version of above. */
Template.add(["hes", "Hes"], function () {
	return this.name === "Hes" ? getHeIs.call(this).toUpperFirst() : getHeIs.call(this);
});

function getHers() {
	switch (V.pronoun) {
		case "m":
			return "his";
		case "f":
			return "hers";
		case "i":
			return "its";
		case "n":
			return "the";
		case "t":
			return "theirs";
		default:
			Errors.report(`Used ?${this.name} without selecting the NPC. Typically requires <<person1>>. ${Utils.GetStack()}`);
			return "theirs";
	}
}
/**
 * ?hers - Returns the pronoun based on whatever $pronoun is set to.
 *		   Call ?hers in TwineScript after calling <<person1>> to use.
 */
/** ?Hers - Capitalised version of above. */
Template.add(["hers", "Hers"], function () {
	return this.name === "Hers" ? getHers.call(this).toUpperFirst() : getHers.call(this);
});

function getHimself() {
	return getHim.call(this) + "self";
}
/**
 * ?himself - Returns the pronoun based on whatever $pronoun is set to.
 *		   Call ?himself in TwineScript after calling <<person1>> to use.
 */
/** ?Himself - Capitalised version of above. */
Template.add(["himself", "Himself"], function () {
	return this.name === "Himself" ? getHimself.call(this).toUpperFirst() : getHimself.call(this);
});

function getPeople() {
	switch (maleChance()) {
		case 100:
			return "men";
		case 0:
			return "women";
		default:
			return "men and women";
	}
}
/**
 * ?people - Returns the pronoun based on whatever $pronoun is set to.
 *		   Call ?people in TwineScript after calling <<person1>> to use.
 */
/** ?People - Capitalised version of above. */
Template.add(["people", "People"], function () {
	return this.name === "People" ? getPeople.call(this).toUpperFirst() : getPeople.call(this);
});

function getPeopleYoung() {
	switch (maleChance()) {
		case 100:
			return "boys";
		case 0:
			return "girls";
		default:
			return "boys and girls";
	}
}
/**
 * ?peopley - Returns the pronoun based on whatever $pronoun is set to.
 *		   Call ?peopley in TwineScript after calling <<person1>> to use.
 */
/** ?Peopley - Capitalised version of above. */
Template.add(["peopley", "Peopley"], function () {
	return this.name === "Peopley" ? getPeopleYoung.call(this).toUpperFirst() : getPeopleYoung.call(this);
});
