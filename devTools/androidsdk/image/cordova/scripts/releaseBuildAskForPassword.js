/** 
 * Simple script to ask user for password. Normally this is handled automatically by 
 * gradle but it doesn't work in all systems, so have this commandline shim instead.
 */
const cordova = require('cordova');
const read = require('read');
const fs = require('fs-extra');
const path = require('path');

const KEYSTORE_PATH = path.resolve('/src/keys/dol.keystore');
if (!fs.existsSync(KEYSTORE_PATH)) {
    throw new Error(`Missing keystore @${KEYSTORE_PATH}. See the docs for information on how to obtain or build the key first.`)
}
read({ prompt: 'Please enter the password: ', silent: true, replace: '*' }, (err, password) => {
    if (err) { throw err; }
    const args = [process.argv[0], require.resolve('cordova'), 'build',
        '--release',
        '--',
        `--storePassword=${password}`,
        `--password=${password}`,
        `--keystore=${KEYSTORE_PATH}`,
        `--alias=dol`
    ];
    cordova.cli(args);
})

