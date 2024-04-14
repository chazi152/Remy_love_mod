function findClothes (name ,slot) {
    for (let i = 0; i < setup.clothes[slot].length; i++) {
        if (setup.clothes[slot][i].name === name) {
            console.log("test");
            console.log(setup.clothes[slot][i].index);
            return setup.clothes[slot][i].index;
        }
    }
}window.findClothes = findClothes;