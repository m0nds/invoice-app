import { useState, useEffect } from 'react';

// Network Status Hook
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      // Log offline status instead of showing toast to avoid context issues
      console.warn('Network is offline. Some features may not work.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Network Status Indicator
export const NetworkStatus = () => {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-xl shadow-lg z-50">
      <div className="flex items-center">
        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
        <span className="text-sm font-medium">Offline</span>
      </div>
    </div>
  );
};
