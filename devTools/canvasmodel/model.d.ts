declare interface AnyDict {
	[index: string]: any;
}
declare interface Dict<T> {
	[index: string]: T;
}

type GradientType = 'linear' | 'radial';
declare interface BlendGradientSpec {
	gradient: GradientType;
	/**
	 * * For linear gradient: [x0, y0, x1, y1].
	 * * For radial gradient: [x0, y0, r0, x1, y1, r1].
	 */
	values: number[];
	/**
	 * Color stops.
	 * Pairs of `[offset, color]` or `[color]`.
	 * Default offsets are for evenly spaced gradient
	 */
	colors: ([number, string] | string)[];
}

/**
 * For applying brightness, contrast and other 'scalar' adjustment gradients
 */
declare interface AdjustmentGradientSpec {
	gradient: GradientType,
	values: number[],
	adjustments: ([number, number] | number)[];
}

declare interface BlendPatternSpec {
	/**
	 * Pattern identifier or a specification, sent to pattern provider to get an actual image
	 */
	pattern: string | object;
}
declare type BlendSpec = string | BlendGradientSpec | BlendPatternSpec;

declare interface CompositeLayerParams {
	/**
	 * Render the layer. Default true, only exact `false` value disables rendering
	 */
	show?: boolean;
	/**
	 * Z-index, bigger is above, default 0
	 */
	z?: number;
	/**
	 * Blend color/gradient/pattern. For color, CSS color string.
	 */
	blend?: BlendSpec;
	/**
	 * Blend mode.
	 */
	blendMode?: GlobalCompositeOperation;
	/**
	 * Desaturate the image before processing.
	 */
	desaturate?: boolean;
	/**
	 * Adjust brightness before processing. -1..+1, 0 is don't change
	 */
	brightness?: number | AdjustmentGradientSpec;
	/**
	 * Adjust contrast before processing. >=0, 1 is don't change
	 */
	contrast?: number;
	/**
	 * Mask, a stencil image to cut out and display only select parts of this layer.
	 */
	masksrc?: string;
	/**
	 * Alpha, 0-1. Default 1
	 */
	alpha?: number;
	/**
	 * Canvas CSS filter. Default "none". Not recommended to use (experimental feature, low support in browsers)
	 */
	prefilter?: string;
	/**
	 * For CSS-animated canvases:
	 * Override animation frames generation, array of animation frame index to subsprite index.
	 * Ex. defaults for 4-sprite 4-frame are [0, 1, 2, 3], for 2-sprite 4-frame are [0, 0, 1, 1].
	 *
	 * For animated canvases: one-element array of current subsprite index
	 */
	frames?: number[];
	/**
	 * Subsprite size
	 */
	width?: number;
	height?: number;
	/**
	 * Subsprite position on target canvas
	 */
	dx?: number;
	dy?: number;
	/**
	 * Animation name
	 */
	animation?: string;
}
declare interface CompositeLayerSpec extends CompositeLayerParams {
	name?: string;
	/**
	 * Image URL
	 */
	src: string;
}

declare interface KeyframeSpec {
	/**
	 * Index of frame (=subsprite) to display, base 0
	 */
	frame: number;
	/**
	 * Duration of this keyframe, milliseconds (= delay before next keyframe)
	 */
	duration: number;

	// Animating layer properties
	blend?: BlendSpec;
	show?: boolean;
	brightness?: number;
	contrast?: number;
	alpha?: number;
	dx?: number;
	dy?: number;
}

declare type AnimationSpec = KeyframeAnimationSpec | SimpleAnimationSpec;
declare interface KeyframeAnimationSpec {
	keyframes: KeyframeSpec[];
}
declare interface SimpleAnimationSpec {
	frames: number;
	/**
	 * Duration of *every* keyframe
	 */
	duration: number;
}

declare interface CompositeLayer extends CompositeLayerSpec {
	/**
	 * `src` of cached `image` (if `src` changes, `image` will be reloaded)
	 */
	imageSrc?: string;
	/**
	 * Cached image to render
	 */
	image?: CanvasImageSource;
	/**
	 * Loaded/cached mask image
	 */
	mask?: CanvasImageSource;
	/**
	 * Value of `masksrc` corresponding to current `mask` (if masksrc changes mask will be reloaded)
	 */
	cachedMaskSrc?: string;
	/**
	 * Encoded processing options used to display cachedImage
	 */
	cachedProcessing?: string;
	/**
	 * Last displayed composed image
	 */
	cachedImage?: CanvasImageSource;
}
