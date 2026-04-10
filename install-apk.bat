@echo off
REM Gokul Stores - Quick APK Installation Script
REM This script installs the APK directly to a connected Android device via ADB

echo.
echo ================================
echo Gokul Stores - APK Installer
echo ================================
echo.

REM Check if ADB is available
adb version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] ADB (Android Debug Bridge) not found!
    echo.
    echo Please ensure:
    echo 1. Android SDK is installed
    echo 2. ADB is in your system PATH
    echo 3. USB drivers for your device are installed
    echo.
    echo You can download ADB from: https://developer.android.com/tools/releases/platform-tools
    pause
    exit /b 1
)

echo [INFO] Checking for connected devices...
echo.
adb devices

echo.
echo Waiting for device connection...
adb wait-for-device

echo [INFO] Device detected! Installing APK...
echo.

REM Install the APK
adb install -r "dist-apk\gokul-stores-debug.apk"

if errorlevel 1 (
    echo.
    echo [ERROR] Installation failed!
    echo.
    echo Troubleshooting tips:
    echo - Enable USB Debugging on your device (Settings > Developer Options)
    echo - Try a different USB cable
    echo - Uninstall previous version: adb uninstall com.gokul.stores
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo [SUCCESS] APK installed successfully!
    echo.
    echo You can now:
    echo 1. Find "Gokul Stores" in your app drawer
    echo 2. Tap to launch the app
    echo 3. Sign in with your credentials
    echo.
    pause
)

