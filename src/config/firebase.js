
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw error;
}

const auth = getAuth(app);

// Helper function to convert Firebase error codes to user-friendly messages
const getAuthErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/user-not-found': 'No account found with this email address. Please check your email or sign up for a new account.',
    'auth/wrong-password': 'Incorrect password. Please check your password and try again.',
    'auth/email-already-in-use': 'An account with this email already exists. Please sign in instead or use a different email.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/too-many-requests': 'Too many failed attempts. Please wait a few minutes before trying again.',
    'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
    'auth/invalid-credential': 'Invalid email or password. Please check your credentials and try again.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
    'auth/requires-recent-login': 'Please sign in again to complete this action.',
  };

  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
};

// Auth functions
export const firebaseAuth = {
  // Sign up with email and password
  signup: async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
      }
      
      return {
        success: true,
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: displayName || userCredential.user.email.split('@')[0],
          photoURL: userCredential.user.photoURL
        }
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: getAuthErrorMessage(error.code)
      };
    }
  },

  // Sign in with email and password
  signin: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      return {
        success: true,
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName || userCredential.user.email.split('@')[0],
          photoURL: userCredential.user.photoURL
        }
      };
    } catch (error) {
      console.error('Signin error:', error);
      return {
        success: false,
        error: getAuthErrorMessage(error.code)
      };
    }
  },


  // Sign out
  signout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Signout error:', error);
      return {
        success: false,
        error: 'Failed to sign out. Please try again.'
      };
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Auth state observer
  onAuthStateChange: (callback) => {
    return onAuthStateChanged(auth, callback);
  }
};

export { auth };
export default app;