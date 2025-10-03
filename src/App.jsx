import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ErrorProvider } from './context/ErrorContext';
import { LoadingProvider } from './context/LoadingContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorToast } from './components/ErrorToast';
import { SuccessToast } from './components/SuccessToast';
import { NetworkStatus } from './components/NetworkStatus';
import RouterWithFirebase from './components/RouterWithFirebase';

const App = () => {
  return (
    <ErrorBoundary>
      <ErrorProvider>
        <LoadingProvider>
          <AuthProvider>
            <div className="min-h-screen bg-generalBackground">
              <RouterWithFirebase />
              <ErrorToast />
              <SuccessToast />
              <NetworkStatus />
            </div>
          </AuthProvider>
        </LoadingProvider>
      </ErrorProvider>
    </ErrorBoundary>
  );
};

export default App;