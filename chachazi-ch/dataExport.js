(() => {
    window.modModLoadController.addLifeTimeCircleHook('Remy_love_mod exportDataZip', {
        exportDataZip: async (zip) => {
            // export data that injected to memory
            zip.file('fenghuang-mods/js/feats', JSON.stringify(window?.DOL?.setup?.feats, undefined, 2));
            return zip;
        }
    })
})();
