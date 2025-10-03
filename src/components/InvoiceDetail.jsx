import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import useInvoices from '../hooks/useInvoices';
import useInvoiceActions from '../hooks/useInvoiceActions';
import { useLoading } from '../context/LoadingContext';
import { useError } from '../context/ErrorContext';
import { LoadingSpinner } from './LoadingComponents';
import { generateInvoicePDF, generateShareableLink, getStatusColorClass } from '../utils/invoiceUtils';
import images from '../assets/images/fabulousImage.png'

const InvoiceDetail = () => {
  const { navigate } = useAuth();
  const { getCurrentInvoice } = useInvoices();
  const { sendInvoice, markAsPaid, markAsOverdue, removeInvoice } = useInvoiceActions();
  const { isLoading } = useLoading();
  const { addError } = useError();
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [reminders, setReminders] = useState({
    '14days': true,
    '7days': true,
    '3days': false,
    '24hrs': false,
    'dueDate': false
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const dropdownRef = useRef(null);
  const invoiceRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMoreDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Action handlers
  const handleSendInvoice = async () => {
    await sendInvoice(invoiceData.id, invoiceData.customer.name);
    setIsMoreDropdownOpen(false);
  };

  const handleMarkAsPaid = async () => {
    await markAsPaid(invoiceData.id, invoiceData.customer.name);
    setIsMoreDropdownOpen(false);
  };

  const handleMarkAsOverdue = async () => {
    await markAsOverdue(invoiceData.id, invoiceData.customer.name);
    setIsMoreDropdownOpen(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete this invoice for ${invoiceData.customer.name}?`)) {
      const result = await removeInvoice(invoiceData.id, invoiceData.customer.name);
      if (result.success) {
        navigate('dashboard');
      }
    }
    setIsMoreDropdownOpen(false);
  };

  // PDF Download Handler
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) {
      addError({ message: 'Invoice content not found', code: 'PDF_ERROR' });
      return;
    }

    setIsGeneratingPDF(true);
    try {
      console.log('Starting PDF generation...');
      console.log('Invoice ref:', invoiceRef.current);
      console.log('Invoice data:', invoiceData);
      
      const result = await generateInvoicePDF(invoiceRef.current, invoiceData);
      console.log('PDF generation result:', result);
      
      if (result.success) {
        addError({ 
          message: `PDF downloaded successfully: ${result.fileName}`, 
          code: 'PDF_SUCCESS',
          type: 'success'
        });
      } else {
        addError({ 
          message: `Failed to generate PDF: ${result.error}`, 
          code: 'PDF_ERROR' 
        });
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      addError({ 
        message: `Failed to generate PDF: ${error.message}`, 
        code: 'PDF_ERROR' 
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };


  // Shareable Link Handler
  const handleGenerateShareableLink = async () => {
    setIsGeneratingLink(true);
    try {
      const result = generateShareableLink(invoiceData.id);
      if (result.success) {
        addError({ 
          message: `Shareable link copied to clipboard: ${result.url}`, 
          code: 'LINK_SUCCESS',
          type: 'success'
        });
      } else {
        addError({ 
          message: `Failed to generate link: ${result.error}`, 
          code: 'LINK_ERROR' 
        });
      }
    } catch (error) {
      addError({ 
        message: 'Failed to generate shareable link. Please try again.', 
        code: 'LINK_ERROR' 
      });
    } finally {
      setIsGeneratingLink(false);
      setIsMoreDropdownOpen(false);
    }
  };

  // Reminder Toggle Handler
  const handleReminderToggle = (reminderKey) => {
    setReminders(prev => ({
      ...prev,
      [reminderKey]: !prev[reminderKey]
    }));
  };

  // Status Badge Click Handler
  const handleStatusClick = () => {
    const statusOptions = ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'PENDING PAYMENT'];
    const currentIndex = statusOptions.indexOf(invoiceData.status);
    const nextStatus = statusOptions[(currentIndex + 1) % statusOptions.length];
    
    // Update status based on selection
    switch (nextStatus) {
      case 'PAID':
        handleMarkAsPaid();
        break;
      case 'OVERDUE':
        handleMarkAsOverdue();
        break;
      case 'SENT':
        handleSendInvoice();
        break;
      default:
        // For other statuses, we could add more handlers
        addError({ 
          message: `Status updated to ${nextStatus}`, 
          code: 'STATUS_UPDATE',
          type: 'success'
        });
    }
  };
  
  // Build invoice data from selected invoice with graceful fallbacks for non-input sections
  const selected = getCurrentInvoice();

  const invoiceData = selected ? {
    id: selected.id,
    status: selected.status || 'DRAFT',
    sender: {
      // Mocked sender (not in input form yet)
      name: 'Fabulous Enterprise',
      phone: '+386 989 271 3115',
      address: '1331 Hart Ridge Road, 48436 Gaines, MI',
      email: 'info@fabulousenterprise.co'
    },
    customer: {
      name: selected.customerName,
      phone: selected.customerPhone || '+000 000 0000',
      email: selected.customerEmail || 'customer@email.com'
    },
    details: {
      invoiceNo: selected.id,
      issueDate: selected.issueDate || '-',
      dueDate: selected.dueDate || selected.date || '-',
      currency: 'USD ($)'
    },
    items: (selected.items || []).map(item => ({
      name: item.name,
      description: item.description,
      qty: item.qty,
      rate: typeof item.rate === 'number' ? `$${item.rate.toLocaleString()}` : item.rate,
      amount: typeof item.amount === 'number' ? `$${item.amount.toLocaleString()}` : (item.amount || '$0.00')
    })),
    subtotal: (() => {
      const sum = (selected.items || []).reduce((acc, it) => acc + (parseFloat(it.amount) || 0), 0);
      return sum ? `$${sum.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : selected.subtotal ? `$${(+selected.subtotal).toLocaleString()}` : '$0.00';
    })(),
    discount: selected.discount ? `$${(+selected.discount).toLocaleString()}` : '$0.00',
    total: selected.amount || (selected.total ? `$${(+selected.total).toLocaleString()}` : '$0.00')
  } : {
    // Fallback to previous mock when nothing is selected
    id: '1023494-2304',
    status: 'PARTIAL PAYMENT',
    sender: {
      name: 'Fabulous Enterprise',
      phone: '+386 989 271 3115',
      address: '1331 Hart Ridge Road, 48436 Gaines, MI',
      email: 'info@fabulousenterprise.co'
    },
    customer: {
      name: 'Olaniyi Ojo Adewale',
      phone: '+386 989 271 3115',
      email: 'info@fabulousenterprise.co'
    },
    details: {
      invoiceNo: '1023902390',
      issueDate: 'March 30th, 2023',
      dueDate: 'May 19th, 2023',
      currency: 'USD ($)'
    },
    items: [
      { name: 'Email Marketing', description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium', qty: 10, rate: '$1,500', amount: '$15,000.00' },
      { name: 'Video looping effect', qty: 6, rate: '$1,110,500', amount: '$6,663,000.00' },
      { name: 'Graphic design for emails', description: 'Sed ut perspiciatis unde omnis accusantium', qty: 7, rate: '$2,750', amount: '$19,250.00' },
      { name: 'Video looping effect', qty: 6, rate: '$1,110,500', amount: '$6,663,000.00' }
    ],
    subtotal: '$6,697,200.00',
    discount: '$167,430.00',
    total: '$6,529,770.00'
  };

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center p-2 sm:p-4">
          <div ref={invoiceRef} className="bg-white rounded-2xl lg:rounded-[40px] shadow-lg max-w-7xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <div className="absolute top-2 right-4 sm:right-12 z-10">
              <button 
                onClick={() => navigate('dashboard')}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

        {/* Invoice Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between p-4 sm:p-6 lg:p-8 gap-4 lg:gap-6">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-darkGray mb-2">Invoice - {invoiceData.id}</h2>
            <p className="text-sm lg:text-base text-lightGray mb-3">View the details and activity of this invoice</p>
            <button 
              onClick={handleStatusClick}
              className={`inline-block px-3 lg:px-4 py-1 lg:py-2 border text-xs lg:text-sm font-medium rounded-full cursor-pointer hover:opacity-80 transition-opacity ${getStatusColorClass(invoiceData.status)}`}
              title="Click to change status"
            >
              {invoiceData.status}
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4">
            <button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="px-4 lg:px-6 py-2 lg:py-3 border border-gray-200 bg-white text-appBlue rounded-full text-xs lg:text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-blue-50 transition-colors"
            >
              {isGeneratingPDF ? (
                <>
                  <LoadingSpinner size="sm" />
                  Generating...
                </>
              ) : (
                'DOWNLOAD AS PDF'
              )}
            </button>
            <button 
              onClick={handleSendInvoice}
              disabled={isLoading('sendInvoice')}
              className="px-6 lg:px-8 py-2 lg:py-3 bg-appBlue text-white rounded-full text-xs lg:text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading('sendInvoice') ? (
                <>
                  <LoadingSpinner size="sm" />
                  Sending...
                </>
              ) : (
                'SEND INVOICE'
              )}
            </button>
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                className="px-3 lg:px-4 py-2 lg:py-3 border border-gray-200 bg-white text-darkGray rounded-full text-xs lg:text-sm font-medium"
              >
                MORE
              </button>
              
              {/* Dropdown Menu */}
              {isMoreDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button 
                    onClick={handleMarkAsPaid}
                    disabled={isLoading('markAsPaid')}
                    className="w-full text-left px-4 py-3 text-sm text-lightGray font-medium hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading('markAsPaid') ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Processing...
                      </>
                    ) : (
                      'MARK AS PAID'
                    )}
                  </button>
                  <button 
                    onClick={handleMarkAsOverdue}
                    className="w-full text-left px-4 py-3 text-sm text-lightGray font-medium hover:bg-gray-50"
                  >
                    MARK AS OVERDUE
                  </button>
                  <button 
                    onClick={() => setIsMoreDropdownOpen(false)}
                    className="w-full text-left px-4 py-3 text-sm text-lightGray font-medium hover:bg-gray-50"
                  >
                    DUPLICATE INVOICE
                  </button>
                  <button 
                    onClick={handleGenerateShareableLink}
                    disabled={isGeneratingLink}
                    className="w-full text-left px-4 py-3 text-sm text-lightGray font-medium hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isGeneratingLink ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Generating...
                      </>
                    ) : (
                      'GET SHARABLE LINK'
                    )}
                  </button>
                  <hr className="my-2" />
                  <button 
                    onClick={handleDelete}
                    disabled={isLoading('deleteInvoice')}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 font-medium hover:bg-red-50 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading('deleteInvoice') ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Deleting...
                      </>
                    ) : (
                      'DELETE INVOICE'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reminders Section */}
        <div className="px-3 sm:px-4 py-4 sm:py-6 border border-gray-200 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mx-4 sm:mx-6 lg:mx-8 w-auto sm:w-[85%] rounded-2xl mb-6 lg:mb-8">
          <h4 className="text-xs font-medium text-lightGray whitespace-nowrap">REMINDERS</h4>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button 
              onClick={() => handleReminderToggle('14days')}
              className={`px-2 sm:px-3 py-1 text-darkGray text-xs sm:text-sm rounded-full flex items-center gap-1 sm:gap-2 font-medium transition-colors ${
                reminders['14days'] 
                  ? 'bg-[#E6FFF0] hover:bg-green-100' 
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>14 days before due date</span>
              {reminders['14days'] && <span className="text-green-600">✓</span>}
            </button>
            <button 
              onClick={() => handleReminderToggle('7days')}
              className={`px-2 sm:px-3 py-1 text-darkGray text-xs sm:text-sm rounded-full flex items-center gap-1 sm:gap-2 font-medium transition-colors ${
                reminders['7days'] 
                  ? 'bg-[#E6FFF0] hover:bg-green-100' 
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>7 days before due date</span>
              {reminders['7days'] && <span className="text-green-600">✓</span>}
            </button>
            <button 
              onClick={() => handleReminderToggle('3days')}
              className={`px-2 sm:px-3 py-1 text-darkGray text-xs sm:text-sm rounded-full font-medium transition-colors ${
                reminders['3days'] 
                  ? 'bg-[#E6FFF0] hover:bg-green-100' 
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              3 days before due date
            </button>
            <button 
              onClick={() => handleReminderToggle('24hrs')}
              className={`px-2 sm:px-3 py-1 text-darkGray text-xs sm:text-sm rounded-full font-medium transition-colors ${
                reminders['24hrs'] 
                  ? 'bg-[#E6FFF0] hover:bg-green-100' 
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              24 hrs before due date
            </button>
            <button 
              onClick={() => handleReminderToggle('dueDate')}
              className={`px-2 sm:px-3 py-1 text-darkGray text-xs sm:text-sm rounded-full font-medium transition-colors ${
                reminders['dueDate'] 
                  ? 'bg-[#E6FFF0] hover:bg-green-100' 
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              On the due date
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
              {/* Main Invoice Content */}
              <div className="flex-1 p-4 sm:p-6 border border-gray-200 rounded-2xl mx-4 sm:mx-6 lg:mx-8">

                {/* Sender and Customer Info */}
                <div className="bg-[#FCDDEC] rounded-2xl p-4 sm:p-6 lg:p-8 mb-6">
                  {/* Sender and Customer Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-6 lg:mb-8">
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-lightGray mb-3 lg:mb-4">SENDER</h4>
                      <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                          <img src={images} alt="fabulous image" className="object-cover p-1 sm:p-2" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-darkGray text-base lg:text-lg mb-1 lg:mb-2">{invoiceData.sender.name}</p>
                          <p className="text-xs sm:text-sm text-lightGray mb-1">{invoiceData.sender.phone}</p>
                          <p className="text-xs sm:text-sm text-lightGray mb-1">{invoiceData.sender.address}</p>
                          <p className="text-xs sm:text-sm text-lightGray">{invoiceData.sender.email}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-lightGray mb-3 lg:mb-4">CUSTOMER</h4>
                      <div>
                        <p className="font-semibold text-darkGray text-base lg:text-lg mb-1 lg:mb-2">{invoiceData.customer.name}</p>
                        <p className="text-xs sm:text-sm text-lightGray mb-1">{invoiceData.customer.phone}</p>
                        <p className="text-xs sm:text-sm text-lightGray">{invoiceData.customer.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Details Section */}
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-lightGray mb-3 lg:mb-4">INVOICE DETAILS</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                      <div>
                        <p className="text-xs font-medium text-lightGray mb-1">INVOICE NO</p>
                        <p className="font-semibold text-darkGray text-sm lg:text-base">{invoiceData.details.invoiceNo}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-lightGray mb-1">ISSUE DATE</p>
                        <p className="font-semibold text-darkGray text-sm lg:text-base">{invoiceData.details.issueDate}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-lightGray mb-1">DUE DATE</p>
                        <p className="font-semibold text-darkGray text-sm lg:text-base">{invoiceData.details.dueDate}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-lightGray mb-1">BILLING CURRENCY</p> 
                        <p className="font-semibold text-darkGray text-sm lg:text-base">{invoiceData.details.currency}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-6 lg:mb-8">
                  <div className="flex items-center mb-4 lg:mb-6">
                    <h4 className="text-base lg:text-lg font-semibold text-darkGray">Items</h4>
                    <div className="flex-1 h-px bg-gray-200 ml-4"></div>
                  </div>
                  
                  {/* Mobile Items Layout */}
                  <div className="lg:hidden space-y-4">
                    {invoiceData.items.map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="mb-3">
                          <p className="font-medium text-darkGray text-sm mb-1">{item.name}</p>
                          {item.description && (
                            <p className="text-xs text-lightGray leading-relaxed">{item.description}</p>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div className="text-center">
                            <p className="text-lightGray mb-1">QTY</p>
                            <p className="font-medium text-darkGray">{item.qty}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lightGray mb-1">RATE</p>
                            <p className="font-medium text-darkGray">{item.rate}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lightGray mb-1">AMOUNT</p>
                            <p className="font-medium text-darkGray">{item.amount}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Desktop Items Layout */}
                  <div className="hidden lg:block space-y-6 lg:space-y-8">
                    {/* Desktop Table Header */}
                    <div className="grid grid-cols-12 gap-6 pb-3 border-b border-gray-200">
                      <div className="col-span-6">
                        <p className="text-xs font-medium text-lightGray uppercase tracking-wide">Item Description</p>
                      </div>
                      <div className="col-span-2 text-right">
                        <p className="text-xs font-medium text-lightGray uppercase tracking-wide">Qty</p>
                      </div>
                      <div className="col-span-2 text-right">
                        <p className="text-xs font-medium text-lightGray uppercase tracking-wide">Rate</p>
                      </div>
                      <div className="col-span-2 text-right">
                        <p className="text-xs font-medium text-lightGray uppercase tracking-wide">Amount</p>
                      </div>
                    </div>
                    
                    {/* Items List */}
                    {invoiceData.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-6 items-start py-2">
                        <div className="col-span-6">
                          <p className="font-medium text-darkGray text-sm lg:text-base mb-1">{item.name}</p>
                          {item.description && (
                            <p className="text-xs lg:text-sm w-[90%] text-lightGray leading-relaxed">{item.description}</p>
                          )}
                        </div>
                        <div className="col-span-2 text-right">
                          <p className="text-darkGray font-medium text-sm lg:text-base">{item.qty}</p>
                        </div>
                        <div className="col-span-2 text-right">
                          <p className="text-darkGray font-medium text-sm lg:text-base">{item.rate}</p>
                        </div>
                        <div className="col-span-2 text-right">
                          <p className="text-darkGray font-medium text-sm lg:text-base">{item.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Totals */}
                  <div className="mt-4 lg:mt-6 space-y-2 max-w-xs sm:max-w-sm lg:max-w-md ml-auto">
                    <div className="flex justify-between text-sm lg:text-base">
                      <span className="text-lightGray">SUBTOTAL</span>
                      <span className="font-medium text-gray-900">{invoiceData.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm lg:text-base">
                      <span className="text-lightGray">DISCOUNT (2.5%)</span>
                      <span className="font-medium text-darkGray">-{invoiceData.discount}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-primaryBlack font-medium text-base lg:text-lg">TOTAL AMOUNT DUE</span>
                      <span className="text-lg lg:text-xl font-semibold">{invoiceData.total}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6">
                  <h4 className="text-xs sm:text-sm font-medium text-lightGray mb-3 lg:mb-4">PAYMENT INFORMATION</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">ACCOUNT NAME</p>
                        <p className="text-sm sm:text-base text-darkGray font-semibold">1023902390</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">ACCOUNT NUMBER</p>
                        <p className="text-sm sm:text-base text-darkGray font-semibold">March 30th, 2023</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">ACH ROUTING NO</p>
                        <p className="text-sm sm:text-base text-darkGray font-semibold">May 19th, 2023</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">BANK NAME</p>
                        <p className="text-sm sm:text-base text-darkGray font-semibold">USD ($)</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">BANK ADDRESS</p>
                      <p className="text-sm sm:text-base text-darkGray font-semibold">1023902390</p>
                    </div>
                  </div>
                </div>

                <div className='mt-6 bg-[#F6F8FA] rounded-2xl p-6'>
                  <h4 className="text-sm font-medium text-[#B7BDCF] mb-2">NOTE</h4>
                  <p className="text-darkGray ">Thank you for your patronage</p>
                </div>
              </div>

          {/* Activity Sidebar */}
          <div className="w-full lg:w-[30%] border-t lg:border-t-0 border-gray-200 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 bg-white">
            <h4 className="text-lg font-semibold text-darkGray mb-6 lg:mb-8">Invoice Activity</h4>
            
            {/* Timeline */}
            <div className="relative pl-2">
              {/* Vertical Line */}
              <div className="absolute left-6 top-0 w-px bg-gray-200" style={{height: 'calc(100% - 6rem)'}}></div>
              
              <div className="space-y-8">
                {[
                  { action: 'You', time: 'Today, 12:20 PM', description: 'Created invoice 00239434/Olaniyi Ojo Adewale' },
                  { action: 'You', time: 'Today, 12:20 PM', description: 'Sent invoice 00239434/Olaniyi Ojo Adewale to Olaniyi Ojo Adewale' },
                  { action: 'Payment Confirmed', time: 'Today, 12:20 PM', description: 'You manually confirmed a partial payment of $503,000.00' },
                  { action: 'Payment Confirmed', time: 'Today, 12:20 PM', description: 'You manually confirmed a full payment of $6,000,000.00' },
                  { action: 'You', time: 'Today, 12:20 PM', description: 'Sent invoice 00239434/Olaniyi Ojo Adewale to Olaniyi Ojo Adewale' }
                ].map((activity, index) => (
                  <div key={index} className="relative flex items-start pb-4">
                    {/* Avatar */}
                    <div className="relative z-10 w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-white text-sm font-medium">KO</span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="mb-2">
                        <span className="font-semibold text-darkGray text-sm lg:text-base">{activity.action}</span>
                        <div className="text-xs lg:text-sm text-lightGray mt-1">{activity.time}</div>
                      </div>
                      
                      {/* Activity Bubble */}
                      <div className="bg-gray-100 rounded-lg px-4 py-3 inline-block shadow-sm">
                        <span className="text-xs lg:text-sm">
                          {activity.description.includes('Created invoice') && (
                            <>
                              <span className="text-lightGray">Created invoice </span>
                              <span className="font-bold text-darkGray">00239434/Olaniyi Ojo Adewale</span>
                            </>
                          )}
                          {activity.description.includes('Sent invoice') && (
                            <>
                              <span className="text-lightGray">Sent invoice </span>
                              <span className="font-bold text-darkGray">00239434/Olaniyi Ojo Adewale</span>
                              <span className="text-lightGray"> to </span>
                              <span className="font-bold text-darkGray">Olaniyi Ojo Adewale</span>
                            </>
                          )}
                          {activity.description.includes('partial payment') && (
                            <>
                              <span className="text-lightGray">You manually confirmed a partial payment of </span>
                              <span className="font-bold text-darkGray">$503,000.00</span>
                            </>
                          )}
                          {activity.description.includes('full payment') && (
                            <>
                              <span className="text-lightGray">You manually confirmed a full payment of </span>
                              <span className="font-bold text-darkGray">$6,000,000.00</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
