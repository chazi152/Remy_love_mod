function colourContainerClasses() {
	return (
		"hair-" +
		(V.haircolour || "").replace(/ /g, "-") +
		" " +
		"upper-" +
		(V.upperwet > 100 ? "wet" : "") +
		(V.worn.upper.colour_combat || V.worn.upper.colour || "").replace(/ /g, "-") +
		" " +
		"lower-" +
		(V.lowerwet > 100 ? "wet" : "") +
		(V.worn.lower.colour_combat || V.worn.lower.colour || "").replace(/ /g, "-") +
		" " +
		"under_lower-" +
		(V.underlowerwet > 100 ? "wet" : "") +
		(V.worn.under_lower.colour || "").replace(/ /g, "-") +
		" " +
		"under_upper-" +
		(V.underupperwet > 100 ? "wet" : "") +
		(V.worn.under_upper.colour || "").replace(/ /g, "-") +
		" " +
		"genitals-" +
		(V.worn.genitals.colour_combat || V.worn.genitals.colour || "").replace(/ /g, "-") +
		" " +
		"head-" +
		(V.worn.head.colour_combat || V.worn.head.colour || "").replace(/ /g, "-") +
		" " +
		"face-" +
		(V.worn.face.colour_combat || V.worn.face.colour || "").replace(/ /g, "-") +
		" " +
		"neck-" +
		(V.worn.neck.colour_combat || V.worn.neck.colour || "").replace(/ /g, "-") +
		" " +
		"hands-" +
		(V.worn.hands.colour_combat || V.worn.hands.colour || "").replace(/ /g, "-") +
		" " +
		"legs-" +
		(V.worn.legs.colour_combat || V.worn.legs.colour || "").replace(/ /g, "-") +
		" " +
		"feet-" +
		(V.worn.feet.colour_combat || V.worn.feet.colour || "").replace(/ /g, "-") +
		" " +
		"upper_acc-" +
		(V.worn.upper.accessory_colour_combat || V.worn.upper.accessory_colour || "").replace(/ /g, "-") +
		" " +
		"lower_acc-" +
		(V.worn.lower.accessory_colour_combat || V.worn.lower.accessory_colour || "").replace(/ /g, "-") +
		" " +
		"under_lower_acc-" +
		(V.worn.under_lower.accessory_colour_combat || V.worn.under_lower.accessory_colour || "").replace(/ /g, "-") +
		" " +
		"under_upper_acc-" +
		(V.worn.under_upper.accessory_colour_combat || V.worn.under_upper.accessory_colour || "").replace(/ /g, "-") +
		" " +
		"head_acc-" +
		(V.worn.head.accessory_colour_combat || V.worn.head.accessory_colour || "").replace(/ /g, "-") +
		" " +
		"face_acc-" +
		(V.worn.face.accessory_colour_combat || V.worn.face.accessory_colour || "").replace(/ /g, "-") +
		" " +
		"neck_acc-" +
		(V.worn.neck.accessory_colour_combat || V.worn.neck.accessory_colour || "").replace(/ /g, "-") +
		" " +
		"hands_acc-" +
		(V.worn.hands.accessory_colour_combat || V.worn.hands.accessory_colour || "").replace(/ /g, "-") +
		" " +
		"legs_acc-" +
		(V.worn.legs.accessory_colour_combat || V.worn.legs.accessory_colour || "").replace(/ /g, "-") +
		" " +
		"feet_acc-" +
		(V.worn.feet.accessory_colour_combat || V.worn.feet.accessory_colour || "").replace(/ /g, "-")
	);
}
window.colourContainerClasses = colourContainerClasses; // export function

function limitedColourContainerClasses() {
	return "hair-" + (V.haircolour || "").replace(/ /g, "-");
}
window.limitedColourContainerClasses = limitedColourContainerClasses; // export function

function debugColourContainerClasses(color) {
	return (
		"hair-" +
		(color.hair || "").replace(/ /g, "-") +
		" " +
		"upper-" +
		(color.upper[0] || "").replace(/ /g, "-") +
		" " +
		"lower-" +
		(color.lower[0] || "").replace(/ /g, "-") +
		" " +
		"under_lower-" +
		(color.under_lower[0] || "").replace(/ /g, "-") +
		" " +
		"under_upper-" +
		(color.under_upper[0] || "").replace(/ /g, "-") +
		" " +
		"head-" +
		(color.head[0] || "").replace(/ /g, "-") +
		" " +
		"face-" +
		(color.face[0] || "").replace(/ /g, "-") +
		" " +
		"neck-" +
		(color.neck[0] || "").replace(/ /g, "-") +
		" " +
		"hands-" +
		(color.hands[0] || "").replace(/ /g, "-") +
		" " +
		"legs-" +
		(color.legs[0] || "").replace(/ /g, "-") +
		" " +
		"feet-" +
		(color.feet[0] || "").replace(/ /g, "-") +
		" " +
		"upper_acc-" +
		(color.upper[1] || "").replace(/ /g, "-") +
		" " +
		"lower_acc-" +
		(color.lower[1] || "").replace(/ /g, "-") +
		" " +
		"under_lower_acc-" +
		(color.under_lower[1] || "").replace(/ /g, "-") +
		" " +
		"under_upper_acc-" +
		(color.under_upper[1] || "").replace(/ /g, "-") +
		" " +
		"head_acc-" +
		(color.head[1] || "").replace(/ /g, "-") +
		" " +
		"face_acc-" +
		(color.face[1] || "").replace(/ /g, "-") +
		" " +
		"neck_acc-" +
		(color.neck[1] || "").replace(/ /g, "-") +
		" " +
		"hands_acc-" +
		(color.hands[1] || "").replace(/ /g, "-") +
		" " +
		"legs_acc-" +
		(color.legs[1] || "").replace(/ /g, "-") +
		" " +
		"feet_acc-" +
		(color.feet[1] || "").replace(/ /g, "-")
	);
}
window.debugColourContainerClasses = debugColourContainerClasses; // export function

function getClothingCost(item, slot) {
	let cost = setup.clothes[slot][clothesIndex(slot, item)].cost * V.clothesPrice;

	if (
		setup.clothes.under_lower.findIndex(x => x.name === item.name && x.modder === item.modder) >= 0 ||
		setup.clothes.under_upper.findIndex(x => x.name === item.name && x.modder === item.modder) >= 0
	)
		cost *= V.clothesPriceUnderwear;
	else if (item.type.includes("school")) cost *= V.clothesPriceSchool;

	// the lewder item is, the more affected by the multiplier it is
	const lewdness = Math.clamp((item.reveal - 400) / 500, 0, 1);
	const lewdCoef = 1 + (V.clothesPriceLewd - 1) * lewdness;
	cost *= lewdCoef;

	if (V.passage === "School Library Shop") {
		cost *= 1.4 + ((V.delinquency - 500) / 5000 + (V.NPCName[V.NPCNameList.indexOf("Sydney")].love - 50) / -500);
	}

	return Math.round(cost);
}
window.getClothingCost = getClothingCost;

// Returns the price of the clothing item passed.
// If it's part of an outfit the price is 80% of the full outfit for the primary half
// and 80% for the other halves.
function tailorClothingCost(item, slot) {
	let cost = 0;
	if (setup.clothes[slot][clothesIndex(slot, item)].outfitSecondary) {
		let upperSlot = setup.clothes[slot][clothesIndex(slot, item)].outfitSecondary[0];
		let upperItem = setup.clothes[upperSlot].findIndex(x => x.name === setup.clothes[slot][clothesIndex(slot, item)].outfitSecondary[1]);
		if (upperItem >= 0) cost = setup.clothes[upperSlot][upperItem].cost * V.clothesPrice * .2;
	} else if (setup.clothes[slot][clothesIndex(slot, item)].outfitPrimary) {
		cost = setup.clothes[slot][clothesIndex(slot, item)].cost * V.clothesPrice * .8;
	} else {
		cost = setup.clothes[slot][clothesIndex(slot, item)].cost * V.clothesPrice;
	}
	
	if (
		setup.clothes.under_lower.findIndex(x => x.name === item.name && x.modder === item.modder) >= 0 ||
		setup.clothes.under_upper.findIndex(x => x.name === item.name && x.modder === item.modder) >= 0
	)
		cost *= V.clothesPriceUnderwear;
	else if (item.type.includes("school")) cost *= V.clothesPriceSchool;

	// the lewder item is, the more affected by the multiplier it is
	const lewdness = Math.clamp((item.reveal - 400) / 500, 0, 1);
	const lewdCoef = 1 + (V.clothesPriceLewd - 1) * lewdness;
	cost *= lewdCoef;

	return Math.round(cost);
}
window.tailorClothingCost = tailorClothingCost;

// makes all existing specified upper/lower clothes to be over_upper/over_lower
// it assumes that over_xxx equipment slots are empty, otherwise it will overwrite anything in those slots
// use this function in version update widget when over clothes will be ready
function convertNormalToOver() {
	const clothesToConvert = [
		"bathrobe",
		"bathrobe bottom",
		"peacoat",
		"shadbelly coat",
		"puffer jacket",
		"brown leather jacket",
		"black leather jacket",
		"vampire jacket",
	];

	// function that converts a clothing item
	const convertItem = item => {
		console.log("converting " + item.name);

		if (item.outfitPrimary) {
			Object.keys(item.outfitPrimary).forEach(slot => {
				if (slot === "upper" || slot === "lower") {
					item.outfitPrimary["over_" + slot] = item.outfitPrimary[slot];
					delete item.outfitPrimary[slot];
				}
			});
		} else if (item.outfitSecondary) {
			for (let i = 0; i < item.outfitSecondary.length; i += 2) {
				if (item.outfitSecondary[i] === "upper" || item.outfitSecondary[i] === "lower") {
					item.outfitSecondary[i] = "over_" + item.outfitSecondary[i];
				}
			}
		}
		if (item.set === "upper" || item.set === "lower") item.set = "over_" + item.set;

		return item;
	};

	for (const index in clothesToConvert) {
		const itemName = clothesToConvert[index];

		// convert clothing sets
		V.outfit.forEach(outf => {
			if (outf.upper === itemName) {
				outf.upper = "naked";
				outf.over_upper = itemName;
				if (outf.colors) {
					outf.colors.over_upper = outf.colors.upper;
					outf.colors.upper = [0, 0];
				}
			}
			if (outf.lower === itemName) {
				outf.lower = "naked";
				outf.over_lower = itemName;
				if (outf.colors) {
					outf.colors.over_lower = outf.colors.lower;
					outf.colors.lower = [0, 0];
				}
			}
		});

		// convert clothes in wardrobe
		for (let i = V.wardrobe.upper.length - 1; i >= 0; i--) {
			if (V.wardrobe.upper[i].name === itemName) {
				V.wardrobe.over_upper.push(convertItem(V.wardrobe.upper[i]));
				V.wardrobe.upper.splice(i, 1);
			}
		}
		for (let i = V.wardrobe.lower.length - 1; i >= 0; i--) {
			if (V.wardrobe.lower[i].name === itemName) {
				V.wardrobe.over_lower.push(convertItem(V.wardrobe.lower[i]));
				V.wardrobe.lower.splice(i, 1);
			}
		}

		// convert worn clothes
		if (V.worn.upper.name === itemName) {
			V.worn.over_upper = convertItem(V.worn.upper);
			V.worn.upper = clone(setup.clothes.upper[0]);
		}
		if (V.worn.lower.name === itemName) {
			V.worn.over_lower = convertItem(V.worn.lower);
			V.worn.lower = clone(setup.clothes.lower[0]);
		}

		// convert carried clothes
		if (V.carried.upper.name === itemName) {
			V.carried.over_upper = convertItem(V.carried.upper);
			V.carried.upper = clone(setup.clothes.upper[0]);
		}
		if (V.carried.lower.name === itemName) {
			V.carried.over_lower = convertItem(V.carried.lower);
			V.carried.lower = clone(setup.clothes.lower[0]);
		}

		// convert stripped stored clothes
		for (let i = V.store.upper.length - 1; i >= 0; i--) {
			if (V.store.upper[i].name === itemName) {
				V.store.over_upper.push(convertItem(V.store.upper[i]));
				V.store.upper.splice(i, 1);
			}
		}
		for (let i = V.store.lower.length - 1; i >= 0; i--) {
			if (V.store.lower[i].name === itemName) {
				V.store.over_lower.push(convertItem(V.store.lower[i]));
				V.store.lower.splice(i, 1);
			}
		}

		// convert try on stored
		if (V.tryOn.ownedStored.upper.name === itemName) {
			V.tryOn.ownedStored.over_upper = convertItem(V.tryOn.ownedStored.upper);
			V.tryOn.ownedStored.upper = clone(setup.clothes.upper[0]);
		}
		if (V.tryOn.ownedStored.lower.name === itemName) {
			V.tryOn.ownedStored.over_lower = convertItem(V.tryOn.ownedStored.lower);
			V.tryOn.ownedStored.lower = clone(setup.clothes.lower[0]);
		}

		// convert try on equipped
		if (V.tryOn.tryingOn.upper && V.tryOn.tryingOn.upper.name === itemName) {
			V.tryOn.tryingOn.over_upper = convertItem(V.tryOn.tryingOn.upper);
			V.tryOn.tryingOn.upper = null;
		}
		if (V.tryOn.tryingOn.lower && V.tryOn.tryingOn.lower.name === itemName) {
			V.tryOn.tryingOn.over_lower = convertItem(V.tryOn.tryingOn.lower);
			V.tryOn.tryingOn.lower = null;
		}
	}
}
window.convertNormalToOver = convertNormalToOver;

function getVisibleClothesList() {
	const visibleClothes = [V.worn.over_upper, V.worn.over_lower, V.worn.over_head, V.worn.face, V.worn.neck, V.worn.hands, V.worn.legs, V.worn.feet];
	// over_head doesn't have 'exposed' parameter, but maybe it will some day (in which case remove check for 'naked')
	if (V.worn.over_head.name === "naked" || V.worn.over_head.exposed >= 2) visibleClothes.push(V.worn.head);
	if (V.worn.over_upper.exposed >= 2 || V.overupperwetstage >= 3) visibleClothes.push(V.worn.upper);
	if (V.worn.over_lower.exposed >= 2 || V.overlowerwetstage >= 3) visibleClothes.push(V.worn.lower);
	if (V.worn.upper.exposed >= 2 || V.upperwetstage >= 3) visibleClothes.push(V.worn.under_upper);
	if (V.worn.lower.exposed >= 2 || V.lowerwetstage >= 3) visibleClothes.push(V.worn.under_lower);
	if (V.worn.under_lower.exposed >= 2 || V.underlowerwetstage >= 3) visibleClothes.push(V.worn.genitals);
	return visibleClothes;
}
window.getVisibleClothesList = getVisibleClothesList;

function playerChastity(slots, inAllSlots = false) {
	let chastity = false;
	const chastityCovered = [];
	if (!slots && V.worn.genitals.type.includes("chastity")) {
		// Used for general cases of chastity
		chastity = true;
	}
	if (typeof slots === "string" || slots instanceof String || Array.isArray(slots)) {
		// Genital Strings
		if (slots.includes("penis") && V.player.penisExist && V.worn.genitals.type.includesAny("cage", "hidden")) {
			chastity = true;
			if (!chastityCovered.includes("penis")) chastityCovered.push("penis");
		}
		if (slots.includes("vagina") && V.player.vaginaExist && V.worn.genitals.type.includes("hidden")) {
			chastity = true;
			if (!chastityCovered.includes("vagina")) chastityCovered.push("vagina");
		}
		if (slots.includes("anus") && V.worn.genitals.type.includes("chastity") && V.worn.genitals.anal_shield === 1) {
			chastity = true;
			if (!chastityCovered.includes("anus")) chastityCovered.push("anus");
		}

		// Type Strings
		if (slots.includes("hidden") && V.worn.genitals.type.includes("hidden")) {
			chastity = true;
			if (!chastityCovered.includes("penis")) chastityCovered.push("penis");
			if (!chastityCovered.includes("vagina")) chastityCovered.push("vagina");
		}
		if (slots.includes("cage") && V.worn.genitals.type.includes("cage")) {
			chastity = true;
			if (!chastityCovered.includes("penis")) chastityCovered.push("penis");
		}
	}
	if (inAllSlots && Array.isArray(slots) && ["penis", "vagina", "anus"].includes(slots)) {
		const slotsToInclude = slots.filter(e => ["penis", "vagina", "anus"].includes(e));
		if (slotsToInclude.count < chastityCovered.length) {
			return false;
		}
	}
	return chastity;
}
window.playerChastity = playerChastity;

/**
 * @description Takes in a passed item of clothing and returns its corresponding pair if it's an outfit part.
 * @param {object} garment The item of clothing that we want the second half of.
 * @param {string} layer  The layer the garment in being worn on.
 * @returns {object} If found, it will return the item of clothing that is the other half. If not, it returns null.
 */
function findOutfitPair(garment, layer) {
	const findLayer = layer.includes("upper") ? layer.replace("upper", "lower") : layer.replace("lower", "upper");
	let pair = null;

	// Makes sure that the clothing slot is not naked and contains the outfitPrimary or outfitSecondary value.
	if (garment.name !== "naked" && (garment.outfitPrimary || garment.outfitSecondary)) {
		const tempSet = setup.clothes[layer][garment.index].set;
		let costMod;
		if (layer.includes("under")) costMod = V.clothesPriceUnderwear;
		else costMod = V.clothesPrice;

		if (layer.includes("upper")) {
			// We are looking for lower items in this section
			// Does a quick check of the closest match indexes
			if (garment.index + 7 < setup.clothes[findLayer].length) {
				for (let i = 0; i <= 7; i++) {
					if (tempSet === setup.clothes[findLayer][garment.index + i].set) {
						pair = { ...setup.clothes[findLayer][garment.index + i] };
						break;
					}
					if (i >= 3) i++;
				}
			}
			// Searches the entire setup.clothing list for corresponding pair in ascending order as upper items are typically lower indexed than their lower counterpart.
			if (!pair) {
				for (let i = 1; i < setup.clothes[findLayer].length; i++) {
					if (tempSet === setup.clothes[findLayer][i].set) {
						pair = { ...setup.clothes[findLayer][i] };
						break;
					}
				}
			}

			if (pair) pair.cost = setup.clothes[layer][garment.index].cost * costMod;
		} else if (layer.includes("lower")) {
			// We are looking for upper items in this section
			// Does a quick check of the closest match indexes
			if (garment.index - 7 < setup.clothes[findLayer].length) {
				for (let i = 0; i <= 7; i++) {
					if (garment.index - i < 0) break;
					if (tempSet === setup.clothes[findLayer][garment.index - i].set) {
						pair = { ...setup.clothes[findLayer][garment.index - i] };
						break;
					}
					if (i >= 3) i++;
				}
			}
			// Searches the entire setup.clothing list for corresponding pair in descending order as upper items are typically lower indexed than their lower counterpart.
			if (!pair) {
				for (let i = setup.clothes[findLayer].length - 1; i >= 0; i--) {
					if (tempSet === setup.clothes[findLayer][i].set) {
						pair = { ...setup.clothes[findLayer][i] };
						break;
					}
				}
			}

			pair.cost *= costMod;
		}

		if (!pair)
			console.log(
				`No pair was found for ${garment.name} using the set name of ${tempSet} from the setup.clothes value. The passed item has set name ${garment.set}`
			);
	}

	return pair;
}
window.findOutfitPair = findOutfitPair;

/**
 * @description Looks over the clothing the player is wearing and returns any outfits halves that are missing. If no halves are missing, it returns an empty array.
 * @returns {object} An object that contains any missing halves of an outfit the player is wearing. Each outfit will have the values: wornHalf, brokenHalf, outfitSet, outfitName, outfitCost, and the index of the broken item
 */
function getOutfitPair() {
	const garmentLayers = ["upper", "under_upper", "over_upper", "lower", "under_lower", "over_lower"];
	const foundPairs = [];

	for (let i = 0; i < 6; i++) {
		if (V.worn[garmentLayers[i]].name === "naked") continue;
		const brokenHalf = i < 3 ? garmentLayers[i].replace("upper", "lower") : garmentLayers[i].replace("lower", "upper");
		if (V.worn[garmentLayers[i]].set === V.worn[brokenHalf].set) continue;
		const check = findOutfitPair(V.worn[garmentLayers[i]], garmentLayers[i]);
		if (check) {
			check.wornHalf = garmentLayers[i];
			check.brokenHalf = brokenHalf;
			check.colour = V.worn[garmentLayers[i]].colour;
			check.colour_sidebar = V.worn[garmentLayers[i]].colour_sidebar;
			check.colour_combat = V.worn[garmentLayers[i]].colour_combat;
			check.accessory = V.worn[garmentLayers[i]].accessory;
			check.accessory_colour = V.worn[garmentLayers[i]].accessory_colour;
			check.location = V.worn[garmentLayers[i]].location;
			foundPairs.push(check);
		}
	}

	return foundPairs;
}
window.getOutfitPair = getOutfitPair;

/**
 * @description Takes in an article of clothing that has been modified to contain the values brokenHalf and wornHalf that have the V.worn location of the outfit part that is broken or worn.
 * @param {object} brokenOutfit The clothing object. Currently it takes in a slightly modified setup.clothes values.
 */
function makeMissingOutfit(brokenOutfit) {
	const brokenHalf = brokenOutfit.brokenHalf;

	// Resets the remaining part. For lower items, make sure to change the set
	if (brokenOutfit.wornHalf.includes("upper")) {
		V.worn[brokenOutfit.wornHalf].outfitPrimary[brokenHalf] = brokenOutfit.name;
		brokenOutfit.cost = 0;
	} else {
		V.worn[brokenOutfit.wornHalf].outfitSecondary[1] = brokenOutfit.name;
	}

	// Resets the one_piece value and set values
	V.worn[brokenOutfit.wornHalf].one_piece = 1;
	V.worn[brokenOutfit.wornHalf].set = brokenOutfit.set;

	// Checks for any item worn in that place then puts it in the wardrobe
	if (V.worn[brokenHalf].name !== "naked") {
		$.wiki('<<generalUndress "wardrobe" ' + brokenHalf + ">>");
	}

	// Remove temporary values
	delete brokenOutfit.brokenHalf;
	delete brokenOutfit.wornHalf;

	// Equips the new piece into the now empty slot
	V.worn[brokenHalf] = brokenOutfit;
}
window.makeMissingOutfit = makeMissingOutfit;
