import React from 'react';
import { useLoading } from '../context/LoadingContext';


export const LoadingOverlay = ({ show, message = "Loading..." }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 flex items-center space-x-4 shadow-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-appBlue"></div>
        <span className="text-darkGray font-medium">{message}</span>
      </div>
    </div>
  );
};

// Loading Spinner Component
export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-appBlue ${sizeClasses[size]} ${className}`}></div>
  );
};
