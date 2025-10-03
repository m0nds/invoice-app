import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardStats from './DashboardStats';
import InvoiceActions from './InvoiceActions';
import RecentInvoices from './RecentInvoices';
import RecentActivities from './RecentActivities';
import CreateNew from './CreateNew';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 bg-generalBackground lg:ml-0">
        <Header onMenuToggle={toggleSidebar} />
        <CreateNew />
        <main className="p-4 lg:p-6">
          <DashboardStats />
          <InvoiceActions />
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
            <div className="lg:col-span-3">
              <RecentInvoices />
            </div>
            <div className="lg:col-span-2">
              <RecentActivities />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

