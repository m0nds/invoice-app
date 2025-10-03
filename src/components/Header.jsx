import React, { useState, useRef, useEffect } from 'react';
import { Notification } from '../assets/icons/icons.jsx';
import RealTimeStatusIndicator from './RealTimeStatusIndicator';
import { useAuth } from '../context/AuthContext';

const Header = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <header className="lg:bg-generalBackground bg-white">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center space-x-4">

          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h2 className="text-lg lg:text-xl font-semibold text-[#373B47] tracking-widest">INVOICE</h2>
        </div>
        <div className="flex items-center space-x-2 lg:space-x-4">
          <RealTimeStatusIndicator />
          <div className="bg-white rounded-full p-2 lg:p-3">
            <Notification />
          </div>
          
          {/* User Avatar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-1 lg:space-x-2 bg-white rounded-full px-2 lg:px-3 py-2 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <div className="w-7 h-7 lg:w-8 lg:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs lg:text-sm font-medium">
                {user?.avatar}
              </div>
              <svg 
                className={`w-3 h-3 lg:w-4 lg:h-4 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>


            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 lg:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-3 lg:px-4 py-2 border-b border-gray-100">
                  <p className="text-xs lg:text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 lg:px-4 py-2 text-xs lg:text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="border-b border-gray-200 mx-4 lg:mx-6"></div>
    </header>
  );
};

export default Header;

