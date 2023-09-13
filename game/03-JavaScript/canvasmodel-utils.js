/**
 * (Low-level API)
 * Prepare a layer to be rendered.
 *
 * See {@link CompositeLayerSpec} definition for details on options.
 *
 * Arguments are processed depending on their type:
 * String argument is `src` option (image source)
 * Number argument is `z` option (z-index)
 * Object argument is full or partial  CompositeLayerSpec object
 * Leftmost arguments have most priority.
 *
 * @example
 * <<run canvaslayer(10, 'img.png', {blendMode:'hard-light', blend:'#00ff00'});>>
 * <<run canvaslayer({z:10, src:'img.png'}, {blendMode:'hard-light', blend:'#00ff00'});>>
 */
function canvaslayer() {
	const layers = T.CanvasLayers;
	if (!layers) throw new Error("'canvaslayer()' without 'canvasstart'");

	let theOptions = {};
	for (let i = arguments.length - 1; i >= 0; i--) {
		const arg = arguments[i];
		switch (typeof arg) {
			case "object":
				theOptions = Object.assign(theOptions, arg);
				break;
			case "string":
				theOptions.src = arg;
				break;
			case "number":
				theOptions.z = arg;
				break;
			default:
				throw new Error("Invalid canvaslayer() argument " + i + ": " + typeof arg);
		}
	}

	if (typeof theOptions.src !== "string") {
		console.error(arguments);
		throw new Error("canvaslayer() options missing 'src'");
	}
	layers.push(theOptions);
}
window.canvaslayer = canvaslayer;

// use 2x2 pixels in generated images
Renderer.pixelSize = 2;

Renderer.Stats = {
	trace: false,
	traceAnim: false,
	lastLoadTime: 0,
	lastRenderTime: 0,

	logmsgLoad: new ObservableValue(""),
	logmsgRender: new ObservableValue(""),
	logmsgAnimate: new ObservableValue(""),

	nlayers: 0,
	ncached: 0,
};
Renderer.defaultListener = {
	error(error) {
		// strip source data
		const msg = (error.stack || error.message || "" + error).replace(/\(?[^( )]*:\d+:\d+\)?/gm, "").replace(/\(?eval at [\w.]+/gm, "");
		Errors.report(msg);
	},
	composeLayers(layers) {
		Renderer.Stats.loadErrors = 0;
		if (Renderer.Stats.trace) {
			console.log(DOL.Perflog.millitime().toFixed(3), "Composing " + layers.length + " layers...");
		}
	},
	processingStep(layer, processing, canvas, dt) {
		DOL.Perflog.logWidgetTime("_render:" + processing, dt);
	},
	loadError(layer, src) {
		// logged to console by Renderer itself
		Renderer.Stats.loadErrors++;
		Errors.report("Failed to load image " + src + " for layer " + layer);
	},
	loadingDone(time, layersLoaded) {
		Renderer.Stats.lastLoadTime = time;
		let msg = "Loaded " + layersLoaded + " images in " + time.toFixed(3) + " ms";
		if (Renderer.Stats.loadErrors > 0) msg += " (" + Renderer.Stats.loadErrors + " failed)";
		Renderer.Stats.logmsgLoad.value = msg;
		if (Renderer.Stats.trace) {
			console.log(DOL.Perflog.millitime().toFixed(3), msg);
		}
	},
	beforeRender(layers) {
		Renderer.Stats.nlayers = layers.length;
		Renderer.Stats.ncached = 0;
	},
	layerCacheHit(layer) {
		Renderer.Stats.ncached++;
	},
	renderingDone(time) {
		Renderer.Stats.lastRenderTime = time;
		const msg = "Rendered " + Renderer.Stats.nlayers + " layers" + " (" + Renderer.Stats.ncached + " cached)" + " in " + time.toFixed(3) + " ms";
		if (Renderer.Stats.trace) {
			console.log(DOL.Perflog.millitime().toFixed(3), msg);
		}
		Renderer.Stats.logmsgRender.value = msg;
	},
	keyframe(animation, keyframeIndex, keyframe) {
		if (Renderer.Stats.traceAnim) {
			console.log(
				DOL.Perflog.millitime().toFixed(3),
				"animation",
				animation,
				"keyframe",
				keyframeIndex,
				"frame",
				keyframe.frame,
				"duration",
				keyframe.duration
			);
		}
	},
	keyframeRender(spec, cacheHit, cacheRenderTime) {
		if (Renderer.Stats.traceAnim) {
			console.log(
				DOL.Perflog.millitime().toFixed(3),
				"KeyframeRender",
				spec,
				cacheHit ? "cache hit, render time " + cacheRenderTime.toFixed(3) + " ms" : "cache miss"
			);
		}
		if (cacheHit && Renderer.Stats.logmsgAnimate) {
			Renderer.Stats.logmsgAnimate.value = "Cached keyframe rendered in " + cacheRenderTime.toFixed(3) + " ms";
		}
	},
	animationStop() {
		if (Renderer.Stats.traceAnim) {
			console.log(DOL.Perflog.millitime().toFixed(3), "Animation stopped");
		}
	},
};
