import React, { createContext, useContext, useState } from 'react';

// Loading Context and Provider
const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});

  const setLoading = (key, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  };

  const isLoading = (key) => {
    return loadingStates[key] || false;
  };

  const isAnyLoading = () => {
    return Object.values(loadingStates).some(isLoading => isLoading);
  };

  return (
    <LoadingContext.Provider value={{ setLoading, isLoading, isAnyLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
