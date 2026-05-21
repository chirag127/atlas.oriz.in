import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
	getAuth, 
	GoogleAuthProvider, 
	signInWithPopup, 
	signOut, 
	onAuthStateChanged,
	linkWithPopup,
	type User
} from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { writable } from 'svelte/store';

// Firebase Client Configuration (Populated from env)
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
	appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

// Initialize App (Avoid multiple instances during hot-reloads)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Initialize Analytics conditionally on client
export let analytics: any = null;
if (typeof window !== 'undefined') {
	isSupported().then((supported) => {
		if (supported) {
			analytics = getAnalytics(app);
		}
	});
}

// Svelte Store for Auth State Tracking
export const user = writable<User | null>(null);
export const loading = writable<boolean>(true);

// Subscribe to Auth State Changes
if (typeof window !== 'undefined') {
	onAuthStateChanged(auth, (firebaseUser) => {
		user.set(firebaseUser);
		loading.set(false);
	});
}

// Google Sign-In with auto account linking
export async function loginWithGoogle() {
	const provider = new GoogleAuthProvider();
	try {
		const result = await signInWithPopup(auth, provider);
		return result.user;
	} catch (error: any) {
		console.error("Google Sign-In Error: ", error);
		// Automatically link accounts if the email is identical
		if (error.code === 'auth/account-exists-with-different-credential') {
			const pendingCred = error.credential;
			const email = error.customData.email;
			// We can ask user to sign in with their password first, then link them
			console.warn("Account exists with different credential for email: ", email);
			throw new Error(`An account already exists with the email ${email}. Please log in with your email/password first, then link Google in Settings.`);
		}
		throw error;
	}
}

// Link Google Account to existing Email/Password Account
export async function linkGoogleAccount() {
	const provider = new GoogleAuthProvider();
	const currentUser = auth.currentUser;
	if (!currentUser) throw new Error("No authenticated user to link account to.");
	
	try {
		const result = await linkWithPopup(currentUser, provider);
		user.set(result.user);
		return result.user;
	} catch (error) {
		console.error("Failed to link Google account: ", error);
		throw error;
	}
}

// Log Out
export async function logOut() {
	try {
		await signOut(auth);
		user.set(null);
	} catch (error) {
		console.error("Sign-Out Error: ", error);
		throw error;
	}
}
