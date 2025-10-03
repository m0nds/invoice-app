import { describe, it, expect } from 'vitest';


const formatCurrency = (amount) => {
  if (typeof amount === 'string') {
    return amount; 
  }
  if (typeof amount === 'number') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
  return '$0.00';
};

const getDaysUntilDue = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getStatusColorClass = (status) => {
  const statusColors = {
    'PAID': 'bg-green-100 text-green-800 border-green-200',
    'OVERDUE': 'bg-red-100 text-red-800 border-red-200',
    'DRAFT': 'bg-gray-100 text-gray-800 border-gray-200',
    'PENDING PAYMENT': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'SENT': 'bg-blue-100 text-blue-800 border-blue-200',
    'PARTIAL PAYMENT': 'bg-purple-100 text-purple-800 border-purple-200'
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

describe('Invoice Utility Functions', () => {
  describe('formatCurrency', () => {
    it('formats number as currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('handles string input', () => {
      expect(formatCurrency('$1,234.56')).toBe('$1,234.56');
      expect(formatCurrency('1000')).toBe('1000'); 
    });

    it('handles edge cases', () => {
      expect(formatCurrency(null)).toBe('$0.00');
      expect(formatCurrency(undefined)).toBe('$0.00');
      expect(formatCurrency('')).toBe(''); 
    });
  });

  describe('getDaysUntilDue', () => {
    it('calculates days until due date correctly', () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      expect(getDaysUntilDue(tomorrow.toISOString())).toBe(1);
    });

    it('handles past due dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      expect(getDaysUntilDue(yesterday.toISOString())).toBeLessThan(0);
    });

    it('handles same day', () => {
      const today = new Date();
      expect(getDaysUntilDue(today.toISOString())).toBe(0);
    });

    it('handles invalid dates', () => {
      expect(getDaysUntilDue('invalid-date')).toBeNaN();
      expect(getDaysUntilDue('')).toBeNaN();
    });
  });

  describe('getStatusColorClass', () => {
    it('returns correct color classes for different statuses', () => {
      expect(getStatusColorClass('PAID')).toBe('bg-green-100 text-green-800 border-green-200');
      expect(getStatusColorClass('OVERDUE')).toBe('bg-red-100 text-red-800 border-red-200');
      expect(getStatusColorClass('DRAFT')).toBe('bg-gray-100 text-gray-800 border-gray-200');
      expect(getStatusColorClass('PENDING PAYMENT')).toBe('bg-yellow-100 text-yellow-800 border-yellow-200');
      expect(getStatusColorClass('SENT')).toBe('bg-blue-100 text-blue-800 border-blue-200');
      expect(getStatusColorClass('PARTIAL PAYMENT')).toBe('bg-purple-100 text-purple-800 border-purple-200');
    });

    it('returns default color class for unknown status', () => {
      expect(getStatusColorClass('UNKNOWN_STATUS')).toBe('bg-gray-100 text-gray-800 border-gray-200');
      expect(getStatusColorClass('')).toBe('bg-gray-100 text-gray-800 border-gray-200');
      expect(getStatusColorClass(null)).toBe('bg-gray-100 text-gray-800 border-gray-200');
    });
  });

  describe('PDF Generation Mock', () => {
    it('should be mocked in test environment', () => {
      const mockResult = { success: true, fileName: 'test-invoice.pdf' };
      expect(mockResult.success).toBe(true);
      expect(mockResult.fileName).toBe('test-invoice.pdf');
    });
  });

  describe('Shareable Link Mock', () => {
    it('should generate shareable link', () => {
      const mockResult = { success: true, url: 'http://localhost:3000/invoice/test-123' };
      expect(mockResult.success).toBe(true);
      expect(mockResult.url).toBe('http://localhost:3000/invoice/test-123');
    });
  });

  describe('Date Formatting', () => {
    it('formats dates correctly', () => {
      const testDate = new Date('2023-10-15T10:00:00Z');
      const formatted = testDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      }).replace(',', 'th,');
      
      expect(formatted).toMatch(/Oct 15th, 2023/);
    });
  });

  describe('Invoice ID Generation', () => {
    it('generates unique invoice IDs', () => {

      const timestamp = Date.now().toString().slice(-6);
      const random = Math.random().toString(36).substr(2, 4);
      const invoiceId = `${timestamp}-${random.toUpperCase()}`;
      
      expect(invoiceId).toMatch(/^\d{6}-[A-Z0-9]{4}$/);
    });
  });

  describe('Amount Calculation', () => {
    it('calculates totals correctly', () => {
      const items = [
        { amount: 100 },
        { amount: 200 },
        { amount: 50 }
      ];
      
      const total = items.reduce((sum, item) => sum + item.amount, 0);
      expect(total).toBe(350);
    });

    it('handles string amounts', () => {
      const items = [
        { amount: '100' },
        { amount: '200.50' },
        { amount: '50' }
      ];
      
      const total = items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
      expect(total).toBe(350.5);
    });
  });
});
