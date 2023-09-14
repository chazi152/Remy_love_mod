/**
 * ?stroke - Selects from various adjectives and verbs to return
 *            a phrase such as: "passionately caress".
 */
Template.add("stroke", function () {
	const adjective = V.consensual === 1 ? either("热情地", "温柔地") : either("羞怯地");
	const verb = V.consensual === 1 ? either("轻抚", "爱抚", "触摸", "抚弄", "抱住") : either("抚摸", "触摸");
	return `${adjective} ${verb}`;
});

/* ?alongside */
Template.add("alongside", () =>
	either("相随", "相随", "合拍", "不合拍", "合拍", "相碰撞", "激烈的撞击")
);

/* ?orgasmMoans */
Template.add("orgasmMoans", () => either("呻吟", "浪叫", "喘气", "呻吟", "尖叫", "抽噎", "大笑"));
