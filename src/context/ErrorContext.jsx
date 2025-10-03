import React, { createContext, useContext, useState } from 'react';

// Error Context and Provider
const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);
  const [welcomeShown, setWelcomeShown] = useState(false);

  const addError = (error) => {
    // Special handling for welcome message - only show once
    if (error.message?.includes('Welcome! Real-time updates are active')) {
      if (welcomeShown) {
        console.log('Welcome message already shown, skipping');
        return;
      }
      setWelcomeShown(true);
    }

    const errorId = Date.now();
    const errorObj = {
      id: errorId,
      ...error,
      timestamp: new Date().toISOString()
    };
    
    setErrors(prev => {
      // Limit to maximum 3 notifications to prevent stacking
      const newErrors = [...prev, errorObj];
      return newErrors.slice(-3); // Keep only the last 3
    });
    
    // Auto remove error after 4 seconds (reduced from 5)
    setTimeout(() => {
      removeError(errorId);
    }, 4000);
  };

  const removeError = (id) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError, clearErrors }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
