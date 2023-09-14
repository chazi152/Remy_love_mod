/* eslint-disable dot-notation */
/*
 * if display_condition is 1, item is displayed, else it's not
 * current max doses for Harper/Asylum pills is 1; 2 for every other pills
 * place the widgets that need to be run inside effects array
 * if you feel lost just ask away :)
 * take_condition == 1 means the "Take Pill" button is not greyed out and is clickable
 * display_condition controls whether or not pill should be displayed in the pill menu
 */

/*
--- Please change this comment as needed when the format of setup.pills changes ---
This is the setup.pills array.
It contains a list of all the possible pills.
A single pill object contains multiple 'properties' which define the pill.

 * name:'example pill' - The name displayed in the medicine drawer screen. Auto-capitalises first word. Capitalise other words if desired.
 * description: 'this pill is green.' - The description displayed when the pill is selected.
 * onTakeMessage: 'You swallow the green pill.' - Text displayed when a pill is taken.
 * warning_label: 'Warning: example pill may cause explosive decompression.' - Warning label displayed in text box. <span class="hpi_notice_label"> is used in several of these.
 * indicators: - Array of indicators. Example: `<span class="hpi_indic_green">+ Control</span>`
 * icon: 'img/misc...blahblah' - file path of the png icon for this pill.
 *
 * autoTake: - Code or statement that determines if this pill is set to auto-take ??? **
 * doseTaken: - Code or statement showing how many doses were taken already. **
 * owned: - Code or statement to determined the number owned. **
 * overdose: - Code or statement to determine overdose. **
 * display_condition: - Code or statement to determine if the pill displays in list. **
 * take_condition: - Code or statement to determine if the take button displays for this pill - can a dose currently be taken. **
 *
 * type: "various" - Type of pill. Pill code uses this to determine what the effects are and where they apply. Example: "bottom" or "breast"
 * subtype: "various" - Action the pill has on bodypart 'type'. Optional for the asylum & harper meds apparently. Example: "reduction" or "growth"
 * shape: "pill" or "galenic" - Helps to properly space the icon.
 * effects: - Array of effects - can be used to issue quick macros for setting results. Example: `<<control 25>>`
*/
setup.pills = [
	{
		name: "bottom reduction",cn_name: "臀部生长抑制剂",
		description:
			"每片中含有500mg的普莱贝洛 (Praberrhol)，这种衍生分子专门设计用于与臀部中存在的甘油三酯结合，并逐渐溶解它们。",
		onTakeMessage: "你服下药片，希望能减小屁股的大小。但愿它如同广告上说的那样有效。",
		warning_label:
			"警告: 请严格控制每日的摄入量，过量服用会产生严重的副作用。可以与其他激素类药物同时服用。",
		autoTake() {
			return V.sexStats.pills["pills"][this.name].autoTake;
		},
		doseTaken() {
			return V.sexStats.pills["pills"][this.name].doseTaken;
		},
		owned() {
			return V.sexStats.pills["pills"][this.name].owned;
		},
		type: "bottom",
		subtype: "reduction",
		shape: "pill",
		overdose() {
			return V.sexStats.pills["pills"][this.name].overdose;
		},
		icon: "img/misc/icon/bottomReduction.png",
		display_condition() {
			return this.owned() > 0 ? 1 : 0;
		},
		take_condition() {
			return this.doseTaken() < 2 &&
				V.sexStats.pills["pills"]["bottom growth"].doseTaken === 0 &&
				V.sexStats.pills["pills"]["bottom blocker"].doseTaken === 0
				? 1
				: 0;
		},
		effects: [],
	},
	{
		name: "bottom growth",cn_name: "臀部生长促进剂",
		description:
			"这种药片中含有九唐洛特洛星 (Nynthroptechloxin) 分子，由天才制药科学家班塞尔博士发明创造。它能增加体内负责臀部和髋部体重的特定激素的产生。每片中含有190mg有效剂量。",
		onTakeMessage: "你服下药片，希望能促进屁股的生长。但愿它如同广告上说的那样有效。",
		warning_label:
			"警告: 请严格控制每日的摄入量，过量服用会产生严重的副作用。详情请咨询本地医生。可以与其他激素类药物同时服用。",
		autoTake() {
			return V.sexStats.pills["pills"][this.name].autoTake;
		},
		doseTaken() {
			return V.sexStats.pills["pills"][this.name].doseTaken;
		},
		owned() {
			return V.sexStats.pills["pills"][this.name].owned;
		},
		type: "bottom",
		subtype: "growth",
		shape: "pill",
		overdose() {
			return V.sexStats.pills["pills"][this.name].overdose;
		},
		icon: "img/misc/icon/bottomGrowth.png",
		display_condition() {
			return this.owned() > 0 ? 1 : 0;
		},
		take_condition() {
			return this.doseTaken() < 2 &&
				V.sexStats.pills["pills"]["bottom reduction"].doseTaken === 0 &&
				V.sexStats.pills["pills"]["bottom blocker"].doseTaken === 0
				? 1
				: 0;
		},
		effects: [],
	},
	{
		name: "bottom blocker",cn_name: "臀部生长阻断剂",
		description:
			"这种药片中含有普莱贝洛-NG2 (Praberrhol-NG2)，这种衍生分子专门设计用于与甘油三酯结合，并逐渐溶解它们。非活性成分三卡纳 (Trinelca) 可吸附在臀部的皮下脂肪组织上。推荐每日摄入200mg以在获得脂肪和溶解脂肪之间取得平衡。",
		onTakeMessage: "你服下药片，希望能维持目前屁股的大小。但愿它如同广告上说的那样有效。",
		warning_label:
			"<span class='hpi_notice_label'>注意: 无任何已知的副作用。24小时内摄入多片不会影响药效。</span>",
		autoTake() {
			return V.sexStats.pills["pills"][this.name].autoTake;
		},
		doseTaken() {
			return V.sexStats.pills["pills"][this.name].doseTaken;
		},
		owned() {
			return V.sexStats.pills["pills"][this.name].owned;
		},
		type: "bottom",
		subtype: "blocker",
		shape: "pill",
		overdose() {
			return V.sexStats.pills["pills"][this.name].overdose;
		},
		icon: "img/misc/icon/bottomBlocker.png",
		display_condition() {
			return this.owned() > 0 ? 1 : 0;
		},
		take_condition() {
			return this.doseTaken() === 0 &&
				V.sexStats.pills["pills"]["bottom growth"].doseTaken === 0 &&
				V.sexStats.pills["pills"]["bottom reduction"].doseTaken === 0
				? 1
				: 0;
		},
		effects: [],
	},
	{
		name: "breast reduction",cn_name: "乳房生长抑制剂",
		description:
			"这种药片中含有普莱贝洛-NG2 (Praberrhol-NG2)，这种衍生分子专门设计用于与甘油三酯结合，并逐渐溶解它们。非活性成分阿布唑斯 (Abflutyx) 可吸附在胸部的皮下脂肪组织上。",
		onTakeMessage: "你服下药片，希望能减小胸部的大小。但愿它如同广告上说的那样有效。",
		warning_label:
			"警告: 请严格控制每日的摄入量，过量服用会产生严重的副作用。详情请咨询本地医生。可以与其他激素类药物同时服用。",
		autoTake() {
			return V.sexStats.pills["pills"][this.name].autoTake;
		},
		doseTaken() {
			return V.sexStats.pills["pills"][this.name].doseTaken;
		},
		owned() {
			return V.sexStats.pills["pills"][this.name].owned;
		},
		type: "breast",
		subtype: "reduction",
		shape: "pill",
		overdose() {
			return V.sexStats.pills["pills"][this.name].overdose;
		},
		icon: "img/misc/icon/breastReduction.png",
		display_condition() {
			return this.owned() > 0 ? 1 : 0;
		},
		take_condition() {
			return this.doseTaken() < 2 &&
				V.sexStats.pills["pills"]["breast growth"].doseTaken === 0 &&
				V.sexStats.pills["pills"]["breast blocker"].doseTaken === 0
				? 1
				: 0;
		},
		effects: [],
	},
	{
		name: "breast growth",cn_name: "乳房生长促进剂",
		description:
			"一种激素mRNA治疗药物。每颗药片含有5mg的迪帕汀 (Dipardyn)，能够触发人体自然分泌负责引起乳房生长的特定激素，同时mRNA将促使细胞产生一种新型激素，促进乳腺组织的形成并增强其储存脂肪的能力，达到丰胸的效果。",
		onTakeMessage: "你服下药片，希望能促进胸部的生长。但愿它如同广告上说的那样有效。",
		warning_label:
			"警告: 请严格控制每日的摄入量，过量服用会产生严重的副作用。详情请咨询本地医生。可以与其他激素类药物同时服用。",
		autoTake() {
			return V.sexStats.pills["pills"][this.name].autoTake;
		},
		doseTaken() {
			return V.sexStats.pills["pills"][this.name].doseTaken;
		},
		owned() {
			return V.sexStats.pills["pills"][this.name].owned;
		},
		type: "breast",
		subtype: "growth",
		shape: "pill",
		overdose() {
			return V.sexStats.pills["pills"][this.name].overdose;
		},
		icon: "img/misc/icon/breastGrowth.png",
		display_condition() {
			return this.owned() > 0 ? 1 : 0;
		},
		take_condition() {
			return this.doseTaken() < 2 &&
				V.sexStats.pills["pills"]["breast reduction"].doseTaken === 0 &&
				V.sexStats.pills["pills"]["breast blocker"].doseTaken === 0
				? 1
				: 0;
		},
		effects: [],
	},
	{
		name: "breast blocker",cn_name: "乳房生长阻断剂",
		description:
			"一种选择性雌激素受体调节剂 (SERM)，能够阻断负责乳房生长的蛋白质受体；辅助剂量为269mg的四唑丽诺斯地 (Tetraozealpostigyl)。",
		onTakeMessage: "你服下药片，希望能维持目前胸部的大小。但愿它如同广告上说的那样有效。",
		warning_label:
			'<span class="hpi_notice_label">注意: 无任何已知的副作用。24小时内摄入多片不会影响药效。</span>',
		autoTake() {
			return V.sexStats.pills["pills"][this.name].autoTake;
		},
		doseTaken() {
			return V.sexStats.pills["pills"][this.name].doseTaken;
		},
		owned() {
			return V.sexStats.pills["pills"][this.name].owned;
		},
		type: "breast",
		subtype: "blocker",
		shape: "pill",
		overdose() {
			return V.sexStats.pills["pills"][this.name].overdose;
		},
		icon: "img/misc/icon/breastBlocker.png",
		display_condition() {
			return this.owned() > 0 ? 1 : 0;
		},
		take_condition() {
			return this.doseTaken() === 0 &&
				V.sexStats.pills["pills"]["breast growth"].doseTaken === 0 &&
				V.sexStats.pills["pills"]["breast reduction"].doseTaken === 0
				? 1
				: 0;
		},
		effects: [],
	},
	{
		name: "penis reduction",cn_name: "阴茎生长抑制剂",
		description:
			"每颗药片含有50mg的克力斯托兹 (Chliustose)，具有有限的抗雄激素作用。此外，450mg的菲林 (Phirhyn) 能够减少勃起组织的数量和厚度。",
		onTakeMessage: "你服下药片，希望能减小阴茎的尺寸。但愿它如同广告上说的那样有效。",
		warning_label:
			"警告: 请严格控制每日的摄入量，过量服用会产生严重的副作用。详情请咨询本地医生。可以与其他激素类药物同时服用。",
		autoTake() {
			return V.sexStats.pills["pills"][this.name].autoTake;
		},
		doseTaken() {
			return V.sexStats.pills["pills"][this.name].doseTaken;
		},
		owned() {
			return V.sexStats.pills["pills"][this.name].owned;
		},
		type: "penis",
		subtype: "reduction",
		shape: "pill",
		overdose() {
			return V.sexStats.pills["pills"][this.name].overdose;
		},
		icon: "img/misc/icon/penisReduction.png",
		display_condition() {
			return V.player.penisExist && this.owned() > 0 ? 1 : 0;
		},
		take_condition() {
			return this.doseTaken() < 2 &&
				V.sexStats.pills["pills"]["penis growth"].doseTaken === 0 &&
				V.sexStats.pills["pills"]["penis blocker"].doseTaken === 0
				? 1
				: 0;
		},
		effects: [],
	},
	{
		name: "penis growth",cn_name: "阴茎生长促进剂",
		description:
			"每颗药丸每粒药丸含有780毫克康尼酮、240毫克依普醇和149毫克十一酸睾酮。这两种分子能促进和加强体内雄激素的效果，从而使你的阴茎恢复自然生长。",
		onTakeMessage: "你服下药片，希望能促进阴茎的生长。但愿它如同广告上说的那样有效。",
		warning_label:
			"警告: 请严格控制每日的摄入量，过量服用会产生严重的副作用。详情请咨询本地医生。可以与其他激素类药物同时服用。",
		autoTake() {
			return V.sexStats.pills["pills"][this.name].autoTake;
		},
		doseTaken() {
			return V.sexStats.pills["pills"][this.name].doseTaken;
		},
		owned() {
			return V.sexStats.pills["pills"][this.name].owned;
		},
		type: "penis",
		subtype: "growth",
		shape: "pill",
		overdose() {
			return V.sexStats.pills["pills"][this.name].overdose;
		},
		icon: "img/misc/icon/penisGrowth.png",
		display_condition() {
			return V.player.penisExist && this.owned() > 0 ? 1 : 0;
		},
		take_condition() {
			return this.doseTaken() < 2 &&
				V.sexStats.pills["pills"]["penis reduction"].doseTaken === 0 &&
				V.sexStats.pills["pills"]["penis blocker"].doseTaken === 0
				? 1
				: 0;
		},
		effects: [],
	},
	{
		name: "penis blocker",cn_name: "阴茎生长阻断剂",
		description:
			"一种来自医学专家的370mg抗雄药物，旨在阻止体内雄激素和睾酮的产生，有效阻止阴茎生长。",
		onTakeMessage: "你服下药片，希望能维持目前阴茎的大小。但愿它如同广告上说的那样有效。",
		warning_label:
			'<span class="hpi_notice_label">注意: 无任何已知的副作用。24小时内摄入多片不会影响药效。</span>',
		autoTake() {
			return V.sexStats.pills["pills"][this.name].autoTake;
		},
		doseTaken() {
			return V.sexStats.pills["pills"][this.name].doseTaken;
		},
		owned() {
			return V.sexStats.pills["pills"][this.name].owned;
		},
		type: "penis",
		subtype: "blocker",
		shape: "pill",
		overdose() {
			return V.sexStats.pills["pills"][this.name].overdose;
		},
		icon: "img/misc/icon/penisBlocker.png",
		display_condition() {
			return V.player.penisExist && this.owned() > 0 ? 1 : 0;
		},
		take_condition() {
			return (
				this.doseTaken() === 0 &&
				V.sexStats.pills["pills"]["penis growth"].doseTaken === 0 &&
				V.sexStats.pills["pills"]["penis reduction"].doseTaken === 0
			);
		},
		effects: [],
	},
	{
		name: "fertility booster",cn_name: "促孕药",
		description:
			"每颗药丸含有50毫克枸橼酸氯米芬，结构类似于雌激素，它也作用于你的下丘脑，而下丘脑会分泌触发排卵所需的激素。在某些情况下, 有效诱导你的卵巢释放卵子。",
		onTakeMessage: "你服下药片，希望能提高你的生育能力。但愿它如同广告上说的那样有效。",
		warning_label:
			"警告: 正常用法用量下可能会出现轻微的不良反应，包括那些可能模仿早孕迹象的副作用。如果超过每天的最大剂量，可能会出现严重的并发症。如有疑问，请咨询您的医生。",
		autoTake() {
			return V.sexStats.pills["pills"][this.name].autoTake;
		},
		doseTaken() {
			return V.sexStats.pills["pills"][this.name].doseTaken;
		},
		owned() {
			return V.sexStats.pills["pills"][this.name].owned;
		},
		hpi_doseTaken() {
			if (V.sexStats.pills["pills"][this.name].doseTaken) {
				return (
					"有效期" + V.sexStats.pills["pills"][this.name].doseTaken + "天"
				);
			} else {
				return "尚未使用";
			}
		},
		hpi_take_every_morning() {
			return this.autoTake() ? "停止服用" : "需要时服用";
		},
		type: "pregnancy",
		subtype: "fertility booster",
		shape: "pill",
		overdose() {
			return V.sexStats.pills["pills"][this.name].overdose;
		},
		icon: "img/misc/icon/fertility_booster.png",
		display_condition() {
			return this.owned() > 0 ? 1 : 0;
		},
		take_condition() {
			return this.doseTaken() < 2 && V.sexStats.pills["pills"]["contraceptive"].doseTaken === 0 ? 1 : 0;
		},
		effects: [],
	},
	{
		name: "contraceptive",cn_name: "避孕药",
		description:
			"雌孕激素联合口服避孕药是由24mg的炔雌醇 (合成雌激素) 和31mg的合成孕激素组成，具有近乎完美的避孕效果。",
		onTakeMessage: "你服下避孕药。但愿它如同广告上说的那样有效。",
		warning_label:
			"警告: 正常用法用量下可能会出现轻微的不良反应。如果超过每天的最大剂量，可能会出现严重的并发症。如有疑问，请咨询您的医生",
		autoTake() {
			return V.sexStats.pills["pills"][this.name].autoTake;
		},
		doseTaken() {
			return V.sexStats.pills["pills"][this.name].doseTaken;
		},
		owned() {
			return V.sexStats.pills["pills"][this.name].owned;
		},
		hpi_doseTaken() {
			if (V.sexStats.pills["pills"][this.name].doseTaken) {
				return (
					"有效期" + V.sexStats.pills["pills"][this.name].doseTaken + "天"
				);
			} else {
				return "尚未使用";
			}
		},
		hpi_take_every_morning() {
			return this.autoTake() ? "停止服用" : "需要时服用";
		},
		type: "pregnancy",
		subtype: "contraceptive",
		shape: "galenic",
		overdose() {
			return V.sexStats.pills["pills"][this.name].overdose;
		},
		icon: "img/misc/icon/contraceptive_pills.png",
		display_condition() {
			return this.owned() > 0 ? 1 : 0;
		},
		take_condition() {
			return this.doseTaken() < 2 && V.sexStats.pills["pills"]["fertility booster"].doseTaken === 0 ? 1 : 0;
		},
		effects: [],
	},
	{
		name: "Anti-Parasite Cream",cn_name: "抗寄生虫药膏",
		description:
			"一种含有氯菊酯的驱虫药膏。当使用时，它可以防止新的寄生虫感染发生，尽管它对任何正在进行的寄生虫感染没有影响。使用后14天内有效。",
		onTakeMessage:"你将药膏涂抹在生殖器周围。你希望它能阻止寄生与感染。",
		warning_label:
			"警告: 如果使用后不久出现过敏反应，请咨询医生。如果你的嘴或眼睛沾到药膏，请立即联系医生。",
		autoTake() {
			return false;
		},
		doseTaken() {
			return V.sexStats.pills["pills"][this.name].doseTaken;
		},
		owned() {
			return V.sexStats.pills["pills"][this.name].owned;
		},
		hpi_take_pills() {
			return "抹在身上";
		},
		hpi_doseTaken() {
			if (V.sexStats.pills["pills"][this.name].doseTaken) {
				return (
					"有效期" + V.sexStats.pills["pills"][this.name].doseTaken + "天"
				);
			} else {
				return "尚未使用";
			}
		},
		hpi_take_every_morning() {
			return "";
		},
		type: "parasite",
		subtype: "Anti-Parasite Cream",
		shape: "cream",
		overdose() {
			return V.sexStats.pills["pills"][this.name].overdose;
		},
		icon: "img/misc/icon/antiParasiteCream.png",
		display_condition() {
			return this.owned() > 0 ? 1 : 0;
		},
		take_condition() {
			return this.doseTaken() === 0 ? 1 : 0;
		},
		effects: [],
	},
	{
		name: "asylum's prescription",cn_name: "精神病院的处方",
		description: "一种强而有力的抗精神病药物。",
		onTakeMessage: "你服用了精神病院开出的药丸。你感到有点晕眩。",
		warning_label:
			"<span class='hpi_notice_label'>提示: 这种药物在实验阶段没有确定的副作用，并且它通过了所有安全规定。<span class='hpi_blur unselectable'>我认为这家药厂马上就要把我害死了。没有副作用？他们以为自己在骗谁?!</span></span>",
		indicators: ["<span class='hpi_indic_green'>++ Control</span>", "<span class='hpi_indic_blue'>- Awareness</span>"],
		autoTake() {
			return V.sexStats.pills["pills"][this.name].autoTake;
		},
		doseTaken() {
			return V.sexStats.pills["pills"][this.name].doseTaken;
		},
		owned() {
			return V.sexStats.pills["pills"][this.name].owned;
		},
		type: "asylum",
		shape: "galenic",
		overdose() {
			return V.sexStats.pills["pills"][this.name].overdose;
		},
		icon: "img/misc/icon/strong pills.png",
		display_condition() {
			return this.owned() > 0 ? 1 : 0;
		},
		take_condition() {
			return this.doseTaken() < 1 && V.asylummedicated === 0 ? 1 : 0;
		},
		effects: [`<<awareness -5>>`, `<<control 25>>`, `<<set $asylummedicated += 1>>`],
	},
	{
		name: "Dr Harper's prescription",cn_name: "哈珀医生的处方",
		description: "安定剂。",
		onTakeMessage: "你服用了哈珀医生开出的药。你感到头晕目眩。",
		warning_label:
			"警告: 达到最大剂量时的副作用尚未经过充分研究。请谨慎服用。<span class='hpi_blur'></span>",
		indicators: ["<span class='hpi_indic_green'>+ Control</span>", "<span class='hpi_indic_blue'>- Awareness</span>"],
		autoTake() {
			return V.sexStats.pills["pills"][this.name].autoTake;
		},
		doseTaken() {
			return V.sexStats.pills["pills"][this.name].doseTaken;
		},
		owned() {
			return V.sexStats.pills["pills"][this.name].owned;
		},
		type: "harper",
		shape: "galenic",
		overdose() {
			return V.sexStats.pills["pills"][this.name].overdose;
		},
		icon: "img/misc/icon/pills.png",
		display_condition() {
			return this.owned() > 0 ? 1 : 0;
		},
		take_condition() {
			return this.doseTaken() < 1 && V.medicated === 0 ? 1 : 0;
		},
		effects: [`<<awareness -1>>`, `<<control 10>>`, `<<set $medicated += 1>>`],
	},
];

function generateHomePillsInventory() {
	$(function () {
		T.disableGridClick = false;
		for (const item of setup.pills) {
			if (item.display_condition() === 1) window.addElementToGrid(item);
		}
	});
}
window.generateHomePillsInventory = generateHomePillsInventory;

function addElementToGrid(item) {
	$(function () {
		const hpiGridContainer = document.getElementById("homeMainPillContainer");

		const itemName = item.cn_name;
		hpiGridContainer.innerHTML =
			hpiGridContainer.innerHTML +
			`
			<div class="hpi_item">
				<div class="hpi_icon"><img class="icon" src="` +
			item.icon +
			`"</img></div>
				<div class="hpi_name" id="hpi_name_` +
			itemName +
			`" >` +
			itemName +
			(item.autoTake() === true ? `<span class="hpi_auto_label">[自动]</span>` : "") +
			`</div>
				<div class="hpi_count" onmouseenter="T.disableGridClick = true" onmouseleave="T.disableGridClick = false">` +
			item.owned() +
			`</div>
			</div>
			`;
		hpiGridContainer.lastElementChild.setAttribute("onclick", "window.onHomePillItemClick(" + "`" + item.name + "`" + ")");
	});
}
window.addElementToGrid = addElementToGrid;

function onHomePillItemClick(itemName) {
	if (!T.disableGridClick) {
		document.getElementById("homeDescPillContainer").style.display = "grid";
		for (const item of setup.pills) {
			if (item.name === itemName) {
				document.getElementById("hpi_desc").outerHTML =
					`<div id="hpi_desc">` +
					item.description +
					`
					<div class="hpi_warning_label">` +
					item.warning_label +
					`</div>
					<div id="hpi_desc_action">
						<a id="hpi_take_pills" onclick="window.onTakeClick(` +
					"`" +
					item.name +
					"`," +
					"`" +
					item.type +
					"`" +
					`)" class="hpi_take_pills">吃下药片</a>
						<a id="hpi_take_every_morning" onclick="window.onAutoTakeClick(` +
					"`" +
					item.name +
					"`," +
					"`" +
					item.type +
					"`" +
					`)">每天早晨服用</a>
					</div>
				</div>
				`;
				window.initPillContextButtons(item);
				document.getElementById("hpi_desc_img").innerHTML =
					`<img` +
					(item.shape === "galenic" ? ` style="margin-left: 17%;"` : "") +
					` src="` +
					item.icon +
					`"></img>` +
					`<div id="hpi_indicator" class="hpi_indicator"></div>`;
				window.addIndicators(item);
			}
		}
	}
}
window.onHomePillItemClick = onHomePillItemClick;

function addIndicators(item) {
	// Indicators are the "++Control" and "+Awareness" etc. We add them under the pill icon.
	if (item.indicators != null && item.indicators.length > 0 && V.statdisable !== "t") {
		for (const indicator of item.indicators) document.getElementById("hpi_indicator").innerHTML += indicator;
	}
}
window.addIndicators = addIndicators;

function initPillContextButtons(item) {
	// create button to "Take everyone morning" / "Stop taking them" (every morning)
	if (item.hpi_take_every_morning) {
		document.getElementById("hpi_take_every_morning").innerHTML = item.hpi_take_every_morning();
	} else {
		document.getElementById("hpi_take_every_morning").innerHTML = item.autoTake() ? "停止用药" : "每日服药";
	}

	// special case if pill type is "asylum" or "harper"
	if (item.type === "asylum" || item.type === "harper") {
		document.getElementById("hpi_take_every_morning").className = "hidden"; // prevent 'Take every Morning' option to be displayed for those type of pills
		document.getElementById("hpi_take_pills").classList.add("hpi_take_me_single"); // readapt css since there's only one button now
	}
	//  Add 'Take pill' button
	document.getElementById("hpi_take_pills").innerHTML = item.hpi_take_pills ? item.hpi_take_pills() : "吃下药片";

	// If the button doesnt exist, create it. If it exists, display the right dose Taken for that pill
	if (document.getElementById("hpi_doseTaken") != null) {
		if (item.hpi_doseTaken) {
			document.getElementById("hpi_doseTaken").outerHTML =
				"<span id='hpi_doseTaken' style='font-size: 0.88em;color: #979797;'> [" + item.hpi_doseTaken() + "]</span>";
		} else {
			// todo: replace style with a proper css class
			document.getElementById("hpi_doseTaken").outerHTML =
				"<span id='hpi_doseTaken' style='font-size: 0.88em;color: #979797;'> [" + item.doseTaken() + " Taken]</span>";
		}
		// Display today taken doses for specific pill
	} else {
		if (item.hpi_doseTaken) {
			document.getElementById("hpi_take_pills").outerHTML +=
				`<span id="hpi_doseTaken" style="font-size: 0.88em;color: #979797;"> [` + item.hpi_doseTaken() + `]</span>`; // Display today taken doses for specific pill
		} else {
			document.getElementById("hpi_take_pills").outerHTML +=
				`<span id="hpi_doseTaken" style="font-size: 0.88em;color: #979797;"> [` + item.doseTaken() + ` Taken]</span>`; // Display today taken doses for specific pill
		}
	}
	// Check if the player meets the criteria to take the pill.
	if (item.take_condition() === 0) {
		document.getElementById("hpi_take_pills").classList.add("hpi_greyed_out"); // grey the "Take Pill" button out
		document.getElementById("hpi_take_pills").onclick = ""; // disable "Take Pill" onclick event.
	}
}
window.initPillContextButtons = initPillContextButtons;

function setLastTaken(type, subtype, fullname = null) {
	if (fullname != null) {
		for (const p of setup.pills) {
			if (p.name === fullname) {
				type = p.type;
				subtype = p.subtype;
			}
		}
	}
	V.sexStats.pills.lastTaken[type] = subtype;
}
window.setLastTaken = setLastTaken;

function redetermineMostTaken(type, subtype, fullname = null) {
	const result = { blocker: 0, growth: 0, reduction: 0 };
	if (fullname != null) {
		for (const p of setup.pills) {
			if (p.name === fullname) {
				type = p.type;
				subtype = p.subtype;
			}
		}
	}
	if (!["breast", "bottom", "penis"].includes(type)) return;
	for (const pill of setup.pills) {
		if (pill.type === type && ["blocker", "growth", "reduction"].includes(pill.subtype)) {
			result[pill.subtype] = pill.doseTaken();
		}
	}
	const ret = result.growth - result.reduction;
	if (ret === 0 && (result.growth > 0 || result.reduction > 0)) {
		// We enter here when growth and reduction pills neutralised each others
		if (result.blocker > 0) return (V.sexStats.pills.mostTaken[type] = "blocker");
		else return (V.sexStats.pills.mostTaken[type] = ["growth", "reduction"].random());
	} else if (ret === 0 && result.blocker > 0)
		// we enter here when player didn't take any growth/blocker but took blockers
		return (V.sexStats.pills.mostTaken[type] = "blocker");
	else if (ret !== 0) {
		// we enter here when there's unbalance between growth/reduction
		if (ret < 0)
			// if reduction won
			return ret + result.blocker >= 0 ? (V.sexStats.pills.mostTaken[type] = "blocker") : (V.sexStats.pills.mostTaken[type] = "reduction");
		// determine if blocker win
		else if (ret > 0)
			// if growth won
			return ret - result.blocker <= 0 ? (V.sexStats.pills.mostTaken[type] = "blocker") : (V.sexStats.pills.mostTaken[type] = "growth"); // determine if blocker win
	}
}
window.redetermineMostTaken = redetermineMostTaken;

function onTakeClick(itemName) {
	V.sexStats.pills["pills"][itemName].owned -= 1;

	switch (itemName) {
		case "Anti-Parasite Cream":
			V.sexStats.pills["pills"][itemName].doseTaken += 14;
			break;
		default:
			V.sexStats.pills["pills"][itemName].doseTaken += 1;
			break; // Stat for specific pill consumptionbreak;
	}

	V.pillsConsumed = typeof V.pillsConsumed === "undefined" || V.pillsConsumed == null ? 1 : V.pillsConsumed + 1; // Stat for total pills consumption
	for (const item of setup.pills) {
		if (item.name === itemName) {
			for (const widget of item.effects) // run the widgets associated with a pill
				Wikifier.wikifyEval(typeof widget === "function" ? widget() : widget);
			V.sexStats.pills.lastTaken[item.type] = item.subtype; // keep track of the category of pill we last took
			V.sexStats.pills.mostTaken[item.type] = window.redetermineMostTaken(item.type, item.subtype);
			if (item.doseTaken() > 1 && item.name.contains("blocker") === false) {
				switch (item.type) {
					case "parasite":
						break;
					case "pregnancy":
						Engine.play("PillCollectionSecondDosePregnancy");
						return;
					default:
						Engine.play("PillCollectionSecondDose");
						return;
				}
			}
			V.lastPillTakenDescription = item.onTakeMessage;
		}
	}
	Engine.play("Take Pill From Medicine Drawer");
}
window.onTakeClick = onTakeClick;

function onAutoTakeClick(itemName, itemType) {
	for (const item in setup.pills) {
		if (setup.pills[item].name === itemName) {
			V.sexStats.pills["pills"][itemName].autoTake = !V.sexStats.pills["pills"][itemName].autoTake; // toggle auto take
			window.initPillContextButtons(setup.pills[item]); // change "Take every morning" button to "Stop taking them"
		} else if (["breast", "penis", "bottom", "pregnancy"].includes(itemType) && setup.pills[item].type === itemType)
			V.sexStats.pills["pills"][setup.pills[item].name].autoTake = false; // disable auto takes for other similar pills(bottom/penis/breast etc)
	}
	window.syncAutoTakeDisplayedState();
}
window.onAutoTakeClick = onAutoTakeClick;

function syncAutoTakeDisplayedState() {
	// Add or remove [Auto] tag from pill names in the pills menu
	for (const item of setup.pills) {
		const capitalisedName = item.name[0].toUpperCase() + item.name.slice(1);
		if (document.getElementById("hpi_name_" + capitalisedName) != null) {
			document.getElementById("hpi_name_" + capitalisedName).innerHTML = capitalisedName;
			document.getElementById("hpi_name_" + capitalisedName).innerHTML += item.autoTake() === true ? "<span class='hpi_auto_label'> [Auto]</span>" : "";
		}
	}
}
window.syncAutoTakeDisplayedState = syncAutoTakeDisplayedState;

function onSecondDoseTakenSetVars() {
	// If player take two doses of anything but blocker/pregnancy/harper/asylum pills, determine the risk stat and
	let doseTaken = { bottom: 0, penis: 0, breast: 0 };

	T.risk = 0;
	T.pillAmountOfCategoriesUsed = 0;
	for (const item of setup.pills) {
		// determine how many pills of each have been taken.
		if (["bottom", "penis", "breast"].contains(item.type)) doseTaken[item.type] += item.doseTaken();
	}
	const sumValues = obj => Object.values(obj).reduce((a, b) => a + b); // count every doses
	let i = -1;
	const doseTakenSum = sumValues(doseTaken); // store the count in this variable
	while (++i < doseTakenSum)
		// for each dose count, increase the overall risk.
		T.risk += random(3, 10); // For each dose found, add 3-10 risk points.
	doseTaken = [
		["bottom", doseTaken["bottom"]],
		["penis", doseTaken["penis"]],
		["breast", doseTaken["breast"]],
	]; // Changed object to array as it's easier to sort.
	for (const array of doseTaken) {
		if (array[1] > 0) T.pillAmountOfCategoriesUsed += 1; // How many different categories of pills we took ?
	}
	i = -1;
	while (++i < doseTaken.length - 1) {
		// sort categories that got the most doses
		if (doseTaken[i][1] < doseTaken[i + 1][1]) {
			const tmp = doseTaken[i];

			doseTaken[i] = doseTaken[i + 1];
			doseTaken[i + 1] = tmp;
			i = -1;
		}
	}
	i = doseTaken[0][1] > doseTaken[1][1] ? 1 : doseTaken[0][1] === doseTaken[1][1] ? 2 : doseTaken[0][1] === doseTaken[2][1] ? 3 : 1; // determine how many have same value
	const chosen = random(0, i - 1);
	V.pillCat = doseTaken[chosen][0]; // select random category among the 1st ones
	T.secondaryPill = chosen > 0 ? doseTaken[chosen - 1][0] : doseTaken[chosen + 1][0]; // select second category
}
window.onSecondDoseTakenSetVars = onSecondDoseTakenSetVars;

function backCompPillsInventory() {
	/* Return immediately if $sexStats doesn't exist. */
	if (typeof V.sexStats === "undefined") return;
	const oPills = V.sexStats.pills;
	const pills = {};
	if (typeof oPills === "object") {
		/* If our $sexStats.pills is an object and has this property, it is ready for production. */
		/* Man on the internet said this is right */
		if (typeof oPills.mostTaken === "object") return;
		try {
			pillsObjectRepair(oPills, pills);
		} catch (error) {
			Errors.report("Compatibility patch for pills object failed: " + error, { oPills, pills });
		}
	}
	Object.assign(pills, {
		"bottom reduction": { autoTake: false, doseTaken: 0, owned: 0, overdose: 0 },
		"bottom growth": { autoTake: false, doseTaken: 0, owned: 0, overdose: 0 },
		"bottom blocker": { autoTake: false, doseTaken: 0, owned: 0, overdose: 0 },
		"breast reduction": { autoTake: false, doseTaken: 0, owned: 0, overdose: 0 },
		"breast growth": { autoTake: false, doseTaken: 0, owned: 0, overdose: 0 },
		"breast blocker": { autoTake: false, doseTaken: 0, owned: 0, overdose: 0 },
		"penis reduction": { autoTake: false, doseTaken: 0, owned: 0, overdose: 0 },
		"penis growth": { autoTake: false, doseTaken: 0, owned: 0, overdose: 0 },
		"penis blocker": { autoTake: false, doseTaken: 0, owned: 0, overdose: 0 },
		"anti-parasite": { autoTake: false, doseTaken: 0, owned: 0, overdose: 0 },
		"fertility booster": { autoTake: false, doseTaken: 0, owned: 0, overdose: 0 },
		contraceptive: { autoTake: false, doseTaken: 0, owned: 0, overdose: 0 },
		"asylum's prescription": { autoTake: false, doseTaken: 0, owned: 0, overdose: 0 },
		"Dr Harper's prescription": { autoTake: false, doseTaken: 0, owned: 0, overdose: 0 },
		"Anti-Parasite Cream": { autoTake: false, doseTaken: 0, owned: 0, overdose: 0 },
	});
	if (typeof oPills === "undefined") {
		/* If our $sexStats.pills was empty, simply set the object in preparation to assign. */
		V.sexStats.pills = {};
	}
	Object.assign(V.sexStats.pills, {
		boughtOnce: pills.boughtOnce === true,
		lastTaken: { bottom: "", breast: "", penis: "", pregnancy: "" },
		mostTaken: { bottom: "", breast: "", penis: "", pregnancy: "" },
		pills,
	});
}
window.backCompPillsInventory = backCompPillsInventory;

function pillsObjectRepair(oPills, pills) {
	/* if the variable already exist, and is not of the new version(new version has "mostTaken" property that's why we check it),
	then we try to  port the old one to the new one */
	if (typeof oPills.bottom === "object") {
		Object.assign(pills, {
			"bottom reduction": { autoTake: oPills.bottom.autoTake === "reduction", owned: oPills.bottom.owned.reduction },
			"bottom growth": { autoTake: oPills.bottom.autoTake === "growth", owned: oPills.bottom.owned.growth },
			"bottom blocker": { autoTake: oPills.bottom.autoTake === "blocker", owned: oPills.bottom.owned.blocker },
		});
		delete oPills.bottom;
	}
	if (typeof oPills.breast === "object") {
		Object.assign(pills, {
			"breast reduction": { autoTake: oPills.breast.autoTake === "reduction", owned: oPills.breast.owned.reduction },
			"breast growth": { autoTake: oPills.breast.autoTake === "growth", owned: oPills.breast.owned.growth },
			"breast blocker": { autoTake: oPills.breast.autoTake === "blocker", owned: oPills.breast.owned.blocker },
		});
		delete oPills.breast;
	}
	if (typeof oPills.penis === "object") {
		Object.assign(pills, {
			"penis reduction": { autoTake: oPills.penis.autoTake === "reduction", owned: oPills.penis.owned.reduction },
			"penis growth": { autoTake: oPills.penis.autoTake === "growth", owned: oPills.penis.owned.growth },
			"penis blocker": { autoTake: oPills.penis.autoTake === "blocker", owned: oPills.penis.owned.blocker },
		});
		delete oPills.penis;
	}
	if (typeof V.asylumpills === "number") {
		Object.assign(pills, {
			"asylum's prescription": { owned: Number.isInteger(V.asylumpills) ? V.asylumpills : 0 },
		});
		delete V.asylumpills;
	}
	if (typeof V.pills === "number") {
		Object.assign(pills, {
			"Dr Harper's prescription": { owned: Number.isInteger(V.pills) ? V.pills : 0 },
		});
		delete V.pills;
	}
}

function determineAutoTakePill(category) {
	T.autoTakeDetermined = null;
	for (const pill of setup.pills) {
		if (pill.type === category && pill.autoTake() === true) {
			T.autoTakeDetermined = pill.name;
			return;
		}
	}
}
window.determineAutoTakePill = determineAutoTakePill;

function resetAllDoseTaken() {
	for (const pill in V.sexStats.pills["pills"]) {
		switch (pill) {
			case "Anti-Parasite Cream":
			case "fertility booster":
			case "contraceptive":
				if (V.sexStats.pills["pills"][pill].doseTaken > 0) {
					V.sexStats.pills["pills"][pill].doseTaken--;
				}
				break;
			default:
				V.sexStats.pills["pills"][pill].doseTaken = 0;
				break;
		}
	}
}
window.resetAllDoseTaken = resetAllDoseTaken;

function resetLastTaken() {
	V.sexStats.pills.lastTaken = { bottom: "", breast: "", penis: "", pregnancy: "" };
}
window.resetLastTaken = resetLastTaken;

function resetMostTaken() {
	V.sexStats.pills.mostTaken = { bottom: "", breast: "", penis: "", pregnancy: "" };
}
window.resetMostTaken = resetMostTaken;

function getAllPills() {
	for (const item of Object.keys(V.sexStats.pills.pills)) V.sexStats.pills.pills[item].owned = 14;
}
window.getAllPills = getAllPills;
