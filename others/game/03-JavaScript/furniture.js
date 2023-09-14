const Furniture = (() => {
	setup.furniture = new Map();

	/* Keep set to false, unless during developer testing. If on true, set to false unless in use. */
	const FORCE_UPDATE = false; /* IMPORTANT: Switch to false before the next update. */
	const DEBUG_ENABLED = false;

	const print = (...args) => {
		if (DEBUG_ENABLED) console.debug(...args);
	};

	const Categories = Object.freeze({
		/* Generic categories */
		bed: "bed",
		table: "table",
		chair: "chair",
		desk: "desk",
		wardrobe: "wardrobe",
		decoration: "decoration",
		windowsill: "windowsill",
		poster: "poster",
		wallpaper: "wallpaper",
		/* Special category for Kylar event */
		owlplushie: "owlplushie",
	});

	const Locations = Object.freeze({
		bedroom: "bedroom",
		cabin: "cabin",
		cottage: "cottage",
	});

	let target = Locations.bedroom;

	function furnitureInit() {
		const mapper = setup.furniture;

		/*
		mapper.chairs.set('name', {
			name: "stools",					Name in lowercase.
			nameCap: "木凳",		Capitalised name.
			category: ["chair"],			Used in the shop interface.
			type: ["chair", "expensive"],	Traits, can be multiple, shouldn't be shown because I'm too lazy to make a description /j
			cost: 160,						Cost, 100 is one pound.
			description: "一只普通的凳子。",			Description for the shop interface to show.
			iconFile: "stool.png",			Used in image widgets; <img class="icon" @src="'img/misc/icon/furniture/' + $_chair.iconFile">
		});

		Egg armchairs are here to stay.
		Egg.
		*/

		/* ------------- CHAIRS ------------- */
		mapper.set("chair", {
			name: "chair",
			nameCap: "椅子",
			article: "a",
			nameSolo: "chair",
			category: ["chair"],
			type: ["starter"],
			cost: 0,
			description: "一把破旧、嘎吱作响的椅子。晃而且难受",
			iconFile: "basicChair.png",
			iconFile2: "basicChairDesk.png",
			tier: 0,
		});
		mapper.set("stool", {
			name: "stools",
			nameCap: "木凳",
			article: "a",
			nameSolo: "wooden stool",
			category: ["chair"],
			type: [],
			cost: 460,
			description: "一只普通的凳子。不舒适，但总比没有好。",
			iconFile: "stool.png",
			iconFile2: "stoolDesk.png",
			tier: 0,
		});
		mapper.set("woodenchair", {
			name: "wooden chairs",
			nameCap: "木椅",
			article: "a",
			nameSolo: "wooden chair",
			category: ["chair"],
			type: [],
			cost: 1280,
			description: "平凡的木椅……不是很舒适。",
			iconFile: "chair.png",
			iconFile2: "chairDesk.png",
			tier: 0,
		});
		mapper.set("swivelchair", {
			name: "swivel chairs",
			nameCap: "旋转椅",
			article: "a",
			nameSolo: "swivel chair",
			category: ["chair"],
			type: ["comfy"],
			cost: 1480,
			description: "一把人体工学转椅，完美且舒适。",
			iconFile: "swivelChair.png",
			iconFile2: "swivelChairDesk.png",
			tier: 1,
		});
		mapper.set("shellchair", {
			name: "shell chairs",
			nameCap: "贝壳椅",
			article: "a",
			nameSolo: "shell chair",
			category: ["chair"],
			type: ["comfy"],
			cost: 1750,
			description: "一把带有贝壳形靠背的转椅，十分奢华。",
			iconFile: "shellChair.png",
			iconFile2: "shellChairDesk.png",
			tier: 1,
		});
		mapper.set("armchair", {
			name: "armchairs",
			nameCap: "单人沙发",
			article: "an",
			nameSolo: "armchair",
			category: ["chair"],
			type: ["comfy"],
			cost: 1970,
			description: "一套单人沙发。柔软、舒适、十分昂贵。",
			iconFile: "armchair.png",
			iconFile2: "armchairDesk.png",
			tier: 1,
		});
		mapper.set("egg", {
			name: "egg armchairs",
			nameCap: "卵形沙发",
			article: "an",
			nameSolo: "egg armchair",
			category: ["chair"],
			type: ["comfy"],
			cost: 2420,
			description: "一张异域风情的圆形沙发，非常难以组装。",
			iconFile: "armchairegg.png",
			iconFile2: "armchaireggDesk.png",
			tier: 1,
		});

		/* ------------- TABLES ------------- */
		mapper.set("woodentable", {
			name: "wooden table",
			nameCap: "木桌",
			category: ["table"],
			type: [],
			cost: 1100,
			description: "可用来办公学习或是聚会使用，需要搭配椅子。",
			iconFile: "table.png",
			tier: 0,
		});
		mapper.set("marbletable", {
			name: "marble-topped table",
			nameCap: "大理石桌",
			category: ["table"],
			type: [],
			cost: 1430,
			description: "拥有大理石桌面的木桌。",
			iconFile: "marbletable.png",
			tier: 1,
		});

		/* ------------- DESKS ------------- */
		mapper.set("desk", {
			name: "basic desk",
			nameCap: "基础书桌",
			category: ["desk"],
			type: ["stable", "starter"],
			cost: 0,
			description: "老旧的书桌，刻满了过去的孤儿留下的涂鸦。",
			iconFile: "desk.png",
		});
		mapper.set("deskGlass", {
			name: "glass desk",
			nameCap: "玻璃书桌",
			category: ["desk"],
			type: ["fragile"],
			cost: 1250,
			description: "一张时髦的现代书桌，很容易弄坏。",
			iconFile: "deskGlass.png",
		});
		mapper.set("deskMidcentury", {
			name: "mid-century modern desk",
			nameCap: "50年代书桌",
			category: ["desk"],
			type: ["stable"],
			cost: 1550,
			description: "现代主义风格的书桌，在二十世纪中叶十分流行。",
			iconFile: "deskMidcentury.png",
		});
		mapper.set("deskAntique", {
			name: "antique desk",
			nameCap: "古董桌",
			category: ["desk"],
			type: ["sturdy"],
			cost: 3820,
			description: "一张华丽的古董书桌，专为终身使用而打造。",
			iconFile: "deskAntique.png",
		});

		/* ------------- BEDS ------------- */
		mapper.set("bed", {
			name: "basic bed",
			nameCap: "基础床",
			category: ["bed"],
			type: ["single", "starter"],
			cost: 0,
			description: "一张破旧不堪的床，很不舒服。",
			iconFile: "bed.png",
			tier: 0,
		});
		mapper.set("singlebed", {
			name: "single bed",
			nameCap: "单人床",
			category: ["bed"],
			type: ["single"],
			cost: 1680,
			description: "一张普通的单人床",
			iconFile: "singlebed.png",
			tier: 0,
		});
		mapper.set("singlebeddeluxe", {
			name: "deluxe single bed",
			nameCap: "豪华单人床",
			category: ["bed"],
			type: ["single", "comfy"],
			cost: 2400,
			description: "符合人体工学设计的单人床，非常舒适。",
			iconFile: "singlebeddeluxe.png",
			tier: 1,
		});
		mapper.set("doublebed", {
			name: "double bed",
			nameCap: "双人床",
			category: ["bed"],
			type: ["double"],
			cost: 3400,
			description: "普通的床，可以容下两个人。",
			iconFile: "doublebed.png",
			tier: 1,
			showCheck: "notBedroom",
		});
		mapper.set("doublebeddeluxe", {
			name: "deluxe double bed",
			nameCap: "豪华双人床",
			category: ["bed"],
			type: ["double", "comfy"],
			cost: 2840,
			description: "一张漂亮的床，配有柔软的床垫。非常舒适，可以容下两个人。",
			iconFile: "doublebeddeluxe.png",
			tier: 2,
			showCheck: "notBedroom",
		});
		mapper.set("doublebedexotic", {
			name: "exotic double bed",
			nameCap: "进口双人床",
			category: ["bed"],
			type: ["double", "comfy"],
			cost: 4884,
			description: "现代极简主义风格的床。非常舒适，可以容下两个人。",
			iconFile: "doublebedexotic.png",
			tier: 2,
			showCheck: "notBedroom",
		});
		mapper.set("doublebedwicker", {
			name: "wicker double bed",
			nameCap: "藤艺双人床",
			category: ["bed"],
			type: ["double", "comfy"],
			cost: 4860,
			description: "全藤织框架的双人床。非常舒适，可以容下两个人。",
			iconFile: "doublebedwicker.png",
			tier: 2,
			showCheck: "notBedroom",
		});

		/* ------------- MISC ------------- */
		mapper.set("plantpot", {
			name: "plant pot",
			nameCap: "花盆",
			category: ["windowsill"],
			type: [],
			cost: 680,
			description: "带有肥沃土壤的陶罐。花已预先种好，可以放在窗台上。",
			iconFile: "flower.png",
		});
		mapper.set("bunnySucculent", {
			name: "bunny succulent",
			nameCap: "兔耳多肉",
			category: ["windowsill"],
			type: [],
			cost: 840,
			description: "用来种植多肉的水泥花盆。已预植有\"碧光环\"，也被称为兔耳多肉",
			iconFile: "bunnySucculent.png",
		});
		mapper.set("jar", {
			name: "jar",
			nameCap: "瓶子",
			category: ["windowsill"],
			type: [],
			cost: 1380,
			description: "普通的圆形瓶子，可以放在窗台上。",
			iconFile: "jar.png",
		});

		/* ------------- DECORATIONS ------------- */
		mapper.set("calendar", {
			name: "calendar",
			nameCap: "挂历",
			category: ["decoration"],
			type: [],
			cost: 360,
			description: "普通的挂历，上面印满了数字。",
			iconFile: "calendar.png",
		});
		mapper.set("painting", {
			name: "painting",
			nameCap: "挂画",
			category: ["decoration"],
			type: [],
			cost: 680,
			description: "仿真的工业印刷品，并不是真正的画。",
			iconFile: "painting.png",
		});
		mapper.set("banner", {
			name: "banner",
			nameCap: "海报",
			category: ["decoration"],
			type: [],
			cost: 620,
			description: "中间印着一个老电影里的角色。",
			iconFile: "banner.png",
		});
		mapper.set("bannerlewd", {
			name: "lewd banner",
			nameCap: "色情海报",
			category: ["decoration"],
			type: [],
			cost: 790,
			description: "印着一只巨大的触手。",
			iconFile: "banner.png",
		});
		mapper.set("bannerfestive", {
			name: "festive banner",
			nameCap: "节日海报",
			category: ["decoration"],
			type: [],
			cost: 670,
			description: "虽然可能不是很合时宜，但看起来依旧很酷。",
			iconFile: "bannerfestive.png",
		});
		mapper.set("bearplushie", {
			name: "large bear plushie",
			nameCap: "超大熊玩偶",
			category: ["decoration"],
			type: [],
			cost: 1380,
			description: "柔软，可爱，永远忠诚。",
			iconFile: "bearplushie.png",
		});
		mapper.set("owlplushie", {
			name: "owl plushie",
			nameCap: "猫头鹰玩偶",
			category: ["owlplushie"],
			type: [],
			cost: 0,
			description: "巨大的眼睛凝视着世界。",
			iconFile: "owlplushie.png",
			showCheck: "disabled",
		});
		/* ------------- WARDROBES ------------- */
		/*	starter - 20 clothing slots for every type
			spacious - 30 clothing slots for every type
			organised - 40 clothing slots for every type */
		mapper.set("wardrobe", {
			name: "creaky wardrobe",
			nameCap: "老朽的衣橱",
			category: ["wardrobe"],
			type: ["starter"],
			cost: 0,
			description: "破旧，嘎吱作响的衣橱，装不了太多东西。",
			iconFile: "wardrobe.png",
			tier: 0,
			showCheck: "disabled",
		});
		mapper.set("wardrobebasic", {
			name: "wardrobe",
			nameCap: "普通衣橱",
			category: ["wardrobe"],
			type: ["spacious"],
			cost: 3160,
			description: "一个基本的衣柜。",
			iconFile: "wardrobebasic.png",
			tier: 1,
			showCheck: "isWardrobeHigherTier",
		});
		mapper.set("armoire", {
			name: "armoire",
			nameCap: "大型衣橱",
			category: ["wardrobe"],
			type: ["spacious"],
			cost: 3258,
			description: "一个宽敞的木制大衣橱。",
			iconFile: "armoire.png",
			tier: 1,
			showCheck: "isWardrobeHigherTier",
		});
		mapper.set("organiser", {
			name: "organiser wardrobe",
			nameCap: "组合衣橱",
			category: ["wardrobe"],
			type: ["organiser"],
			cost: 4296,
			description: "拥有大量空间的衣橱。",
			iconFile: "wardrobeorganiser.png",
			tier: 2,
			showCheck: "isWardrobeHigherTier",
		});
		mapper.set("carved", {
			name: "carved armoire",
			nameCap: "錾刻衣橱",
			category: ["wardrobe"],
			type: ["organiser"],
			cost: 4620,
			description: "纯手工雕刻的豪华衣橱，含有多个抽屉和衣架。",
			iconFile: "armoirecarved.png",
			tier: 2,
			showCheck: "isWardrobeHigherTier",
		});
		/* --------------- POSTERS --------------- */
		mapper.set("poster", {
			name: "blank poster",
			nameCap: "空白海报",
			category: ["poster"],
			type: ["poster", "starter"],
			cost: 135,
			description: "海报上目前空无一物。",
			iconFile: "poster.png",
		});
		/* ------------- WALLPAPERS -------------- */
		mapper.set("wallpaper", {
			name: "blank wallpaper",
			nameCap: "空白墙纸",
			category: ["wallpaper"],
			type: ["wallpaper", "starter"],
			cost: 135,
			description: "墙纸上目前空无一物。",
			iconFile: "wallpaper.png",
		});
	}

	function furnitureGet(category, onlySetup = false) {
		print("Furniture.get > getting:", category);
		if (typeof category !== "string") {
			print("Furniture.Get expected an argument of type: string.", category);
			return null;
		}
		if (onlySetup) {
			return setup.furniture.get(category);
		}
		if (!V) {
			print("Furniture.Get called before SugarCube is ready, postpone execution next time.", category);
			return null;
		}
		const area = V.furniture[target];
		if (typeof area !== "object" && area === null) {
			print("Furniture.Get called with a location that doesn't exist:", target, area);
			return null;
		}
		const current = area[category];
		if (typeof current === "object" && current !== null) {
			const defaults = setup.furniture.get(current.id);
			const composite = Object.assign({}, defaults, current);
			return composite;
		} else {
			return null;
		}
	}

	function furnitureSet(id, category, overrides) {
		print("Furniture.set > setting:", id, category, overrides);
		if (!setup.furniture.has(id)) {
			Errors.report(`Furniture.Set was incorrectly passed an id not listed in furniture: ${id}`);
			return false;
		}
		if (!Categories[category]) {
			Errors.report(`Furniture.Set was incorrectly passed an invalid category : ${category}`);
			return false;
		}
		const home = V.furniture[target];

		home[category] = { id };
		if (typeof overrides === "object" && overrides !== null) {
			/* Object.defineProperties(home[category], propertyMap); */
			Object.assign(home[category], overrides);
		}
		// Log the id in case mistakes in the future occur and we need to track previous ownership.
		furnitureLog(id);
		return true;
	}

	function furnitureDelete(category) {
		print("Furniture.delete > Deleting:", category);
		delete V.furniture[target][category];
		return true;
	}

	function furnitureIn(location) {
		if (Object.values(Locations).includes(location)) {
			target = location;
		} else {
			Errors.report(`Location provided (${location}) does not exist in the furniture system.`);
		}
		return Furniture;
	}

	function furnitureUpdate(fromBackComp = false) {
		print("Furniture.update > Updating - from backcomp:", fromBackComp);
		const versions = V.objectVersion;
		let wallpaper;
		let decoration;
		let poster;
		if (versions.furniture === undefined || FORCE_UPDATE) {
			versions.furniture = 0;
		}
		switch (versions.furniture) {
			case 0:
				V.furniturePriceFactor = 1;
				V.furniture = {
					bedroom: {
						bed: {
							id: "bed",
						},
						wardrobe: {
							id: fromBackComp ? "organiser" : "wardrobe",
						},
						desk: {
							id: "desk",
						},
					},
				};
				wardrobeSpaceUpdater();
			// eslint-disable-next-line no-fallthrough
			case 1:
				/* Set the target to the bedroom in the unlikely event it wasn't preset. */
				furnitureIn(Locations.bedroom);
				/* Search for the wallpaper object, returns null if not found. */
				wallpaper = furnitureGet(Categories.wallpaper);
				if (wallpaper != null && wallpaper.name.includes("<<")) {
					const name = Util.escape(wallpaper.name);
					furnitureSet("wallpaper", Categories.wallpaper, {
						name,
						nameCap: name.toUpperFirst(),
					});
				}
				/* Search for the poster object, returns null if not found. */
				poster = furnitureGet(Categories.poster);
				if (poster != null && poster.name.includes("<<")) {
					const name = Util.escape(poster.name);
					furnitureSet("poster", Categories.poster, {
						name,
						nameCap: name.toUpperFirst(),
					});
				}
				versions.furniture = 2;
			// eslint-disable-next-line no-fallthrough
			case 2:
				/* Start log of existing items owned. */
				updaterLogAll();
				/* Fix owl-plushie being in the decoration category, as it can then be deleted,
					or potentially lock out decorations in the current system. */
				furnitureIn(Locations.bedroom);
				decoration = furnitureGet(Categories.decoration);
				if (decoration !== null && decoration.id === "owlplushie") {
					furnitureSet("owlplushie", Categories.owlplushie, {
						name: "owl plushie",
						nameCap: "猫头鹰玩偶",
					});
					furnitureDelete(Categories.decoration);
				}
				if ([2, 4, 7].includes(V.kylar_camera)) {
					furnitureSet("owlplushie", Categories.owlplushie, {
						name: "owl plushie",
						nameCap: "猫头鹰玩偶",
					});
				}
				versions.furniture = 3;
				break;
		}
	}

	function getWardrobeTier(wardrobe) {
		const type = wardrobe.type.find(e => ["spacious", "organiser"].includes(e)) || "starter";
		const tier = { starter: 0, spacious: 1, organiser: 2 }[type];
		return tier;
	}

	function isWardrobeHigherTier(wardrobe) {
		const current = Furniture.get("wardrobe");
		if (current) {
			const targetTier = getWardrobeTier(wardrobe);
			const currentTier = getWardrobeTier(current);
			if (targetTier <= currentTier) {
				return false;
			}
		}
		return true;
	}

	function showFn(item) {
		switch (item.showCheck) {
			case "isWardrobeHigherTier":
				// console.log("isWardrobeHigherTier", isWardrobeHigherTier(item));
				return isWardrobeHigherTier(item);
			case "notBedroom":
				// console.log("notBedroom", target !== "bedroom", target);
				return target !== "bedroom";
			case "disabled":
				// console.log("disabled");
				return false;
			default:
				return null;
		}
	}

	function wardrobeSpaceUpdater() {
		const wardrobe = V.wardrobe;
		const furniture = furnitureGet("wardrobe");
		if (typeof furniture !== "object") return;
		if (!(furniture.type instanceof Array)) return;
		/* Wardrobe object appears to be good: Is an object, type is an array. */
		if (furniture.type.includes("organiser")) {
			wardrobe.space = 40;
		} else if (furniture.type.includes("spacious")) {
			wardrobe.space = 30;
		} else {
			wardrobe.space = 20;
		}
	}

	function setPrice(pounds, pence = 0) {
		return Math.floor((pounds * 100 + pence) * V.furniturePriceFactor);
	}

	function updaterLogAll() {
		print("updaterLogAll > Logging all existing items.");
		for (const location in V.furniture) {
			const items = V.furniture[location];
			if (typeof items !== "object" || items === null) continue;
			for (const key in items) {
				const item = items[key];
				if (typeof item !== "object" || item === null) continue;
				furnitureLog(item.id);
			}
		}
	}

	function furnitureLog(id) {
		print("Furniture.log > Logging:", id);
		// Ensure furniture log exists.
		if (!Array.isArray(V.furnitureLog)) V.furnitureLog = [];
		if (!V.furnitureLog.includes(id)) V.furnitureLog.push(id);
	}

	$(document).on(":start2", function () {
		furnitureUpdate();
	});

	/* Call the initiator function immediately. This happens when the game starts up and is loading. (Spinny wheel) */
	furnitureInit();

	return Object.freeze({
		init: furnitureInit,
		get: furnitureGet,
		set: furnitureSet,
		delete: furnitureDelete,
		in: furnitureIn,
		update: furnitureUpdate,
		wardrobeUpdate: wardrobeSpaceUpdater,
		log: furnitureLog,
		setPrice,
		showFn,
		get target() {
			return target;
		},
	});
})();
window.Furniture = Furniture;
