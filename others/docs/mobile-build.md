# Android Build Instructions

## Required Tools

Before you start, you'll need...
  - `docker`

    The built docker image will provide all the tools for building the android apk and is required

### Optional Tools

  - android emulator tools (at minimum `adb`)(aka `Android Studio`)

    In order to test the produced apk, it's recommend to install android studio. If you don't want to install the entire IDE, I recommend following the instructions here https://stackoverflow.com/a/61150826. NOTE: at the time of this writing WSL users must install the windows version of android studio in order to actually use the emulator.


<br/> <br/>

## Building

### Before your first build

**In the `devTools/androidsdk/image` folder**, run `docker build -t cordova-android:latest .`

Ensure that you've successfully compiled the game and that `Degrees of Lewdity.html` exists; use `FORCE_VERSION='' ./compile.sh` to generate it if you have pending changes.

### Building debug

Run `docker run -v <PROJECT_ROOT>:/src -it cordova-android npm run build-debug` in the project root. This will create an unsigned debug build for testing in the  `dist/` folder. Note, `<PROJECT_ROOT>` must be replaced with the absolute path to the project directory. This can be accomplished via 
  - `` `pwd`:/src `` (linux bash)
  - `` %cd%:/src `` (windows)

### Building release

The release build process is almost identical to debug: `docker run -v <PROJECT_ROOT>:/src -it cordova-android npm run build-release`.

Note that building the release version requires a key (`/keys/dol.keystore`). Check the discord for details on how to get the official key.
    
> using an unofficial key will require the previous release to be uninstalled before proceeding: see `Installing` below

<br/> <br/>

## Setting up the Emulator

An emulator is an easy way to test that the built apk works for a given version of android.

### Get the emulator image

Get the android 24 x86 image from the android-studio virtual device manager GUI (you can download it as part of creating a device)

### Create the emulator

Use the android-studio virtual device manager GUI. Be sure to select the correct image (see above). Additionally, be sure to select a device that supports Google Play (has a play icon in the GUI). For simplicity and consistency, use the 'Pixel 2', though feel free to experiment with other devices.

If you want to test against other android versions, note that the absolute minimum we can support with DoL is android-21. In addition, you'll have to find a way to update the default browser used by the device. Getting updates installed on pre-android-24 versions (and select other later android versions) is quite a bit more involved.

### **Update the emulator**
This is an important step, as without it you may be able to install and open the app in the emulator, but find it broken.

Start the emulator, and then open Google Play to update
1. Google play
2. Chrome browser

### Installing

Run `adb install -r <name of apk>` to easily install an apk on a currently running emulator or detected android device.

NOTE: If switching between release and/or debug version, it will likely be necessary to uninstall the previous version first using `adb uninstall com.vrelnir.DegreesOfLewdity`.
