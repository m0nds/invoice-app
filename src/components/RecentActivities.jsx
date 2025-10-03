import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import { useActivities } from '../hooks/useActivities';

const RecentActivities = () => {
  const { navigate } = useAuth();
  const { activities, error } = useActivities();
  const { isLoading } = useLoading();
  const [showAll, setShowAll] = useState(false);
  
  // Enhanced activities with more variety and interactivity
  const enhancedActivities = [
    { 
      user: 'KO', 
      action: 'Invoice Created', 
      time: '2 minutes ago', 
      description: 'Created invoice INV-001 for John Doe',
      type: 'invoice_created',
      amount: '$1,250.00',
      status: 'draft',
      clickable: true
    },
    { 
      user: 'KO', 
      action: 'Payment Received', 
      time: '1 hour ago', 
      description: 'Payment confirmed for invoice INV-002',
      type: 'payment_received',
      amount: '$2,500.00',
      status: 'paid',
      clickable: true
    },
    { 
      user: 'KO', 
      action: 'Invoice Sent', 
      time: '3 hours ago', 
      description: 'Invoice INV-003 sent to customer@email.com',
      type: 'invoice_sent',
      amount: '$750.00',
      status: 'sent',
      clickable: true
    },
    { 
      user: 'KO', 
      action: 'Invoice Updated', 
      time: 'Yesterday, 4:30 PM', 
      description: 'Status changed to overdue for invoice INV-004',
      type: 'invoice_updated',
      amount: '$1,800.00',
      status: 'overdue',
      clickable: true
    },
    { 
      user: 'KO', 
      action: 'Customer Added', 
      time: 'Yesterday, 2:15 PM', 
      description: 'New customer "Acme Corp" added to database',
      type: 'customer_added',
      amount: null,
      status: null,
      clickable: false
    },
    { 
      user: 'KO', 
      action: 'Invoice Deleted', 
      time: '2 days ago', 
      description: 'Draft invoice INV-005 was deleted',
      type: 'invoice_deleted',
      amount: '$500.00',
      status: 'deleted',
      clickable: false
    }
  ];

  // Count total activities
  const totalActivities = enhancedActivities.length;
  
  // Limit activities shown when showAll is false
  const limitedActivities = showAll ? enhancedActivities : enhancedActivities.slice(0, 2);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'invoice_created':
        return '📄';
      case 'payment_received':
        return '💰';
      case 'invoice_sent':
        return '📧';
      case 'invoice_updated':
        return '✏️';
      case 'customer_added':
        return '👤';
      case 'invoice_deleted':
        return '🗑️';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-600';
      case 'sent':
        return 'text-blue-600';
      case 'overdue':
        return 'text-red-600';
      case 'draft':
        return 'text-yellow-600';
      case 'deleted':
        return 'text-gray-500';
      default:
        return 'text-gray-600';
    }
  };

  const handleActivityClick = (activity) => {
    if (!activity.clickable) return;
    
    // Navigate based on activity type
    switch (activity.type) {
      case 'invoice_created':
      case 'invoice_sent':
      case 'invoice_updated':
        // Navigate to invoice detail (you'd need to implement this)
        console.log('Navigate to invoice:', activity.description);
        break;
      case 'payment_received':
        // Navigate to payment details
        console.log('Navigate to payment:', activity.description);
        break;
      default:
        console.log('Activity clicked:', activity.action);
    }
  };

  // Show loading skeleton if activities are loading
  if (isLoading('activities')) {
    return (
      <div className="bg-white rounded-2xl lg:rounded-[40px] px-4 lg:px-8 py-6 lg:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-4">
          <h3 className="text-lg font-semibold text-primaryBlack">Recent Activities</h3>
          <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl lg:rounded-[40px] px-4 lg:px-8 py-6 lg:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-primaryBlack">Recent Activities</h3>
              {totalActivities > 2 && !showAll && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                  {totalActivities - 2} more
                </span>
              )}
        </div>
        <button 
          className="text-appBlue text-xs lg:text-sm font-medium border border-gray-200 px-4 lg:px-6 py-3 lg:py-5 rounded-full hover:bg-blue-50 transition-colors whitespace-nowrap"
          onClick={() => navigate('all-activities')}
        >
          VIEW ALL
        </button>
      </div>
      
      {/* Activities List */}
      <div className="space-y-6 lg:space-y-8">
        {limitedActivities.map((activity, index) => (
          <div 
            key={index} 
            className={`flex items-start space-x-3 transition-colors ${
              activity.clickable ? 'cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded-lg' : ''
            }`}
            onClick={() => handleActivityClick(activity)}
          >
            {/* Avatar with Icon */}
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs lg:text-sm font-medium flex-shrink-0 relative">
              {activity.user}
              <div className="absolute -top-1 -right-1 text-xs">
                {getActivityIcon(activity.type)}
              </div>
            </div>
            
            {/* Activity Content */}
            <div className="flex-1 min-w-0">
              {/* Activity Title and Amount */}
              <div className="flex items-center justify-between mb-1">
                <div className="font-semibold text-darkGray text-xs lg:text-sm">
                  {activity.action}
                </div>
                {activity.amount && (
                  <div className={`text-xs font-semibold ${getStatusColor(activity.status)}`}>
                    {activity.amount}
                  </div>
                )}
              </div>
              
              {/* Timestamp */}
              <div className="text-xs text-lightGray mb-2">
                {activity.time}
              </div>
              
              {/* Activity Description Bubble */}
              <div className="bg-gray-100 rounded-lg px-2 lg:px-3 py-1 lg:py-2 inline-block shadow-sm">
                <span className="text-xs text-darkGray">
                  {activity.description}
                </span>
              </div>
              
              {/* Status Badge */}
              {activity.status && (
                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(activity.status)} bg-opacity-10`}>
                    {activity.status.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
          {/* See More/See Less Button */}
          {totalActivities > 2 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full text-appBlue text-sm font-medium py-3 px-4 border border-appBlue rounded-xl hover:bg-blue-50 transition-colors"
              >
                {showAll ? 'See Less' : `See More (${totalActivities - 2} more)`}
              </button>
            </div>
          )}
    </div>
  );
};

export default RecentActivities;

