# PariLink Driver — build an installable Android APK (from scratch: toolchain + native project + build)

The mobile app `apps/mobile` (PariLinkDriver, bare React Native) has JS/TS code but NO `android/`
native project, and this Mac has no Android SDK (ANDROID_HOME unset) and only Java 11. So we set up
the toolchain, regenerate the native project, point the app at the Mac's LAN IP, and build a debug
APK. Work top-down; native builds hit snags — paste the real error and fix it, don't skip.

## STEP 0 — read the app's React Native version (need it to regenerate the native project)
```bash
cd ~/Desktop/PariLink/apps/mobile
node -e "const p=require('./package.json');console.log('RN', p.dependencies['react-native'], '| name', p.name)"
```
Note the exact react-native version (e.g. 0.75.x) — call it $RNVER below.

## STEP 1 — toolchain: Java 17 + Android SDK
```bash
brew install openjdk@17
sudo ln -sfn $(brew --prefix openjdk@17)/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
# Android SDK via command-line tools (no full Android Studio needed):
brew install --cask android-commandlinetools
export ANDROID_HOME="$(brew --prefix)/share/android-commandlinetools"
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"
yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```
(Persist JAVA_HOME/ANDROID_HOME in ~/.zshrc so later shells have them.)

## STEP 2 — regenerate the missing `android/` native project
The repo has no `apps/mobile/android`. Create a throwaway RN app of the SAME version and copy its
android folder in, then set the app id/name:
```bash
cd /tmp && npx @react-native-community/cli@latest init PLTmp --version $RNVER --skip-install
cp -R /tmp/PLTmp/android ~/Desktop/PariLink/apps/mobile/android
cd ~/Desktop/PariLink/apps/mobile
# set app name + id
# in android/app/build.gradle set: applicationId "com.parilink.driver"
# in android/app/src/main/res/values/strings.xml set app_name to "PariLink Driver"
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
npm install --legacy-peer-deps
```
If the app uses native modules (geolocation, netinfo, async-storage), RN autolinking handles them on
build — but if a module needs manual setup, its README will say so; fix as errors appear.

## STEP 3 — point the app at your Mac's Wi-Fi address (phone can't reach localhost)
`apps/mobile/src/services/api/client.ts` uses `10.0.2.2:8080` (emulator only). For a REAL phone,
use the Mac's LAN IP:
```bash
ipconfig getifaddr en0   # e.g. 192.168.1.23
```
Set the API base to `http://<that-ip>:8080/api/v1`. The phone and Mac must be on the same Wi-Fi, and
the API (`npm run start:prod` in apps/api) must be running when the driver app is used.

## STEP 4 — build the debug APK
```bash
cd ~/Desktop/PariLink/apps/mobile/android
./gradlew assembleDebug
ls -la app/build/outputs/apk/debug/app-debug.apk
```
The APK is at `apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk`.

## STEP 5 — put it on the phone
Copy `app-debug.apk` to the Android phone (USB, Google Drive, or WhatsApp to yourself), open it on
the phone, allow "install from unknown sources", install. Open the app, log in with a driver account
(create one in the web app, or use `admin@parilink.in` / `password123` to test). Confirm it reaches
the API (the LAN IP + api server running).

## Report
Paste: the RN version, that `assembleDebug` finished with BUILD SUCCESSFUL, and the APK file path +
size. If any step fails, paste the exact error and what you changed to fix it — do not report success
without the real APK on disk.

## If the local build keeps fighting (fallback: cloud build, no Android Studio)
Consider EAS Build: `npm i -g eas-cli`, `eas login`, add an `eas.json` with an `android.preview`
profile (`"buildType":"apk"`), then `eas build -p android --profile preview`. It builds in Expo's
cloud and gives a download link / QR for the APK — no local SDK needed. (Bare RN needs the expo
config plugin; only go here if Step 4 is stuck.)
