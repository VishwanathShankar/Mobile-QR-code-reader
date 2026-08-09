This is a simple Ionic/Capacitor mobile app for scanning QR codes and displaying their contents.

## Features

1. Open the device camera.
2. Scan QR codes with `@capacitor/barcode-scanner`.
3. Display the scanned contents.
4. Copy or clear the latest result.

## Run locally

Ensure to have node.js installed 
```bash
npm install
```

## Native platform setup

This repository has the Capacitor Android/iOS packages installed, but the generated `android/` and `ios/` folders are not currently present. Add them with:

```bash
npx cap add android
npx cap add ios
npx cap sync
```

Android requires `minSdkVersion = 26` in `android/variables.gradle` for the barcode scanner plugin.

Android also needs camera permission in `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
```

iOS requires a camera usage string in `ios/App/App/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>Camera access is used to scan QR codes.</string>
```
