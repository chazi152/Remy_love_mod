const TransformationsInterface = (() => {
	"use strict";

	// eslint-disable-next-line prefer-const
	let defaultColour = "rgb(255, 255, 0)";

	let current = null;

	function generateColourPicker() {
		let currentWidth = 0;
		const container = document.createElement("div");
		const picker = new iro.ColorPicker(container, {
			color: defaultColour,
			layout: [
				{
					component: iro.ui.Slider,
					options: {
						sliderType: "hue",
					},
				},
				{
					component: iro.ui.Slider,
					options: {
						sliderType: "saturation",
					},
				},
				{
					component: iro.ui.Slider,
					options: {
						sliderType: "value",
					},
				},
			],
		});
		picker.on("color:change", colour => {
			let hasMutated = false;
			const checkedItems = document.querySelectorAll('input[name="colour-selector"]:checked');
			for (const item of checkedItems) {
				const { h, s, l } = colour.hsl;
				const objStr = `{h:${h},s:${s},l:${l}}`;
				Scripting.evalTwineScript(item.dataset.target + " = " + objStr);
				hasMutated = true;
			}
			if (hasMutated) Wikifier.wikifyEval("<<updatesidebarimg>>");
		});
		const resizeObserver = new ResizeObserver(entries => {
			for (const entry of entries) {
				const width = entry.contentRect.width;
				if (currentWidth !== width) {
					picker.resize(width);
					currentWidth = width;
				}
			}
		});
		resizeObserver.observe(picker.base);
		current = picker;
		return {
			element: container.children[0],
			picker,
		};
	}

	function generateColourSquares(options) {
		const output = document.createDocumentFragment();
		if (Array.isArray(options)) {
			const containerList = document.createElement("div");
			containerList.classList.add("list", "row", "wrap", "colour-presets");
			/* Creation of square buttons. */
			options.forEach(option => {
				const square = document.createElement("div");
				square.classList.add("colour-preset");
				square.dataset.colour = "#" + option;
				square.style.backgroundColor = "#" + option;
				// eslint-disable-next-line no-undef
				square.style.borderColor = "#" + ColourUtils.invertHex(option);
				/* event handler */
				square.addEventListener("click", ev => {
					if (current != null) {
						current.color.set(ev.target.dataset.colour);
					}
				});
				/* Append to list */
				containerList.append(square);
			});
			/* Append our list to the output. */
			output.append(containerList);
		}
		return output;
	}

	function generateSelector(target) {
		const output = document.createDocumentFragment();

		const checkbox = document.createElement("input");
		checkbox.classList.add("colour-selector");
		checkbox.type = "checkbox";
		checkbox.name = "colour-selector";
		checkbox.value = "value";
		checkbox.dataset.target = target;

		output.append(checkbox);
		return output;
	}

	Macro.add("gencolourselector", {
		handler() {
			const target = this.args[0];
			const component = generateSelector(target);
			this.output.append(component);
			T.isMenuEnabled = true;
		},
	});

	Macro.add("gencoloursquares", {
		handler() {
			const options = this.args[0];
			const component = generateColourSquares(options);
			this.output.append(component);
		},
	});

	Macro.add("gencolourpicker", {
		handler() {
			const { element } = generateColourPicker();
			this.output.append(element);

			/* Cleanup at end of passage */
			$(document).one(":passageinit", () => {
				current = null;
			});
		},
	});

	return {
		generateColourPicker,
		generateColourSquares,
		current: () => current,
	};
})();
window.TransformationsInterface = TransformationsInterface;
