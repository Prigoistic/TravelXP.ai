import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "travelxp-33cf0.firebaseapp.com",
  projectId: "travelxp-33cf0",
  storageBucket: "travelxp-33cf0.firebasestorage.app",
  messagingSenderId: "791961635416",
  appId: "1:791961635416:web:f7bd471744d93354fe582d",
  measurementId: "G-XZF7WJHXB0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');


googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { analytics }; 