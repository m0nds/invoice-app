import React from 'react';
import { 
  Invoice, 
  Money, 
  Customer, 
  Settings, 
  Overview,
  Notification 
} from '../assets/icons/icons.jsx';

const IconExample = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Icon Examples</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 p-3 border rounded">
          <Invoice width={24} height={24} />
          <span className="text-sm font-medium">Invoice</span>
        </div>
        
        <div className="flex items-center space-x-3 p-3 border rounded">
          <Money width={24} height={24} />
          <span className="text-sm font-medium">Money</span>
        </div>
        
        <div className="flex items-center space-x-3 p-3 border rounded">
          <Customer width={24} height={24} />
          <span className="text-sm font-medium">Customer</span>
        </div>
        
        <div className="flex items-center space-x-3 p-3 border rounded">
          <Settings width={24} height={24} />
          <span className="text-sm font-medium">Settings</span>
        </div>
        
        <div className="flex items-center space-x-3 p-3 border rounded">
          <Overview width={24} height={24} />
          <span className="text-sm font-medium">Overview</span>
        </div>
        
        <div className="flex items-center space-x-3 p-3 border rounded">
          <Notification width={24} height={24} />
          <span className="text-sm font-medium">Notification</span>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Usage Examples:</h3>
        <pre className="text-xs text-gray-600 overflow-x-auto">
        </pre>
      </div>
    </div>
  );
};

export default IconExample;
