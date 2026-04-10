# 🎨 Gokul Stores - App Icon Change Guide

## Quick Overview

The Gokul Stores app currently uses the default Capacitor icon. You can easily change it to a custom icon following this guide.

---

## 📂 Icon File Locations

### Android Icon Directories

App icons are stored in multiple directories for different screen densities:

```
android/app/src/main/res/
├── mipmap-mdpi/           (48x48 pixels)
│   ├── ic_launcher.png
│   ├── ic_launcher_foreground.png
│   └── ic_launcher_round.png
├── mipmap-hdpi/           (72x72 pixels)
│   ├── ic_launcher.png
│   ├── ic_launcher_foreground.png
│   └── ic_launcher_round.png
├── mipmap-xhdpi/          (96x96 pixels)
│   ├── ic_launcher.png
│   ├── ic_launcher_foreground.png
│   └── ic_launcher_round.png
├── mipmap-xxhdpi/         (144x144 pixels)
│   ├── ic_launcher.png
│   ├── ic_launcher_foreground.png
│   └── ic_launcher_round.png
├── mipmap-xxxhdpi/        (192x192 pixels)
│   ├── ic_launcher.png
│   ├── ic_launcher_foreground.png
│   └── ic_launcher_round.png
├── mipmap-anydpi-v26/     (Adaptive icon, Android 8+)
│   ├── ic_launcher.xml
│   └── ic_launcher_round.xml
└── drawable-v24/
    ├── ic_launcher_background.xml
    └── ic_launcher_foreground.xml
```

---

## 🎨 Method 1: Use Android Asset Studio (Easiest)

### Step 1: Visit the Tool
Go to: https://romannurik.github.io/AndroidAssetStudio/

### Step 2: Upload Your Image
1. Click "Image Asset Studio"
2. Upload your icon image (PNG, JPG, SVG)
3. The tool will generate all required sizes

### Step 3: Download
1. Click "Download" ZIP
2. Extract the files
3. Copy to `android/app/src/main/res/`

### Step 4: Rebuild
```bash
npm run build
npx cap sync
cd android && ./gradlew clean
./gradlew assembleDebug
```

---

## 🎨 Method 2: Manual PNG Replacement

### Step 1: Prepare Your Icon Images

Create or find icon images in these sizes:

- **mdpi**: 48x48 pixels
- **hdpi**: 72x72 pixels
- **xhdpi**: 96x96 pixels
- **xxhdpi**: 144x144 pixels
- **xxxhdpi**: 192x192 pixels

### Step 2: Rename Files

Name them as:
- `ic_launcher.png` (background)
- `ic_launcher_foreground.png` (foreground, transparent background)
- `ic_launcher_round.png` (rounded version)

### Step 3: Replace Icons

Replace files in each mipmap directory:

```bash
# Replace MDPI icons
copy your_icon_48.png "android/app/src/main/res/mipmap-mdpi/ic_launcher.png"
copy your_icon_foreground_48.png "android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png"
copy your_icon_round_48.png "android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png"

# Repeat for hdpi, xhdpi, xxhdpi, xxxhdpi
```

### Step 4: Rebuild App

```bash
npm run build
npx cap sync
cd android && ./gradlew assembleDebug
```

---

## 🎨 Method 3: Using ImageMagick (Command Line)

### Prerequisites
```bash
# Install ImageMagick
choco install imagemagick
```

### Create Icon from SVG

If you have an SVG file:

```bash
# Create MDPI (48x48)
magick convert -background none your_icon.svg -density 300 -resize 48x48 mipmap-mdpi/ic_launcher.png

# Create HDPI (72x72)
magick convert -background none your_icon.svg -density 300 -resize 72x72 mipmap-hdpi/ic_launcher.png

# Create XHDPI (96x96)
magick convert -background none your_icon.svg -density 300 -resize 96x96 mipmap-xhdpi/ic_launcher.png

# Create XXHDPI (144x144)
magick convert -background none your_icon.svg -density 300 -resize 144x144 mipmap-xxhdpi/ic_launcher.png

# Create XXXHDPI (192x192)
magick convert -background none your_icon.svg -density 300 -resize 192x192 mipmap-xxxhdpi/ic_launcher.png
```

---

## 🎨 Method 4: Using Online Icon Generator

### Option A: Launcher Icon Generator
https://www.appicon.co/

1. Upload your icon (512x512 PNG recommended)
2. Select "Android"
3. Download the generated assets
4. Extract and copy to `android/app/src/main/res/`

### Option B: MakeAppIcon
https://makeappicon.com/

1. Upload image (1024x1024 or larger)
2. Generate icons
3. Download Android package
4. Extract to `android/app/src/main/res/`

---

## 📝 Icon Design Recommendations

### Color Scheme
- **Primary**: Emerald Green (#059669) - matches app branding
- **Secondary**: White/Light colors
- **Background**: Solid color or transparent

### Icon Concepts for Gokul Stores

1. **Leaf + Shopping Bag**
   - Leaf for "fresh groceries"
   - Shopping bag for "e-commerce"

2. **Green Vegetable/Produce**
   - Tomato, pepper, or leafy vegetables
   - Represents fresh items

3. **Shopping Cart**
   - Classic cart with green color
   - Clear and recognizable

4. **Store/Market Building**
   - Storefront silhouette
   - With fresh produce elements

### Design Tips
- Keep it simple and recognizable at small sizes
- Use solid colors (no complex gradients)
- Ensure good contrast
- Add safe padding around edges
- Test on different devices

---

## 🔧 Rebuild & Test

### Step 1: Sync with Capacitor
```bash
npm run build
npx cap sync
```

### Step 2: Clean Gradle Cache
```bash
cd android
./gradlew clean
```

### Step 3: Build Debug APK
```bash
./gradlew assembleDebug
```

### Step 4: Install on Device
```bash
adb uninstall com.gokul.stores
adb install "app/build/outputs/apk/debug/app-debug.apk"
```

### Step 5: Verify
Check your device home screen - the new icon should appear!

---

## 🐛 Troubleshooting

### Icon Not Updating

**Problem**: App icon still shows old icon after installation

**Solution**:
1. Uninstall app completely: `adb uninstall com.gokul.stores`
2. Clear cache: `adb shell pm clear com.gokul.stores`
3. Rebuild: `./gradlew clean assembleDebug`
4. Reinstall: `adb install app/build/outputs/apk/debug/app-debug.apk`

### Icon Looks Pixelated

**Problem**: Icon appears blurry or pixelated

**Solution**:
- Make sure you're using the correct resolution for each density
- Create icons at 2x the specified size first, then resize down
- Use anti-aliasing when resizing

### Wrong Icon Showing

**Problem**: Showing wrong icon file

**Solution**:
- Check all directories have updated icons
- Verify file names match exactly: `ic_launcher.png`, `ic_launcher_foreground.png`, `ic_launcher_round.png`
- Check adaptive icon settings in `mipmap-anydpi-v26/ic_launcher.xml`

### Icon Not Square

**Problem**: Icon appears stretched or distorted

**Solution**:
- Ensure source image is square (1:1 aspect ratio)
- Use correct dimensions for each density
- Center content with safe margins

---

## 📋 Icon Requirements Checklist

- [ ] Icon is square (1:1 aspect ratio)
- [ ] All required sizes created:
  - [ ] mdpi (48x48)
  - [ ] hdpi (72x72)
  - [ ] xhdpi (96x96)
  - [ ] xxhdpi (144x144)
  - [ ] xxxhdpi (192x192)
- [ ] Files named correctly:
  - [ ] ic_launcher.png
  - [ ] ic_launcher_foreground.png
  - [ ] ic_launcher_round.png
- [ ] Placed in correct directories
- [ ] App rebuilt: `npm run build && npx cap sync`
- [ ] Gradle cleaned: `./gradlew clean`
- [ ] APK rebuilt: `./gradlew assembleDebug`
- [ ] Old app uninstalled: `adb uninstall com.gokul.stores`
- [ ] New APK installed: `adb install ...apk`
- [ ] Icon verified on device

---

## 🎨 Quick Icon Designs

### Design 1: Simple Green Leaf
```
- Green circle background (#059669)
- White leaf in center
- Simple and clean
- Good at all sizes
```

### Design 2: Shopping Bag + Leaf
```
- Green circle background (#059669)
- White shopping bag with leaf inside
- Represents e-commerce + fresh produce
- Professional look
```

### Design 3: Tomato/Vegetable
```
- Red/orange tomato or vegetable
- Green leaf on top
- Clear and recognizable
- Represents fresh groceries
```

---

## 📞 Icon Resources

### Online Tools
- Android Asset Studio: https://romannurik.github.io/AndroidAssetStudio/
- AppIcon.co: https://www.appicon.co/
- MakeAppIcon: https://makeappicon.com/
- Figma: https://www.figma.com/ (design tool)
- Canva: https://www.canva.com/ (simple design)

### Icon Libraries
- Material Icons: https://material.io/icons
- Flaticon: https://www.flaticon.com/
- Noun Project: https://thenounproject.com/
- FreePik: https://www.freepik.com/

### Design Tools
- Figma: Professional design tool
- Photoshop: Advanced image editing
- GIMP: Free open-source editor
- Inkscape: Free vector editor (SVG)

---

## 📱 Web App Icon (Optional)

You can also change the PWA icon for the web version:

### Location
```
public/icon-192x192.png  (192x192)
public/icon-512x512.png  (512x512)
```

### Steps
1. Create/prepare new icons
2. Replace files in `public/`
3. Rebuild: `npm run build`
4. Redeploy: `npx firebase deploy --only hosting`

---

## ✅ Icon Change Summary

**What Changed**: App icon
**Files Modified**: Android mipmap directories
**Rebuild Required**: Yes
**Reinstall Required**: Yes
**Backup Original**: Recommended

---

## 📝 Next Steps

1. **Choose a method** (easiest: Android Asset Studio)
2. **Create/prepare icons** in required sizes
3. **Replace icon files** in mipmap directories
4. **Rebuild app** with `npm run build && npx cap sync`
5. **Build APK** with `./gradlew assembleDebug`
6. **Reinstall** on device: `adb install -r ...apk`
7. **Verify** icon appears on home screen

---

**Happy icon designing!** 🎨✨

Document Version: 1.0  
Last Updated: April 7, 2026

