#!/usr/bin/env bash

# =================================================================
# FinGuard Cross-Platform Launcher (macOS, Android, iOS)
# =================================================================

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

echo "================================================================="
echo "  FinGuard Cross-Platform App Manager"
echo "  Target Platforms: Android (APK) | macOS (Desktop) | iOS (Xcode)"
echo "================================================================="
echo ""
echo "Select an option:"
echo "  1) Launch macOS Desktop App (Native Window)"
echo "  2) Build & Re-package Android Debug APK"
echo "  3) Open Android Project in Android Studio"
echo "  4) Open iOS & Mac Catalyst Project in Xcode"
echo "  5) Synchronize Web Assets & Plugins to All Platforms"
echo "  6) Exit"
echo ""

choice="${1:-}"
if [ -z "$choice" ]; then
  read -p "Enter choice [1-6]: " choice
fi

case "$choice" in
  1|mac|run|desktop|"")
    echo "Starting FinGuard macOS Desktop App..."
    cd "$FRONTEND_DIR"
    npm run mac:run
    ;;
  2|apk|android)
    echo "Building Android Debug APK..."
    cd "$FRONTEND_DIR"
    npm run cap:sync
    cd "$FRONTEND_DIR/android"
    ./gradlew assembleDebug
    echo ""
    echo "SUCCESS: APK created at:"
    echo "$FRONTEND_DIR/android/app/build/outputs/apk/debug/app-debug.apk"
    ;;
  3|studio)
    echo "Opening Android Studio..."
    cd "$FRONTEND_DIR"
    npx cap open android
    ;;
  4|ios|xcode)
    echo "Opening Xcode (for iOS and Mac Catalyst)..."
    cd "$FRONTEND_DIR"
    npx cap open ios
    ;;
  5|sync)
    echo "Compiling Vite and syncing native assets..."
    cd "$FRONTEND_DIR"
    npm run cap:sync
    echo "Sync complete for Android and iOS."
    ;;
  6|exit|quit)
    echo "Exiting."
    exit 0
    ;;
  *)
    echo "Unrecognized option '$choice'. Defaulting to starting macOS Desktop App..."
    cd "$FRONTEND_DIR"
    npm run mac:run
    ;;
esac
