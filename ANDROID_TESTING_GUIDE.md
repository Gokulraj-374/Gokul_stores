# Android App Testing & Deployment Guide

## Testing on Android Device

### Prerequisites
- Android device or emulator (API level 24+)
- Android Studio installed
- USB cable (for physical device)
- ADB (Android Debug Bridge) installed

### Method 1: Using Android Studio Emulator

1. **Open Android Project**
   ```bash
   cd android
   ```

2. **Open in Android Studio**
   - File → Open → Select `gokul-stores/android` folder

3. **Create Virtual Device**
   - Tools → AVD Manager
   - Create new device
   - Select device (Pixel 4, etc.)
   - Select Android API 30+ (recommended)
   - Finish

4. **Run Debug APK**
   - Run → Run 'app'
   - Select emulator from device list
   - Wait for app to load

5. **Test Features**
   - Browse products
   - Add to cart
   - Sign in with Google (requires configured credentials)
   - Place WhatsApp order
   - Access admin features

### Method 2: Physical Device

1. **Enable Developer Mode**
   - Go to Settings → About Phone
   - Tap Build Number 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. **Connect Device**
   ```bash
   adb devices
   ```
   - Should see your device listed

3. **Install Debug APK**
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

4. **Grant Permissions**
   - Allow USB debugging on device
   - Grant permissions in app
   - Allow push notifications (if configured)

5. **Test on Device**
   - Open Gokul Stores app
   - Test all features
   - Check performance and responsiveness

### Method 3: Via Android Studio Build

1. **Build & Run**
   ```bash
   cd android
   ./gradlew assembleDebug
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

2. **Monitor Logcat**
   - View → Tool Windows → Logcat
   - Filter by "gokul" or app package name
   - Check for errors and warnings

## Testing Checklist

### UI/UX Testing
- [ ] Homepage loads with banner and categories
- [ ] Categories display correctly
- [ ] Product grid shows all items
- [ ] Search functionality works
- [ ] Product details visible
- [ ] Rating system responsive

### Cart & Checkout
- [ ] Add to cart works
- [ ] Quantity adjustment works
- [ ] Remove item works
- [ ] Cart total calculates correctly
- [ ] WhatsApp order button visible
- [ ] Order confirmation displayed

### User Features
- [ ] Google Sign-In works
- [ ] Profile screen loads
- [ ] Profile update saves
- [ ] Order history displays
- [ ] Previous orders visible
- [ ] Sign out works

### Admin Features
- [ ] Login with admin email
- [ ] Admin dashboard accessible
- [ ] Products tab shows all items
- [ ] Edit product works
- [ ] Add product works
- [ ] Orders tab shows orders
- [ ] Order status update works
- [ ] Seed DB button works

### Mobile-Specific
- [ ] App installs and launches
- [ ] Rotation works (portrait/landscape)
- [ ] Back button navigation works
- [ ] Status bar visible
- [ ] Safe area respected
- [ ] Images load properly
- [ ] Keyboard doesn't hide inputs
- [ ] Smooth scrolling

### Performance
- [ ] App loads in < 3 seconds
- [ ] Scrolling is smooth (60 FPS)
- [ ] Taps respond immediately
- [ ] No crashes on rotation
- [ ] Firebase sync working
- [ ] Images cached locally

### Firebase Integration
- [ ] Real-time data updates
- [ ] Products sync from Firestore
- [ ] Orders saved to database
- [ ] User profiles created
- [ ] Authentication persists
- [ ] Offline fallback works

## Deployment to Google Play Store

### Prerequisites
1. **Google Play Account**
   - Create at https://play.google.com/console
   - Pay $25 registration fee
   - Accept agreements

2. **Signing Key**
   ```bash
   keytool -genkey -v -keystore ~/release-key.jks \
   -keyalg RSA -keysize 2048 -validity 10000 \
   -alias upload-key
   ```

3. **Store Key Securely**
   - Backup `release-key.jks`
   - Store password safely
   - Never commit to git

### Build Release APK

1. **Configure Signing**
   - Edit `android/app/build.gradle`
   - Add signingConfigs section

   ```gradle
   signingConfigs {
     release {
       storeFile file("../release-key.jks")
       storePassword System.getenv("KEYSTORE_PASSWORD")
       keyAlias System.getenv("KEY_ALIAS")
       keyPassword System.getenv("KEY_PASSWORD")
     }
   }
   
   buildTypes {
     release {
       signingConfig signingConfigs.release
       minifyEnabled true
       proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
     }
   }
   ```

2. **Build Release APK**
   ```bash
   export KEYSTORE_PASSWORD=your_keystore_password
   export KEY_ALIAS=upload-key
   export KEY_PASSWORD=your_key_password
   
   cd android
   ./gradlew assembleRelease
   ```

   Output: `app/build/outputs/apk/release/app-release.apk`

3. **Build App Bundle** (Recommended for Play Store)
   ```bash
   ./gradlew bundleRelease
   ```
   
   Output: `app/build/outputs/bundle/release/app-release.aab`

### Upload to Play Store

1. **Open Google Play Console**
   - Go to https://play.google.com/console
   - Select your app (create if needed)

2. **Prepare Store Listing**
   - App title: "Gokul Stores"
   - Short description (80 chars)
   - Full description
   - Screenshots (4-8 required)
   - Feature graphic (1024x500)
   - App icon (512x512)
   - Category: Food & Drink / Shopping
   - Privacy policy URL
   - Support email

3. **Upload APK/Bundle**
   - Release → Production
   - Upload app-release.aab
   - Fill in version info
   - Review and publish

4. **Rollout Options**
   - Staged rollout: 10% → 25% → 50% → 100%
   - Full rollout: Available to all immediately
   - Beta/Internal testing: Limited distribution

## Debugging

### Enable Logging
```typescript
// In src/App.tsx or components
console.log('Debug message:', data);
console.error('Error:', error);
```

### View Logs
```bash
adb logcat | grep "gokul\|error\|warn"
```

### Check Device Storage
```bash
adb shell
cd /data/data/com.gokul.stores/
ls -la
```

### Monitor Performance
- Chrome DevTools: chrome://inspect
- Android Profiler in Android Studio
- Firebase Performance Monitoring

## Common Issues & Solutions

### APK Won't Install
**Error**: "INSTALL_FAILED_INVALID_APK"
**Solution**: 
- Uninstall previous version: `adb uninstall com.gokul.stores`
- Rebuild and reinstall
- Check device storage space

### App Crashes on Startup
**Error**: "Native crash in launcher"
**Solution**:
- Check logcat for crash dump
- Verify Firebase credentials
- Check Android SDK compatibility
- Clear app data: `adb shell pm clear com.gokul.stores`

### Firebase Connection Fails
**Error**: "Failed to authenticate"
**Solution**:
- Check Firebase rules in console
- Verify API key in config
- Check network connectivity
- Wait for auth state change
- Check Google Play Services installed

### Google Sign-In Doesn't Work
**Error**: "Sign-in cancelled"
**Solution**:
- Configure OAuth in Google Cloud Console
- Add SHA1 fingerprint: `keytool -list -v -keystore debug.keystore`
- Update Firebase console with credentials
- Restart app

### Images Not Loading
**Error**: Blank product cards
**Solution**:
- Check internet connection
- Verify image URLs accessible
- Check CORS settings if using custom images
- Use images that have `referrerPolicy="no-referrer"`

### Build Fails with Gradle
**Error**: "BUILD FAILED"
**Solution**:
```bash
cd android
./gradlew clean
./gradlew build
```
- Verify Java path
- Check Android SDK version
- Update Gradle: `./gradlew wrapper --gradle-version latest`

## Performance Optimization

### APK Size Reduction
```gradle
android {
  bundle {
    onDemand {
      enableOnDemand = true
    }
  }
  
  buildTypes {
    release {
      minifyEnabled true
      shrinkResources true
    }
  }
}
```

### Network Optimization
- Enable HTTP/2 in Firebase
- Use Firestore indexing
- Optimize image sizes (300x300)
- Cache product list locally

### Battery Optimization
- Use efficient listeners (limit subscriptions)
- Batch database writes
- Disable animations on low-end devices
- Implement app lifecycle awareness

## Monitoring in Production

### Firebase Console
1. Go to https://console.firebase.google.com
2. Select `gokul-stores` project
3. Monitor:
   - Realtime Database usage
   - Authentication metrics
   - Performance monitoring
   - Crashes (if enabled)

### Google Play Console
- Analytics dashboard
- User feedback
- Crash reports
- Android Vitals
- Performance metrics

## Update Process

### Push Update to Play Store
1. Update version code in `build.gradle`
   ```gradle
   versionCode 2  // Increment for each release
   versionName "1.1.0"  // Semantic versioning
   ```

2. Build and upload
   ```bash
   npm run build
   npx cap sync
   cd android
   ./gradlew bundleRelease
   ```

3. Upload to Play Store console
4. Write release notes
5. Schedule rollout

### Users get update automatically
- Within 24 hours (staged)
- Immediately (full rollout)
- Users can force update in settings

## Testing Best Practices

1. **Test on Multiple Devices**
   - Different Android versions (8, 10, 12, 14)
   - Different screen sizes (5", 6.5", 7")
   - Different capabilities (WiFi, 4G, low battery)

2. **Test All Paths**
   - Happy path (everything works)
   - Error path (network issues)
   - Edge cases (empty cart, 0 products)

3. **Test User Journeys**
   - First-time user setup
   - Returning user flow
   - Checkout process
   - Admin operations

4. **Regression Testing**
   - Previous features still work
   - No new crashes
   - Performance maintained
   - Security not compromised

## Resources

- [Google Play Console Docs](https://support.google.com/googleplay/android-developer)
- [Android Developer Guide](https://developer.android.com)
- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [Firebase Console](https://console.firebase.google.com)
- [Google Play Policies](https://play.google.com/about/developer-content-policy)

---
**Last Updated**: April 7, 2026

