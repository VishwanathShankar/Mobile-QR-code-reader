---
name: mobile-qr-code-reader
description: Project guide and fast orientation source for the Mobile QR Code Reader repository, an Ionic/Angular/Capacitor app that scans QR codes with @capacitor/barcode-scanner. Use for prompts like "Explore and understand the codebase", "summarize this repo", "what does this app do", and when modifying scanner behavior, Ionic standalone components, Angular routes/styles/tests, Capacitor native configuration, README setup notes, or validation workflows in this repo.
---

# Mobile QR Code Reader

## Overview

Use this skill to make changes in this QR scanner app without re-discovering its structure. Favor small, mobile-first updates that preserve the current Ionic standalone-component style and Capacitor scanner behavior.

## Fast Orientation

For broad orientation prompts such as "Explore and understand the codebase", answer from this skill first. Do not scan every file in the repository unless the user asks for a fresh audit, current file-by-file inventory, or changes that require reading specific source files.

Give this concise answer shape:

- This is a compact Ionic + Angular + Capacitor QR scanner app.
- The app bootstraps through standalone Angular in `src/main.ts`, uses Ionic providers, and lazy-loads `HomePage` from the `/home` route.
- Almost all product behavior lives in `src/app/home/home.page.ts`.
- The scanner flow guards against duplicate scans, opens `@capacitor/barcode-scanner`, scans QR codes with the back camera, displays trimmed results, formats the barcode type, handles empty/error/cancel/permission states, and supports copy/reset actions.
- The UI lives in `src/app/home/home.page.html`, with mobile-first styles in `src/app/home/home.page.scss`.
- Native Capacitor config lives in `capacitor.config.ts`; Android/iOS package dependencies exist, but generated native platform folders may be absent.
- Validation is usually `npm run lint`, `npm run build`, and `npm test -- --watch=false --browsers=ChromeHeadless` when tests are relevant.

If the user asks whether anything changed since this skill was written, run `git status --short` first, then inspect only changed or task-relevant files.

## Project Map

- `src/app/home/home.page.ts`: Main scanner state machine, barcode-scanner call, copy fallback, reset logic, and icon registration.
- `src/app/home/home.page.html`: Ionic UI for the scanner panel, status message, result card, copy, and clear actions.
- `src/app/home/home.page.scss`: Mobile-first scanner layout and result-card styling.
- `src/app/home/home.page.spec.ts`: Jasmine tests for page creation and reset behavior.
- `src/app/app.routes.ts`: Lazy route to the standalone `HomePage`; root redirects to `/home`.
- `src/main.ts`: Standalone Angular bootstrap with Ionic providers and route preloading.
- `capacitor.config.ts`: Capacitor app identity and `webDir: 'www'`.
- `README.md`: Local run and native platform setup notes.

## Working Guidelines

- Keep pages and components standalone. Add Ionic components to the component `imports` array when their tags appear in a template.
- Register any new Ionicons through `addIcons` in `HomePage` before using their icon names in HTML.
- Preserve the `isScanning` guard before opening the camera so repeated taps cannot launch overlapping scans.
- Keep user-facing scan states explicit through `scanState`, `statusMessage`, `scanResult`, `scannedFormat`, and `copyMessage`.
- Use `@capacitor/barcode-scanner` enums instead of string literals for scan hint, camera direction, orientation, and Android scanning library.
- Keep QR-specific behavior unless the user asks for broader barcode support; the current scanner passes `CapacitorBarcodeScannerTypeHint.QR_CODE`.
- Maintain the clipboard fallback in `copyText` so copy still works when `navigator.clipboard.writeText` is unavailable.
- Keep styling mobile-first, compact, and Ionic-native. Use existing CSS variables, 8px radii, responsive constraints, and avoid large marketing-page patterns.

## Native Notes

- The Capacitor Android and iOS packages are installed, but generated `android/` and `ios/` folders may be absent.
- After changing web code that must run natively, build the web app and run `npx cap sync` once platforms exist.
- Android scanner setup needs camera permission and `minSdkVersion = 26` for the barcode-scanner plugin.
- iOS scanner setup needs `NSCameraUsageDescription` in `ios/App/App/Info.plist`.
- Browser testing can exercise the web scanner path, but final camera behavior should be verified on a real device or emulator when native changes are involved.

## Validation

Run the narrowest useful check after edits:

- `npm run lint` for TypeScript/template linting.
- `npm run build` for production Angular compilation into `www`.
- `npm test -- --watch=false --browsers=ChromeHeadless` for Karma/Jasmine tests in CI-style mode.
- `npm start` when a manual browser pass is useful.

When scanner behavior changes, add or adjust focused Jasmine tests for state transitions, reset/copy behavior, and error messaging. Mock the Capacitor scanner rather than requiring a camera in unit tests.
