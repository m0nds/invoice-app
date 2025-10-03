import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useInvoices from '../hooks/useInvoices';
import { useLoading } from '../context/LoadingContext';

const RecentInvoices = () => {
  const { navigate } = useAuth();
  const { invoices, selectInvoice } = useInvoices();
  const { isLoading } = useLoading();
  const [showAll, setShowAll] = useState(false);
  
  // Group invoices by date
  const groupInvoicesByDate = (invoices) => {
    const groups = {};
    
    invoices.forEach(invoice => {
      const date = new Date(invoice.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let groupKey;
      if (date.toDateString() === today.toDateString()) {
        groupKey = `TODAY - ${date.toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }).toUpperCase()}`;
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = `YESTERDAY - ${date.toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }).toUpperCase()}`;
      } else {
        groupKey = date.toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }).toUpperCase();
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(invoice);
    });
    
    return groups;
  };

  const invoiceData = groupInvoicesByDate(invoices);
  
  // Count total invoices across all groups
  const totalInvoices = Object.values(invoiceData).reduce((total, group) => total + group.length, 0);
  
  // Limit invoices shown when showAll is false
  const limitedInvoiceData = showAll ? invoiceData : (() => {
    const limited = {};
    let count = 0;
    const maxItems = 3;
    
    for (const [dateGroup, invoices] of Object.entries(invoiceData)) {
      if (count >= maxItems) break;
      
      const remainingSlots = maxItems - count;
      const itemsToShow = Math.min(invoices.length, remainingSlots);
      
      limited[dateGroup] = invoices.slice(0, itemsToShow);
      count += itemsToShow;
    }
    
    return limited;
  })();

  const getStatusStyles = (statusColor) => {
    switch (statusColor) {
      case 'green':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'red':
          return 'bg-red-100 text-red-800 border border-red-200';
        case 'yellow':
        return 'bg-[#FFF8EB] text-yellow-600 border border-yellow-200';
      case 'gray':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Show loading skeleton if invoices are loading
  if (isLoading('invoices')) {
    return (
      <div className="bg-white rounded-2xl lg:rounded-[40px] px-4 lg:px-8 py-6 lg:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-4">
          <h3 className="text-lg lg:text-xl leading-8 lg:leading-10 font-semibold text-gray-900">Recent Invoices</h3>
          <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl lg:rounded-[40px] px-4 lg:px-8 py-6 lg:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-4">
        <h3 className="text-lg lg:text-xl leading-8 lg:leading-10 font-semibold text-gray-900">Recent Invoices</h3>
        <button 
          className="text-appBlue text-xs lg:text-sm font-medium border border-gray-200 px-4 lg:px-8 py-3 lg:py-4 rounded-full whitespace-nowrap"
          onClick={() => navigate('all-invoices')}
        >
          VIEW ALL INVOICES
        </button>
      </div>
      
      {/* Invoice Groups */}
      <div className="space-y-6">
        {Object.entries(limitedInvoiceData).map(([dateGroup, invoices]) => (
          <div key={dateGroup}>
            {/* Date Header */}
            <div className="text-sm font-semibold text-primaryBlack tracking-wide mb-3">
              {dateGroup}
            </div>
            
            {/* Invoice List */}
            <div className="space-y-3">
              {invoices.map((invoice, index) => (
                <div 
                  key={`${dateGroup}-${index}`}
                  className="flex flex-col sm:flex-row sm:items-center py-3 px-3 hover:bg-gray-50 cursor-pointer transition-colors rounded-lg gap-2 sm:gap-0"
                  onClick={() => { selectInvoice(invoice.id); navigate('invoice-detail'); }}
                >
                  {/* Mobile Layout - Stack vertically */}
                  <div className="sm:hidden space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-semibold text-darkGray mb-1">Invoice -</div>
                        <div className="text-sm font-semibold text-darkGray">{invoice.id}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-darkGray mb-1">{invoice.amount}</div>
                        <div className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusStyles(invoice.statusColor)} inline-block`}>
                          {invoice.status}
                        </div>
                      </div>
                    </div>
                        <div className="text-xs text-[#666F77]">DUE DATE: {invoice.date}</div>
                  </div>
                  
                  {/* Desktop Layout - Three columns */}
                  <div className="hidden sm:flex w-full">
                    {/* Left Section - Invoice Number */}
                    <div className="w-1/3">
                      <div className="text-sm font-semibold text-darkGray mb-1">Invoice -</div>
                      <div className="text-sm font-semibold text-darkGray">{invoice.id}</div>
                    </div>
                    
                        {/* Middle Section - Due Date */}
                        <div className="w-1/3">
                          <div className="text-xs text-[#666F77] mb-1">DUE DATE</div>
                          <div className="text-sm font-semibold text-[#697598]">{invoice.date}</div>
                        </div>
                    
                    {/* Right Section - Amount and Status */}
                    <div className="w-1/3 text-right">
                      <div className="text-sm font-semibold text-darkGray mb-2">{invoice.amount}</div>
                      <div className={`text-xs px-6 py-2 rounded-full font-medium ${getStatusStyles(invoice.statusColor)} inline-block`}>
                        {invoice.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* See More/See Less Button */}
      {totalInvoices > 3 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full text-appBlue text-sm font-medium py-3 px-4 border border-appBlue rounded-xl hover:bg-blue-50 transition-colors"
          >
            {showAll ? 'See Less' : `See More (${totalInvoices - 3} more)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentInvoices;

