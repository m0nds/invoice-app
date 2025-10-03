import React from 'react';
import { GettingStartedIcon, OverviewIcon, CustomerIcon, InvoiceIcon, HelpCenterIcon, SettingsIcon } from '../assets/icons/icons.jsx';

const IconTest = () => {
  const icons = [
    { name: 'GettingStarted', component: GettingStartedIcon },
    { name: 'Overview', component: OverviewIcon },
    { name: 'Customer', component: CustomerIcon },
    { name: 'Invoice', component: InvoiceIcon },
    { name: 'HelpCenter', component: HelpCenterIcon },
    { name: 'Settings', component: SettingsIcon },
  ];

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Icon Test</h3>
      <div className="grid grid-cols-2 gap-4">
        {icons.map(({ name, component: IconComponent }) => (
          <div key={name} className="flex items-center space-x-3 p-3 bg-white rounded border">
            <IconComponent width={24} height={24} className="text-blue-600" />
            <span className="text-sm font-medium">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconTest;
