import React from 'react';
import { GettingStartedIcon, OverviewIcon, CustomerIcon, InvoiceIcon, HelpCenterIcon, SettingsIcon } from '../assets/icons/icons.jsx';

const IconVerification = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Icon Verification Test</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-3 p-3 border rounded">
          <GettingStartedIcon width={24} height={24} className="text-blue-600" />
          <span className="text-sm">GettingStarted</span>
        </div>
        <div className="flex items-center space-x-3 p-3 border rounded">
          <OverviewIcon width={24} height={24} className="text-green-600" />
          <span className="text-sm">Overview</span>
        </div>
        <div className="flex items-center space-x-3 p-3 border rounded">
          <CustomerIcon width={24} height={24} className="text-purple-600" />
          <span className="text-sm">Customer</span>
        </div>
        <div className="flex items-center space-x-3 p-3 border rounded">
          <InvoiceIcon width={24} height={24} className="text-orange-600" />
          <span className="text-sm">Invoice</span>
        </div>
        <div className="flex items-center space-x-3 p-3 border rounded">
          <HelpCenterIcon width={24} height={24} className="text-red-600" />
          <span className="text-sm">HelpCenter</span>
        </div>
        <div className="flex items-center space-x-3 p-3 border rounded">
          <SettingsIcon width={24} height={24} className="text-gray-600" />
          <span className="text-sm">Settings</span>
        </div>
      </div>
    </div>
  );
};

export default IconVerification;
