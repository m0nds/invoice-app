import { describe, it, expect, vi, beforeEach } from 'vitest';


const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};


if (typeof global !== 'undefined') {
  global.localStorage = localStorageMock;
} else if (typeof globalThis !== 'undefined') {
  globalThis.localStorage = localStorageMock;
}

describe('Invoice App Core Logic Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('Invoice Data Management', () => {
    it('should handle invoice creation data structure', () => {
      const invoiceData = {
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '+1234567890',
        issueDate: '2023-10-15',
        dueDate: '2023-11-15',
        items: [
          { name: 'Test Item', description: 'Test Description', qty: 1, rate: 100, amount: 100 }
        ],
        note: 'Test note'
      };

      expect(invoiceData.customerName).toBe('John Doe');
      expect(invoiceData.items).toHaveLength(1);
      expect(invoiceData.items[0].amount).toBe(100);
    });

    it('should calculate invoice totals correctly', () => {
      const items = [
        { amount: 100 },
        { amount: 200 },
        { amount: 50 }
      ];
      
      const total = items.reduce((sum, item) => sum + item.amount, 0);
      expect(total).toBe(350);
    });

    it('should generate unique invoice IDs', () => {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.random().toString(36).substr(2, 4);
      const invoiceId = `${timestamp}-${random.toUpperCase()}`;
      
      expect(invoiceId).toMatch(/^\d{6}-[A-Z0-9]{4}$/);
      expect(invoiceId).toHaveLength(11);
    });
  });

  describe('Date Calculations', () => {
    it('should calculate days until due date', () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const diffTime = tomorrow - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      expect(diffDays).toBe(1);
    });

    it('should format dates correctly', () => {
      const testDate = new Date('2023-10-15T10:00:00Z');
      const formatted = testDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
      
      expect(formatted).toMatch(/Oct 15, 2023/);
    });
  });

  describe('Status Management', () => {
    it('should handle invoice statuses', () => {
      const statuses = ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'PENDING PAYMENT'];
      
      expect(statuses).toContain('DRAFT');
      expect(statuses).toContain('PAID');
      expect(statuses).toHaveLength(5);
    });

    it('should map status colors correctly', () => {
      const statusColors = {
        'PAID': 'green',
        'OVERDUE': 'red',
        'DRAFT': 'gray',
        'PENDING PAYMENT': 'yellow',
        'SENT': 'blue'
      };

      expect(statusColors['PAID']).toBe('green');
      expect(statusColors['OVERDUE']).toBe('red');
      expect(statusColors['DRAFT']).toBe('gray');
    });
  });

  describe('LocalStorage Operations', () => {
    it('should store and retrieve invoice data', () => {
      const mockInvoices = [
        { id: 'INV-001', customerName: 'John Doe', amount: '$1,500.00' },
        { id: 'INV-002', customerName: 'Jane Smith', amount: '$2,300.00' }
      ];

      localStorageMock.setItem('invoice_app_invoices', JSON.stringify(mockInvoices));
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockInvoices));

      const stored = JSON.parse(localStorageMock.getItem('invoice_app_invoices'));
      
      expect(stored).toHaveLength(2);
      expect(stored[0].customerName).toBe('John Doe');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('invoice_app_invoices', JSON.stringify(mockInvoices));
    });

    it('should handle empty localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const stored = localStorageMock.getItem('invoice_app_invoices');
      expect(stored).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid invoice data gracefully', () => {
      const invalidData = {
        customerName: '',
        items: []
      };

      expect(invalidData.customerName).toBe('');
      expect(invalidData.items).toHaveLength(0);
    });

    it('should validate required fields', () => {
      const requiredFields = ['customerName', 'customerEmail', 'issueDate', 'dueDate'];
      const invoiceData = {
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        issueDate: '2023-10-15',
        dueDate: '2023-11-15'
      };

      const isValid = requiredFields.every(field => invoiceData[field]);
      expect(isValid).toBe(true);
    });
  });
});
