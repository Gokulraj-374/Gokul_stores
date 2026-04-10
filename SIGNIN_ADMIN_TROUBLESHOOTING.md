# 🔍 Sign-In & Admin Issues - TROUBLESHOOTING GUIDE

## Latest Update - Enhanced Debugging

### What Was Added
✅ **Enhanced Sign-In Logging**
- Firebase initialization status checks
- Detailed error codes and messages
- Network error detection
- API key validation logs

✅ **Admin Screen Debugging**
- Console logs showing user status
- Admin check verification
- Email matching debug info
- Current admin email display in UI

---

## How to Diagnose Issues

### Step 1: Open Developer Console
1. Press **F12** on your keyboard (or Ctrl+Shift+I)
2. Click **Console** tab
3. Keep it open while testing

### Step 2: Test Sign-In & Watch Console

**Web App**:
1. Go to https://gokul-stores.web.app
2. Watch console for logs
3. Click "Sign in with Google"
4. Look for logs like:
   - "Firebase App Initialized: true"
   - "Attempting Google Sign-In..."
   - "Sign-in successful!"

**Expected Console Output**:
```
Firebase App Initialized: true
Firestore DB Initialized: true
Firebase Auth Initialized: true
Firebase Config: { projectId: "gokul-stores", authDomain: "gokul-stores.firebaseapp.com", hasApiKey: true }
Attempting Google Sign-In...
Sign-in successful!
User email: your-email@example.com
User UID: xxxxx
```

### Step 3: Check Admin Access

If you're using `manojponnaiyan151@gmail.com`:
1. Sign in first
2. Go to Settings → Admin
3. Watch console for:
   - "AdminScreen Render:"
   - "User: { email: 'manojponnaiyan151@gmail.com', uid: '...' }"
   - "isAdmin: true"
   - "Admin access granted"

---

## Common Issues & Solutions

### Issue 1: Sign-In Button Does Nothing

**Console Will Show**:
- "Attempting Google Sign-In..." but nothing after

**Solutions**:
1. **Check Popup Blocker**
   - Chrome: Settings → Privacy → Site Settings → Popups
   - Firefox: Preferences → Privacy → Permissions → Popups
   - Safari: Develop → Disable Pop-Up Blocker
   - Add whitelist for gokul-stores.web.app

2. **Try Different Browser**
   - Chrome → Firefox → Edge → Safari
   - Clear cache first in each browser

3. **Check Console for Errors**
   - Look for red error messages
   - Copy error message and report it

### Issue 2: "Sign-in failed: Unknown error"

**Console Will Show**:
```
SIGN-IN ERROR - Full Error Object: { code: "...", message: "..." }
Error Code: [specific code]
Error Message: [specific message]
```

**Common Error Codes & Fixes**:

**auth/invalid-api-key**
- Firebase API key is incorrect
- Check Firebase console configuration
- Verify credentials in src/firebase.ts

**auth/network-request-failed**
- No internet connection
- Network blocked by firewall
- Try mobile hotspot instead

**auth/popup-blocked**
- Browser popup is blocked
- Allow popups in browser settings
- Try incognito mode first (some browser extensions block popups)

**auth/invalid-origin**
- App origin not configured in Firebase
- Must add `https://gokul-stores.web.app` to Firebase console
- For localhost: add `http://localhost:3000`

### Issue 3: Admin Page Shows "Access Denied"

**Console Will Show**:
```
AdminScreen: User not admin, access denied
User Email: your-email@example.com
Checked emails include: ['manojponnaiyan151@gmail.com']
```

**Solutions**:
1. **Check Email Matches Exactly**
   - Current email: [shown in console]
   - Required email: manojponnaiyan151@gmail.com
   - Must match EXACTLY (including case)

2. **Add Your Email as Admin**
   - Edit: `src/store.tsx` line 42
   - Change:
     ```typescript
     const ADMIN_EMAILS = ['manojponnaiyan151@gmail.com'];
     ```
   - To:
     ```typescript
     const ADMIN_EMAILS = ['manojponnaiyan151@gmail.com', 'your-email@example.com'];
     ```
   - Rebuild and deploy

3. **Clear Browser Cache**
   - Sometimes cached auth state
   - F12 → Application → Clear Site Data
   - Reload page

### Issue 4: Firebase Not Initialized

**Console Will Show**:
```
Firebase App Initialized: false
Firestore DB Initialized: false
Firebase Auth Initialized: false
```

**This means**:
- Firebase configuration is broken
- API keys are invalid
- Network connection issue

**Solutions**:
1. Check src/firebase.ts has correct credentials
2. Verify API key is not expired
3. Check Firebase console allows these credentials
4. Try accessing from different network

---

## Complete Debugging Checklist

```
Sign-In Debugging:
  ☐ Open F12 console
  ☐ Check "Firebase ... Initialized: true"
  ☐ Try signing in
  ☐ Look for "Attempting Google Sign-In..."
  ☐ Check for error messages (red text)
  ☐ Copy any error codes shown
  
Admin Debugging:
  ☐ Sign in first
  ☐ Go to Settings → Admin
  ☐ Check console for "AdminScreen Render:"
  ☐ Verify "User: { email: ..., uid: ... }"
  ☐ Check "isAdmin: true/false"
  ☐ If false, check email matches exactly
  
Network Debugging:
  ☐ Check internet connection
  ☐ Try different browser
  ☐ Try incognito mode (disables extensions)
  ☐ Check popup settings
  ☐ Try mobile hotspot if on WiFi
```

---

## Firebase Console Verification

To verify Firebase is set up correctly:

1. Go to: https://console.firebase.google.com
2. Select project: "gokul-stores"
3. Check:
   - **Authentication**: Google Sign-In enabled
   - **Firestore**: Database exists
   - **Hosting**: gokul-stores.web.app domain added
   - **Settings**: API keys configured

---

## Error Codes Reference

| Code | Meaning | Fix |
|------|---------|-----|
| `auth/invalid-api-key` | Wrong API key | Check Firebase config |
| `auth/network-request-failed` | No internet | Check connection |
| `auth/popup-blocked` | Popup blocked | Allow popups in browser |
| `auth/invalid-origin` | Domain not allowed | Add domain to Firebase |
| `auth/popup-closed-by-user` | User closed popup | Normal, not an error |
| `auth/cancelled-popup-request` | Sign-in cancelled | Normal, not an error |

---

## Getting More Help

1. **Check Browser Console** (F12)
   - Most errors will be shown here
   - Take screenshot if sharing issue

2. **Check Firebase Console**
   - https://console.firebase.google.com/project/gokul-stores
   - Check Authentication settings
   - Check if Google provider is enabled

3. **Clear Everything & Restart**
   - F12 → Application → Clear Site Data
   - Close browser completely
   - Restart browser
   - Visit https://gokul-stores.web.app fresh

4. **Try Different Environment**
   - Try mobile phone
   - Try different WiFi network
   - Try incognito mode (disables extensions)

---

## Manual Testing Steps

### Test 1: Firebase Initialization
```javascript
// Paste in console (F12):
console.log("Testing Firebase...");
console.log(window.location.href);
```
Expected: Shows current URL

### Test 2: Check if Signed In
```javascript
// Paste in console (F12):
console.log("Checking auth state...");
// This will appear in console when app initializes
```
Expected: See auth-related logs

### Test 3: Force Clear Auth
```javascript
// Paste in console (F12):
localStorage.clear();
sessionStorage.clear();
location.reload();
```
Expected: Page refreshes, all storage cleared

---

## Summary of Deployed Changes

✅ **Firebase Initialization Logging**
- Shows if Firebase properly initialized
- Displays config validation

✅ **Sign-In Error Enhancement**
- Detailed error codes
- Network error detection
- API key validation
- User-friendly messages

✅ **Admin Screen Debugging**
- Console logs for user status
- Shows email matching check
- Displays admin verification

---

## Current Status

**Web App**: https://gokul-stores.web.app
- ✅ Live and deployed
- ✅ Debug logging enabled
- ✅ Ready for troubleshooting

**Android App**: Installed on device
- ✅ Updated with debug version
- ✅ Same fixes as web

---

**Open your browser console (F12) and try signing in now. You'll see detailed logs that will help identify any issues!**

See console output to diagnose sign-in or admin issues.

Date: April 7, 2026
Status: Ready for Testing with Debug Logging

