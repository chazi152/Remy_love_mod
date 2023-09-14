/* Read this if you plan on modifying setup.sextoys
 * wearable should be set to 1 if item can be worn. Otherwise, set it to 1 (You can't wear a dildo, but you can wear a strapon.)
 * category is used to know which item cannot be worn together. If two items have same category, wearing one will unwear the other.
 * **Do not** change the indexes, and do not move any objects in setup.sextoys array
 * If you need to add new items, add them at the end of the list, and set their index equal to their place in the array. First item has index 0, second item index 1 etc.
 * to be completed.
 */

setup.sextoyFunctions = {
	notExists: name => V.player.inventory.sextoys[name] === undefined,
	owned(name) {
		if (setup.sextoyFunctions.notExists(name)) return 0;
		return V.player.inventory.sextoys[name].length();
	},
	isCarried(name) {
		if (setup.sextoyFunctions.notExists(name)) return false;
		return V.player.inventory.sextoys[name].some(item => item.carried);
	},
	isWorn(name) {
		if (setup.sextoyFunctions.notExists(name)) return false;
		if (V.player.inventory.sextoys[name].type.includes("strap-on")) {
			return V.worn.under_lower.type.includes("strap-on");
		} else {
			return V.player.inventory.sextoys[name].some(item => item.worn);
		}
	},
	unWear(name) {
		if (setup.sextoyFunctions.notExists(name)) return;
		V.player.inventory.sextoys[name].forEach(item => (item.worn = 0));
	},
	unCarry(name) {
		if (setup.sextoyFunctions.notExists(name)) return;
		V.player.inventory.sextoys[name].forEach(item => {
			item.worn = 0;
			item.carried = 0;
		});
	},
};

setup.sextoys = [
	{
		index: 0,
		name: "dildo",
		namecap: "假阳具",
		name_underscore: "dildo",
		description: "一根有六英寸长的假阳具。",
		cost: 5000,
		category: "dildo",
		wearable: 0,
		size: 2,
		type: ["dildo"],
		icon: "img/misc/icon/sexToys/dildo.png",
		colour: 1,
		colour_options: ["black", "blue", "teal", "lime-green", "light-pink", "purple", "tan", "brown", "red"],
		owned: setup.sextoyFunctions.owned,
		isCarried: setup.sextoyFunctions.isCarried,
		isWorn: setup.sextoyFunctions.isWorn,
		unWear: setup.sextoyFunctions.unWear,
		unCarry: setup.sextoyFunctions.unCarry,
		display_condition: () => 1,
	},
	{
		index: 1,
		name: "small dildo",
		namecap: "小型假阳具",
		name_underscore: "small_dildo",
		description: "适合初学者的玩具。",
		cost: 4000,
		category: "dildo",
		wearable: 0,
		size: 1,
		type: ["dildo"],
		icon: "img/misc/icon/sexToys/dildo_small.png",
		colour: 1,
		colour_options: ["black", "blue", "teal", "lime-green", "light-pink", "purple", "tan", "brown", "red"],
		owned: setup.sextoyFunctions.owned,
		isCarried: setup.sextoyFunctions.isCarried,
		isWorn: setup.sextoyFunctions.isWorn,
		unWear: setup.sextoyFunctions.unWear,
		unCarry: setup.sextoyFunctions.unCarry,
		display_condition: () => 1,
	},
	{
		index: 2,
		name: "anal beads",
		namecap: "肛门拉珠",
		name_underscore: "anal_beads",
		description: "用于肛门调教，该物品可以戴在屁股上或是直接玩弄它。",
		cost: 8000,
		type: ["dildo", "anal"],
		category: "butt_plug",
		wearable: 1,
		size: 2,
		icon: "img/misc/icon/sexToys/analbeads.png",
		colour: 1,
		colour_options: ["black", "blue", "teal", "lime-green", "light-pink", "purple", "tan", "brown", "red"],
		owned: setup.sextoyFunctions.owned,
		isCarried: setup.sextoyFunctions.isCarried,
		isWorn: setup.sextoyFunctions.isWorn,
		unWear: setup.sextoyFunctions.unWear,
		unCarry: setup.sextoyFunctions.unCarry,
		display_condition: () => 1,
	},
	{
		index: 3,
		name: "bullet vibe",
		namecap: "子弹型跳蛋",
		name_underscore: "bullet_vibe",
		description: "该物品产生的震动能让人剧烈高潮。很适合刚开始接触性玩具的人。",
		cost: 12000,
		wearable: 0,
		size: 0,
		category: "vibrator",
		type: ["dildo", "vibrator"],
		icon: "img/misc/icon/sexToys/bulletvibe.png",
		colour: 0,
		colour_options: [],
		default_colour: "pink",
		owned: setup.sextoyFunctions.owned,
		isCarried: setup.sextoyFunctions.isCarried,
		isWorn: setup.sextoyFunctions.isWorn,
		unWear: setup.sextoyFunctions.unWear,
		unCarry: setup.sextoyFunctions.unCarry,
		display_condition: () => 1,
	},
	{
		index: 4,
		name: "butt plug",
		namecap: "肛塞",
		name_underscore: "butt_plug",
		description: "用于肛门调教，该物品可以戴在屁股上或是直接玩弄它。",
		cost: 8000,
		wearable: 1,
		size: 2,
		category: "butt_plug",
		type: ["dildo", "anal"],
		icon: "img/misc/icon/sexToys/buttplug.png",
		colour: 1,
		colour_options: ["black", "blue", "teal", "lime-green", "light-pink", "purple", "tan", "brown", "red"],
		owned: setup.sextoyFunctions.owned,
		isCarried: setup.sextoyFunctions.isCarried,
		isWorn: setup.sextoyFunctions.isWorn,
		unWear: setup.sextoyFunctions.unWear,
		unCarry: setup.sextoyFunctions.unCarry,
		display_condition: () => 1,
	},
	{
		index: 5,
		name: "strap-on",
		namecap: "穿戴式假阳具",
		name_underscore: "strap-on",
		clothes_index: 33,
		description: "穿戴在臀部，用于抽插做爱。",
		cost: 8000,
		wearable: 1,
		size: 2,
		category: "strap-on",
		type: ["strap-on", "fetish"],
		icon: "img/misc/icon/clothes/strap-on.png",
		colour: 1,
		shape: "cock",
		colour_options: ["black", "blue", "green", "pink", "purple", "red", "white", "yellow", "tan", "brown"],
		owned: setup.sextoyFunctions.owned,
		isCarried: setup.sextoyFunctions.isCarried,
		isWorn: setup.sextoyFunctions.isWorn,
		unWear: setup.sextoyFunctions.unWear,
		unCarry: setup.sextoyFunctions.unCarry,
		display_condition: () => 1,
	},
	{
		index: 6,
		name: "strap-on horse cock",
		namecap: "穿戴式马阳具",
		name_underscore: "strap-on_horse_cock",
		clothes_index: 34,
		description: "新奇的马屌，能戴在你的髋部上，行房用。",
		cost: 8000,
		wearable: 1,
		size: 4,
		category: "strap-on",
		type: ["strap-on", "fetish"],
		icon: "img/misc/icon/clothes/strap-on_horse_cock.png",
		colour: 1,
		shape: "horse cock",
		colour_options: ["black", "blue", "green", "pink", "purple", "red", "white", "yellow", "tan", "brown"],
		owned: setup.sextoyFunctions.owned,
		isCarried: setup.sextoyFunctions.isCarried,
		isWorn: setup.sextoyFunctions.isWorn,
		unWear: setup.sextoyFunctions.unWear,
		unCarry: setup.sextoyFunctions.unCarry,
		display_condition: () => 1,
	},
	{
		index: 7,
		name: "strap-on knotted cock",
		namecap: "有锁结的穿戴式假阳具",
		name_underscore: "strap-on_knotted_cock",
		clothes_index: 35,
		description: "造型奇特的狗屌。穿戴在臀部，用于抽插做爱。",
		cost: 8000,
		wearable: 1,
		size: 3,
		category: "strap-on",
		type: ["strap-on", "fetish"],
		icon: "img/misc/icon/clothes/strap-on_knotted_cock.png",
		colour: 1,
		colour_options: ["black", "blue", "green", "pink", "purple", "red", "white", "yellow", "tan", "brown"],
		shape: "knotted cock",
		owned: setup.sextoyFunctions.owned,
		isCarried: setup.sextoyFunctions.isCarried,
		isWorn: setup.sextoyFunctions.isWorn,
		unWear: setup.sextoyFunctions.unWear,
		unCarry: setup.sextoyFunctions.unCarry,
		display_condition: () => 1,
	},
	{
		index: 8,
		name: "lube",
		namecap: "润滑液",
		name_underscore: "lube",
		description: "适合用于色色的润滑液。一瓶可以用 3 次。",
		cost: 2000,
		wearable: 0,
		size: 3,
		category: "lube",
		type: ["lube"],
		icon: "img/misc/icon/sexToys/lube.png",
		colour: 1,
		uses: 3,
		colour_options: ["pink"],
		default_colour: "pink",
		owned: setup.sextoyFunctions.owned,
		isCarried: setup.sextoyFunctions.isCarried,
		isWorn: setup.sextoyFunctions.isWorn,
		unWear: setup.sextoyFunctions.unWear,
		unCarry: setup.sextoyFunctions.unCarry,
		display_condition: () => 1,
	},
	{
		index: 9,
		name: "stroker",
		namecap: "飞机杯",
		name_underscore: "stroker",
		description: "一个阴茎自慰套，材质的质感与肉体相近。",
		cost: 8000,
		wearable: 0,
		category: "stroker",
		type: ["stroker"],
		icon: "img/misc/icon/sexToys/onahole.png",
		colour: 1,
		colour_options: ["black", "blue", "teal", "lime-green", "light-pink", "purple", "tan", "brown", "red"],
		owned: setup.sextoyFunctions.owned,
		isCarried: setup.sextoyFunctions.isCarried,
		isWorn: setup.sextoyFunctions.isWorn,
		unWear: setup.sextoyFunctions.unWear,
		unCarry: setup.sextoyFunctions.unCarry,
		display_condition: () => 1,
	},
	{
		index: 10,
		name: "aphrodisiac pills",
		namecap: "春药",
		name_underscore: "aphrodisiac_pills",
		description: "一包三片装的春药。使用说明上声称在性爱前'适量'服用，体验就会更强烈。",
		cost: 4000,
		wearable: 0,
		size: 3,
		category: "aphrodisiacpill",
		type: ["aphrodisiacpill"],
		icon: "img/misc/icon/sexToys/aphrodisiacpill.png",
		colour: 0,
		uses: 3,
		colour_options: ["pink"],
		default_colour: "pink",
		owned: setup.sextoyFunctions.owned,
		isCarried: setup.sextoyFunctions.isCarried,
		isWorn: setup.sextoyFunctions.isWorn,
		unWear: setup.sextoyFunctions.unWear,
		unCarry: setup.sextoyFunctions.unCarry,
		display_condition: () => 1,
	},
	{
		index: 11,
		name: "breast pump",
		namecap: "挤奶器",
		name_underscore: "breast_pump",
		description: "一个手动挤奶器。",
		cost: 5000,
		wearable: 0,
		size: 3,
		category: "breastpump",
		type: ["breastpump"],
		icon: "img/misc/icon/sexToys/handheld_pump.png",
		colour: 1,
		colour_options: ["pink", "purple", "blue", "light-pink", "yellow"],
		default_colour: ["pink", "purple", "blue", "light-pink", "yellow"],
		owned: setup.sextoyFunctions.owned,
		isCarried: setup.sextoyFunctions.isCarried,
		isWorn: setup.sextoyFunctions.isWorn,
		unWear: setup.sextoyFunctions.unWear,
		unCarry: setup.sextoyFunctions.unCarry,
		display_condition: () => 1, // Found at the pharmacy as well
	},
];

function sexShopGridInit() {
	$(function () {
		for (const item of setup.sextoys) {
			if (item.display_condition()) window.sexShopGridAddItemBox(item);
		}
	});
}
window.sexShopGridInit = sexShopGridInit;

function sexShopGridAddItemBox(item) {
	document.getElementById("sexShopMenuContainer").innerHTML += `
	<div class="ssm_item" id="ssm_item_${item.name_underscore}" onclick="window.sexShopOnItemClick(${item.index})">
		<div class="ssm_icon">
			<img id="ssm_item_icon_${item.name_underscore}" src="${item.icon}" class="${item.colour === 1 ? "clothes-" + item.colour_options.random() : ""}">
		</div>
		<div class="ssm_details">
			<div class="ssm_item_name">
				${item.namecap}
			</div>
			<div class="ssm_already_owned">
				${item.owned() > 0 ? '<span class="ssm_owned_text">已拥有</span>' : ""}
			</div>
		</div>
	</div>
	`;
}
window.sexShopGridAddItemBox = sexShopGridAddItemBox;

function sexShopOnColourClick(colour) {
	for (const elem of document.getElementsByClassName("colour-button div-link ")) elem.classList.remove("active");
	document.querySelectorAll(`[colour-name="${colour}"]`)[0].classList.add("active");
	document.getElementById("ssm_desc_img").className = "clothes-" + colour;
}
window.sexShopOnColourClick = sexShopOnColourClick;

function removeClassNameAt(id) {
	const elements = document.getElementsByClassName(id);
	for (const element of elements) {
		element.classList.remove(id);
	}
}

function sexShopOnCloseDesc(id) {
	const element = document.getElementById(id);
	if (element == null) {
		// TODO: Log
		return;
	}
	element.style.display = "none";

	/* grid item box class changes */
	removeClassNameAt("ssm_selected_a");
	removeClassNameAt("ssm_selected_b");
	removeClassNameAt("ssm_selected_c");
}
window.sexShopOnCloseDesc = sexShopOnCloseDesc;

function sexShopOnItemClick(index) {
	const item = setup.sextoys[index];
	let coloringDiv = "";

	/* clear "Bought!/Buy it" fade in setTimeout from window.sexShopOnBuyClick */
	if (sexShopOnGiftClick.counter !== undefined && sexShopOnGiftClick.counter !== "off") {
		clearTimeout(sexShopOnGiftClick.counter);
		sexShopOnGiftClick.counter = "off";
	}
	if (sexShopOnBuyClick.counter !== undefined && sexShopOnBuyClick.counter !== "off") {
		clearTimeout(window.sexShopOnBuyClick.counter);
		sexShopOnBuyClick.counter = "off";
	}
	/* grid item box class changes */
	removeClassNameAt("ssm_selected_a");
	removeClassNameAt("ssm_selected_b");
	removeClassNameAt("ssm_selected_c");
	$(`#ssm_item_${item.name_underscore}`)[0].classList.add("ssm_selected_a");
	$(`#ssm_item_${item.name_underscore} > .ssm_details > .ssm_item_name`)[0].classList.add("ssm_selected_b");
	$(`#ssm_item_${item.name_underscore} > .ssm_details > .ssm_already_owned`)[0].classList.add("ssm_selected_c");
	/* description/buying box */
	for (const index in item.colour_options) {
		coloringDiv +=
			(index === 0
				? `<br><span style="color: #e0e0e0">Colours to choose from : </span><div id="ssm_colour_panel" class="colour-options-div"><br> `
				: "") +
			`
			<div colour-name="${item.colour_options[index]}" onclick="window.sexShopOnColourClick(\`${item.colour_options[index]}\`)" class="colour-button div-link">
				<div class="bg-${item.colour_options[index]}">
					<span class="capitalize colour-name-span">${item.colour_options[index]}</span>
					<a tabindex="0"></a>
				</div>
			</div>`;
	}
	coloringDiv += "</div>";
	document.getElementById("ssm_descContainer").innerHTML =
		`<div id="ssm_desc_img" class="` +
		document.getElementById("ssm_item_icon_" + item.name_underscore).className +
		`">
		<img style="" src="${item.icon}">
	</div>
	<div class="ssm_desc_border">
		<div id="ssm_desc">
			<div class="ssm_closeContainer">
				<div class="ssm_close" id="ssm_close1" title="close" onclick="window.sexShopOnCloseDesc(\`ssmDescPillContainer\`)">x
				</div>
			</div>
			<span style="color: #bcbcbc">${item.description}</span>
			<div id="ssm_desc_action">${coloringDiv}<div style="text-align: center;">
				<br>
				` +
		(V.money >= item.cost
			? `<a id="ssmBuyButton" onclick="window.sexShopOnBuyClick(${item.index})" class="ssm_buy_button">
					买下它
				</a> (<span class="gold">£` +
			  item.cost / 100 +
			  `</span>)`
			: `<span class="ssm_not_enough_money">Not enough money</span> (<span class="gold">£${item.cost / 100}</span>)`) +
		(item.type.includes("strap-on") ? determineRecipient(item.index) : "") +
		`</div>
			</div>
		</div>
	</div>
	`;
	document.getElementById("ssmDescPillContainer").style.display = "";
}
window.sexShopOnItemClick = sexShopOnItemClick;

// conditions for gifting items to people
function determineRecipient(index) {
	const item = setup.sextoys[index];
	let optionBuilder = "";

	const giftBr = document.getElementById("giftBr");
	if (giftBr != null) giftBr.remove();

	// Add 15$ for gifting paperwrap
	if (V.money < item.cost + 15 * 100) return "";

	for (const li of ["Alex", "Eden", "Kylar", "Robin", "Sydney"]) {
		if (isLoveInterest(li)) {
			optionBuilder += `<option value="${li}">${li}</option>`;
		}
	}
	// if no possible recipient, return.
	if (optionBuilder === "") return "";
	const builder = `<br id="giftBr"><a id="ssmGiftButton" onclick="window.sexShopOnGiftClick(${item.index})" class="ssm_gift_button">
	送给: </a><select name="recipient" id="recipientList">${optionBuilder}</select>
	<div id="spanGift">(<span class="gold">£${item.cost / 100 + 15}</span>)</div>`;
	return builder;
}
window.determineRecipient = determineRecipient;

function sexShopOnGiftClick(index) {
	const item = setup.sextoys[index];
	const iconClassName = document.getElementById("ssm_desc_img").className;
	let recipient = document.getElementById("recipientList").value.toLowerCase();

	// Leaving window in because of file order, that I don't want to deal with.
	recipient = window.findIndexInNPCNameVar(recipient);
	if (recipient === undefined) return;

	sexShopOnGiftClick.counter = sexShopOnGiftClick.counter || "off";
	/* add item to NPC's inventory */
	if (V.NPCName[recipient].sextoys == null) V.NPCName[recipient].sextoys = {};
	if (V.NPCName[recipient].sextoys[item.name] == null) V.NPCName[recipient].sextoys[item.name] = [];
	const obj = {
		index: item.index,
		name: item.name,
		namecap: item.namecap,
		colour: iconClassName === "" ? item.default_colour : iconClassName.substring(iconClassName.indexOf("-") + 1),
		worn: false,
		size: item.size,
		carried: false,
		state: "worn",
		state_base: "worn",
		gift_state: "held",
		uses: item.uses ? item.uses : undefined,
		shape: item.shape ? item.shape : undefined,
	};
	if (Array.isArray(obj.colour)) obj.colour = obj.colour[random(0, obj.colour.length)];
	if (item.category === "strap-on") {
		obj.clothes_index = item.clothes_index;
	}
	V.NPCName[recipient].sextoys[item.name].push(obj);
	/* withdraw money from player */
	V.money -= item.cost + 15 * 100;

	/* update sidebar money */
	updateSideBarMoney();

	/* fade in/out bought green text indicator */
	document.getElementById("ssmGiftButton").outerHTML = `<span class="ssm_gift_button ssm_fade_in" id="ssmGiftButton" style="color:#97de97">Bought!</span>`;
	document.getElementById("recipientList").remove();
	document.getElementById("spanGift").remove();
	if (sexShopOnGiftClick.counter === "off") {
		sexShopOnGiftClick.counter = setTimeout(function () {
			document.getElementById("ssmGiftButton").outerHTML = determineRecipient(index);
			sexShopOnGiftClick.counter = "off";
		}, 1400);
	}
}
window.sexShopOnGiftClick = sexShopOnGiftClick;

function sexShopOnBuyClick(index, inSexShop = true, colour, costsMoney = true) {
	const item = setup.sextoys[index];
	let iconClassName = "";
	if (inSexShop) {
		iconClassName = document.getElementById("ssm_desc_img").className;
		sexShopOnBuyClick.counter = sexShopOnBuyClick.counter || "off";
	}
	/* add item to player inventory */
	if (V.player.inventory.sextoys[item.name] === undefined) V.player.inventory.sextoys[item.name] = [];
	const obj = {
		index: item.index,
		colour: iconClassName === "" ? item.default_colour : iconClassName.substring(iconClassName.indexOf("-") + 1),
		name: item.name,
		namecap: item.namecap,
		worn: false,
		type: item.type,
		size: item.size,
		// "sizeDesc": {0: "", 1: "", 2: "", 3: "large", 4: "massive"}[item.size],
		// "desc": (this.sizeDesc + " " + this.colour + " " + this.name),
		carried: false,
		state: "removed",
		state_base: "worn",
		shape: item.shape ? item.shape : undefined,
		uses: item.uses ? item.uses : undefined,
	};
	if (item.category === "strap-on") {
		obj.clothes_index = item.clothes_index;
	}
	if (colour && item.colour_options.includes(colour)) obj.colour = colour;
	if (Array.isArray(obj.colour)) obj.colour = obj.colour[random(0, obj.colour.length)];
	V.player.inventory.sextoys[item.name].push(obj);
	/* withdraw money from player */
	if (costsMoney) V.money -= item.cost;
	if (inSexShop) {
		/* update sidebar money */
		updateSideBarMoney();
		/* fade in "owned" icon */
		document
			.getElementById("ssm_item_" + item.name_underscore)
			.getElementsByClassName("ssm_already_owned")[0].innerHTML = `<span class="ssm_owned_text ssm_fade_in">owned</span>`;
		/* fade in/out bought green text indicator */
		document.getElementById("ssmBuyButton").outerHTML = `<span class="ssm_buy_button ssm_fade_in" id="ssmBuyButton" style="color:#97de97">Bought!</span>`;
		if (sexShopOnBuyClick.counter === "off") {
			sexShopOnBuyClick.counter = setTimeout(function () {
				if (document.getElementById("ssmBuyButton"))
					document.getElementById("ssmBuyButton").outerHTML =
						V.money > item.cost
							? `<a id="ssmBuyButton" onclick="window.sexShopOnBuyClick(` + index + `)" class="ssm_buy_button ssm_fade_in_fast">买它</a>`
							: `<span class="ssm_not_enough_money">Not enough money</span>`;
				sexShopOnBuyClick.counter = "off";
			}, 1400);
		}
	}
}
window.sexShopOnBuyClick = sexShopOnBuyClick;

// create Inventory object if it doesn't exist
function createInventoryObject() {
	let recipient;
	if (V.player.inventory == null) V.player.inventory = {};
	if (V.player.inventory.sextoys == null) V.player.inventory.sextoys = {};
	if (V.player.inventory.condoms == null) V.player.inventory.condoms = {};
	for (const li of ["alex", "eden", "kylar", "robin", "sydney"]) {
		recipient = window.findIndexInNPCNameVar(li);
		if (V.NPCName[recipient].sextoys == null) V.NPCName[recipient].sextoys = {};
	}
}
window.createInventoryObject = createInventoryObject;

function updateSideBarMoney() {
	Wikifier.wikifyEval("<<updatesidebarmoney>>");
}
window.updateSideBarMoney = updateSideBarMoney;
