import {
    signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
    signInWithPopup as firebaseSignInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    GoogleAuthProvider as FirebaseGoogleAuthProvider,
    User
} from 'firebase/auth';
import { auth as realAuth, googleProvider as realGoogleProvider } from './firebase';

// Mock User Type
const MOCK_USER: User = {
    uid: 'mock-user-123',
    email: 'manojsprivatemail@gmail.com',
    emailVerified: true,
    displayName: 'Demo Trader',
    isAnonymous: false,
    photoURL: null,
    phoneNumber: null,
    providerData: [],
    metadata: { creationTime: '', lastSignInTime: '' },
    refreshToken: '',
    tenantId: null,
    delete: async () => { },
    getIdToken: async () => '',
    getIdTokenResult: async () => ({} as any),
    reload: async () => { },
    toJSON: () => ({}),
    providerId: 'firebase',
};

// Mock Auth State Management
let currentMockUser: User | null = null;
const listeners: Array<(user: User | null) => void> = [];

const notifyListeners = () => {
    listeners.forEach(listener => listener(currentMockUser));
};

// Exported Auth Functions (Switch between Real and Mock)

export const auth = realAuth || {
    get currentUser() { return currentMockUser; }
}; // Mock auth object with dynamic currentUser

export const GoogleAuthProvider = FirebaseGoogleAuthProvider; // Type/Class is safe to export

export const signInWithEmailAndPassword = async (authInstance: any, email: string, password: string) => {
    if (realAuth) {
        return firebaseSignInWithEmailAndPassword(realAuth, email, password);
    }
    // Mock Login
    console.log("Mock Login with:", email);
    currentMockUser = { ...MOCK_USER, email };
    notifyListeners();
    return { user: currentMockUser };
};

export const signInWithPopup = async (authInstance: any, provider: any) => {
    if (realAuth) {
        return firebaseSignInWithPopup(realAuth, provider);
    }
    // Mock Google Login
    console.log("Mock Google Login");
    currentMockUser = MOCK_USER;
    notifyListeners();
    return { user: currentMockUser };
};

export const signOut = async (authInstance: any) => {
    if (realAuth) {
        return firebaseSignOut(realAuth);
    }
    // Mock SignOut
    console.log("Mock SignOut");
    currentMockUser = null;
    notifyListeners();
};

export const onAuthStateChanged = (authInstance: any, callback: (user: User | null) => void) => {
    if (realAuth) {
        return firebaseOnAuthStateChanged(realAuth, callback);
    }
    // Mock Listener
    listeners.push(callback);
    // Immediately trigger with current state (simulating Firebase behavior)
    setTimeout(() => callback(currentMockUser), 100); // Small delay to simulate async
    return () => {
        const index = listeners.indexOf(callback);
        if (index > -1) listeners.splice(index, 1);
    };
};

export const createUserWithEmailAndPassword = async (authInstance: any, email: string, password: string) => {
    if (realAuth) {
        const { createUserWithEmailAndPassword: firebaseCreateUser } = await import('firebase/auth');
        return firebaseCreateUser(realAuth, email, password);
    }
    // Mock Register
    console.log("Mock Register with:", email);
    currentMockUser = { ...MOCK_USER, email };
    notifyListeners();
    return { user: currentMockUser };
};

export const updateProfile = async (user: User, profile: { displayName?: string, photoURL?: string }) => {
    if (realAuth) {
        const { updateProfile: firebaseUpdateProfile } = await import('firebase/auth');
        return firebaseUpdateProfile(user, profile);
    }
    // Mock Update Profile
    console.log("Mock Update Profile:", profile);
    if (currentMockUser) {
        currentMockUser = { ...currentMockUser, ...profile };
        notifyListeners();
    }
};
