import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GettingStartedIcon, OverviewIcon, CustomerIcon, InvoiceIcon, HelpCenterIcon, SettingsIcon, Beneficiary, Vector } from '../assets/icons/icons.jsx';

const Sidebar = ({ isOpen, onClose }) => {
  const { navigate, currentView } = useAuth();
  
  const menuItems = [
    { icon: GettingStartedIcon, label: 'Getting Started', view: 'getting-started' },
    { icon: OverviewIcon, label: 'Overview', view: 'overview' },
    { icon: GettingStartedIcon, label: 'Accounts', view: 'accounts' },
    { icon: InvoiceIcon, label: 'Invoice', view: 'dashboard' },
    { icon: Beneficiary, label: 'Beneficiary Management', view: 'beneficiary' },
    { icon: HelpCenterIcon, label: 'Help Center', view: 'help' },
    { icon: SettingsIcon, label: 'Settings', view: 'settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white h-screen transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="py-8 px-6">
          <Vector width={24} height={24} />
        </div>
        <nav className="mt-4 px-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                navigate(item.view);
                onClose(); // Close mobile menu when item is clicked
              }}
              className={`w-full gap-3 text-left flex items-center px-6 py-3 my-3 text-sm font-medium transition-colors font-neue-haas ${
                currentView === item.view
                  ? 'text-secondary bg-white rounded-full border-8 border-generalBackground'
                  : 'text-primary hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              {React.createElement(item.icon, { className: "mr-3 h-5 w-5" })}
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;

