/* eslint-disable jsdoc/require-returns-type */
/* eslint-disable no-undef */
// Format for storing the parents of a child.
const parentList = {
	mothers: [{ name: "pc", compressed: "none", births: 0, kids: 0, id: 0 }],
	fathers: [{ name: "pc", compressed: "none", kids: 0, id: 0 }],
};

// basic constructor for the parent list.
const parent = ({ name = null, compressed = null, kids = 0, id = null, births = undefined }) => {
	return {
		name,
		compressed,
		kids,
		id,
		births,
	};
};

/**
 * @description Finds the highest id within the passed parent type (mother or father).
 * @param {number} parentType The part of the parent list that is being looked in. Use 0 for mothers  or 1 for fathers.
 * @returns {number} The highest id value in the passed list type.
 */
function findMaxParentId(parentType = 0) {
	let newId = -1;
	const parent = parentType === 0 ? "mothers" : "fathers";
	const pListLen = V.parentList[parent].length;

	for (let i = 0; i < pListLen; i++) {
		if (V.parentList[parent][i].id > newId) newId = V.parentList[parent][i].id;
	}

	return newId;
}

/**
 * @description Looks for the passed parent's id in the passed list type.
 * @param {number} parentId The id of the parent.
 * @param {number} parentType The part of the parent list that is being looked in. Use 0 for mothers  or 1 for fathers. Defaults to mothers if no value is entered.
 * @param {boolean} byName If true, then this function will return an array containing all mothers or fathers that have the passed name.
 * @returns All of the information about the requested parent. Returns -1 if there was nothing to be found.
 */
function findParent(parentId, parentType = 0, byName = false) {
	const parent = parentType === 0 ? "mothers" : "fathers";
	const pListLen = V.parentList[parent].length;

	if (byName) {
		if (!isNaN(parentId)) return -1;
		const list = [];

		for (let i = 0; i < pListLen; i++) {
			if (V.parentList[parent][i].name === parentId) {
				list.push(V.parentList[parent][i]);
			}
		}

		if (list.length > 0) return list;
	} else {
		if (isNaN(parentId) || parentId < 0) return -1;
		for (let i = 0; i < pListLen; i++) {
			if (V.parentList[parent][i].id === parentId) {
				return V.parentList[parent][i];
			}
		}
	}

	return -1;
}

/**
 * @description Finds the number of kids a passed parent has.
 * @param {number} parentId The id of the parent.
 * @param {number} parentType The part of the parent list that is being looked in. Use 0 for mothers  or 1 for fathers. Defaults to mothers if no value is entered.
 * @param {boolean} byName If true, searches the parent list type using the name instead of the id. This will then return the first match.
 * @returns Returns the number of kids the passed parent has.
 */
function totalKids(parentId, parentType = 0, byName = false) {
	const parent = parentType === 0 ? "mothers" : "fathers";
	const pListLen = V.parentList[parent].length;

	if (!byName) {
		if (parentId < 0) return -1;

		for (let i = 0; i < pListLen; i++) {
			if (V.parentList[parent][i].id === parentId) {
				return V.parentList[parent][i].kids;
			}
		}
	} else {
		for (let i = 0; i < pListLen; i++) {
			if (V.parentList[parent][i].name === parentId) {
				return V.parentList[parent][i].kids;
			}
		}
	}

	return -1;
}

/**
 * @description Adds a new parent to the parent list on the passed side.
 * @param {string} name The name of the passed NPC.
 * @param {object} npcObject The object containing the NPC's information.
 * @param {number} parentType The part of the parent list that is being looked in. Use 0 for mothers  or 1 for fathers. Defaults to mothers if no value is entered.
 * @param {number} passedID The id number of the NPC is they already have one. If the id is a duplicate, it will assign a new id.
 */
function addToParentList(name, npcObject, parentType = 0, passedID = null) {
	let compressed = "none";
	const births = parentType === 0 ? 0 : undefined;
	const parent = parentType === 0 ? "mothers" : "fathers";
	if (npcObject) compressed = npcCompressor(npcObject);
	const idNum = passedID && findParent(passedID) === -1 ? passedID : findMaxParentId(parentType) + 1;

	V.parentList[parent].push({ name, compressed, kids: 0, id: idNum, births });
	return V.parentList[parent].last();
}

/**
 * @description Increases the kid count of the passed parent.
 * @param {number} parentId The id of the parent.
 * @param {number} parentType The part of the parent list that is being looked in. Use 0 for mothers  or 1 for fathers. Defaults to mothers if no value is entered.
 * @param {number} otherParentId The id of the other parent of the child. If passed a number, it will look in the other list for this parent and increase it's kid count as well.
 */
function increaseKids(parentId, parentType = 0, otherParentId = null) {
	parentType = parentType === 0 ? "mothers" : "fathers";
	if (V.parentList[parentType][parentId]) V.parentList[parentType][parentId].kids++;

	if (otherParentId || otherParentId === 0) {
		parentType = parentType === "fathers" ? "mothers" : "fathers";
		if (V.parentList[parentType][otherParentId]) V.parentList[parentType][otherParentId].kids++;
	}
}

/**
 * @description Increases the kid count of the passed parent.
 * @param {number} parentId The id of the parent.
 * @param {number} parentType The part of the parent list that is being looked in. Use 0 for mothers  or 1 for fathers. Defaults to mothers if no value is entered.
 */
function increaseBirths(parentId, parentType = 0) {
	parentType = parentType === 0 ? "mothers" : "fathers";
	if (parentType === "mothers" && V.parentList[parentType][parentId]) V.parentList[parentType][parentId].births++;
}

window.parentFunction = {
	parentList,
	parent,
	findMaxParentId,
	findParent,
	totalKids,
	addToParentList,
	increaseKids,
	increaseBirths,
};
