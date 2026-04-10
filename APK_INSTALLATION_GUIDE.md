# APK Distribution & Mobile Installation Guide

## Building the APK

### Via Android Studio (Recommended)
1. Open the `android` folder in Android Studio
2. Select **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. Wait for the build to complete
4. APK will be located at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Via Command Line (Gradle)
```bash
cd android
./gradlew assembleDebug    # For debug APK
./gradlew assembleRelease  # For release APK
```

**Output locations:**
- Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release APK: `android/app/build/outputs/apk/release/app-release.apk`

---

## Methods to Send APK to Mobile Device

### **Method 1: USB Debugging (Most Reliable)**
1. **Enable USB Debugging on Android Device:**
   - Go to Settings → Developer Options → Enable USB Debugging
   - Connect phone via USB cable

2. **Install via ADB (Android Debug Bridge):**
   ```bash
   adb devices                    # Verify device is connected
   adb install app-debug.apk      # Install the APK
   ```

3. **Verify Installation:**
   ```bash
   adb shell pm list packages | grep "gokul"
   ```

### **Method 2: QR Code Installation**
1. Generate QR code for your APK file:
   - Use a QR code generator (e.g., https://qrcode.com)
   - Point to the Firebase Hosting APK link or local server
   
2. Scan QR code on mobile and download/install

### **Method 3: Firebase App Distribution (Recommended for Testing)**
1. Set up Firebase App Distribution in your project
2. Upload APK to Firebase Console
3. Invite testers via email
4. Testers receive installation link

### **Method 4: WhatsApp/Email Share**
1. Upload APK to cloud storage (Google Drive, OneDrive)
2. Share link via WhatsApp or Email
3. Download on mobile and install
4. **May need to enable "Unknown sources" in Settings**

### **Method 5: Local Network Share**
1. Start a simple HTTP server on your computer:
   ```bash
   # Using Python
   cd path/to/apk/folder
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

2. On mobile, navigate to: `http://<YOUR_PC_IP>:8000/app-debug.apk`
3. Download and install

---

## APK Installation Requirements

### Device Requirements:
- ✅ Android 7.0+ (API level 24+)
- ✅ Minimum 50MB free storage
- ✅ Internet connection (for app functionality)

### Before Installation:
- [ ] Enable "Unknown sources" in Settings > Security (for non-Play Store apps)
- [ ] Create a backup of important data
- [ ] Ensure device has sufficient battery (>30%)

### Troubleshooting:
| Issue | Solution |
|-------|----------|
| "App not installed" | Uninstall previous version: `adb uninstall com.gokul.stores` |
| "Unknown sources" blocked | Go to Settings > Apps > Allow from unknown sources |
| Build fails | Run `./gradlew clean assembleDebug` |
| Device not detected | Install Android USB drivers or try different cable |

---

## Current Build Status

**Latest Build:** April 9, 2026
**Web Assets:** Synced to Android ✅
**Next Step:** Start build process

### Build Commands:
```bash
# From project root directory
cd android

# Build debug APK (for testing)
./gradlew.bat assembleDebug

# Build release APK (for production)
./gradlew.bat assembleRelease

# Install directly to connected device
./gradlew.bat installDebug
```

---

## APK Specifications

| Property | Value |
|----------|-------|
| App Name | Gokul Stores |
| Package | com.gokul.stores |
| Min SDK | 24 (Android 7.0) |
| Target SDK | 34 (Android 14) |
| Size (Approx.) | 25-35 MB |
| Languages | English |

---

## Security & Signing

### Debug APK:
- Signed with debug key automatically
- For testing only
- Cannot be published to Play Store

### Release APK:
- Must be signed with a release key
- Setup: `android/app/release/` folder
- File: `gokul-stores-release-key.jks`

---

## Next Steps

1. ✅ **Web app updated and deployed** - https://gokul-stores.web.app
2. ✅ **Android synced with latest web code**
3. **→ Build APK** (using method above)
4. **→ Test on device** (using method of choice)
5. **→ Fix any issues** (if any)
6. **→ Deploy to Play Store** (when ready for production)

---

## Support

If you need help with:
- APK build errors: Check `android/app/build.log`
- Device connection: Ensure USB drivers installed
- Firebase auth issues: Check browser console at https://gokul-stores.web.app

---

**Ready to proceed with APK installation? Let me know which method you prefer!**

