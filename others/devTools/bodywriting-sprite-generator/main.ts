import { parse } from 'ts-command-line-args';
import clc from 'cli-color';
import fs from "fs";
import { PNG, PNGWithMetadata } from "pngjs";

interface IArguments {
    name: string;
    sourceImage: string;
    templateMasks: string;
    targetFolder: string;
    raisableParts: string[];
    raiseSecondSpriteBy: number;
    size: number;
    rewrite: boolean;
    help: boolean;
}

const args = parse<IArguments>({
    name: {
        type: String,
        defaultValue: "writing",
        description: 'The name of the sprite sheet and the writing. Defaults to "writing".'
    },
    sourceImage: {
        type: String,
        defaultValue: './source.png',
        description: 'The source image to use. Containing bodywriting in all areas. Defaults to "./input.png".'
    },
    targetFolder: {
        type: String,
        defaultValue: './output',
        description: 'The output folder. Inside will be created another folder, with name <name> containing all the generated sprites, appropriatelly named. Defaults to "./output.png".'
    },
    templateMasks: {
        type: String,
        defaultValue: './template',
        description: 'Template masks folder, specifing the zones belonging to individual sprite areas. Defaults to "./templateMasks". This folder exists, populated, inside this package folder.'
    },
    raisableParts: {
        type: String,
        multiple: true,
        defaultValue: ['breasts', 'pubic', 'left_shoulder', 'right_shoulder'],
        description: 'Second sprit in the spritesheets of these parts of the body are raised by --raiseSecondSpriteBy amount of pixels. Defaults to "breasts", "pubic", "left_shoulder", "right_shoulder".'

    },
    raiseSecondSpriteBy: {
        type: Number,
        defaultValue: 2,
        description: 'Second sprite in the spritesheet of --raisableParts parts will be raised by this amount of pixels. Note that the value is in conventional pixel, as opposed to DoL pixel, that are usually 2x2 convention pixels. Defaults to 2 (translates to 1 DoL pixel).'
    },
    size: {
        type: Number,
        defaultValue: 256,
        description: 'The size of the images. Defaults to 256.'
    },
    rewrite: {
        type: Boolean,
        defaultValue: false,
        description: 'If set, the output folder will be deleted and recreated. Defaults to false.'
    },
    help: {
        type: Boolean,
        alias: 'h',
        description: 'Prints this usage guide.'
    },
},
    {
        helpArg: 'help',
    }
)

type Pixel = {
    r: number,
    g: number,
    b: number,
    a: number
}

type Image = {
    width: number,
    height: number,
    pixels: Array<Array<Pixel>>,
}

function emptyNaiveImage(width: number, height: number = width): Image {
    return {
        width,
        height,
        pixels: Array(width).fill(null).map(() => Array(height).fill(null).map(() => ({ r: 0, g: 0, b: 0, a: 0 })))
    }
}

function toNaiveImage(png: PNGWithMetadata, size: number) {
    let inputImage = emptyNaiveImage(size);

    for (let y = 0; y < args.size; y++) {
        for (let x = 0; x < args.size; x++) {
            let idx = (y * args.size + x) << 2;
            inputImage.pixels[x][y] = {
                r: png.data[idx],
                g: png.data[idx + 1],
                b: png.data[idx + 2],
                a: png.data[idx + 3]
            }
        }
    }
    return inputImage;
}

function toPng(image: Image) {
    let png = new PNG({
        width: image.width,
        height: image.height,
        colorType: 6,
        inputHasAlpha: true
    });

    for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
            let idx = (y * image.width + x) << 2;
            png.data[idx] = image.pixels[x][y].r;
            png.data[idx + 1] = image.pixels[x][y].g;
            png.data[idx + 2] = image.pixels[x][y].b;
            png.data[idx + 3] = image.pixels[x][y].a;
        }
    }
    return png;
}


function makeSafeInputStream(): Image {
    let sourceBuffer = fs.readFileSync(args.sourceImage);
    let png = PNG.sync.read(sourceBuffer);

    if (png.colorType != 6) {
        throw new Error("Source image is not a supported format. Only PNG with color type 6 (RGBA) is supported.");
    }


    if (png.width != args.size || png.height != args.size) {
        throw new Error(`Source image needs to be ${args.size}x${args.size} pixels, as specified in --size flag.`);
    }

    return toNaiveImage(png, args.size);
}

type Mask = {
    name: string;
    image: Image;
}

function makeSafeTemplates(): Array<Mask> {
    let templateBuffers: Array<Mask> = [];
    fs.readdirSync(args.templateMasks).forEach(file => {
        if (!file.endsWith('.png')) {
            console.warn(clc.yellow(`Skipping ${clc.underline(file)}, not a .png file.`));
            return;
        }
        let templateBuffer = fs.readFileSync(`${args.templateMasks}/${file}`);
        let png = PNG.sync.read(templateBuffer);
        if (png.width != args.size || png.height != args.size) {
            throw new Error(`Template mask needs to be ${args.size}x${args.size} pixels, as specified in --size flag.`);
        }
        templateBuffers.push({
            name: file.split(".")[0],
            image: toNaiveImage(png, args.size)
        });

    });
    return templateBuffers;
}

type BodyPart = {
    name: string;
    image: Image;
}

function split(inputImage: Image, masks: Array<Mask>): Array<BodyPart> {
    const bodyParts: Array<BodyPart> = [];
    for (const mask of masks) {
        const bodyPart = emptyNaiveImage(args.size);
        let used = false;

        for (let x = 0; x < inputImage.width; x++) {
            for (let y = 0; y < inputImage.height; y++) {
                if (mask.image.pixels[x][y].r == 0 && mask.image.pixels[x][y].g == 0 && mask.image.pixels[x][y].b == 0 && mask.image.pixels[x][y].a == 255) {
                    bodyPart.pixels[x][y] = inputImage.pixels[x][y];
                    if (bodyPart.pixels[x][y].a != 0) {
                        used = true;
                    }
                } else {
                    bodyPart.pixels[x][y] = { r: 0, g: 0, b: 0, a: 0 };
                }
            }
        }
        if (used) {
            bodyParts.push({
                name: mask.name,
                image: bodyPart
            });
        }
    };
    return bodyParts;
}

type Collision = {
    part1: BodyPart;
    part2: BodyPart;
    x: number;
    y: number;
}
function verifyCollisions(bodyParts: Array<BodyPart>): void {
    const uniquePairs = (arr: Array<BodyPart>) =>
        arr.flatMap((item1, index1) =>
            arr.flatMap((item2, index2) =>
                (index1 > index2) ? [[item1, item2]] : []
            )
        )

    const collisions: Array<Collision> = uniquePairs(bodyParts).flatMap(pair => {
        const [part1, part2] = pair;;

        for (var y = 0; y < args.size; y++) {
            for (var x = 0; x < args.size; x++) {

                const collided = part1.image.pixels[y][x].a != 0 && part2.image.pixels[y][x].a != 0;
                if (collided) {
                    return [{
                        part1: part1,
                        part2: part2,
                        x: x,
                        y: y
                    }]
                }
            }
        }
        return [];
    });

    for (const collision of collisions) {
        console.warn(clc.yellow(`Collision detected between ${clc.underline(collision.part1.name)} and ${clc.underline(collision.part2.name)} at ${collision.x}, ${collision.y}. This may require manual adjustment.`));
    }
};

function doubleOnOtherSide(bodyPart: BodyPart, raiseBy: number): BodyPart {
    const doubledSprite = emptyNaiveImage(args.size * 2, args.size);
    for (let x = 0; x < args.size; x++) {
        for (let y = 0; y < args.size; y++) {
            doubledSprite.pixels[x][y + raiseBy] = bodyPart.image.pixels[x][y];
            doubledSprite.pixels[x + args.size][y] = bodyPart.image.pixels[x][y];
        }
    }
    return {
        name: bodyPart.name,
        image: doubledSprite
    };
};

function makeSafeOutputFolder(): string {
    if (!fs.existsSync(args.targetFolder)) {
        fs.mkdirSync(args.targetFolder);
    }
    let outputExists = fs.existsSync(args.targetFolder + "/" + args.name);
    if (!args.rewrite && outputExists) {
        throw new Error(`Output folder ${args.targetFolder}/${args.name} already exists.`);
    }
    if (outputExists) {
        fs.rmSync(args.targetFolder + "/" + args.name, { recursive: true });
    }
    fs.mkdirSync(args.targetFolder + "/" + args.name);

    return args.targetFolder;
}


function main() {
    let inputImage = makeSafeInputStream();
    let masks = makeSafeTemplates();
    console.log(`Found template masks: ${masks.map(m => `"${m.name}"`).join(", ")}.`);
    let bodyParts = split(inputImage, masks);
    console.log(`Found body parts: ${bodyParts.map(b => `"${b.name}"`).join(", ")}.`);
    verifyCollisions(bodyParts);
    let doubledBodyParts = bodyParts.map(bodyPart => doubleOnOtherSide(bodyPart, args.raisableParts.includes(bodyPart.name) ? args.raiseSecondSpriteBy : 0));
    makeSafeOutputFolder();
    doubledBodyParts.forEach(bodyPart => {
        let outputBuffer = PNG.sync.write(toPng(bodyPart.image));
        fs.writeFileSync(`${args.targetFolder}/${args.name}/${bodyPart.name}.png`, outputBuffer);
    });
    console.log(clc.green(`${clc.underline(doubledBodyParts.length)} body parts written to ${args.targetFolder}/${args.name}`));

    console.log(`Copy the sprites to ${clc.underline("img/bodywriting/text/" + args.name)}`);

    console.log(`Add the following lines to the ${clc.underline(args.name)} object in ${clc.underline("game/base-system/bodywriting-objects.twee")} file:`);
    console.log(`\tkey: "${args.name}",`);
    console.log(`\tsprites: [${doubledBodyParts.map(bodyPart => `"${bodyPart.name}"`).join(", ")}]`);
    console.log(clc.green(`Done!`));
}

main();