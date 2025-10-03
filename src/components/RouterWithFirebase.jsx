import React from 'react';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import DashboardWithRealTime from './DashboardWithRealTime';
import InvoiceDetail from './InvoiceDetail';
import CreateInvoice from './CreateInvoice';
import InvoiceListPage from './InvoiceListPage';
import { LoadingSpinner } from './LoadingComponents';

const RouterWithFirebase = () => {
  const { user, loading, currentView } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-generalBackground flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-lightGray text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }
  
  switch (currentView) {
    case 'invoice-detail':
      return <InvoiceDetail />;
    case 'create-invoice':
      return <CreateInvoice />;
    case 'all-invoices':
      return <InvoiceListPage />;
    case 'dashboard':
    case 'getting-started':
    case 'overview':
    case 'accounts':
    case 'beneficiary':
    case 'help':
    case 'settings':
    default:
      return <DashboardWithRealTime />;
  }
};

export default RouterWithFirebase;



