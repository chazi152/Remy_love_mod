/* eslint-disable no-undef */
const DoLSave = ((Story, Save) => {
	"use strict";

	const DEFAULT_DETAILS = Object.freeze({
		id: Story.domId,
		autosave: null,
		slots: [null, null, null, null, null, null, null, null],
	});
	const KEY_DETAILS = "dolSaveDetails";

	// Compressed saves are indicated by {jsoncompressed:1} in their metadata
	// The '1' can act as a compression algorithm id.

	// see game/00-framework-tools/03-compression/dictionaries.js
	const COMPRESSOR_DICTIONARIES = DoLCompressorDictionaries;
	// id of the dictionary to use for saving
	const COMPRESSOR_CURRENT_DICTIONARY_ID = "v0";
	/**
	 * When saving, decompress and compare with the original.
	 * If results differ, report an error and save the uncompressed version instead.
	 */
	function shouldVerifyCompression() {
		return true;
	}

	/* Place somewhere to expose globally. */
	function isObject(obj) {
		return typeof obj === "object" && obj != null;
	}

	/* Can also call from backcomp in the future? */
	function getSaveVersion(variables) {
		if (isObject(variables)) {
			if (!variables.saveVersions) {
				return -1;
			}
			return variables.saveVersions.last();
		}
		return -2;
	}

	function marshalVersion(version) {
		return typeof version === "string"
			? version
					.replace(/[^0-9.]+/g, "")
					.split(".")
					.map(v => parseInt(v))
			: [0, 0, 0, 0];
	}

	function parseVersion(version) {
		version = marshalVersion(version);
		return version ? version[0] * 1000000 + version[1] * 10000 + version[2] * 100 + version[3] * 1 : 0;
	}

	/**
	 * The handler which the load button should call.
	 * Contains checks to determine whether the save loads or pops up a confirmation window.
	 *
	 * @param {any} slot The slot ID to get the save from. 0 to 9, or 'auto'.
	 * @param {boolean} confirm Bypass the load confirmation.
	 * @returns {void}
	 */
	function loadHandler(slot, confirm) {
		if (V.ironmanmode === true && V.passage !== "Start") {
			Wikifier.wikifyEval(`<<loadIronmanSafetyCancel ${slot}>>`);
			return;
		}
		if (V.confirmLoad === true && confirm === undefined) {
			Wikifier.wikifyEval(`<<loadConfirm ${slot}>>`);
			return;
		}
		const save = slot === "auto" ? Save.autosave.get() : Save.slots.get(slot);
		if (typeof save !== "object") {
			Errors.report("Could not find a valid save at that slot.", {});
			return;
		}
		const currVersion = parseVersion(StartConfig.version);
		/* Assume the save->variables is valid if an object. */
		const saveVersion = parseVersion(getSaveVersion(save.state.delta[0].variables));
		if (currVersion < saveVersion) {
			Wikifier.wikifyEval(`<<loadconfirmcompat ${slot}>>`);
			return;
		}
		load(slot, save);
	}

	/**
	 * Loads the given saveobj, or the save from the given slot.
	 *
	 * @param {number|string} slot The slot ID to get the save from. 0 to 9, or 'auto'.
	 * @param {object} saveObj The save object if already possessed by the callee.
	 * @param {boolean} overrides
	 * @returns {void}
	 */
	function load(slot, saveObj, overrides) {
		const save = saveObj == null ? (slot === "auto" ? Save.autosave.get() : Save.slots.get(slot)) : saveObj;
		const saveDetails = JSON.parse(localStorage.getItem(KEY_DETAILS));
		const metadata = slot === "auto" ? saveDetails.autosave.metadata : saveDetails.slots[slot].metadata;
		/* Check if metadata for save matches the save's computed md5 hash. If it matches, the ironman save was not tampered with.
			Bypass this check if on a mobile, because they are notoriously difficult to grab saves from in the event of issues. */
		if (metadata.ironman && !Browser.isMobile.any()) {
			IronMan.update(save, metadata);
			// (if ironman mode enabled) following checks md5 signature of the save to see if the variables have been modified
			if (!IronMan.compare(metadata, save)) {
				Wikifier.wikifyEval(`<<loadIronmanCheater ${slot}>>`);
				return;
			}
		}
		if (slot === "auto") {
			Save.autosave.load();
		} else {
			Save.slots.load(slot);
		}
		if (V.ironmanmode) {
			// (ironman) remove all saves(except auto-save) with the same saveId than loaded save
			[0, 1, 2, 3, 4, 5, 6, 7].forEach(id => {
				const saveDetail = saveDetails.slots[id];
				if (saveDetail == null) return;
				if (saveDetail.metadata.saveId === metadata.saveId) {
					Save.slots.delete(id);
					deleteSaveDetails(id);
				}
			});
		}
	}

	function save(saveSlot, confirm, saveId, saveName) {
		if (saveId == null) {
			Wikifier.wikifyEval(`<<saveConfirm ${saveSlot}>>`);
		} else if ((V.confirmSave === true && confirm !== true) || (V.saveId !== saveId && saveId != null)) {
			Wikifier.wikifyEval(`<<saveConfirm ${saveSlot}>>`);
		} else {
			if (saveSlot != null) {
				updateSavesCount();
				const success = Save.slots.save(saveSlot, null, {
					saveId,
					saveName,
					ironman: V.ironmanmode,
				});
				if (success) {
					const save = Save.slots.get(saveSlot);
					// Copy save metadata (it includes the jsoncompressed indicator)
					const metadata = { ...save.metadata, saveId, saveName };
					if (V.ironmanmode) {
						Object.assign(metadata, {
							ironman: V.ironmanmode,
							signature: V.ironmanmode ? IronMan.getSignature(save) : false,
							schema: IronMan.schema,
						});
					}
					setSaveDetail(saveSlot, metadata);
					delete T.currentOverlay;
					// todo: find a better solution
					closeOverlay();
					if (V.ironmanmode === true) Engine.restart();
				}
			}
		}
	}

	function deleteSave(saveSlot, confirm) {
		if (saveSlot === "all") {
			if (confirm === undefined) {
				Wikifier.wikifyEval("<<clearSaveMenu>>");
				return;
			} else if (confirm === true) {
				Save.clear();
				deleteAllSaveDetails();
			}
		} else if (saveSlot === "auto") {
			if (V.confirmDelete === true && confirm === undefined) {
				Wikifier.wikifyEval(`<<deleteConfirm ${saveSlot}>>`);
				return;
			} else {
				Save.autosave.delete();
				deleteSaveDetails("autosave");
			}
		} else {
			if (V.confirmDelete === true && confirm === undefined) {
				Wikifier.wikifyEval(`<<deleteConfirm ${saveSlot}>>`);
				return;
			} else {
				Save.slots.delete(saveSlot);
				deleteSaveDetails(saveSlot);
			}
		}
		Wikifier.wikifyEval("<<resetSaveMenu>>");
	}

	function importSave(saveFile) {
		if (!window.FileReader) return; // Browser is not compatible

		const reader = new FileReader();

		reader.onloadend = function () {
			DeserializeGame(this.result);
		};

		reader.readAsText(saveFile[0]);
	}

	function prepareSaveDetails(forceRun) {
		const saveDetails = getSaveDetails();
		if (saveDetails == null || saveDetails.id !== Story.domId || forceRun) {
			const scSaveDetails = Save.get();
			const dolSaveDetails = Object.assign({}, DEFAULT_DETAILS);
			/* Search SugarCube's autosave property, if it exists, reflect this in the save details. */
			if (scSaveDetails.autosave != null) {
				dolSaveDetails.autosave = {
					title: scSaveDetails.autosave.title,
					date: scSaveDetails.autosave.date,
					metadata: scSaveDetails.autosave.metadata,
				};
				if (dolSaveDetails.autosave.metadata === undefined) {
					dolSaveDetails.autosave.metadata = { saveName: "" };
				}
				if (dolSaveDetails.autosave.metadata.saveName === undefined) {
					dolSaveDetails.autosave.metadata.saveName = "";
				}
			}
			/* Check whether SugarCube's save slots exist, and populate save details with them. */
			for (let i = 0; i < scSaveDetails.slots.length; i++) {
				if (scSaveDetails.slots[i] !== null) {
					dolSaveDetails.slots[i] = {
						title: scSaveDetails.slots[i].title,
						date: scSaveDetails.slots[i].date,
						metadata: scSaveDetails.slots[i].metadata,
					};
					if (dolSaveDetails.slots[i].metadata === undefined) {
						dolSaveDetails.slots[i].metadata = { saveName: "old save", saveId: 0 };
					}
					if (dolSaveDetails.slots[i].metadata.saveName === undefined) {
						dolSaveDetails.slots[i].metadata.saveName = "old save";
					}
				} else {
					dolSaveDetails.slots[i] = null;
				}
			}

			localStorage.setItem(KEY_DETAILS, JSON.stringify(dolSaveDetails));
			return true;
		}
		return false;
	}

	function setSaveDetail(saveSlot, metadata, story) {
		const saveDetails = JSON.parse(localStorage.getItem(KEY_DETAILS));
		if (saveSlot === "autosave") {
			saveDetails.autosave = {
				id: Story.domId,
				title: Story.get(V.passage).description(),
				date: Date.now(),
				metadata,
			};
		} else {
			const slot = parseInt(saveSlot);
			saveDetails.slots[slot] = {
				id: Story.domId,
				title: Story.get(V.passage).description(),
				date: Date.now(),
				metadata,
			};
		}
		localStorage.setItem(KEY_DETAILS, JSON.stringify(saveDetails));
	}

	function getSaveDetails(saveSlot) {
		if (Object.hasOwn(localStorage, KEY_DETAILS)) {
			const saveDetails = JSON.parse(localStorage.getItem(KEY_DETAILS));
			if (typeof saveSlot === "number") {
				if (saveDetails != null) {
					return saveDetails.slots[saveSlot];
				}
			} else {
				return saveDetails;
			}
		}
		return null;
	}

	function deleteSaveDetails(saveSlot) {
		const saveDetails = JSON.parse(localStorage.getItem(KEY_DETAILS));
		if (saveSlot === "autosave") {
			saveDetails.autosave = null;
		} else {
			const slot = parseInt(saveSlot);
			saveDetails.slots[slot] = null;
		}
		localStorage.setItem(KEY_DETAILS, JSON.stringify(saveDetails));
	}

	function deleteAllSaveDetails() {
		localStorage.setItem(KEY_DETAILS, JSON.stringify(DEFAULT_DETAILS));
	}

	function returnSaveData() {
		return Save.get();
	}

	function resetSaveMenu() {
		Wikifier.wikifyEval("<<resetSaveMenu>>");
	}

	function ironmanAutoSave() {
		const saveSlot = 8;
		updateSavesCount();
		const success = Save.slots.save(saveSlot, null, {
			saveId: V.saveId,
			saveName: V.saveName,
			ironman: V.ironmanmode,
		});
		if (success) {
			const save = Save.slots.get(saveSlot);
			const metadata = { saveId: V.saveId, saveName: V.saveName };
			if (V.ironmanmode) {
				Object.assign(metadata, {
					ironman: V.ironmanmode,
					signature: V.ironmanmode ? IronMan.getSignature(save) : false,
					schema: IronMan.schema,
				});
			}
			setSaveDetail(saveSlot, metadata);
		}
	}

	Macro.add("incrementautosave", {
		handler() {
			if (!V.ironmanmode) V.saveDetails.auto.count++;
		},
	});

	/**
	 * Compress a game state (not delta-encoded: {title, variables, prng, pull}) using most recent dictionary.
	 * Can throw an error.
	 *
	 * @param state
	 */
	function compressState(state) {
		DOL.Perflog.logWidgetStart("__DoLSave.compressState");
		try {
			const dictionary = COMPRESSOR_DICTIONARIES[COMPRESSOR_CURRENT_DICTIONARY_ID];
			const compressor = new JsonCompressor(dictionary);
			const zstate = compressor.compress(state);
			zstate.dictionary = COMPRESSOR_CURRENT_DICTIONARY_ID;
			zstate.title =
				"This save is compressed and is not compatible with old versions of Degrees of Lewdity. If you want to load this save in an older game build, use exporting.";
			zstate.variables = {};
			if (shouldVerifyCompression()) {
				// Sanity check
				const uzstate = decompressState(zstate);
				if (JSON.stringify(state) !== JSON.stringify(uzstate)) {
					throw new Error("Decompression check failed");
				}
			}
			return zstate;
		} finally {
			DOL.Perflog.logWidgetEnd("__DoLSave.compressState");
		}
	}

	/**
	 * Decompress the saved state using the dictionary it was compressed with.
	 * Can throw an error.
	 *
	 * @param zstate
	 */
	function decompressState(zstate) {
		DOL.Perflog.logWidgetStart("__DoLSave.decompressState");
		try {
			if (!("dictionary" in zstate)) throw new Error("Unable to load - compressed save has no dictionary");
			const dicid = zstate.dictionary;
			if (!(dicid in COMPRESSOR_DICTIONARIES))
				throw new Error(
					"Unable do decompress the save - the dictionary " +
						JSON.stringify(dicid) +
						" is unknown to this game version (trying to load newer save from older game?)"
				);
			const dictionary = COMPRESSOR_DICTIONARIES[dicid];
			const decompressor = new JsonDecompressor(dictionary);
			return decompressor.decompress(zstate);
		} finally {
			DOL.Perflog.logWidgetEnd("__DoLSave.decompressState");
		}
	}
	function enableCompression() {
		V.compressSave = true;
	}
	function disableCompression() {
		V.compressSave = false;
	}
	function isCompressionEnabled() {
		// for now, save compressor and delta-encoder work against each other, leading to bigger saves when both are active
		// todo: make them friends?
		return V.compressSave && State.history.length === 1;
	}

	/**
	 * Compress a SaveObject (the one with metadata and delta-encoded history), if the compression is enabled.
	 * If compression fails, report and error and do nothing.
	 * This function returns nothing, it modifies the saveObj parameter.
	 *
	 * @param saveObj
	 */
	function compressIfNeeded(saveObj) {
		if (!saveObj.metadata) saveObj.metadata = {};
		saveObj.metadata.jsoncompressed = 0;
		if (!isCompressionEnabled()) return;
		try {
			saveObj.state.history = saveObj.state.history.map(state => compressState(state));
			saveObj.metadata.jsoncompressed = 1;
		} catch (e) {
			DOL.Errors.report("Unable to compress - " + e);
			console.error(e);
			// Just return, the saveObj won't be modified
		}
	}
	function looksLikeCompressedSave(state) {
		return state.compressed === 1 && Array.isArray(state.values) && typeof state.values === "object" && typeof state.dictionary === "string";
	}
	/**
	 * Decompress a SaveObject (the one with metadata and delta-encoded history), if it is compressed.
	 *
	 * @param saveObj
	 */
	function decompressIfNeeded(saveObj) {
		const isCompressed = (saveObj.metadata && saveObj.metadata.jsoncompressed === 1) || looksLikeCompressedSave(saveObj.state.history[0]);
		if (!isCompressed) return;
		saveObj.state.history = saveObj.state.history.map(state => (JsonDecompressor.isCompressed(state) ? decompressState(state) : state));
	}

	return Object.freeze({
		save,
		load,
		delete: deleteSave,
		import: importSave,
		getSaves: returnSaveData,
		resetMenu: resetSaveMenu,
		getVersion: getSaveVersion,
		loadHandler,
		enableCompression,
		disableCompression,
		isCompressionEnabled,
		compressState,
		decompressState,
		compressIfNeeded,
		decompressIfNeeded,
		SaveDetails: Object.freeze({
			prepare: prepareSaveDetails,
			set: setSaveDetail,
			get: getSaveDetails,
			delete: deleteSaveDetails,
			deleteAll: deleteAllSaveDetails,
		}),
		IronMan: Object.freeze({
			autoSave: ironmanAutoSave,
		}),
		Utils: Object.freeze({
			parseVer: parseVersion,
		}),
	});
})(Story, Save);
window.DoLSave = DoLSave;

/* Legacy references, references to the global namespace should be avoided, and thus this is considered deprecated usage. */
window.prepareSaveDetails = DoLSave.SaveDetails.prepare;
window.setSaveDetail = DoLSave.SaveDetails.set;
window.getSaveDetails = DoLSave.SaveDetails.get;
window.deleteSaveDetails = DoLSave.SaveDetails.delete;
window.deleteAllSaveDetails = DoLSave.SaveDetails.deleteAll;
window.returnSaveDetails = DoLSave.getSaves;
window.resetSaveMenu = DoLSave.resetMenu;
window.ironmanAutoSave = DoLSave.IronMan.autoSave;
window.loadSave = DoLSave.load;
window.save = DoLSave.save;
window.deleteSave = DoLSave.delete;
window.importSave = DoLSave.import;
window.SerializeGame = Save.serialize;
window.DeserializeGame = Save.deserialize;

window.getSaveData = function () {
	const compressionWasEnabled = DoLSave.isCompressionEnabled();
	DoLSave.disableCompression();
	const input = document.getElementById("saveDataInput");
	updateExportDay();
	input.value = Save.serialize();
	if (compressionWasEnabled) DoLSave.enableCompression();
};

window.loadSaveData = function () {
	const input = document.getElementById("saveDataInput");
	const result = Save.deserialize(input.value);
	if (result === null) {
		input.value = "Invalid Save.";
	}
};

window.clearTextBox = function (id) {
	document.getElementById(id).value = "";
};

window.topTextArea = function (id) {
	const textArea = document.getElementById(id);
	textArea.scroll(0, 0);
};

window.bottomTextArea = function (id) {
	const textArea = document.getElementById(id);
	textArea.scroll(0, textArea.scrollHeight);
};

window.copySavedata = function (id) {
	const saveData = document.getElementById(id);
	saveData.focus();
	saveData.select();

	try {
		document.execCommand("copy");
	} catch (err) {
		const copyTextArea = document.getElementById("CopyTextArea");
		copyTextArea.value = "Copying Error";
		console.log("Unable to copy: ", err);
	}
};

window.updateExportDay = function () {
	const idx = State.activeIndex;
	if (V.saveDetails != null && State.history[idx].variables.saveDetails != null) {
		V.saveDetails.exported.days = clone(Time.days);
		State.history[idx].variables.saveDetails.exported.days = clone(Time.days);
		V.saveDetails.exported.count++;
		State.history[idx].variables.saveDetails.exported.count++;
		V.saveDetails.exported.dayCount++;
		State.history[idx].variables.saveDetails.exported.dayCount++;
		const sessionState = getSessionState();
		if (sessionState != null) {
			const sidx = sessionState.index;
			sessionState.history[sidx].variables.saveDetails.exported.days = clone(Time.days);
			sessionState.history[sidx].variables.saveDetails.exported.dayCount++;
			sessionState.history[sidx].variables.saveDetails.exported.count++;
			setSessionState(sessionState);
		}
	}
};

window.updateSavesCount = function () {
	const idx = State.activeIndex;
	if (V.saveDetails != null && State.history[idx].variables.saveDetails != null) {
		V.saveDetails.slot.count++;
		State.history[idx].variables.saveDetails.slot.count++;
		V.saveDetails.slot.dayCount++;
		State.history[idx].variables.saveDetails.slot.dayCount++;
		const sessionState = getSessionState();
		if (sessionState != null) {
			const sidx = sessionState.index;
			sessionState.history[sidx].variables.saveDetails.slot.dayCount++;
			sessionState.history[sidx].variables.saveDetails.slot.count++;
			setSessionState(sessionState);
		}
	}
};

window.importSettings = function (data, type) {
	let reader;
	switch (type) {
		case "text":
			V.importString = document.getElementById("settingsDataInput").value;
			Wikifier.wikifyEval('<<displaySettings "importConfirmDetails">>');
			break;
		case "file":
			reader = new FileReader();
			reader.addEventListener("load", function (e) {
				V.importString = e.target.result;
				Wikifier.wikifyEval('<<displaySettings "importConfirmDetails">>');
			});
			reader.readAsBinaryString(data[0]);
			break;
		case "function":
			importSettingsData(data);
			break;
	}
};

const importSettingsData = function (data) {
	let S = null;
	const result = data;
	if (result != null && result != null) {
		// console.log("json",JSON.parse(result));
		S = JSON.parse(result);
		if (V.passage === "Start" && S.starting != null) {
			S.starting = settingsConvert(false, "starting", S.starting);
		}
		if (S.general != null) {
			S.general = settingsConvert(false, "general", S.general);
		}

		if (V.passage === "Start" && S.starting != null) {
			const listObject = settingsObjects("starting");
			const listKey = Object.keys(listObject);
			const namedObjects = ["player", "skinColor"];

			for (let i = 0; i < listKey.length; i++) {
				if (namedObjects.includes(listKey[i]) && S.starting[listKey[i]] != null) {
					const itemKey = Object.keys(listObject[listKey[i]]);
					for (let j = 0; j < itemKey.length; j++) {
						if (V[listKey[i]][itemKey[j]] != null && S.starting[listKey[i]][itemKey[j]] != null) {
							if (validateValue(listObject[listKey[i]][itemKey[j]], S.starting[listKey[i]][itemKey[j]])) {
								V[listKey[i]][itemKey[j]] = S.starting[listKey[i]][itemKey[j]];
							}
						}
					}
				} else if (!namedObjects.includes(listKey[i])) {
					if (V[listKey[i]] != null && S.starting[listKey[i]] != null) {
						if (validateValue(listObject[listKey[i]], S.starting[listKey[i]])) {
							V[listKey[i]] = S.starting[listKey[i]];
						}
					}
				}
			}
		}

		if (S.general != null) {
			const listObject = settingsObjects("general");
			const listKey = Object.keys(listObject);
			const namedObjects = ["map", "skinColor", "shopDefaults", "options"];
			// correct swapped min/max values
			if (S.general.breastsizemin > S.general.breastsizemax) {
				const temp = S.general.breastsizemin;
				S.general.breastsizemin = S.general.breastsizemax;
				S.general.breastsizemax = temp;
			}
			if (S.general.penissizemin > S.general.penissizemax) {
				const temp = S.general.penissizemin;
				S.general.penissizemin = S.general.penissizemax;
				S.general.penissizemax = temp;
			}

			for (let i = 0; i < listKey.length; i++) {
				if (namedObjects.includes(listKey[i]) && S.general[listKey[i]] != null) {
					const itemKey = Object.keys(listObject[listKey[i]]);
					for (let j = 0; j < itemKey.length; j++) {
						if (V[listKey[i]][itemKey[j]] != null && S.general[listKey[i]][itemKey[j]] != null) {
							if (validateValue(listObject[listKey[i]][itemKey[j]], S.general[listKey[i]][itemKey[j]])) {
								V[listKey[i]][itemKey[j]] = S.general[listKey[i]][itemKey[j]];
							}
						}
					}
				} else if (!namedObjects.includes(listKey[i])) {
					if (V[listKey[i]] != null && S.general[listKey[i]] != null) {
						if (validateValue(listObject[listKey[i]], S.general[listKey[i]])) {
							V[listKey[i]] = S.general[listKey[i]];
						}
					}
				}
			}
		}

		if (S.npc != null) {
			const listObject = settingsObjects("npc");
			// eslint-disable-next-line no-var
			const listKey = Object.keys(listObject);
			// eslint-disable-next-line no-var
			for (let i = 0; i < V.NPCNameList.length; i++) {
				if (S.npc[V.NPCNameList[i]] != null) {
					// eslint-disable-next-line no-var
					for (let j = 0; j < listKey.length; j++) {
						// Overwrite to allow for "none" default value in the start passage to allow for rng to decide
						if (V.passage === "Start" && ["pronoun", "gender"].includes(listKey[j]) && S.npc[V.NPCNameList[i]][listKey[j]] === "none") {
							V.NPCName[i][listKey[j]] = S.npc[V.NPCNameList[i]][listKey[j]];
						} else if (validateValue(listObject[listKey[j]], S.npc[V.NPCNameList[i]][listKey[j]])) {
							V.NPCName[i][listKey[j]] = S.npc[V.NPCNameList[i]][listKey[j]];
						}
					}
				}
			}
		}
	}
};

function validateValue(keys, value) {
	// console.log("validateValue", keys, value);
	const keyArray = Object.keys(keys);
	let valid = false;
	if (keyArray.length === 0) {
		valid = true;
	}
	if (keyArray.includes("min")) {
		if (keys.min <= value && keys.max >= value) {
			valid = true;
		}
	}
	if (keyArray.includes("decimals") && value != null) {
		// eslint-disable-next-line eqeqeq
		if (value.toFixed(keys.decimals) != value) {
			valid = false;
		}
	}
	if (keyArray.includes("bool")) {
		if (value === true || value === false) {
			valid = true;
		}
	}
	if (keyArray.includes("boolLetter")) {
		if (value === "t" || value === "f") {
			valid = true;
		}
	}
	if (keyArray.includes("strings") && value != null) {
		if (keys.strings.includes(value)) {
			valid = true;
		}
	}
	return valid;
}
window.validateValue = validateValue;

function exportSettings(data, type) {
	const S = {
		general: {
			map: {},
			skinColor: {},
			shopDefaults: {},
			options: {},
		},
		npc: {},
	};
	let listObject;
	let listKey;
	let namedObjects;
	if (V.passage === "Start") {
		S.starting = {
			player: {},
			skinColor: {},
		};
		listObject = settingsObjects("starting");
		listKey = Object.keys(listObject);
		namedObjects = ["player", "skinColor"];

		for (let i = 0; i < listKey.length; i++) {
			if (namedObjects.includes(listKey[i]) && V[listKey[i]] != null) {
				const itemKey = Object.keys(listObject[listKey[i]]);
				for (let j = 0; j < itemKey.length; j++) {
					if (V[listKey[i]][itemKey[j]] != null) {
						if (validateValue(listObject[listKey[i]][itemKey[j]], V[listKey[i]][itemKey[j]])) {
							S.starting[listKey[i]][itemKey[j]] = V[listKey[i]][itemKey[j]];
						}
					}
				}
			} else if (!namedObjects.includes(listKey[i])) {
				if (V[listKey[i]] != null) {
					if (validateValue(listObject[listKey[i]], V[listKey[i]])) {
						S.starting[listKey[i]] = V[listKey[i]];
					}
				}
			}
		}
	}

	listObject = settingsObjects("general");
	listKey = Object.keys(listObject);
	namedObjects = ["map", "skinColor", "shopDefaults", "options"];

	for (let i = 0; i < listKey.length; i++) {
		if (namedObjects.includes(listKey[i]) && V[listKey[i]] != null) {
			const itemKey = Object.keys(listObject[listKey[i]]);
			for (let j = 0; j < itemKey.length; j++) {
				if (V[listKey[i]][itemKey[j]] != null) {
					if (validateValue(listObject[listKey[i]][itemKey[j]], V[listKey[i]][itemKey[j]])) {
						S.general[listKey[i]][itemKey[j]] = V[listKey[i]][itemKey[j]];
					}
				}
			}
		} else if (!namedObjects.includes(listKey[i])) {
			if (V[listKey[i]] != null) {
				if (validateValue(listObject[listKey[i]], V[listKey[i]])) {
					S.general[listKey[i]] = V[listKey[i]];
				}
			}
		}
	}
	listObject = settingsObjects("npc");
	listKey = Object.keys(listObject);
	for (let i = 0; i < V.NPCNameList.length; i++) {
		S.npc[V.NPCNameList[i]] = {};
		for (let j = 0; j < listKey.length; j++) {
		  // Overwrite to allow for "none" default value in the start passage to allow for rng to decide
		  if (V.passage === "Start" && ["pronoun", "gender"].includes(listKey[j]) && V.NPCName[i][listKey[j]] === "none") {
			S.npc[V.NPCNameList[i]][listKey[j]] = V.NPCName[i][listKey[j]];
		  } else if (validateValue(listObject[listKey[j]], V.NPCName[i][listKey[j]])) {
			S.npc[V.NPCNameList[i]][listKey[j]] = V.NPCName[i][listKey[j]];
		  }
		}
	  }

	if (V.passage === "Start") {
		S.starting = settingsConvert(true, "starting", S.starting);
	}
	S.general = settingsConvert(true, "general", S.general);

	// console.log(S);
	const result = JSON.stringify(S);
	if (type === "text") {
		const textArea = document.getElementById("settingsDataInput");
		textArea.value = result;
	} else if (type === "file") {
		const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
		saveAs(blob, "DolSettingsExport.txt");
	}
}
window.exportSettings = exportSettings;

function settingsObjects(type) {
	let result;
	/* boolLetter type also requires the bool type aswell */
	switch (type) {
		case "starting":
			result = {
				bodysize: { min: 0, max: 3, decimals: 0, displayName: "Body size:", textMap: { '0': 'Tiny', '1': 'Small', '2': 'Normal', '3': 'Large' }, randomize: "characterAppearance" },
				breastsensitivity: { min: 1, max: 3, displayName: "Breast sensitivity:", decimals: 0, textMap: { 1: 'Normal', 2: 'Sensitive', 3: 'Very Sensitive' }, randomize: "characterTrait" },
				genitalsensitivity: { min: 1, max: 3, displayName: "Genital sensitivity:", decimals: 0, textMap: { 1: 'Normal', 2: 'Sensitive', 3: 'Very Sensitive' }, randomize: "characterTrait" },
				mouthsensitivity: { min: 1, max: 3, decimals: 0, displayName: "Mouth sensitivity:", textMap: { 1: 'Normal', 2: 'Sensitive', 3: 'Very Sensitive' }, randomize: "characterTrait" },
				bottomsensitivity: { min: 1, max: 3, decimals: 0, displayName: "Bottom sensitivity:", textMap: { 1: 'Normal', 2: 'Sensitive', 3: 'Very Sensitive' }, randomize: "characterTrait" },
				eyeselect: {
					strings: ["purple", "dark blue", "light blue", "amber", "hazel", "green", "lime green", "red", "pink", "grey", "light grey", "random"],
					randomize: "characterAppearance",
					displayName: "Eye colour:"
				},
				hairselect: {
					strings: [
						"red",
						"jetblack",
						"black",
						"brown",
						"softbrown",
						"lightbrown",
						"burntorange",
						"blond",
						"softblond",
						"platinumblond",
						"ashyblond",
						"strawberryblond",
						"ginger",
						"random",
					],
					displayName: "Hair colour:",
					randomize: "characterAppearance"
				},
				hairlength: { min: 0, max: 400, decimals: 0, displayName: "Hair length:", randomize: "characterAppearance" },
				awareselect: {
					strings: ["innocent", "knowledgeable"],
					displayName: "Awareness:",
					randomize: "characterTrait",
				},
				background: {
					strings: [
						"waif",
						"nerd",
						"athlete",
						"delinquent",
						"promiscuous",
						"exhibitionist",
						"deviant",
						"beautiful",
						"crossdresser",
						"lustful",
						"greenthumb",
						"plantlover",
					],
					displayName: "Background:",
					randomize: "characterTrait",
				},
				gamemode: { strings: ["normal", "soft", "hard"], displayName: "Game difficulty:" },
				startingseason: { strings: ["autumn", "winter", "spring", "summer", "random"], displayName: "Starting season:", randomize: "gameplay" },
				ironmanmode: { bool: false, displayName: "Ironman mode:" },
				player: {
					gender: { strings: ["m", "f", "h"], displayName: "Gender:", textMap: {"m": "Male", "f": "Female", "h": "Hermaphrodite"}, randomize: "characterAppearance" },
					gender_body: { strings: ["m", "f", "a"], displayName: "Body type:", textMap: {"m": "Masculine", "f": "Feminine", "a": "Androgynous"}, randomize: "characterAppearance" },
					ballsExist: { bool: true, displayName: "Balls:", textMap: { true: "Existent", false: "Nonexistent" }, randomize: "characterAppearance" },
					freckles: { bool: true, displayName: "Freckles:", textMap: { true: "Existent", false: "Nonexistent" }, strings: ["random"], randomize: "characterAppearance" },
					breastsize: { min: 0, max: 4, decimals: 0, displayName: "Breast size:", textMap: { '0': 'Flat', '1': 'Budding', '2': 'Tiny', '3': 'Small', '4': 'Pert' }, randomize: "characterAppearance" },
					penissize: { min: 0, max: 2, decimals: 0, displayName: "Penis size:", textMap: { '0': 'Tiny', '1': 'Small', '2': 'Normal' }, randomize: "characterAppearance" },
					bottomsize: { min: 0, max: 3, decimals: 0, displayName: "Bottom size:", textMap: { 0: 'Slender', 1: 'Slim', 2: 'Modest', 3: 'Cushioned' }, randomize: "characterAppearance" },				},
				skinColor: {
					natural: {
						strings: ["light", "medium", "dark", "gyaru", "ylight", "ymedium", "ydark", "ygyaru"],
						randomize: "characterAppearance",
						displayName: "Natural Skintone:"
					},
					range: { min: 0, max: 100, decimals: 0, randomize: "characterAppearance", displayName: "Initial Tan Value:" }
				},
			};
			break;
		case "general":
			result = {
				malechance: { min: 0, max: 100, decimals: 0, displayName: "Percentage of people attracted to you that are male:", randomize: "encounter" },
				maleChanceSplit: { boolLetter: true, bool: true, displayName: "NPC attraction split by gender appearance:", },
				maleChanceMale: { min: 0, max: 100, decimals: 0, displayName: "NPCs who are attracted to men:", randomize: "encounter" },
				maleChanceFemale: { min: 0, max: 100, decimals: 0, displayName: "NPCs who are attracted to women:", randomize: "encounter" },
				dgchance: { min: 0, max: 100, decimals: 0, displayName: "Percentage of women that have penises:", randomize: "encounter" },
				cbchance: { min: 0, max: 100, decimals: 0, displayName: "Percentage of men that have vaginas:", randomize: "encounter" },
				malevictimchance: { min: 0, max: 100, decimals: 0, displayName: "Percentage of other victims that are male:", randomize: "encounter" },
				npcVirginityChance: { min: 0, max: 100, decimals: 0, displayName: "Likelihood of students being virgins:", randomize: "encounter" },
				npcVirginityChanceAdult: { min: 0, max: 100, decimals: 0, displayName: "Likelihood of adults being virgins:", randomize: "encounter" },
				breast_mod: { min: -12, max: 12, decimals: 0, displayName: "Average size of women's breasts:", randomize: "encounter" },
				penis_mod: { min: -8, max: 8, decimals: 0, displayName: "Average size of NPC penises:", randomize: "encounter" },
				whitechance: { min: 0, max: 100, decimals: 0, displayName: "Likelihood that NPCs have light skin:", randomize: "encounter" },
				blackchance: { min: 0, max: 100, decimals: 0, displayName: "Likelihood that NPCs have dark skin:", randomize: "encounter" },
				straponchance: { min: 0, max: 100, decimals: 0, displayName: "Percentage of women that have strap-on penises:", randomize: "encounter" },
				alluremod: { min: 0.2, max: 2, decimals: 1, displayName: "Encounter rate:", randomize: "gameplay" },
				clothesPrice: { min: 1, max: 10, decimals: 1, displayName: "Cost of clothing:", randomize: "gameplay" },
				clothesPriceUnderwear: { min: 1, max: 2, decimals: 1, displayName: "Cost of underwear:", randomize: "gameplay" },
				clothesPriceSchool: { min: 1, max: 2, decimals: 1, displayName: "Cost of school clothes:", randomize: "gameplay" },
				clothesPriceLewd: { min: 0.1, max: 2, decimals: 1, displayName: "Cost of lewd clothes:", randomize: "gameplay" },
				tending_yield_factor: { min: 1, max: 10, decimals: 1, displayName: "Crop yield:", randomize: "gameplay" },
				rentmod: { min: 0.1, max: 3, decimals: 1, displayName: "Bailey's rent:", randomize: "gameplay" },
				beastmalechance: { min: 0, max: 100, decimals: 0, displayName: "Percentage of beasts attracted to you that are male:", randomize: "encounter" },
				beastMaleChanceSplit: { boolLetter: true, bool: true, displayName: "Beast attraction split by gender appearance:" },
				beastMaleChanceMale: { min: 0, max: 100, decimals: 0, displayName: "Beasts who are attracted to men:", randomize: "encounter" },
				beastMaleChanceFemale: { min: 0, max: 100, decimals: 0, displayName: "Beasts who are attracted to women:", randomize: "encounter" },
				monsterchance: { min: 0, max: 100, decimals: 0, displayName: "Percentage of beasts that are replaced with monster girls or boys:", randomize: "encounter" },
				monsterhallucinations: { boolLetter: true, bool: true, displayName: "Only replace beasts with monsters while hallucinating:", randomize: "encounter" },
				blackwolfmonster: { min: 0, max: 2, decimals: 0, displayName: "Black Wolf beast type:", textMap: { 0: 'Always a beast', 1: 'Monster girl or boy when requirements met', 2: 'Always a monster girl or boy' }, randomize: "encounter" },
				greathawkmonster: { min: 0, max: 2, decimals: 0, displayName: "Great Hawk beast type:", textMap: { 0: 'Always a beast', 1: 'Monster girl or boy when requirements met', 2: 'Always a monster girl or boy' }, randomize: "encounter" },
				bestialitydisable: { boolLetter: true, bool: true, displayName: "Bestiality:" },
				swarmdisable: { boolLetter: true, bool: true, displayName: "Swarms:" },
				slimedisable: { boolLetter: true, bool: true, displayName: "Slimes:" },
				voredisable: { boolLetter: true, bool: true, displayName: "Vore:" },
				tentacledisable: { boolLetter: true, bool: true, displayName: "Tentacles:" },
				analdisable: { boolLetter: true, bool: true, displayName: "Anal:" },
				analdoubledisable: { boolLetter: true, bool: true, displayName: "Double Anal:" },
				analingusdisablegiving: { boolLetter: true, bool: true, displayName: "Analingus (Giving):" },
				analingusdisablereceiving: { boolLetter: true, bool: true, displayName: "Analingus (Receiving):" },
				vaginaldoubledisable: { boolLetter: true, bool: true, displayName: "Double Vaginal:" },
				transformdisable: { boolLetter: true, bool: true, displayName: "Animal Transformations:" },
				transformdisabledivine: { boolLetter: true, bool: true, displayName: "Divine Transformations:" },
				hirsutedisable: { boolLetter: true, bool: true },
				pbdisable: { boolLetter: true, bool: true, displayName: "Pubic hair:" },
				breastfeedingdisable: { boolLetter: true, bool: true, displayName: "Breastfeeding:" },
				parasitepregdisable: { boolLetter: true, bool: true, displayName: "Parasite pregnancy:" },
				watersportsdisable: { boolLetter: true, bool: true, displayName: "Watersports:" },
				facesitdisable: { boolLetter: true, bool: true, displayName: "Facesitting:" },
				spiderdisable: { boolLetter: true, bool: true, displayName: "Spiders:" },
				bodywritingLvl: { min: 0, max: 3, decimals: 0, displayName: "Bodywriting:", textMap: { 0: 'NPCs will not write on you', 1: 'NPCs may ask to write on you', 2: 'NPCs may forcibly write on you', 3: 'NPCs may forcibly write on and tattoo you' } },
				parasitedisable: { boolLetter: true, bool: true, displayName: "Parasites:" },
				slugdisable: { boolLetter: true, bool: true, displayName: "Slugs:" },
				waspdisable: { boolLetter: true, bool: true, displayName: "Wasps:" },
				beedisable: { boolLetter: true, bool: true, displayName: "Bees:" },
				lurkerdisable: { boolLetter: true, bool: true, displayName: "Lurkers:" },
				horsedisable: { boolLetter: true, bool: true, displayName: "Horses:" },
				pregnancyspeechdisable: { boolLetter: true, bool: true, displayName: "Fertility references:" },
				plantdisable: { boolLetter: true, bool: true, displayName: "Plantpeople:" },
				footdisable: { boolLetter: true, bool: true, displayName: "Foot fetish:" },
				toydildodisable: { boolLetter: true, bool: true, displayName: "Dildos:" },
				toywhipdisable: { boolLetter: true, bool: true, displayName: "Whips:" },
				toymultiplepenetration: { boolLetter: true, bool: true, displayName: "Multiple penetration with sex toys:" },
				hypnosisdisable: { boolLetter: true, bool: true, displayName: "Hypnosis:" },
				ruffledisable: { boolLetter: true, bool: true, displayName: "Ruffled hair:" },
				forcedcrossdressingdisable: { boolLetter: true, bool: true, displayName: "Forced crossdressing:" },
				asphyxiaLvl: { min: 0, max: 4, decimals: 0, displayName: "Asphyxiation:", textMap: { 0: 'NPCs will not touch your neck', 1: 'NPCs may grab you by the neck without impeding breathing', 2: 'NPCs may try to choke you during consensual encounters', 3: 'NPCs may try to strangle you during non-consensual encounters' } },
				NudeGenderDC: { min: 0, max: 2, decimals: 0, displayName: "Nude gender appearance:", textMap: { '-1': 'NPCs will ignore genitals when perceiving gender, and crossdressing warnings will not be displayed', 0: 'NPCs will ignore genitals when perceiving gender', 1: 'NPCs will consider your genitals when perceiving your gender', 2: 'NPCs will judge your gender based on your genitals' } },
				breastsizemin: { min: 0, max: 4, decimals: 0, displayName: "Minimum breast size:", textMap: { '0': 'Flat', '1': 'Budding', '2': 'Tiny', '3': 'Small', '4': 'Pert' } },
				breastsizemax: { min: 0, max: 12, decimals: 0, displayName: "Maximum breast size:", textMap: { '0': 'Flat', '1': 'Budding', '2': 'Tiny', '3': 'Small', '4': 'Pert', '5': 'Modest', '6': 'Full', '7': 'Large', '8': 'Ample', '9': 'Massive', '10': 'Huge', '11': 'Gigantic', '12': 'Enormous' } },
				bottomsizemin: { min: 0, max: 2, decimals: 0, displayName: "Minimum bottom size:", textMap: { 0: 'Slender', 1: 'Slim', 2: 'Modest', 3: 'Cushioned' } },
				bottomsizemax: { min: 0, max: 9, decimals: 0, displayName: "Maximum bottom size:", textMap: { 0: 'Slender', 1: 'Slim', 2: 'Modest', 3: 'Cushioned', 4: 'Soft', 5: 'Round', 6: 'Plump', 7: 'Large', 8: 'Huge', 9: 'Huge' } },
				penissizemin: { min: -2, max: 0, decimals: 0, displayName: "Minimum penis size:", textMap: { '-2': 'Micro', '-1': 'Mini', '0': 'Tiny' } },
				penissizemax: { min: -2, max: 4, decimals: 0, displayName: "Maximum penis size:", textMap: { '-2': 'Micro', '-1': 'Mini', '0': 'Tiny', '1': 'Small', '2': 'Normal', '3': 'Large', '4': 'Enormous' } },
				basePlayerPregnancyChance: { min: 0, max: 96, decimals: 0, displayName: "Base player pregnancy chance:", randomize: "gameplay" },
				baseNpcPregnancyChance: { min: 0, max: 16, decimals: 0, displayName: "Base NPC pregnancy chance:", randomize: "gameplay" },
				humanPregnancyMonths: { min: 1, max: 9, decimals: 0, displayName: "Human pregnancy length:" },
				wolfPregnancyWeeks: { min: 2, max: 12, decimals: 0, displayName: "Wolf pregnancy length:" },
				playerPregnancyHumanDisable: { boolLetter: true, bool: true, displayName: "Player pregnancy with humans:" },
				playerPregnancyBeastDisable: { boolLetter: true, bool: true, displayName: "Player pregnancy with beasts:" },
				npcPregnancyDisable: { boolLetter: true, bool: true, displayName: "NPC pregnancy:" },
				cycledisable: { boolLetter: true, bool: true, displayName: "Menstrual cycle:" },
				pregnancytype: { strings: ["realistic", "fetish", "silly"], displayName: "Pregnancy mode:" },
				condomLvl: { min: 0, max: 3, decimals: 0, displayName: "Condoms:", textMap: { 0: 'Everyone is allergic to latex and safe sex', 1: 'Only you may use condoms, but you may give NPCs condoms', 2: 'NPCs will only have condoms if pregnancy between them and the player is possible', 3: 'NPCs may have and use condoms whenever they please' }, randomize: "gameplay" },
				checkstyle: { strings: ["percentage", "words", "skillname"], randomize: "gameplay", displayName: "Skill check display:"	},
				debugdisable: { boolLetter: true, bool: true, displayName: "Debug mode:" },
				statdisable: { boolLetter: true, bool: true, displayName: "Blind stats mode:" },
				cheatdisabletoggle: { boolLetter: true, bool: true, displayName: "Cheat mode:" },
				confirmSave: { bool: true, displayName: "Require confirmation on save:" },
				confirmLoad: { bool: true, displayName: "Require confirmation on load:" },
				confirmDelete: { bool: true, displayName: "Require confirmation on delete:" },
				reducedLineHeight: { bool: true, displayName: "Reduced line height:" },
				multipleWardrobes: { strings: [false, "isolated"], displayName: "Multiple wardrobes:" }, //, "all"
				outfitEditorPerPage: { min: 5, max: 20, decimals: 0, displayName: "Items per page:" }, //, "all"
				options: {
					neverNudeMenus: { bool: true, displayName: "Hide player nudity in menus:" },
					showCaptionText: { bool: true, displayName: "Show caption text in sidebar:" },
					sidebarStats: { strings: ["disabled", "limited", "all"], displayName: "Closed sidebar stats:" },
					sidebarTime: { strings: ["disabled", "top", "bottom"], displayName: "Closed sidebar time:" },
					combatControls: { strings: ["radio", "columnRadio", "lists", "limitedLists"], displayName: "Combat controls:" },
					mapMovement: { bool: true, displayName: "Enable movement by clicking on map:" },
					mapTop: { bool: true, displayName: "Move the map above the map links:" },
					mapMarkers: { bool: true, displayName: "Show clickable areas on maps:" },
					images: { min: 0, max: 1, decimals: 0, displayName: "Images:" },
					combatImages: { min: 0, max: 1, decimals: 0, displayName: "Combat images:" },
					bodywritingImages: { bool: true, displayName: "Bodywriting images:" },
					silhouetteEnabled: { bool: true, displayName: "NPC silhouettes:" },
					tanImgEnabled: { bool: true, displayName: "Visual representation of skin colours:" },
					tanningEnabled: { bool: true, displayName: "Tanning due to sun exposure:" },
					sidebarAnimations: { bool: true, displayName: "Sidebar images:" },
					blinkingEnabled: { bool: true, displayName: "Animated blinking:" },
					combatAnimations: { bool: true, displayName: "Combat animations:" },
					halfClosedEnabled: { bool: true, displayName: "Half-closed eyes:" },
					characterLightEnabled: { bool: true, displayName: "Character lighting:" },
					lightSpotlight: { min: 0, max: 1, decimals: 2, displayName: "Spotlight:" },
					lightGradient: { min: 0, max: 1, decimals: 2, displayName: "Gradient:" },
					lightGlow: { min: 0, max: 1, decimals: 2, displayName: "Glow:" },
					lightFlat: { min: 0, max: 1, decimals: 2, displayName: "Flat light:" },
					lightCombat: { min: 0, max: 1, decimals: 2, displayName: "Combat light:" },
					lightTFColor: { min: 0, max: 1, decimals: 2, displayName: "Angel/Devil TF colour components:" },
					maxStates: { min: 1, max: 20, decimals: 0, displayName: "History depth:" },
					newWardrobeStyle: { bool: true, displayName: "Use the new wardrobe style:" },
					useNarrowMarket: { bool: true, displayName: "Use 'narrow screen' version of market inventory:" },
					skipStatisticsConfirmation: { bool: true, displayName: "Skip confirmation when viewing extra stats:" },
					passageCount: { strings: ["disabled", "changes", "total"], displayName: "Display passage count:" },
					playtime: { bool: true, displayName: "Display play time:" },
					numberify_enabled: { min: 0, max: 1, decimals: 0, displayName: "Enable numbered link navigation:" },
					timestyle: { strings: ["military", "ampm"], displayName: "Time style:" },
					tipdisable: { boolLetter: true, bool: true, displayName: "Sidebar Tips:" },
					pepperSprayDisplay: { strings: ["none", "sprays", "compact"], displayName: "Pepper spray display:" },
					condomsDisplay: { strings: ["none", "standard"], displayName: "Condom display:" },
					closeButtonMobile: { bool: true, displayName: "Items per page:" },
					oldclock: { bool: true, displayName: "Use old clock style:" },
					showDebugRenderer: { bool: true, displayName: "Enable renderer debugger:" },
					numpad: { bool: true, displayName: "Enable numpad:" },
					traitOverlayFormat: { strings: ["table", "reducedTable", "list"], displayName: "Display traits:" },
					font: { strings: ["", "Arial", "Verdana", "TimesNewRoman", "Georgia", "Garamond", "CourierNew", "LucidaConsole", "Monaco", "ComicSans"], displayName: "Font:" },
					passageLineHeight: { strings: [0, 1, 1.25, 1.5, 1.75, 2], displayName: "Passage line height:" },
					overlayLineHeight: { strings: [0, 1, 1.25, 1.5, 1.75, 2], displayName: "Overlay line height:" },
					sidebarLineHeight: { strings: [0, 1, 1.25, 1.5, 1.75, 2], displayName: "Sidebar line height:" },
					passageFontSize: { strings: [0, 10, 12, 14, 16, 18, 20], displayName: "Passage font size:" },
					overlayFontSize: { strings: [0, 10, 12, 14, 16, 18, 20], displayName: "Overlay font size:" },
					sidebarFontSize: { strings: [0, 12, 14, 16, 18, 20], displayName: "Sidebar font size:" },
				},
				shopDefaults: {
					alwaysBackToShopButton: { bool: true },
					color: {
						strings: ["black", "blue", "brown", "green", "pink", "purple", "red", "tangerine", "teal", "white", "yellow", "custom", "random"],
					},
					colourItems: { strings: ["disable", "random", "default"] },
					compactMode: { bool: true },
					disableReturn: { bool: true },
					highContrast: { bool: true },
					mannequinGender: { strings: ["same", "opposite", "male", "female"] },
					mannequinGenderFromClothes: { bool: true },
					noHelp: { bool: true },
					noTraits: { bool: true },
					secColor: {
						strings: ["black", "blue", "brown", "green", "pink", "purple", "red", "tangerine", "teal", "white", "yellow", "custom", "random"],
					},
				},
			};
			break;
		case "npc":
			result = {
				pronoun: { strings: ["m", "f"], displayName: "Pronoun: ", textMap: { 'none': 'N/A', 'm': 'Male', 'f': 'Female' } },
				gender: { strings: ["m", "f"], displayName: "Genitalia: ", textMap: { 'none': 'N/A', 'm': 'Penis', 'f': 'Vagina' } },
				penissize: { min: 0, max: 4, decimals: 0, displayName: "Penis size: ", textMap: { '0': 'N/A', '1': 'Tiny', '2': 'Average', '3': 'Thick', '4': 'Huge' } },
				breastsize: { min: 0, max: 12, decimals: 0, displayName: "Breast size: ", textMap: { 'none': 'N/A', '0': 'Flat', '1': 'Budding', '2': 'Tiny', '3': 'Small', '4': 'Pert', '5': 'Modest', '6': 'Full', '7': 'Large', '8': 'Ample', '9': 'Massive', '10': 'Huge', '11': 'Gigantic', '12': 'Enormous' } },
			};
			break;
	}
	return result;
}
window.settingsObjects = settingsObjects;

/* Converts specific settings to so they don't look so chaotic to players */
function settingsConvert(exportType, type, settings) {
	const listObject = settingsObjects(type);
	const result = settings;
	const keys = Object.keys(listObject);
	for (let i = 0; i < keys.length; i++) {
		if (result[keys[i]] === undefined) continue;
		if (["map", "skinColor", "player", "shopDefaults", "options"].includes(keys[i])) {
			const itemKey = Object.keys(listObject[keys[i]]);
			for (let j = 0; j < itemKey.length; j++) {
				if (result[keys[i]][itemKey[j]] === undefined) continue;
				const keyArray = Object.keys(listObject[keys[i]][itemKey[j]]);
				if (exportType) {
					if (keyArray.includes("boolLetter") && keyArray.includes("bool")) {
						if (result[keys[i]][itemKey[j]] === "t") {
							result[keys[i]][itemKey[j]] = true;
						} else if (result[keys[i]][itemKey[j]] === "f") {
							result[keys[i]][itemKey[j]] = false;
						}
					}
				} else {
					if (keyArray.includes("boolLetter") && keyArray.includes("bool")) {
						if (result[keys[i]][itemKey[j]] === true) {
							result[keys[i]][itemKey[j]] = "t";
						} else if (result[keys[i]][itemKey[j]] === false) {
							result[keys[i]][itemKey[j]] = "f";
						}
					}
				}
			}
		} else {
			const keyArray = Object.keys(listObject[keys[i]]);
			if (exportType) {
				if (keyArray.includes("boolLetter") && keyArray.includes("bool")) {
					if (result[keys[i]] === "t") {
						result[keys[i]] = true;
					} else if (result[keys[i]] === "f") {
						result[keys[i]] = false;
					}
				}
			} else {
				if (keyArray.includes("boolLetter") && keyArray.includes("bool")) {
					if (result[keys[i]] === true) {
						result[keys[i]] = "t";
					} else if (result[keys[i]] === false) {
						result[keys[i]] = "f";
					}
				}
			}
		}
	}
	return result;
}
window.settingsConvert = settingsConvert;

window.loadExternalExportFile = function () {
	importScripts("DolSettingsExport.json")
		.then(function () {
			const textArea = document.getElementById("settingsDataInput");
			textArea.value = JSON.stringify(DolSettingsExport);
		})
		.catch(function () {
			// console.log(err);
			const button = document.getElementById("LoadExternalExportFile");
			button.value = "Error Loading";
		});
};

window.randomizeSettings = function (filter) {
	const settingsResult = {};
	const settingContainers = ["player", "skinColor"];
	const randomizeSettingLoop = function (settingsObject, mainObject, subObject) {
		if (mainObject && !settingsResult[mainObject]) {
			settingsResult[mainObject] = {};
		}
		if (subObject) {
			if (!settingsResult[mainObject][subObject]) settingsResult[mainObject][subObject] = {};
		}
		Object.entries(settingsObject).forEach(setting => {
			if (settingContainers.includes(setting[0])) {
				randomizeSettingLoop(setting[1], mainObject, setting[0]);
			} else if ((!filter && setting[1].randomize) || (filter && filter === setting[1].randomize)) {
				if (subObject) {
					settingsResult[mainObject][subObject][setting[0]] = randomizeSettingSet(setting[1]);
				} else {
					settingsResult[mainObject][setting[0]] = randomizeSettingSet(setting[1]);
				}
			}
		});
	};
	const randomNumber = function (min, max, decimals = 0) {
		const decimalsMult = Math.pow(10, decimals);
		const minMult = min * decimalsMult;
		const maxMult = (max + 1) * decimalsMult;
		const rn = Math.floor(Math.random() * (maxMult - minMult)) / decimalsMult + min;
		return parseFloat(rn.toFixed(decimals));
	};
		  const randomizeSettingSet = function (setting) {
		let result;
		const keys = Object.keys(setting);
		if (keys.includes("min")) {
			result = randomNumber(setting.min, setting.max, setting.decimals);
		}
		if (keys.includes("strings")) {
			result = setting.strings.pluck();
		}
		if (keys.includes("boolLetter")) {
			result = ["t", "f"].pluck();
		}
		if (keys.includes("bool")) {
			result = [true, false].pluck();
		}
		return result;
	};
	if (V.passage === "Start") {
		randomizeSettingLoop(settingsObjects("starting"), "starting");
	}
	randomizeSettingLoop(settingsObjects("general"), "general");

	return JSON.stringify(settingsResult);
};

// !!Hack warning!! Don't use it maybe?
window.updateMoment = function () {
	// change current (and only) moment in local history
	State.history[State.activeIndex].variables = JSON.parse(JSON.stringify(V));
	// prepare the moment object with modified history
	const moment = State.marshalForSave();
	// if sessionStorage compression is enabled again,
	// replace moment.history with moment.delta, because that's what SugarCube expects to find
	// delta-encode the state
	// delete Object.assign(moment, { delta: State.deltaEncode(moment.history) }).history;

	// replace saved moment in session with the new one
	setSessionState(moment);

	// Voilà! F5 will reload the current state now without going to another passage!
};

window.isJsonString = function (s) {
	try {
		JSON.parse(s);
	} catch (e) {
		return false;
	}
	return true;
};

/**
 * Recursively traverses an object, reporting an error for any NaN values or null objects or functions\
 * Example: `let result = recurseNaN(a, "a");`.
 *
 * @param {object} obj The head of the object tree.
 * @param {string} path A string to indicate the path, put the object name in quotes.
 * @param {object} result An object to store the results in. - leave blank.
 * @param {Set} hist A set used for Cycle history. - leave blank.
 */

function recurseNaN(obj, path, result = null, hist = null) {
	result = Object.assign({ nulls: [], nan: [], functions: [], cycle: [] }, result);
	if (hist == null) hist = new Set([obj]);
	/* let result = {"nulls" : [], "nan" : [], "cycle" : []}; */
	for (const [key, val] of Object.entries(obj)) {
		const newPath = `${path}.${key}`;
		if (Number.isNaN(val)) {
			result.nan.push(newPath);
			continue;
		}
		if (typeof val === "function") result.functions.push(newPath);
		if (typeof val === "object") {
			if (val === null) {
				result.nulls.push(newPath);
				continue;
			}
		} else {
			continue;
		}
		if (hist.has(val)) {
			result.cycle.push(newPath);
			continue;
		}
		hist.add(val);
		recurseNaN(val, `${newPath}`, result, hist);
	}
	return result;
}
window.recurseNaN = recurseNaN;

/**
 * Recursively traverse target object, finding and returning an object containing all the NaN vars inside.
 *
 * Use with objectAssignDeep to re-assign 0 to all bad NaN'd vars.	Use with caution.
 *
 * @param {object} target The object to traverse.	Defaults to V ($).
 * @returns {object} An object containing all the properties/sub-props that were NaN.
 */
function scanNaNs(target = V) {
	// If this gets set to true during function, a NaN was hit within scope.
	let isMutated = false;
	const current = Object.create({});
	// Loop through all properties of the target for NaNs and objects to scan.
	for (const [key, value] of Object.entries(target)) {
		// If value is an object, scan that property.
		if (value && typeof value === "object") {
			const resp = scanNaNs(value);
			// If scanNaNs returns a non-null object, there was a NaN somewhere, so make sure to update current obj.
			if (resp && typeof resp === "object") {
				current[key] = resp;
				isMutated = true;
			}
		} else if (typeof value === "number") {
			// Does what it says on the tin, make sure you only test numbers.
			if (isNaN(value)) {
				// Set property to a default value, likely zero.
				current[key] = 0;
				isMutated = true;
			}
		}
	}
	// Return a fully realised object, indicating there were NaNs, or null, which can be ignored.
	// isMutated controls whether we have encountered NaNs, remember to update where necessary.
	return isMutated ? current : null;
}
window.scanNaNs = scanNaNs;
