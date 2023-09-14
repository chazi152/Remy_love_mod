/* eslint-disable no-undef */
/* eslint-disable no-var */
var IronMan = (Save => {
	"use strict";

	/**
	 * Set to true to allow debug mode changes during gameplay.
	 * By default this should always be false, if it is not false, please change it.
	 */
	// eslint-disable-next-line no-unused-vars
	const IRONMAN_DEBUG = false;

	/*  -------------------------------------
		Integral IronMan mode core functions.
		------------------------------------- */

	/* DO NOT MODIFY WITHOUT UPDATING SCHEMA */
	/* DO NOT MODIFY WITHOUT UPDATING SCHEMA */
	/* DO NOT MODIFY WITHOUT UPDATING SCHEMA */
	const schema = 4;
	const keys = [
		"ironmanmode",
		"debug",
		"options.autosaveDisabled",
		"cheatdisable",
		"ironmanautosaveschedule",
		"player.virginity",
		"enemyhealth",
		"enemyarousal",
		"enemytrust",
		"enemystrength",
		"passage",
		"money",
		"timeStamp",
		"startDate",
	];
	/* DO NOT MODIFY WITHOUT UPDATING SCHEMA */
	/* DO NOT MODIFY WITHOUT UPDATING SCHEMA */
	/* DO NOT MODIFY WITHOUT UPDATING SCHEMA */

	/**
	 *
	 * @param {object} obj The object to traverse.
	 * @param {string} path The indices to look-up.
	 * @returns {any | null} The value resolved from the object.
	 */
	function resolve(obj, path) {
		const x = path.split(".");
		let y;
		while ((y = x.shift())) {
			if (typeof obj !== "object") return null;
			obj = obj[y];
		}
		return obj;
	}

	// Don't worry about cleaning up this variable as it's already tightly controlled, and will be disposed of via restarting.
	const internals = {};

	function ironmanLock() {
		/* Immediately exit if on the starting passage. */
		if (["Start", "Clothes Testing", "Renderer Test Page", "Tips"].includes(V.passage)) return;
		/* Immediately exit if the game is in debug mode or test mode. */
		if (Config.debug) return;
		if (V.ironmanmode) {
			for (const key of keys) {
				const target = resolve(V, key);
				const parts = key.split(".");
				const prop = parts.pop();
				// Only process enemy values if in combat.
				if (V.combat !== 1 && ["enemyhealth", "enemyarousal", "enemytrust", "enemystrength"].includes(prop)) continue;
				const parent = resolve(V, parts.join(".") || "");
				internals[key] = target;
				Object.defineProperty(parent, prop, {
					get() {
						return internals[key];
					},
					set(value) {
						if (window.ironmanFlag) internals[key] = value;
					},
				});
			}
			// Set flag to lock out setter.
			delete window.ironmanFlag;
		}
	}

	/**
	 * Generates the signature from the given save object.
	 *
	 * @param {object} save The save object.
	 * @returns {string} The hashed (md5) signature.
	 */
	function getSignature(save = null) {
		const target = save == null ? V : save.state.delta[0].variables;
		const subset = keys.map(key => resolve(target, key));
		const encodedSubset = JSON.stringify(subset);
		const signature = md5(encodedSubset);
		return signature;
	}

	/**
	 *
	 * @param {object} metadata The metadata within the save details area.
	 * @param {object} saveObj The save object.
	 */
	function compareSignatures(metadata, saveObj = null) {
		const metaSignature = metadata.signature;
		const saveSignature = getSignature(saveObj);
		if (schema !== metadata.schema) {
			// For debugging: console.log("Updating schema record for ironman save.", schema, metadata.schema, metaSignature, saveSignature);
			return true;
		}
		// Check signatures, return true if match. Loads the game normally.
		if (saveSignature === metaSignature) return true;
		// Last part for error checking. Returns false to indicate failure, and to not load the game. Implies cheating.
		if (V.debug) {
			Errors.report("Ironman signatures failed to match.", {
				saveSig: saveSignature,
				internalSig: metaSignature,
				saveObj,
				metadata,
			});
		}
		return false;
	}

	/*  --------------------------------------
		   Update code for the $ironman obj.
		-------------------------------------- */

	function update(save, metadata) {
		delete metadata.ironman_signature;
		if (typeof metadata.signature !== "string") {
			metadata.signature = getSignature(save);
		}
	}

	/*  --------------------------------------
		UI Functions relating to IronMan mode.
		-------------------------------------- */

	function sliderPerc(e) {
		const valSpan = $(e.currentTarget).siblings().first();
		const value = valSpan.text();

		valSpan.text((i, value) => Math.round(value * 100) + "%");

		if (value > 1) valSpan.css("color", "gold");
		else if (value < 1) valSpan.css("color", "green");
		else valSpan.css("color", "unset");
	}

	function uiCheckBox(mode = "normal") {
		$(function () {
			const checkbox = document.getElementById("checkbox-ironmanmode");
			if (mode === "normal") {
				V.ironmanmode = checkbox.checked;
				if (checkbox.checked) {
					if (V.alluremod < 1) V.alluremod = 1;
					if (V.rentmod < 1) V.rentmod = 1;
					if (V.tending_yield_factor > 5) V.tending_yield_factor = 5;
					if (document.getElementById("sliderTendingYieldFactor")) {
						Wikifier.wikifyEval(
							'<<replace #sliderTendingYieldFactor>><<numberslider "$tending_yield_factor" $tending_yield_factor 1 10 1 $ironmanmode>><</replace>>'
						);
					}
					if (document.getElementById("sliderRentMode")) {
						Wikifier.wikifyEval('<<replace #sliderRentMode>><<numberslider "$rentmod" $rentmod 0.1 3 0.1 $ironmanmode>><</replace>>');
					}
					if (document.getElementById("sliderAllureMode")) {
						Wikifier.wikifyEval('<<replace #sliderAllureMode>><<numberslider "$alluremod" $alluremod 0.2 2 0.1 $ironmanmode>><</replace>>');
					}
					V.options.maxStates = 1;
					V.cheatdisabletoggle = "t";
					V.options.autosaveDisabled = true;
					$(".ironman-slider input")
						.on("input change", e => sliderPerc(e))
						.trigger("change");
				} else {
					if (document.getElementById("numberslider-input-alluremod")) document.getElementById("numberslider-input-alluremod").disabled = false;
					if (document.getElementById("numberslider-input-rentmod")) document.getElementById("numberslider-input-rentmod").disabled = false;
					if (document.getElementById("numberslider-input-tending-yield-factor"))
						document.getElementById("numberslider-input-tending-yield-factor").disabled = false;
				}
			} else {
				checkbox.checked = V.ironmanmode === true;
				if (V.passage !== "Start") checkbox.disabled = true;
			}
		});
	}

	function getDatestamp() {
		const now = new Date();
		let MM = now.getMonth() + 1;
		let DD = now.getDate();
		let hh = now.getHours();
		let mm = now.getMinutes();
		let ss = now.getSeconds();

		if (MM < 10) {
			MM = `0${MM}`;
		}
		if (DD < 10) {
			DD = `0${DD}`;
		}
		if (hh < 10) {
			hh = `0${hh}`;
		}
		if (mm < 10) {
			mm = `0${mm}`;
		}
		if (ss < 10) {
			ss = `0${ss}`;
		}

		return `${now.getFullYear()}${MM}${DD}-${hh}${mm}${ss}`;
	}

	function exportSlot(slot = 8) {
		updateExportDay();
		const data = Save.slots.get(slot);
		const saveId = data.metadata.saveId;
		const saveName = data.metadata.saveName;
		const exportName = `${data.id}-${saveName === "" ? saveId : saveName}-${getDatestamp()}.save`;
		const saveObj = LZString.compressToBase64(JSON.stringify(data));
		saveAs(new Blob([saveObj], { type: "text/plain;charset=UTF-8" }), exportName);
	}

	/**
	 * @deprecated
	 */
	// eslint-disable-next-line no-unused-vars
	function exportCurrent() {
		updateExportDay();
		Save.export();
	}

	/**
	 * Export the slot's data and encode it into data which is difficult to decode without prior knowledge.
	 *
	 * @param {number} slot The index of the save to export for debugging.
	 * @returns {string} Containing the encoded data.
	 */
	function exportDebug(slot) {
		updateExportDay();
		const data = Save.slots.get(slot);
		const details = DoLSave.SaveDetails.get(slot);
		if (data == null) {
			/* Output error response, stating the save slot is invalid. */
			const msg = `IronMan::exportDebug(slot: ${slot}): save file is empty.`;
			console.debug(msg);
			Errors.report(msg);
			return undefined;
		}
		const datatoEncode = { data, details };
		const encodedData = LZString.compressToBase64(JSON.stringify(datatoEncode));
		const finalData = btoa(encodedData);
		/* Navigate to the export-import page. */
		T.presetData = finalData;
		Wikifier.wikifyEval("<<toggleTab>><<replace #customOverlayContent>><<optionsExportImport>><</replace>>");
		return finalData;
	}

	function importDebug(data) {
		const decodedData = LZString.decompressFromBase64(atob(data));
		const saveObj = JSON.parse(decodedData);
		return saveObj;
	}

	function importAndLoadDebug(data) {
		const saveObj = importDebug(data);
		if (typeof saveObj !== "object") {
			/* Output error response, stating the save slot is invalid. */
			const msg = "importAndLoadDebug failed.";
			console.debug(msg, data);
			Errors.report(msg);
			return false;
		}
		const save = saveObj.data;
		/* TODO: Change it around so we don't have to stringify and recompress. */
		const encodedSave = LZString.compressToBase64(JSON.stringify(save));
		const result = Save.deserialize(encodedSave);
		return Object.assign({}, result, saveObj);
	}

	function exportFile(saveData) {
		const saveId = saveData.metadata.saveId;
		const saveName = saveData.metadata.saveName;
		const exportName = `${saveData.id}-${saveName === "" ? saveId : saveName}-${getDatestamp()}.save`;
		const saveObj = LZString.compressToBase64(JSON.stringify(saveData));
		saveAs(new Blob([saveObj], { type: "text/plain;charset=UTF-8" }), exportName);
	}

	const clickCount = {
		slot: -1,
		count: 0,
	};

	function uiExportIconHandler(slot) {
		/* If the slot is different, reset the object. */
		if (slot !== clickCount.slot) {
			clickCount.slot = slot;
			clickCount.count = 0;
		}
		/* Begin increment or activator. */
		/* Takes 3 clicks to activate the exporter. */
		if (clickCount.count >= 2) {
			exportDebug(slot);
			clickCount.slot = -1;
			clickCount.count = 0;
		} else {
			/* Increment and return, as to not reset the counter. */
			clickCount.count++;
		}
	}

	/**
	 * @deprecated
	 */
	function uiExportButton() {
		const exportName = "degrees-of-lewdity" + (V.saveName !== "" ? "-" + V.saveName : "");
		updateExportDay();
		Save.export(exportName);
	}

	function scheduledSaves() {
		const date = new Date(Time.date);

		if (!V.ironmanautosaveschedule) V.ironmanautosaveschedule = date.getTime().toString(8);
		if (parseInt(V.ironmanautosaveschedule, 8) < date.getTime()) {
			// autosave
			ironmanAutoSave();
			//
			V.ironmanautosaveschedule = (date.getTime() + random(432000, 777600) * 1000).toString(8);
		}
	}

	/*  IRONMAN PREVENTION CODE IRONMAN PREVENTION CODE IRONMAN PREVENTION CODE IRONMAN PREVENTION CODE IRONMAN PREVENTION CODE IRONMAN PREVENTION CODE
		IRONMAN PREVENTION CODE IRONMAN PREVENTION CODE IRONMAN PREVENTION CODE IRONMAN PREVENTION CODE IRONMAN PREVENTION CODE IRONMAN PREVENTION CODE

		This runs at the end of the passage processing pipeline. Check docs for SugarCube.md for more information about the pipeline. */
	$(document).on(":passageend", function () {
		ironmanLock();
	});

	/* Export the module object containing functions. */
	return Object.seal({
		lock: ironmanLock,
		getSignature,
		compare: compareSignatures,
		export: exportSlot,
		exportDebug,
		importDebug,
		importAndLoadDebug,
		exportFile,
		/* exportDebug: exportCurrent, */
		UI: {
			checkBox: uiCheckBox,
			exportButton: uiExportButton,
			exportHandler: uiExportIconHandler,
		},
		update,
		scheduledSaves,
		get schema() {
			return schema;
		},
		resolve,
	});
})(Save);
window.IronMan = IronMan;
