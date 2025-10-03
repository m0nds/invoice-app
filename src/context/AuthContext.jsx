import React, { createContext, useContext, useState, useEffect } from 'react';
import { firebaseAuth } from '../config/firebase';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('login');

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = firebaseAuth.onAuthStateChange((firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const userData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
          avatar: firebaseUser.displayName ? 
            firebaseUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase() : 
            firebaseUser.email[0].toUpperCase(),
          photoURL: firebaseUser.photoURL
        };
        setUser(userData);
        setCurrentView('dashboard');
      } else {
        // User is signed out
        setUser(null);
        setCurrentView('login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const result = await firebaseAuth.signin(email, password);
    if (result.success) {
      return result.user;
    } else {
      throw new Error(result.error);
    }
  };

  const signup = async (email, password, displayName) => {
    const result = await firebaseAuth.signup(email, password, displayName);
    if (result.success) {
      return result.user;
    } else {
      throw new Error(result.error);
    }
  };


  const logout = async () => {
    try {
      await firebaseAuth.signout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigate = (view) => {
    setCurrentView(view);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    currentView,
    navigate
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

