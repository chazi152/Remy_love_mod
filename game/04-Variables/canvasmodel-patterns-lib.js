/*
Example usage of image patterns:

T.modeloptions.worn_upper_colour = "custom"
T.modeloptions.filters.worn_upper_custom = {
	blend: { pattern: "wolfharmony" },
	blendMode: "hard-light"
}
*/

registerImagePattern("wolfharmony", "img/ui/wolfharmony.png");

/*
Example usage:

T.modeloptions.worn_upper_colour = "custom"
T.modeloptions.filters.worn_upper_custom = {
	blend: {
		pattern: { type: "checkerboard", colors: ["white", "black" ] }
	},
	blendMode: "hard-light"
}
 */
registerGeneratedPattern("checkerboard", function (spec) {
	const canvas = Renderer.createCanvas(8, 8, spec.colors[0]);
	canvas.fillStyle = spec.colors[1];
	canvas.fillRect(4, 0, 4, 4);
	canvas.fillRect(0, 4, 4, 4);
	return canvas.canvas; // return HTMLCanvasElement of CanvasRenderingContext2D
});
