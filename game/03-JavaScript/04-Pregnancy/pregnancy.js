/* eslint-disable no-undef */

// Should a name type for species be setup, say, human/wolf specific names
function generateBabyName(name, gender, childId) {
	let result = "";
	const usedNames = [];
	if (usedNames.length === 0) {
		Object.values(V.children).forEach(child => {
			if (!usedNames.includes(child.name) && child.childId !== childId && child.name !== "Unnamed") {
				usedNames.push(child.name);
			}
		});
	}
	if (!!name && name !== "Unnamed") {
		return name.replace(/[^a-zA-Z\u4e00-\u9fa5À-ÿ ]+/g, "").substring(0, 30);
	}
	let names = [];
	switch (gender) {
		case "m":
			// eslint-disable-next-line prettier/prettier
			names = ['艾迪森','阿尔杰农','艾伦','阿尔法','安东','阿克塞尔','巴扎','本顿','伯纳德','布兰德','布雷特','卡尔','卡尔文','卡罗尔','扎克','查克里','克莱尔','康奈利厄','克罗夫顿','达尔登','达克斯','丹','德文','迪格里','唐','道格拉斯','德里斯科尔','杜安','达克','爱德蒙','埃尔斯登','弗里曼','加比','加兰','乔治','戈弗雷','格雷姆','格里尔','哈蒙德','哈兰','亨德里克斯','赫里曼','休伊','休','伊迪安纳','因格拉姆','杰基','贾斯珀','杰克逊','杰科布','杰尔','坎丁','凯尔西','肯达尔','凯文','里恩','基兰','柯里','兰尼','劳森','拉兹','利兰达','利维尔','林登','林顿','利奥内尔','朗尼','卢卡斯','曼利','马瑞卡','梅尔林','迈克尔','蒙蒂','墨菲','内特','内德','诺维尔','奥代尔','奥利','奥伯特','奥托','佩吉特','派普','昆廷','雷蒙德','里奇','罗伯特','罗斯','鲁道夫','萨米','斯科蒂','斯道西','萨德','西奥多','汤米','特里','泰森','瓦尔','弗农','威利斯','威尔默','温顿','温斯顿'];
			break;
		case "f":
			// eslint-disable-next-line prettier/prettier
			names = ['阿德琳','艾琳','艾莉克莎','艾莉雅','艾莉森','安洁莉卡','安娜莉丝','安诺拉','阿沙妮亚','贝茜','贝琪','贝蒂','毕蒂','布莉安娜','卡梅利亚','卡密尔','卡穆琳','卡洛琳','查丝提蒂','切尔西','切尔茜','辛迪','克莱马蒂丝','达拉','黛','黛比','德尔法','爱莉诺拉','爱莉安娜','伊丽莎白','伊莉丝','艾默生','埃米琳','埃莉卡','艾莉','尤丝塔西娅','伊芙琳','加布莉埃尔','乔治安娜','哈珀','哈里埃塔','海莉','阿兹','亨特','海信丝','印蒂安娜','茵蒂','杰凯塔','詹妮','詹宁','詹可','凯特琳','凯姆','柯露','科琳','库琳','考特妮','克丽丝黛','拉薇娜','琳恩','莱拉','莱丝蕾娅','琳茜','洛蕾娜','露西尔','路薇妮娅','琳','莱萨','玛德琳','玛丽安','马蒂','莫琳','玛可辛','梅乐迪','米拉妮','米丝蒂','奈特','诺艾尔','奥托琳','佩格','珀琳','佩顿','珀尔','佩尔莉','彼得罗内尔','菲比','珀茜','普蕾丝','蕾扎娜','赛琳娜','谢尔琳','莎尔拉','肖娜','丝凯','丝贝拉','特蕾茜','特蕾莎','特鲁迪','沃丽丝','薇尔达','伦恩','伊薇特'];
			break;
	}
	// eslint-disable-next-line prettier/prettier
	names.pushUnique('阿伦','艾迪森','埃里克西','埃尔法','安迪','艾尔登','艾瑞尔','艾蒂','阿斯顿','埃斯登','奥布里','博里','伯尼','佩里','贝弗利','波比','布鲁克林','开兰','卡梅隆','卡罗尔','凯瑞','卡西','查宁','查礼','切诺奇','夏安','卡比','卡迪','卡林','西兰','戴尔','达拉斯','达纳','达比','迪伊','德比','德里凡','德文','艾默生','埃莫里','芬利','弗拉纳','弗伦斯','加比','加纳特','加纳利','嘉瑞','海登','哈洛','霍利斯','杰克','杰德里','乔','杰登','约翰尼','乔伊斯','贾斯汀','卡姆','克莱西','卡尔西','莱斯利','林赛','洛林','莱瑞卡','麦特兰','马利','麦金利','莫林','玛菲','尼可','奥克利','奥戴尔','佩西','佩吉特','佩顿尼','普雷斯利','岚','罗里','瑞安','里根','莱利','莱米顿','罗比','洛里','洛拉','萨吉','萨木','斯凯乐','塞尔比','肖','肖尔','舍利','斯凯勒','索隆','斯塔西','史塔西','泰勒','汤米','特雷西','克里斯汀','特里斯丁','瓦拉');
	names.delete(usedNames);

	result = names[random(0, names.length - 1)];
	if (!result) result = "Unnamed";
	return result;
}
window.generateBabyName = generateBabyName;

function spermObjectToArray(spermObject = [], player, disableRng) {
	const spermArray = [];
	const trackedNPCs = [];
	for (const sperm of spermObject) {
		if (V.incompletePregnancyDisable !== "f" && V.NPCNameList.includes(sperm.source) && !setup.pregnancy.canImpregnatePlayer.includes(sperm.source)) {
			continue;
		}

		switch (sperm.type) {
			case "human":
				if (V.playerPregnancyHumanDisable === "t" && player) continue;
				break;
			case "wolf":
			case "wolfboy":
			case "wolfgirl":
				if (V.playerPregnancyBeastDisable === "t" && player) continue;
				break;
			default:
				continue;
		}

		if (!trackedNPCs.find(npc => npc.source === sperm.source)) trackedNPCs.push({ type: sperm.type, source: sperm.source });
		for (let i = 0, l = sperm.quantity; i < l; i++) {
			if (!disableRng && sperm.mod < random(0, 100)) continue;

			spermArray.push({ type: sperm.type, source: sperm.source });
			if (!disableRng && sperm.mod > random(100, 200)) spermArray.push({ type: sperm.type, source: sperm.source });
		}
	}
	return [trackedNPCs, spermArray];
}
window.spermObjectToArray = spermObjectToArray;

/* V.pregnancytype === "fetish" uses this function */
function fetishPregnancy({ genital = "vagina", target = null, spermOwner = null, spermType = null, rngModifier = 100, quantity = 1, forcePregnancy = false }) {
	if (!target || !spermOwner || !spermType) return null;
	if (["realistic", "fetish"].includes(V.pregnancytype) && !["anus", "vagina"].includes(genital)) return null;
	if (V.pregnancytype === "silly" && !["hand", "kiss"].includes(genital)) return null;

	if (["hand", "kiss"].includes(genital)) genital = target === "pc" && !V.player.vaginaExist ? "anus" : "vagina";

	const motherObject = npcPregObject(target, true);
	const [pregnancy, fertility, magicTattoo] = pregPrep({ motherObject, genital });

	// Check the cycle settings
	let multi = 1;
	if (V.cycledisable === "f") {
		if (target === "pc") {
			const menstruation = V.sexStats.vagina.menstruation;
			if (menstruation.currentState !== "normal") return null;
			const diff = Math.abs(menstruation.stages[2] - menstruation.currentDay);
			multi = Math.clamp(diff > 1 ? 1 - diff * 0.15 : 1, 0, 1);
		} else if (C.npc[target] && C.npc[target].pregnancy && C.npc[target].pregnancy.enabled) {
			const diff = Math.abs(pregnancy.cycleDangerousDay - pregnancy.cycleDay);
			multi = Math.clamp(diff > 1 ? 1 - diff * 0.15 : 1, 0, 1);
		}
	} else {
		// Other non-cycle modifiers
		if (target === "pc") {
			const menstruation = V.sexStats.vagina.menstruation;
			multi = 1 / Math.pow(4, menstruation.nonCycleRng[0]);
		} else if (C.npc[target] && C.npc[target].pregnancy && C.npc[target].pregnancy.enabled) {
			multi = 1 / Math.pow(4, C.npc[target].pregnancy.nonCycleRng[0]);
		}
	}

	if (pregnancy && pregnancy.type === null) {
		const chance = 100 / (target === "pc" ? 100 - V.basePlayerPregnancyChance : 20 - V.baseNpcPregnancyChance);

		if (!forcePregnancy && chance * quantity * (rngModifier / 100) * (1 + fertility + magicTattoo) * multi < random(1, 100)) return false;

		if (target === "pc") {
			const result = playerPregnancy(spermOwner, spermType, true, genital, undefined, true);
			if (result === true) T.playerIsNowPregnant = spermOwner;
		} else if (C.npc[target]) {
			const result = namedNpcPregnancy(target, spermOwner, spermType, true);
			if (result === true) T.npcIsNowPregnant = target;
		}
		return true;
	}
	return false;
}
window.fetishPregnancy = fetishPregnancy;

/* Player pregnancy starts here */
/* V.pregnancytype === "realistic" uses this function */
function playerPregnancyAttempt(baseMulti = 1, genital = "vagina") {
	const pregnancy = V.sexStats[genital].pregnancy;

	if (pregnancy.fetus.length || isNaN(baseMulti) || baseMulti < 1 || V.pregnancytype !== "realistic") return false;

	const [trackedNPCs, spermArray] = spermObjectToArray(V.sexStats[genital].sperm, true);

	const pills = V.sexStats.pills;
	const contraceptive = Math.clamp(pills.pills.contraceptive.doseTaken || 0, 0, Infinity);

	if (spermArray.length === 0 || (contraceptive && (random(0, 100) >= 10 || contraceptive > 1))) return false;
	let fertilityBoost = 1;

	fertilityBoost -= Math.clamp(Math.clamp(pills.pills["fertility booster"].doseTaken || 0, 0, Infinity) * 0.2, 0, 0.7);

	if (V.skin.pubic.pen === "magic" && V.skin.pubic.special === "pregnancy") {
		fertilityBoost -= 0.4;
	}
	const baseChance = Math.floor((100 - V.basePlayerPregnancyChance) * Math.clamp(fertilityBoost, 0.1, 1) * baseMulti);
	const rng = random(0, spermArray.length - 1 > baseChance ? spermArray.length - 1 : baseChance);

	if (spermArray[rng]) {
		const fatherKnown = Object.keys(trackedNPCs).length === 1;

		// Player becomes pregnant
		return playerPregnancy(spermArray[rng].source, spermArray[rng].type, fatherKnown, genital, trackedNPCs);
	}
	return false;
}
DefineMacro("playerPregnancyAttempt", playerPregnancyAttempt);
window.playerPregnancyAttemptTest = (baseMulti, genital) => {
	if (V.pregnancyTesting) return playerPregnancyAttempt(baseMulti, genital);
}; // V.pregnancyTesting Check should not be removed, debugging purposes only

const playerPregnancy = (npc, npcType, fatherKnown = false, genital = "vagina", trackedNPCs, awareOf = false) => {
	if (V.playerPregnancyHumanDisable === "t" && npcType === "human") return false; // Human player pregnancy disabled
	if (V.playerPregnancyBeastDisable === "t" && npcType !== "human") return false; // Beast player pregnancy disabled
	const pregnancy = clone(V.sexStats[genital].pregnancy);
	let newPregnancy;
	let backupSpermType;

	switch (npcType) {
		case "human":
			newPregnancy = pregnancyGenerator.human("pc", npc, fatherKnown, genital);
			backupSpermType = "human";
			break;
		case "wolf":
			newPregnancy = pregnancyGenerator.wolf("pc", npc, fatherKnown, genital);
			backupSpermType = "wolf";
			break;
		case "wolfboy":
		case "wolfgirl":
			newPregnancy = pregnancyGenerator.wolf("pc", npc, fatherKnown, genital, true);
			backupSpermType = "wolf";
			break;
	}
	if (newPregnancy && !(typeof newPregnancy === "string" || newPregnancy instanceof String) && newPregnancy.fetus.length) {
		V.sexStats[genital].pregnancy = {
			...pregnancy,
			...newPregnancy,
			potentialFathers: trackedNPCs || [{ type: backupSpermType, source: npc }],
			waterBreakingTimer: random(0, 24),
			waterBreaking: false,
			awareOf,
		};
		V.sexStats.vagina.menstruation.currentState = "pregnant";
		return true;
	}
	return false;
};
DefineMacro("playerPregnancy", playerPregnancy);
window.playerPregnancyTest = (npc, npcType, fatherKnown, genital, trackedNPCs, awareOf) => {
	if (V.pregnancyTesting) return playerPregnancy(npc, npcType, fatherKnown, genital, trackedNPCs, awareOf);
}; // V.pregnancyTesting Check should not be removed, debugging purposes only

// Run 2 times per day, math should reflect that
// eslint-disable-next-line no-unused-vars
function pregnancyProgress(genital = "vagina") {
	const pregnancy = V.sexStats[genital].pregnancy;
	if (!pregnancy || pregnancy.type === null || pregnancy.type === "parasite" || V.statFreeze) return null;

	V.pregnancyStats.totalDaysPregnant += 0.5;
	if (pregnancy.awareOf) V.pregnancyStats.totalDaysPregnancyKnown += 0.5;

	if (pregnancy.timer < pregnancy.timerEnd) {
		let multiplier = 1;
		switch (pregnancy.type) {
			case "human":
				multiplier = 9 / V.humanPregnancyMonths;
				break;
			case "wolf":
				multiplier = 12 / V.wolfPregnancyWeeks;
				break;
		}
		// The `0.5 * ` is because it runs at both midnight and noon
		pregnancy.timer += parseFloat((0.5 * multiplier).toFixed(3));

		/* Keeping fatigue low should help morning sickness */
		if (between(pregnancy.timer / pregnancy.timerEnd, 0.15, 0.25)) {
			/* Early Morning sickness */
			/* Light Nausea/dizzyness at any time of day, but mostly when waking up */
			if (random(0, 100) >= 30) {
				V.pregnancyStats.morningSicknessWaking = 1;
			}
			if (random(0, 100) >= 30) {
				V.pregnancyStats.morningSicknessGeneral = 1;
			}
		} else if (between(pregnancy.timer / pregnancy.timerEnd, 0.24, 0.45)) {
			/* Morning sickness */
			/* Nausea/dizzyness at any time of day, but mostly when waking up */
			/* First pregnancy should be worse */
			V.pregnancyStats.morningSicknessWaking = [1, 2, 2][random(0, 2)];
			if (pregnancy.totalBirthEvents === 0 && V.pregnancyStats.morningSicknessWaking < 2) {
				V.pregnancyStats.morningSicknessWaking = 2;
			}
		}
		if (pregnancy.timer >= pregnancy.timerEnd) {
			if (V.player.breastsize <= 4 && V.player.breastsize < V.breastsizemax) {
				V.player.breastsize += 1;
				if (V.player.breastsize <= 4 && V.player.breastsize < V.breastsizemax) V.player.breastsize += 1;
				V.breastgrowthtimer = 700;
				V.breastgrowthmessage = V.player.breastsize;
				V.effectsmessage = 1;
			}
			if (V.lactating !== 1 && V.breastfeedingdisable === "f" && V.player.breastsize > 0) {
				V.lactating = 1;
				V.lactation_pressure = 100;
				Wikifier.wikifyEval("<<milkvolume 50>>");
				V.effectsmessage = 1;
				V.lactationmessage = 1;
			}
		}
	}
}

// eslint-disable-next-line no-unused-vars
function playerEndWaterProgress() {
	const pregnancy = getPregnancyObject();
	if (!pregnancy || !pregnancy.type || pregnancy.type === "parasite" || pregnancy.timer < pregnancy.timerEnd || V.statFreeze) {
		// Fixes an issue when the above "parasite" was "parasites"
		if (pregnancy && (!pregnancy.type || pregnancy.type === "parasite") && pregnancy.waterBreaking) waterBreaking = false;
		return null;
	}

	if (
		!isNaN(pregnancy.waterBreakingTimer) &&
		pregnancy.waterBreakingTimer > 0 &&
		(pregnancy.waterBreakingTimer > 1 || (!V.NPCList[0].type && !V.possessed) || V.eventAllowsWaterBreaking)
	) {
		pregnancy.waterBreakingTimer--;
		if (pregnancy.waterBreakingTimer <= 0) {
			pregnancy.waterBreaking = true;
			// To prevent new events from occuring, allowing players to more easily go to the hospital or similar locations
			V.eventskip = 1;
			return true;
		}
		return false;
	} else if (!isNaN(pregnancy.waterBreakingTimer) && !pregnancy.waterBreaking && pregnancy.waterBreakingTimer <= 0) {
		pregnancy.waterBreaking = true;
		// To prevent new events from occuring, allowing players to more easily go to the hospital or similar locations
		V.eventskip = 1;
		return true;
	}
}

// Used only when the player is about to give birth to their children and the player can name them
function playerEndWaterBreaking() {
	V.sexStats.vagina.pregnancy.waterBreaking = null;
	V.sexStats.vagina.pregnancy.waterBreakingTimer = null;
	V.sexStats.anus.pregnancy.waterBreaking = null;
	V.sexStats.anus.pregnancy.waterBreakingTimer = null;
}
DefineMacro("playerEndWaterBreaking", playerEndWaterBreaking);

function endPlayerPregnancy(birthLocation, location) {
	const [pregnancy, genital] = getPregnancyObject("pc", true);
	const menstruation = V.sexStats.vagina.menstruation;

	if (!pregnancy || !pregnancy.fetus.length) return false;

	giveBirthToChildren("pc", birthLocation, location);

	switch (pregnancy.type) {
		case "human":
			menstruation.recoveryTime = random(2, 3) * V.humanPregnancyMonths;
			break;
		case "wolf":
			menstruation.recoveryTime = random(1, 2) * V.wolfPregnancyWeeks;
			break;
	}

	if ((genital === "vagina" && V.player.virginity.vaginal === true) || (genital === "anus" && V.player.virginity.anal === true)) {
		V.pregnancyStats.playerVirginBirths.pushUnique(pregnancy.fetus[0].birthId);
	}

	V.sexStats[genital].pregnancy = {
		...pregnancy,
		totalBirthEvents: (pregnancy.totalBirthEvents || 0) + 1,
		fetus: [],
		waterBreaking: false,
		waterBreakingTimer: null,
		type: null,
		timer: null,
		timerEnd: null,
		awareOf: null,
		awareOfMultiple: null,
		awareOfDetails: null,
		potentialFathers: [],
	};

	V.sexStats.vagina.menstruation = {
		...menstruation,
		currentState: "recovering",
		recoveryTimeStart: menstruation.recoveryTime,
		recoveryStage: 0,
		periodEnabled: false,
		awareOfPeriodDelay: false,
	};

	delete V.templeVirginPregnancy;
	delete V.caveHumanPregnancyDiscovered;
	return true;
}
DefineMacro("endPlayerPregnancy", endPlayerPregnancy);
window.endPlayerPregnancyTest = (birthLocation, location) => {
	if (V.pregnancyTesting && birthLocation && location) return endPlayerPregnancy(birthLocation, location);
}; // V.pregnancyTesting Check should not be removed, debugging purposes only
/* Player pregnancy ends here */

/* Named NPC pregnancy starts here */
// eslint-disable-next-line no-unused-vars
function npcPregnancyCycle() {
	if (V.statFreeze) return null;
	for (const npcName of V.NPCNameList) {
		const npc = C.npc[npcName];
		if (!npc) continue;
		const pregnancy = npc.pregnancy;
		if (!pregnancy) continue;
		if (pregnancy.fetus && pregnancy.fetus.length) {
			let multiplier = 1;
			switch (pregnancy.type) {
				case "human":
					multiplier = 9 / V.humanPregnancyMonths;
					break;
				case "wolf":
					multiplier = 12 / V.wolfPregnancyWeeks;
					break;
			}
			pregnancy.timer += parseFloat(multiplier.toFixed(3));
			if (pregnancy.timer > pregnancy.timerEnd * 0.2 && !pregnancy.npcAwareOf) {
				pregnancy.npcAwareOf = true;
			}
			if (pregnancy.timer > pregnancy.timerEnd) {
				if (pregnancy.timer >= pregnancy.timerEnd + 14 * multiplier) {
					/* Player has not seen the npc recently, sort out the pregnancy in another way */
					let birthLocation = "";
					let location = "";
					switch (npcName) {
						case "Black Wolf":
							birthLocation = "wolf_cave";
							location = "wolf_cave";
							break;
					}
					[birthLocation, location] = defaultBirthLocations(pregnancy.type, birthLocation, location);
					endNpcPregnancy(npcName, birthLocation, location);
				} else {
					/* Can deal with the npc in the next event */
					pregnancy.waterBreaking = true;
				}
			}
		} else if (pregnancy.enabled && V.npcPregnancyDisable === "f") {
			if (V.cycledisable === "f") {
				pregnancy.cycleDay++;
				if (pregnancy.cycleDay >= pregnancy.cycleDaysTotal) {
					pregnancy.cycleDay = 1;
				} else if (between(pregnancy.cycleDay, pregnancy.cycleDangerousDay - 1, pregnancy.cycleDangerousDay + 1)) {
					namedNpcPregnancyAttempt(npcName);
				}
			} else {
				pregnancy.nonCycleRng.push(random(0, 4));
				pregnancy.nonCycleRng.deleteAt(0);
			}
		}
		updateRecordedSperm("vagina", npcName, 1);
	}
}

/* V.pregnancytype === "realistic" uses this function */
function namedNpcPregnancyAttempt(npcName) {
	if (!C.npc[npcName] || C.npc[npcName].vagina === "none" || V.pregnancytype !== "realistic") return false;

	const namedNpc = C.npc[npcName];
	const pregnancy = namedNpc.pregnancy;
	if (!pregnancy || !pregnancy.enabled || pregnancy.fetus.length) {
		// Pregnancy not supported or disabled by the player, or when they are already pregnant
		return false;
	}
	const [trackedNPCs, spermArray] = spermObjectToArray(pregnancy.sperm, false);

	const fertility = pregnancy.pills === "fertility" ? 0.8 : 1;
	const contraceptive = pregnancy.pills === "contraceptive";

	const baseChance = Math.floor((20 - V.baseNpcPregnancyChance) * fertility);
	const rng = random(0, spermArray.length > baseChance ? spermArray.length : baseChance);
	if (contraceptive && random(0, 100) >= 10) {
		/* NPC doesn't get pregnant due to contraceptive */
	} else if (spermArray[rng]) {
		const fatherKnown = Object.keys(trackedNPCs).length === 1;

		/* NPC gets pregnant */
		return namedNpcPregnancy(npcName, spermArray[rng].source, spermArray[rng].type, fatherKnown, trackedNPCs);
	}
	return false;
}

function namedNpcPregnancy(mother, father, fatherSpecies, fatherKnown = false, trackedNPCs, awareOf = false) {
	if (V.npcPregnancyDisable === "t") return false; // Npc pregnancy disabled
	const namedNpc = C.npc[mother];
	let namedNpcType;
	switch (mother) {
		case "Black Wolf":
			if ((V.monsterchance > random(0, 100) && (V.hallucinations >= 1 || V.monsterhallucinations === "f")) || V.blackwolfmonster === 2) {
				namedNpcType = "wolfgirl";
			} else {
				namedNpcType = namedNpc.type;
			}
			break;
		default:
			namedNpcType = namedNpc.type;
			break;
	}
	let newPregnancy;
	let backupSpermType;
	switch (fatherSpecies + namedNpcType) {
		case "humanhuman":
			newPregnancy = pregnancyGenerator.human(mother, father, fatherKnown, "vagina");
			backupSpermType = "human";
			break;
		case "wolfhuman":
		case "humanwolf":
		case "wolfwolf":
			newPregnancy = pregnancyGenerator.wolf(mother, father, fatherKnown, "vagina");
			backupSpermType = "wolf";
			break;
		case "humanwolfboy":
		case "wolfboyhuman":
		case "wolfwolfboy":
		case "wolfboywolf":
		case "wolfboywolfboy":
		case "humanwolfgirl":
		case "wolfgirlhuman":
		case "wolfwolfgirl":
		case "wolfgirlwolf":
		case "girlwolfgirlwolf":
			newPregnancy = pregnancyGenerator.wolf(mother, father, fatherKnown, "vagina", true);
			backupSpermType = "wolf";
			break;
	}
	if (newPregnancy && !(typeof newPregnancy === "string" || newPregnancy instanceof String) && newPregnancy.fetus.length) {
		namedNpc.pregnancy = {
			...namedNpc.pregnancy,
			...newPregnancy,
			potentialFathers: trackedNPCs || [{ type: backupSpermType, source: father }],
			npcAwareOf: false,
			pcAwareOf: awareOf,
		};
		return true;
	}
	return false;
}
DefineMacro("namedNpcPregnancy", namedNpcPregnancy);
window.namedNpcPregnancyTest = (mother, father, pregnancyType, fatherKnown, trackedNPCs, awareOf) => {
	if (V.pregnancyTesting) return namedNpcPregnancy(mother, father, pregnancyType, fatherKnown, trackedNPCs, awareOf);
}; // V.pregnancyTesting Check should not be removed, debugging purposes only

function endNpcPregnancy(npcName, birthLocation, location) {
	if (!C.npc[npcName] || C.npc[npcName].vagina === "none" || C.npc[npcName].pregnancy.enabled === undefined) {
		return false;
	}
	const pregnancy = C.npc[npcName].pregnancy;

	if (!pregnancy || pregnancy.enabled === undefined || !pregnancy.fetus.length) return false;

	// Handled by Baileys Orphanage event and when naming them, this is backup for other situations
	if (location !== "home" && pregnancy.fetus[0].mother !== "pc" && pregnancy.fetus[0].father === "pc") {
		document.getElementById("passages").children[0].append(Wikifier.wikifyEval('<<earnFeat "First Fatherhood">>'));
	}

	giveBirthToChildren(npcName, birthLocation, location);

	const birthEvents = clone(pregnancy.totalBirthEvents) + 1;
	const cycleDay = clone(pregnancy.cycleDaysTotal) - 3;

	V.NPCName[V.NPCNameList.indexOf(npcName)].pregnancy = {
		...pregnancy,
		totalBirthEvents: (pregnancy.totalBirthEvents || 0) + 1,
		fetus: [],
		birthEvents,
		timer: null,
		timerEnd: null,
		waterBreaking: false,
		npcAwareOf: null,
		pcAwareOf: null,
		type: null,
		potentialFathers: [],
		cycleDay,
	};

	V.pregnancyStats.npcTotalBirthEvents++;
	return true;
}
DefineMacro("endNpcPregnancy", endNpcPregnancy);
window.endNpcPregnancyTest = (npcName, birthLocation, location) => {
	if (V.pregnancyTesting && npcName && birthLocation && location) return endNpcPregnancy(npcName, birthLocation, location);
}; // V.pregnancyTesting Check should not be removed, debugging purposes only
/* Named NPC pregnancy ends here */

// eslint-disable-next-line no-unused-vars
function randomPregnancyProgress() {
	if (!V || !V.storedNPCs || V.statFreeze) return false;
	const toDelete = [];
	Object.keys(V.storedNPCs).forEach(npcKey => {
		const npc = V.storedNPCs[npcKey];
		if (npc.pregnancy) {
			let multiplier = 1;
			switch (npc.pregnancy.type) {
				case "human":
					multiplier = 9 / V.humanPregnancyMonths;
					break;
				case "wolf":
					multiplier = 12 / V.wolfPregnancyWeeks;
					break;
			}
			npc.pregnancy.timer += parseFloat(multiplier.toFixed(3));
			if (npc.pregnancy.timer >= npc.pregnancy.timerEnd) {
				let npcDecompressed;
				try {
					npcDecompressed = npcDecompressor(npc.npc);
				} catch (e) {
					console.error("randomPregnancyProgress", e);
					Errors.report("randomPregnancyProgress - Compressed NPC '" + npcKey + "' cannot be decompressed for pregnancy compatibility check. Please export your save if reporting.", e
					);
				}
				const [birthLocation, location] = defaultBirthLocations(npc.pregnancy.type);
				if (npcDecompressed) {
					giveBirthToChildren(npcDecompressed.fullDescription, birthLocation, location, npc.pregnancy);
				} else {
					giveBirthToChildren(npc.pregnancy.fetus[0].mother, birthLocation, location, npc.pregnancy);
				}
				toDelete.push(npcKey);
			}
		}
	});
	toDelete.forEach(npcKey => delete V.storedNPCs[npcKey]);
	return true;
}

function defaultBirthLocations(type, birthLocation, location) {
	switch (type) {
		case "human":
			if (!birthLocation) birthLocation = "hospital";
			if (!location) location = "home";
			break;
		case "wolf":
			if (!birthLocation) birthLocation = "wolf_cave";
			if (!location) location = "wolf_cave";
			break;
		default: /* Considered an invalid location when the above is not updated */
			if (!birthLocation) birthLocation = "unknown";
			if (!location) location = "unknown";
			break;
	}
	return [birthLocation, location];
}

function giveBirthToChildren(mother, birthLocation, location, pregnancyOverride) {
	let pregnancy;
	if (mother === "pc") {
		pregnancy = getPregnancyObject();
	} else if (C.npc[mother]) {
		pregnancy = C.npc[mother].pregnancy;
	} else {
		pregnancy = pregnancyOverride;
	}
	if (!pregnancy || !pregnancy.fetus.length) return false;
	if (mother) {
		let parentId = parentFunction.findParent(mother, 0, true);
		if (parentId) {
			if (Array.isArray(parentId)) parentId = parentId[0];
			parentFunction.increaseBirths(parentId.id, 0);
			// Fix for previous named npc's not updating totalBirthEvents
			if (mother !== "pc") pregnancy.totalBirthEvents = parentId.births;
		}
	}

	const birthId = mother + pregnancy.fetus[0].birthId;
	switch (location) {
		case "home":
			setKnowsAboutPregnancy(mother, "Bailey", birthId, true, pregnancyOverride);
			break;
		case "wolf_cave":
			setKnowsAboutPregnancy(mother, "Black Wolf", birthId);
			break;
		default:
			break;
	}

	switch (pregnancy.type) {
		case "human":
			V.pregnancyStats.humanToysUnlocked = true;
			break;
		case "wolf":
			V.pregnancyStats.wolfToysUnlocked = true;
			break;
	}

	pregnancy.fetus.forEach(childObject => {
		pregnancy.givenBirth++;
		V.children[childObject.childId] = {
			...childObject,
			name: generateBabyName(childObject.name, childObject.gender, childObject.childId),
			born: { day: clone(Time.monthDay), month: clone(Time.monthName), year: clone(Time.year) },
			location,
			birthLocation,
		};
		if (childObject.mother === "pc") {
			V.pregnancyStats.playerChildren++;
		} else if (childObject.father === "pc") {
			V.pregnancyStats.npcChildren++;
		} else {
			V.pregnancyStats.npcChildrenUnrelatedToPlayer++;
		}
		switch (childObject.type) {
			case "human":
				V.pregnancyStats.humanChildren++;
				break;
			case "wolf":
				V.pregnancyStats.wolfChildren++;
				break;
		}
	});
	return true;
}

function recordSperm({
	genital = "vagina",
	target = null,
	spermOwner = null,
	spermType = null,
	daysTillRemovalOverride = null,
	rngModifier = 100,
	rngType,
	quantity = 1,
}) {
	if (V.activeNightmare) return false; // Should not work if the player is in a nightmare
	if (V.disableImpregnation) return false; // To be set at the start of sex scenes, unset with <<endcombat>>
	if (V.playerPregnancyHumanDisable === "t" && spermType === "human" && target === "pc") return false; // Human player pregnancy disabled
	if (V.playerPregnancyBeastDisable === "t" && spermType !== "human" && target === "pc") return false; // Beast player pregnancy disabled
	if (V.npcPregnancyDisable === "t" && target !== "pc") return false; // Npc pregnancy disabled
	if (!target || !spermOwner || !setup.pregnancy.typesEnabled.includes(spermType)) return null;

	if (["realistic", "fetish"].includes(V.pregnancytype) && !["anus", "vagina"].includes(genital)) return null;
	if (V.pregnancytype === "silly") {
		if (!["hand", "kiss"].includes(genital)) return null;
		if ((target === "pc" || spermOwner === "pc") && genital === "hand" && V.worn.hands.name !== "naked") return null;
		if ((target === "pc" || spermOwner === "pc") && genital === "kiss" && V.worn.face.type.includes("covered")) return null;
		if (Object.values(V.loveInterest).find(name => V.NPCNameList.includes(name))) rngModifier = Math.clamp(rngModifier + 100, 0, 200);
	}

	let spermOwnerName;
	if (typeof spermOwner === "string" || spermOwner instanceof String) {
		spermOwnerName = spermOwner;
	} else if (C.npc[spermOwner.fullDescription]) {
		spermOwnerName = spermOwner.fullDescription;
	} else {
		if (!spermOwner.role) {
			spermOwnerName = spermOwner.fullDescription;
		} else if (spermOwner.role && spermOwner.role !== "normal" && spermOwner.name_known) {
			spermOwnerName = spermOwner.role.replace("panty_thief","内裤小偷").replace("school_nurse","学校护工").replace("tower_creature","塔楼生物").replace("steed","坐骑").replace("pinch","林奇").replace("black_dog","黑狗").replace("nurse","护士").replace("waitress","服务员").replace("waiter","服务员").replace("scientist","科学家").replace("inmate","犯人").replace("guard","守卫").replace("hacker","黑客").replace("woman","女人").replace("man","男人") + "——" + spermOwner.name;
		} else {
			spermOwnerName = (spermOwner.role && spermOwner.role !== "normal" ? spermOwner.role +  "——": "") + spermOwner.fullDescription;
		}
	}
	if (setup.pregnancy.infertile.includes(spermOwnerName) || setup.pregnancy.infertile.includes(target)) return null;

	const forcePregnancy =
		(target === "pc" &&
			((V.vaginaaction === "forceImpregnation" && genital === "vagina") || (V.anusaction === "forceImpregnation" && genital === "anus"))) ||
		(target !== "pc" && spermOwner === "pc" && genital === "vagina" && T.npcForceImpregnation);

	if (!forcePregnancy && V.disableNormalImpregnation) return false; // To be set at the start of sex scenes, unset with <<endcombat>>

	if (["fetish", "silly"].includes(V.pregnancytype) || forcePregnancy) {
		// Sperm on the outside should not be able to get the player pregnant
		if (rngType === "canWash") return null;

		return fetishPregnancy({ genital, target, spermOwner: spermOwnerName, spermType, rngModifier, quantity, forcePregnancy });
	}

	let sperm;
	if (target === "pc") {
		sperm = V.sexStats[genital].sperm;
	} else if (C.npc[target] && C.npc[target].pregnancy && C.npc[target].pregnancy.enabled) {
		sperm = C.npc[target].pregnancy.sperm;
	}
	if (sperm) {
		let daysTillRemoval = daysTillRemovalOverride || random(4, 8);

		// Normal sperm should only last a day
		if (V.cycledisable === "t") daysTillRemoval = Math.ceil(daysTillRemoval / 8);

		rngModifier = !isNaN(rngModifier) ? rngModifier : 100;

		if (spermOwnerName === "pc") {
			const pills = V.sexStats.pills;
			if (pills.pills["fertility booster"].doseTaken) {
				rngModifier += Math.clamp(pills.pills["fertility booster"].doseTaken || 0, 0, Infinity) * 25;
			} else if (pills.pills.contraceptive.doseTaken) {
				rngModifier -= Math.clamp(pills.pills.contraceptive.doseTaken || 0, 0, Infinity) * 50;
			}
		} else if (C.npc[spermOwnerName] && C.npc[spermOwnerName].pregnancy) {
			switch (C.npc[spermOwnerName].pregnancy.pills) {
				case "fertility":
					rngModifier += 25;
					break;
				case "contraceptive":
					rngModifier -= 50;
					break;
			}
		}
		rngModifier = Math.clamp(rngModifier, 0, 200);
		if (rngModifier === 0) return false;

		// The  number in `1 + rngType`, the number should match the number of times `updatePlayerRecordedSperm` should not delete the `canWash` tag
		switch (rngType) {
			case "canWash":
				rngType = 1 + rngType;
				break;
			default:
				break;
		}

		const spermFoundIndex = sperm.findIndex(
			item =>
				item.source === spermOwnerName &&
				item.type === spermType &&
				item.daysLeft === daysTillRemoval &&
				item.mod === rngModifier &&
				item.tag === rngType
		);

		if (spermFoundIndex !== -1) {
			sperm[spermFoundIndex].quantity += quantity;
			return true;
		} else {
			const newSperm = {
				source: spermOwnerName,
				type: spermType,
				quantity,
				daysLeft: daysTillRemoval,
			};
			if (rngType) newSperm.tag = rngType;
			if (rngModifier) newSperm.mod = rngModifier;

			sperm.push(newSperm);
			return true;
		}
	}
	return false;
}
DefineMacro("recordSperm", recordSperm);
DefineMacro("recordVaginalSperm", (target, spermOwner, spermType, daysTillRemovalOverride) =>
	recordSperm({ target, spermOwner, spermType, daysTillRemovalOverride })
);
DefineMacro("recordAnusSperm", (target, spermOwner, spermType, daysTillRemovalOverride) =>
	recordSperm({ genital: "anus", target, spermOwner, spermType, daysTillRemovalOverride })
);
window.recordSperm = recordSperm;

// Period is `1 divided how many timers per day the function is run`
function updateRecordedSperm(genital, target, period = 1) {
	let sperm;
	if (genital !== "vagina" && target !== "pc") return null;
	if (target === "pc") {
		sperm = V.sexStats[genital].sperm;
	} else if (C.npc[target] && C.npc[target].pregnancy && C.npc[target].pregnancy.enabled) {
		sperm = C.npc[target].pregnancy.sperm;
	}
	if (sperm) {
		sperm.forEach(s => {
			s.daysLeft -= period;

			if (s.tag && s.tag.includes("canWash") && !isNaN(parseInt(s.tag))) {
				let canWashCount = parseInt(s.tag);
				canWashCount--;
				if (canWashCount >= 0) {
					s.tag = canWashCount + "canWash";
				} else {
					s.tag = "";
				}
			}
		});

		// Remove sperm that is too old now
		if (target === "pc") {
			V.sexStats[genital].sperm = sperm.filter(s => s.daysLeft > 0);
		} else if (C.npc[target] && C.npc[target].pregnancy && C.npc[target].pregnancy.enabled) {
			C.npc[target].pregnancy.sperm = sperm.filter(s => s.daysLeft > 0);
		}
	}
}
DefineMacro("updateRecordedSperm", updateRecordedSperm);

function washRecordedSperm(genital, target) {
	if (genital !== "vagina" && target !== "pc") return null;
	if (target === "pc") {
		V.sexStats[genital].sperm = V.sexStats[genital].sperm.filter(s => !s.tag || (s.tag && !s.tag.includes("canWash")));
	} else if (C.npc[target] && C.npc[target].pregnancy && C.npc[target].pregnancy.enabled) {
		C.npc[target].pregnancy.sperm = C.npc[target].pregnancy.sperm.filter(s => !s.tag || (s.tag && !s.tag.includes("canWash")));
	}
}
DefineMacro("washRecordedSperm", washRecordedSperm);

function playerCanBreedWith(npc) {
	/* This function can accept either a named NPC's name, or an NPC object from either NPCList or NPCName.
	 * Examples: playerCanBreedWith("Kylar"), or playerCanBreedWith($NPCList[0]) or playerCanBreedWith($NPCName[$NPCNameList.indexOf("Kylar")])
	 * Returns true or false. If you give it garbage, like a totally wrong name, it'll return false, so be careful about silent failures like that.
	 * Should be used for NPC breeding lines ONLY.
	 */
	if (typeof npc === "string") npc = V.NPCName[V.NPCNameList.indexOf(npc)];

	return (
		((V.player.vaginaExist || (canBeMPregnant() && C.npc[npc.fullDescription] && knowsAboutAnyPregnancy("pc", npc.fullDescription))) &&
			npc.penis !== "none") ||
		(V.player.penisExist && npc.vagina !== "none")
	);
}
window.playerCanBreedWith = playerCanBreedWith;

function pregnancyCompatible(NPC) {
	if (playerPregnancyPossibleWith(NPC) === false || NPCPregnancyPossibleWithPlayer(NPC) === false) return false;
	return true;
}
window.pregnancyCompatible = pregnancyCompatible;

function playerPregnancyPossibleWith(NPC) {
	/* Like the above function, this will accept either a named NPC's name, or an NPC object from either NPCList or NPCName.
	 * This one checks if the player could become pregnant, rather than the NPC.
	 * Returns true or false, as well as sets T.pregFalseReason, so writers can make events around the specific reason why a player and NPC might not be compatible for pregnancy at any given time.
	 */
	T.pregFalseReason = "";
	let NPCObject;
	if (typeof NPC === "string" || V.NPCNameList.includes(NPC.fullDescription)) {
		// Check if this is a named NPC, whether the function is provided a string or NPCList object that belongs to a named NPC
		NPCObject = V.NPCName[V.NPCNameList.indexOf(typeof NPC === "string" ? NPC : NPC.fullDescription)];

		const NPCNameCheck = NPCObject.fullDescription || NPCObject.description; // .description is only for backup, should not be needed in normal cases
		if (
			setup.pregnancy.infertile.includes(NPCNameCheck) ||
			(V.incompletePregnancyDisable !== "f" && C.npc[NPCNameCheck] && !setup.pregnancy.canImpregnatePlayer.includes(NPCNameCheck))
		) {
			T.pregFalseReason = "infertile";
			return false; // Check for named NPC being "infertile"
			// "this check is placed here because it only applies to named NPCs" - hwp told me to put this here
		}
	}
	if (!NPCObject) {
		if (typeof NPC === "object" && !Array.isArray(NPC) && NPC !== null) {
			NPCObject = NPC;
		} else {
			T.pregFalseReason = "invalidNpc";
			return false; // Check if the npc is valid
		}
	}
	if (getPregnancyObject().fetus.length) {
		T.pregFalseReason = "playerPregnant";
		return false; // Check if player is already pregnant
	}
	switch (NPCObject.type) {
		case "human":
			if (V.playerPregnancyHumanDisable === "t") {
				T.pregFalseReason = "pregnantDisabled";
				return false;
			} else break; // Check Human and Beast pregnancy settings
		case "wolf":
		case "wolfboy":
		case "wolfgirl":
			// case "bird":
			if (V.playerPregnancyBeastDisable === "t") {
				T.pregFalseReason = "pregnantDisabled";
				return false;
			} else break;
		// Check if NPC species can impregnate the player yet
		default:
			T.pregFalseReason = "pregnantTypeUnsupported";
			return false;
	}
	if (!((V.player.vaginaExist || canBeMPregnant()) && NPCObject.gender === "m")) {
		T.pregFalseReason = "genitals";
		return false; // Check for genital compatibility for player pregnancy
	}
	return true;
}
window.playerPregnancyPossibleWith = playerPregnancyPossibleWith;

function NPCPregnancyPossibleWithPlayer(NPC) {
	/* Like the above function, this will accept either a named NPC's name, or an NPC object from either NPCList or NPCName.
	 * This one checks if the NPC could become pregnant, rather than the player.
	 * Returns true or false, as well as sets T.pregFalseReason, so writers can make events around the specific reason why a player and NPC might not be compatible for pregnancy at any given time.
	 */
	T.pregFalseReason = "";
	let NPCObject;
	if (typeof NPC === "string" || V.NPCNameList.includes(NPC.fullDescription)) {
		// Check if this is a named NPC, whether the function is provided a string or NPCList object that belongs to a named NPC
		NPCObject = V.NPCName[V.NPCNameList.indexOf(typeof NPC === "string" ? NPC : NPC.fullDescription)];
		const NPCNameCheck = NPCObject.fullDescription || NPCObject.description;
		if (!C.npc[NPCNameCheck]) {
			Errors.report("Named NPC " + NPCNameCheck + " is undefined for pregnancy compatibility check.");
			return false;
		}
		if (setup.pregnancy.infertile.includes(NPCNameCheck) || !NPCObject.pregnancy.enabled) {
			T.pregFalseReason = "infertile";
			return false; // Check for named NPC being "infertile"
			// "this check is placed here because it only applies to named NPCs" - hwp told me to put this here too
		}
		if (NPCObject.pregnancy.fetus.length) {
			T.pregFalseReason = "npcPregnant";
			return false; // Check if named NPC is already pregnant
		}
	} else {
		NPCObject = NPC;
		if (NPCObject.pregnancy) {
			T.pregFalseReason = "npcPregnant";
			return false; // Check if random NPC is already pregnant
		}
	}
	if (V.npcPregnancyDisable === "t") {
		T.pregFalseReason = "pregnantDisabled";
		return false; // Check if NPC pregnancy is enabled or possible in settings
	}
	if (!setup.pregnancy.typesEnabled.includes(NPCObject.type)) {
		T.pregFalseReason = "pregnantTypeUnsupported";
		return false; // Check if NPC species can get impregnated by the player yet
	}
	if (!V.player.penisExist || NPCObject.gender === "m") {
		T.pregFalseReason = "genitals";
		return false; // Check for genital compatibility for NPC pregnancy
	}
	return true;
}
window.NPCPregnancyPossibleWithPlayer = NPCPregnancyPossibleWithPlayer;

// eslint-disable-next-line no-unused-vars
function wearingCondom(npcNumber) {
	let condom;
	if (!isNaN(npcNumber) && V.NPCList[npcNumber] && V.NPCList[npcNumber].condom) {
		condom = V.NPCList[npcNumber].condom;
	} else if (npcNumber === "player") {
		condom = V.player.condom;
	}
	if (condom && condom.worn) {
		if (condom.state === "defective") return "defective";
		if (condom.state === "sabotaged") return "sabotaged";
		return "worn";
	}
	return false;
}
window.wearingCondom = wearingCondom;

function makeAwareOfDetails() {
	let pregnancy;
	pregnancy = getPregnancyObject()
	pregnancy.awareOfDetails = true;
	pregnancy.potentialFathers = pregnancy.potentialFathers.filter(s => s.type === pregnancy.fetus[0].type);
}
DefineMacro("makeAwareOfDetails", makeAwareOfDetails);
