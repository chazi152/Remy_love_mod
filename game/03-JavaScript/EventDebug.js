/*  Jimmy: Blueprint for event structure, packaged for convenience.
 *  $event = {
 *      buffer = [] : EventNPC, refer to below
 *      schema = 1 : Integer, defines the current version on the save, useful for update tracking.
 *  }
 *
 *  EventNPC = {
 *      slot: Where the NPC is positioned in NPCList.
 *              EG: 0       $NPCList[0]
 *      time: The time the NPC was generated.
 *              EG: 805     13:48 / 1:48pm
 *      area: Where it was generated.
 *              EG: ['::Alleyways', 'eventsstreet', 'eventday', 'street8']
 *                      Passage        Widget 1      Widget 2    Widget 3
 *  }
 */

/**
 * Handles event data for NPC objects for debugging.
 *
 * @module EventData
 */
class EventData {
	constructor() {
		this.disable = false;
	}

	push(passage, index, time) {
		if (this.disable) return;
		if (V.event == null) {
			V.event = { buffer: [], schema: 1 };
		}
		V.event.buffer.push({
			slot: index,
			time,
			area: [passage, ...DOL.Stack.slice(0, -1)],
		});
	}

	pop(index) {
		if (this.disable) return;
		if (V.event) {
			V.event.buffer = V.event.buffer.filter(e => e.slot !== index); // TODO: Splice backwards instead.
			if (V.event.buffer.length === 0) {
				this.clear();
			}
		}
	}

	get(index) {
		return V.event ? V.event.buffer.find(e => e.slot === index) : -1;
	}

	has(index) {
		return V.event ? V.event.buffer.some(e => e.slot === index) : false;
	}

	getEvery(index) {
		return V.event ? V.event.buffer.filter(e => e.slot === index) : [];
	}

	count() {
		return V.event ? V.event.buffer.length : 0;
	}

	any() {
		return V.event ? V.event.buffer.length > 0 : false;
	}

	clear() {
		if (this.disable) return;
		delete V.event;
	}

	isSlotTaken(index) {
		return V.event ? V.event.buffer.some(e => e.slot === index) : false;
	}

	get Disable() {
		return this.disable;
	}

	set Disable(value) {
		if (typeof value === "boolean") {
			this.disable = value;
		} else {
			console.debug("EventData.disable set with unexpected data-type, requires boolean.");
		}
	}

	validate() {
		// Return false if an event is not in progress. True would be a problem in our stack system for NPCs. False indicates normal operation.
		if (V.event == null) return true;

		// Extrapolate slots
		const buffer = V.event.buffer;

		const npcList = V.NPCList;
		if (!Array.isArray(npcList)) return true;

		// Making assumptions for the validator, traverse from the end, and when we hit the first NPC, return index.
		// We plus one because we want the semantic size that we believe the NPC list is at.
		// An NPCList of [empty, npc, npc, empty, empty, empty] would have a size of 3.
		// We assume the first empty is a mistake, someone not following proper conduct in NPC gen.
		let numOfNPCs = -1;
		for (let i = npcList.length - 1; i >= 0; i--) {
			if (Object.hasOwn(npcList[i], "type")) {
				numOfNPCs = i + 1;
				break;
			}
		}

		// First check for if buffer's length exceeds NPCList's length. (Guaranteed gaps or inaccurate tracking)
		if (buffer.length > numOfNPCs) return false;

		// Generate array to track whether an NPC slot is used.
		const usedArr = Array(numOfNPCs).fill(false);
		// Example: [false, false, false, false, false] for 5 NPCs in $NPCList
		for (let i = 0; i < buffer.length; i++) {
			const element = buffer[i];
			if (!usedArr[element.slot]) {
				// Slot not accounted for yet, NPC is good.
				usedArr[element.slot] = true;
				continue;
			} else if (V.options.debugdisable === "f" || V.debug) {
				// NPC position is being used more than once, although not a gap, flag.
				console.warn("NPC slot", element.slot, "is being used more than once. Existing NPCs should be disposed before using their slot.");
				return false;
			}
		}

		// Check usedArr for false values. Filter results where false remains into a new array at the index.
		// [true, false, true, false] => [1, 3]
		// We then intend to display these indices to the user for debugging.
		const slots = [];
		for (let i = 0; i < usedArr.length; i++) {
			const e = usedArr[i];
			if (!e) slots.push(i);
		}
		if (slots.length !== 0) {
			// Index is slot, index being 0 or higher means we have an empty slot.
			if (V.options.debugdisable === "f" || V.debug) {
				console.warn("NPC slots that are empty:", slots);
			}
			return false;
		}
		return true;
	}

	update() {
		if (V.event == null) {
			return;
		}
		// Check if $event contains schema
		switch (V.event.schema) {
			case 1:
				// No need for updates.
				return;
		}
		// Update to newer schema (1 atm).
		// .event ['Farm Work', 'Farm Work', 'Farm Work', 'Farm Work']
		// .eventtime [497, 497, 497, 497]
		// .eventslot [0, 1, 2, 3]
		const event = [...V.event];
		V.event = {
			buffer: [],
			schema: 1,
		};
		for (let i = 0; i < event.length; i++) {
			this.push(event[i], V.eventslot[i], V.eventtime[i]);
		}
		delete V.eventtime;
		delete V.eventslot;
	}
}

// Jimmy: Potentially flawed design style, static class basically.
// But ends up being just an extended function in reality. (Not actually tho)
window.EventSystem = new EventData();
