/* eslint-disable no-undef */

// eslint-disable-next-line no-unused-vars
function masturbationSlimeControl() {
	const redText = text => {
		const element = document.createElement("span");
		element.classList.add("red");
		element.textContent = text;
		return element;
	};
	const fragment = document.createDocumentFragment();
	const genitalsExposed = V.worn.over_lower.vagina_exposed >= 1 && V.worn.lower.vagina_exposed >= 1 && V.worn.under_lower.vagina_exposed >= 1;
	const playerToys = listUniqueCarriedSextoys().filter(
		toy => (V.player.penisExist && !playerChastity("penis") && toy.type.includesAny("stroker")) || toy.type.includesAny("dildo", "breastpump")
	);
	const toysId = Array.from(Array(playerToys.length).keys()).filter(i => !playerToys[i].type.includes("stroker"));

	if (V.leftaction === 0 || V.leftaction === "mrest") V.leftaction = "slime";
	if (V.rightaction === 0 || V.rightaction === "mrest") V.rightaction = "slime";

	if (
		(V.leftaction === "mpenisstop" && !(V.mouth === "mpenis" && V.selfsuckDepth === V.penisHeight)) ||
		V.leftaction === "mvaginastop" ||
		V.leftaction === "manusstop"
	) {
		fragment.append(redText("史莱姆使你的左手无法挪开。"));
		V.leftaction = "slime";
	}
	if (
		(V.rightaction === "mpenisstop" && !(V.mouth === "mpenis" && V.selfsuckDepth === V.penisHeight)) ||
		V.rightaction === "mvaginastop" ||
		V.rightaction === "manusstop"
	) {
		fragment.append(redText("史莱姆使你的右手无法挪开。"));
		V.rightaction = "slime";
	}

	if (V.mouthaction === "mpenisstop" || V.mouthaction === "mpenismouthoff") {
		fragment.append(Wikifier.wikifyEval('<span class="red">史莱姆使你的嘴无法从你的<<penis>>挪开。</span>'));
		V.mouthaction = "slime";
	} else if (V.mouthaction === "mpenispullback") {
		fragment.append(
			Wikifier.wikifyEval('<span class="red">史莱姆使你无法深吞<<penis>>。</span>')
		);
		V.mouthaction = "slime";
	} else if (V.mouthaction === "mvaginastop") {
		fragment.append(redText("史莱姆使你的嘴无法从你的阴道挪开。"));
		V.mouthaction = "slime";
	}

	if (
		["mdildostop", "mvaginastopdildo", "manusstopdildo", "mpenisstopstroker", "mmouthstopdildo", "mstopbreastpump"].includes(V.leftaction) &&
		!(V.mouth !== 0 && playerToys[V.currentToyLeft].type.includes("stroker"))
	) {
		fragment.append(redText("史莱姆使你无法放下左手的性玩具。"));
		V.leftaction = "slime";
	}
	if (
		["mdildostop", "mvaginastopdildo", "manusstopdildo", "mpenisstopstroker", "mmouthstopdildo", "mstopbreastpump"].includes(V.rightaction) &&
		!(V.mouth !== 0 && playerToys[V.currentToyRight].type.includes("stroker"))
	) {
		fragment.append(redText("史莱姆使你无法放下右手的性玩具。"));
		V.rightaction = "slime";
	}

	if (V.corruptionMasturbation) {
		fragment.append(Wikifier.wikifyEval("<span class='red'>它迫使你继续下去。</span>"));
	}
	wikifier("arousal", 100);

	// Clothes
	if (V.worn.over_lower.exposed === 0 && (V.leftaction === "slime") === 0 && random(0, 100) >= 25) {
		V.leftaction = "moverlower";
	} else if (V.worn.lower.exposed === 0 && (V.leftaction === "slime" || (random(0, 100) >= 50 && V.worn.over_lower.exposed > 0))) {
		V.leftaction = "mlower";
	} else if (V.worn.under_lower.exposed === 0 && (V.leftaction === "slime" || (random(0, 100) >= 50 && V.worn.lower.exposed > 0))) {
		V.leftaction = "munder";
	}

	if (V.worn.over_upper.exposed === 0 && (V.rightaction === "slime") === 0 && random(0, 100) >= 25) {
		V.rightaction = "moverupper";
	} else if (V.worn.upper.exposed === 0 && (V.rightaction === "slime" || (random(0, 100) >= 50 && V.worn.over_upper.exposed > 0))) {
		V.rightaction = "mupper";
	} else if (V.worn.under_upper.exposed === 0 && (V.rightaction === "slime" || (random(0, 100) >= 50 && V.worn.upper.exposed > 0))) {
		V.rightaction = "munder_upper";
	}

	// Arms
	["left", "right"].forEach(arm => {
		const armCap = arm.toUpperFirst();
		const armAction = arm + "action";
		if (
			(arm === "left" && ["moverlower", "mlower", "munder"].includes(V.leftaction)) ||
			(arm === "right" && ["moverupper", "mupper", "munder_upper"].includes(V.rightaction))
		) {
			// Do nothing
		} else {
			const currentToy = playerToys[V["currentToy" + armCap]];
			const currentToyType = currentToy ? currentToy.type : null;
			const actions = [];
			switch (V[arm + "arm"]) {
				case 0:
					if (random(0, 100) >= 80 && toysId.length > 0 && (["home", "brothel", "cafe"].includes(V.location) || T.enableSexToys)) {
						V[armAction] = "mpickupdildo";
						V["selectedToy" + armCap] = toysId[random(0, toysId.length - 1)];
					} else if (
						arm === "left" &&
						V.player.penisExist &&
						(V[armAction] === "slime" || (V[armAction] === "mchest" && random(0, 100) >= 97)) &&
						!(V.mouth === "mpenis" && V.selfsuckDepth === V.penisHeight) &&
						!playerChastity("penis")
					) {
						V[armAction] = "mpenisentrance";
					} else if (
						arm === "right" &&
						V.player.vaginaExist &&
						!playerChastity("vagina") &&
						(V[armAction] === "slime" || (V[armAction] === "mchest" && random(0, 100) <= 3))
					) {
						V[armAction] = "mvaginaentrance";
					} else if (
						!playerChastity("anus") &&
						((random(0, 100) < 25 && V[armAction] === "slime") || (V[armAction] === "mchest" && random(0, 100) <= 3))
					) {
						V[armAction] = "manusentrance";
					} else if (V[armAction] === "slime") {
						V[armAction] = "mchest";
					}
					break;
				case "mpenisentrance":
					V[armAction] = "mpenisshaft";
					break;
				case "mvaginaentrance":
					if (V.vaginause === 0 && ["mvagina", "mvaginafingerstarttwo"].includes(V[armAction])) {
						// Do Nothing
					} else if (random(0, 100) >= 50) {
						V[armAction] = "mvaginaclit";
					} else {
						V[armAction] = "mvaginarub";
					}
					break;
				case "mvagina":
					if (V[armAction] === "mvaginafistadd") {
						// Do Nothing
					} else if (V.fingersInVagina === 4 && V.vaginaFingerLimit === 5 && random(0, 100) > 80) {
						V[armAction] = "mvaginafistadd";
					} else if (["mvaginafingeradd", "mvaginafingeraddtwo"].includes(V[armAction])) {
						// Do Nothing
					} else if (V.fingersInVagina < V.vaginaFingerLimit && V.vaginaFingerLimit < 4 && random(0, 100) > 30) {
						V[armAction] = "mvaginafistadd";
					} else {
						V[armAction] = "mvaginatease";
					}
					break;
				case "mvaginafist":
					V[armAction] = "mvaginafist";
					break;
				case "manusentrance":
					if ([0, "manus"].includes(V.anususe) && random(0, 100) > 50) {
						V[armAction] = "manus";
					} else {
						V[armAction] = "manusrub";
					}
					break;
				case "manus":
					if (V.player.penisExist && random(0, 100) > 20) {
						V[armAction] = "manusprostate";
					} else {
						V[armAction] = "manustease";
					}
					break;
				case "mpickupdildo":
					if (currentToyType && (["home", "brothel", "cafe"].includes(V.location) || T.enableSexToys)) {
						if (currentToyType.includes("stroker")) {
							if (V.penisuse !== 0) {
								// When no action is avaliable
								V[armAction] = "mdildostop";
							} else if (V.player.penisExist && random(0, 100) >= 50) {
								// ToDo: check that this is the correct action
								V[armAction] = "mpenisentrancestroker";
							} else if (V[armAction] !== "mpenisentrancestroker") {
								// ToDo: check that this is the correct action
								V[armAction] = "mpenisentrancestroker";
							}
						} else if (currentToyType.includes("breastpump")) {
							V[armAction] = "mbreastpump";
						} else if (currentToyType.includes("dildo")) {
							if (["manusentrancedildofloor", "mvaginaentrancedildofloor"].includes(V[armAction])) {
								// Do Nothing
							} else if (V.player.vaginaExist && random(0, 100) >= 75) {
								V[armAction] = "mvaginaentrancedildo";
							} else if (random(0, 100) >= 75) {
								V[armAction] = "manusentrancedildo";
							} else if (
								// eslint-disable-next-line no-dupe-else-if
								["small dildo", "dildo"].includes(currentToy.name) &&
								random(0, 100) >= 75 &&
								V.mouth === 0 &&
								!(V.canSelfSuckPenis && V.penisuse === 0)
							) {
								V[armAction] = "mdildomouthentrance";
							} else if (!["mvaginaentrancedildo", "manusentrancedildo"].includes(V.leftaction) && currentToy.name === "bullet vibe") {
								actions.push("mchestvibrate");
								if (V.player.penisExist && V.penisuse === 0 && !playerChastity("penis")) actions.push("mpenisvibrate");
								if (!V.player.penisExist && !playerChastity("vagina")) actions.push("mvaginaclitvibrate");
								V[armAction] = actions[random(0, actions.length - 1)];
							} else {
								// To ensure there is a default action, not a duplicate
								V[armAction] = "manusentrancedildo";
							}
						}
					}
					break;
				case "mpenisentrancestroker":
					if (
						V.worn.over_lower.vagina_exposed >= 1 &&
						V.worn.lower.vagina_exposed >= 1 &&
						V.worn.under_lower.vagina_exposed >= 1 &&
						V.penisuse === 0
					) {
						if (random(0, 100) >= 50) {
							V[armAction] = "mpenisstroker";
						} else if (V[armAction] !== "mpenisstroker") {
							V[armAction] = "mpenisentrancestroker";
						}
					}
					break;
				case "mpenisstroker":
					V[armAction] = "mpenisstroker";
					break;
				case "mbreastpump":
					V[armAction] = "mbreastpumppump";
					break;
				case "manusentrancedildo":
					if (
						V.worn.over_lower.anus_exposed >= 1 &&
						V.worn.lower.anus_exposed >= 1 &&
						V.worn.under_lower.anus_exposed >= 1 &&
						!playerChastity("anus") &&
						random(0, 100) >= 50
					) {
						V[armAction] = "manusdildo";
					} else if (V[armAction] !== "manusdildo") {
						V[armAction] = "manusrubdildo";
					}
					break;
				case "manusdildo":
					if (V.player.penisExist && random(0, 100) >= 50) {
						V[armAction] = "manusprostatedildo";
					} else {
						V[armAction] = "manusteasedildo";
					}
					break;
				case "mvaginaentrancedildo":
					if (V[arm + "arm"] !== "mvagina" && V[arm + "arm"] !== "mvaginadildo" && random(0, 100) >= 50) {
						V[armAction] = "mvaginadildo";
					} else if (V[armAction] !== "mvaginadildo") {
						V[armAction] = "mvaginaclitdildo";
					}
					break;
				case "mvaginadildo":
					V[armAction] = "mvaginateasedildo";
					break;
				case "mdildomouthentrance":
					V[armAction] = "mdildomouth";
					break;
				case "mdildomouth":
					V[armAction] = "mdildopiston";
					break;
			}
		}
	});

	// Mouth
	if (genitalsExposed) {
		switch (V.mouth) {
			case 0:
				if (
					V.canSelfSuckPenis &&
					V.penisuse === 0 &&
					(random(0, 100) >= 50 || !(V.canSelfSuckVagina && V.vaginause === 0 && V.fingersInVagina === 0))
				) {
					V.mouthaction = "mpenisentrance";
				} else if (V.canSelfSuckVagina && V.vaginause === 0 && V.fingersInVagina === 0) {
					V.mouthaction = "mvaginaentrance";
				}
				break;
			case "mpenisentrance":
				if (random(0, 100) >= 50) {
					V.mouthaction = "mpenistakein";
				} else if (V.mouthaction !== "mpenistakein") {
					V.mouthaction = "mpenislick";
				}
				break;
			case "mpenis":
				if (V.selfsuckDepth < V.selfsuckLimit && random(0, 100) >= 50) {
					V.mouthaction = "mpenisdeepthroat";
				} else if (V.mouthaction !== "mpenisdeepthroat") {
					V.mouthaction = "mpenissuck";
				}
				break;
			case "mvaginaentrance":
				if (random(0, 100) >= 50) {
					V.mouthaction = "mvaginaclit";
				} else {
					V.mouthaction = "mvaginalick";
				}
				break;
			case "mdildomouthentrance":
				if (random(0, 100) >= 50) {
					V.mouthaction = "mdildolick";
				} else {
					V.mouthaction = "mdildokiss";
				}
				break;
			case "mdildomouth":
				if (random(0, 100) >= 50) {
					V.mouthaction = "mdildolick";
				} else {
					V.mouthaction = "mdildosuck";
				}
				break;
		}
	}
	return fragment;
}
