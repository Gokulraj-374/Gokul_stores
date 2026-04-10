@echo off
REM Gokul Stores - USB Debugging APK Installation (Auto-detects ADB)
REM This script will find and use ADB from common locations

setlocal enabledelayedexpansion

echo.
echo ════════════════════════════════════════════════════════
echo  Gokul Stores - APK Installation via USB Debugging
echo ════════════════════════════════════════════════════════
echo.

REM Try to find ADB in common locations
set ADB_FOUND=0
set ADB_PATH=

REM Check if ADB is in PATH
where adb >nul 2>&1
if !errorlevel! equ 0 (
    set ADB_PATH=adb
    set ADB_FOUND=1
    echo [SUCCESS] Found ADB in system PATH
    goto found_adb
)

REM Check Android SDK default location
if exist "C:\Android\sdk\platform-tools\adb.exe" (
    set ADB_PATH=C:\Android\sdk\platform-tools\adb.exe
    set ADB_FOUND=1
    echo [SUCCESS] Found ADB at C:\Android\sdk
    goto found_adb
)

REM Check Android Studio default location
if exist "C:\Users\%USERNAME%\AppData\Local\Android\Sdk\platform-tools\adb.exe" (
    set ADB_PATH=C:\Users\%USERNAME%\AppData\Local\Android\Sdk\platform-tools\adb.exe
    set ADB_FOUND=1
    echo [SUCCESS] Found ADB in Android Studio directory
    goto found_adb
)

REM Check Program Files
if exist "C:\Program Files\Android\platform-tools\adb.exe" (
    set ADB_PATH=C:\Program Files\Android\platform-tools\adb.exe
    set ADB_FOUND=1
    echo [SUCCESS] Found ADB at Program Files
    goto found_adb
)

REM ADB not found in any location
if !ADB_FOUND! equ 0 (
    echo [ERROR] ADB not found in system PATH or common locations!
    echo.
    echo To fix this:
    echo 1. Download Android SDK Platform Tools from:
    echo    https://developer.android.com/tools/releases/platform-tools
    echo.
    echo 2. Extract to a folder and add it to system PATH
    echo.
    echo 3. Or use the one-click installer: install-apk.bat
    echo.
    echo 4. Or use the web version: https://gokul-stores.web.app
    echo.
    pause
    exit /b 1
)

:found_adb

REM Verify APK file exists
if not exist "dist-apk\gokul-stores-debug.apk" (
    echo [ERROR] APK file not found at: dist-apk\gokul-stores-debug.apk
    echo.
    echo Please ensure you are running this from the project root directory.
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════
echo  IMPORTANT: Prepare Your Phone
echo ════════════════════════════════════════════════════════
echo.
echo 1. Go to Settings ^> Developer Options
echo 2. Enable "USB Debugging"
echo 3. Connect your phone via USB cable
echo 4. When prompted on phone, tap "Allow" to authorize
echo.
echo Press ENTER to continue...
pause

echo.
echo Checking for connected devices...
"%ADB_PATH%" devices

echo.
echo Waiting for device to be recognized...
"%ADB_PATH%" wait-for-device

echo.
echo Device found! Installing APK...
"%ADB_PATH%" install -r "dist-apk\gokul-stores-debug.apk"

if errorlevel 1 (
    echo.
    echo ════════════════════════════════════════════════════════
    echo  [ERROR] Installation Failed
    echo ════════════════════════════════════════════════════════
    echo.
    echo Troubleshooting steps:
    echo 1. Ensure USB Debugging is enabled on your phone
    echo 2. Make sure you tapped "Allow" on the device authorization prompt
    echo 3. Try uninstalling first:
    echo    %ADB_PATH% uninstall com.gokul.stores
    echo 4. Then try installing again
    echo 5. Or use the web version: https://gokul-stores.web.app
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo ════════════════════════════════════════════════════════
    echo  [SUCCESS] Installation Complete!
    echo ════════════════════════════════════════════════════════
    echo.
    echo Your Gokul Stores app is now installed on your phone!
    echo.
    echo Next steps:
    echo 1. Find "Gokul Stores" in your app drawer
    echo 2. Tap to open the app
    echo 3. Sign in with your credentials
    echo 4. Start shopping!
    echo.
    echo You can disconnect the USB cable now.
    echo.
    pause
)

