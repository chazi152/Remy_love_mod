;(() => {
    // run this file in button of the sc2 script

    const log = window.modUtils.getLogger();

    // feats.js
    // window.DOL.setup.feats
    if (window?.DOL?.setup?.feats) {
        // console.log('window.DOL.setup.feats', window.DOL.setup.feats);
        window.DOL.setup.feats["Remy's Lovely Cattle"] = {
            title: "雷米的宠物牛牛",
            desc: "成为一头雷米眼中特殊的牛牛",
            difficulty: 2,
            series: "money",
            filter: ["All", "Social"],
            hint: "提示：让雷米'爱'上你。",
        },
        ["Remy's hallucination"] = {
            title: "饮酒伤身",
            desc: "酒能让牛变成人",
            difficulty: 2,
            series: "",
            filter: ["All", "Special"],
        },
        ["return your 'home'"] = {
            title: "自投罗网",
            desc: "有谁会在好不容易逃出去后自己跑回笼子里呢？只有蠢牛了吧",
            difficulty: 2,
            series: "",
            filter: ["All", "Special"],
            hint: "提示：逃出雷米农场后主动跑到骑术学院让雷米见到你。",
        };
        console.log('[Remy_love_mod] window.DOL.setup.feats patch ok.');
        log.log('[Remy_love_mod] window.DOL.setup.feats patch ok.');
    } else {
        console.error('[Remy_love_mod] window.DOL.setup.feats not found');
        log.error('[Remy_love_mod] window.DOL.setup.feats not found');
    }
})();
