/* eslint-disable no-undef */
const setChildFirstWord = (childId, word, playerAbsent = false) => {
	if (!childId && V.childSelected) childId = V.childSelected.childId;
	if (!childId && !V.childSelected) return false;

	const child = V.children[childId];

	// First word already set
	if (child.localVariables.firstWord) return false;

	if (!word) {
		const wordList = ["妈妈", "妈咪", "爸爸", "爹地", "叭叭", "不", "呐呐", "要", "昂", "拜", "拜拜", "你好"];

		// Should be last
		if (random(0, Math.ceil(2000 / wordList.length)) === 0) {
			wordList.push("Brouzouf");
		}
		word = wordList[random(0, wordList.length - 1)];
	}
	child.localVariables.firstWord = {
		word,
		date: { day: Time.monthDay, month: Time.monthName, year: Time.year },
		playerAbsent,
	};
	return word;
};
DefineMacro("setChildFirstWord", setChildFirstWord);

function updateChildActivity(childId) {
	const child = V.children[childId];
	if (!child) return null;

	// Make sure the child has all the required local variables for all the relevant events
	if (child.localVariables.activity === undefined) {
		child.localVariables.activity = "noEvent";
		child.localVariables.activityDay = Time.days;
		child.localVariables.activityHour = Time.hour;
		child.localVariables.crawling = 0;
		child.localVariables.talking = 0;
	}
	const daysFromLastActivity = Math.clamp(Time.days - child.localVariables.activityDay, 0, Infinity);
	const hoursFromLastActivity = Time.hour - (child.localVariables.activityHour - 24 * daysFromLastActivity);

	if (hoursFromLastActivity >= 4 || (Time.hour === 7 && hoursFromLastActivity >= 2) || child.localVariables.activity === "noEvent") {
		// Update the child's event
		switch (child.type) {
			case "human":
				humanChildActivity(childId);
				break;
			case "wolf":
			case "wolfboy":
			case "wolfgirl":
				wolfChildActivity(childId);
				break;
			default:
				return null;
		}
		child.localVariables.activityDay = Time.days;
		child.localVariables.activityHour = Time.hour;
	}
}
DefineMacro("updateChildActivity", updateChildActivity);

function humanChildActivity(childId) {
	const child = V.children[childId];
	if (!child) return null;

	const toySets = [];
	const toyNames = [];
	if (V.storedChildrenToys && V.storedChildrenToys[V.location]) {
		V.storedChildrenToys[V.location].forEach(toy => {
			toySets.pushUnique(toy.set);
			toyNames.pushUnique(toy.name);
		});
	}
	statusCheck("Robin");
	let activity = [];

	if (between(T.childTotalDays, 0, 100)) {
		if (Time.dayState === "night") {
			activity = activity.concat(["sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "restlessSleep", "restlessSleep", "crying", "nappyChange"]);
		} else {
			activity = activity.concat([
				"sleeping",
				"sleeping",
				"sleeping",
				"crying",
				"crying",
				"crying",
				"lonely",
				"nappyChange",
				"thumbSucking",
				"grumpyChild",
				"bathe",
			]);

			if (T.childTotalDays >= 50) activity.push("happy");

			if (toySets.includes("baby rattles")) activity.push("babyRattle");
			if (toySets.includes("teddy bears")) activity.push("teddyBear");
			if (toySets.includes("toy cars")) activity.push("toyCar");
			if (toySets.includes("dummies")) {
				activity.push("dummy");
			} else {
				activity.push("crying");
			}
			if (toySets.includes("clown")) activity.push("clown");
			if (T.robin_location === "orphanage") activity.push("Robin");
		}
	} else if (between(T.childTotalDays, 100, 200)) {
		if (Time.dayState === "night") {
			activity = activity.concat(["sleeping", "sleeping", "sleeping", "sleeping", "sleeping", "restlessSleep", "restlessSleep", "crying", "nappyChange"]);
		} else {
			activity = activity.concat([
				"sleeping",
				"sleeping",
				"sleeping",
				"crying",
				"lonely",
				"happy",
				"nappyChange",
				"thumbSucking",
				"talking",
				"grumpyChild",
				"bathe",
			]);

			if (T.childTotalDays >= 180) activity.push("readingAttempt");

			if (toySets.includes("baby rattles")) activity.push("babyRattle");
			if (toySets.includes("teddy bears")) activity.push("teddyBear");
			if (toySets.includes("toy cars")) activity.push("toyCar");
			if (toySets.includes("dummies")) {
				activity.push("dummy");
			} else {
				activity.push("crying");
			}
			if (toySets.includes("clown")) activity.push("clown");
			if (child.localVariables.talking >= 10 && T.childTotalDays >= 150) activity.push("talking2");
			if (T.robin_location === "orphanage") activity.push("Robin");
		}
	}

	/* ToDo: Pregnancy - To be added at a later date
		if (child.localVariables.crawling <= 5) {
			activity.push("crawlingAttempt");
		} else {
			activity.push("crawlingAttempt2");
		}
	*/

	if (activity.length) {
		child.localVariables.activity = activity[random(0, activity.length - 1)];
		child.localVariables.event = true;
	} else {
		child.localVariables.activity = "noEvent";
		child.localVariables.event = true;
	}
}

function wolfChildActivity(childId) {
	const child = V.children[childId];
	if (!child) return null;

	const toySets = [];
	const toyNames = [];
	if (V.storedChildrenToys && V.storedChildrenToys[V.location]) {
		V.storedChildrenToys[V.location].forEach(toy => {
			toySets.pushUnique(toy.set);
			toyNames.pushUnique(toy.name);
		});
	}
	let activity = [];

	if (between(T.childTotalDays, 0, 100)) {
		if (Time.dayState === "night") {
			activity = activity.concat(["sleepingWithWolf", "sleepingWithWolf", "sleepingWithWolf", "sleeping"]);
		} else {
			activity = activity.concat([
				"sleepingWithWolf",
				"sleeping",
				"sleeping",
				"sleeping",
				"crying",
				"playing",
				"watchingCurious",
				"watchingLonging",
				"staringOutside",
				"hungeryWolf",
				"grumpyWolf",
				"gnawing",
			]);
		}
	} else if (between(T.childTotalDays, 100, 200)) {
		if (Time.dayState === "night") {
			activity = activity.concat(["sleepingWithWolf", "sleepingWithWolf", "sleepingWithWolf", "sleeping"]);
		} else {
			activity = activity.concat([
				"sleepingWithWolf",
				"sleeping",
				"sleeping",
				"sleeping",
				"crying",
				"playing",
				"watchingCurious",
				"watchingLonging",
				"playFighting",
				"staringOutside",
				"staringOutside",
				"hungeryWolf",
				"grumpyWolf",
				"gnawing",
			]);
		}
	}

	if (activity.length) {
		child.localVariables.activity = activity[random(0, activity.length - 1)];
		child.localVariables.event = true;
	} else {
		child.localVariables.activity = "noEvent";
		child.localVariables.event = true;
	}
}
