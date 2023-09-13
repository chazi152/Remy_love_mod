/* eslint-disable no-undef */

function fertiliseParasites(genital = "anus") {
	// Runs whenever someone ejaculates in your `genital`
	const pregnancy = V.sexStats[genital].pregnancy;
	if (pregnancy.type === "parasite") {
		pregnancy.fetus.forEach(parasite => {
			if (!parasite.fertilised) {
				parasite.fertilised = true;
				parasite.daysLeft = parasite.stats.growth;
				if (parasite.stats.gender === "Hermaphrodite") {
					pregnancy.motherStatus = 2;
				}
			}
		});
	}
}
DefineMacro("fertiliseParasites", fertiliseParasites);

// eslint-disable-next-line no-unused-vars
function parasiteProgressDay(genital = "anus") {
	const pregnancy = V.sexStats[genital].pregnancy;
	V.pregnancyStats.namesParasitesChild = V.deviancy >= 75;
	if (pregnancy.type === "parasite") {
		pregnancy.fetus.forEach(parasite => {
			if (parasite.daysLeft > 0) parasite.daysLeft--;
			if (parasite.stats.gender === "Hermaphrodite" && parasite.daysLeft <= 3) {
				if (parasite.stats.lastEgg > 0) {
					parasite.stats.lastEgg--;
				} else if (V.sexStats[genital].pregnancy.fetus.length < maxParasites(genital)) {
					impregnateParasite(parasite.creature, true, genital, parasite);
				}
			}
		});
		pregnancy.fetus = pregnancy.fetus.filter(parasite => parasite.daysLeft > 0 || parasite.fertilised);
		if (!pregnancy.fetus.length) pregnancy.type = null;
	}
}

// eslint-disable-next-line no-unused-vars
function parasiteProgressTime(pass, genital = "anus") {
	const pregnancy = V.sexStats[genital].pregnancy;
	if (pregnancy.type === "parasite") {
		pregnancy.fetus.forEach(parasite => {
			if (parasite.fertilised) {
				if (parasite.timeLeft === null) parasite.timeLeft = parasite.stats.speed;
				parasite.timeLeft -= pass;
				if (parasite.timeLeft <= 0) {
					parasite.timeLeft = parasite.stats.speed;
					if (!V.daily.parasiteEvent) {
						V.daily.parasiteEvent = [];
					}
					if (parasite.stats.gender === "Hermaphrodite" && parasite.daysLeft <= 3) {
						if ((parasite.daysLeft <= 3 && random(0, 100) < 20) || (parasite.daysLeft === 0 && random(0, 100) < 50)) {
							V.daily.parasiteEvent.pushUnique(genital + 0);
							if (V.pregnancyStats.parasiteDoctorEvents === 2) V.pregnancyStats.parasiteDoctorEvents = 3;
						} else if (parasite.daysLeft === 0 || random(0, 100) < 60) {
							V.daily.parasiteEvent.pushUnique(genital + 2);
						}
					} else {
						if ((parasite.daysLeft === 0 && random(0, 100) < 50) || (parasite.daysLeft <= 3 && random(0, 100) < 20)) {
							V.daily.parasiteEvent.pushUnique(genital + 1);
							if (V.pregnancyStats.parasiteDoctorEvents === 0) V.pregnancyStats.parasiteDoctorEvents = 1;
							if (V.pregnancyStats.parasiteDoctorEvents >= 2) pregnancy.parasiteFeltMovement = true;
						} else if (parasite.daysLeft === 0 || (parasite.daysLeft <= 3 && random(0, 100) < 60)) {
							V.daily.parasiteEvent.pushUnique(genital + 2);
						} else if (parasite.daysLeft < 7 && random(0, 100) < 50) {
							V.daily.parasiteEvent.pushUnique(genital + 3);
						}
					}
				}
			}
		});
	}
}

function impregnateParasite(parasiteType, chance, genital = "anus", hermParasite) {
	if (V.parasitepregdisable === "t" || !parasiteType || (!V.player.vaginaExist && genital === "vagina")) return false;
	if (V.sexStats.pills.pills["Anti-Parasite Cream"] && V.sexStats.pills.pills["Anti-Parasite Cream"].doseTaken && !hermParasite) return false;

	const pregnancy = V.sexStats[genital].pregnancy;

	if (pregnancy.fetus.length >= maxParasites(genital) || (pregnancy.type !== null && pregnancy.type !== "parasite")) return false;

	const rngCheck = chance === true || random(0, 100) <= 1 + chance / (pregnancy.fetus.length + 1);

	if (pregnancy && rngCheck) {
		switch (parasiteType) {
			case "slimes":
			case "eels":
			case "worms":
			case "snakes":
			case "spiders":
			case "slugs":
			case "maggots":
				parasiteType = toTitleCase(parasiteType);
				parasiteType = parasiteType.substring(0, parasiteType.length - 1);
				break;
			default:
				parasiteType = toTitleCase(parasiteType);
				break;
		}

		const newPregnancy = pregnancyGenerator.parasite({
			mother: "pc",
			parasiteType,
			genital,
			hermParasite,
		});
		if (newPregnancy && !(typeof newPregnancy === "string" || newPregnancy instanceof String)) {
			V.sexStats[genital].pregnancy = {
				...pregnancy,
				...newPregnancy,
			};
			if (!hermParasite) T.impreg = true;
			return true;
		}
	}
	return false;
}
DefineMacro("impregnateParasite", impregnateParasite);
