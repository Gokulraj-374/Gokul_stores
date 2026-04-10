# 📱 USB Debugging Installation Guide

## ⚠️ ADB Not Found on This Computer

**Status:** ADB (Android Debug Bridge) is not installed or not in the system PATH.

---

## ✅ SOLUTION OPTIONS

### **Option 1: Use One-Click Installer (Easiest - NO ADB NEEDED)**
```bash
Double-click: install-apk.bat
```
**This automatically handles everything!**

---

### **Option 2: Install ADB First (If You Want Manual Control)**

#### Step A: Download Android SDK Platform Tools
1. Visit: https://developer.android.com/tools/releases/platform-tools
2. Download for Windows
3. Extract to a folder (e.g., `C:\android-sdk\platform-tools`)

#### Step B: Add ADB to System PATH
1. Copy the full path to platform-tools folder
2. Windows Settings → Environment Variables
3. Click "Edit the system environment variables"
4. Click "Environment Variables" button
5. Under "System variables", find "Path" and click "Edit"
6. Click "New" and paste your platform-tools path
7. Click OK and restart your terminal

#### Step C: Verify ADB Installation
```bash
adb version
```
Should show ADB version info

---

### **Option 3: Direct Installation Without ADB Setup**

If you want to use manual installation without setting up ADB globally:

#### Step 1: Download Platform Tools
- Download from: https://developer.android.com/tools/releases/platform-tools
- Extract to: `C:\Users\Admin\Downloads\gokul-stores\platform-tools`

#### Step 2: Create Installation Batch File
Create a file named `install-with-local-adb.bat`:

```batch
@echo off
setlocal
set PLATFORM_TOOLS=platform-tools

echo Checking for connected devices...
%PLATFORM_TOOLS%\adb devices

echo.
echo Waiting for device...
%PLATFORM_TOOLS%\adb wait-for-device

echo.
echo Installing APK...
%PLATFORM_TOOLS%\adb install -r dist-apk\gokul-stores-debug.apk

if errorlevel 1 (
    echo.
    echo Installation failed! Check:
    echo - Device is connected
    echo - USB Debugging is enabled
    echo - You authorized the computer on your phone
) else (
    echo.
    echo SUCCESS! App installed on your phone!
)
pause
```

Save this file and run it!

---

## 🔧 MANUAL USB INSTALLATION STEPS

### **Step 1: Prepare Your Phone**
1. Go to Settings
2. Tap "About Phone"
3. Find "Build Number" and tap it 7 times
4. Message: "You are now a developer!"
5. Go back and open "Developer Options"
6. Enable "USB Debugging"
7. You'll see a security warning - tap "OK"

### **Step 2: Connect Phone to Computer**
1. Get a USB cable
2. Plug phone into computer
3. On your phone: When prompted, tap "Allow" to authorize the computer
4. **Important:** Make sure your phone is showing "USB Debugging Connected" status

### **Step 3: Install APK**

**Using the one-click script (EASIEST):**
```bash
Double-click: install-apk.bat
```

**Or manually with commands:**
```bash
cd C:\Users\Admin\Downloads\gokul-stores
adb install -r dist-apk/gokul-stores-debug.apk
```

### **Step 4: Wait for Installation**
- Watch the command window for progress
- Should see: "Success" or "Success. Installed on device."
- If error: See troubleshooting below

### **Step 5: Launch App**
1. Disconnect USB cable (optional)
2. Find "Gokul Stores" in your app drawer
3. Tap to open and enjoy!

---

## ✅ QUICK VERIFICATION CHECKLIST

Before installation, verify:

- [ ] **Phone is unlocked**
- [ ] **USB Debugging is enabled** (Settings → Developer Options)
- [ ] **USB cable is working** (try different port/cable if needed)
- [ ] **Phone is in "File Transfer" or "MTP" mode** (not "Charge Only")
- [ ] **APK file exists** at `dist-apk/gokul-stores-debug.apk`
- [ ] **Install script exists** at `install-apk.bat`

---

## 🆘 TROUBLESHOOTING

### "Device not found" / "No devices attached"

**Solution 1: Check Physical Connection**
```bash
adb devices
```
If nothing appears:
- Try different USB port
- Try different USB cable
- Try different phone USB connector

**Solution 2: Authorize Computer**
- Disconnect and reconnect
- Look on your phone screen
- Tap "Allow" to authorize this computer
- Should show "device" in adb devices list

**Solution 3: Restart ADB Server**
```bash
adb kill-server
adb start-server
adb devices
```

**Solution 4: Update USB Drivers**
- Download your phone's USB drivers
- Install them on your computer
- Reconnect phone

---

### "Installation failed" / "App not installed"

**Solution 1: Uninstall Previous Version**
```bash
adb uninstall com.gokul.stores
adb install -r dist-apk/gokul-stores-debug.apk
```

**Solution 2: Check Storage**
- Phone needs 50+ MB free space
- Delete some files if needed

**Solution 3: Check Permissions**
- Go to Settings → Apps
- Find any app named "Gokul Stores"
- Uninstall it completely
- Try installing again

**Solution 4: Enable Unknown Sources** (Android 5-10)
- Settings → Security
- Enable "Unknown sources"
- Try installing again

---

### "Permission denied" when running script

**Solution:**
- Right-click `install-apk.bat`
- Select "Run as administrator"
- Try again

---

## 📊 ADB USEFUL COMMANDS

Once ADB is working:

```bash
# List connected devices
adb devices

# Install APK
adb install -r dist-apk/gokul-stores-debug.apk

# Uninstall app
adb uninstall com.gokul.stores

# Launch app
adb shell am start -n com.gokul.stores/.MainActivity

# View logs
adb logcat | findstr gokul

# Get device info
adb shell getprop ro.build.version.release

# Clear app cache
adb shell pm clear com.gokul.stores
```

---

## 🌐 ALTERNATIVE: Use Web Version (No Installation Needed!)

If USB installation is too complicated, just use the web version:

**Visit:** https://gokul-stores.web.app

- ✅ Full features available
- ✅ No installation needed
- ✅ Works on any device with browser
- ✅ Can add to home screen for app-like experience

---

## 🎯 RECOMMENDED PATH

### **For Most Users:**
1. ✅ Double-click `install-apk.bat`
2. ✅ Done! App is installed.

### **If That Doesn't Work:**
1. Enable USB Debugging on phone
2. Connect via USB cable
3. Try the one-click script again
4. Check troubleshooting section

### **If Still Having Issues:**
1. Use web version: https://gokul-stores.web.app
2. All features available without installation
3. Consider downloading ADB separately if needed

---

## 📞 HELP RESOURCES

### Official Resources:
- Android Debugging: https://developer.android.com/studio/debug/adb
- Platform Tools Download: https://developer.android.com/tools/releases/platform-tools
- Firebase Setup: https://console.firebase.google.com/

### Quick References:
- See: `APK_QUICK_REFERENCE.md`
- See: `INSTALLATION_STEPS.md`
- See: `APK_READY_FOR_MOBILE.md`

---

## ✨ SUMMARY

**Easiest Way:** `install-apk.bat` (double-click)

**If ADB is installed:**
```bash
adb devices
adb install -r dist-apk/gokul-stores-debug.apk
```

**If ADB not available:**
- Use web version: https://gokul-stores.web.app
- Or download ADB from Google
- Or use automatic script

---

**Status:** ✅ Ready to proceed with your preferred method!

**Questions?** Check the other documentation files or try the web version!

