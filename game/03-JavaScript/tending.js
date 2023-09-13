window.plantSeedsInPlot = function (plot, plantType) {
	plot.plant = plantType;
	plot.stage = 1;
	plot.days = 0;
	V.tendingvars.plot_planted = 1;
	if (V.weather === "rain") plot.water = 1;
	else if (T.irrigation > 0) {
		plot.water = 1;
		T.irrigation--;
	}
};

window.unlockAllSeeds = function () {
	Object.values(setup.plants).forEach(plant => {
		if (!V.plants_known.includes(plant.name) && (plant.type === "flower" || plant.type === "vegetable")) {
			V.plants_known.push(plant.name);
		}
	});
};

window.tendingInstaGrow = function (location) {
	V.plots[location].forEach(plot => {
		if (plot.stage > 0 && plot.stage < 5) {
			plot.stage = 5;
		}
	});
};

window.unsetTendingVars = function () {
	V.tendingvars = {};
};
