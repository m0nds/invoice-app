import useInvoices  from './useInvoices';
import { useError } from '../context/ErrorContext';
import { useLoading } from '../context/LoadingContext';

const useInvoiceActions = () => {
  const { updateInvoiceStatus, deleteInvoice } = useInvoices();
  const { addError } = useError();
  const { setLoading } = useLoading();

  const sendInvoice = async (invoiceId, customerName) => {
    setLoading('sendInvoice', true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await updateInvoiceStatus(invoiceId, 'SENT');
      if (result.success) {
        addError({
          message: `Invoice sent to ${customerName} successfully!`,
          code: 'INVOICE_SENT',
          type: 'success'
        });
      }
      return result;
    } catch (error) {
      addError({
        message: 'Failed to send invoice. Please try again.',
        code: 'SEND_INVOICE_ERROR'
      });
      return { success: false };
    } finally {
      setLoading('sendInvoice', false);
    }
  };

  const markAsPaid = async (invoiceId, customerName) => {
    setLoading('markAsPaid', true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = await updateInvoiceStatus(invoiceId, 'PAID');
      if (result.success) {
        addError({
          message: `Invoice marked as paid for ${customerName}!`,
          code: 'INVOICE_PAID',
          type: 'success'
        });
      }
      return result;
    } catch (error) {
      addError({
        message: 'Failed to mark invoice as paid. Please try again.',
        code: 'MARK_PAID_ERROR'
      });
      return { success: false };
    } finally {
      setLoading('markAsPaid', false);
    }
  };

  const markAsOverdue = async (invoiceId, customerName) => {
    const result = await updateInvoiceStatus(invoiceId, 'OVERDUE');
    if (result.success) {
      addError({
        message: `Invoice marked as overdue for ${customerName}.`,
        code: 'INVOICE_OVERDUE',
        type: 'success'
      });
    }
    return result;
  };

  const removeInvoice = async (invoiceId, customerName) => {
    setLoading('deleteInvoice', true);
    try {
      const result = await deleteInvoice(invoiceId);
      if (result.success) {
        addError({
          message: `Invoice for ${customerName} deleted successfully.`,
          code: 'INVOICE_DELETED',
          type: 'success'
        });
      }
      return result;
    } finally {
      setLoading('deleteInvoice', false);
    }
  };

  return {
    sendInvoice,
    markAsPaid,
    markAsOverdue,
    removeInvoice
  };
};

export default useInvoiceActions;
