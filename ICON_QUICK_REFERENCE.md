# 🎨 App Icon Change - Quick Start

## 3 Easy Steps to Change Icon

### Step 1: Generate Icons Online (EASIEST)
Go to: **https://romannurik.github.io/AndroidAssetStudio/**
1. Click "Image Asset Studio"
2. Upload your icon image (512x512 PNG recommended)
3. Download the ZIP file with all sizes

### Step 2: Replace Icon Files
Extract the downloaded ZIP and copy these files:

**From ZIP → To Your Project:**
```
ic_launcher_mdpi.png        → android/app/src/main/res/mipmap-mdpi/ic_launcher.png
ic_launcher_foreground...   → android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png
ic_launcher_round...        → android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png

(Repeat for hdpi, xhdpi, xxhdpi, xxxhdpi)
```

### Step 3: Rebuild & Reinstall
```bash
# Build new APK
npm run build
npx cap sync
cd android
./gradlew clean
./gradlew assembleDebug

# Uninstall old app
adb uninstall com.gokul.stores

# Install new APK with new icon
adb install app/build/outputs/apk/debug/app-debug.apk
```

**Done!** Your app now has a new icon! 🎉

---

## Icon Size Reference

| Density | Size | Directory |
|---------|------|-----------|
| MDPI | 48x48 | mipmap-mdpi |
| HDPI | 72x72 | mipmap-hdpi |
| XHDPI | 96x96 | mipmap-xhdpi |
| XXHDPI | 144x144 | mipmap-xxhdpi |
| XXXHDPI | 192x192 | mipmap-xxxhdpi |

---

## Recommended Icon Ideas for Gokul Stores

🟢 **Leaf + Bag**: Green circle with white leaf + shopping bag
🟢 **Tomato**: Fresh red tomato with green leaf
🟢 **Store**: Green storefront with vegetables
🟢 **Cart**: Green shopping cart with leaf

---

## Troubleshooting

**Icon still shows old image?**
```bash
adb uninstall com.gokul.stores
adb shell pm clear com.gokul.stores
adb install app/build/outputs/apk/debug/app-debug.apk
```

**Need more help?** See `ICON_CHANGE_GUIDE.md` for detailed instructions.

---

**Icon is the first thing users see. Make it count!** ✨

