function getDebuggingInfo() {
	if (V == null) return "SugarCube variables could not be loaded.";
	const response = {
		passage: V.passage,
		stack: [...DOL.Stack],
		phase: V.phase,
		rng: V.rng,
		danger: V.danger,
		index: V.index,
	};
	if (V.combat) {
		Object.assign(response, {
			player: {
				penis: V.player.penis,
				vagina: V.player.vagina,
				leftarm: V.leftarm,
				rightarm: V.rightarm,
				feetuse: V.feetuse,
				mouthuse: V.mouthuse,
				penisuse: V.penisuse,
				penisstate: V.penisstate,
				vaginause: V.vaginause,
				vaginastate: V.vaginastate,
				anususe: V.anususe,
				anusstate: V.anusstate,
				bottomuse: V.bottomuse,
				chestuse: V.chestuse,
				thighuse: V.thighuse,
				mouthstate: V.mouthstate,
				cheststate: V.cheststate,
				head: V.head,
				front: V.front,
				back: V.back,
				chest: V.chest,
			},
			npcCount: EventSystem.count(),
			anustarget: V.anustarget,
			chesttarget: V.chesttarget,
			feettarget: V.feettarget,
			handtarget: V.handtarget,
			lefttarget: V.lefttarget,
			mouthtarget: V.mouthtarget,
			penistarget: V.penistarget,
			righttarget: V.righttarget,
			stealtarget: V.stealtarget,
			thightarget: V.thightarget,
			tooltarget: V.tooltarget,
			vaginatarget: V.vaginatarget,
		});
	}
	for (let i = 0; i < V.NPCList.length; i++) {
		const npc = V.NPCList[i];
		if (npc.type) {
			const npcData = {
				active: npc.active,
				index: npc.index,
			};
			if (V.combat) {
				Object.apply(npcData, {
					mouth: npc.mouth,
					penis: npc.penis,
					lefthand: npc.lefthand,
					righthand: npc.righthand,
					vagina: npc.vagina,
				});
			}
			response["npc" + i] = npcData;
		}
	}
	return response;
}

throwError = function (place, message, source, isExportable = true, isLogged = true) {
	if (typeof message === "string") message = message.replace(/Export$/, "");

	const $wrapper = jQuery(document.createElement("div"));
	const $toggle = jQuery(document.createElement("button"));
	const $source = jQuery(document.createElement("pre"));
	const $title = jQuery(document.createElement("span"));
	const $code = jQuery(document.createElement("code"));
	const $exportBtn = jQuery(document.createElement("button"));
	const mesg = `${L10n.get("errorTitle")}: ${message || "unknown error"}`;

	$toggle
		.addClass("error-toggle")
		.ariaClick(
			{
				label: L10n.get("errorToggle"),
			},
			() => {
				if ($toggle.hasClass("enabled")) {
					$toggle.removeClass("enabled");
					$source.attr({
						"aria-hidden": true,
						hidden: "hidden",
					});
				} else {
					$toggle.addClass("enabled");
					$source.removeAttr("aria-hidden hidden");
				}
			}
		)
		.appendTo($wrapper);

	$title.addClass("error").text(mesg).appendTo($wrapper);
	$code.text(source).appendTo($source);

	if (isExportable && !Browser.isMobile.any()) {
		$toggle.addClass("exportable");
		$exportBtn
			.addClass("error-export macro-button")
			.text("Export")
			.ariaClick(
				{
					label: "Export",
				},
				() => {
					updateExportDay();
					Save.export("degrees-of-lewdity");
				}
			)
			.appendTo($title);
	}

	$source
		.addClass("error-source")
		.attr({
			"aria-hidden": true,
			hidden: "hidden",
		})
		.appendTo($wrapper);
	$wrapper.addClass("error-view").appendTo(place);

	const formattedSource = source.replace(/\n/g, "\n\t");
	console.warn(`${mesg}\n\t${formattedSource}`);

	if (isLogged && V && V.options && V.options.debugdisable === "f") Errors.report(mesg, getDebuggingInfo());

	return false;
};
