<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Gokul Stores

A modern e-commerce web application with native Android portability, featuring Firebase integration.

## Run Locally (Web)

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key (if leveraging AI functionality).
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the application at `http://localhost:3000`

## Deploy to Firebase

To publish your website live to Firebase Hosting:

1. Build the production application:
   ```bash
   npm run build
   ```
2. Deploy the application to your linked Firebase account:
   ```bash
   npx firebase deploy --only hosting
   ```
3. Your app will be accessible at [https://gokul-stores.web.app](https://gokul-stores.web.app).

## Android Development (Capacitor)

This web application has been wrapped with Capacitor, allowing it to be compiled directly into a native Android `.apk` or `.aab` file. 

**Prerequisites:** Android Studio

**Development Workflow:**

1. Make changes to your web application code (`src/`).
2. Build the new user interface:
   ```bash
   npm run build
   ```
3. Sync the updated UI with your Android project:
   ```bash
   # On Windows (if using Java 25): $env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"; npx cap sync
   npx cap sync
   ```
4. Open your `android` folder using Android Studio to build and test your app on an emulator or physical device.
