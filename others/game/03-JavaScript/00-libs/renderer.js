///<reference path="model.d.ts"/>
/*
 * Created by aimozg on 29.08.2020.
 */
var Renderer;
(function (Renderer) {
    const millitime = (typeof performance === 'object' && typeof performance.now === 'function') ?
        function () {
            return performance.now();
        } : function () {
            return new Date().getTime();
        };
    Renderer.DefaultImageLoader = {
        loadImage(src, layer, successCallback, errorCallback) {
            const image = new Image();
            image.onload = () => {
                successCallback(src, layer, image);
            };
            image.onerror = (event) => {
                errorCallback(src, layer, event);
            };
            image.src = src;
        }
    };
    Renderer.ImageLoader = Renderer.DefaultImageLoader;
    function rendererError(listener, error, context) {
        if (listener && listener.error) {
            listener.error(error, context);
        }
        else {
            console.error(error);
        }
    }
    /**
     * Last arguments to composeLayers
     */
    Renderer.lastCall = undefined;
    /**
     * Last arguments to animateLayers
     */
    Renderer.lastAnimateCall = undefined;
    /**
     * Last result of animateLayers
     */
    Renderer.lastAnimation = undefined;
    /**
     * Use "pixels" of this size when generating images.
     */
    Renderer.pixelSize = 1;
    function emptyLayerFilter() {
        return {
            desaturate: false,
            blend: "",
            blendMode: "source-over",
            brightness: 0.0,
            contrast: 1.0
        };
    }
    Renderer.emptyLayerFilter = emptyLayerFilter;
    /**
     * 0 -> "#000000", 0.5 -> "#808080", 1.0 -> "#FFFFFF"
     */
    function gray(value) {
        value = Math.min(1, Math.max(0, value));
        value = Math.round(value * 255);
        let s = value.toString(16);
        if (value < 16)
            s = '0' + s;
        return '#' + s + s + s;
    }
    Renderer.gray = gray;
    function createCanvas(w, h, fill) {
        let c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        let c2d = c.getContext('2d');
        if (fill) {
            c2d.fillStyle = fill;
            c2d.fillRect(0, 0, w, h);
        }
        return c2d;
    }
    Renderer.createCanvas = createCanvas;
    function ensureCanvas(image) {
        if (image instanceof HTMLCanvasElement) {
            return image;
        }
        let i2 = createCanvas(image.width, image.height);
        i2.drawImage(image, 0, 0);
        return i2.canvas;
    }
    Renderer.ensureCanvas = ensureCanvas;
    /**
     * Free to use CanvasRenderingContext2D (to create image data, gradients, patterns)
     */
    Renderer.globalC2D = createCanvas(1, 1);
    /**
     * Creates a cutout of color in shape of sourceImage
     */
    function cutout(sourceImage, color, canvas = createCanvas(sourceImage.width, sourceImage.height)) {
        let sw = sourceImage.width;
        let sh = sourceImage.height;
        canvas.clearRect(0, 0, sw, sh);
        // Fill with target color
        canvas.globalCompositeOperation = 'source-over';
        canvas.fillStyle = color;
        canvas.fillRect(0, 0, sw, sh);
        return cutoutFrom(canvas, sourceImage);
    }
    Renderer.cutout = cutout;
    /**
     * Cuts out from base a shape in form of stencil.
     * Modifies and returns base.
     */
    function cutoutFrom(base, stencil) {
        base.globalCompositeOperation = 'destination-in';
        base.drawImage(stencil, 0, 0);
        return base;
    }
    Renderer.cutoutFrom = cutoutFrom;
    /**
     * Paints sourceImage over cutout of it filled with color.
     */
    function composeOverCutout(sourceImage, color, blendMode = 'multiply', canvas = createCanvas(sourceImage.width, sourceImage.height)) {
        canvas = cutout(sourceImage, color, canvas);
        // Multiply cutout with original
        canvas.globalCompositeOperation = blendMode;
        canvas.drawImage(sourceImage, 0, 0);
        return canvas;
    }
    Renderer.composeOverCutout = composeOverCutout;
    /**
     * Repeatedly fill all sub-frames of canvas with same style.
     * (Makes sense with gradient and pattern fills, to keep consistents across all sub-frames)
     */
    function fillFrames(fillStyle, canvas, frameCount, frameWidth, blendMode) {
        const frameHeight = canvas.canvas.height;
        canvas.globalCompositeOperation = blendMode;
        canvas.fillStyle = fillStyle;
        canvas.fillRect(0, 0, frameWidth, frameHeight);
        if (Renderer.pixelSize > 1) {
            // downscale, redraw on temp canvas, then draw again
            const tw = Math.floor(frameWidth / Renderer.pixelSize), th = Math.floor(frameHeight / Renderer.pixelSize);
            const tmpcanvas = createCanvas(tw, th);
            tmpcanvas.imageSmoothingEnabled = false;
            canvas.imageSmoothingEnabled = false;
            tmpcanvas.drawImage(canvas.canvas, 0, 0, frameWidth, frameHeight, 0, 0, tw, th);
            canvas.drawImage(tmpcanvas.canvas, 0, 0, tw, th, 0, 0, frameWidth, frameHeight);
        }
        for (let i = 1; i < frameCount; i++) {
            canvas.drawImage(canvas.canvas, 0, 0, frameWidth, frameHeight, i * frameWidth, 0, frameWidth, frameHeight);
        }
    }
    Renderer.fillFrames = fillFrames;
    Renderer.Patterns = {};
    /**
     * CanvasPattern generator/provider.
     * Default implementation looks up in the Renderer.Patterns object, can be replaced to accept complex object
     * and generate custom pattern.
     */
    Renderer.PatternProvider = (spec) => {
        if (typeof spec === 'string' && spec in Renderer.Patterns)
            return Renderer.Patterns[spec];
        return null;
    };
    function createGradient(spec) {
        let gradient;
        switch (spec.gradient) {
            case "linear":
                gradient = Renderer.globalC2D.createLinearGradient(spec.values[0], spec.values[1], spec.values[2], spec.values[3]);
                break;
            case "radial":
                gradient = Renderer.globalC2D.createRadialGradient(spec.values[0], spec.values[1], spec.values[2], spec.values[3], spec.values[4], spec.values[5]);
                break;
            default:
                throw new Error("Invalid gradient type: " + spec.gradient);
        }
        if (spec.colors.length < 2)
            throw new Error("Invalid gradient stops: " + JSON.stringify(spec.colors));
        for (let i = 0; i < spec.colors.length; i++) {
            let stop = spec.colors[i];
            let offset, color;
            if (typeof stop === 'string') {
                color = stop;
                offset = i / (spec.colors.length - 1);
            }
            else {
                offset = stop[0];
                color = stop[1];
            }
            gradient.addColorStop(offset, color);
        }
        return gradient;
    }
    Renderer.createGradient = createGradient;
    /**
     * Paints sourceImage over same-sized canvas filled with pattern or gradient
     */
    function composeOverSpecialRect(sourceImage, fillStyle, blendMode, frameCount, targetCanvas = createCanvas(sourceImage.width, sourceImage.height)) {
        let fw = sourceImage.width / frameCount;
        fillFrames(fillStyle, targetCanvas, frameCount, fw, 'source-over');
        targetCanvas.globalCompositeOperation = blendMode;
        targetCanvas.drawImage(sourceImage, 0, 0);
        return targetCanvas;
    }
    Renderer.composeOverSpecialRect = composeOverSpecialRect;
    /**
     * Paints sourceImage under same-sized canvas filled with pattern or gradient
     */
    function composeUnderSpecialRect(sourceImage, fillStyle, blendMode, frameCount, targetCanvas = createCanvas(sourceImage.width, sourceImage.height)) {
        let fw = sourceImage.width / frameCount;
        const fill = createCanvas(sourceImage.width, sourceImage.height);
        fillFrames(fillStyle, fill, frameCount, fw, 'source-over');
        targetCanvas.globalCompositeOperation = 'source-over';
        targetCanvas.drawImage(sourceImage, 0, 0);
        targetCanvas.globalCompositeOperation = blendMode;
        targetCanvas.drawImage(fill.canvas, 0, 0);
        return targetCanvas;
    }
    Renderer.composeUnderSpecialRect = composeUnderSpecialRect;
    /**
     * Paints sourceImage over same-sized canvas filled with color
     */
    function composeOverRect(sourceImage, color, blendMode, targetCanvas = createCanvas(sourceImage.width, sourceImage.height)) {
        // Fill with target color
        targetCanvas.globalCompositeOperation = 'source-over';
        targetCanvas.fillStyle = color;
        targetCanvas.fillRect(0, 0, sourceImage.width, sourceImage.height);
        targetCanvas.globalCompositeOperation = blendMode;
        targetCanvas.drawImage(sourceImage, 0, 0);
        return targetCanvas;
    }
    Renderer.composeOverRect = composeOverRect;
    /**
     * Paints over sourceImage a cutout of it filled with color.
     */
    function composeUnderCutout(sourceImage, color, blendMode = 'multiply', canvas = createCanvas(sourceImage.width, sourceImage.height)) {
        const cut = cutout(sourceImage, color);
        // Create a copy of sourceImage
        canvas.globalCompositeOperation = 'source-over';
        canvas.drawImage(sourceImage, 0, 0);
        // Multiply with cutout
        canvas.globalCompositeOperation = blendMode;
        canvas.drawImage(cut.canvas, 0, 0);
        return canvas;
    }
    Renderer.composeUnderCutout = composeUnderCutout;
    /**
     * Paints over sourceImage a same-sized canvas filled with color
     */
    function composeUnderRect(sourceImage, color, blendMode = 'multiply', targetCanvas = createCanvas(sourceImage.width, sourceImage.height)) {
        let fill = createCanvas(sourceImage.width, sourceImage.height, color);
        targetCanvas.globalCompositeOperation = 'source-over';
        targetCanvas.drawImage(sourceImage, 0, 0);
        targetCanvas.globalCompositeOperation = blendMode;
        targetCanvas.drawImage(fill.canvas, 0, 0);
        return targetCanvas;
    }
    Renderer.composeUnderRect = composeUnderRect;
    Renderer.ImageCaches = {};
    Renderer.ImageErrors = {};
    /**
     * Switch between compose(Over|Under)(Rect|Cutout)
     */
    function compose(composeOver, doCutout, sourceImage, color, blendMode, targetCanvas = createCanvas(sourceImage.width, sourceImage.height)) {
        if (doCutout) {
            if (composeOver) {
                return composeOverCutout(sourceImage, color, blendMode, targetCanvas);
            }
            else {
                return composeUnderCutout(sourceImage, color, blendMode, targetCanvas);
            }
        }
        else {
            if (composeOver) {
                return composeOverRect(sourceImage, color, blendMode, targetCanvas);
            }
            else {
                return composeUnderRect(sourceImage, color, blendMode, targetCanvas);
            }
        }
    }
    Renderer.compose = compose;
    /**
     * Fills properties in `target` from `source`.
     * If `overwrite` is false, only missing properties are copied.
     * In both cases, brightness is added, contrast is multiplied.
     * Returns target
     */
    function mergeLayerData(target, source, overwrite = false) {
        for (let k of Object.keys(source)) {
            if (k === 'brightness' && 'brightness' in target) {
                if (typeof target.brightness === 'object' && typeof source.brightness === 'number') {
                    for (const [adjustmentIndex, adjustment] of target.brightness.adjustments.entries()) {
                        if (typeof adjustment === 'number') {
                            target.brightness.adjustments[adjustmentIndex] += source.brightness;
                        }
                        else {
                            target.brightness.adjustments[adjustmentIndex][1] += source.brightness;
                        }
                    }
                }
                else if (typeof target.brightness === 'number' && typeof source.brightness === 'object') {
                    const brightnessToAdd = target.brightness;
                    target.brightness = Object.assign({}, source.brightness);
                    for (const [adjustmentIndex, adjustment] of target.brightness.adjustments.entries()) {
                        if (typeof adjustment === 'number') {
                            target.brightness.adjustments[adjustmentIndex] += brightnessToAdd;
                        }
                        else {
                            target.brightness.adjustments[adjustmentIndex][1] += brightnessToAdd;
                        }
                    }
                }
                else if (typeof target.brightness === 'number' && typeof source.brightness === 'number') {
                    target.brightness += source.brightness;
                }
                else {
                    throw new Error("Not implemented: cannot merge two gradient brightnesses.");
                }
            }
            else if (k === 'contrast' && 'contrast' in target) {
                target.contrast *= source.contrast;
            }
            else if (overwrite || !(k in target)) {
                target[k] = source[k];
            }
        }
        return target;
    }
    Renderer.mergeLayerData = mergeLayerData;
    function encodeProcessing(spec) {
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
    Renderer.encodeProcessing = encodeProcessing;
    function composeLayersAgain() {
        composeLayers.apply(Renderer, Renderer.lastCall);
    }
    Renderer.composeLayersAgain = composeLayersAgain;
    function desaturateImage(image, resultCanvas, doCutout = true) {
        return compose(false, doCutout, image, '#000000', 'saturation', resultCanvas).canvas;
    }
    Renderer.desaturateImage = desaturateImage;
    function filterImage(image, filter, resultCanvas) {
        if (!resultCanvas) {
            resultCanvas = createCanvas(image.width, image.height);
        }
        resultCanvas.filter = filter;
        resultCanvas.globalCompositeOperation = 'source-over';
        resultCanvas.drawImage(image, 0, 0);
        resultCanvas.filter = '';
        return resultCanvas.canvas;
    }
    Renderer.filterImage = filterImage;
    function adjustGradientBrightness(image, frameCount, brightness, resultCanvas) {
        if (brightness.adjustments.length !== 2) {
            throw new Error("Not Implemented: Brightness gradients can have only exactly 2 stops.");
        }
        const gradientInitializations = [];
        for (const [i, adjustment] of brightness.adjustments.entries()) {
            let brightnessValue;
            let offsetValue;
            // [color |[offset, color]]
            if (typeof adjustment === 'number') {
                brightnessValue = adjustment;
                offsetValue = i;
            }
            else {
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
                });
            }
            else {
                gradientInitializations.push({
                    grey: gray(1 + brightnessValue),
                    neutral: "#FFFFFF",
                    offset: offsetValue,
                    blendMode: 'multiply',
                });
            }
        }
        // we needmultiple gradients if we are darkening and lightening at the same time
        if (gradientInitializations[0].blendMode != gradientInitializations[1].blendMode) {
            const gradients = [];
            for (const [i, gradientInit] of gradientInitializations.entries()) {
                gradients.push(createGradient(Object.assign(Object.assign({}, brightness), {
                    colors: [
                        [gradientInitializations[0].offset, i === 0 ? gradientInit.grey : gradientInit.neutral],
                        [gradientInitializations[1].offset, i === 0 ? gradientInit.neutral : gradientInit.grey]
                    ]
                })));
            }
            const firstGradientApplied = composeUnderSpecialRect(image, gradients[0], gradientInitializations[0].blendMode, frameCount);
            const secondGradientApplied = composeUnderSpecialRect(firstGradientApplied.canvas, gradients[1], gradientInitializations[1].blendMode, frameCount, resultCanvas);
            return secondGradientApplied.canvas;
        }
        else {
            const brightnessGradient = createGradient(Object.assign(Object.assign({}, brightness), {
                colors: [
                    [gradientInitializations[0].offset, gradientInitializations[0].grey],
                    [gradientInitializations[1].offset, gradientInitializations[1].grey]
                ]
            }));
            return composeUnderSpecialRect(image, brightnessGradient, gradientInitializations[0].blendMode, frameCount, resultCanvas).canvas;
        }
    }
    Renderer.adjustGradientBrightness = adjustGradientBrightness;
    function adjustBrightness(image, brightness, resultCanvas, doCutout = true) {
        if (brightness > 0) {
            const value = gray(brightness);
            // color-dodge by X% gray adjusts levels 0%-(100-X)% to 0%-100%
            return compose(false, doCutout, image, value, 'color-dodge', resultCanvas).canvas;
            // Other option:
            // screen by X% gray adjust levels 0%-100% to X%-100%
            // return composeUnderCutout(image, value, 'screen').canvas;
        }
        else {
            // multiply by X% gray adjusts levels 0%-100% to 0%-X%
            const value = gray(1 + brightness);
            return compose(false, doCutout, image, value, 'multiply', resultCanvas).canvas;
            // Other option:
            // color-burn by X% gray adjusts levels (100-X)%-100% to 0%-100%
        }
    }
    Renderer.adjustBrightness = adjustBrightness;
    function adjustLevels(image,
        /**
         * scale factor, 1 - no change, >1 - higher contrast, <1 - lower contrast.
         */
        factor,
        /**
         * shift, 0 - no change, >0 - brighter, <0 - darker
         */
        shift, resultCanvas) {
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
        }
        else {
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
            const x = factor / (1 - shift);
            const y = shift;
            const c1 = compose(false, false, image, gray(x), 'multiply');
            const c2 = compose(false, false, c1.canvas, gray(y), 'screen');
            return c2.canvas;
        }
    }
    Renderer.adjustLevels = adjustLevels;
    function adjustContrast(image, factor, resultCanvas) {
        /*
         contrast is scale by F with origin at 0.5
        */
        const shift = 0.5 * (1 - factor);
        return adjustLevels(image, factor, shift, resultCanvas);
    }
    Renderer.adjustContrast = adjustContrast;
    function adjustBrightnessAndContrast(image, brightness, contrast, resultCanvas) {
        // = adjustContrast (color + brightness, contrast)
        const shift = brightness * contrast + 0.5 * (1 - contrast);
        return adjustLevels(image, contrast, shift, resultCanvas);
    }
    Renderer.adjustBrightnessAndContrast = adjustBrightnessAndContrast;
    const RenderingStepDesaturate = {
        name: "desaturate",
        condition(layer, context) {
            return layer.desaturate;
        },
        render(image, layer, context) {
            context.needsCutout = true;
            return desaturateImage(image, undefined, false);
        }
    };
    const RenderingStepPrefilter = {
        name: "prefilter",
        condition(layer, context) {
            return layer.prefilter && layer.prefilter !== "none";
        },
        render(image, layer, context) {
            return filterImage(image, layer.prefilter);
        }
    };
    const RenderingStepBrightness = {
        name: "brightness",
        condition(layer, context) {
            return typeof layer.brightness === 'number' && layer.brightness !== 0;
        },
        render(image, layer, context) {
            context.needsCutout = true;
            return adjustBrightness(image, layer.brightness, undefined, false);
        }
    };
    const RenderingStepBrightnessGradient = {
        name: "brightness:gradient",
        condition(layer, context) {
            return layer.brightness && typeof layer.brightness === 'object' && 'gradient' in layer.brightness;
        },
        render(image, layer, context) {
            context.needsCutout = true;
            return adjustGradientBrightness(image, context.rects.subspriteFrameCount, layer.brightness, undefined);
        }
    };
    const RenderingStepContrast = {
        name: "contrast",
        condition(layer, context) {
            return typeof layer.contrast === 'number' && layer.contrast !== 1;
        },
        render(image, layer, context) {
            context.needsCutout = true;
            return adjustContrast(image, layer.contrast, undefined);
        }
    };
    const RenderingStepBlendColor = {
        name: "blend:color",
        condition(layer, context) {
            return layer.blendMode && layer.blend && typeof layer.blend === "string";
        },
        render(image, layer, context) {
            context.needsCutout = true;
            return composeOverRect(image, layer.blend, layer.blendMode).canvas;
        }
    };
    const RenderingStepBlendGradient = {
        name: "blend:gradient",
        condition(layer, context) {
            return layer.blendMode && layer.blend && typeof layer.blend === 'object' && 'gradient' in layer.blend;
        },
        render(image, layer, context) {
            context.needsCutout = true;
            let gradient = createGradient(layer.blend);
            return composeOverSpecialRect(image, gradient, layer.blendMode, context.rects.subspriteFrameCount).canvas;
        }
    };
    const RenderingStepBlendPattern = {
        name: "blend:pattern",
        condition(layer, context) {
            return layer.blendMode && layer.blend && typeof layer.blend === 'object' && 'pattern' in layer.blend;
        },
        render(image, layer, context) {
            context.needsCutout = true;
            let pattern = Renderer.PatternProvider(layer.blend.pattern);
            if (!pattern) {
                return ensureCanvas(image);
            }
            return composeOverSpecialRect(image, pattern, layer.blendMode, context.rects.subspriteFrameCount).canvas;
        }
    };
    const RenderingStepMask = {
        name: "mask",
        condition(layer, context) {
            return !!layer.mask;
        },
        render(image, layer, context) {
            return cutoutFrom(ensureCanvas(image).getContext('2d'), layer.mask).canvas;
        }
    };
    const RenderingStepCutout = {
        name: "cutout",
        condition(layer, context) {
            return context.needsCutout;
        },
        render(image, layer, context) {
            return cutoutFrom(ensureCanvas(image).getContext('2d'), layer.image).canvas;
        }
    };
    /**
     * Rendering steps used. Order matters!
     */
    Renderer.RenderingPipeline = [
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
    ];
    function processLayer(layer, rects, listener) {
        let context = {
            layer: layer,
            image: layer.image,
            needsCutout: false,
            rects: rects,
            listener: listener
        };
        for (let step of Renderer.RenderingPipeline) {
            if (!step.condition(context.layer, context))
                continue;
            let t0 = millitime();
            let listener = context.listener;
            context.image = step.render(context.image, context.layer, context);
            if (listener && listener.processingStep) {
                listener.processingStep(context.layer.name, step.name, context.image, millitime() - t0);
            }
        }
        return context.image;
    }
    Renderer.processLayer = processLayer;
    function calcLayerRects(layer, layerImageWidth, targetWidth, targetHeight, frameCount) {
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
        };
    }
    function composeProcessedLayer(layer, targetCanvas, rects) {
        const image = layer.cachedImage;
        targetCanvas.filter = 'none';
        if (typeof layer.alpha === 'number') {
            targetCanvas.globalAlpha = layer.alpha;
        }
        else {
            targetCanvas.globalAlpha = 1.0;
        }
        const { frameWidth, frameCount, subspriteWidth, subspriteHeight, subspriteFrameCount, dx, dy } = rects;
        if (rects.subspriteFrameCount === frameCount && !layer.frames) {
            targetCanvas.drawImage(image, dx, dy);
        }
        else {
            for (let i = 0; i < frameCount; i++) {
                const imageFrameIndex = Math.min(subspriteFrameCount - 1, layer.frames ? layer.frames[i] : Math.floor(i * subspriteFrameCount / frameCount));
                targetCanvas.drawImage(image, imageFrameIndex * subspriteWidth, 0, subspriteWidth, subspriteHeight, dx + i * frameWidth, dy, subspriteWidth, subspriteHeight);
            }
        }
    }
    Renderer.composeProcessedLayer = composeProcessedLayer;
    function composeLayers(targetCanvas, layerSpecs, frameCount, listener) {
        Renderer.lastCall = [targetCanvas, layerSpecs, frameCount, listener];
        const t0 = millitime();
        // Sort layers by z-index, then array index
        const layers = layerSpecs
            .filter(layer => layer.show !== false
                && !(typeof layer.alpha === 'number' && layer.alpha <= 0.0))
            .map((layer, i) => {
                if (isNaN(layer.z)) {
                    console.error("Layer " + (layer.name || layer.src) + " has z-index NaN");
                    layer.z = 0;
                }
                return [layer, i];
            }) // map to pairs [element, index]
            .sort((a, b) => {
                if (a[0].z === b[0].z)
                    return a[1] - b[1];
                else
                    return a[0].z - b[0].z;
            })
            .map(e => e[0]); // unwrap values;
        if (listener && listener.composeLayers)
            listener.composeLayers(layers);
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
                if (layer.show === false)
                    continue; // Could be disabled due to load error
                let name = layer.name || layer.src;
                let image = layer.image;
                let layerRects = calcLayerRects(layer, image.width, targetWidth, targetHeight, frameCount);
                let currentProcessing = encodeProcessing(layer);
                if (layer.cachedProcessing && layer.cachedImage && currentProcessing === layer.cachedProcessing) {
                    if (listener && listener.layerCacheHit) {
                        listener.layerCacheHit(layer);
                    }
                    image = layer.cachedImage;
                }
                else {
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
            if (listener && listener.renderingDone)
                listener.renderingDone(millitime() - t1);
        }
        function maybeRenderResult() {
            if (rendered)
                return;
            for (const layer of layers) {
                if (layer.show !== false && !layer.image)
                    return;
                if (layer.masksrc && !layer.mask)
                    return;
            }
            if (listener && listener.loadingDone)
                listener.loadingDone(millitime() - t0, layersLoaded);
            try {
                renderResult();
            }
            catch (e) {
                rendererError(listener, e);
            }
        }
        function loadLayerImage(layer) {
            Renderer.ImageLoader.loadImage(layer.src, layer, (src, layer, image) => {
                layersLoaded++;
                if (listener && listener.loaded) {
                    listener.loaded(layer.name || 'unnamed', src);
                }
                layer.image = image;
                layer.imageSrc = src;
                Renderer.ImageCaches[src] = image;
                maybeRenderResult();
            }, (src, layer, error) => {
                // Mark this src as erroneous to avoid blinking due to reload attempts
                Renderer.ImageErrors[src] = true;
                if (listener && listener.loadError) {
                    listener.loadError(layer.name || 'unnamed', src);
                }
                else {
                    console.error('Failed to load image ' + src + (layer.name ? ' for layer ' + layer.name : ''));
                }
                layer.show = false;
                maybeRenderResult();
            });
        }
        function loadLayerMask(layer) {
            Renderer.ImageLoader.loadImage(layer.masksrc, layer, (src, layer, image) => {
                layersLoaded++;
                if (listener && listener.loaded) {
                    listener.loaded(layer.name || 'unnamed', src);
                }
                layer.mask = image;
                layer.cachedMaskSrc = src;
                Renderer.ImageCaches[src] = image;
                maybeRenderResult();
            }, (src, layer, error) => {
                // Mark this src as erroneous to avoid blinking due to reload attempts
                Renderer.ImageErrors[src] = true;
                if (listener && listener.loadError) {
                    listener.loadError(layer.name || 'unnamed', src);
                }
                else {
                    console.error('Failed to load mask ' + src + (layer.name ? ' for layer ' + layer.name : ''));
                }
                delete layer.masksrc;
                maybeRenderResult();
            });
        }
        for (const layer of layers) {
            let needImage = true;
            if (layer.image) {
                if (layer.imageSrc === layer.src) {
                    needImage = false;
                }
                else {
                    // Layer was loaded in previous render, but then its src was changed - purge cache
                    delete layer.image;
                    delete layer.imageSrc;
                }
            }
            if (needImage) {
                if (Renderer.ImageErrors[layer.src]) {
                    layer.show = false;
                    continue;
                }
                else if (layer.src in Renderer.ImageCaches) {
                    layer.image = Renderer.ImageCaches[layer.src];
                    layer.imageSrc = layer.src;
                }
                else {
                    loadLayerImage(layer);
                }
            }
            let needMask = !!layer.masksrc;
            if (layer.mask) {
                if (layer.cachedMaskSrc === layer.masksrc) {
                    needMask = false;
                }
                else {
                    // Layer mask was loaded in previous render, but then its masksrc was changed - purge cache
                    delete layer.mask;
                    delete layer.cachedMaskSrc;
                }
            }
            if (needMask) {
                if (Renderer.ImageErrors[layer.masksrc]) {
                    delete layer.masksrc;
                }
                else if (layer.masksrc in Renderer.ImageCaches) {
                    layer.mask = Renderer.ImageCaches[layer.masksrc];
                    layer.cachedMaskSrc = layer.masksrc;
                }
                else {
                    loadLayerMask(layer);
                }
            }
        }
        maybeRenderResult();
    }
    Renderer.composeLayers = composeLayers;
    function invalidateLayerCaches(layers) {
        for (let layer of layers) {
            delete layer.image;
            delete layer.imageSrc;
            delete layer.mask;
            delete layer.cachedMaskSrc;
            delete layer.cachedImage;
            delete layer.cachedProcessing;
        }
    }
    Renderer.invalidateLayerCaches = invalidateLayerCaches;
    function animateLayersAgain() {
        return animateLayers.apply(Renderer, Renderer.lastAnimateCall);
    }
    Renderer.animateLayersAgain = animateLayersAgain;
    const animatingCanvases = new WeakMap();
    Renderer.Animations = {};
    /**
     * Animation spec provider; default implementation is look up in Renderer.Animations by layer's `animation` property.
     *
     * Can be overridden to auto-generate animations, for example.
     */
    Renderer.AnimationProvider = layer => Renderer.Animations[layer.animation];
    /**
     * Animatable properties of KeyframeSpec and CompositeLayer
     */
    Renderer.AnimatableProps = ["alpha", "show", "blend", "brightness", "contrast", "dx", "dy"];
    function animateLayers(targetCanvas, layerSpecs, listener, autoStop = true) {
        Renderer.lastAnimateCall = [targetCanvas, layerSpecs, listener, autoStop];
        const keyframeCaches = {};
        function invalidateCaches() {
            for (let key in keyframeCaches)
                delete keyframeCaches[key];
        }
        let schedule = {};
        // this mess should become a class already
        const animatingCanvas = {
            target: targetCanvas,
            keyframeCaches: keyframeCaches,
            animations: [],
            playing: false,
            busy: false,
            start() {
                if (this.playing)
                    this.stop();
                this.playing = true;
                // stop previous animation on this targetCanvas, if present
                let oldAnimation = animatingCanvases.get(targetCanvas);
                if (oldAnimation != null) {
                    oldAnimation.stop();
                }
                animatingCanvases.set(targetCanvas, this);
                let usedAnimations = {};
                for (let layer of layerSpecs) {
                    if (!layer.src || layer.show === false)
                        continue;
                    if (layer.animation) {
                        let spec = Renderer.AnimationProvider(layer);
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
                                spec.keyframes.push({ frame: i, duration: duration });
                            }
                        }
                        else {
                            for (let kf of spec.keyframes) {
                                for (let ap of Renderer.AnimatableProps) {
                                    if (ap in kf) {
                                        complex = true;
                                        break;
                                    }
                                }
                                if (complex)
                                    break;
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
                    }
                    else {
                        layer.frames = [0];
                    }
                }
                this.animations = Object.values(usedAnimations);
                for (let animation of this.animations) {
                    scheduleNextKeyframe(animation);
                    if (listener && listener.keyframe)
                        listener.keyframe(animation.name, animation.keyframeIndex, animation.keyframe);
                }
                compose().catch((e) => {
                    if (e)
                        console.error(e);
                });
            },
            stop() {
                if (!this.playing)
                    return;
                this.playing = false;
                animatingCanvases.delete(targetCanvas);
                for (let info of this.animations) {
                    if (info.timeoutId)
                        clearTimeout(info.timeoutId);
                }
                schedule = {};
                this.animations.splice(0);
                invalidateCaches();
                if (listener && listener.animationStop)
                    listener.animationStop();
            },
            invalidateCaches,
            time: 0,
            redraw() {
                compose().catch((e) => {
                    if (e)
                        console.error(e);
                });
            }
        };
        function genAnimationSpec() {
            let j = {};
            for (let animation of animatingCanvas.animations) {
                if (animation.complex) {
                    j[animation.name] = animation.keyframeIndex;
                }
                else {
                    j[animation.name] = animation.keyframe.frame;
                }
            }
            return JSON.stringify(j);
        }
        function scheduleNextKeyframe(animation) {
            if (animation.keyframe.duration <= 0)
                return;
            let t1 = animation.time + animation.keyframe.duration;
            let tasks = schedule[t1];
            if (!tasks) {
                schedule[t1] = tasks = [];
                animation.timeoutId = window.setTimeout(() => {
                    try {
                        delete schedule[t1];
                        animatingCanvas.time = Math.max(t1, animatingCanvas.time);
                        for (let task of tasks)
                            task();
                        compose().catch((e) => {
                            if (e)
                                console.error(e);
                        });
                    }
                    catch (e) {
                        rendererError(listener, e);
                    }
                }, animation.keyframe.duration);
            }
            else {
                animation.timeoutId = 0;
            }
            tasks.push(() => {
                animation.time = t1;
                nextKeyframe(animation);
            });
        }
        function applyKeyframe(keyframe, layer) {
            layer.frames = [keyframe.frame];
            for (let ap of Renderer.AnimatableProps) {
                if (ap in keyframe)
                    layer[ap] = keyframe[ap];
            }
        }
        function nextKeyframe(animation) {
            let keyframes = animation.spec.keyframes;
            animation.keyframeIndex = (animation.keyframeIndex + 1) % keyframes.length;
            animation.keyframe = keyframes[animation.keyframeIndex];
            for (let layer of animation.layers) {
                applyKeyframe(animation.keyframe, layer);
            }
            scheduleNextKeyframe(animation);
            if (listener && listener.keyframe)
                listener.keyframe(animation.name, animation.keyframeIndex, animation.keyframe);
        }
        function stopCheck() {
            if (autoStop && animatingCanvas.time > 0 && !(document.body.contains(targetCanvas.canvas))) {
                /* the canvas was removed from DOM. we exclude frame 0 because it might not yet be added */
                animatingCanvas.stop();
                return true;
            }
            return false;
        }
        function compose() {
            if (stopCheck() || animatingCanvas.busy) {
                return Promise.reject();
            }
            animatingCanvas.busy = true;
            return new Promise((resolve, reject) => {
                requestAnimationFrame(() => {
                    animatingCanvas.busy = false;
                    try {
                        doCompose0();
                        resolve();
                    }
                    catch (e) {
                        rendererError(listener, e);
                        reject(e);
                    }
                });
            });
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
                }
                else {
                    if (listener && listener.keyframeRender) {
                        listener.keyframeRender(spec, false, 0);
                    }
                    const myListener = Object.assign({}, listener, {
                        renderingDone(time) {
                            let canvas = createCanvas(targetCanvas.canvas.width, targetCanvas.canvas.height);
                            canvas.drawImage(targetCanvas.canvas, 0, 0);
                            keyframeCaches[genAnimationSpec()] = canvas;
                            if (listener && listener.renderingDone)
                                listener.renderingDone.apply(listener, arguments);
                        }
                    });
                    try {
                        composeLayers(targetCanvas, layerSpecs, 1, myListener);
                    }
                    catch (e) {
                        animatingCanvas.stop();
                        throw e;
                    }
                }
            }
        }
        animatingCanvas.start();
        return (Renderer.lastAnimation = animatingCanvas);
    }
    Renderer.animateLayers = animateLayers;
    /**
     * Linear interpolation.
     *
     * f(0) = min,
     * f(1) = max.
     */
    function lint(value, min, max, allowOverflow = false) {
        if (!allowOverflow)
            value = Math.min(1, Math.max(0, value));
        return value * (max - min) + min;
    }
    Renderer.lint = lint;
    function lintArray(value, mins, maxes, allowOverflow = false) {
        return mins.map((min, i) => lint(value, min, maxes[i], allowOverflow));
    }
    Renderer.lintArray = lintArray;
    function lintStaged(value, points) {
        value = Math.min(1, Math.max(0, value));
        const n = points.length - 1;
        let i = (value * n) | 0;
        if (i === n)
            i = n - 1;
        return lint(value * n - i, points[i], points[i + 1]);
    }
    Renderer.lintStaged = lintStaged;
    function lintRgb(value, min, max) {
        min = tinycolor(min).toRgb();
        max = tinycolor(max).toRgb();
        return tinycolor({
            r: lint(value, min.r, max.r),
            g: lint(value, min.g, max.g),
            b: lint(value, min.b, max.b)
        });
    }
    Renderer.lintRgb = lintRgb;
    function lintRgbStaged(value, points) {
        value = Math.min(1, Math.max(0, value));
        const n = points.length - 1;
        let i = (value * n) | 0;
        if (i === n)
            i = n - 1;
        return lintRgb(value * n - i, points[i], points[i + 1]);
    }
    Renderer.lintRgbStaged = lintRgbStaged;
    window.Renderer = Renderer;
    // Expose library functions needed by model evaluation, to global ns
    window.lint = Renderer.lint;
    window.lintArray = Renderer.lintArray;
    window.lintStaged = Renderer.lintStaged;
    window.lintRgb = Renderer.lintRgb;
    window.lintRgbStaged = Renderer.lintRgbStaged;
})(Renderer || (Renderer = {}));
