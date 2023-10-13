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
        };
        console.log('[Remy_love_mod] window.DOL.setup.feats patch ok.');
        log.log('[Remy_love_mod] window.DOL.setup.feats patch ok.');
    } else {
        console.error('[Remy_love_mod] window.DOL.setup.feats not found');
        log.error('[Remy_love_mod] window.DOL.setup.feats not found');
    }
})();
