const fs = require('fs-extra')
const path = require('path');
const ROOT = path.resolve('/src');

if (fs.existsSync(path.resolve(ROOT, 'LICENSE'))) {
    copyFilesToRoot();
} else {
    console.log(`No root directory found. Skipping copy.`)
}
function copyFilesToRoot() {
    const OUTPUT_ROOT = path.resolve("platforms/android/app/build/outputs/apk/");
    const DIST_ROOT = path.resolve(ROOT, 'dist')
    const version = fs.readFileSync(path.resolve(ROOT, 'version'));
    const paths = {
        android: {
            src: {
                debug: path.resolve(OUTPUT_ROOT, "debug/app-debug.apk"),
                release: path.resolve(OUTPUT_ROOT, "release/app-release.apk")
            },
            dest: {
                debug: path.resolve(DIST_ROOT, `degrees-of-lewdity-${version}-debug.apk`),
                release: path.resolve(DIST_ROOT, `degrees-of-lewdity-${version}.apk`)
            }
        }
    };

    fs.ensureDirSync(DIST_ROOT);
    let numberCopied = 0;
    Object.entries(paths.android.src).forEach(([buildType, srcPath]) => {
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, paths.android.dest[buildType]);
            console.log(`Copied apk ${srcPath} -> ${paths.android.dest[buildType]}`);
            numberCopied++;
        }
    });
    if (numberCopied === 0) {
        console.warn(`No built apks found.`)
    }
}