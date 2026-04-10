# Gokul Stores - Quick Start Guide

## 📱 What is Gokul Stores?
A modern e-commerce app for fresh groceries and vegetables with web and native Android versions.

**Live Demo**: https://gokul-stores.web.app

## ⚡ Quick Setup (5 minutes)

### 1. Clone & Install
```bash
cd gokul-stores
npm install
```

### 2. Run Web App
```bash
npm run dev
```
Open http://localhost:3000 in your browser

### 3. Seed Database (First Time)
```bash
npm run seed
```
This populates 35 products across 4 categories

## 🎯 Key Features to Try

### As a Customer
1. **Browse Products**
   - Click categories on home page
   - Search for products in header

2. **Shopping Cart**
   - Add items with quantity
   - Click "Add to Cart"
   - Review cart totals

3. **Order via WhatsApp**
   - Go to Cart
   - Click "Order via WhatsApp"
   - App sends structured order to WhatsApp

4. **Create Profile**
   - Sign in with Google
   - Update name, phone, address
   - Auto-fills WhatsApp orders

### As an Admin
1. **Access Dashboard**
   - Sign in with: `manojponnaiyan151@gmail.com`
   - Navigate to Settings → Admin

2. **Manage Products**
   - View all products
   - Edit product details
   - Add new products (+ button)
   - Delete products

3. **Manage Orders**
   - View all customer orders
   - Update order status
   - Track delivery status

## 📂 Project Structure
```
src/
  App.tsx          ← Main app UI
  store.tsx        ← State management & Firebase
  firebase.ts      ← Firebase config
  data.ts          ← Initial product data
  types.ts         ← TypeScript types

android/           ← Native Android app
dist/              ← Built web app
```

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Check TypeScript errors

# Android
npm run build            # Build web
npx cap sync             # Sync to Android
cd android && ./gradlew assembleDebug    # Build APK

# Firebase
npm run seed             # Populate database
npx firebase deploy --only hosting  # Deploy web

# Deployment
npm run build
npx firebase deploy
```

## 🎨 Customization Quick Links

| What | File | Line |
|------|------|------|
| App title/logo | `src/App.tsx` | 193 |
| Admin email | `src/store.tsx` | 42 |
| Store phone | `src/App.tsx` | 396, 490 |
| Store address | `src/App.tsx` | 506 |
| Store hours | `src/App.tsx` | 524-525 |
| Primary color | `src/index.css` | (Tailwind emerald-600) |

## 🚀 Deployment Paths

### Web App
```bash
npm run build
npx firebase deploy --only hosting
# → https://gokul-stores.web.app
```

### Android App
```bash
npm run build
npx cap sync
cd android && ./gradlew assembleDebug
# → android/app/build/outputs/apk/debug/app-debug.apk
```

## 👥 Admin Account Setup

**Default Admin Email:**
```
manojponnaiyan151@gmail.com
```

**To Add More Admins:**
1. Edit `src/store.tsx` (line 42)
2. Add emails to array:
   ```typescript
   const ADMIN_EMAILS = [
     'manojponnaiyan151@gmail.com',
     'new-admin@example.com'
   ];
   ```
3. Redeploy

## 🔐 Security Notes

⚠️ **Before going to production:**

1. **Configure Firebase Security Rules**
   - Restrict product/order access
   - Require authentication for sensitive operations
   - See `DEPLOYMENT_GUIDE.md` for rules template

2. **Enable Google OAuth**
   - Configure OAuth consent screen
   - Add authorized redirect URIs
   - Test sign-in on all platforms

3. **Set Environment Variables**
   - Copy `.env.local.example` → `.env.local`
   - Add any sensitive API keys
   - Never commit `.env.local`

## 📊 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore + Auth)
- **Mobile**: Capacitor + Android
- **Hosting**: Firebase Hosting
- **Build**: Vite + Gradle

## 🐛 Troubleshooting

### App won't start
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Firebase connection issues
- Check internet connection
- Verify Firebase config in `src/firebase.ts`
- Check Firebase console for quota limits
- Wait 5 seconds (app has built-in timeout)

### Android APK errors
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

## 📚 Full Documentation

- **Deployment**: See `DEPLOYMENT_GUIDE.md`
- **Android Testing**: See `ANDROID_TESTING_GUIDE.md`
- **Original README**: See `README.md`

## 🎓 Next Steps

1. **Understand the code**
   - Read `src/store.tsx` (state management)
   - Review `src/App.tsx` (UI components)

2. **Customize for your store**
   - Update store info (name, phone, address)
   - Add/remove product categories
   - Adjust pricing

3. **Test thoroughly**
   - Try all customer features
   - Test admin panel
   - Test on mobile device

4. **Deploy**
   - Deploy web: `npx firebase deploy --only hosting`
   - Build Android: `./gradlew assembleDebug`
   - Test on real device before distributing

## 💡 Tips & Tricks

### View Real-time Database
- Go to Firebase Console
- Click Firestore Database
- Watch orders update in real-time

### Test WhatsApp Integration
- Open Chrome DevTools (F12)
- Go to Network tab
- Place order - see WhatsApp URL being called

### Debug Firebase Issues
- Enable Firebase logging in console:
  ```javascript
  firebase.database.enableLogging(true);
  ```

### Performance Profiling
- Open DevTools → Performance tab
- Record page load
- Analyze what's slow

## 🔗 Useful Links

- Firebase Console: https://console.firebase.google.com
- Firebase Docs: https://firebase.google.com/docs
- Capacitor Docs: https://capacitorjs.com
- Android Dev: https://developer.android.com
- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com

## 📞 Support

- Check `DEPLOYMENT_GUIDE.md` for detailed setup
- Check `ANDROID_TESTING_GUIDE.md` for mobile issues
- Review comments in source code
- Check Firebase error logs in console

## ✅ Pre-Launch Checklist

- [ ] Customize store name and branding
- [ ] Update admin email addresses
- [ ] Update contact information
- [ ] Test on real Android device
- [ ] Configure Firebase Security Rules
- [ ] Set up OAuth properly
- [ ] Test WhatsApp integration
- [ ] Deploy web app to Firebase
- [ ] Build and test APK
- [ ] Get Google Play account (optional)

---

**Ready to launch?** Start with `npm run dev` and explore! 🚀

