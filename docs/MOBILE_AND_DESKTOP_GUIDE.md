# FinGuard — Cross-Platform App Guide (Android, iOS & macOS) 📱💻

This document explains how **FinGuard / FinShield** is configured to run across **Android, iOS, and macOS**, as well as how the financial intelligence and scam detection models operate on-device and in the cloud.

---

## 🎯 Current Status

All platform configurations, native projects, and build artifacts are ready:

| Platform | Type | Status | Artifact / Location |
| :--- | :--- | :--- | :--- |
| **Android** | Native APK | ✅ **Built** | `frontend/android/app/build/outputs/apk/debug/app-debug.apk` (8.1 MB) |
| **macOS** | Desktop App | ✅ **Configured** | `frontend/electron/main.cjs` (Run with `npm run mac:run`) |
| **iOS** | Xcode Project | ✅ **Configured** | `frontend/ios/App/App.xcodeproj` |
| **Model** | Scam & Risk AI | ✅ **Ready** | Edge rule engine running client-side + FastAPI sync |

---

## 🚀 Quick Launch (Interactive Menu)

Run the interactive launcher from the project root:

```bash
cd /Users/neev/Desktop/Financial-innovation
./run_apps.sh
```

Menu options:
1. **Launch macOS Desktop App**
2. **Build & Re-package Android Debug APK**
3. **Open Android Project in Android Studio**
4. **Open iOS & Mac Catalyst Project in Xcode**
5. **Synchronize Web Assets & Plugins to All Platforms**

---

## 1. 🤖 Android Guide

### How to Install the Built APK on Your Android Device
An Android debug APK has already been compiled:
- **Path**: `frontend/android/app/build/outputs/apk/debug/app-debug.apk`

#### Installation Options:
- **Option A (Direct USB via adb)**:
  Connect your Android phone with USB Debugging enabled:
  ```bash
  adb install frontend/android/app/build/outputs/apk/debug/app-debug.apk
  ```
- **Option B (Phone transfer)**:
  Send `app-debug.apk` to your phone via Google Drive, WhatsApp, or AirDrop/Bluetooth, tap the file on your phone, and select **Install**.

### Modifying and Building in Android Studio:
```bash
cd frontend
npm run cap:android
# Or: npx cap open android
```
- In Android Studio, wait for Gradle sync, connect your device or emulator, and click the green **Run (▶)** button.
- Native permissions (`CAMERA`, `READ_MEDIA_IMAGES`, `INTERNET`) are pre-configured in `frontend/android/app/src/main/AndroidManifest.xml`.

---

## 2. 🍏 macOS Desktop App Guide

FinGuard includes a dedicated **Electron desktop shell** styled specifically for macOS with translucent/hidden inset title bar controls.

### To Run the macOS App:
```bash
cd frontend
npm run mac:run
```
*(This automatically builds the production Vite bundle and launches FinGuard in an isolated macOS application window).*

### For Live Development (Hot Reloading on Mac):
```bash
cd frontend
npm run mac
```

---

## 3. 🍎 iOS Guide

### To Open in Xcode:
```bash
cd frontend
npm run cap:ios
# Or: npx cap open ios
```
1. Xcode will open `frontend/ios/App/App.xcodeproj`.
2. Select your development team under **Signing & Capabilities** (your free Apple ID).
3. Select an iPhone Simulator (e.g. iPhone 16) or your plugged-in iPhone.
4. Click **Run (▶)**.

### Mac Catalyst (Running the iOS build on Mac):
1. In Xcode under the **App** target → **General** tab.
2. In **Supported Destinations**, select **Mac (Mac Catalyst)** or **Mac (Designed for iPad)**.
3. Select **My Mac** in the device target list and click **Run**.

Camera and photo permissions (`NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`) are pre-configured in `frontend/ios/App/App/Info.plist`.

---

## 🧠 How the "Model" & Financial Intelligence Run

### 1. Offline On-Device Engine (Zero Latency)
The threat evaluation and scam detection model in `frontend/src/services/api.ts` implements the exact weighted scoring rules from `backend/app/services/scam_service.py`:
- **Impersonation & Threat Rules** (Weight: 30)
- **Credential Harvesting & PIN Trap Rules** (Weight: 40)
- **Malicious Shortened Links & APKs** (Weight: 25)
- **Reverse QR Payment Traps** (Weight: 35)
- **Advance-Fee / Lottery Hooks** (Weight: 20)
- **Artificial Urgency Detectors** (Weight: 15)

It runs **100% locally on Android, iOS, and macOS** without requiring a server connection.

### 2. Live Cloud Mode (Full Stack)
When you are ready to connect to your live FastAPI backend and Supabase database:
1. Deploy `backend/` to Render/Railway.
2. In `frontend/.env`, set:
   ```env
   VITE_API_BASE_URL=https://your-api-domain.com
   ```
3. Run `npm run cap:sync` to propagate the changes to all native platforms.
