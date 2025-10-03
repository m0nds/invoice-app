import React from 'react';
import { OverviewIcon } from '../assets/icons/icons.jsx';
import useInvoices from '../hooks/useInvoices';
import { useLoading } from '../context/LoadingContext';

const DashboardStats = () => {
  const { stats } = useInvoices();
  const { isLoading } = useLoading();


  if (isLoading('stats') || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-4 lg:p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <OverviewIcon className="w-5 h-5 lg:w-6 lg:h-6"/>
            </div>
            <div className="flex gap-2 items-center mb-3 lg:mb-4">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  const statsData = [
    { 
      label: 'TOTAL PAID', 
      value: `$${stats.totalPaid.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 
      count: stats.totalPaid.count, 
      color: 'green' 
    },
    { 
      label: 'TOTAL OVERDUE', 
      value: `$${stats.totalOverdue.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 
      count: stats.totalOverdue.count, 
      color: 'red' 
    },
    { 
      label: 'TOTAL DRAFT', 
      value: `$${stats.totalDraft.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 
      count: stats.totalDraft.count, 
      color: 'gray' 
    },
    { 
      label: 'TOTAL UNPAID', 
      value: `$${stats.totalUnpaid.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 
      count: stats.totalUnpaid.count, 
      color: 'yellow' 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
      {statsData.map((stat, index) => (
        <div key={index} className="bg-white p-4 lg:p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
           <OverviewIcon className="w-5 h-5 lg:w-6 lg:h-6"/>
          </div>
          <div className="flex gap-2 items-center mb-3 lg:mb-4">
          <p className="text-xs text-lightGray font-medium tracking-wide">{stat.label}</p>
          <span className={`px-2 lg:px-4 py-1 lg:py-2 text-xs font-medium rounded-full text-darkGray ${
              stat.color === 'green' ? 'bg-[#B6FDD3]' :
              stat.color === 'red' ? 'bg-[#FFB7BD] ' :
              stat.color === 'yellow' ? 'bg-[#F8E39B]' :
              'bg-[#D9D9E0]'
            }`}>
              {stat.count}
            </span>
          </div>
          <p className="text-lg lg:text-2xl font-semibold text-primaryBlack">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;

