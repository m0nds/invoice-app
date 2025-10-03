import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../context/AuthContext';
import useInvoices from '../hooks/useInvoices';
import useInvoiceFilters from '../hooks/useInvoiceFilters';
import { useLoading } from '../context/LoadingContext';

const InvoiceListPage = () => {
  const { navigate } = useAuth();
  const { invoices, selectInvoice } = useInvoices();
  const { isLoading } = useLoading();
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, sortBy, setSortBy, filterInvoices } = useInvoiceFilters();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const filteredInvoices = filterInvoices(invoices);

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

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 bg-generalBackground lg:ml-0">
        <Header onMenuToggle={toggleSidebar} />
        <main className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <button 
                  onClick={() => navigate('dashboard')}
                  className="text-lightGray hover:text-darkGray text-sm lg:text-base flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primaryBlack">All Invoices</h1>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl lg:rounded-[40px] px-4 lg:px-8 py-6 lg:py-10 mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-appBlue focus:border-appBlue bg-white text-sm"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-appBlue focus:border-appBlue bg-white text-sm min-w-[140px]"
                >
                  <option value="ALL">All Status</option>
                  <option value="PAID">Paid</option>
                  <option value="OVERDUE">Overdue</option>
                  <option value="DRAFT">Draft</option>
                  <option value="PENDING PAYMENT">Pending</option>
                  <option value="SENT">Sent</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-appBlue focus:border-appBlue bg-white text-sm min-w-[140px]"
                >
                  <option value="date">Sort by Date</option>
                  <option value="amount">Sort by Amount</option>
                  <option value="customer">Sort by Customer</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
            </div>

            {/* Invoice Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {isLoading('invoices') ? (
                // Loading skeletons
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))
              ) : filteredInvoices.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="bg-white rounded-2xl lg:rounded-[40px] px-8 py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 text-lg">No invoices found matching your criteria.</p>
                  </div>
                </div>
              ) : (
                filteredInvoices.map((invoice) => (
                  <div 
                    key={invoice.id}
                    onClick={() => { selectInvoice(invoice.id); navigate('invoice-detail'); }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md cursor-pointer transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-darkGray text-sm">#{invoice.id}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyles(invoice.statusColor)}`}>
                        {invoice.status}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-primaryBlack mb-2">{invoice.amount}</p>
                    <p className="text-darkGray mb-1 font-medium">{invoice.customerName}</p>
                    <p className="text-sm text-lightGray">Due: {invoice.date}</p>
                  </div>
                ))
              )}
            </div>

            {/* Results count */}
            <div className="mt-6 text-center text-sm text-lightGray">
              Showing {filteredInvoices.length} of {invoices.length} invoices
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InvoiceListPage;
