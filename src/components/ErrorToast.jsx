import React from 'react';
import { useError } from '../context/ErrorContext';


export const ErrorToast = () => {
  const { errors, removeError, clearErrors } = useError();

  const errorMessages = errors.filter(error => !error.type || error.type !== 'success');

  if (errorMessages.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">

      {errorMessages.length > 1 && (
        <div className="flex justify-end mb-2">
          <button
            onClick={clearErrors}
            className="px-3 py-1 bg-gray-600 text-white text-xs rounded-lg hover:bg-gray-700 transition-colors"
          >
            Clear All
          </button>
        </div>
      )}
      
      {errorMessages.map((error) => (
        <div
          key={error.id}
          className="bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between min-w-[300px] animate-slideIn"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{error.message}</span>
          </div>
          <button
            onClick={() => removeError(error.id)}
            className="ml-2 text-white hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
