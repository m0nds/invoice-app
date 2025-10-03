import React, { useState } from 'react';
import useRealTimeNotifications from '../hooks/useRealTimeNotifications';

const RealTimeStatusIndicator = () => {
  const { isConnected } = useRealTimeNotifications();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'} ${isConnected ? 'animate-pulse' : ''}`}></div>
        <span className="text-xs font-medium text-gray-700">
          {isConnected ? 'Live' : 'Offline'}
        </span>
      </button>

      {showTooltip && (
        <div className="absolute top-full mt-2 right-0 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-50">
          {isConnected ? '✓ Real-time updates active' : '✗ Real-time updates inactive'}
        </div>
      )}
    </div>
  );
};

export default RealTimeStatusIndicator;

