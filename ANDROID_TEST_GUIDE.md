# Android Testing Guide - Gokul Stores

**APK File:** `dist-apk/gokul-stores-debug.apk` (10.18 MB)  
**Date:** April 10, 2026

---

## 🚀 Quick Start (USB Debugging Method)

### Step 1: Enable USB Debugging on Android Device

1. **Open Settings** on your Android phone
2. Navigate to **About Phone**
3. Tap **Build Number** 7 times (until you see "You are now a developer" message)
4. Go back to **Settings → Developer Options**
5. Enable **USB Debugging**
6. When prompted, tap **Allow** to authorize your computer

### Step 2: Connect Device via USB

1. Connect your Android phone to your computer via USB cable
2. Select **File Transfer** mode (not charging only)
3. Your device should now appear in ADB

### Step 3: Verify ADB Connection

```powershell
adb devices
```

**Expected Output:**
```
List of attached devices
xxxxx           device
```

If you see "unauthorized", tap **Allow** on your phone's authorization prompt.

### Step 4: Install the APK

```powershell
cd C:\Users\Admin\Downloads\gokul-stores
adb install dist-apk/gokul-stores-debug.apk
```

**Success Message:**
```
Success
```

If you get an error, see the **Troubleshooting** section below.

---

## ✅ Testing Checklist

After installation, perform these tests:

### Functional Tests

- [ ] **App Launch** - App opens without crashing
- [ ] **Home Page** - Products load and display correctly
- [ ] **Product Browse** - Scroll through products smoothly
- [ ] **Product Search** - Search functionality works
- [ ] **Add to Cart** - Items can be added to cart
- [ ] **Cart View** - View cart contents
- [ ] **Product Details** - Tap product to view details
- [ ] **Navigation** - All navigation menus work
- [ ] **Checkout** - Checkout flow works (if enabled)

### Performance Tests

- [ ] **App Response** - No freezing or delays
- [ ] **Image Loading** - Images load quickly
- [ ] **Navigation Speed** - Page transitions are smooth
- [ ] **Memory** - App doesn't crash after extended use

### Firebase Integration

- [ ] **Data Loading** - Products load from Firebase
- [ ] **Authentication** - Login/signup works (if enabled)
- [ ] **Real-time Updates** - New data syncs properly

### Device Features

- [ ] **Rotation** - App works in portrait and landscape
- [ ] **Touch** - All buttons and inputs are responsive
- [ ] **Back Button** - Android back button works correctly
- [ ] **Screen Sizes** - UI scales properly on different screens

---

## 🔍 How to Debug & View Logs

### View Real-Time Logs

```powershell
adb logcat
```

### View Logs for Your App Only

```powershell
adb logcat | findstr "gokul"
```

### Save Logs to File

```powershell
adb logcat > C:\Users\Admin\Downloads\gokul-stores\logs.txt
```

Then press `Ctrl+C` to stop logging.

---

## 📊 Performance Monitoring

### Check App Memory Usage

```powershell
adb shell "dumpsys meminfo com.ionicframework.gokul_stores_app"
```

### Record Performance Trace

```powershell
adb shell "perfetto --out=/data/local/tmp/trace.perfetto-trace" &
# Use app for 10-30 seconds
# Press Ctrl+C to stop
adb pull /data/local/tmp/trace.perfetto-trace
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Command not found: adb"
**Solution:**
1. Install Android SDK Platform Tools from: https://developer.android.com/studio/releases/platform-tools
2. Add to PATH or use full path: `C:\path\to\platform-tools\adb.exe`

### Issue 2: "Device not found" / "unauthorized"
**Solution:**
1. Disconnect and reconnect USB cable
2. On your phone, dismiss the authorization dialog and tap **Always allow from this computer**
3. Run: `adb kill-server` then `adb devices` again

### Issue 3: "Installation failed" / "INSTALL_FAILED_UPDATE_INCOMPATIBLE"
**Solution:**
```powershell
# Uninstall existing version first
adb uninstall com.ionicframework.gokul_stores_app

# Then install again
adb install dist-apk/gokul-stores-debug.apk
```

### Issue 4: App Crashes on Launch
**Solution:**
1. Check logs: `adb logcat | findstr "ERROR\|Exception"`
2. Verify Firebase configuration
3. Check internet connection on phone
4. Try clearing app data: `adb shell pm clear com.ionicframework.gokul_stores_app`

### Issue 5: App Won't Respond / Freezes
**Solution:**
1. Force stop: `adb shell am force-stop com.ionicframework.gokul_stores_app`
2. Clear cache: `adb shell pm clear --cache com.ionicframework.gokul_stores_app`
3. Reinstall the APK

---

## 🎯 Test Scenarios

### Scenario 1: First Time User
1. Install and launch app
2. Browse products on home page
3. Search for a specific product
4. View product details
5. Add item to cart
6. View cart

### Scenario 2: Network Connectivity
1. Launch app with WiFi on
2. Turn off WiFi
3. Try to load products (should show cached or error message)
4. Turn WiFi back on
5. Verify data syncs

### Scenario 3: Extended Usage
1. Keep app open for 5+ minutes
2. Scroll through multiple pages
3. Switch between different sections
4. Check memory usage doesn't spike

### Scenario 4: Device Orientation
1. Launch app in portrait mode
2. Rotate to landscape
3. Use app in landscape mode
4. Rotate back to portrait
5. Verify UI renders correctly

---

## 📱 Device Requirements

- **Android Version:** Android 5.0+ (API 21+)
- **RAM:** 2GB minimum (4GB recommended)
- **Storage:** 100MB free space
- **Internet:** WiFi or mobile data required

---

## 📝 Testing Report Template

```markdown
## Test Report - Gokul Stores APK

**Date:** [Date]
**Device:** [Brand/Model]
**Android Version:** [Version]
**APK Version:** gokul-stores-debug.apk
**Tester:** [Your Name]

### Installation
- [ ] Successfully installed via ADB
- [ ] Installation time: __ seconds
- [ ] App size on device: __ MB

### Functional Testing
- [ ] App launches without crash
- [ ] Home page loads with products
- [ ] Products display correctly
- [ ] Search functionality works
- [ ] Add to cart works
- [ ] Navigation smooth and responsive

### Issues Found
1. [Issue 1]
2. [Issue 2]
3. [Issue 3]

### Overall Status
- [ ] PASS (All tests passed)
- [ ] PASS WITH MINOR ISSUES
- [ ] FAIL (Critical issues found)

### Comments
[Your observations]
```

---

## 🔄 Uninstall Instructions

### Uninstall via ADB

```powershell
adb uninstall com.ionicframework.gokul_stores_app
```

### Uninstall Manually on Device

1. Go to **Settings → Apps**
2. Find **Gokul Stores**
3. Tap **Uninstall**

---

## 📞 Additional Commands

### Reinstall Without Uninstalling

```powershell
adb install -r dist-apk/gokul-stores-debug.apk
```

### Launch App from ADB

```powershell
adb shell am start -n com.ionicframework.gokul_stores_app/com.ionicframework.gokul_stores_app.MainActivity
```

### Get App Package Info

```powershell
adb shell dumpsys package com.ionicframework.gokul_stores_app
```

### Clear All App Data

```powershell
adb shell pm clear com.ionicframework.gokul_stores_app
```

---

## ✨ Tips for Successful Testing

1. **Test on Multiple Devices** - Different screen sizes, Android versions
2. **Test Network Scenarios** - WiFi, 4G, offline mode
3. **Monitor Logs** - Keep logcat open while using the app
4. **Test Edge Cases** - Empty carts, network timeouts, low memory
5. **Performance** - Use device monitor to track memory and CPU
6. **Document Issues** - Take screenshots and note exact steps to reproduce

---

## 🚀 Ready to Test!

Your APK is ready. Follow the steps above and enjoy testing! 

**Questions?** Check the troubleshooting section or review the logs for detailed error messages.

Good luck! 🎉

