// cspell:disable
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAYlYfVVjhetAnkiUSziFWoWU06HSPhX3g",
  authDomain: "gokul-stores.firebaseapp.com",
  projectId: "gokul-stores",
  storageBucket: "gokul-stores.firebasestorage.app",
  messagingSenderId: "340192412818",
  appId: "1:340192412818:web:708734e7aff4e47f21d24b"
};

// Prevent duplicate app initialization during Vite HMR
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with modern persistent cache.
// Falls back to getFirestore() if already initialized (e.g., during Vite HMR).
let db;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
} catch {
  db = getFirestore(app);
}
export { db };

export const auth = getAuth(app);
export const storage = getStorage(app);
