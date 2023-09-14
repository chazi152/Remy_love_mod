const fs = require('fs-extra')
const path = require('path');

const ROOT = path.resolve('/src')
if (fs.existsSync(path.resolve(ROOT, 'img'))) {
    copyFilesFromRoot();
} else {
    console.warn(`No root directory found. Skipping copy. Continuing with build as a dry run.`)
}

function copyFilesFromRoot() {
    const MAIN = 'Degrees of Lewdity.html'
    const ANDROID_PATH = path.resolve('./platforms/android/app/src/main/assets/www')
    const paths = {
        src: {
            main: path.resolve(ROOT, MAIN),
            img: path.resolve(ROOT, 'img')
        },
        dest: {
            android: {
                main: path.resolve(ANDROID_PATH, MAIN),
                img: path.resolve(ANDROID_PATH, 'img')
            }
        }
    }
    if (!fs.existsSync(paths.src.main)) {
        throw new Error(`Missing ${paths.src.main}. Be sure to compile dol into html first.`);
    }

    fs.ensureDirSync(paths.dest.android.img);
    fs.copySync(paths.src.main, paths.dest.android.main);
    fs.copySync(paths.src.img, paths.dest.android.img);
}