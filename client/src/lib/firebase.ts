import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithRedirect, 
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Auth methods
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithGithub = () => signInWithPopup(auth, githubProvider);
export const signInWithEmail = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password);
export const signUpWithEmail = (email: string, password: string) => 
  createUserWithEmailAndPassword(auth, email, password);
export const signOut = () => firebaseSignOut(auth);
export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

// Auth state observer
export const observeAuthState = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => auth.currentUser;