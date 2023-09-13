const fs = require('fs-extra');
const path = require('path');
const process = require('process');
const CORDOVA = path.resolve('/cordovasrc');
const SRC = path.resolve('/src');

let version = process.argv[2]
if (!version) {
    const versionFile = path.resolve(SRC, 'version');
    if (!fs.existsSync(versionFile)) {
        console.log(`A version number is required. Unable to open ${versionFile} as a default version number. Aborting version update.`);
        process.exit(1)
    }
    version = fs.readFileSync(versionFile).toString();
} else {
    console.log(`Updating to version number "${version}"`)
}

update(path.resolve(CORDOVA, 'package.json'), (data) => {
    const packageJson = JSON.parse(data);
    packageJson.version = version;
    return JSON.stringify(packageJson, undefined, 2);
}, (err, stage) => {
    console.log(`Failed to update package.json version during ${STAGE[stage]}`)
    throw err;
});
const CONFIG_VERSION_REGEX = /<widget([^>]*)version\s*=\s*"([^"]*)"/g;
const configXmlPath = path.resolve(CORDOVA, 'config.xml')
update(configXmlPath, (data) => {
    CONFIG_VERSION_REGEX.lastIndex = 0;
    const updatedData = data.replace(CONFIG_VERSION_REGEX, `<widget$1version="${version}"`);
    CONFIG_VERSION_REGEX.lastIndex = 0;
    const updatedVersionMatch = CONFIG_VERSION_REGEX.exec(updatedData);
    if (!updatedVersionMatch) {
        throw new Error(`Failed to update version. Widget version attribute is not found. Check contents of ${configXmlPath}.`)
    }
    if (updatedVersionMatch[2].trim() != version.trim()) {
        throw new Error(`Failed to update version. Expected ${version}, but got ${updatedVersionMatch[2]}.`)
    }
    return updatedData;
}, (err, stage) => {
    console.log(`Failed to update config.xml version during ${STAGE[stage]}`)
    throw err;
});


const STAGE = [
    'file read',
    'version update',
    'file write'
]
function update(filename, doUpdate, onError) {
    console.log(`Updating ${filename}`);
    fs.readFile(filename, (err, data) => {
        if (err) {
            onError(err, 0);
        } else {
            let updatedData;
            try {
                updatedData = doUpdate(data.toString())
            } catch (e) {
                onError(e, 1);
            }
            if (!updatedData) {
                onError(new Error('Update failed: returned data is empty'), 1);
            }
            return fs.writeFile(filename, updatedData, (err) => {
                if (err) {
                    onError(err, 2);
                }
            });
        }
    })
}