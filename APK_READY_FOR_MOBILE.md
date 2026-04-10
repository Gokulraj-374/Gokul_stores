# 📱 Gokul Stores - APK Ready for Mobile Installation

## ✅ APK Build Complete!

**APK File:** `dist-apk/gokul-stores-debug.apk`
**Size:** 9.13 MB
**API Level:** 24+ (Android 7.0+)
**Build Date:** April 9, 2026

---

## 🚀 Quick Installation Methods

### **Option 1: Automatic Installation (Recommended for Windows)**

1. **Connect your Android phone via USB cable**
2. **Enable USB Debugging** on your phone:
   - Go to Settings → Developer Options → USB Debugging
   - (If Developer Options not visible: Settings → About Phone → tap Build Number 7 times)

3. **Run the installer:**
   ```bash
   # Double-click this file:
   install-apk.bat
   ```

4. **Wait for installation to complete** ✅

---

### **Option 2: Manual ADB Installation (Windows PowerShell)**

```powershell
# Navigate to project folder
cd C:\Users\Admin\Downloads\gokul-stores

# Check connected devices
adb devices

# Install APK
adb install -r "dist-apk/gokul-stores-debug.apk"

# Verify installation
adb shell pm list packages | findstr gokul
```

---

### **Option 3: Android Studio (Most Reliable)**

1. **Open Android Studio**
2. **Select Run → Run 'app'** (with device connected)
3. **Select your device** and click OK
4. **Wait for installation** ✅

---

### **Option 4: Cloud Storage Share**

1. **Upload APK to cloud storage:**
   - Google Drive
   - OneDrive
   - Dropbox
   - Any file hosting service

2. **Share the link** with your testers

3. **On mobile, download the file**

4. **Open file manager and tap the APK to install**

5. **Grant permission** when prompted

---

### **Option 5: Bluetooth/WiFi Transfer**

**Bluetooth:**
1. Enable Bluetooth on both devices
2. Right-click APK → Send To → Bluetooth Device
3. Select your phone
4. Accept on phone and install

**WiFi (Nearby Share):**
1. Use Windows 11 Nearby Share feature
2. Select your Android phone
3. Tap to install on phone

---

## 📋 Pre-Installation Checklist

### On Your Android Device:
- [ ] USB Debugging enabled (Settings → Developer Options)
- [ ] Device unlocked and connected via USB
- [ ] Sufficient storage (need ~50MB)
- [ ] Battery level > 20%
- [ ] Connected to internet (WiFi or mobile data)

### On Your Computer:
- [ ] ADB installed (if using manual method)
- [ ] USB drivers installed for your device
- [ ] APK file present in `dist-apk/` folder
- [ ] Internet connection available

---

## ⚡ Installation Troubleshooting

### "Device not found" / "No devices attached"
```bash
# Check connected devices
adb devices

# If device shows as "offline":
adb kill-server
adb start-server
adb devices
```

**Solution:** Unplug USB, re-plug, and authorize device when prompted

---

### "App not installed" error
```bash
# Uninstall previous version
adb uninstall com.gokul.stores

# Try installing again
adb install -r "dist-apk/gokul-stores-debug.apk"
```

---

### "Unknown sources" blocked
**On your phone:**
1. Go to Settings
2. Tap "Security" or "Apps"
3. Enable "Unknown sources" or "Allow from unknown sources"
4. Try installing again

---

### Build fails or APK not found
```bash
# Rebuild the APK
cd android
./gradlew.bat clean assembleDebug

# Check output
dir app\build\outputs\apk\debug\
```

---

## 📲 Post-Installation

### Launch the App
1. **Find "Gokul Stores"** in your app drawer
2. **Tap to open** the app
3. **First time?** → Sign up with email or Google
4. **Returning user?** → Sign in with your credentials

### Features Available:
✅ Browse products by category  
✅ Add items to cart  
✅ Order via WhatsApp  
✅ Save favorites to wishlist  
✅ Leave product reviews  
✅ Update your profile  
✅ View order history  

### Admin Access:
- **Only for authorized users** (manojponnaiyan151@gmail.com)
- Sign in to see admin dashboard
- Manage products and orders

---

## 🔍 Verify Installation

```bash
# Check if app is installed
adb shell pm list packages | findstr gokul

# Launch app from command line
adb shell am start -n com.gokul.stores/.MainActivity

# View app logs (for debugging)
adb logcat | findstr gokul
```

---

## 📊 APK Information

| Property | Value |
|----------|-------|
| **Package Name** | com.gokul.stores |
| **App Name** | Gokul Stores |
| **Version Code** | 1 |
| **Min SDK** | API 24 (Android 7.0) |
| **Target SDK** | API 34 (Android 14) |
| **Size** | 9.13 MB |
| **Type** | Debug APK |
| **Built** | April 9, 2026 |

---

## 🌐 Web Version

**Already available at:** https://gokul-stores.web.app

- No installation needed
- Instantly accessible
- Same features as mobile app
- Works offline (with PWA cache)

---

## 🔄 Updates & New Builds

To create a new APK with code changes:

```bash
# From project root
npm run build          # Build web assets
npx cap sync          # Sync with Android
cd android
./gradlew.bat assembleDebug  # Build new APK
```

---

## 🆘 Need Help?

### Common Issues:
1. **USB not connecting?** → Try different USB port or cable
2. **Slow installation?** → Check internet speed, retry
3. **App crashes?** → Clear app data: Settings → Apps → Gokul Stores → Clear Data
4. **Sign-in issues?** → Check internet, ensure email verified

### Debug Mode:
Enable verbose logging to troubleshoot:
```bash
adb shell setprop log.tag.gokul DEBUG
adb logcat -s gokul:*
```

---

## 📝 Notes

- **Debug APK:** For testing only, not for production
- **Not optimized:** Full debugging symbols included, larger file size
- **Security:** Uses debug signing key, not suitable for Play Store
- **Expiry:** No expiration, works as long as Android 7.0+ installed

**For production release APK**, contact the development team.

---

## ✨ Summary

1. ✅ **Build Complete** - APK ready in `dist-apk/`
2. ✅ **Web Deployed** - https://gokul-stores.web.app live
3. ✅ **Ready to Test** - Use install-apk.bat or ADB
4. ✅ **All Features Working** - Auth fixes, profile saving, admin access

**Next Step:** Run installation script and test on your device! 🚀

---

**Questions?** Check `APK_INSTALLATION_GUIDE.md` for detailed instructions.

**Report issues?** Share device logs using: `adb logcat > logs.txt`

