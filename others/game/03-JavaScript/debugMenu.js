/* eslint-disable eqeqeq */
/* eslint-disable no-eval */
/* eslint-disable no-undef */
/* A standard function to reference to avoid declaring an anonymous function repeatedly. */
const stayOnPassageFn = function () {
	return V.passage;
};

setup.debugMenu = {
	cacheDebugDiv: {},
};

setup.debugMenu.eventList = {
	Main: [
		{
			link: [`测试`, `Test`],
			widgets: [`<<set $molestationstart to 0>>`],
		},
		{
			link: [`画布模式样本`, `CanvasModel Example`],
			widgets: [``],
		},
		{
			link: [`家`, `Bedroom`],
			widgets: [`<<endcombat>>`],
		},
		{
			link: [`衣柜`, `Wardrobe`],
			widgets: [``],
		},
		{
			link: [`脱衣服`, stayOnPassageFn],
			widgets: [`<<undressclothes "wardrobe">>`],
		},
		{
			link: [`脱衣至内衣`, stayOnPassageFn],
			widgets: [
				`<<generalUndress wardrobe over_upper>>`,
				`<<generalUndress wardrobe over_lower>>`,
				`<<generalUndress wardrobe upper>>`,
				`<<generalUndress wardrobe lower>>`,
			],
		},
		{
			link: [`脱掉全部衣服`, stayOnPassageFn],
			widgets: [`<<undress "wardrobe">>`],
		},
		{
			link: [`经过1分钟`, stayOnPassageFn],
			widgets: [`<<pass 1>>`],
		},
		{
			link: [`经过15分钟`, stayOnPassageFn],
			widgets: [`<<pass 15>>`],
		},
		{
			link: [`经过20分钟`, stayOnPassageFn],
			widgets: [`<<pass 20>>`],
		},
		{
			link: [`经过1小时`, stayOnPassageFn],
			widgets: [`<<pass 60>>`],
		},
		{
			link: [`经过3小时`, stayOnPassageFn],
			widgets: [`<<pass 3 hours>>`],
		},
		{
			link: [`经过6小时`, stayOnPassageFn],
			widgets: [`<<pass 6 hours>>`],
		},
		{
			link: [`经过12小时`, stayOnPassageFn],
			widgets: [`<<pass 12 hours>>`],
		},
		{
			link: [`经过18小时`, stayOnPassageFn],
			widgets: [`<<pass 18 hours>>`],
		},
		{
			link: [`经过23小时`, stayOnPassageFn],
			widgets: [`<<pass 23 hours>>`],
		},
		{
			link: [`经过24小时`, stayOnPassageFn],
			widgets: [`<<pass 24 hours>>`],
		},
		{
			link: [`敌人信任+++`, stayOnPassageFn],
			widgets: [`<<set $enemytrust += 2000>>`, `<<set $enemyanger -= 1000>>`],
		},
		{
			link: [`敌人信任---`, stayOnPassageFn],
			widgets: [`<<set $enemytrust -= 2000>>`, `<<set $enemyanger += 1000>>`],
		},
		{
			link: [`一拳超人`, stayOnPassageFn],
			widgets: [`<<set $enemyhealth to 0>>`],
		},
		{
			link: [`一摸就潮`, stayOnPassageFn],
			widgets: [() => `<<set $enemyarousal to ` + V.enemyarousalmax + `>>`],
		},
		{
			link: [`尖叫`, stayOnPassageFn],
			widgets: [`<<set $alarm to 1>>`],
		},
		{
			link: [`完成变量 (不总是有效)`, stayOnPassageFn],
			widgets: [`<<set $finish to 1>>`],
		},
		{
			link: [`变为强奸`, stayOnPassageFn],
			widgets: [`<<set $consensual to 0>>`],
		},
		{
			link: [`变为两厢情愿`, stayOnPassageFn],
			widgets: [`<<set $consensual to 1>>`],
		},
		{
			link: [`敌人色欲---`, stayOnPassageFn],
			widgets: [`<<set $enemyarousal to 0>>`],
		},
		{
			link: [`翻身`, stayOnPassageFn],
			widgets: [() => `<<set $position to ` + (V.position === "doggy" ? "doggy" : "missionary") + `>>`],
			condition() {
				return V.position === "doggy" || V.position === "missionary" ? 1 : 0;
			},
		},
		{
			link: [`把当前图像替换为新的RNG`, ""],
			widgets: [`<<run updateSessionRNG()>>`],
		},
		{
			link: [`RNG 1`, stayOnPassageFn],
			widgets: [`<<set $rng to 1>>`],
		},
		{
			link: [`RNG 11`, stayOnPassageFn],
			widgets: [`<<set $rng to 11>>`],
		},
		{
			link: [`RNG 21`, stayOnPassageFn],
			widgets: [`<<set $rng to 21>>`],
		},
		{
			link: [`RNG 31`, stayOnPassageFn],
			widgets: [`<<set $rng to 31>>`],
		},
		{
			link: [`RNG 41`, stayOnPassageFn],
			widgets: [`<<set $rng to 41>>`],
		},
		{
			link: [`RNG 51`, stayOnPassageFn],
			widgets: [`<<set $rng to 51>>`],
		},
		{
			link: [`RNG 61`, stayOnPassageFn],
			widgets: [`<<set $rng to 61>>`],
		},
		{
			link: [`RNG 71`, stayOnPassageFn],
			widgets: [`<<set $rng to 71>>`],
		},
		{
			link: [`RNG 81`, stayOnPassageFn],
			widgets: [`<<set $rng to 81>>`],
		},
		{
			link: [`RNG 91`, stayOnPassageFn],
			widgets: [`<<set $rng to 91>>`],
		},
		{
			link: [`RNG抽取x1`, stayOnPassageFn],
			widgets: [`<<set $rng to random(1,100)>>`],
		},
		{
			link: [`RNG抽取x3`, stayOnPassageFn],
			widgets: [`<<run random(1,100)>>`, `<<run random(1,100)>>`, `<<set $rng to random(1,100)>>`],
		},
		{
			link: [`RNG抽取x5`, stayOnPassageFn],
			widgets: [`<<run random(1,100)>>`, `<<run random(1,100)>>`, `<<run random(1,100)>>`, `<<run random(1,100)>>`, `<<set $rng to random(1,100)>>`],
		},
		{
			link: [`穿上连衣裙`, stayOnPassageFn],
			widgets: [`<<upperwear 1>>`],
		},
		{
			link: [`穿上女式泳衣`, stayOnPassageFn],
			widgets: [`<<underlowerwear 6>>`],
		},
		{
			link: [`测试房间`, `Testing Room`],
			widgets: [`<<upperstrip>>`, `<<lowerstrip>>`, `<<underlowerstrip>>`],
		},
		{
			link: [`结束该事件`, stayOnPassageFn],
			widgets: [`<<endevent>>`],
		},
		{
			link: [`吞食脱离`, stayOnPassageFn],
			widgets: [`<<set $vorestage to 0>>`],
		},
		{
			text_only: `\n`,
		},
		{
			link: [`把所有野兽变为男性`, stayOnPassageFn],
			widgets: [`<<set $monsterchance to 0>>`, `<<set $beastMaleChanceMale to 100>>`, `<<set $beastMaleChanceFemale to 100>>`],
		},
		{
			link: [`把所有野兽变为女性`, stayOnPassageFn],
			widgets: [`<<set $monsterchance to 0>>`, `<<set $beastMaleChanceMale to 0>>`, `<<set $beastMaleChanceFemale to 0>>`],
		},
		{
			link: [`把所有野兽都变成有穴男`, stayOnPassageFn],
			widgets: [`<<set $beastMaleChanceMale to 100>>`, `<<set $beastMaleChanceFemale to 100>>`, `<<set $cbchance to 100>>`],
		},
		{
			link: [`把所有野兽都变成大屌萌妹`, stayOnPassageFn],
			widgets: [`<<set $beastMaleChanceMale to 0>>`, `<<set $beastMaleChanceFemale to 0>>`, `<<set $dgchance to 100>>`],
		},
		{
			link: [`把野兽变为兽人`, stayOnPassageFn],
			widgets: [`<<set $monsterchance to 100>>`, `<<set $monsterhallucinations to "f">>`],
		},
		{
			text_only: `\n`,
		},
		{
			link: [`春`, stayOnPassageFn],
			widgets: [`<<run Time.setDate(new DateTime(Time.year, 3))>>`],
		},
		{
			link: [`夏`, stayOnPassageFn],
			widgets: [`<<run Time.setDate(new DateTime(Time.year, 6))>>`],
		},
		{
			link: [`秋`, stayOnPassageFn],
			widgets: [`<<run Time.setDate(new DateTime(Time.year, 9))>>`],
		},
		{
			link: [`冬`, stayOnPassageFn],
			widgets: [`<<run Time.setDate(new DateTime(Time.year, 12))>>`],
		},
		{
			text_only: `\n`,
		},
		{
			link: [`启用基础怀孕特性`, stayOnPassageFn],
			widgets: [`<<set $pregnancyStats.parasiteDoctorEvents to 2>>`],
		},
		{
			link: [`获得初孕特质`, stayOnPassageFn],
			widgets: [`<<set $sexStats.anus.pregnancy.motherStatus to 1>>`],
		},
		{
			link: [`授精新卵`, stayOnPassageFn],
			widgets: [`<<fertiliseParasites>>`, `<<fertiliseParasites "vagina">>`],
		},
		{
			link: [`妊娠日数`, stayOnPassageFn],
			widgets: [`<<parasiteProgressDay>>`],
		},
		{
			link: [`妊娠周数`, stayOnPassageFn],
			widgets: [
				`<<parasiteProgressDay>>`,
				`<<parasiteProgressDay>>`,
				`<<parasiteProgressDay>>`,
				`<<parasiteProgressDay>>`,
				`<<parasiteProgressDay>>`,
				`<<parasiteProgressDay>>`,
				`<<parasiteProgressDay>>`,
				`<<parasiteProgressDay>>`,
			],
		},
		{
			link: [() => `所有怀孕阶段进阶`, stayOnPassageFn],
			widgets: [
				`<<set _pregnancy to $sexStats.anus.pregnancy>>`,
				() => (T.pregnancy[0] == null ? "" : `<<set _pregnancy.fetus[0].timeLeft to 1>>`),
				() => (T.pregnancy[1] == null ? "" : `<<set _pregnancy.fetus[1].timeLeft to 1>>`),
				() => (T.pregnancy[2] == null ? "" : `<<set _pregnancy.fetus[2].timeLeft to 1>>`),
				() => (T.pregnancy[3] == null ? "" : `<<set _pregnancy.fetus[3].timeLeft to 1>>`),
			],
		},
		{
			text_only: `\n还需要受精`,
		},
		{
			link: [`鳗鱼怀孕`, stayOnPassageFn],
			widgets: [`<<impregnateParasite "eels" 1000>>`],
		},
		{
			link: [`史莱姆怀孕`, stayOnPassageFn],
			widgets: [`<<impregnateParasite "slimes" 1000>>`],
		},
		{
			link: [`蠕虫怀孕`, stayOnPassageFn],
			widgets: [`<<impregnateParasite "worms" 1000>>`],
		},
		{
			link: [`触手怀孕`, stayOnPassageFn],
			widgets: [`<<impregnateParasite "tentacle" 1000>>`],
		},
		{
			text_only: `\n`,
		},
		{
			link: [`更改怀孕对象`, stayOnPassageFn],
			widgets: [`<<prenancyObjectRepair>>`],
		},
		{
			link: [`重置怀孕对象`, stayOnPassageFn],
			widgets: [`<<unset $container>>`, `<<run delete $sexStats.anus>>`, `<<physicalAdjustmentsInit>>`, `<<containersInit>>`],
		},
		{
			text_only: `\n阴道怀孕<br>(新的怀孕只有在没有怀孕的情况下才会发生)\n`,
			condition() {
				return V.player.penisExist === false;
			},
		},
		{
			text_only: `你已怀孕了\n`,
			condition() {
				return V.player.penisExist === false && getPregnancyObject().fetus.length !== 0;
			},
		},
		{
			link: [`人类怀孕`, stayOnPassageFn],
			widgets: [
				() => {
					return `<<playerPregnancy "Debug Man" "human" true "vagina" undefined true>>`;
				},
			],
			condition() {
				return V.player.penisExist === false && getPregnancyObject().fetus.length === 0;
			},
		},
		{
			link: [`狼的怀孕`, stayOnPassageFn],
			widgets: [
				() => {
					return `<<playerPregnancy "Debug Wolf" "wolf" true "vagina" undefined true>>`;
				},
			],
			condition() {
				return V.player.penisExist === false && getPregnancyObject().fetus.length === 0;
			},
		},
		{
			link: [`即将分娩`, stayOnPassageFn],
			widgets: [`<<set $sexStats.vagina.pregnancy.timer to $sexStats.vagina.pregnancy.timerEnd>>`],
			condition() {
				return V.player.penisExist === false && getPregnancyObject().fetus.length !== 0;
			},
		},
		{
			link: [`结束怀孕并把孩子送往默认位置`, stayOnPassageFn],
			widgets: [
				() => {
					switch (getPregnancyObject().type) {
						case "human":
							endPlayerPregnancy("hospital", "home");
							break;
						case "wolf":
							endPlayerPregnancy("wolf_cave", "wolf_cave");
							break;
						default:
							endPlayerPregnancy("unknown", "unknown");
							break;
					}
					return "";
				},
			],
			condition() {
				return V.player.penisExist === false && getPregnancyObject().fetus.length !== 0;
			},
		},
		{
			text_only: `\nNPC怀孕`,
		},
		{
			text_only: `(每个npc都需要在设置中启用怀孕)\n`,
		},
		{
			link: [`怀上罗宾的孩子`, stayOnPassageFn],
			widgets: [`<<namedNpcPregnancy "Robin" "pc" "human" true undefined true>>`],
		},
		{
			link: [`让惠特尼怀上黑狼幼崽`, stayOnPassageFn],
			widgets: [`<<namedNpcPregnancy "Whitney" "Black Wolf" "wolf" true undefined true>>`],
		},
		{
			link: [`基本NPC压缩测试`, stayOnPassageFn],
			widgets: [
				() => {
					// Copy this debug option for use with other compressor debugging.
					const testList = {};
					const invalidList = [];
					let currentNPC;

					for (let i = 0; i < 6; i++) {
						currentNPC = V.NPCList[i].fullDescription;

						if (currentNPC) {
							if (!V.NPCNameList.includes(currentNPC)) {
								testList["NPCList" + i] = V.NPCList[i];
							} else invalidList.push(currentNPC);
						}
					}

					if (Object.keys(testList).length != 0) compressionVerifier(testList, false, true);
					if (Object.keys(invalidList).length != 0) console.log("The following NPC(s) in $NPCList could not be tested: " + invalidList.join(", "));
					else if (Object.keys(testList).length === 0 && Object.keys(invalidList).length === 0)
						console.log("There are no NPCs in the NPCList to test.");

					return "";
				},
			],
		},
		{
			link: [`启用Debug行`, stayOnPassageFn],
			widgets: [`<<set $debugLines to true>>`],
		},
		{
			link: [`停用Debug行`, stayOnPassageFn],
			widgets: [`<<set $debugLines to false>>`],
		},
		{
			text_only: `\n`,
		},
	],
	Events: [
		{
			link: [`成人玩具商店`, `Adult Shop Menu`],
			widgets: [],
		},
		{
			link: [`情趣用品清单`, `Sextoys Inventory`],
			widgets: [],
		},
		{
			link: [`监禁`, `Underground Intro`],
			widgets: [`<<generate1>>`, `<<generate2>>`, `<<person1>>`],
		},
		{
			link: [`与罗宾一起被监禁`, `Underground Intro`],
			widgets: [`<<set $phase to 1>>`],
		},
		{
			link: [`开始罗宾事件`, stayOnPassageFn],
			widgets: [`<<set $robindebt to 9>>`],
		},
		{
			link: [`学校开始`, `Oxford Street`],
			widgets: [`<<pass 1 day>>`],
		},
		{
			link: [`强奸我`, `Molestation`],
			widgets: [`<<endcombat>>`, `<<set $molestationstart to 1>>`],
		},
		{
			link: [`轮奸`, `Forest Molestation`],
			widgets: [`<<endcombat>>`, `<<set $molestationstart to 1>>`],
		},
		{
			link: [`轮奸 w/ 观众`, `The Pod`],
			widgets: [`<<endcombat>>`, `<<set $molestationstart to 1>>`],
		},
		{
			link: [`性交 [与男]`, `Beach Day Encounter Sex`],
			widgets: [`<<endcombat>>`, `<<generateNPC 1 a m m>>`, `<<person1>>`, `<<set $sexstart to 1>>`],
		},
		{
			link: [`性交 [与女]`, `Beach Day Encounter Sex`],
			widgets: [`<<endcombat>>`, `<<generateNPC 1 a f f>>`, `<<person1>>`, `<<set $sexstart to 1>>`],
		},
		{
			link: [`轮奸 w/ 观众`, `Maths Lesson Gang Bang`],
			widgets: [`<<endcombat>>`, `<<set $sexstart to 1>>`],
		},
		{
			link: [`DP测试`, `DP Test`],
			widgets: [`<<endcombat>>`, `<<set $molestationstart to 1>>`],
		},
		{
			link: [`窒息测试`, `Beach Day Encounter Sex`],
			widgets: [
				`<<endcombat>>`,
				`<<generate1>>`,
				`<<person1>>`,
				`<<set $sexstart to 1>>`,
				`<<set $oxygen to 0>>`,
				`<<set $suffocating to 3>>`,
				`<<set $NPCList[0].righthand to "throat">>`,
				`<<set $neckuse to "hand">>`,
				`<<set $askedtochoke to 1>>`,
			],
		},
		{
			link: [`特殊NPC轮奸测试`, `Named NPC Gangbang Select`],
			widgets: [`<<endcombat>>`],
		},
		{
			link: [`NPC选项`, `NPC Role Select`],
			widgets: [`<<endcombat>>`],
		},
		{
			link: [`NPC衣着选项`, `NPC Clothing Select`],
			widgets: [`<<endcombat>>`],
		},
		{
			link: [`特殊NPC穿戴式阳具测试`, `NNPC Strapon Generator`],
			widgets: [`<<endcombat>>`],
		},
		{
			link: [`植物人测试`, `Plantperson Test`],
			widgets: [`<<endcombat>>`],
		},
		{
			link: ["催眠测试", "Hypnotist Test"],
			widgets: ["<<endcombat>>"],
		},
		{
			link: [`孕肚测试`, `Pregnancy Belly Test`],
			widgets: [`<<endcombat>><<set $sexstart to 1>>`],
		},
		{
			link: [`鳗鱼包围`, `Sea Eels`],
			widgets: [`<<endcombat>>`, `<<set $molestationstart to 1>>`],
		},
		{
			link: [`机器`, `Machine`],
			widgets: [`<<endcombat>>`, `<<set $molestationstart to 1>>`],
		},
		{
			link: [`防卫战`, `Struggle`],
			widgets: [`<<endcombat>>`, `<<set $struggle_start to 1>>`],
		},
		{
			link: [`公交上被强奸`, `Bus move`],
			widgets: [`<<endcombat>>`, `<<generate1>>`, `<<person1>>`, `<<set $molestationstart to 1>>`],
		},
		{
			link: [`鲸吞`, `Monster Test`],
			widgets: [`<<endcombat>>`, `<<set $molestationstart to 1>>`],
		},
		{
			link: [`狗强暴我`, "Street Dogs"],
			widgets: [
				`<<endcombat>>`,
				`<<set $molestationstart to 1>>`,
				`<<beastNEWinit 3 dog>>`,
				`<<set $outside to 1>>`,
				`<<set $location to "town">>`,
				`<<set $bus to "domus">>`,
			],
		},
		{
			link: [`兽轮测试 (目前已损坏)`, `The Farm`],
			widgets: [`<<endcombat>>`, `<<set $molestationstart to 1>>`, `<<set $outside to 1>>`, `<<location "forest">>`, `<<set $bus to "forest">>`],
		},
		{
			link: [`海豚性交`, `Sea Dolphins Sex`],
			widgets: [
				`<<endcombat>>`,
				`<<set $sexstart to 1>>`,
				`<<beastNEWinit 3 dolphin>>`,
				`<<set $outside to 1>>`,
				`<<location to "sea">>`,
				`<<set $bus to "sea">>`,
			],
		},
		{
			link: [`奶牛测试`, `Cow Test Sex`],
			widgets: [`<<endcombat>>`, `<<set $sexstart to 1>>`],
		},
		{
			link: [`触手强暴我`, `Sea Tentacles`],
			widgets: [`<<endcombat>>`, `<<set $molestationstart to 1>>`],
		},
		{
			link: [`贝利测试`, `Bus move`],
			widgets: [`<<endcombat>>`, `<<set $molestationstart to 1>>`, `<<npc Bailey>>`, `<<person1>>`],
		},
		{
			link: [`礼顿办公室打屁股`, `School Detention`],
			widgets: [`<<endcombat>>`, `<<set $detention to 55>>`],
		},
		{
			link: [`被奴役`, `Underground Intro`],
			widgets: [`<<endcombat>>`, `<<generate1>>`, `<<generate2>>`, `<<person1>>`],
		},
		{
			link: [`作为一名舞者工作`, `Brothel Dance`],
			widgets: [
				`<<endcombat>>`,
				`<<danceinit>>`,
				`<<set $dancing to 1>>`,
				`<<set $venuemod to 3>>`,
				`<<stress -4>>`,
				`<<tiredness 4>>`,
				`<<set $dancelocation to "brothel">>`,
			],
		},
		{
			link: [`伊甸开始`, `Eden Cabin`],
			widgets: [
				`<<endcombat>>`,
				`<<set $syndromeeden to 1>>`,
				`<<set $NPCName[$NPCNameList.indexOf("Eden")].lust to 0>>`,
				`<<set $edenshrooms to 0>>`,
				`<<set $edengarden to 0>>`,
				`<<set $edenspring to 0>>`,
				`<<set $wardrobes.edensCabin.unlocked to true>>`,
			],
		},
		{
			link: [`凯拉尔地下室强奸`, `Kylar Basement Rape`],
			widgets: [`<<endcombat>>`, `<<set $molestationstart to 1>>`, `<<npc Kylar>>`, `<<person1>>`],
		},
		{
			link: [`凯拉尔性爱`, `Street Kylar Sex`],
			widgets: [`<<endcombat>>`, `<<set $sexstart to 1>>`, `<<set $location to "town">>`, `<<npc Kylar>>`, `<<person1>>`],
		},
		{
			link: [`罗宾性爱开始`, `Bed Robin Sex`],
			widgets: [`<<endcombat>>`, `<<set $sexstart to 1>>`, `<<npc Robin>>`, `<<person1>>`],
		},
		{
			link: [`罗宾颈手枷观看`, `Robin Pillory Watch`],
			widgets: [`<<robinPunishment "pillory">>`, `<<set $robinmissing to "pillory">>`, `<<set $robinPillory.known to 1>>`],
		},
		{
			link: [`分散围观罗宾的人群的注意力`, stayOnPassageFn],
			widgets: [`<<set $robinPillory.distracted to 1>>`],
		},
		{
			link: [`拒绝布莱尔付款`, `Brothel Pay Refuse`],
			widgets: [`<<endcombat>>`, `<<set $molestationstart to 1>>`, `<<npc Briar>>`, `<<generate2>>`, `<<generate3>>`, `<<person1>>`],
		},
		{
			link: [`与礼顿做爱`, `Head's Office Photoshoot Sex`],
			widgets: [`<<endcombat>>`, `<<set $sexstart to 1>>`, `<<set $phase to 1>>`, `<<npc Leighton>>`, `<<person1>>`],
		},
		{
			link: [`被礼顿威胁`, `Head's Office Blackmail Rape`],
			widgets: [`<<endcombat>>`, `<<set $molestationstart to 1>>`, `<<npc Leighton>>`, `<<person1>>`],
		},
		{
			link: [`艾弗里约会`, `Domus Street`],
			widgets: [`<<set $averydate to 1>>`, `<<set Time.setTime(20, 0)>>`],
		},
		{
			link: [`被黑狼威胁`, `Forest Wolf Molestation`],
			widgets: [
				/* `<<beastNNPCinit>>`, */
				`<<endcombat>>`,
				`<<npc "Black Wolf">>`,
				`<<set $molestationstart to 1>>`,
			],
		},
		{
			link: [`警局颈手枷开始`, `Police Pillory Start`],
			widgets: [`<<set $crime to 5000>>`, `<<generate1>>`, `<<person1>>`],
		},
		{
			link: [`把惠特尼送上颈手枷`, stayOnPassageFn],
			widgets: [`<<imprison_whitney>>`],
		},
		{
			link: [`把礼顿送上颈手枷`, stayOnPassageFn],
			widgets: [`<<imprison_leighton>>`],
		},
		{
			link: [`清空颈手枷`, stayOnPassageFn],
			widgets: [`<<clear_pillory>>`],
		},
		{
			link: [`送随机NPC上颈手枷`, stayOnPassageFn],
			widgets: [`<<clear_pillory>><<new_npc_pillory>>`],
		},
		{
			link: [`神殿墙上的洞`, `Temple Arcade 2`],
			widgets: [``],
		},
		{
			link: [`妓院惩罚`, `Brothel Punishment`],
			widgets: [``],
		},
		{
			link: [`妓院寻欢洞`, `Brothel Gloryhole`],
			widgets: [``],
		},
		{
			link: [`服装店`, `Clothing Shop`],
			widgets: [``],
		},
		{
			link: [`森林商店`, `Forest Shop`],
			widgets: [``],
		},
		{
			link: [`大海`, `Sea`],
			widgets: [`<<set $sea to 0>>`],
		},
		{
			link: [`医院`, `Hospital Foyer`],
			widgets: [``],
		},
		{
			link: [`狼群`, `Forest Wolf Cave`],
			widgets: [`<<set $wolfpacktrust to 12>>`],
		},
		{
			link: [`万圣节`, stayOnPassageFn],
			widgets: [`<<run Time.setDate(new DateTime(Time.year, 10, 21, 7))>>`],
		},
		{
			link: [`整个冬季`, stayOnPassageFn],
			widgets: [`<<run Time.setDate(new DateTime(Time.year, 12, 1, 7))>>`],
		},
		{
			link: [`圣诞节`, stayOnPassageFn],
			widgets: [`<<run Time.setDate(new DateTime(Time.year, 12, 18, 7))>>`],
		},
		{
			link: [`血月`, stayOnPassageFn],
			widgets: [`<<run Time.setDate(new DateTime(Time.year, Time.month, Time.lastDayOfMonth, 21, 0))>>`, `<<set $moonstate to "evening">>`],
		},
		{
			link: [`十月`, stayOnPassageFn],
			widgets: [`<<run Time.setDate(new DateTime(Time.year, 10))>>`],
		},
		{
			link: [`救护车救援`, `Ambulance rescue`],
			widgets: [`<<pass 1 hour>>`],
		},
		{
			link: [`哈珀会诊`, `Hospital Foyer`],
			widgets: [`<<set Time.setDate(Time.getNextWeekdayDate(6))>>`, `<<set Time.setTime(16)>>`],
		},
		{
			link: [`深入森林`, `Forest`],
			widgets: [`<<set $forest to 80>>`],
		},
		{
			link: [`街头警察极限`, `Street Police Extreme`],
			widgets: [`<<pass 1 week>>`, `<<pass 1 week>>`, `<<npc Leighton>>`, `<<person1>>`],
		},
		{
			link: [`妓院虫群表演`, `Brothel Show Swarm`],
			widgets: [
				`<<leash 1>>`,
				`<<set $leftarm to "bound">>`,
				`<<set $rightarm to "bound">>`,
				`<<set $feetuse to "bound">>`,
				`<<set $sexstart to 1>>`,
				`<<set $rng to random(1,100)>>`,
				`<<npc Briar>>`,
				`<<person1>>`,
			],
		},
		{
			link: [`小穴检查`, `Pussy Inspection`],
			widgets: [`<<pass 1 week>>`, `<<pass 1 week>>`, `<<npc Leighton>>`, `<<person1>>`],
		},
		{
			link: [`肉棒检查`, `Penis Inspection`],
			widgets: [`<<pass 1 week>>`, `<<pass 1 week>>`, `<<npc Leighton>>`, `<<person1>>`],
		},
		{
			link: [`胸部检查`, `Breast Inspection`],
			widgets: [`<<pass 1 week>>`, `<<pass 1 week>>`, `<<npc Leighton>>`, `<<person1>>`],
		},
		{
			link: [`科学课裸露`, `Science Event3`],
			widgets: [`<<set $scienceprogression to 3>>`, `<<set $delinquency to 600>>`],
		},
		{
			link: [`历史课颈手枷`, `History Lesson Pillory`],
			widgets: [``],
		},
		{
			link: [`巷子里的狗`, `Alley Dog`],
			widgets: [``],
		},
		{
			link: [`特殊NPC展示`, `NNPC Parade`],
			widgets: [``],
		},
		{
			link: [`兽类展示`, `Beast Parade`],
			widgets: [``],
		},
		{
			link: [`兽类训练`, `Beast Train`],
			widgets: [``],
		},
		{
			link: [`恶魔遭遇`, `Demon Start`],
			widgets: [``],
		},
		{
			link: [`加入神殿`, `Temple`],
			widgets: [`<<inittemple>>`],
		},
		{
			link: [`脱衣舞俱乐部`, `Strip Club`],
			widgets: [`<<set $id to 1>>`, `<<set $wardrobes.stripClub.unlocked to true>>`],
		},
		{
			link: [`精神病院`, `Hospital Bed`],
			widgets: [`<<set $trauma to 4900>>`],
		},
		{
			link: [`监狱`, `Police Prison Intro Bailey`],
			widgets: [`<<npc Bailey>>`, `<<generate2>>`, `<<generate3>>`, `<<generate4>>`, `<<person2>>`, `<<neckwear 1>>`, `<<crimeup 5000>>`],
		},
		{
			link: [`雷米农场`, `Livestock Intro`],
			widgets: [``],
		},
		{
			link: [`农田`, `Farmland`],
			widgets: [``],
		},
		{
			link: [`博物馆`, `Museum`],
			widgets: [``],
		},
		{
			link: [`沙滩洞穴`, `Beach Cave`],
			widgets: [`<<set $cave to 0>>`, `<<beach_cave_init>>`],
		},
		{
			link: [`摊位租金`, `Stall Rent`],
			widgets: [`<<run Time.setTime(6, 0)>>`],
		},
		{
			link: [`庄园`, `Estate`],
			widgets: [`<<estate_end>>`, `<<estate_init secret>>`],
		},
		{
			link: [`跟踪我`, `Street Stalk`],
			widgets: [`<<endcombat>>`, `<<generate1>>`, `<<person1>>`, `<<set $molestationstart to 1>>`],
		},
		{
			link: [`特殊NPC跟踪测试`, `Named NPC Stalk Select`],
			widgets: [`<<endcombat>>`, `<<set $phase to 0>>`],
		},
		{
			link: [`贝利卖掉罗宾`, `Orphanage`],
			widgets: [
				`<<set $renttime to 0>>`,
				`<<set $baileydefeatedchain to 3>>`,
				`<<set $robinpaid to 1>>`,
				`<<set $robinromance to 1>>`,
				`<<set $bus to "home">>`,
				`<<set $location to "home">>`,
			],
		},
		{
			link: [`召唤幽灵`, `Wraith Test Start`],
			widgets: [
				`<<endcombat>>`,
				`<<run Time.setDate(new DateTime(Time.year, Time.month, Time.lastDayOfMonth, 21, 0))>>`,
				`<<set $moonstate to "evening">>`,
			],
		},
		{
			link: [`着魔战斗`, `Possessed Fight Test`],
			widgets: [`<<set $control to 0>>`, `<<set $possessed to true>>`],
		},
		{
			text_only: "\n\n野兽遭遇战",
		},
		{
			link: ["马", "Livestock Field Horse Lewd Sex"],
			widgets: ["<<endcombat>>", "<<set $sexstart to 1>>"],
		},
		{
			link: ["猪",  "Forest Boar Rape"],
			widgets: ["<<endcombat>>", "<<beastNEWinit 1 'pig'>>", "<<person1>>", "<<set $molestationstart to 1>>"],
		},
		{
			link: ["野猪",  "Forest Boar Rape"],
			widgets: ["<<endcombat>>", "<<beastNEWinit 1 'boar'>>", "<<person1>>", "<<set $molestationstart to 1>>"],
		},
		{
			link: ["狗", "Wolf Pack"],
			widgets: ["<<endcombat>>", "<<beastNEWinit 1 'dog'>>", "<<person1>>", "<<set $molestationstart to 1>>"],
		},
		{
			link: ["狐狸", "Meadow Cave Sex"],
			widgets: ["<<endcombat>>", "<<beastNEWinit 1 'fox'>>", "<<person1>>", "<<set $sexstart to 1>>"],
		},
		{
			text_only: "\n\n将野兽变为: ",
		},
		{
			link: [`生物`, stayOnPassageFn],
			widgets: [`<<set _xy to $enemyno-1>>`, `<<set $NPCList[_xy].type to "creature">>`],
		},
		{
			link: [`狗`, stayOnPassageFn],
			widgets: [`<<set _xy to $enemyno-1>>`, `<<set $NPCList[_xy].type to "dog">>`],
		},
		{
			link: [`狼`, stayOnPassageFn],
			widgets: [`<<set _xy to $enemyno-1>>`, `<<set $NPCList[_xy].type to "wolf">>`],
		},
		{
			link: [`海豚`, stayOnPassageFn],
			widgets: [`<<set _xy to $enemyno-1>>`, `<<set $NPCList[_xy].type to "dolphin">>`],
		},
		{
			link: [`熊`, stayOnPassageFn],
			widgets: [`<<set _xy to $enemyno-1>>`, `<<set $NPCList[_xy].type to "bear">>`],
		},
		{
			link: [`野猪`, stayOnPassageFn],
			widgets: [`<<set _xy to $enemyno-1>>`, `<<set $NPCList[_xy].type to "boar">>`],
		},
		{
			link: [`猪`, stayOnPassageFn],
			widgets: [`<<set _xy to $enemyno-1>>`, `<<set $NPCList[_xy].type to "pig">>`],
		},
		{
			link: [`蜥蜴`, stayOnPassageFn],
			widgets: [`<<set _xy to $enemyno-1>>`, `<<set $NPCList[_xy].type to "lizard">>`],
		},
		{
			text_only: "\n\n虫群遭遇战:",
		},
		{
			link: [`废墟鱼战`, `Swarm Test`],
			widgets: [`<<set $molestationstart to 1>>`, `<<swarminit "fish" "container" "shaking" "shatter" "steady" 4 6>>`, `<<set $water to 1>>`],
		},
		{
			link: [`湖中鱼战`, `Swarm Test`],
			widgets: [
				`<<set $molestationstart to 1>>`,
				`<<swarminit "fish" "swarm" "moving towards you" "encircle you" "fend off" 1 7>>`,
				`<<set $water to 1>>`,
			],
		},
		{
			link: [`森林蛇战`, `Swarm Test`],
			widgets: [`<<set $molestationstart to 1>>`, `<<swarminit "snakes" "swarm" "slithering" "slither" "keep back" 10 0>>`],
		},
		{
			link: [`多瑙河街蜘蛛战`, `Swarm Test`],
			widgets: [`<<set $molestationstart to 1>>`, `<<swarminit "spiders" "sac" "slipping" "break" "steady" 1 9>>`],
		},
		{
			link: [`澡中史莱姆战`, `Swarm Test`],
			widgets: [`<<set $molestationstart to 1>>`, `<<swarminit "slimes" "slime mass" "moving towards you" "encircle you" "fend off" 8 0>>`],
		},
		{
			link: [`垃圾蛆战`, `Swarm Test`],
			widgets: [`<<set $molestationstart to 1>>`, `<<swarminit "maggots" "swarm" "crawling" "crawl" "keep back" 2 8>>`],
		},
		{
			link: [`科学蠕虫战`, `Swarm Test`],
			widgets: [`<<set $molestationstart to 1>>`, `<<swarminit "worms" "jar" "held above the terrarium" "fall into the terrarium" "block" 0 10>>`],
		},
		{
			link: [`海中鳗鱼战`, `Swarm Test`],
			widgets: [
				`<<set $molestationstart to 1>>`,
				`<<swarminit "eels" "swarm" "moving towards you" "encircle you" "fend off" 1 9>>`,
				`<<set $water to 1>>`,
			],
		},
		{
			link: [`箱中蠕虫战`, `Swarm Test`],
			widgets: [`<<set $molestationstart to 1>>`, `<<swarminit "worms" "container" "shaking" "shatter" "steady" 1 9>>`],
		},
		{
			text_only: `\n事件测试:`,
		},
		{
			link: [`NPC插入测试`, `NPCInsertionAssert`],
			widgets: [``],
		},
		{
			link: [`时间测试`, `TimeTest`],
			widgets: [`<<set $prevPassage to $passage>>`, `<<set $timeDistortion to 5>>`],
		},
	],
	Character: [
		{
			link: [`默认诱惑`, stayOnPassageFn],
			widgets: [`<<set $alluretest to 0>>`],
			condition() {
				return V.alluretest >= 1;
			},
		},
		{
			link: [`变得诱惑`, stayOnPassageFn],
			widgets: [`<<set $alluretest to 1>>`],
			condition() {
				return V.alluretest < 1;
			},
		},
		{
			link: [`变得没有吸引力`, stayOnPassageFn],
			widgets: [`<<set $alluretest to 2>>`],
			condition() {
				return V.alluretest < 1;
			},
		},
		{
			link: [`躲藏`, stayOnPassageFn],
			widgets: [`<<dontHideRevert>>`],
			condition() {
				return V.dontHide;
			},
		},
		{
			link: [`不躲藏`, stayOnPassageFn],
			widgets: [`<<dontHideForNow>>`],
			condition() {
				return !V.dontHide;
			},
		},
		{
			text_only: "\n\n",
		},
		{
			link: [`所有知名度上升`, stayOnPassageFn],
			widgets: [
				`<<fameexhibitionism 1000 "none" true>>`,
				`<<fameprostitution 1000 "none" true>>`,
				`<<famebestiality 1000 "none" true>>`,
				`<<famerape 1000 "none" true>>`,
				`<<famesex 1000 "none" true>>`,
				`<<famepregnancy 1000 "none" true>>`,
				`<<famegood 1000 "none" true>>`,
				`<<famebusiness 1000 "none" true>>`,
				`<<famepimp 1000 "none" true>>`,
				`<<famescrap 1000 "none" true>>`,
				`<<famesocial 1000 "none" true>>`,
				`<<famemodel 1000 "none" true>>`,
			],
		},
		{
			link: [`性知名度上升`, stayOnPassageFn],
			widgets: [`<<famesex 2000 "none" true>>`],
		},
		{
			link: [`时间倒流`, stayOnPassageFn],
			widgets: [`<<set $timer -= 60>>`],
		},
		{
			link: [`淫荡属性全开`, stayOnPassageFn],
			widgets: [`<<set $promiscuity += 100>>`, `<<set $exhibitionism += 100>>`, `<<set $deviancy += 100>>`],
		},
		{
			link: [`暴露`, stayOnPassageFn],
			widgets: [`<<set $exhibitionism += 20>>`],
		},
		{
			link: [`淫乱`, stayOnPassageFn],
			widgets: [`<<set $promiscuity += 20>>`],
		},
		{
			link: [`异种癖`, stayOnPassageFn],
			widgets: [`<<set $deviancy += 20>>`],
		},
		{
			link: [`容貌`, stayOnPassageFn],
			widgets: [`<<set $beauty += 10000>>`],
		},
		{
			link: [`体能`, stayOnPassageFn],
			widgets: [`<<set $physique += 2000>>`],
		},
		{
			link: [`性知识上升`, stayOnPassageFn],
			widgets: [`<<set $awareness += 200>>`],
		},
		{
			link: [`性知识下降`, stayOnPassageFn],
			widgets: [`<<set $awareness -= 200>>`],
		},
		{
			link: [`纯洁上升`, stayOnPassageFn],
			widgets: [`<<set $purity += 500>>`],
		},
		{
			link: [`纯洁下降`, stayOnPassageFn],
			widgets: [`<<set $purity -= 500>>`],
		},
		{
			text_only: "\n\n",
		},
		{
			link: [`疼痛上升`, stayOnPassageFn],
			widgets: [`<<set $pain += 50>>`],
		},
		{
			link: [`疼痛下降`, stayOnPassageFn],
			widgets: [`<<set $pain -= 50>>`],
		},
		{
			link: [`压力上升`, stayOnPassageFn],
			widgets: [`<<set $stress += 5000>>`],
		},
		{
			link: [`压力下降`, stayOnPassageFn],
			widgets: [`<<set $stress -= 5000>>`],
		},
		{
			link: [`创伤上升`, stayOnPassageFn],
			widgets: [`<<set $trauma += 2000>>`],
		},
		{
			link: [`创伤下降`, stayOnPassageFn],
			widgets: [`<<set $trauma -= 2000>>`],
		},
		{
			link: [`性奋最大`, stayOnPassageFn],
			widgets: [`<<arousal $arousalmax>>`],
		},
		{
			link: [`性奋清零`, stayOnPassageFn],
			widgets: [`<<arousal 0>>`],
		},
		{
			link: [`醉酒`, stayOnPassageFn],
			widgets: [`<<alcohol 60>>`],
		},
		{
			link: [`嗑药`, stayOnPassageFn],
			widgets: [`<<set $drugged += 600>>`],
		},
		{
			link: [`迷幻度`, stayOnPassageFn],
			widgets: [`<<set $hallucinogen += 600>>`],
		},
		{
			text_only: "\n\n",
		},
		{
			link: [`日晒`, stayOnPassageFn],
			widgets: [`<<set $weather to "clear">>`],
		},
		{
			link: [`清洁`, stayOnPassageFn],
			widgets: [`<<wash>>`],
		},
		{
			text_only: "\n\n",
		},
		{
			link: [`魅惑提升`, stayOnPassageFn],
			widgets: [`<<set $seductionskill += 200>>`],
		},
		{
			link: [`诡术上升`, stayOnPassageFn],
			widgets: [`<<set $skulduggery += 200>>`],
		},
		{
			link: [`游泳技能上升`, stayOnPassageFn],
			widgets: [`<<set $swimmingskill += 100>>`],
		},
		{
			text_only: "\n\n",
		},
		{
			link: [`犯罪值上升`, stayOnPassageFn],
			widgets: [`<<set $crime += 500>>`],
		},
		{
			link: [`犯罪值下降`, stayOnPassageFn],
			widgets: [`<<set $crime -= 500>>`],
		},
		{
			text_only: "\n\n",
		},
		{
			link: [`放空NPC[0]的手`, stayOnPassageFn],
			widgets: [`<<set $NPCList[0].lefthand to 0>>`, `<<set $NPCList[0].righthand to 0>>`],
		},
		{
			text_only: "\n\n",
		},
		{
			link: [`贞操锁`, stayOnPassageFn],
			widgets: [`<<genitalswear 1>>`],
		},
		{
			link: [`贞操笼`, stayOnPassageFn],
			widgets: [`<<genitalswear 2>>`],
		},
		{
			link: [`项圈`, stayOnPassageFn],
			widgets: [`<<leash 21>>`],
		},
		{
			link: [`绑带`, stayOnPassageFn],
			widgets: [`<<set $leftarm to "bound">>`, `<<set $rightarm to "bound">>`],
		},
		{
			link: [`去除绑带`, stayOnPassageFn],
			widgets: [`<<unbind>>`],
		},
		{
			text_only: "\n\n",
		},
		{
			link: [`乳量上升`, stayOnPassageFn],
			widgets: [`<<set $player.breastsize += 1>>`],
		},
		{
			link: [`乳量下降`, stayOnPassageFn],
			widgets: [`<<set $player.breastsize -= 1>>`],
		},
		{
			link: [`臀围上升`, stayOnPassageFn],
			widgets: [`<<set $player.bottomsize += 1>>`],
		},
		{
			link: [`臀围下降`, stayOnPassageFn],
			widgets: [`<<set $player.bottomsize -= 1>>`],
		},
		{
			link: [`阴茎尺寸上升`, stayOnPassageFn],
			widgets: [`<<set $player.penissize += 1>>`],
		},
		{
			link: [`阴茎尺寸下降`, stayOnPassageFn],
			widgets: [`<<set $player.penissize -= 1>>`],
		},
		{
			link: [`蛋蛋上升`, stayOnPassageFn],
			widgets: [`<<set $ballssize += 1>>`],
		},
		{
			link: [`蛋蛋下降`, stayOnPassageFn],
			widgets: [`<<set $ballssize -= 1>>`],
		},
		{
			text_only: "\n\n",
		},
		{
			link: [`钱`, stayOnPassageFn],
			widgets: [`<<set $money += 500000>>`],
		},
		{
			link: [`头发变长`, stayOnPassageFn],
			widgets: [`<<set $hairlength += 100>>`],
		},
		{
			link: [`刘海变长`, stayOnPassageFn],
			widgets: [`<<set $fringelength += 100>>`],
		},
		{
			link: [`胸部寄生虫`, stayOnPassageFn],
			widgets: [`<<parasite nipples urchin>>`],
		},
		{
			link: [`阴茎寄生虫`, stayOnPassageFn],
			widgets: [`<<parasite penis urchin>>`],
		},
		{
			link: [`贞操锁寄生虫`, stayOnPassageFn],
			widgets: [`<<set $analchastityparasite to "worms">>`],
		},
		{
			link: [`月份`, stayOnPassageFn],
			widgets: [`<<run Time.setDate(new DateTime(Time.date).addMonth(1)>>`],
		},
		{
			text_only: "\n\n",
		},
		{
			link: [`违规行为`, stayOnPassageFn],
			widgets: [`<<set $delinquency += 1000>>`],
		},
		{
			link: [`留堂惩罚`, stayOnPassageFn],
			widgets: [`<<set $detention += 10>>`],
		},
		{
			link: [`学校技能`, stayOnPassageFn],
			widgets: [
				`<<set $school += 8000>>`,
				`<<set $science += 800>>`,
				`<<set $maths += 800>>`,
				`<<set $english += 800>>`,
				`<<set $history += 800>>`,
				`<<set $sciencetrait to 4>>`,
				`<<set $mathstrait to 4>>`,
				`<<set $englishtrait to 4>>`,
				`<<set $historytrait to 4>>`,
			],
		},
		{
			link: [`学校考试技能`, stayOnPassageFn],
			widgets: [`<<set $science_exam += 1000>>`, `<<set $maths_exam += 1000>>`, `<<set $english_exam += 1000>>`, `<<set $history_exam += 1000>>`],
		},
		{
			link: [`全部技能`, stayOnPassageFn],
			widgets: [
				`<<set $school += 448>>`,
				`<<set $science += 112>>`,
				`<<set $maths += 112>>`,
				`<<set $english += 112>>`,
				`<<set $history += 112>>`,
				`<<set $skulduggery += 112>>`,
				`<<set $danceskill += 112>>`,
				`<<set $swimmingskill += 112>>`,
				`<<set $bottomskill += 112>>`,
				`<<set $seductionskill += 112>>`,
				`<<set $handskill += 112>>`,
				`<<set $feetskill += 112>>`,
				`<<set $chestskill += 112>>`,
				`<<set $thighskill += 112>>`,
				`<<set $oralskill += 112>>`,
				`<<set $analskill += 112>>`,
				`<<set $vaginalskill += 112>>`,
				`<<set $penileskill += 112>>`,
			],
		},
		{
			link: [`全属性满级`, stayOnPassageFn],
			widgets: [
				`<<set $school += 4000>>`,
				`<<set $science += 1000>>`,
				`<<set $maths += 1000>>`,
				`<<set $english += 1000>>`,
				`<<set $history += 1000>>`,
				`<<set $sciencetrait to 4>>`,
				`<<set $mathstrait to 4>>`,
				`<<set $englishtrait to 4>>`,
				`<<set $historytrait to 4>>`,
				`<<set $skulduggery += 1000>>`,
				`<<set $danceskill += 1000>>`,
				`<<set $swimmingskill += 1000>>`,
				`<<set $bottomskill += 1000>>`,
				`<<set $seductionskill += 1000>>`,
				`<<set $handskill += 1000>>`,
				`<<set $feetskill += 1000>>`,
				`<<set $chestskill += 1000>>`,
				`<<set $thighskill += 1000>>`,
				`<<set $oralskill += 1000>>`,
				`<<set $analskill += 1000>>`,
				`<<set $vaginalskill += 1000>>`,
				`<<set $penileskill += 1000>>`,
			],
		},
		{
			link: [`提升校内地位`, stayOnPassageFn],
			widgets: [`<<set $cool += 400>>`],
		},
		{
			link: [`降低校内地位`, stayOnPassageFn],
			widgets: [`<<set $cool -= 400>>`],
		},
		{
			text_only: "\n\n",
		},
		{
			link: [`毁掉泳装`, stayOnPassageFn],
			widgets: [`<<set $upperschoolswimsuitno to 0>>`, `<<set $lowerschoolswimsuitno to 0>>`, `<<set $schoolswimshortsno to 0>>`],
		},
		{
			link: [`毛巾`, stayOnPassageFn],
			widgets: [`<<clothesontowel>>`],
		},
		{
			link: [`请求毛巾`, stayOnPassageFn],
			widgets: [`<<towelup>>`],
		},
		{
			link: [`+ 顺从`, stayOnPassageFn],
			widgets: [`<<set $submissive += 250>>`],
		},
		{
			link: [`- 顺从`, stayOnPassageFn],
			widgets: [`<<set $submissive -= 250>>`],
		},
		{
			text_only: "\n\n",
		},
		{
			link: [`罗宾好感度`, stayOnPassageFn],
			widgets: [`<<npcincr Robin love 100>>`, `<<npcincr Robin lust 100>>`],
		},
		{
			link: [`罗宾笔记事件`, stayOnPassageFn],
			widgets: [`<<set $robinnote to 1>>`],
		},
		{
			link: [`罗宾浪漫值`, stayOnPassageFn],
			widgets: [`<<set $robinromance to 1>>`],
		},
		{
			text_only: "\n\n",
		},
		{
			link: [`性爱统计增加`, stayOnPassageFn],
			widgets: [
				`<<set $orgasmstat += 2000>>`,
				`<<set $ejacstat += 2000>>`,
				`<<set $moleststat += 2000>>`,
				`<<set $rapestat += 1000>>`,
				`<<set $beastrapestat += 500>>`,
				`<<set $tentaclerapestat += 200>>`,
				`<<set $swallowedstat += 100>>`,
				`<<set $prostitutionstat += 10>>`,
			],
		},
		{
			text_only: "\n\n",
		},
		{
			link: [`下衣接近损坏`, stayOnPassageFn],
			widgets: [`<<set $worn.lower.integrity to 1>>`],
		},
		{
			link: [`上衣接近损坏`, stayOnPassageFn],
			widgets: [`<<set $worn.upper.integrity to 1>>`],
		},
		{
			link: [`内衣接近损坏`, stayOnPassageFn],
			widgets: [`<<set $worn.under_lower.integrity to 1>>`],
		},
		{
			link: [`胸罩接近损坏`, stayOnPassageFn],
			widgets: [`<<set $worn.under_upper.integrity to 1>>`],
		},
		{
			link: [`损坏下衣`, stayOnPassageFn],
			widgets: [`<<set $worn.lower.integrity -= 200>>`],
		},
		{
			link: [`损坏上衣`, stayOnPassageFn],
			widgets: [`<<set $worn.upper.integrity -= 200>>`],
		},
		{
			link: [`损坏胸罩`, stayOnPassageFn],
			widgets: [`<<set $worn.under_upper.integrity -= 200>>`],
		},
		{
			link: [`损坏内衣`, stayOnPassageFn],
			widgets: [`<<set $worn.under_lower.integrity -= 200>>`],
		},
		{
			link: [`损坏贞操带`, stayOnPassageFn],
			widgets: [`<<set $worn.genitals.integrity -= 5000>>`],
		},
		{
			text_only: "\n\n",
		},
		{
			link: [`增加猫化`, stayOnPassageFn],
			widgets: [`<<set $cat += 1>>`],
		},
		{
			link: [`猫化上升`, stayOnPassageFn],
			widgets: [`<<set $catbuild += 80>>`],
		},
		{
			link: [`取消猫化`, stayOnPassageFn],
			widgets: [`<<set $cat = 0>>`],
		},
		{
			link: [`取消狼化`, stayOnPassageFn],
			widgets: [`<<set $wolfgirl to 0>>`],
		},
		{
			link: [`增加狼化`, stayOnPassageFn],
			widgets: [`<<set $wolfgirl += 1>>`],
		},
		{
			link: [`狼化上升`, stayOnPassageFn],
			widgets: [`<<set $wolfbuild += 40>>`],
		},
		{
			link: [`狼化下降`, stayOnPassageFn],
			widgets: [`<<set $wolfbuild -= 40>>`],
		},
		{
			link: [`取消狐化`, stayOnPassageFn],
			widgets: [`<<set $fox to 0>>`],
		},
		{
			link: [`增加狐化`, stayOnPassageFn],
			widgets: [`<<set $fox += 1>>`],
		},
		{
			link: [`狐化上升`, stayOnPassageFn],
			widgets: [`<<set $foxbuild += 40>>`],
		},
		{
			link: [`狐化下降`, stayOnPassageFn],
			widgets: [`<<set $foxbuild -= 40>>`],
		},
		{
			link: [`奶牛化上升`, stayOnPassageFn],
			widgets: [`<<set $cowbuild += 40>>`],
		},
		{
			link: [`奶牛化下降`, stayOnPassageFn],
			widgets: [`<<set $cowbuild -= 40>>`],
		},
		{
			link: [`天使化上升`, stayOnPassageFn],
			widgets: [`<<set $angelbuild += 40>>`],
		},
		{
			link: [`天使化下降`, stayOnPassageFn],
			widgets: [`<<set $angelbuild -= 40>>`],
		},
		{
			link: [`恶魔化上升`, stayOnPassageFn],
			widgets: [`<<set $demonbuild += 40>>`],
		},
		{
			link: [`恶魔化下降`, stayOnPassageFn],
			widgets: [`<<set $demonbuild -= 40>>`],
		},
		{
			link: [`关闭低温`, stayOnPassageFn],
			widgets: [`<<set $undertemp to 0>>`],
		},
		{
			link: [`给我淋满黏液`, stayOnPassageFn],
			widgets: [`<<drench "semen" "slime" 5>>`],
		},
		{
			link: [`给我淋点黏液`, stayOnPassageFn],
			widgets: [`<<drench "semen" "slime" 1>>`],
		},
		{
			link: [`淋湿我`, stayOnPassageFn],
			widgets: [`<<set $upperwet to 200>>`, `<<set $lowerwet to 200>>`, `<<set $underupperwet to 200>>`, `<<set $underlowerwet to 200>>`],
		},
		{
			link: [`仅湿透外套`, stayOnPassageFn],
			widgets: [`<<set $overupperwet to 200>>`, `<<set $overlowerwet to 200>>`],
		},
		{
			link: [`仅湿透中装`, stayOnPassageFn],
			widgets: [`<<set $upperwet to 200>>`, `<<set $lowerwet to 200>>`],
		},
		{
			link: [`仅湿透内衣`, stayOnPassageFn],
			widgets: [`<<set $underupperwet to 200>>`, `<<set $underlowerwet to 200>>`],
		},
		{
			link: [`把我泡在水里`, stayOnPassageFn],
			widgets: [`<<water>>`],
		},
		{
			link: [`触发霸凌`, stayOnPassageFn],
			widgets: [`<<set $bullytimer to 100>>`, `<<set $bullytimeroutside to 100>>`],
		},
		{
			link: [`降低惠特尼支配度`, stayOnPassageFn],
			widgets: [`<<npcincr Whitney dom -20>>`],
		},
		{
			link: [`提升惠特尼支配度`, stayOnPassageFn],
			widgets: [`<<npcincr Whitney dom 20>>`],
		},
		{
			link: [`惠特尼好感度`, stayOnPassageFn],
			widgets: [`<<npcincr Whitney love 20>>`, `<<npcincr Whitney lust 20>>`],
		},
		{
			link: [`惠特尼浪漫值`, stayOnPassageFn],
			widgets: [`<<set $whitneyromance to 1>>`],
		},
		{
			link: [`酒吧做妓`, stayOnPassageFn],
			widgets: [`<<set $pubwhore += 10>>`],
		},
		{
			link: [`生成小生物`, stayOnPassageFn],
			widgets: [`<<beasttype bear>>`],
		},
		{
			link: [`填满喷雾`, stayOnPassageFn],
			widgets: [`<<set $spraymax to 5>>`, `<<spray 5>>`],
		},
		{
			text_only: "\n\n",
		},
		{
			link: [`解锁全部种子`, stayOnPassageFn],
			widgets: [`<<run unlockAllSeeds()>>`],
		},
		{
			link: [`超级调试特性`, stayOnPassageFn],
			widgets: [
				`<<set $school += 4000>>`,
				`<<set $science += 1000>>`,
				`<<set $maths += 1000>>`,
				`<<set $english += 1000>>`,
				`<<set $history += 1000>>`,
				`<<set $sciencetrait to 4>>`,
				`<<set $mathstrait to 4>>`,
				`<<set $englishtrait to 4>>`,
				`<<set $historytrait to 4>>`,
				`<<set $skulduggery += 1000>>`,
				`<<set $danceskill += 1000>>`,
				`<<set $swimmingskill += 1000>>`,
				`<<set $bottomskill += 1000>>`,
				`<<set $seductionskill += 1000>>`,
				`<<set $handskill += 1000>>`,
				`<<set $feetskill += 1000>>`,
				`<<set $chestskill += 1000>>`,
				`<<set $thighskill += 1000>>`,
				`<<set $oralskill += 1000>>`,
				`<<set $analskill += 1000>>`,
				`<<set $vaginalskill += 1000>>`,
				`<<set $penileskill += 1000>>`,
				`<<set $promiscuity += 100>>`,
				`<<set $exhibitionism += 100>>`,
				`<<set $deviancy += 100>>`,
				`<<set $awareness to 1000>>`,
				`<<set $willpower to 1000>>`,
				`<<set $physique to 12000>>`,
				`<<set $orgasmtrait to 1>>`,
				`<<set $ejactrait to 1>>`,
				`<<set $molesttrait to 1>>`,
				`<<set $rapetrait to 1>>`,
				`<<set $bestialitytrait to 1>>`,
				`<<set $tentacletrait to 1>>`,
				`<<set $choketrait to 1>>`,
			],
		},
		{
			link: [`解锁所有药丸`, stayOnPassageFn],
			widgets: [`<<run window.getAllPills()>>`],
		},
	],
	Favourites: [],
};

function returnEventList() {
	return setup.debugMenu.eventList;
}
window.returnEventList = returnEventList;

function getNameAndPassage(section, index) {
	if (typeof setup.debugMenu.eventList[section][index].link[0] === "function") T.link_name = setup.debugMenu.eventList[section][index].link[0]();
	else T.link_name = setup.debugMenu.eventList[section][index].link[0];
	if (typeof setup.debugMenu.eventList[section][index].link[1] === "function") T.link_passage = setup.debugMenu.eventList[section][index].link[1]();
	else T.link_passage = setup.debugMenu.eventList[section][index].link[1];
}
window.getNameAndPassage = getNameAndPassage;

function runWidgetsInsideLink(section, index) {
	let widget = 0;
	for (widget in setup.debugMenu.eventList[section][index].widgets)
		Wikifier.wikifyEval(
			typeof setup.debugMenu.eventList[section][index].widgets[widget] === "function"
				? setup.debugMenu.eventList[section][index].widgets[widget]()
				: setup.debugMenu.eventList[section][index].widgets[widget]
		);
}
window.runWidgetsInsideLink = runWidgetsInsideLink;

function changeBorderColor() {
	const inputVal = document.getElementById("formChangeColor");
	$(inputVal).toggleClass("searchBorderColour");
}
window.changeBorderColor = changeBorderColor;

// const categories = ["debugEventsMain", "debugEventsCharacter", "debugEventsEvents"];
const categories2 = ["debugMain", "debugCharacter", "debugEvents", "debugFavourites", "debugAdd"];

function researchEvents(defaultValue) {
	$(function () {
		let needle = defaultValue != null ? defaultValue : document.getElementById("searchEvents").value;
		const eventsList = [
			document.getElementById("debugEventsMain").getElementsByTagName("div"),
			document.getElementById("debugEventsMain").getElementsByTagName("br"),
			document.getElementById("debugEventsCharacter").getElementsByTagName("div"),
			document.getElementById("debugEventsCharacter").getElementsByTagName("br"),
			document.getElementById("debugEventsEvents").getElementsByTagName("div"),
			document.getElementById("debugEventsEvents").getElementsByTagName("br"),
		];

		if (defaultValue != null) document.getElementById("searchEvents").value = defaultValue;
		needle = needle.toLowerCase();
		for (let i1 = 0; i1 < eventsList.length; i1++) {
			for (let i2 = 0; i2 < eventsList[i1].length; i2++) {
				let haystack = eventsList[i1][i2].getAttribute("name");

				if (haystack != null) {
					haystack = haystack.toLowerCase();
					if (haystack.contains(needle) === false) eventsList[i1][i2].style.display = "none";
					else eventsList[i1][i2].style.display = "";
				}
			}
		}
		if (needle != null && needle.length > 0) {
			document.getElementById("debugMain").classList.remove("hidden");
			document.getElementById("debugCharacter").classList.remove("hidden");
			document.getElementById("debugEvents").classList.remove("hidden");
			document.getElementById("debugFavourites").classList.add("hidden");
			document.getElementById("debugAdd").classList.add("hidden");
		} else if (V.debugMenu[2] != null && V.debugMenu[2].length > 0 && needle.length === 0) {
			for (const divToHide of categories2) {
				if (divToHide !== V.debugMenu[1]) document.getElementById(divToHide).classList.add("hidden");
				else document.getElementById(divToHide).classList.remove("hidden");
			}
		}
		if ((V.debugMenu[1] === "debugAdd" || V.debugMenu[1] === "debugFavourites") && (needle === "" || needle == null)) {
			document.getElementById(V.debugMenu[1]).classList.remove("hidden");
		}
		V.debugMenu[2] = needle;
		window.toggleClassDebug(V.debugMenu[1] + "Button", "bg-color");
		window.cacheDebugDiv();
	});
}
window.researchEvents = researchEvents;

function addFavouriteIcon(section, index, id) {
	$(function () {
		if (V.debug_favourite == null) {
			V.debug_favourite = [];
		}
		window.syncFavourites();
		const input = document.createElement("input");
		const parent = document.getElementById(id);

		input.type = "image";
		input.className = "heart";
		input.src = "img/ui/heart_favourite.svg";
		for (let i = 0; i < V.debug_favourite.length; i++) {
			if (V.debug_favourite[i].link[0] === setup.debugMenu.eventList[section][index].link[0]) input.classList.toggle("liked"); // on load up if already favourite set heart red
		}
		input.setAttribute("onclick", "window.onClickFavourite('" + section + "'," + index + ",'" + id + "');");
		if (parent != null) parent.appendChild(input);
	});
}
window.addFavouriteIcon = addFavouriteIcon;

function onClickFavourite(section, index, id) {
	$(function () {
		window.syncFavourites();
		const elementClicked = document.getElementById(id).children[1];
		if (elementClicked.classList.contains("liked")) {
			for (let i = 0; i < V.debug_favourite.length; i++) {
				if (V.debug_favourite[i].link[0] === setup.debugMenu.eventList[section][index].link[0]) V.debug_favourite.splice(i, 1); // remove from favourites
			}
			setup.debugMenu.eventList.Favourites = V.debug_favourite; // sync constant to ephemere variable
			elementClicked.classList.toggle("liked"); // removes favourites css
		} else {
			const favObject = {
				link: setup.debugMenu.eventList[section][index].link,
				widgets: setup.debugMenu.eventList[section][index].widgets,
				condition: setup.debugMenu.eventList[section][index].condition != null ? setup.debugMenu.eventList[section][index].condition : 1,
			};
			V.debug_favourite.push(favObject); // constant variable
			setup.debugMenu.eventList.Favourites = V.debug_favourite;
			elementClicked.classList.toggle("liked"); // add favourites
		}
		if (section === "Favourites") {
			const toSearch = document.getElementById("Favourites-" + index).children[0].text;
			let breakSignal = 0;
			for (const cat of ["debugEventsEvents", "debugEventsMain", "debugEventsCharacter"]) {
				const divSearch = document.getElementById(cat).children;
				for (const div of divSearch) {
					if (div.getAttribute("name") === toSearch) {
						div.children[1].classList.remove("liked");
						breakSignal = 1;
						break;
					}
				}
				if (breakSignal) break;
			}
		}
		Wikifier.wikifyEval(`<<debugFavourites "replace">>`);
	});
	window.cacheDebugDiv();
}
window.onClickFavourite = onClickFavourite;

function syncFavourites() {
	setup.debugMenu.eventList.Favourites = V.debug_favourite;
}
window.syncFavourites = syncFavourites;

function cacheDebugDiv() {
	$(() => {
		const overlay = document.getElementById("debugOverlay");
		if (overlay instanceof HTMLElement) {
			const div = overlay.outerHTML;
			setup.debugMenu.cacheDebugDiv.debugOverlay = div;
		}
	});
}
window.cacheDebugDiv = cacheDebugDiv;

function loadCachedDebugDiv() {
	if (typeof setup.debugMenu.cacheDebugDiv.debugOverlay !== "undefined") {
		document.getElementById("debugOverlay").outerHTML = setup.debugMenu.cacheDebugDiv.debugOverlay;
	}
	window.patchDebugMenu();
}
window.loadCachedDebugDiv = loadCachedDebugDiv;

function debugCreateLinkAndRedirect(section, index, id) {
	$(function () {
		const target = document.getElementById(id).children[0];
		if (typeof $._data($(target).get(0), "events") === "undefined" || $._data($(target).get(0), "events").length === 0) {
			const passageTitle =
				typeof setup.debugMenu.eventList[section][index].link[0] === "function"
					? setup.debugMenu.eventList[section][index].link[0]()
					: setup.debugMenu.eventList[section][index].link[0];
			const passageName =
				typeof setup.debugMenu.eventList[section][index].link[1] === "function"
					? setup.debugMenu.eventList[section][index].link[1]()
					: setup.debugMenu.eventList[section][index].link[1];
			let widgets = "";

			for (const widget of setup.debugMenu.eventList[section][index].widgets) widgets += typeof widget === "function" ? widget() : widget;
			const newLink = new Wikifier(
				null,
				`<<link ${passageName ? "[[" + passageTitle + "|" + passageName + "]]" : '"' + passageTitle + '"'}>>${widgets}<</link>>`
			);
			newLink.output.children[0].click();
		}
	});
}
window.debugCreateLinkAndRedirect = debugCreateLinkAndRedirect;

function addonClickDivPassage(section, index, id) {
	$(function () {
		const target = document.getElementById(id).children[0];
		target.setAttribute(
			"onclick",
			"window.debugCreateLinkAndRedirect(" + "'" + section + "'" + "," + index + "," + "'" + section + "-" + index + "'" + ");"
		);
	});
}
window.addonClickDivPassage = addonClickDivPassage;

function toggleClassDebug(selected, mode) {
	$(function () {
		if (document.getElementById(selected) == null) return;
		const list = ["debugMain", "debugCharacter", "debugEvents", "debugFavourites", "debugAdd"];
		if (mode === "bg-color") {
			for (const div of list) {
				if (div + "Button" === selected) document.getElementById(selected).classList.add("bg-color-debug-selected");
				else document.getElementById(div + "Button").classList.remove("bg-color-debug-selected");
			}
		} else if (mode === "hideWhileSearching") {
			if (selected === "debugFavourites" || selected === "debugAdd") {
				for (const div of list)
					div !== "debugFavourites" || div !== "debugAdd"
						? document.getElementById(div).classList.add("hidden")
						: document.getElementById(div).classList.remove("hidden");
			} else {
				for (const div of list)
					div === "debugFavourites" || div === "debugAdd"
						? document.getElementById(div).classList.add("hidden")
						: document.getElementById(div).classList.remove("hidden");
			}
		} else if (mode === "classicHide") {
			for (const div of list)
				div !== selected ? document.getElementById(div).classList.add("hidden") : document.getElementById(div).classList.remove("hidden");
		}
	});
}
window.toggleClassDebug = toggleClassDebug;

function patchDebugMenu() {
	const catg = ["debugEventsMain", "debugEventsCharacter", "debugEventsEvents", "debugEventsFavourites"];
	let breakIfAllGood;

	for (const cat of catg) {
		let haystack = document.getElementById(cat);
		if (haystack == null) return;
		else haystack = haystack.children;
		for (let i = 0; i < haystack.length; i++) {
			const value = haystack[i].id;

			breakIfAllGood = 0;
			if (haystack[i].children.length < 1) break;
			if (haystack[i].children.length < 2) window.addFavouriteIcon(value.split("-")[0], value.split("-")[1], value);
			else breakIfAllGood += 1;
			if (haystack[i].children[0].getAttribute("onclick") == null)
				haystack[i].children[0].setAttribute(
					"onclick",
					"window.debugCreateLinkAndRedirect('" + value.split("-")[0] + "'," + value.split("-")[1] + ",'" + value + "');"
				);
			else breakIfAllGood += 1;
			if (breakIfAllGood === 2) break;
		}
	}
	document.getElementById("MainDebugInfo").innerHTML =
		"Allure: " + V.allure + "<br>Rng: " + V.rng + "<br>Danger: " + V.danger + "<br>Passage: " + V.passage + "<br>";
	window.cacheDebugDiv();
}
window.patchDebugMenu = patchDebugMenu;

function checkEventCondition() {
	$(function () {
		for (const section of ["Character", "Events", "Favourites", "Main"]) {
			const ev = setup.debugMenu.eventList[section];
			for (const i in ev) {
				if (Object.hasOwn(ev[i], "condition")) {
					if ((typeof ev[i].condition === "function" && ev[i].condition()) || (typeof ev[i].condition !== "function" && ev[i].condition)) {
						if (document.getElementById(section + "-" + i) == null) return;
						document.getElementById(section + "-" + i).classList.remove("condhide");
					} else {
						if (document.getElementById(section + "-" + i) == null) return;
						document.getElementById(section + "-" + i).classList.add("condhide");
					}
				}
			}
		}
	});
}
window.checkEventCondition = checkEventCondition;

function addDebugForm() {
	$(function () {
		let op = "";
		if (V.debug_custom_events == null) V.debug_custom_events = { Main: [], Character: [], Events: [] };
		for (const section of ["Main", "Character", "Events"]) {
			for (const ev of V.debug_custom_events[section]) op += "<option value=" + '"' + ev.link[0] + '" ' + ">" + ev.link[0] + "</option>";
		}
		if (document.getElementById("debugEventsAdd") != null)
			document.getElementById("debugEventsAdd").innerHTML =
				`
		<abbr>事件表:</abbr>
		<div class="addevent-content-search-content" id="formChangeColor2" style="">
			<input name="addEvents" id="addEventsTitle" placeholder="Event Title..." onfocusout="" onfocus="" oninput="" />
		</div>
		<abbr title="For dynamic allocation, you can enter a function that will be saved !\nFor example stayOnPassageFn">Passage Name*:</abbr>
		<div class="addevent-content-search-content" id="formChangeColor3" style="">
			<input name="addEvents" id="addEventsPassage" placeholder="Passage name..." onfocusout="" onfocus="" oninput="" />
		</div>
		<span>小部件:</span>
		<div class="addevent-content-search-content" style="max-height:unset;" id="formChangeColor4" style="">
			<input name="addEvents" id="addEventsWidgets" placeholder="<<set $allure = 5>><<set $rng to 3>>..." onfocusout="" onfocus="" oninput="">
		</div>
		<span>类别:</span><br>
		<select name="catlist" id="debugCatList">
			<option value="Events">事件</option>
			<option value="Main">主页</option>
			<option value="Character">角色</option>
		</select><br><br>
		<button type="button" onclick="window.submitNewDebugPassage()">提交</button><br><br>
		<div id="debugAddResult"></div>
		<div id="debugRemovePassage">
			<h3>从菜单中删除段落</h3>
			<select name="catlist" id="debugEvList">
			` +
				op +
				`</select><br><br>
			<button type="button" id="button-remove" onclick="window.removeDebugCustomPassage()">去除</button><br><br>
			<div id="debugRemoveResult"></div>
		</div>
	`;
	});
}
window.addDebugForm = addDebugForm;

function submitNewDebugPassage() {
	const inputList = [
		document.getElementById("addEventsTitle"),
		document.getElementById("addEventsPassage"),
		document.getElementById("addEventsWidgets"),
		document.getElementById("debugCatList"),
	];
	let sigerror = 0;

	for (const element of inputList) {
		if ((element.id === "addEventsTitle" || element.id === "addEventsPassage" || element.id === "debugCatList") && element.value.length < 1) {
			element.setCustomValidity("Fill this value!");
			element.reportValidity();
			document.getElementById("debugAddResult").innerHTML = "";
			sigerror = 1;
		}
		if (element.id === "addEventsWidgets" && element.value.length > 0) {
			const match = element.value.match("<<.+>>{0,}");

			if (match == null || match[0] !== match.input) {
				element.setCustomValidity("Invalid widget format. Valid : <<widget @params>>");
				element.reportValidity();
				document.getElementById("debugAddResult").innerHTML = "";
				sigerror = 1;
			}
		}
	}
	for (const section of ["Character", "Events", "Favourites", "Main"]) {
		for (const ev of setup.debugMenu.eventList[section]) {
			if (Object.hasOwn(ev, "link") && ev.link[0] === inputList[0].value) {
				inputList[0].setCustomValidity("This event title already exists. It needs to be unique!");
				inputList[0].reportValidity();
				document.getElementById("debugAddResult").innerHTML = "";
				sigerror = 1;
			}
		}
	}
	if (sigerror === 0) {
		if (V.debug_custom_events == null) V.debug_custom_events = { Main: [], Character: [], Events: [] };
		const eventTitle = inputList[0].value;
		const passageName =
			inputList[1].value.match(/function{1}[ \t]{0,1}\(\)[ \t]{0,2}{.*return.*}[;]{0,1}/g) == null
				? inputList[1].value
				: eval("(" + inputList[1].value.match(/function{1}[ \t]{0,1}\(\)[ \t]{0,2}{.*return.*}[;]{0,1}/g)[0] + ")");
		const newObj = {
			link: [eventTitle, passageName],
			widgets: [inputList[2].value],
		};
		V.debug_custom_events[inputList[3].value].unshift(newObj);
		setup.debugMenu.eventList[inputList[3].value].unshift(newObj);
		document.getElementById("debugAddResult").innerHTML =
			'<span style="color: #5eac5e;">Event Added<br>Click any blue regular link in-game<br>for changes to apply.<br>(No reload, No links in debug menu)</span>';
		setup.debugMenu.cacheDebugDiv = {};
	}
}
window.submitNewDebugPassage = submitNewDebugPassage;

function syncDebugAddedEvents() {
	if (V.debug_custom_events == null) V.debug_custom_events = { Main: [], Character: [], Events: [] };
	for (const section of ["Main", "Character", "Events"]) {
		if (Object.hasOwn(V.debug_custom_events, section) === false) V.debug_custom_events[section] = [];
		for (const ev of V.debug_custom_events[section]) setup.debugMenu.eventList[section].unshift(ev);
	}
}
window.syncDebugAddedEvents = syncDebugAddedEvents;

function removeDebugCustomPassage() {
	const selectedForRemoval = document.getElementById("debugEvList").value;
	let exitCode = 0;
	for (const section of ["Main", "Character", "Events"]) {
		for (const ev in V.debug_custom_events[section]) {
			if (V.debug_custom_events[section][ev].link[0] === selectedForRemoval) V.debug_custom_events[section].splice(ev, 1);
			for (const ev2 in setup.debugMenu.eventList[section]) {
				if (Object.hasOwn(setup.debugMenu.eventList[section][ev2], "link") && setup.debugMenu.eventList[section][ev2].link[0] === selectedForRemoval) {
					setup.debugMenu.eventList[section].splice(ev2, 1);
					document.getElementById("debugRemoveResult").innerHTML =
						'<span style="color: #5eac5e;">Event Removed<br>Click any blue regular link in-game<br>for changes to apply.<br>(No reload, No links in debug menu)</span>';
					let op = "<br>";
					for (const section of ["Main", "Character", "Events"]) {
						for (const ev of V.debug_custom_events[section]) op += "<option value=" + '"' + ev.link[0] + '" ' + ">" + ev.link[0] + "</option>";
					}
					document.getElementById("debugEvList").innerHTML = op;
					setup.debugMenu.cacheDebugDiv = {};
					exitCode = 1;
					break;
				}
			}
			if (exitCode === 1) break;
		}
		if (exitCode === 1) break;
	}
}
window.removeDebugCustomPassage = removeDebugCustomPassage;
