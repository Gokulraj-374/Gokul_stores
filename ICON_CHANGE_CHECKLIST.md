# ✅ App Icon Change Checklist

## Pre-Icon Creation
- [ ] Decide on icon design concept
- [ ] Create or download base image (512x512+)
- [ ] Format: PNG or SVG
- [ ] Square aspect ratio (1:1)
- [ ] Transparent background recommended

## Icon Generation (Using Android Asset Studio)
- [ ] Visit: https://romannurik.github.io/AndroidAssetStudio/
- [ ] Click "Image Asset Studio"
- [ ] Upload base image
- [ ] Configure icon settings (optional)
- [ ] Download ZIP with all generated sizes
- [ ] Extract ZIP file
- [ ] Verify all required files present:
  - [ ] ic_launcher.png files
  - [ ] ic_launcher_foreground.png files
  - [ ] ic_launcher_round.png files

## File Replacement
- [ ] Replace mipmap-mdpi files
  - [ ] ic_launcher.png
  - [ ] ic_launcher_foreground.png
  - [ ] ic_launcher_round.png
- [ ] Replace mipmap-hdpi files
  - [ ] ic_launcher.png
  - [ ] ic_launcher_foreground.png
  - [ ] ic_launcher_round.png
- [ ] Replace mipmap-xhdpi files
  - [ ] ic_launcher.png
  - [ ] ic_launcher_foreground.png
  - [ ] ic_launcher_round.png
- [ ] Replace mipmap-xxhdpi files
  - [ ] ic_launcher.png
  - [ ] ic_launcher_foreground.png
  - [ ] ic_launcher_round.png
- [ ] Replace mipmap-xxxhdpi files
  - [ ] ic_launcher.png
  - [ ] ic_launcher_foreground.png
  - [ ] ic_launcher_round.png

## Optional: Web Icons
- [ ] Update public/icon-192x192.png (optional)
- [ ] Update public/icon-512x512.png (optional)

## Build Process
- [ ] Build web app: `npm run build`
- [ ] Sync with Capacitor: `npx cap sync`
- [ ] Change to android directory: `cd android`
- [ ] Clean Gradle: `./gradlew clean`
- [ ] Build debug APK: `./gradlew assembleDebug`
- [ ] Verify APK built: Check `android/app/build/outputs/apk/debug/app-debug.apk`

## Installation Process
- [ ] Connect Android device (USB debugging enabled)
- [ ] Verify device connected: `adb devices`
- [ ] Uninstall old app: `adb uninstall com.gokul.stores`
- [ ] Clear app cache: `adb shell pm clear com.gokul.stores` (optional)
- [ ] Install new APK: `adb install android/app/build/outputs/apk/debug/app-debug.apk`
- [ ] Wait for installation to complete

## Verification
- [ ] Check device home screen
- [ ] Look for "Gokul Stores" app icon
- [ ] Verify icon image is correct
- [ ] Check icon appearance at different zoom levels
- [ ] Open app to confirm it launches
- [ ] Test basic functionality

## Troubleshooting (If Needed)
- [ ] Icon not showing? → Uninstall and reinstall
- [ ] Icon looks pixelated? → Check source resolution
- [ ] Wrong icon? → Verify file replacement in all directories
- [ ] Icon stretched? → Ensure square source image
- [ ] App won't install? → Check device has space, USB debugging enabled

## Additional Steps (Optional)
- [ ] Update app description with new icon mention
- [ ] Take screenshots with new icon
- [ ] Update Firebase hosting with new web icons (if changed)
- [ ] Update app version code if releasing to Play Store
- [ ] Create backup of old icons (before replacement)

## Release Preparation (When Ready)
- [ ] Decide on app version name/code
- [ ] Generate release APK: `./gradlew bundleRelease`
- [ ] Sign release APK if distributing
- [ ] Test release APK on device
- [ ] Update Play Store listing with new icon
- [ ] Deploy web app if icon changed: `npx firebase deploy --only hosting`

## Post-Deployment
- [ ] Verify app on device one more time
- [ ] Take marketing screenshots with new icon
- [ ] Update documentation if needed
- [ ] Announce new version to users
- [ ] Monitor app metrics for any issues

---

## Quick Command Reference

```bash
# Build & Sync
npm run build
npx cap sync

# Build APK
cd android
./gradlew clean
./gradlew assembleDebug

# Check Devices
adb devices

# Install/Reinstall
adb uninstall com.gokul.stores
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Or reinstall in one command
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# View Logs (if issues)
adb logcat | findstr "gokul"

# Clear Cache
adb shell pm clear com.gokul.stores
```

---

## Notes

Use this space to document:
- Icon design choices made
- Colors used
- Design inspiration
- Any modifications made
- Version history

```
Date: ________
Icon Design: ________________________
Colors: ________________________
Notes: ________________________
```

---

## Estimated Timeline

| Step | Time |
|------|------|
| Icon design/preparation | 10-20 min |
| Generate with tool | 2 min |
| File replacement | 5 min |
| Build & sync | 3 min |
| Build APK | 5 min |
| Install on device | 2 min |
| Verification | 2 min |
| **Total** | **~30 min** |

---

## Success Criteria

✅ Icon appears on device home screen  
✅ Icon image matches design  
✅ Icon not pixelated or distorted  
✅ App launches correctly  
✅ All features still work  
✅ Icon visible in app launcher  
✅ Icon displays at correct size  

---

**Start Here**: Follow this checklist in order for smooth icon change! 🎨

