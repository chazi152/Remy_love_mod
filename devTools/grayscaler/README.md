# Grayscale image converters

Utilities to convert legacy red-based sprites to grayscale sprites fit to hard-light blending in new renderer. 

## Browser version

1. Open `index.html` in browser
2. Open "red" image files (can do multiple at once)
3. Adjust settings
4. Right-click on the every converted image and save to file. Don't forget to add `_gray` suffix!

## Command-line utility to mass-convert files

1. `npm install` (once, to download dependencies)
2. `node index.js`

It will convert ALL clothes items, according to setup variables.

Edit the script to process files separately.

If you get "unrecognised content at end of stream" error, see note in index.js.

