/* eslint-disable jsdoc/no-undefined-types */
/*
 * On caching.
 *
 * I. We want to cache loaded images.
 * For that, there is Renderer.ImageCaches, "url"-><img> mapping
 *
 * II. We want to cache processed images.
 * For that, there is cachedImage and cachedProcessing in the CompositeLayer.
 * cachedProcessing is JSON string of all processing options.
 * We don't use some global "url + processing" cache because of bloat risk.
 * CanvasModel layers are not recreated on render, so rendering same model instance twice uses caching.
 *
 * III. We want to cache identical keyframes of animation, composed of multiple layers.
 * That's done in the animation code.
 *
 * IV. We want caches to persist between passages (if possible).
 * To do that we reuse same CanvasModel between passages.
 *
 * V. We still need to have separate instances of same model and don't want their caches to intersect.
 * For that, CanvasModels are cached by "slot" optional parameter.
 *
 * =======
 * Example
 * =======
 *
 * In the sidebar <<img>> widget, "main" CanvasModel is rendered using "sidebar" cache slot.
 * Whenever it is requested, it is same CanvasModel instance, so image processing is done only for changing layers.
 *
 * If in some test passage we render 10 more "main" CanvasModels without cache slot, they hold no cached layers and
 * are re-composed. (Source images are still cached globally under their url)
 */

/**
 * @typedef {object} CanvasModelLayer
 * @property {boolean} [show] Show this layer, default false (if no show:true or showfn present, needs explicit <<showlayer>>). Do not use undefined/null/0/"" to hide layer!
 * @property {string} [src] Image path. Either `src` or `srcfn` is required.
 * @property {number} [z] Z-index (rendering order), higher=above, lower=below. Either `z` of `zfn` is required.
 * @property {number} [alpha] Layer opacity, from 0 (invisible) to 1 (opaque, default).
 * @property {boolean} [desaturate] Convert image to grayscale (before recoloring), default false.
 * @property {number} [brightness] Adjust brightness, from -1 to +1 (before recoloring), default 0.
 * @property {number} [contrast] Adjust contrast (before recoloring), default 1.
 * @property {string} [blendMode] Recoloring mode (see docs for globalCompositeOperation; "hard-light", "multiply" and "screen" ), default none.
 * @property {string|object} [blend] Color for recoloring, CSS color string or gradient spec (see model.d.ts).
 * @property {string} [masksrc] Mask image path. If present, only parts where mask is opaque will be displayed.
 * @property {string} [animation] Name of animation to apply, default none.
 * @property {number} [frames] Frame numbers used to display static images, array of subsprite indices. For example, if model frame count is 6 but layer has only 3 subsprites, default frames would be [0, 0, 1, 1, 2, 2].
 * @property {string[]} [filters] Names of filters that should be applied to the layer; filters themselves are taken from model options.
 * @property {number} [dx] Layer X position on the image, default 0.
 * @property {number} [dy] Layer Y position on the image, default 0.
 * @property {number} [width] Layer subsprite width, default = model width.
 * @property {number} [height] Layer subsprite width, default = model height.
 *
 * The following functions can be used instead of constant properties. Their arguments are (options) where options are model options provided in render call (from _modeloptions variable for <<rendermodel>>/<<animatemodel>> widget).
 * @property {Function} [showfn] (options)=>boolean Function generating `show` property. Should return boolean, do not use undefined/null/0/"" to hide layer, use of !! (double not) operator recommended.
 * @property {Function} [srcfn] (options)=>string.
 * @property {Function} [zfn] (options)=>number.
 * @property {Function} [alphafn] (options)=>number.
 * @property {Function} [desaturatefn] (options)=>boolean.
 * @property {Function} [brightnessfn] (options)=>number.
 * @property {Function} [contrastftn] (options)=>number.
 * @property {Function} [blendModefn] (options)=>(string|object).
 * @property {Function} [blendfn] (options)=>string.
 * @property {Function} [masksrcfn] (options)=>string.
 * @property {Function} [animationfn] (options)=>string.
 * @property {Function} [framesfn] (options)=>number[].
 * @property {Function} [filtersfn] (options)=>string[].
 * @property {Function} [dxfn] (options)=>number.
 * @property {Function} [dyfn] (options)=>number.
 * @property {Function} [widthfn] (options)=>number.
 * @property {Function} [heightfn] (options)=>number.
 */

/**
 * @typedef {object} CanvasModelOptions
 * @property {string} name Model name, for debugging.
 * @property {number} width Frame width.
 * @property {number} height Frame height.
 * @property {number} frames Number of frames for CSS animation.
 * @property {Object<string, CanvasModelLayer>} layers Layers (by name).
 * @property {Function} [generatedOptions] Function ()=>string[] names of generated options.
 * @property {Function} [defaultOptions] Function ()=>object returning default options.
 * @property {Function} [preprocess] Preprocessing function (options)=>void to generate temp options.
 */

// Consider doing proper class inheritance
/**
 * @property {string} name Model name, for debugging.
 * @property {number} width Frame width.
 * @property {number} height Frame height.
 * @property {number} frames Number of frames for CSS animation.
 * @property {Function} defaultOptions Function ()=>object returning default options.
 * @property {string[]} generatedOptions Names of generated options.
 * @property {Object<string, CanvasModelLayer>} layers Layers (by name).
 * @property {CanvasModelLayer[]} layerList Layers.
 * @property {CanvasRenderingContext2D} canvas
 */
window.CanvasModel = class CanvasModel {
	/**
	 * @param {CanvasModelOptions} options
	 */
	constructor(options) {
		this.name = options.name;
		this.width = options.width;
		this.height = options.height;
		this.frames = options.frames || 1;
		if ("generatedOptions" in options) this.generatedOptions = options.generatedOptions;
		if ("defaultOptions" in options) this.defaultOptions = options.defaultOptions;
		if ("preprocess" in options) this.preprocess = options.preprocess;
		this.layers = clone(options.layers);
		for (const name in this.layers) {
			if (!Object.hasOwn(this.layers, name)) continue;
			const layer = this.layers[name];
			layer.name = name;
			assignDefaults(layer, {
				show: false, // By default, all layers have to be enabled manually
				brightness: 0.0,
				contrast: 1.0,
				blend: "",
				blendMode: "",
				alpha: 1.0,
				desaturate: false,
			});
			layer.defaultOptions = clone(layer); // deep copy
		}
		this.layerList = Object.values(this.layers);

		// Last used options
		this.options = { filters: {} };
		this.animated = false;
		this.canvas = null;
		this.rendererListener = null;
	}

	generatedOptions() {
		return [];
	}

	defaultOptions() {
		return {
			filters: {},
		};
	}

	createCanvas(cssAnimated) {
		return Renderer.createCanvas(this.width * (cssAnimated ? this.frames : 1), this.height);
	}

	reset() {
		this.options = {};
		for (const layer of this.layerList) {
			// Reset options
			jQuery.extend(true, layer, layer.defaultOptions);
		}
	}

	showLayer(name, filters) {
		const layer = this.layers[name];
		if (!layer) {
			console.error("Layer not found: " + this.name + "/" + name);
			return;
		}
		layer.show = true;
		for (const filter of filters) {
			if (filter === null || filter === undefined) continue; // null & undefined are allowed as "empty filter"
			if (typeof filter !== "object") {
				console.error("Invalid layer " + name + " filter " + typeof filter, filter);
				continue;
			}
			Object.assign(layer, filter);
		}
	}

	hideLayer(name) {
		const layer = this.layers[name];
		if (!layer) {
			console.error("Layer not found: " + this.name + "/" + name);
			return;
		}
		layer.show = false;
	}

	/**
	 * Update layers according to options and render them as static image.
	 *
	 * @param {CanvasRenderingContext2D} canvas Canvas to render on (can be created with {@link createCanvas}).
	 * @param {object} options Options to use when rendering model.
	 * @param {listener} listener For Renderer events.
	 */
	render(canvas, options, listener) {
		if (typeof options === "undefined") options = this.options;
		this.canvas = canvas;
		this.options = options;
		this.listener = listener;
		this.animated = false;
		this.redraw();
	}

	/**
	 * Update layers according to options and animate them.
	 *
	 * @param {CanvasRenderingContext2D} canvas Canvas to render on (can be created with {@link createCanvas}).
	 * @param {object} options Options to use when rendering model.
	 * @param {listener} listener For Renderer events.
	 * @returns {AnimatingCanvas} AnimatingCanvas object.
	 */
	animate(canvas, options, listener) {
		this.canvas = canvas;
		this.options = options;
		this.listener = listener;
		this.animated = true;
		return this.redraw();
	}

	/**
	 * Redraw the model onto same canvas.
	 */
	redraw() {
		if (!this.canvas) {
			Errors.report("CanvasModel.redraw() called but model was never rendered!");
			return;
		}
		Renderer.lastModel = this;
		if (this.animated) {
			return Renderer.animateLayers(this.canvas, this.compile(this.options), this.listener, true);
		} else {
			return Renderer.composeLayers(this.canvas, this.compile(this.options), this.canvas.canvas.width / this.width, this.listener);
		}
	}

	/**
	 * Pre-process options. Typically you calculate some expression here and store them as generated options
	 * Override in subclass.
	 *
	 * @param {options} options Model options.
	 */
	preprocess(options) {}

	/**
	 * Compile list of layers according to options.
	 *
	 * @param {options} options Model options.
	 * @returns {CompositeLayerSpec[]} Layers.
	 */
	compile(options) {
		const debug = V.debug;
		if (!options) options = { filters: {} };
		if (!("filters" in options)) options.filters = {};
		try {
			this.preprocess(options);
		} catch (e) {
			console.error(e);
			throw new Error("Error in model preprocessing: " + e.stack);
		}
		for (const layer of this.layerList) {
			// Reset some options
			layer.brightness = layer.defaultOptions.brightness;
			layer.contrast = layer.defaultOptions.contrast;
		}

		function propeval(layer, propname) {
			if (propname !== "show" && !debug && !layer.show) {
				// Situation A:
				// layer.srcfn: () => 'img/items/' + V.item.name + '.png'
				// and if V.item is undefined layer is skipped
				// So we don't want to eval skipped layer here
				//
				// Situation B:
				// Layer is skipped by mistake.
				// We want to debug its properties and show manually
				// So we might want to eval it still
				//
				// This is why we eval all properties in debug mode, but ignore their errors
				return;
			}
			const fnkey = propname + "fn";
			if (fnkey in layer) {
				try {
					layer[propname] = layer[fnkey](options);
				} catch (e) {
					if (layer.show) {
						console.error("Error evaluating layer " + layer.name + " property " + propname);
					}
				}
			}
		}

		for (const layer of this.layerList) {
			layer.show || propeval(layer, "show");
			propeval(layer, "src");
			if (!layer.src) {
				layer.src = ""; // force string value
				layer.show = false;
			}
			propeval(layer, "z");
			if (typeof layer.z !== "number" && layer.show !== false) console.error("Layer " + layer.name + " missing property z");
			propeval(layer, "alpha");
			propeval(layer, "blendMode");
			propeval(layer, "blend");
			propeval(layer, "desaturate");
			propeval(layer, "brightness");
			propeval(layer, "contrast");
			propeval(layer, "masksrc");
			propeval(layer, "animation");
			propeval(layer, "filters");
			propeval(layer, "dx");
			propeval(layer, "dy");
			propeval(layer, "width");
			propeval(layer, "height");
			if (layer.show !== false && layer.filters) {
				for (const filterName of layer.filters) {
					const filter = options.filters[filterName];
					if (!filter) {
						// console.warn("Layer " + layer.name + " needs filter " + filterName + " but it is not provided");
						continue;
					}
					Renderer.mergeLayerData(layer, filter, true);
				}
			}
		}
		return this.layerList;
	}
};

/**
 * @type {Object<string, CanvasModelOptions>}
 */
Renderer.CanvasModels = {};
/**
 * @type {Object<string, Object<string, CanvasModel>>}
 */
Renderer.CanvasModelCaches = {};
/**
 * Find or create new CanvasModel.
 *
 * @param {string} modelName CanvasModel name in Renderer.CanvasModels.
 * @param {string} [slot] Cache id to speed up rendering between passages.
 * @returns {CanvasModel}
 */
Renderer.locateModel = function (modelName, slot) {
	const options = Renderer.CanvasModels[modelName];
	if (!options) {
		Errors.report("Requested non-existing model " + modelName);
		return new CanvasModel({ name: "empty", width: 1, height: 1, layers: {} });
	}
	if (!slot) {
		return new CanvasModel(options);
	} else {
		let cache = Renderer.CanvasModelCaches[modelName];
		if (!cache) {
			cache = {};
			Renderer.CanvasModelCaches[modelName] = cache;
		}
		let model = cache[slot];
		if (model) return model;
		model = new CanvasModel(options);
		cache[slot] = model;
		return model;
	}
};

/**
 * Copies to targets keys from source that are not present there.
 * Shallow.
 *
 * @param {object} target Object to extend.
 * @param {object} source Default properties.
 * @returns {object} Target.
 */
function assignDefaults(target, source) {
	for (const k in source) {
		if (!Object.hasOwn(source, k)) continue;
		if (!(k in target)) target[k] = source[k];
	}
	return target;
}
