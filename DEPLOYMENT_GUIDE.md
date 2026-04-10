# Gokul Stores - Complete Setup & Deployment Guide

## Project Overview
Gokul Stores is a modern e-commerce web and mobile application for fresh groceries and vegetables. It features:
- React + TypeScript frontend with Tailwind CSS
- Firebase backend (Firestore, Authentication)
- Native Android app via Capacitor
- PWA support for installable web app
- Admin dashboard for product and order management
- WhatsApp integration for orders

## Architecture

### Web App (React)
- **Framework**: Vite + React 19
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Motion library
- **State Management**: Context API (custom store)

### Backend
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google Sign-In)
- **Hosting**: Firebase Hosting
- **Real-time Updates**: Firestore listeners

### Mobile (Android)
- **Wrapper**: Capacitor 8.3.0
- **Build System**: Gradle
- **Target SDK**: 36
- **Min SDK**: 24

## Completed Setup

### ✅ Database
- Firebase project: `gokul-stores`
- Collections: `products`, `categories`, `orders`, `profiles`
- Seed data created with 35 products across 4 categories

### ✅ Web Application
- Running: http://localhost:3000
- Deployed: https://gokul-stores.web.app
- PWA enabled with offline support

### ✅ Android App
- Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release APK: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

## Installation & Setup

### Prerequisites
- Node.js 18+
- Java 11+ (for Android builds)
- Android Studio (for device testing)
- Git

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration (Optional - for AI features)
Create `.env.local` in project root:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Running Locally

#### Web Development
```bash
npm run dev
```
Opens at http://localhost:3000

#### Building for Production
```bash
npm run build
npm run preview
```

### 4. Database Seeding

Seed initial categories and products:
```bash
npm run seed
```

This populates:
- **4 Categories**: Snacks, Groceries, Drinks, Vegetables
- **35 Products**: With images, prices, and ratings

To manually seed via admin panel:
1. Sign in with email: `manojponnaiyan151@gmail.com` (admin)
2. Navigate to Admin dashboard
3. Click "Seed DB" button

## Deployment

### Firebase Hosting (Web)
```bash
npm run build
npx firebase deploy --only hosting
```
Live at: https://gokul-stores.web.app

### Android APK Distribution

#### Debug APK (for testing)
```bash
npm run build
npx cap sync
cd android
./gradlew assembleDebug
```
Output: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Release APK (for production)
```bash
npm run build
npx cap sync
cd android
./gradlew assembleRelease
```
Output: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

To sign the release APK:
1. Create keystore (if not exists):
   ```bash
   keytool -genkey -v -keystore release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias gokul
   ```

2. Sign APK:
   ```bash
   jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore release.jks app-release-unsigned.apk gokul
   zipalign -v 4 app-release-unsigned.apk app-release-signed.apk
   ```

## Admin Access

### Default Admin Email
- Email: `manojponnaiyan151@gmail.com`
- Change in: `src/store.tsx` line 42

### Admin Features
- Add/Edit products
- View and manage orders
- Update order status (placed → processing → out_for_delivery → delivered)
- Seed database
- View all orders

To grant admin access to additional users:
```typescript
// In src/store.tsx
const ADMIN_EMAILS = ['manojponnaiyan151@gmail.com', 'new-admin@example.com'];
```

## Features

### Customer Features
- ✅ Browse products by category
- ✅ Search products
- ✅ Add to cart
- ✅ Product ratings
- ✅ Order via WhatsApp
- ✅ User profile & addresses
- ✅ Order history
- ✅ Share products on WhatsApp/Facebook
- ✅ Google Sign-In
- ✅ PWA installation

### Admin Features
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ Order status updates
- ✅ Order notifications (browser)
- ✅ Database seeding
- ✅ View all orders across customers

## Database Structure

### Collections

#### products
```javascript
{
  id: "s1",
  name: "Lays Classic",
  price: 20,
  category_id: "1",
  category_name: "Snacks",
  image_url: "https://...",
  ratings: [4, 5, 3]  // optional
}
```

#### categories
```javascript
{
  id: "1",
  name: "Snacks",
  icon: "Cookie"
}
```

#### orders
```javascript
{
  id: "ORD-1712345678",
  date: "2024-04-07T...",
  items: [{id, name, price, quantity, ...}],
  total: 150,
  status: "placed" | "processing" | "out_for_delivery" | "delivered"
}
```

#### profiles
```javascript
{
  uid: "firebase_user_id",
  name: "John Doe",
  email: "john@example.com",
  phone: "+91 98765 43210",
  address: "123 Main St, City"
}
```

## Customization

### Store Name & Branding
- File: `src/App.tsx` (line 193-195)
- Update: "GOKUL STORES" text and colors

### Contact Information
- File: `src/App.tsx` (lines 472-530)
- Update: Phone, address, store hours

### Admin Email
- File: `src/store.tsx` (line 42)
- Add admins to `ADMIN_EMAILS` array

### WhatsApp Number
- File: `src/App.tsx` (line 396)
- Update: Phone number in WhatsApp URL

### Styling
- Colors: `src/index.css` (Tailwind config)
- Primary color: Emerald-600 (used throughout)

## Troubleshooting

### Firebase Connection Issues
- Check `.env` variables
- Verify Firebase project permissions
- Check network connectivity
- Wait 5 seconds (app has fallback timeout)

### Android Build Errors
- **SDK Version**: Ensure Android SDK Platform 36 installed
- **Java Home**: Set to Android Studio JBR path
- **Gradle**: Clear cache with `./gradlew clean`

### APK Installation Issues
- Enable "Install from Unknown Sources" on Android device
- Check minimum Android API level (24)
- Verify APK is signed (for production)

## Performance Tips

### Web App
- Built with Vite for fast loading
- Lazy loading for images
- PWA caching for offline access
- Code splitting by route

### Database
- Real-time listeners with fallback to local data
- Indexed queries on products/categories
- Shallow snapshot listeners

### Mobile
- Proguard minification enabled
- Bundle size optimization
- Capacitor native optimizations

## Security Notes

⚠️ **Important**: The Firebase API key in `src/firebase.ts` is exposed in client code.
- Configure Firebase Security Rules in Firestore
- Use Google Sign-In for authentication
- Production rules should restrict public access

Example Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{document=**} {
      allow read;
      allow write: if request.auth.uid != null && isAdmin();
    }
    match /profiles/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    match /orders/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /categories/{document=**} {
      allow read;
      allow write: if isAdmin();
    }
  }
  
  function isAdmin() {
    return get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'admin';
  }
}
```

## Tech Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React | 19.0.0 |
| Build Tool | Vite | 6.2.0 |
| Styling | Tailwind CSS | 4.1.14 |
| Icons | Lucide React | 0.546.0 |
| State | Context API | - |
| Backend | Firebase | 12.11.0 |
| Auth | Firebase Auth | - |
| Mobile | Capacitor | 8.3.0 |
| Android SDK | - | 36 |
| Min SDK | - | 24 |
| Build Tool | Gradle | - |

## Support & Maintenance

### Regular Tasks
- Monitor Firebase usage and costs
- Update dependencies: `npm update`
- Review and optimize Firestore queries
- Test on real devices periodically
- Backup database regularly

### Monitoring
- Firebase Console: https://console.firebase.google.com
- Web Analytics: Enable in Firebase
- Crash Reporting: Automatic with Capacitor

## Future Enhancements
- Payment gateway integration (Stripe/Razorpay)
- Email notifications for orders
- SMS notifications
- Loyalty/rewards program
- Advanced analytics
- Multi-language support
- Inventory management
- Delivery tracking with maps

## Project Structure
```
gokul-stores/
├── src/
│   ├── App.tsx           # Main app component
│   ├── store.tsx         # State management
│   ├── firebase.ts       # Firebase config
│   ├── data.ts           # Initial data
│   ├── types.ts          # TypeScript types
│   ├── main.tsx          # App entry
│   └── index.css         # Global styles
├── android/              # Capacitor Android
├── public/               # Static assets
├── dist/                 # Build output
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── tailwind.config.ts    # Tailwind config
├── vite.config.ts        # Vite config
├── capacitor.config.ts   # Capacitor config
└── README.md             # Original README
```

## License & Attribution
- Built with React, Firebase, and Capacitor
- UI Components using Lucide Icons
- Images from Unsplash (with referrer policy)

---
**Last Updated**: April 7, 2026
**Version**: 1.0.0

