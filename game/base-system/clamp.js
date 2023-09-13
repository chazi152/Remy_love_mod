function clampAlexRelations() {
	const alex = V.NPCName[V.NPCNameList.indexOf("Alex")];
	alex.love = Math.clamp(alex.love, -50, 100);
	alex.dom = Math.clamp(alex.dom, -50, 100);
	alex.lust = Math.clamp(alex.lust, 0, 100);
}

Macro.add("alexclamp", {
	handler: clampAlexRelations,
});
