///<reference path="model.d.ts"/>

/*
 * Created by aimozg on 29.08.2020.
 */
namespace Renderer {
	const millitime = (typeof performance === 'object' && typeof performance.now === 'function') ?
		function () {
			return performance.now()
		} : function () {
			return new Date().getTime()
		};

	export interface LayerImageLoader {
		loadImage(src: string,
		          layer: CompositeLayer,
		          successCallback: (src: string, layer: CompositeLayer, image: HTMLImageElement) => any,
		          errorCallback: (src: string, layer: CompositeLayer, error: any) => any
		);
	}
	export const DefaultImageLoader: LayerImageLoader = {
		loadImage(src: string,
		          layer: CompositeLayer,
		          successCallback: (src: string, layer: CompositeLayer, image: HTMLImageElement) => any,
		          errorCallback: (src: string, layer: CompositeLayer, error: any) => any) {
			const image = new Image();
			image.onload = () => {
				successCallback(src, layer, image);
			}
			image.onerror = (event) => {
				errorCallback(src, layer, event);
			}
			image.src = src;
		}
	}
	export let ImageLoader: LayerImageLoader = DefaultImageLoader;

	export interface RendererListener {
		error?: (error: Error, context:any) => any;

		composeLayers?: (layers: CompositeLayer[]) => any;
		loaded?: (layer: string, src: string) => any;
		loadError?: (layer: string, src: string) => any;
		loadingDone?: (time: number, count: number) => any;

		beforeRender?: (layers: CompositeLayer[]) => any;
		layerCacheMiss?: (layer: CompositeLayer) => any;
		layerCacheHit?: (layer: CompositeLayer) => any;
		processingStep?: (layer: string, processing: string, canvas: HTMLCanvasElement, dt: number) => any;
		composition?: (layer: string, result: HTMLCanvasElement) => any;
		renderingDone?: (time: number) => any;

		keyframe?: (animation: string, keyframeIndex: number, keyframe: KeyframeSpec) => any;
		keyframeRender?: (spec: string, cacheHit: boolean, cacheRenderTime: number) => any;
		animationStop?: () => any;
	}
	function rendererError(listener:RendererListener, error:Error, context?:any) {
		if (listener && listener.error) {
			listener.error(error, context);
		} else {
			console.error(error);
		}
	}

	/**
	 * Last arguments to composeLayers
	 */
	export let lastCall: any[] | undefined = undefined;
	/**
	 * Last arguments to animateLayers
	 */
	export let lastAnimateCall: any[] | undefined = undefined;
	/**
	 * Last result of animateLayers
	 */
	export let lastAnimation: AnimatingCanvas | undefined = undefined;

	/**
	 * Use "pixels" of this size when generating images.
	 */
	export let pixelSize: number = 1;

	export function emptyLayerFilter():CompositeLayerParams {
		return {
			desaturate: false,
			blend: "",
			blendMode: "source-over",
			brightness: 0.0,
			contrast: 1.0
		}
	}

	/**
	 * 0 -> "#000000", 0.5 -> "#808080", 1.0 -> "#FFFFFF"
	 */
	export function gray(value:number): string {
		value = Math.min(1, Math.max(0, value));
		value = Math.round(value*255);
		let s = value.toString(16);
		if (value < 16) s = '0' + s;
		return '#'+s+s+s;
	}

	export function createCanvas(w: number, h: number, fill?: string): CanvasRenderingContext2D {
		let c = document.createElement("canvas");
		c.width = w;
		c.height = h;
		let c2d = c.getContext('2d')!!
		if (fill) {
			c2d.fillStyle = fill;
			c2d.fillRect(0, 0, w, h);
		}
		return c2d;
	}

	export function ensureCanvas(image: CanvasImageSource): HTMLCanvasElement {
		if (image instanceof HTMLCanvasElement) {
			return image;
		}
		let i2 = createCanvas(image.width as number, image.height as number);
		i2.drawImage(image, 0, 0);
		return i2.canvas;
	}

	/**
	 * Free to use CanvasRenderingContext2D (to create image data, gradients, patterns)
	 */
	export const globalC2D = createCanvas(1,1);

	/**
	 * Creates a cutout of color in shape of sourceImage
	 */
	export function cutout(
		sourceImage: CanvasImageSource,
		color: string,
		canvas: CanvasRenderingContext2D = createCanvas(sourceImage.width as number, sourceImage.height as number)
	): CanvasRenderingContext2D {
		let sw = sourceImage.width as number;
		let sh = sourceImage.height as number;
		canvas.clearRect(0, 0, sw, sh);
		// Fill with target color
		canvas.globalCompositeOperation = 'source-over';
		canvas.fillStyle = color;
		canvas.fillRect(0, 0, sw, sh);

		return cutoutFrom(canvas, sourceImage);
	}

	/**
	 * Cuts out from base a shape in form of stencil.
	 * Modifies and returns base.
	 */
	export function cutoutFrom(base: CanvasRenderingContext2D,
	                           stencil: CanvasImageSource): CanvasRenderingContext2D {
		base.globalCompositeOperation = 'destination-in';
		base.drawImage(stencil, 0, 0);
		return base;
	}

	/**
	 * Paints sourceImage over cutout of it filled with color.
	 */
	export function composeOverCutout(
		sourceImage: CanvasImageSource,
		color: string,
		blendMode: GlobalCompositeOperation = 'multiply',
		canvas: CanvasRenderingContext2D = createCanvas(sourceImage.width as number, sourceImage.height as number)
	): CanvasRenderingContext2D {
		canvas = cutout(sourceImage, color, canvas);
		// Multiply cutout with original
		canvas.globalCompositeOperation = blendMode;
		canvas.drawImage(sourceImage, 0, 0);

		return canvas;
	}

	/**
	 * Repeatedly fill all sub-frames of canvas with same style.
	 * (Makes sense with gradient and pattern fills, to keep consistents across all sub-frames)
	 */
	export function fillFrames(
		fillStyle: string | CanvasGradient | CanvasPattern,
		canvas: CanvasRenderingContext2D,
		frameCount: number,
		frameWidth: number,
		blendMode: GlobalCompositeOperation,
	) {
		const frameHeight = canvas.canvas.height;
		canvas.globalCompositeOperation = blendMode;
		canvas.fillStyle = fillStyle;
		canvas.fillRect(0, 0, frameWidth, frameHeight);
		if (pixelSize > 1) {
			// downscale, redraw on temp canvas, then draw again
			const tw = Math.floor(frameWidth/pixelSize),
				th = Math.floor(frameHeight/pixelSize);
			const tmpcanvas = createCanvas(tw, th);
			tmpcanvas.imageSmoothingEnabled = false
			canvas.imageSmoothingEnabled = false
			tmpcanvas.drawImage(
				canvas.canvas,
				0, 0, frameWidth, frameHeight,
				0, 0, tw, th
			);
			canvas.drawImage(
				tmpcanvas.canvas,
				0, 0, tw, th,
				0, 0, frameWidth, frameHeight
			);
		}
		for (let i = 1; i<frameCount; i++) {
			canvas.drawImage(canvas.canvas,
				0, 0, frameWidth, frameHeight,
				i*frameWidth, 0, frameWidth, frameHeight);
		}
	}

	export let Patterns:Dict<CanvasPattern> = {};
	/**
	 * CanvasPattern generator/provider.
	 * Default implementation looks up in the Renderer.Patterns object, can be replaced to accept complex object
	 * and generate custom pattern.
	 */
	export let PatternProvider: (spec: string|object)=>(CanvasPattern|null) = (spec)=>{
		if (typeof spec === 'string' && spec in Patterns) return Patterns[spec];
		return null;
	};

	export function createGradient(spec: BlendGradientSpec): CanvasGradient {
		let gradient: CanvasGradient;
		switch (spec.gradient) {
			case "linear":
				gradient = globalC2D.createLinearGradient(
					spec.values[0], spec.values[1],
					spec.values[2], spec.values[3]
				);
				break;
			case "radial":
				gradient = globalC2D.createRadialGradient(
					spec.values[0], spec.values[1], spec.values[2],
					spec.values[3], spec.values[4], spec.values[5]
				);
				break;
			default:
				throw new Error("Invalid gradient type: "+spec.gradient);
		}
		if (spec.colors.length < 2) throw new Error("Invalid gradient stops: "+JSON.stringify(spec.colors));
		for (let i = 0; i < spec.colors.length; i++) {
			let stop = spec.colors[i];
			let offset:number, color:string;
			if (typeof stop === 'string') {
				color = stop;
				offset =  i/(spec.colors.length-1);
			} else {
				offset = stop[0];
				color = stop[1];
			}
			gradient.addColorStop(offset, color);
		}
		return gradient
	}

	/**
	 * Paints sourceImage over same-sized canvas filled with pattern or gradient
	 */
	export function composeOverSpecialRect(
		sourceImage: CanvasImageSource,
		fillStyle: CanvasGradient | CanvasPattern,
		blendMode: GlobalCompositeOperation,
		frameCount: number,
		targetCanvas: CanvasRenderingContext2D = createCanvas(
			sourceImage.width as number,
			sourceImage.height as number
		)
	): CanvasRenderingContext2D {
		let fw = (sourceImage.width as number)/frameCount;
		fillFrames(fillStyle, targetCanvas, frameCount, fw, 'source-over');

		targetCanvas.globalCompositeOperation = blendMode;
		targetCanvas.drawImage(sourceImage, 0, 0);
		return targetCanvas
	}

	/**
	 * Paints sourceImage under same-sized canvas filled with pattern or gradient
	 */
	export function composeUnderSpecialRect(
		sourceImage: CanvasImageSource,
		fillStyle: CanvasGradient | CanvasPattern,
		blendMode: GlobalCompositeOperation,
		frameCount: number,
		targetCanvas: CanvasRenderingContext2D = createCanvas(
			sourceImage.width as number,
			sourceImage.height as number
		)
	): CanvasRenderingContext2D {
		let fw = (sourceImage.width as number) / frameCount;
		const fill = createCanvas(sourceImage.width as number, sourceImage.height as number);
		fillFrames(fillStyle, fill, frameCount, fw, 'source-over');

		targetCanvas.globalCompositeOperation = 'source-over';
		targetCanvas.drawImage(sourceImage, 0, 0);
		targetCanvas.globalCompositeOperation = blendMode;
		targetCanvas.drawImage(fill.canvas, 0, 0)
		return targetCanvas;
	}

	/**
	 * Paints sourceImage over same-sized canvas filled with color
	 */
	export function composeOverRect(sourceImage: CanvasImageSource,
		color: string,
		blendMode: GlobalCompositeOperation,
		targetCanvas: CanvasRenderingContext2D = createCanvas(sourceImage.width as number,
			sourceImage.height as number)
	): CanvasRenderingContext2D {
		// Fill with target color
		targetCanvas.globalCompositeOperation = 'source-over';
		targetCanvas.fillStyle = color;
		targetCanvas.fillRect(0, 0, sourceImage.width as number, sourceImage.height as number);

		targetCanvas.globalCompositeOperation = blendMode;
		targetCanvas.drawImage(sourceImage, 0, 0);
		return targetCanvas
	}

	/**
	 * Paints over sourceImage a cutout of it filled with color.
	 */
	export function composeUnderCutout(sourceImage: CanvasImageSource,
		color: string,
		blendMode: GlobalCompositeOperation = 'multiply',
		canvas: CanvasRenderingContext2D =
			createCanvas(sourceImage.width as number, sourceImage.height as number)) {
		const cut = cutout(sourceImage, color);
		// Create a copy of sourceImage
		canvas.globalCompositeOperation = 'source-over';
		canvas.drawImage(sourceImage, 0, 0);
		// Multiply with cutout
		canvas.globalCompositeOperation = blendMode;
		canvas.drawImage(cut.canvas, 0, 0);

		return canvas;
	}

	/**
	 * Paints over sourceImage a same-sized canvas filled with color
	 */
	export function composeUnderRect(sourceImage: CanvasImageSource,
		color: string,
		blendMode: GlobalCompositeOperation = 'multiply',
		targetCanvas: CanvasRenderingContext2D =
			createCanvas(sourceImage.width as number, sourceImage.height as number)
	): CanvasRenderingContext2D {
		let fill = createCanvas(sourceImage.width as number, sourceImage.height as number, color);
		targetCanvas.globalCompositeOperation = 'source-over';
		targetCanvas.drawImage(sourceImage, 0, 0);
		targetCanvas.globalCompositeOperation = blendMode;
		targetCanvas.drawImage(fill.canvas, 0, 0);
		return targetCanvas
	}

	export let ImageCaches: {
		[index: string]: HTMLImageElement
	} = {};
	export let ImageErrors: {
		[index: string]: boolean
	} = {};

	/**
	 * Switch between compose(Over|Under)(Rect|Cutout)
	 */
	export function compose(
		composeOver: boolean,
		doCutout: boolean,
		sourceImage: CanvasImageSource,
		color: string,
		blendMode: GlobalCompositeOperation,
		targetCanvas: CanvasRenderingContext2D = createCanvas(
			sourceImage.width as number,
			sourceImage.height as number)
	): CanvasRenderingContext2D {
		if (doCutout) {
			if (composeOver) {
				return composeOverCutout(sourceImage, color, blendMode, targetCanvas);
			} else {
				return composeUnderCutout(sourceImage, color, blendMode, targetCanvas);
			}
		} else {
			if (composeOver) {
				return composeOverRect(sourceImage, color, blendMode, targetCanvas);
			} else {
				return composeUnderRect(sourceImage, color, blendMode, targetCanvas);
			}
		}
	}

	/**
	 * Fills properties in `target` from `source`.
	 * If `overwrite` is false, only missing properties are copied.
	 * In both cases, brightness is added, contrast is multiplied.
	 * Returns target
	 */
	export function mergeLayerData(target: CompositeLayerSpec, source: CompositeLayerParams, overwrite: boolean = false): CompositeLayerSpec {
		for (let k of Object.keys(source)) {
			if (k === 'brightness' && 'brightness' in target) {
				if (typeof target.brightness === 'object' && typeof source.brightness === 'number') {
					for (const [adjustmentIndex, adjustment] of target.brightness.adjustments.entries()) {
						if (typeof adjustment === 'number') {
							(target.brightness.adjustments[adjustmentIndex] as number) += source.brightness;
						} else {
							target.brightness.adjustments[adjustmentIndex][1] += source.brightness;
						}
					}
				} else if (typeof target.brightness === 'number' && typeof source.brightness === 'object') {
					const brightnessToAdd = target.brightness;
					target.brightness = { ...source.brightness };
					for (const [adjustmentIndex, adjustment] of target.brightness.adjustments.entries()) {
						if (typeof adjustment === 'number') {
							(target.brightness.adjustments[adjustmentIndex] as number) += brightnessToAdd;
						} else {
							target.brightness.adjustments[adjustmentIndex][1] += brightnessToAdd;
						}
					}
				} else if (typeof target.brightness === 'number' && typeof source.brightness === 'number') {
					target.brightness += source.brightness;
				} else {
					throw new Error("Not implemented: cannot merge two gradient brightnesses.")
				}
			} else if (k === 'contrast' && 'contrast' in target) {
				target.contrast *= source.contrast;
			} else if (overwrite || !(k in target)) {
				target[k] = source[k];
			}
		}
		return target;
	}

	export function encodeProcessing(spec: CompositeLayerSpec): string {
		return JSON.stringify({
			// z, alpha, show, and frames regulate how layer is rendered onto target canvas
			src: spec.src,
			blend: spec.blend,
			blendMode: spec.blendMode,
			desaturate: spec.desaturate,
			brightness: spec.brightness,
			contrast: spec.contrast,
			prefilter: spec.prefilter,
			masksrc: spec.masksrc
		});

	}

	export function composeLayersAgain() {
		composeLayers.apply(Renderer, lastCall);
	}

	export function desaturateImage(image: CanvasImageSource,
		resultCanvas?: CanvasRenderingContext2D,
		doCutout: boolean = true): HTMLCanvasElement {
		return compose(false, doCutout, image, '#000000', 'saturation', resultCanvas).canvas;
	}

	export function filterImage(image: CanvasImageSource, filter: string, resultCanvas?: CanvasRenderingContext2D): HTMLCanvasElement {
		if (!resultCanvas) {
			resultCanvas = createCanvas(image.width as number, image.height as number);
		}
		resultCanvas.filter = filter;
		resultCanvas.globalCompositeOperation = 'source-over';
		resultCanvas.drawImage(image, 0, 0);
		resultCanvas.filter = '';
		return resultCanvas.canvas;
	}

	export function adjustGradientBrightness(image: CanvasImageSource,
		frameCount: number,
		brightness: AdjustmentGradientSpec,
		resultCanvas?: CanvasRenderingContext2D): HTMLCanvasElement {
		if (brightness.adjustments.length !== 2) {
			throw new Error("Not Implemented: Brightness gradients can have only exactly 2 stops.")
		}

		const gradientInitializations: { grey: string, neutral: string, offset: number, blendMode: GlobalCompositeOperation }[] = [];
		for (const [i, adjustment] of brightness.adjustments.entries()) {
			let brightnessValue: number;
			let offsetValue: number;

			// [color |[offset, color]]
			if (typeof adjustment === 'number') {
				brightnessValue = adjustment;
				offsetValue = i;
			} else {
				brightnessValue = adjustment[1];
				offsetValue = adjustment[0];
			}

			// lightnenig or darkening
			if (brightnessValue > 0) {
				gradientInitializations.push({
					grey: gray(brightnessValue),
					neutral: "#000000",
					offset: offsetValue,
					blendMode: 'color-dodge',
				})
			} else {
				gradientInitializations.push({
					grey: gray(1 + brightnessValue),
					neutral: "#FFFFFF",
					offset: offsetValue,
					blendMode: 'multiply',
				})
			}
		}

		// we needmultiple gradients if we are darkening and lightening at the same time
		if (gradientInitializations[0].blendMode != gradientInitializations[1].blendMode) {
			const gradients = [];
			for (const [i, gradientInit] of gradientInitializations.entries()) {
				gradients.push(createGradient({
					...brightness,
					colors: [
						[gradientInitializations[0].offset, i === 0 ? gradientInit.grey : gradientInit.neutral],
						[gradientInitializations[1].offset, i === 0 ? gradientInit.neutral : gradientInit.grey]
					]
				}));
			}

			const firstGradientApplied = composeUnderSpecialRect(image, gradients[0], gradientInitializations[0].blendMode, frameCount);
			const secondGradientApplied = composeUnderSpecialRect(firstGradientApplied.canvas, gradients[1], gradientInitializations[1].blendMode, frameCount, resultCanvas);

			return secondGradientApplied.canvas;
		} else {
			const brightnessGradient = createGradient({
				...brightness,
				colors: [
					[gradientInitializations[0].offset, gradientInitializations[0].grey],
					[gradientInitializations[1].offset, gradientInitializations[1].grey]
				]
			});
			return composeUnderSpecialRect(image, brightnessGradient, gradientInitializations[0].blendMode, frameCount, resultCanvas).canvas;
		}

	}

	export function adjustBrightness(image: CanvasImageSource,
	                                 brightness: number,
	                                 resultCanvas?: CanvasRenderingContext2D,
	                                 doCutout: boolean = true): HTMLCanvasElement {
		if (brightness > 0) {
			const value = gray(brightness);
			// color-dodge by X% gray adjusts levels 0%-(100-X)% to 0%-100%
			return compose(false, doCutout, image, value, 'color-dodge', resultCanvas).canvas;
			// Other option:
			// screen by X% gray adjust levels 0%-100% to X%-100%
			// return composeUnderCutout(image, value, 'screen').canvas;
		} else {
			// multiply by X% gray adjusts levels 0%-100% to 0%-X%
			const value = gray(1+brightness);
			return compose(false, doCutout, image, value, 'multiply', resultCanvas).canvas;
			// Other option:
			// color-burn by X% gray adjusts levels (100-X)%-100% to 0%-100%
		}
	}

	export function adjustLevels(image: CanvasImageSource,
	                             /**
	                              * scale factor, 1 - no change, >1 - higher contrast, <1 - lower contrast.
	                              */
	                             factor: number,
	                             /**
	                              * shift, 0 - no change, >0 - brighter, <0 - darker
	                              */
	                             shift: number,
	                             resultCanvas?: CanvasRenderingContext2D
	                             ): HTMLCanvasElement {
		if (factor >= 1) {
			/*
			 color-dodge ( color, X ) = color / (1 - X) ; 0..(1-X) -> 0..1, (1-X) and brighter become white
			 color-burn ( color, Y ) = 1 - (1 - color) / Y ; (1-Y)..1 -> 0..1, (1-Y) and darker become black
			 color-burn ( color-dodge ( color, X ), Y ) = (1-1/Y) + color / (Y-X*Y)
														= shift   + color * factor
			 given (shift, factor), solving for (X, Y):
			 X = 1-(1-shift)/factor
			 Y = 1/(1 - shift)
			 */
			const x = 1 - (1 - shift) / factor;
			const y = 1 / (1 - shift);

			const c1 = compose(false, false, image, gray(x), 'color-dodge');
			const c2 = compose(false, false, c1.canvas, gray(y), 'color-burn', resultCanvas);
			return c2.canvas;
		} else {
			/*
			 multiply ( color, X ) = color * X ; 0..1 -> 0..X
			 screen ( color, Y ) = 1 - (1 - color) * (1 - Y) ; 0..1 -> Y..1
			 screen ( multiply ( color, X ), Y ) = 1 - (1 - color * X ) * (1 - Y)
			                                     = Y     + color * X*(1-Y)
			                                     = shift + color * factor
			 solving for (X, Y):
			 Y = shift
			 X = factor/(1-shift)
			 */
			const x = factor/(1-shift);
			const y = shift;
			const c1 = compose(false, false, image, gray(x), 'multiply');
			const c2 = compose(false, false, c1.canvas, gray(y), 'screen');
			return c2.canvas;
		}
	}

	export function adjustContrast(image: CanvasImageSource,
	                               factor: number,
	                               resultCanvas?: CanvasRenderingContext2D
	): HTMLCanvasElement {
		/*
		 contrast is scale by F with origin at 0.5
		*/
		const shift = 0.5*(1-factor);
		return adjustLevels(image, factor, shift, resultCanvas);
	}

	export function adjustBrightnessAndContrast(
		image: CanvasImageSource,
		brightness: number,
		contrast: number,
		resultCanvas?: CanvasRenderingContext2D
	): HTMLCanvasElement {
		// = adjustContrast (color + brightness, contrast)
		const shift = brightness*contrast + 0.5*(1-contrast);
		return adjustLevels(image, contrast, shift, resultCanvas);
	}

	export interface RenderPipelineContext {
		layer: CompositeLayer;
		/**
		 * Updates along the pipeline
		 */
		image: CanvasImageSource;
		listener: RendererListener;
		rects: LayerRects;
		needsCutout: boolean;

		// extra properties are allowed
		[index:string]: any;
	}

	/**
	 * Abstraction of layer processing steps.
	 * All steps are stored in RenderingPipeline array, and can be changed externally
	 */
	export interface RenderingStep {
		name:string;

		/**
		 * Return true if this step has to be performed
		 */
		condition(layer:CompositeLayer, context: RenderPipelineContext):boolean;

		/**
		 * Rendering function, returns resulting image.
		 */
		render(image:CanvasImageSource,
		                 layer:CompositeLayer,
		                 context: RenderPipelineContext
		): HTMLCanvasElement;
	}

	const RenderingStepDesaturate:RenderingStep = {
		name: "desaturate",

		condition(layer: CompositeLayer, context: Renderer.RenderPipelineContext): boolean {
			return layer.desaturate;
		},

		render(image: CanvasImageSource, layer: CompositeLayer, context: Renderer.RenderPipelineContext): HTMLCanvasElement {
			context.needsCutout = true;
			return desaturateImage(image, undefined, false);
		}
	};

	const RenderingStepPrefilter:RenderingStep = {
		name: "prefilter",
		condition(layer: CompositeLayer, context: Renderer.RenderPipelineContext): boolean {
			return layer.prefilter && layer.prefilter !== "none";
		},

		render(image: CanvasImageSource, layer: CompositeLayer, context: Renderer.RenderPipelineContext): HTMLCanvasElement {
			return filterImage(image, layer.prefilter);
		}

	};

	const RenderingStepBrightness:RenderingStep = {
		name: "brightness",
		condition(layer: CompositeLayer, context: Renderer.RenderPipelineContext): boolean {
			return typeof layer.brightness === 'number' && layer.brightness !== 0;
		},

		render(image: CanvasImageSource, layer: CompositeLayer, context: Renderer.RenderPipelineContext): HTMLCanvasElement {
			context.needsCutout = true;
			return adjustBrightness(image, layer.brightness as number, undefined, false);
		}
	}

	const RenderingStepBrightnessGradient: RenderingStep = {
		name: "brightness:gradient",
		condition(layer: CompositeLayer, context: Renderer.RenderPipelineContext): boolean {
			return layer.brightness && typeof layer.brightness === 'object' && 'gradient' in layer.brightness;
		},

		render(image: CanvasImageSource, layer: CompositeLayer, context: Renderer.RenderPipelineContext): HTMLCanvasElement {
			context.needsCutout = true;
			return adjustGradientBrightness(image, context.rects.subspriteFrameCount, layer.brightness as AdjustmentGradientSpec, undefined);
		}
	}

	const RenderingStepContrast: RenderingStep = {
		name: "contrast",

		condition(layer: CompositeLayer, context: Renderer.RenderPipelineContext): boolean {
			return typeof layer.contrast === 'number' && layer.contrast !== 1;
		},

		render(image: CanvasImageSource, layer: CompositeLayer, context: Renderer.RenderPipelineContext): HTMLCanvasElement {
			context.needsCutout = true;
			return adjustContrast(image, layer.contrast, undefined);
		}

	}

	const RenderingStepBlendColor: RenderingStep = {
		name: "blend:color",

		condition(layer: CompositeLayer, context: Renderer.RenderPipelineContext): boolean {
			return layer.blendMode && layer.blend && typeof layer.blend === "string";
		},

		render(image: CanvasImageSource, layer: CompositeLayer, context: Renderer.RenderPipelineContext): HTMLCanvasElement {
			context.needsCutout = true;
			return composeOverRect(image, layer.blend as string, layer.blendMode).canvas;
		}
	}

	const RenderingStepBlendGradient: RenderingStep = {
		name: "blend:gradient",

		condition(layer: CompositeLayer, context: Renderer.RenderPipelineContext): boolean {
			return layer.blendMode && layer.blend && typeof layer.blend === 'object' && 'gradient' in layer.blend;
		},

		render(image: CanvasImageSource, layer: CompositeLayer, context: Renderer.RenderPipelineContext): HTMLCanvasElement {
			context.needsCutout = true;
			let gradient = createGradient(layer.blend as BlendGradientSpec);
			return composeOverSpecialRect(image, gradient, layer.blendMode, context.rects.subspriteFrameCount).canvas;
		}
	}

	const RenderingStepBlendPattern: RenderingStep = {
		name: "blend:pattern",

		condition(layer: CompositeLayer, context: Renderer.RenderPipelineContext): boolean {
			return layer.blendMode && layer.blend && typeof layer.blend === 'object' && 'pattern' in layer.blend;
		},

		render(image: CanvasImageSource, layer: CompositeLayer, context: Renderer.RenderPipelineContext): HTMLCanvasElement {
			context.needsCutout = true;
			let pattern = PatternProvider((layer.blend as BlendPatternSpec).pattern);
			if (!pattern) {
				return ensureCanvas(image);
			}
			return composeOverSpecialRect(image, pattern, layer.blendMode, context.rects.subspriteFrameCount).canvas;
		}
	}

	const RenderingStepMask: RenderingStep = {
		name: "mask",

		condition(layer: CompositeLayer, context: Renderer.RenderPipelineContext): boolean {
			return !!layer.mask;
		},

		render(image: CanvasImageSource, layer: CompositeLayer, context: Renderer.RenderPipelineContext): HTMLCanvasElement {
			return cutoutFrom(ensureCanvas(image).getContext('2d'), layer.mask).canvas;
		}
	}

	const RenderingStepCutout: RenderingStep = {
		name: "cutout",

		condition(layer: CompositeLayer, context: Renderer.RenderPipelineContext): boolean {
			return context.needsCutout;
		},

		render(image: CanvasImageSource, layer: CompositeLayer, context: Renderer.RenderPipelineContext): HTMLCanvasElement {
			return cutoutFrom(ensureCanvas(image).getContext('2d'), layer.image!!).canvas;
		}
	}

	/**
	 * Rendering steps used. Order matters!
	 */
	export const RenderingPipeline: RenderingStep[] = [
		RenderingStepDesaturate,
		RenderingStepPrefilter,
		RenderingStepBrightnessGradient,
		RenderingStepBrightness,
		RenderingStepContrast,
		RenderingStepBlendPattern,
		RenderingStepBlendGradient,
		RenderingStepBlendColor,
		RenderingStepMask,
		RenderingStepCutout
	]

	export function processLayer(
		layer: CompositeLayer,
		rects: LayerRects,
		listener: RendererListener
	) {
		let context: RenderPipelineContext = {
			layer: layer,
			image: layer.image!!,
			needsCutout: false,
			rects: rects,
			listener: listener
		}
		for (let step of RenderingPipeline) {
			if (!step.condition(context.layer, context)) continue;
			let t0 = millitime();
			let listener = context.listener;
			context.image = step.render(context.image, context.layer, context);
			if (listener && listener.processingStep) {
				listener.processingStep(context.layer.name, step.name, context.image, millitime() - t0);
			}
		}
		return context.image;
	}

	interface LayerRects {
		width: number;
		height: number;
		frameWidth: number;
		frameCount: number;
		subspriteWidth: number;
		subspriteHeight: number;
		subspriteFrameCount: number;
		dx: number;
		dy: number;
	}
	function calcLayerRects(layer: CompositeLayer,
	                        layerImageWidth: number,
	                        targetWidth: number,
	                        targetHeight: number,
	                        frameCount: number): LayerRects {
		const frameWidth = targetWidth / frameCount;
		const subspriteWidth = layer.width || frameWidth;
		const subspriteHeight = layer.height || targetHeight;
		const dx = layer.dx || 0;
		const dy = layer.dy || 0;
		const subspriteFrameCount = layerImageWidth / subspriteWidth;
		return {
			width: targetWidth,
			height: targetHeight,
			frameWidth,
			frameCount,
			subspriteWidth,
			subspriteHeight,
			subspriteFrameCount,
			dx,
			dy
		}
	}
	export function composeProcessedLayer(layer: CompositeLayer,
	                                      targetCanvas: CanvasRenderingContext2D,
	                                      rects: LayerRects) {
		const image = layer.cachedImage;
		targetCanvas.filter = 'none';
		if (typeof layer.alpha === 'number') {
			targetCanvas.globalAlpha = layer.alpha;
		} else {
			targetCanvas.globalAlpha = 1.0;
		}

		const {frameWidth, frameCount, subspriteWidth, subspriteHeight, subspriteFrameCount, dx, dy} = rects;
		if (rects.subspriteFrameCount === frameCount && !layer.frames) {
			targetCanvas.drawImage(image, dx, dy);
		} else {
			for (let i = 0; i < frameCount; i++) {
				const imageFrameIndex = Math.min(subspriteFrameCount - 1,
					layer.frames ? layer.frames[i] : Math.floor(i * subspriteFrameCount / frameCount));
				targetCanvas.drawImage(image,
					imageFrameIndex * subspriteWidth, 0, subspriteWidth, subspriteHeight,
					dx + i * frameWidth, dy, subspriteWidth, subspriteHeight);
			}
		}
	}

	export function composeLayers(targetCanvas: CanvasRenderingContext2D,
	                              layerSpecs: CompositeLayerSpec[],
	                              frameCount: number,
	                              listener: RendererListener) {
		lastCall = [targetCanvas, layerSpecs, frameCount, listener];
		const t0 = millitime();
		// Sort layers by z-index, then array index
		const layers: CompositeLayer[] = layerSpecs
			.filter(layer =>
				layer.show !== false
				&& !(typeof layer.alpha === 'number' && layer.alpha <= 0.0)
			)
			.map((layer, i) => {
				if (isNaN(layer.z)) {
					console.error("Layer "+(layer.name||layer.src)+" has z-index NaN")
					layer.z = 0;
				}
				return [layer, i] as [CompositeLayerSpec, number];
			}) // map to pairs [element, index]
			.sort((a, b) => {
				if (a[0].z === b[0].z) return a[1] - b[1];
				else return a[0].z!! - b[0].z!!;
			})
			.map(e => e[0] as CompositeLayer); // unwrap values;
		if (listener && listener.composeLayers) listener.composeLayers(layers);

		// Tricky part.
		// We add <img> elements and hook on their onload event.
		// When image loads, we put it into layer 'image' property and kick maybeRenderResult
		// When all images are loaded, we call renderResult

		let rendered = false;
		let layersLoaded = 0;

		function renderResult() {
			rendered = true;
			targetCanvas.clearRect(0, 0, targetCanvas.canvas.width, targetCanvas.canvas.height);
			if (listener && listener.beforeRender) {
				listener.beforeRender(layers);
			}
			const targetWidth = targetCanvas.canvas.width;
			const targetHeight = targetCanvas.canvas.height;
			const t1 = millitime();
			for (const layer of layers) {
				if (layer.show === false) continue; // Could be disabled due to load error
				let name = layer.name || layer.src;
				let image = layer.image!!;
				let layerRects = calcLayerRects(layer, image.width as number, targetWidth, targetHeight, frameCount);
				let currentProcessing = encodeProcessing(layer);
				if (layer.cachedProcessing && layer.cachedImage && currentProcessing === layer.cachedProcessing) {
					if (listener && listener.layerCacheHit) {
						listener.layerCacheHit(layer);
					}
					image = layer.cachedImage;
				} else {
					if (listener && listener.layerCacheMiss) {
						listener.layerCacheMiss(layer);
					}
					image = processLayer(layer, layerRects, listener);
					layer.cachedProcessing = currentProcessing;
					layer.cachedImage = image;
				}
				composeProcessedLayer(layer, targetCanvas, layerRects);
				if (listener && listener.composition) {
					listener.composition(name, targetCanvas.canvas);
				}
			}
			if (listener && listener.renderingDone) listener.renderingDone(millitime() - t1);
		}

		function maybeRenderResult() {
			if (rendered) return;
			for (const layer of layers) {
				if (layer.show !== false && !layer.image) return;
				if (layer.masksrc && !layer.mask) return;
			}
			if (listener && listener.loadingDone) listener.loadingDone(millitime() - t0, layersLoaded);
			try {
				renderResult();
			} catch (e) {
				rendererError(listener, e);
			}
		}

		function loadLayerImage(layer: CompositeLayer) {
			ImageLoader.loadImage(
				layer.src,
				layer,
				(src,layer,image)=>{
					layersLoaded++;
					if (listener && listener.loaded) {
						listener.loaded(layer.name || 'unnamed', src);
					}
					layer.image = image;
					layer.imageSrc = src;
					ImageCaches[src] = image;
					maybeRenderResult();
				},
				(src,layer,error)=>{
					// Mark this src as erroneous to avoid blinking due to reload attempts
					ImageErrors[src] = true;
					if (listener && listener.loadError) {
						listener.loadError(layer.name || 'unnamed', src);
					} else {
						console.error('Failed to load image ' + src + (layer.name ? ' for layer ' + layer.name : ''));
					}
					layer.show = false;
					maybeRenderResult();
				}
			)
		}
		function loadLayerMask(layer: CompositeLayer) {
			ImageLoader.loadImage(
				layer.masksrc,
				layer,
				(src,layer,image)=>{
					layersLoaded++;
					if (listener && listener.loaded) {
						listener.loaded(layer.name || 'unnamed', src);
					}
					layer.mask = image;
					layer.cachedMaskSrc = src;
					ImageCaches[src] = image;
					maybeRenderResult();
				},
				(src,layer,error)=>{
					// Mark this src as erroneous to avoid blinking due to reload attempts
					ImageErrors[src] = true;
					if (listener && listener.loadError) {
						listener.loadError(layer.name || 'unnamed', src);
					} else {
						console.error('Failed to load mask ' + src + (layer.name ? ' for layer ' + layer.name : ''));
					}
					delete layer.masksrc;
					maybeRenderResult();
				}
			)
		}

		for (const layer of layers) {
			let needImage = true;
			if (layer.image) {
				if (layer.imageSrc === layer.src) {
					needImage = false;
				} else {
					// Layer was loaded in previous render, but then its src was changed - purge cache
					delete layer.image;
					delete layer.imageSrc;
				}
			}
			if (needImage) {
				if (ImageErrors[layer.src]) {
					layer.show = false;
					continue;
				} else if (layer.src in ImageCaches) {
					layer.image = ImageCaches[layer.src];
					layer.imageSrc = layer.src;
				} else {
					loadLayerImage(layer);
				}
			}
			let needMask = !!layer.masksrc;
			if (layer.mask) {
				if (layer.cachedMaskSrc === layer.masksrc) {
					needMask = false;
				} else {
					// Layer mask was loaded in previous render, but then its masksrc was changed - purge cache
					delete layer.mask;
					delete layer.cachedMaskSrc;
				}
			}
			if (needMask) {
				if (ImageErrors[layer.masksrc]) {
					delete layer.masksrc;
				} else if (layer.masksrc in ImageCaches) {
					layer.mask = ImageCaches[layer.masksrc];
					layer.cachedMaskSrc = layer.masksrc;
				} else {
					loadLayerMask(layer);
				}
			}
		}

		maybeRenderResult();
	}

	export interface AnimationInfo {
		spec: KeyframeAnimationSpec;
		/**
		 * True if any layer properties other than `frame`, are animated
		 */
		complex: boolean;
		/**
		 * Affected layers
		 */
		layers: CompositeLayerSpec[];
		name: string;
		/**
		 * id from setTimeout
		 */
		timeoutId: number;
		/**
		 * Current keyframe index
		 */
		keyframeIndex: number;
		/**
		 * Current keyframe
		 */
		keyframe: KeyframeSpec;
		/**
		 * Time of current keyframe start, milliseconds
		 */
		time: number;
	}

	export interface AnimatingCanvas {
		playing: boolean;
		time: number;
		target: CanvasRenderingContext2D;
		keyframeCaches: Dict<CanvasRenderingContext2D>;
		animations: AnimationInfo[];
		/**
		 * True during rendering a frame
		 */
		busy: boolean;

		redraw(): void;

		invalidateCaches(): void;

		start(): void;

		stop(): void;
	}

	export function invalidateLayerCaches(layers: CompositeLayer[]) {
		for (let layer of layers) {
			delete layer.image;
			delete layer.imageSrc;
			delete layer.mask;
			delete layer.cachedMaskSrc;
			delete layer.cachedImage;
			delete layer.cachedProcessing;
		}
	}

	export function animateLayersAgain() {
		return animateLayers.apply(Renderer, lastAnimateCall);
	}

	const animatingCanvases = new WeakMap<CanvasRenderingContext2D, AnimatingCanvas>();

	export let Animations: Dict<AnimationSpec> = {};
	/**
	 * Animation spec provider; default implementation is look up in Renderer.Animations by layer's `animation` property.
	 *
	 * Can be overridden to auto-generate animations, for example.
	 */
	export let AnimationProvider: (layer:CompositeLayerSpec)=>(AnimationSpec|undefined) =
			layer=>Animations[layer.animation];

	/**
	 * Animatable properties of KeyframeSpec and CompositeLayer
	 */
	export const AnimatableProps = ["alpha","show","blend","brightness","contrast","dx","dy"];
	export function animateLayers(targetCanvas: CanvasRenderingContext2D,
	                              layerSpecs: CompositeLayerSpec[],
	                              listener: RendererListener,
	                              autoStop: boolean = true): AnimatingCanvas {
		lastAnimateCall = [targetCanvas, layerSpecs, listener, autoStop];
		const keyframeCaches: Dict<CanvasRenderingContext2D> = {};

		function invalidateCaches() {
			for (let key in keyframeCaches) delete keyframeCaches[key];
		}

		let schedule: {
			[index: number]: Function[]
		} = {};
		// this mess should become a class already
		const animatingCanvas: AnimatingCanvas = {
			target: targetCanvas,
			keyframeCaches: keyframeCaches,
			animations: [],
			playing: false,
			busy: false,
			start() {
				if (this.playing) this.stop();
				this.playing = true;
				// stop previous animation on this targetCanvas, if present
				let oldAnimation = animatingCanvases.get(targetCanvas);
				if (oldAnimation != null) {
					oldAnimation.stop();
				}
				animatingCanvases.set(targetCanvas, this);
				let usedAnimations: Dict<AnimationInfo> = {};
				for (let layer of layerSpecs) {
					if (!layer.src || layer.show === false) continue;
					if (layer.animation) {
						let spec = AnimationProvider(layer);
						if (!spec) {
							console.error("Layer '" + (layer.name || layer.src) + "' animation '" + layer.animation + "' not found");
							continue;
						}
						let complex = false;
						if ('frames' in spec) {
							let frames = spec.frames, duration = spec.duration;
							spec = {
								keyframes: []
							};
							for (let i = 0; i < frames; i++) {
								spec.keyframes.push({frame: i, duration: duration});
							}
						} else {
							for (let kf of spec.keyframes) {
								for (let ap of AnimatableProps) {
									if (ap in kf) {
										complex = true;
										break;
									}
								}
								if (complex) break;
							}
						}
						let animation = usedAnimations[layer.animation];
						if (!animation) {
							animation = usedAnimations[layer.animation] = {
								name: layer.animation,
								complex: complex,
								spec: spec,
								timeoutId: 0,
								keyframeIndex: 0,
								keyframe: spec.keyframes[0],
								layers: [],
								time: 0
							};
						}
						animation.layers.push(layer);
						applyKeyframe(animation.keyframe, layer);
					} else {
						layer.frames = [0];
					}
				}
				this.animations = Object.values(usedAnimations);
				for (let animation of this.animations) {
					scheduleNextKeyframe(animation);
					if (listener && listener.keyframe) listener.keyframe(animation.name, animation.keyframeIndex, animation.keyframe);
				}
				compose().catch((e)=>{if (e) console.error(e)});
			},
			stop() {
				if (!this.playing) return;
				this.playing = false;
				animatingCanvases.delete(targetCanvas);
				for (let info of this.animations) {
					if (info.timeoutId) clearTimeout(info.timeoutId);
				}
				schedule = {};
				this.animations.splice(0);
				invalidateCaches();
				if (listener && listener.animationStop) listener.animationStop();
			},
			invalidateCaches,
			time: 0,
			redraw() {
				compose().catch((e)=>{if (e) console.error(e)});
			}
		}

		function genAnimationSpec(): string {
			let j = {};
			for (let animation of animatingCanvas.animations) {
				if (animation.complex) {
					j[animation.name] = animation.keyframeIndex;
				} else {
					j[animation.name] = animation.keyframe.frame;
				}
			}
			return JSON.stringify(j);
		}

		function scheduleNextKeyframe(animation: AnimationInfo) {
			if (animation.keyframe.duration <= 0) return;
			let t1 = animation.time + animation.keyframe.duration;
			let tasks = schedule[t1];
			if (!tasks) {
				schedule[t1] = tasks = [];
				animation.timeoutId = window.setTimeout(() => {
					try {
						delete schedule[t1];
						animatingCanvas.time = Math.max(t1, animatingCanvas.time);
						for (let task of tasks) task();
						compose().catch((e)=>{if (e) console.error(e)});
					} catch (e) {
						rendererError(listener, e);
					}
				}, animation.keyframe.duration);
			} else {
				animation.timeoutId = 0;
			}
			tasks.push(() => {
				animation.time = t1;
				nextKeyframe(animation)
			});
		}

		function applyKeyframe(keyframe: KeyframeSpec, layer: CompositeLayer) {
			layer.frames = [keyframe.frame];
			for (let ap of AnimatableProps) {
				if (ap in keyframe) layer[ap] = keyframe[ap];
			}
		}

		function nextKeyframe(animation: AnimationInfo) {
			let keyframes = animation.spec.keyframes;
			animation.keyframeIndex = (animation.keyframeIndex + 1) % keyframes.length;
			animation.keyframe = keyframes[animation.keyframeIndex];
			for (let layer of animation.layers) {
				applyKeyframe(animation.keyframe, layer);
			}
			scheduleNextKeyframe(animation);
			if (listener && listener.keyframe) listener.keyframe(animation.name, animation.keyframeIndex, animation.keyframe);
		}

		function stopCheck():boolean {
			if (autoStop && animatingCanvas.time > 0 && !(document.body.contains(targetCanvas.canvas))) {
				/* the canvas was removed from DOM. we exclude frame 0 because it might not yet be added */
				animatingCanvas.stop();
				return true;
			}
			return false;
		}
		function compose(): Promise<void> {
			if (stopCheck() || animatingCanvas.busy) {
				return Promise.reject();
			}
			animatingCanvas.busy = true;
			return new Promise((resolve,reject)=>{
				requestAnimationFrame(()=>{
					animatingCanvas.busy = false;
					try {
						doCompose0();
						resolve();
					} catch (e) {
						rendererError(listener, e);
						reject(e)
					}
				})
			})
			function doCompose0() {
				let spec = genAnimationSpec();
				let cachedCanvas = keyframeCaches[spec];
				if (cachedCanvas) {
					const t0 = millitime();
					targetCanvas.clearRect(0, 0, targetCanvas.canvas.width, targetCanvas.canvas.height);
					targetCanvas.globalAlpha = 1.0;
					targetCanvas.drawImage(cachedCanvas.canvas, 0, 0);
					if (listener && listener.keyframeRender) {
						listener.keyframeRender(spec, true, millitime() - t0);
					}
				} else {
					if (listener && listener.keyframeRender) {
						listener.keyframeRender(spec, false, 0);
					}
					const myListener = Object.assign({}, listener, {
						renderingDone(time) {
							let canvas = createCanvas(targetCanvas.canvas.width, targetCanvas.canvas.height);
							canvas.drawImage(targetCanvas.canvas, 0, 0);
							keyframeCaches[genAnimationSpec()] = canvas;
							if (listener && listener.renderingDone) listener.renderingDone.apply(listener, arguments);
						}
					})
					try {
						composeLayers(targetCanvas, layerSpecs, 1, myListener);
					} catch (e) {
						animatingCanvas.stop();
						throw e;
					}
				}
			}
		}

		animatingCanvas.start();

		return (lastAnimation = animatingCanvas)
	}

	/**
	 * Linear interpolation.
	 *
	 * f(0) = min,
	 * f(1) = max.
	 */
	export function lint(value: number, min: number, max: number, allowOverflow = false): number {
		if (!allowOverflow) value = Math.min(1, Math.max(0, value));
		return value * (max - min) + min;
	}

	export function lintArray(value: number, mins: number[], maxes: number[], allowOverflow = false): number[] {
		return mins.map((min, i) => lint(value, min, maxes[i], allowOverflow));
	}

	export function lintStaged(value: number, points: number[]): number {
		value = Math.min(1, Math.max(0, value));
		const n = points.length - 1;
		let i = (value * n) | 0;
		if (i === n) i = n - 1;
		return lint(value * n - i, points[i], points[i + 1]);
	}

	export function lintRgb(value: number, min: tinycolor.ColorInput, max: tinycolor.ColorInput): tinycolor.Instance {
		min = tinycolor(min).toRgb();
		max = tinycolor(max).toRgb();
		return tinycolor({
			r: lint(value, min.r, max.r),
			g: lint(value, min.g, max.g),
			b: lint(value, min.b, max.b)
		});
	}

	export function lintRgbStaged(value: number, points: tinycolor.ColorInput[]): tinycolor.Instance {
		value = Math.min(1, Math.max(0, value));
		const n = points.length - 1;
		let i = (value * n) | 0;
		if (i === n) i = n - 1;
		return lintRgb(value * n - i, points[i], points[i + 1]);
	}

	window.Renderer = Renderer;
	// Expose library functions needed by model evaluation, to global ns
	window.lint = Renderer.lint;
	window.lintArray = Renderer.lintArray;
	window.lintStaged = Renderer.lintStaged;
	window.lintRgb = Renderer.lintRgb;
	window.lintRgbStaged = Renderer.lintRgbStaged;
}

interface Window {
	lint(value: number, min: number, max: number, allowOverflow?: boolean): number;

	lintArray(value: number, mins: number[], maxes: number[], allowOverflow?: boolean): number[];

	lintStaged(value: number, points: number[]): number;

	lintRgb(value: number, min: tinycolor.ColorInput, max: tinycolor.ColorInput): tinycolor.Instance;

	lintRgbStaged(value: number, points: tinycolor.ColorInput[]): tinycolor.Instance;
}
