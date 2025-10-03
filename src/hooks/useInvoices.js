import { useState, useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';
import { useError } from '../context/ErrorContext';

const useInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentInvoiceId, setCurrentInvoiceId] = useState(() => {
    try {
      return localStorage.getItem('invoice_app_current_invoice_id') || null;
    } catch {
      return null;
    }
  });
  const { setLoading } = useLoading();
  const { addError } = useError();

  // Get stored invoices from localStorage
  const getStoredInvoices = () => {
    try {
      const stored = localStorage.getItem('invoice_app_invoices');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading stored invoices:', error);
      return [];
    }
  };

  // Save invoices to localStorage
  const saveInvoices = (invoiceList) => {
    try {
      localStorage.setItem('invoice_app_invoices', JSON.stringify(invoiceList));
    } catch (error) {
      console.error('Error saving invoices:', error);
    }
  };

  // Select current invoice helpers
  const selectInvoice = (invoiceId) => {
    setCurrentInvoiceId(invoiceId);
    try {
      localStorage.setItem('invoice_app_current_invoice_id', invoiceId || '');
    } catch {}
  };

  const getCurrentInvoice = () => {
    if (!currentInvoiceId) return null;
    return invoices.find(inv => inv.id === currentInvoiceId) || null;
  };

  // Generate unique invoice ID
  const generateInvoiceId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4);
    return `${timestamp}-${random.toUpperCase()}`;
  };

  // Calculate stats from invoice list
  const calculateStats = (invoiceList) => {
    const stats = {
      totalPaid: { value: 0, count: 0 },
      totalOverdue: { value: 0, count: 0 },
      totalDraft: { value: 0, count: 0 },
      totalUnpaid: { value: 0, count: 0 }
    };

    invoiceList.forEach(invoice => {
      const amount = parseFloat(invoice.amount.replace('$', '').replace(',', '')) || 0;
      
      switch (invoice.status) {
        case 'PAID':
          stats.totalPaid.value += amount;
          stats.totalPaid.count++;
          break;
        case 'OVERDUE':
          stats.totalOverdue.value += amount;
          stats.totalOverdue.count++;
          break;
        case 'DRAFT':
          stats.totalDraft.value += amount;
          stats.totalDraft.count++;
          break;
        case 'PENDING PAYMENT':
        case 'SENT':
          stats.totalUnpaid.value += amount;
          stats.totalUnpaid.count++;
          break;
      }
    });

    return stats;
  };

  const fetchInvoices = async () => {
    setLoading('invoices', true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Get stored invoices or use default data
      let storedInvoices = getStoredInvoices();
      
      // If no stored invoices, use default sample data
      if (storedInvoices.length === 0) {
        storedInvoices = [
          {
            id: '1023494-2304',
            customerName: 'Olaniyi Ojo Adewale',
            customerEmail: 'olaniyi@email.com',
            date: 'May 19th, 2023',
            amount: '$1,311,750.12',
            status: 'PAID',
            statusColor: 'green',
            createdAt: '2023-05-19T10:00:00Z'
          },
          {
            id: '1023495-2305',
            customerName: 'Jane Smith',
            customerEmail: 'jane@email.com',
            date: 'May 20th, 2023',
            amount: '$4,000.00',
            status: 'OVERDUE',
            statusColor: 'red',
            createdAt: '2023-05-20T09:00:00Z'
          },
          {
            id: '1023496-2306',
            customerName: 'Tech Corp Ltd',
            customerEmail: 'billing@techcorp.com',
            date: 'Sep 28th, 2023',
            amount: '$4,950.00',
            status: 'DRAFT',
            statusColor: 'gray',
            createdAt: '2023-09-28T14:00:00Z'
          }
        ];
        saveInvoices(storedInvoices);
      }

      // Sort by creation date (newest first)
      storedInvoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setInvoices(storedInvoices);
      
      // Calculate and set stats
      const calculatedStats = calculateStats(storedInvoices);
      setStats(calculatedStats);
      
    } catch (error) {
      addError({
        message: 'Failed to fetch invoices. Please try again.',
        code: 'FETCH_INVOICES_ERROR'
      });
    } finally {
      setLoading('invoices', false);
    }
  };

  const fetchStats = async () => {
    setLoading('stats', true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Stats are calculated in fetchInvoices, so we don't need to do anything here
      // unless stats is null
      if (!stats) {
        const storedInvoices = getStoredInvoices();
        const calculatedStats = calculateStats(storedInvoices);
        setStats(calculatedStats);
      }
      
    } catch (error) {
      addError({
        message: 'Failed to fetch statistics. Please try again.',
        code: 'FETCH_STATS_ERROR'
      });
    } finally {
      setLoading('stats', false);
    }
  };

  const createInvoice = async (invoiceData) => {
    setLoading('createInvoice', true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Calculate total amount from items
      const totalAmount = invoiceData.items.reduce((sum, item) => 
        sum + parseFloat(item.amount || 0), 0
      );

      // Format date for display
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric'
        }).replace(',', 'th,');
      };

      // Create new invoice object
      const newInvoice = {
        id: generateInvoiceId(),
        customerName: invoiceData.customerName,
        customerEmail: invoiceData.customerEmail,
        customerPhone: invoiceData.customerPhone,
        date: formatDate(invoiceData.dueDate),
        amount: `$${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        status: 'DRAFT',
        statusColor: 'gray',
        createdAt: new Date().toISOString(),
        issueDate: invoiceData.issueDate,
        dueDate: invoiceData.dueDate,
        items: invoiceData.items,
        note: invoiceData.note,
        subtotal: totalAmount,
        total: totalAmount
      };

      // Get current invoices and add new one
      const currentInvoices = getStoredInvoices();
      const updatedInvoices = [newInvoice, ...currentInvoices];
      
      // Save to localStorage
      saveInvoices(updatedInvoices);
      
      // Update state
      setInvoices(updatedInvoices);
      // Set as current invoice
      selectInvoice(newInvoice.id);
      
      // Recalculate stats
      const updatedStats = calculateStats(updatedInvoices);
      setStats(updatedStats);
      
      return { success: true };
    } catch (error) {
      console.error('Create invoice error:', error);
      addError({
        message: 'Failed to create invoice. Please try again.',
        code: 'CREATE_INVOICE_ERROR'
      });
      return { success: false, error: error.message };
    } finally {
      setLoading('createInvoice', false);
    }
  };

  // Delete invoice function
  const deleteInvoice = async (invoiceId) => {
    setLoading('deleteInvoice', true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentInvoices = getStoredInvoices();
      const updatedInvoices = currentInvoices.filter(invoice => invoice.id !== invoiceId);
      
      saveInvoices(updatedInvoices);
      setInvoices(updatedInvoices);
      
      const updatedStats = calculateStats(updatedInvoices);
      setStats(updatedStats);
      
      return { success: true };
    } catch (error) {
      addError({
        message: 'Failed to delete invoice.',
        code: 'DELETE_INVOICE_ERROR'
      });
      return { success: false };
    } finally {
      setLoading('deleteInvoice', false);
    }
  };

  // Update invoice status
  const updateInvoiceStatus = async (invoiceId, newStatus) => {
    setLoading('updateInvoice', true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentInvoices = getStoredInvoices();
      const updatedInvoices = currentInvoices.map(invoice => {
        if (invoice.id === invoiceId) {
          const statusColors = {
            'PAID': 'green',
            'OVERDUE': 'red',
            'DRAFT': 'gray',
            'PENDING PAYMENT': 'yellow',
            'SENT': 'blue'
          };
          
          return {
            ...invoice,
            status: newStatus,
            statusColor: statusColors[newStatus] || 'gray'
          };
        }
        return invoice;
      });
      
      saveInvoices(updatedInvoices);
      setInvoices(updatedInvoices);
      
      const updatedStats = calculateStats(updatedInvoices);
      setStats(updatedStats);
      
      return { success: true };
    } catch (error) {
      addError({
        message: 'Failed to update invoice status.',
        code: 'UPDATE_INVOICE_ERROR'
      });
      return { success: false };
    } finally {
      setLoading('updateInvoice', false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return {
    invoices,
    stats,
    currentInvoiceId,
    selectInvoice,
    getCurrentInvoice,
    fetchInvoices,
    fetchStats,
    createInvoice,
    deleteInvoice,
    updateInvoiceStatus
  };
};

export default useInvoices;