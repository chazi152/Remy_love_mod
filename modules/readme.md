# Modules

This directory should contain standalone files, that do not intend to access SugarCube, but may be accessed from the `/game/` directory files.

### Additional statements

Javascript files are inserted into the head of the HTML file, and are executed instantly. This will occur before most, if not all, of the other processes for the game, this includes SugarCube.

Changes to this directory are watched automatically, along with the regular `/game/` directory, when using `compile_watch.bat`.

### Supported files

- .css
- .js
- .otf
- .ttf
- .woff
- .woff2
