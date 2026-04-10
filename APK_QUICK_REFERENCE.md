# 📱 Quick APK Installation Reference

## 🚀 One-Command Installation

### **For Windows Users - Easiest Method:**
```batch
cd C:\Users\Admin\Downloads\gokul-stores
install-apk.bat
```
✅ This handles everything automatically!

---

## 💻 Manual Commands (PowerShell/CMD)

### **Step 1: Check Device Connection**
```bash
adb devices
```
Expected output: Your device should appear (e.g., `emulator-5554 device`)

### **Step 2: Install APK**
```bash
cd C:\Users\Admin\Downloads\gokul-stores
adb install -r dist-apk/gokul-stores-debug.apk
```

### **Step 3: Launch App**
```bash
adb shell am start -n com.gokul.stores/.MainActivity
```

---

## 📦 APK File Location
```
C:\Users\Admin\Downloads\gokul-stores\dist-apk\gokul-stores-debug.apk
```

---

## 🔧 Troubleshooting Commands

### Device Won't Connect?
```bash
adb kill-server
adb start-server
adb devices
```

### Clear Previous Installation?
```bash
adb uninstall com.gokul.stores
adb install -r dist-apk/gokul-stores-debug.apk
```

### View App Logs?
```bash
adb logcat | findstr gokul
```

### Verify Installation?
```bash
adb shell pm list packages | findstr gokul
```

---

## 📋 Prerequisites Checklist

- [ ] Android phone with USB Debugging enabled
- [ ] USB cable connected
- [ ] ADB installed on computer
- [ ] APK file exists: `dist-apk/gokul-stores-debug.apk`

---

## ✨ Status Summary

| Component | Status | Location |
|-----------|--------|----------|
| APK Built | ✅ Ready | `dist-apk/gokul-stores-debug.apk` |
| Web Deployed | ✅ Live | https://gokul-stores.web.app |
| Install Script | ✅ Ready | `install-apk.bat` |
| Documentation | ✅ Complete | `APK_READY_FOR_MOBILE.md` |

---

## 🎯 Next Steps

1. **Connect Android phone via USB**
2. **Enable USB Debugging** on phone
3. **Run:** `install-apk.bat`
4. **Done!** App will be installed automatically

---

## 📞 Need Help?

| Issue | Command |
|-------|---------|
| Devices not showing | `adb kill-server && adb start-server` |
| Installation fails | `adb uninstall com.gokul.stores` then try again |
| App won't launch | Check Firebase connectivity at https://gokul-stores.web.app |
| Debug logs | `adb logcat > debug-logs.txt` |

---

## 🌐 Alternative: Use Web Version

If APK installation issues occur, the app is fully functional online:

**🔗 https://gokul-stores.web.app**

- Full feature parity with mobile app
- Works on any device with browser
- Progressive Web App (PWA) features
- Can be added to home screen

---

**Everything is ready! 🚀**

Last updated: April 9, 2026

