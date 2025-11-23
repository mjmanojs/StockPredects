import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

import { getAnalytics } from "firebase/analytics";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

// Initialize Firebase
let app: any;
let auth: any;
let db: any;
let googleProvider: any;
let analytics: any;

const isDummyKey = !firebaseConfig.apiKey || firebaseConfig.apiKey.includes('dummy') || firebaseConfig.apiKey.includes('your_api_key');

if (!isDummyKey) {
    try {
        app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        auth = getAuth(app);

        // Enable Firestore Persistence for speed/offline support
        db = initializeFirestore(app, {
            localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
        });

        googleProvider = new GoogleAuthProvider();
        if (typeof window !== 'undefined') {
            analytics = getAnalytics(app);
        }
    } catch (e) {
        console.error("Firebase Init Error:", e);
    }
} else {
    console.warn("Using Mock Firebase (Invalid/Dummy Key Detected)");
    app = null;
    auth = null;
    db = null;
    googleProvider = null;
    analytics = null;
}

export { auth, db, googleProvider, analytics };
