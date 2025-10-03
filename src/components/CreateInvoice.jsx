import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../context/AuthContext';
import useInvoices from '../hooks/useInvoices';
import { useLoading } from '../context/LoadingContext';
import { useError } from '../context/ErrorContext';
import { LoadingSpinner, LoadingOverlay } from './LoadingComponents';

const CreateInvoice = () => {
  const { navigate } = useAuth();
  const { createInvoice } = useInvoices();
  const { isLoading } = useLoading();
  const { addError } = useError();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    issueDate: '',
    dueDate: '',
    items: [{ name: '', description: '', qty: 1, rate: '', amount: '' }],
    note: ''
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', description: '', qty: 1, rate: '', amount: '' }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto calculate amount
    if (field === 'qty' || field === 'rate') {
      const qty = field === 'qty' ? value : newItems[index].qty;
      const rate = field === 'rate' ? value : newItems[index].rate;
      newItems[index].amount = (qty * parseFloat(rate.replace('$', '') || 0)).toFixed(2);
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0).toFixed(2);
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      addError({ message: 'Customer name is required', code: 'VALIDATION_ERROR' });
      return false;
    }
    if (!formData.customerEmail.trim()) {
      addError({ message: 'Customer email is required', code: 'VALIDATION_ERROR' });
      return false;
    }
    if (!formData.issueDate) {
      addError({ message: 'Issue date is required', code: 'VALIDATION_ERROR' });
      return false;
    }
    if (!formData.dueDate) {
      addError({ message: 'Due date is required', code: 'VALIDATION_ERROR' });
      return false;
    }
    
    // Validate due date is not before issue date
    if (new Date(formData.dueDate) < new Date(formData.issueDate)) {
      addError({ message: 'Due date cannot be before issue date', code: 'VALIDATION_ERROR' });
      return false;
    }
    
    if (formData.items.some(item => !item.name.trim() || !item.qty || !item.rate)) {
      addError({ message: 'All item fields are required', code: 'VALIDATION_ERROR' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await createInvoice(formData);
    
    if (result.success) {
      addError({ 
        message: 'Invoice created successfully!', 
        code: 'INVOICE_CREATED',
        type: 'success'
      });
      navigate('dashboard');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 bg-generalBackground lg:ml-0">
        <Header onMenuToggle={toggleSidebar} />
        <main className="p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
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
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primaryBlack">Create New Invoice</h1>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button 
                  onClick={() => navigate('dashboard')}
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-200 bg-white text-appBlue rounded-full hover:bg-gray-50 text-xs sm:text-sm font-medium touch-manipulation"
                  disabled={isLoading('createInvoice')}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isLoading('createInvoice')}
                  className="px-6 sm:px-8 py-2 sm:py-3 bg-appBlue text-white rounded-full hover:bg-blue-700 text-xs sm:text-sm font-medium touch-manipulation flex items-center justify-center gap-2"
                >
                  {isLoading('createInvoice') ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Creating...
                    </>
                  ) : (
                    'Create Invoice'
                  )}
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-primaryBlack mb-6">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-lightGray mb-3">Customer Name *</label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-appBlue focus:border-appBlue bg-white"
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-lightGray mb-3">Email Address *</label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-appBlue focus:border-appBlue bg-white"
                      placeholder="customer@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-lightGray mb-3">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-appBlue focus:border-appBlue bg-white"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-primaryBlack mb-6">Invoice Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-lightGray mb-3">Issue Date *</label>
                    <input
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-appBlue focus:border-appBlue bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-lightGray mb-3">Due Date *</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-appBlue focus:border-appBlue bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-primaryBlack">Items</h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-6 py-3 bg-appBlue text-white rounded-full hover:bg-blue-700 text-sm font-medium"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-6 p-6 border border-gray-200 rounded-2xl bg-gray-50">
                      <div className="col-span-12 md:col-span-4">
                        <label className="block text-sm font-medium text-lightGray mb-3">Item Name *</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(index, 'name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-appBlue focus:border-appBlue bg-white"
                          placeholder="Enter item name"
                          required
                        />
                        <textarea
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-appBlue focus:border-appBlue bg-white mt-3"
                          placeholder="Description (optional)"
                          rows="2"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <label className="block text-sm font-medium text-lightGray mb-3">Qty *</label>
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateItem(index, 'qty', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-appBlue focus:border-appBlue bg-white"
                          min="1"
                          required
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <label className="block text-sm font-medium text-lightGray mb-3">Rate *</label>
                        <input
                          type="number"
                          value={item.rate.replace('$', '')}
                          onChange={(e) => updateItem(index, 'rate', '$' + e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-appBlue focus:border-appBlue bg-white"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div className="col-span-3 md:col-span-2">
                        <label className="block text-sm font-medium text-lightGray mb-3">Amount</label>
                        <input
                          type="text"
                          value={`$${item.amount}`}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-darkGray font-medium"
                          readOnly
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 flex items-end">
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="w-full px-4 py-3 text-red-600 border border-red-300 rounded-xl hover:bg-red-50 text-sm font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-8 flex justify-end">
                  <div className="w-80">
                    <div className="flex justify-between py-3 border-t border-gray-200">
                      <span className="font-medium text-lightGray">Subtotal:</span>
                      <span className="font-semibold text-darkGray">${calculateSubtotal()}</span>
                    </div>
                    <div className="flex justify-between py-3 text-xl font-bold border-t border-gray-300">
                      <span className="text-primaryBlack">Total Amount:</span>
                      <span className="text-primaryBlack">${calculateSubtotal()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-primaryBlack mb-6">Additional Notes (Optional)</h3>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-appBlue focus:border-appBlue bg-white"
                  rows="4"
                  placeholder="Thank you for your business..."
                />
              </div>
            </form>
          </div>
        </main>
      </div>
      
      {/* Loading overlay for form submission */}
      <LoadingOverlay 
        show={isLoading('createInvoice')} 
        message="Creating invoice..." 
      />
    </div>
  );
};

export default CreateInvoice;
