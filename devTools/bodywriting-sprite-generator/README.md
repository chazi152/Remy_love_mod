# Bodywriting sprite generator

This simple command line tool helps with generation of bodywriting sprites for DoL.

## Installation

```
npx yarn --frozen-lockfile
```

## Usage

```
npx ts-node ./main.ts [options]
```

### Example

```
npx ts-node ./main.ts --name testWriting --sourceImage=./test/testInput.png --targetFolder=./test/output/ --rewrite
```

### Full list of options

| Option                         | Description                                                                                                                                                                                                                                                    |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--name string`                | The name of the sprite sheet and the writing. Defaults to "writing".                                                                                                                                                                                           |
| `--sourceImage string`         | The source image to use. Containing bodywriting in all areas. Defaults to `"./input.png"`.                                                                                                                                                                     |
| `--targetFolder string`        | The output folder. Inside will be created another folder, with name `--name` containing all the generated sprites, appropriatelly named. Defaults to `"./output.png"`.                                                                                         |
| `--templateMasks string`       | Template masks folder, specifing the zones belonging to individual sprite areas. Defaults to `"./templateMasks"`. This folder exists, populated, inside this package folder.                                                                                   |
| `--raisableParts string[]`     | Second sprit in the spritesheets of these parts of the body are raised by --raiseSecondSpriteBy amount of pixels. Defaults to `["breasts", "pubic","left_shoulder", "right_shoulder"]`.                                                                        |
| `--raiseSecondSpriteBy number` | Second sprite in the spritesheet of --raisableParts parts will be raised by this amount of pixels. Note that the value is in conventional pixel, as opposed to DoL pixel, that are usually 2x2 convention pixels. Defaults to `2` (translates to 1 DoL pixel). |
| `--size number`                | The size of the images. Defaults to 256`.                                                                                                                                                                                                                      |
| `--rewrite`                    | If set, the output folder will be deleted and recreated. Defaults to `false`.                                                                                                                                                                                  |
| `-h, --help`                   | Prints this usage guide.                                                                                                                                                                                                                                       |
