import React from 'react';
import { useAuth } from '../context/AuthContext';
import { InvoiceBig, CustomerIcon } from '../assets/icons/icons';
import Image from '../assets/image.png';

const InvoiceActions = () => {
  const { navigate } = useAuth();
  
  const actions = [
    {
      title: 'Create New Invoice',
      description: 'Create new invoices easily',
      icon: <img src={Image} alt="money image" className="w-20 h-20" />,
      color: 'bg-[#003EFF] text-white',
      action: () => navigate('create-invoice')
    },
    {
      title: 'Change Invoice settings',
      description: 'Customise your invoices',
      icon: <InvoiceBig/>,
      color: 'bg-white text-gray-900 ',
      action: () => navigate('settings')
    },
    {
      title: 'Manage Customer list',
      description: 'Add and remove customers',
      icon: <CustomerIcon/>,
      color: 'bg-white text-gray-900 ',
      action: () => navigate('customers')
    }
  ];

  return (
    <div className="mb-6 lg:mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`p-4 lg:p-6 rounded-3xl cursor-pointer transition-all hover:scale-95 active:scale-95 text-left touch-manipulation ${action.color}`}
          >
            <div className="mb-3">{action.icon}</div>
            <h4 className="font-medium mb-2 text-lg lg:text-[22px]">{action.title}</h4>
            <p className="text-sm text-opacity-80">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default InvoiceActions;

