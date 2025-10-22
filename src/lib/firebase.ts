/**
 * Firebase initialization module.
 * Uses the provided Firebase project credentials.
 *
 * Usage:
 *  import { app, auth, getAnalyticsInstance } from "@/lib/firebase";
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported as isAnalyticsSupported, type Analytics } from "firebase/analytics";

// Your web app's Firebase configuration (provided)
const firebaseConfig = {
  apiKey: "AIzaSyDVMvRaS7BRKS9HKFY2Bsu4nDZ5r5cZHLE",
  authDomain: "verolabz.firebaseapp.com",
  projectId: "verolabz",
  storageBucket: "verolabz.firebasestorage.app",
  messagingSenderId: "397129358809",
  appId: "1:397129358809:web:ebe2505c69eb1e0bf60dc8",
  measurementId: "G-LPXE0CNLTG",
};

// Initialize Firebase app (use existing if already initialized)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

/**
 * Returns Analytics instance if supported in the current environment (browser only).
 * This function is safe to call in SSR or non-browser contexts; it will resolve to undefined.
 */
async function getAnalyticsInstance(): Promise<Analytics | undefined> {
  if (typeof window === "undefined") return undefined;
  try {
    const supported = await isAnalyticsSupported();
    return supported ? getAnalytics(app) : undefined;
  } catch {
    // Analytics not supported or failed to initialize
    return undefined;
  }
}

export { app, auth, getAnalyticsInstance };
export default app;
