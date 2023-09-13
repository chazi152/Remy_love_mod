const maxCarried = 5; // maximum player can carry

function sexToysInventoryInit() {
	$(function () {
		const minCells = 12;
		const mainGrid = document.getElementById("sti_grid");
		if (mainGrid == null) return; // TODO: Log
		Object.keys(V.player.inventory.sextoys).forEach(category => {
			const setupItem = setup.sextoys.find(toy => toy.name === category);
			// look for each items owned of a particular type
			V.player.inventory.sextoys[category].forEach((item, index) => {
				if (setupItem) {
					const itemClassName = category.replace(/\s/g, "_") + "_" + index;
					const itemStatus = item.worn ? "worn" : item.carried ? "carried" : "";
					const itemColour = setupItem.colour === 1 ? "clothes-" + item.colour : "";
					mainGrid.innerHTML += `<div id="sti_item_${itemClassName}" class="sti_cell sti_full" onclick="window.sexToysInventoryOnItemClick(${index},\`${category}\`)" class="">
							<div style="position:relative;z-index: 1;">
								<div class="sti_already_owned">
								<span data-category="${category}" data-index="${index}" id="sti_already_owned_${itemClassName}" class="sti_owned_text">${itemStatus}</span>
								</div>
							</div>
							<img id="sti_item_icon_${itemClassName}" src="${setupItem.icon}" class="${itemColour}"></img>
							</div>
						</div>`;
				}
			});
		});
		while (mainGrid.childElementCount - 1 < minCells || (mainGrid.childElementCount - 1) % 4 !== 0) {
			// minimum of 12 cells. minimum 4 cells per row
			mainGrid.innerHTML += '<div class="sti_cell sti_empty"></div>';
		}
		mainGrid.innerHTML += `<div style="position: relative;">
				<div id="carryCount" class="sti_grid_carried_count"></div>
			</div>`;
		updateCarryCountUI();
	});
}
window.sexToysInventoryInit = sexToysInventoryInit;

function sexToysInventoryOnItemClick(index, category) {
	const item = setup.sextoys.find(obj => obj.name === category);
	if (item === undefined) {
		throw new Error(`Sex toy could not be found! index: [${index}]; category: [${category}]`);
	}
	/* grid item box class changes */
	const selectedBox = document.getElementsByClassName("sti_selected")[0];
	if (selectedBox) selectedBox.classList.remove("sti_selected");

	const invItem = V.player.inventory.sextoys[category][index];
	const invItemClassName = document.getElementById(`sti_item_icon_${item.name_underscore}_${index}`).className;

	$(`#sti_item_${item.name_underscore}_${index}`)[0].classList.add("sti_selected");
	/* description box */
	document.getElementById("sti_descContainer").innerHTML = `
	<div id="sti_desc_img" class="${invItemClassName}">
		<img style="" src="${item.icon}">
	</div>
	<div class="sti_desc_border">
		<div id="sti_desc">
			<div class="sti_closeContainer">
				<div class="sti_close" id="sti_close1" title="close" onclick="window.sextoysOnCloseDesc(\`stiDescPillContainer\`)">x</div>
			</div>
			<span style="color:#bcbcbc">${item.description}</span>
			<div id="sti_desc_action">
				<br><a id="stiCarryButton" onclick="window.sexToysInventoryOnCarryClick(${index},'${category}')" class="sti_carry_button">
					${invItem.carried ? "放回去" : "携带"}
				</a>
				${setup.sextoys[invItem.index].wearable === 1 ? "<br>" : ""}
				<a style="${setup.sextoys[invItem.index].wearable === 1 ? "" : "display: none;"}" id="stiWearButton"
					onclick="window.sexToysInventoryOnWearClick(${index},'${category}')" class="sti_wear_button">
						${invItem.worn ? "脱下" : "穿上"}
				</a>
				<br><a id="stiThrowButton" onclick="window.sexToysInventoryOnThrowClick(${index},'${category}')" class="sti_throw_button">
					丢掉
				</a>
			</div>
		</div>
	</div>`;
	document.getElementById("stiDescPillContainer").style.display = "";
	greyButtonsIfCarryLimitReached(index, category);
}
window.sexToysInventoryOnItemClick = sexToysInventoryOnItemClick;

/**
 * Top button.
 *
 * @param {number} index Position in category.
 * @param {string} category Type within sextoy inventory.
 * @returns {void}
 */
function sexToysInventoryOnCarryClick(index, category) {
	const toy = V.player.inventory.sextoys[category][index];
	const setupToy = setup.sextoys[toy.index];
	const setupCategory = setupToy.category;

	// if player has reached maximum item carried, stop the function
	if (!toy.carried && countCarriedSextoys() >= maxCarried) return;
	toy.carried = !toy.carried;

	if (toy.worn && setupCategory !== "strap-on") delete V.worn[setupCategory];

	// if player chose "Put back in the cupboard", also unwear the item
	if (!toy.carried) toy.worn = false;
	document.getElementById("stiWearButton").textContent = toy.worn ? "取下" : "戴上"; // update button text value
	document.getElementById("stiCarryButton").textContent = !toy.carried ? "携带" : "放回柜子"; // update button text value
	// update worn/carried tag on cell
	document.getElementById("sti_already_owned_" + category.replace(/\s/g, "_") + "_" + index).textContent = toy.worn ? "已穿上" : toy.carried ? "已携带" : "";

	// this is an exception for strap-ons. Upon "wearing", also set them in under_lower as they don't have their own category yet.
	if (setupCategory === "strap-on" && !toy.worn) {
		V.worn.under_lower = setup.clothes.under_lower[0];
		Wikifier.wikifyEval(" <<updatesidebarimg>>");
	}
	updateCarryCountUI();
	greyButtonsIfCarryLimitReached(index, category);
}
window.sexToysInventoryOnCarryClick = sexToysInventoryOnCarryClick;

/**
 * Mid button - "Wear it" / "Take off".
 *
 * @param {number} index Position.
 * @param {string} category Category within the inventory of sextoys.
 * @returns {void}
 */
function sexToysInventoryOnWearClick(index, category) {
	const toy = V.player.inventory.sextoys[category][index];
	const setupToy = setup.sextoys[toy.index];
	const setupCategory = setupToy.category;

	// if player tries to wear a strapon but that under_lower is cursed
	if (setupCategory === "strap-on" && V.worn.under_lower.cursed === 1) {
		document.getElementById("stiCursedText").outerHTML =
			`<div id="stiCursedText" class="ssm_fade_in">你尝试去掉` + V.worn.under_lower.cn_name_cap + `，但失败了</div>`;
		return;
	}

	if (setupCategory === "butt_plug") {
		if (V.worn.genitals.cursed === 1 && V.worn.genitals.anal_shield === 1) {
			// if player tries to wear a butt plug but there is a cursed chastity belt fitted with an anal shield
			document.getElementById("stiCursedText").outerHTML =
				`<div id="stiCursedText" class="ssm_fade_in">你无法将` + setupToy.namecap + `推进` + V.worn.genitals.cn_name_cap + `的菊穴护罩里</div>`;
			return;
		}
	}

	if (!toy.carried && countCarriedSextoys() >= maxCarried) {
		// if player has reached maximum item carried, stop the function
		return;
	}

	if (setupCategory !== "strap-on" && toy.worn) {
		delete V.worn[setupCategory];
	}
	// If player chose "Wear it"
	let cat;
	if (!toy.worn) {
		// retrieve main category of our item in setup.sextoys
		for (const sItem of setup.sextoys) {
			if (sItem.name === category) cat = sItem.category;
		}
		// search for items with same main category
		for (const sItem of setup.sextoys) {
			// we find item with same main category than the item we try to wear
			if (sItem.category === cat) {
				// we go through each of this item owned in player inventory
				for (const iItem in V.player.inventory.sextoys[sItem.name]) {
					// we unwear each of them.
					V.player.inventory.sextoys[sItem.name][iItem].worn = false;
				}
			}
		}
	}
	// then wear chose item.
	toy.worn = !toy.worn;
	if (setupCategory !== "strap-on") {
		V.worn[setupCategory] = toy;
		V.worn[setupCategory].state = "worn";
	}
	toy.carried = true; // also carry the item if not done alreadys
	document.getElementById("stiWearButton").textContent = toy.worn ? "取下" : "戴上"; // update button text value
	document.getElementById("stiCarryButton").textContent = !toy.carried ? "携带" : "放回柜子"; // update button text value
	document.getElementById("sti_already_owned_" + category.replace(/\s/g, "_") + "_" + index).textContent = toy.worn ? "已穿上" : toy.carried ? "已携带" : "";
	$("[id*='sti_already_owned_']").each(function (i, element) {
		const c = element.getAttribute("data-category");
		const ind = element.getAttribute("data-index");
		element.textContent = V.player.inventory.sextoys[c][ind].worn ? "已穿戴" : V.player.inventory.sextoys[c][ind].carried ? "已携带" : "";
	});
	// this is an exception for strap-ons. Upon "wearing", also set them in under_lower as they don't have their own category yet.
	if (setupCategory === "strap-on") {
		if (toy.worn) {
			Wikifier.wikifyEval(' <<underlowerundress "wardrobe">>');
			V.worn.under_lower = Object.assign({}, setup.clothes.under_lower[toy.clothes_index], {
				colour: toy.colour,
			});
		} else {
			V.worn.under_lower = setup.clothes.under_lower[0];
		}
		Wikifier.wikifyEval(" <<updatesidebarimg>>");
	}
	updateCarryCountUI();
	greyButtonsIfCarryLimitReached(index, category);
}
window.sexToysInventoryOnWearClick = sexToysInventoryOnWearClick;

function sexToysInventoryOnThrowClick(index, category) {
	const playerItem = V.player.inventory.sextoys[category][index];
	const setupCategory = setup.sextoys[playerItem.index].category;
	const lastIndex = document.getElementById("sti_grid").childElementCount - 1;
	const categoryName = category.replace(/\s/g, "_");
	/* remove div */
	document.getElementById(`sti_item_${categoryName}_${index}`).remove();
	/* add new empty div */
	document.getElementById("sti_grid").children[lastIndex - 2].outerHTML += `<div class="sti_cell sti_empty"></div>`;
	/* close description */
	sextoysOnCloseDesc("stiDescPillContainer");
	if (playerItem.worn && setupCategory !== "strap-on") {
		delete V.worn[setupCategory];
	}
	/* handle strapons */
	if (setupCategory === "strap-on") {
		V.worn.under_lower = setup.clothes.under_lower[0];
		setLowerVisibility(true);
	}
	/* remove item from inventory object */
	V.player.inventory.sextoys[category].splice(index, 1);
	$("[id*='sti_item']").each(function (i, element) {
		updateNumberInString(element, index, category);
	});
	$("[id*='sti_already_owned']").each(function (i, element) {
		updateNumberInString(element, index, category);
	});
	updateCarryCountUI();
}
window.sexToysInventoryOnThrowClick = sexToysInventoryOnThrowClick;

function sextoysOnCloseDesc(id) {
	document.getElementById(id).style.display = "none";
	/* grid item box class changes */
	const selectedBox = document.getElementsByClassName("sti_selected")[0];
	if (selectedBox) selectedBox.classList.remove("sti_selected");
}
window.sextoysOnCloseDesc = sextoysOnCloseDesc;

function updateNumberInString(element, indexMin, category) {
	// No need to update, this element is unrelated.
	if (!element.id.contains(category.replace(/\s/g, "_"))) return;

	// extract the index from the element's ID and force it into a number.
	const index = parseInt(element.id.match(/\d+$/)[0]);

	if (isNaN(index)) throw new Error(`Misconfigured sex toy ID: ${element.id}`);
	// No need to update, this element comes BEFORE the removed item, so its index is unaffected.
	if (index < indexMin || index <= 0) return;

	element.id = element.id.replace(/\d+/, index - 1);
	if (element.getAttribute("onclick")) element.setAttribute("onclick", `window.sexToysInventoryOnItemClick(${index - 1},\`${category}\`)`);
}

function checkSextoysGift(npcName) {
	const npc = V.NPCName.find(n => n.nam === npcName);
	if (!npc) {
		throw new Error("Invalid NPC name given!");
	} else {
		return Object.values(npc.sextoys).some(category => category.some(item => item.gift_state === "held"));
	}
}
window.checkSextoysGift = checkSextoysGift;

function listUniqueCarriedSextoys() {
	const list = [];
	Object.values(V.player.inventory.sextoys).forEach(category => category.filter(item => item.carried).forEach(item => list.push(item)));
	return list;
}
window.listUniqueCarriedSextoys = listUniqueCarriedSextoys;

function playerHasSexToys() {
	return Object.values(V.player.inventory.sextoys).some(category => category.length > 0);
}
window.playerHasSexToys = playerHasSexToys;

function straponExceptionWearOff() {
	V.player.inventory.sextoys.forEach(category => {
		category.forEach(item => {
			if (item.name === V.worn.under_lower.name) item.worn = false;
		});
	});
}
window.straponExceptionWearOff = straponExceptionWearOff;

function patchStraponsWearStatus() {
	Object.values(V.player.inventory.sextoys).forEach(category =>
		category
			.filter(strapon => strapon.type.includes("strap-on"))
			.forEach(strapon => {
				if (strapon.name !== V.worn.under_lower.name) strapon.worn = false;
				else if (strapon.colour === V.worn.under_lower.colour) strapon.worn = true;
			})
	);
}
window.patchStraponsWearStatus = patchStraponsWearStatus;

function checkIfNPCHasCategorySextoy(npcName, category) {
	const npc = V.NPCName.find(n => n.nam === npcName);
	if (!npc) {
		throw new Error("Invalid NPC name given!");
	}

	const categoryToyNames = Object.values(setup.sextoys)
		.filter(n => n.category === category)
		.map(n => n.name);
	if (categoryToyNames.length === 0) {
		throw new Error("Invalid sex toy category given!");
	}

	const npcSexToys = [];
	Object.values(npc.sextoys).forEach(category => {
		category.forEach(item => {
			if (categoryToyNames.includes(item.name) && item.gift_state !== "held") npcSexToys.push(item);
		});
	});
	return npcSexToys;
}
window.checkIfNPCHasCategorySextoy = checkIfNPCHasCategorySextoy;

function handSextoysGiftToNPC(npcName) {
	const npc = V.NPCName.find(n => n.nam === npcName);
	if (!npc) {
		throw new Error("Invalid NPC name given!");
	}
	Object.values(npc.sextoys).forEach(category => {
		category.forEach(item => {
			if (item.gift_state === "held") item.gift_state = "received";
		});
	});
}
window.handSextoysGiftToNPC = handSextoysGiftToNPC;

function findIndexInNPCNameVar(npcName) {
	for (const npc in V.NPCName) {
		if (V.NPCName[npc].nam.toLowerCase() === npcName.toLowerCase()) return npc;
	}
}
window.findIndexInNPCNameVar = findIndexInNPCNameVar;

function countCarriedSextoys() {
	let count = 0;

	Object.values(V.player.inventory.sextoys).forEach(category => {
		count += category.filter(item => item.carried).length;
	});
	return count;
}
window.countCarriedSextoys = countCarriedSextoys;

function updateCarryCountUI() {
	const colour = countCarriedSextoys() >= maxCarried ? "red" : "";
	document.getElementById("carryCount").outerHTML = `<div id="carryCount" class="sti_grid_carried_count">
		携带物品：<span class="${colour}">${countCarriedSextoys()}/${maxCarried}</span>
	</div>`;
}
window.updateCarryCountUI = updateCarryCountUI;

function greyButtonsIfCarryLimitReached(index, category) {
	if (countCarriedSextoys() >= maxCarried) {
		const item = V.player.inventory.sextoys[category][index];
		if (!item.carried) {
			document.getElementById("stiCarryButton").classList.add("sti_carry_limit_reached");
			if (!item.worn) document.getElementById("stiWearButton").classList.add("sti_carry_limit_reached");
		}
	}
}
window.greyButtonsIfCarryLimitReached = greyButtonsIfCarryLimitReached;

function wardrobeStripStraponException(itemName) {
	V.player.inventory.sextoys[itemName].forEach(item => (item.worn = false));
	V.worn.under_lower = setup.clothes.under_lower[0];
}
window.wardrobeStripStraponException = wardrobeStripStraponException;

function tempHideLower() {
	if (T.lowerVisible === undefined) T.lowerVisible = true;
	setLowerVisibility(!T.lowerVisible);
}
window.tempHideLower = tempHideLower;

function setLowerVisibility(desiredVisibility) {
	T.lowerVisible = desiredVisibility;
	if (!T.lowerVisible) {
		const tmp = V.worn.lower;
		V.worn.lower = setup.clothes.lower[0];
		Wikifier.wikifyEval("<<updatesidebarimg>>");
		V.worn.lower = tmp;
	} else {
		Wikifier.wikifyEval("<<updatesidebarimg>>");
	}

	const elem = document.querySelector("#stiShowUnderwear > .link-internal");
	if (elem !== null) elem.text = !T.lowerVisible ? "展示内衣" : "藏起内衣";

	Links.generateLinkNumbers($(".passage"));
}
window.setLowerVisibility = setLowerVisibility;
