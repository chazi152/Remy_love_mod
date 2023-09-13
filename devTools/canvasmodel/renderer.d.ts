/// <reference path="model.d.ts" />
/// <reference types="tinycolor2" />
declare namespace Renderer {
    export interface LayerImageLoader {
        loadImage(src: string, layer: CompositeLayer, successCallback: (src: string, layer: CompositeLayer, image: HTMLImageElement) => any, errorCallback: (src: string, layer: CompositeLayer, error: any) => any): any;
    }
    export const DefaultImageLoader: LayerImageLoader;
    export let ImageLoader: LayerImageLoader;
    export interface RendererListener {
        error?: (error: Error, context: any) => any;
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
    /**
     * Last arguments to composeLayers
     */
    export let lastCall: any[] | undefined;
    /**
     * Last arguments to animateLayers
     */
    export let lastAnimateCall: any[] | undefined;
    /**
     * Last result of animateLayers
     */
    export let lastAnimation: AnimatingCanvas | undefined;
    /**
     * Use "pixels" of this size when generating images.
     */
    export let pixelSize: number;
    export function emptyLayerFilter(): CompositeLayerParams;
    /**
     * 0 -> "#000000", 0.5 -> "#808080", 1.0 -> "#FFFFFF"
     */
    export function gray(value: number): string;
    export function createCanvas(w: number, h: number, fill?: string): CanvasRenderingContext2D;
    export function ensureCanvas(image: CanvasImageSource): HTMLCanvasElement;
    /**
     * Free to use CanvasRenderingContext2D (to create image data, gradients, patterns)
     */
    export const globalC2D: CanvasRenderingContext2D;
    /**
     * Creates a cutout of color in shape of sourceImage
     */
    export function cutout(sourceImage: CanvasImageSource, color: string | CanvasGradient | CanvasPattern, canvas?: CanvasRenderingContext2D): CanvasRenderingContext2D;
    /**
     * Cuts out from base a shape in form of stencil.
     * Modifies and returns base.
     */
    export function cutoutFrom(base: CanvasRenderingContext2D, stencil: CanvasImageSource): CanvasRenderingContext2D;
    /**
     * Paints sourceImage over cutout of it filled with color.
     */
    export function composeOverCutout(sourceImage: CanvasImageSource, color: string | CanvasGradient | CanvasPattern, blendMode?: GlobalCompositeOperation, canvas?: CanvasRenderingContext2D): CanvasRenderingContext2D;
    /**
     * Repeatedly fill all sub-frames of canvas with same style.
     * (Makes sense with gradient and pattern fills, to keep consistents across all sub-frames)
     */
    export function fillFrames(fillStyle: string | CanvasGradient | CanvasPattern, canvas: CanvasRenderingContext2D, frameCount: number, frameWidth: number, blendMode: GlobalCompositeOperation): void;
    export let Patterns: Dict<CanvasPattern>;
    /**
     * CanvasPattern generator/provider.
     * Default implementation looks up in the Renderer.Patterns object, can be replaced to accept complex object
     * and generate custom pattern.
     */
    export let PatternProvider: (spec: string | object) => (CanvasPattern | null);
    export function createGradient(spec: BlendGradientSpec): CanvasGradient;
    /**
     * Paints sourceImage over same-sized canvas filled with pattern or gradient
     */
    export function composeOverSpecialRect(sourceImage: CanvasImageSource, fillStyle: CanvasGradient | CanvasPattern, blendMode: GlobalCompositeOperation, frameCount: number, targetCanvas?: CanvasRenderingContext2D): CanvasRenderingContext2D;
    /**
     * Paints sourceImage under same-sized canvas filled with pattern or gradient
     */
    export function composeUnderSpecialRect(sourceImage: CanvasImageSource, fillStyle: CanvasGradient | CanvasPattern, blendMode: GlobalCompositeOperation, frameCount: number, targetCanvas?: CanvasRenderingContext2D): CanvasRenderingContext2D;
    /**
     * Paints sourceImage over same-sized canvas filled with color
     */
    export function composeOverRect(sourceImage: CanvasImageSource, color: string, blendMode: GlobalCompositeOperation, targetCanvas?: CanvasRenderingContext2D): CanvasRenderingContext2D;
    /**
     * Paints over sourceImage a cutout of it filled with color.
     */
    export function composeUnderCutout(sourceImage: CanvasImageSource, color: string, blendMode?: GlobalCompositeOperation, canvas?: CanvasRenderingContext2D): CanvasRenderingContext2D;
    /**
     * Paints over sourceImage a same-sized canvas filled with color
     */
    export function composeUnderRect(sourceImage: CanvasImageSource, color: string, blendMode?: GlobalCompositeOperation, targetCanvas?: CanvasRenderingContext2D): CanvasRenderingContext2D;
    export let ImageCaches: {
        [index: string]: HTMLImageElement;
    };
    export let ImageErrors: {
        [index: string]: boolean;
    };
    /**
     * Switch between compose(Over|Under)(Rect|Cutout)
     */
    export function compose(composeOver: boolean, doCutout: boolean, sourceImage: CanvasImageSource, color: string, blendMode: GlobalCompositeOperation, targetCanvas?: CanvasRenderingContext2D): CanvasRenderingContext2D;
    /**
     * Fills properties in `target` from `source`.
     * If `overwrite` is false, only missing properties are copied.
     * In both cases, brightness is added, contrast is multiplied.
     * Returns target
     */
    export function mergeLayerData(target: CompositeLayerSpec, source: CompositeLayerParams, overwrite?: boolean): CompositeLayerSpec;
    export function encodeProcessing(spec: CompositeLayerSpec): string;
    export function composeLayersAgain(): void;
    export function desaturateImage(image: CanvasImageSource, resultCanvas?: CanvasRenderingContext2D, doCutout?: boolean): HTMLCanvasElement;
    export function filterImage(image: CanvasImageSource, filter: string, resultCanvas?: CanvasRenderingContext2D): HTMLCanvasElement;
    export function adjustGradientBrightness(image: CanvasImageSource, frameCount: number, brightness: AdjustmentGradientSpec, resultCanvas?: CanvasRenderingContext2D): HTMLCanvasElement;
    export function adjustBrightness(image: CanvasImageSource, brightness: number, resultCanvas?: CanvasRenderingContext2D, doCutout?: boolean): HTMLCanvasElement;
    export function adjustLevels(image: CanvasImageSource, 
    /**
     * scale factor, 1 - no change, >1 - higher contrast, <1 - lower contrast.
     */
    factor: number, 
    /**
     * shift, 0 - no change, >0 - brighter, <0 - darker
     */
    shift: number, resultCanvas?: CanvasRenderingContext2D): HTMLCanvasElement;
    export function adjustContrast(image: CanvasImageSource, factor: number, resultCanvas?: CanvasRenderingContext2D): HTMLCanvasElement;
    export function adjustBrightnessAndContrast(image: CanvasImageSource, brightness: number, contrast: number, resultCanvas?: CanvasRenderingContext2D): HTMLCanvasElement;
    export interface RenderPipelineContext {
        layer: CompositeLayer;
        /**
         * Updates along the pipeline
         */
        image: CanvasImageSource;
        listener: RendererListener;
        rects: LayerRects;
        needsCutout: boolean;
        [index: string]: any;
    }
    /**
     * Abstraction of layer processing steps.
     * All steps are stored in RenderingPipeline array, and can be changed externally
     */
    export interface RenderingStep {
        name: string;
        /**
         * Return true if this step has to be performed
         */
        condition(layer: CompositeLayer, context: RenderPipelineContext): boolean;
        /**
         * Rendering function, returns resulting image.
         */
        render(image: CanvasImageSource, layer: CompositeLayer, context: RenderPipelineContext): HTMLCanvasElement;
    }
    /**
     * Rendering steps used. Order matters!
     */
    export const RenderingPipeline: RenderingStep[];
    export function processLayer(layer: CompositeLayer, rects: LayerRects, listener: RendererListener): CanvasImageSource;
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
    export function composeProcessedLayer(layer: CompositeLayer, targetCanvas: CanvasRenderingContext2D, rects: LayerRects): void;
    export function composeLayers(targetCanvas: CanvasRenderingContext2D, layerSpecs: CompositeLayerSpec[], frameCount: number, listener: RendererListener): void;
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
    export function invalidateLayerCaches(layers: CompositeLayer[]): void;
    export function animateLayersAgain(): any;
    export let Animations: Dict<AnimationSpec>;
    /**
     * Animation spec provider; default implementation is look up in Renderer.Animations by layer's `animation` property.
     *
     * Can be overridden to auto-generate animations, for example.
     */
    export let AnimationProvider: (layer: CompositeLayerSpec) => (AnimationSpec | undefined);
    /**
     * Animatable properties of KeyframeSpec and CompositeLayer
     */
    export const AnimatableProps: string[];
    export function animateLayers(targetCanvas: CanvasRenderingContext2D, layerSpecs: CompositeLayerSpec[], listener: RendererListener, autoStop?: boolean): AnimatingCanvas;
    /**
     * Linear interpolation.
     *
     * f(0) = min,
     * f(1) = max.
     */
    export function lint(value: number, min: number, max: number, allowOverflow?: boolean): number;
    export function lintArray(value: number, mins: number[], maxes: number[], allowOverflow?: boolean): number[];
    export function lintStaged(value: number, points: number[]): number;
    export function lintRgb(value: number, min: tinycolor.ColorInput, max: tinycolor.ColorInput): tinycolor.Instance;
    export function lintRgbStaged(value: number, points: tinycolor.ColorInput[]): tinycolor.Instance;
    export {};
}
interface Window {
    lint(value: number, min: number, max: number, allowOverflow?: boolean): number;
    lintArray(value: number, mins: number[], maxes: number[], allowOverflow?: boolean): number[];
    lintStaged(value: number, points: number[]): number;
    lintRgb(value: number, min: tinycolor.ColorInput, max: tinycolor.ColorInput): tinycolor.Instance;
    lintRgbStaged(value: number, points: tinycolor.ColorInput[]): tinycolor.Instance;
}
