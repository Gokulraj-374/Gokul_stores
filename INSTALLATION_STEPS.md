# 📱 GOKUL STORES - STEP-BY-STEP INSTALLATION GUIDE

## 🎯 Goal
Get Gokul Stores app running on your Android phone in 5 minutes!

---

## ✅ STEP 1: Prepare Your Phone (2 minutes)

### Enable USB Debugging
1. **Go to Settings**
2. **Scroll down and tap "About phone"**
3. **Find "Build number" and tap it 7 times**
   - Message: "You are now a developer!"
4. **Go back to Settings**
5. **Find "Developer Options" (now visible)**
6. **Tap it and enable "USB Debugging"**
7. **Tap "OK" on the confirmation dialog**

✅ **Done!** Your phone is ready for installation.

---

## 🔌 STEP 2: Connect Phone to Computer (1 minute)

1. **Get a USB cable**
2. **Connect phone to computer**
3. **On your phone:** Tap "Allow" when prompted about USB debugging
4. **Windows should recognize your device**

✅ **Done!** Phone is connected.

---

## 🚀 STEP 3: Install the App (2 minutes)

### **EASIEST METHOD - Automatic Script**

**Windows Users:**
1. **Open File Explorer**
2. **Navigate to:** `C:\Users\Admin\Downloads\gokul-stores`
3. **Double-click:** `install-apk.bat`
4. **A command window appears**
5. **Wait for completion message** (says "SUCCESS")
6. **Close the window**

✅ **Done!** App is installed!

---

### **ALTERNATIVE METHOD - Manual Commands**

**If the script doesn't work:**

1. **Open Command Prompt (Windows) or PowerShell**
2. **Type these commands:**

```bash
cd C:\Users\Admin\Downloads\gokul-stores
adb devices
```

3. **You should see your device listed**

4. **Type:**
```bash
adb install -r dist-apk/gokul-stores-debug.apk
```

5. **Wait for "Success" message**

✅ **Done!** App is installed!

---

## 🎉 STEP 4: Launch the App (1 minute)

### On Your Phone:
1. **Unlock your phone**
2. **Find "Gokul Stores" in your app drawer**
3. **Tap it to open**
4. **Wait for the splash screen (logo animation)**
5. **App is ready!**

✅ **Done!** App is running!

---

## 🔑 STEP 5: Sign In / Sign Up (Optional but Recommended)

### First Time Users - Sign Up:
1. **You'll see the auth screen**
2. **Tap "Create Account"**
3. **Enter your details:**
   - Full Name: Your name
   - Email: Your email
   - Password: At least 6 characters
   - Confirm Password: Same as above
4. **Tap "Create Account"**
5. **Success message appears**
6. **You're logged in!**

### Returning Users - Sign In:
1. **You'll see the auth screen**
2. **Tap "Sign In" (default)**
3. **Enter:**
   - Email: Your registered email
   - Password: Your password
4. **Tap "Sign In"**
5. **Done! You're logged in!**

### Quick Google Sign-In:
1. **Tap "Google Account" button**
2. **Select your Google account**
3. **Approve the request**
4. **Instant login!**

✅ **Done!** You're authenticated!

---

## 🛍️ STEP 6: Start Shopping

### Browse Products:
1. **Tap "Shop" in the bottom navigation**
2. **Tap a category** (Snacks, Groceries, etc.)
3. **Products appear** in a nice grid
4. **Tap a product** to see details

### Add to Cart:
1. **Adjust quantity** with +/- buttons
2. **Tap "Add" button**
3. **Item appears in cart!**

### Place Order:
1. **Tap "Cart" in bottom navigation**
2. **Review items**
3. **Tap "Order via WhatsApp"**
4. **WhatsApp opens** with order message
5. **Send to Gokul Stores**
6. **Wait for confirmation!**

✅ **Done!** Order placed!

---

## 👤 STEP 7: Update Your Profile (Optional)

### Save Delivery Details:
1. **Tap "Profile" in bottom navigation**
2. **Or tap person icon** in top header
3. **Edit your details:**
   - Full Name
   - Phone Number
   - Delivery Address
4. **Tap "Save Profile"**
5. **Success message appears**

**Benefit:** Your details are auto-filled in WhatsApp orders!

✅ **Done!** Profile saved!

---

## 💛 BONUS: Use Wishlist

### Save Favorites:
1. **Browse products**
2. **Tap the ❤️ heart icon** on product cards
3. **Item is saved!**

### View Wishlist:
1. **Tap the heart icon** in top header
2. **All saved items appear**
3. **Add any item to cart** directly from here

✅ **Done!** Favorites saved!

---

## ⭐ BONUS: Leave Reviews

### Share Your Experience:
1. **In products screen**
2. **Tap "# reviews" link** on any product
3. **Rate the product** (1-5 stars)
4. **Write your review**
5. **Add photos** (optional)
6. **Tap "Submit Review"**

✅ **Done!** Review posted!

---

## 🔧 Troubleshooting

### "Device not found"
**Solution:**
- Check USB cable connection
- Try different USB port
- Reconnect phone
- Restart computer

### "Installation failed"
**Solution:**
- Uninstall first: `adb uninstall com.gokul.stores`
- Then install again
- Or check phone storage (need 50MB+)

### "App won't start"
**Solution:**
- Check internet connection
- Restart the app
- Restart your phone

### "Sign-in not working"
**Solution:**
- Check email address format
- Verify password (case-sensitive!)
- Try Google sign-in instead
- Check internet connection

### "Profile won't save"
**Solution:**
- Check all fields are filled
- Ensure internet is connected
- Try again in a few seconds
- Check Firebase connectivity

---

## 📋 Feature Checklist

After installation, verify everything works:

- [ ] **Browse Products** - Tap Shop, see categories
- [ ] **Add to Cart** - Add item to cart
- [ ] **Order** - Place order via WhatsApp
- [ ] **Sign In** - Can log in with email
- [ ] **Sign Up** - Can create new account
- [ ] **Google Sign** - Google login works
- [ ] **Profile** - Can save your details
- [ ] **Wishlist** - Can save favorites
- [ ] **Search** - Search bar works
- [ ] **Contact** - Contact info visible

✅ If all checked, everything works perfectly!

---

## 🌐 What About the Web Version?

### Available at: https://gokul-stores.web.app

**Same features, no installation needed!**
- Works on any device with a browser
- Desktop, tablet, or mobile
- Automatically synced with app
- Full offline support

**Use this if:**
- APK installation is complicated
- You want to test in browser
- You don't have USB cable

---

## 🆘 Need Help?

### Check Documentation:
- `APK_QUICK_REFERENCE.md` - Quick commands
- `APK_READY_FOR_MOBILE.md` - Detailed guide
- `APK_INSTALLATION_GUIDE.md` - Advanced help

### Common Questions:

**Q: Is it safe to install?**
A: Yes! This is a debug build for testing. It's secure with Firebase.

**Q: Do I need internet?**
A: Yes, for sign-in, products, and orders. Local features work offline.

**Q: Can I uninstall it?**
A: Yes! Go to Settings → Apps → Gokul Stores → Uninstall

**Q: Will I lose my data?**
A: No! Your profile and orders are in the cloud (Firebase)

**Q: What if I lose the APK?**
A: Use the web version: https://gokul-stores.web.app

---

## 📞 Support

### Still Having Issues?
1. Check the documentation files
2. Try the web version first
3. Verify your phone is fully updated
4. Clear app cache: Settings → Apps → Gokul Stores → Clear Cache

### Report Problems:
- Note the exact error message
- Check your internet connection
- Attach screenshots if possible
- Share device type and Android version

---

## 🎊 You're All Set!

```
┌─────────────────────────────────────┐
│  ✅ APP INSTALLED                   │
│  ✅ READY TO USE                    │
│  ✅ ALL FEATURES WORKING            │
└─────────────────────────────────────┘
```

### What You Can Do Now:
1. ✅ Browse and search products
2. ✅ Add items to cart
3. ✅ Place orders via WhatsApp
4. ✅ Save favorites to wishlist
5. ✅ Leave reviews and ratings
6. ✅ Manage your profile
7. ✅ View order history
8. ✅ Share with friends

---

## 🚀 Summary

| Step | Action | Time |
|------|--------|------|
| 1 | Enable USB Debugging | 2 min |
| 2 | Connect phone | 1 min |
| 3 | Run install script | 2 min |
| 4 | Launch app | 1 min |
| 5 | Sign in/up | 2 min |
| **Total** | **Ready to shop!** | **~8 min** |

---

## 🎯 Next Steps

1. **Complete all steps above** ✅
2. **Test the app** on your phone
3. **Add products** to cart
4. **Place an order** via WhatsApp
5. **Share feedback** with us
6. **Enjoy shopping!** 🛍️

---

**Version:** 1.0 (Debug)  
**Released:** April 9, 2026  
**Status:** Ready for Use ✅

**Questions?** Check the documentation files!  
**Errors?** Check the troubleshooting section!  
**Ready?** Start the installation! 🚀

---

**Happy Shopping! 🎉**

