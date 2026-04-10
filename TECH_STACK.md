# Gokul Stores - Technology Stack Documentation

This document provides a comprehensive breakdown of the technologies, frameworks, and architecture used to build the **Gokul Stores** application.

---

## 🏗️ Core Architecture
Gokul Stores is built as a highly responsive **Single Page Application (SPA)** with mobile-first design principles, later extended to native mobile platforms.

- **Frontend Environment**: [React 19](https://react.dev/) (Functional Components, Hooks)
- **Build Tooling**: [Vite 6](https://vitejs.dev/) (Ultra-fast development server and optimized production builds)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Ensures type safety and reduces runtime errors)

---

## 🎨 UI & Design Systems
The application prioritizes a premium, high-impact aesthetic with smooth interactions.

- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (Utility-first CSS framework for rapid UI development)
- **Iconography**: [Lucide React](https://lucide.dev/) (A library of sharp, consistent SVG icons)
- **Animations**: [Motion](https://www.framer.com/motion/) (Used for page transitions, modal scaling, and micro-interactions)
- **Fonts**: Modern sans-serif typography (Inter/System defaults)

---

## 📂 Backend & Cloud Infrastructure
Powered by [Google Firebase](https://firebase.google.com/) for a scalable, serverless architecture.

- **Database**: [Cloud Firestore](https://firebase.google.com/products/firestore) (Real-time NoSQL database for products, categories, reviews, and user profiles)
- **Authentication**: [Firebase Auth](https://firebase.google.com/products/auth) (Google Sign-In and Secure Email/Password authentication)
- **Media Storage**: [Firebase Storage](https://firebase.google.com/products/storage) (Direct uploads for product photos and user reviews)
- **Hosting**: [Firebase Hosting](https://firebase.google.com/products/hosting) (Fast and secure global CDN for the web application)

---

## 📱 Mobile & PWA
Gokul Stores is designed to run everywhere.

- **Native Mobile**: [Capacitor 8](https://capacitorjs.com/) (Cross-platform runtime that allows the React app to run natively on Android/iOS)
- **App Connectivity**: Integration with Android Gradle for APK generation
- **Progressive Web App (PWA)**: Built-in service workers for offline support and "Add to Home Screen" functionality

---

## ⚙️ Key Feature Logic
- **State Management**: Custom context-based state in `store.tsx`, handling real-time data synchronization with Firestore.
- **Cart Logic**: Client-side persistence and WhatsApp integration for order fulfillment.
- **Image Optimization**: Dynamic image loading with Unsplash integration and manual URL overrides for administrators.
- **Admin Suite**: Restricted dashboard for product management, image fixing, and database seeding.

---

## 🛠️ Developer Toolset
- **Linting**: TypeScript Compiler (`tsc`)
- **Deployment**: Firebase CLI (`firebase-tools`)
- **Seeding**: Custom Node.js scripts (`seed.js`, `seed.cjs`) using `firebase/app` and `firebase/firestore`.

---

> [!NOTE]
> This stack was chosen to provide a balance of high performance, low maintenance (serverless), and a premium user experience across both web and mobile platforms.
