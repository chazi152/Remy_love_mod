function getToyName(index, capitalise = false) {
	const toy = T.playerToys[index];
	if (toy == null) {
		let msg = "Could not find the player's toy name.";
		if (index === "none") msg = "An attempt to access a toy with the wrong hand was made.";
		Errors.report(msg, { index });
		return "toy duck";
	}
	const name = capitalise ? toy.namecap : toy.namecap;
	return toy.colour ? ["黑色", "蓝色", "蓝绿色", "柠檬绿", "浅粉色", "紫色", "浅褐色", "褐色", "红色", "绿色", "粉色", "白色", "黄色"][["black", "blue", "teal", "lime-green", "light-pink", "purple", "tan", "brown", "red", "green", "pink", "white", "yellow"].indexOf(toy.colour)] + "" + name : name;
}
window.getToyName = getToyName;
DefineMacroS("toyName", getToyName);
