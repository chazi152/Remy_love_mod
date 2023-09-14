/* This file contains utility functions for named NPCs. */

function statusCheck(name) {
	if (V.NPCNameList.includes(name)) {
		const nnpc = V.NPCName[V.NPCNameList.indexOf(name)];

		/* To remove later */
		if (V.options.debugdisable === "t" && V.debug === 0) {
			T[name.toLowerCase()] = nnpc;
		}
		/* To remove later */

		/* Assume this is successful, unless the game is severely unhinged. */
		if (nnpc.init === 1) {
			switch (nnpc.nam) {
				case "Robin":
					getRobinLocation();
					break;
				case "Kylar":
					kylarStatusCheck(nnpc);
					break;
				case "Sydney":
					sydneyStatusCheck();
					break;
			}
		}
		return nnpc;
	} else {
		Errors.report(`getNNPC received an invalid name ${name}.`);
	}
}
window.statusCheck = statusCheck;

function sydneyStatusCheck() {
	const sydney = V.NPCName[V.NPCNameList.indexOf("Sydney")];

	if (sydney.purity >= 50 && sydney.lust >= 60) T.sydneyStatus = "pureLust";
	else if (sydney.corruption >= 10 && sydney.lust >= 20) T.sydneyStatus = "corruptLust";
	else if (sydney.purity >= 50) T.sydneyStatus = "pure";
	else if (sydney.corruption >= 10) T.sydneyStatus = "corrupt";
	else if (sydney.lust >= 40) T.sydneyStatus = "neutralLust";
	else T.sydneyStatus = "neutral";

	if (sydney.chastity.penis.includes("chastity") || sydney.chastity.vagina.includes("chastity")) T.sydneyChastity = 1;
	if (sydney.virginity.vaginal && sydney.virginity.penile) T.sydneyVirgin = 1;
}

function kylarStatusCheck(kylar) {
	const kylarStatus = [];
	// USAGE:
	// if Kylar's love is 50+:  <<if _kylarStatus.includes("Love")>>
	// if Kylar's love is 0-50: <<if !_kylarStatus.includes("Love")>>
	if (kylar.love >= 50) {
		kylarStatus.push("Love");
	}
	// USAGE:
	// if Kylar's lust is 60+:  <<if _kylarStatus.includes("Lust")>>
	// if Kylar's lust is 0-60: <<if !_kylarStatus.includes("Lust")>>
	if (kylar.lust >= 60) {
		kylarStatus.push("Lust");
	}
	// USAGE:
	// if Kylar's jealousy is 90+:   <<if _kylarStatus.includes("MaxRage")>>
	if (kylar.rage >= 90) {
		kylarStatus.push("MaxRage");
	}

	// USAGE:
	// if Kylar's jealousy is 60+:   <<if _kylarStatus.includes("Rage")>>. Not mutually exclusive with 90+
	// if Kylar's jealousy is 30-59: <<if _kylarStatus.includes("Sus")>>
	// if Kylar's jealousy is 0-30:  <<if _kylarStatus.includes("Calm")>>
	if (kylar.rage >= 60) {
		kylarStatus.push("Rage");
	} else if (kylar.rage >= 30) {
		kylarStatus.push("Sus");
	} else {
		kylarStatus.push("Calm");
	}
	return (T.kylarStatus = kylarStatus);
}
