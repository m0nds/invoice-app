import React from 'react';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import Dashboard from './Dashboard';
import InvoiceDetail from './InvoiceDetail';
import CreateInvoice from './CreateInvoice';
import InvoiceListPage from './InvoiceListPage';
import { LoadingSpinner } from './LoadingComponents';

const Router = () => {
  const { user, loading, currentView } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
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
      return <Dashboard />;
  }
};

export default Router;

