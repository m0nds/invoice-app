// Mock Database
let mockDatabase = {
    invoices: [
      {
        id: '1023494-2304',
        invoiceNo: '1023902390',
        customerId: 'cust_001',
        customerName: 'Olaniyi Ojo Adewale',
        customerEmail: 'olaniyi@email.com',
        customerPhone: '+386 989 271 3115',
        status: 'PAID',
        issueDate: '2023-03-30',
        dueDate: '2023-05-19',
        items: [
          { id: 1, name: 'Email Marketing', description: 'Sed ut perspiciatis unde omnis iste natus', qty: 10, rate: 1500, amount: 15000 },
          { id: 2, name: 'Video looping effect', description: '', qty: 6, rate: 1110500, amount: 6663000 },
          { id: 3, name: 'Graphic design for emails', description: 'Sed ut perspiciatis', qty: 7, rate: 2750, amount: 19250 },
        ],
        subtotal: 6697200,
        discount: 167430,
        total: 6529770,
        note: 'Thank you for your patronage',
        createdAt: '2023-03-30T10:00:00Z',
        updatedAt: '2023-05-19T15:30:00Z'
      },
      {
        id: '1023495-2305',
        invoiceNo: '1023902391',
        customerId: 'cust_002',
        customerName: 'Jane Smith',
        customerEmail: 'jane@email.com',
        customerPhone: '+1 555 123 4567',
        status: 'OVERDUE',
        issueDate: '2023-04-15',
        dueDate: '2023-05-15',
        items: [
          { id: 1, name: 'Web Development', description: 'Frontend development', qty: 40, rate: 100, amount: 4000 },
        ],
        subtotal: 4000,
        discount: 0,
        total: 4000,
        note: 'Payment terms: Net 30',
        createdAt: '2023-04-15T09:00:00Z',
        updatedAt: '2023-04-15T09:00:00Z'
      },
      {
        id: '1023496-2306',
        invoiceNo: '1023902392',
        customerId: 'cust_003',
        customerName: 'Tech Corp Ltd',
        customerEmail: 'billing@techcorp.com',
        customerPhone: '+44 20 1234 5678',
        status: 'DRAFT',
        issueDate: '2023-09-28',
        dueDate: '2023-10-28',
        items: [
          { id: 1, name: 'Consulting Services', description: 'Technical consultation', qty: 20, rate: 150, amount: 3000 },
          { id: 2, name: 'Training', description: 'Staff training sessions', qty: 5, rate: 500, amount: 2500 },
        ],
        subtotal: 5500,
        discount: 550,
        total: 4950,
        note: 'Draft invoice for review',
        createdAt: '2023-09-28T14:00:00Z',
        updatedAt: '2023-09-28T14:00:00Z'
      }
    ],
    customers: [
      { id: 'cust_001', name: 'Olaniyi Ojo Adewale', email: 'olaniyi@email.com', phone: '+386 989 271 3115' },
      { id: 'cust_002', name: 'Jane Smith', email: 'jane@email.com', phone: '+1 555 123 4567' },
      { id: 'cust_003', name: 'Tech Corp Ltd', email: 'billing@techcorp.com', phone: '+44 20 1234 5678' },
    ],
    activities: [
      { id: 1, type: 'invoice_created', invoiceId: '1023494-2304', description: 'Created invoice 00239434/Olaniyi Ojo Adewale', timestamp: '2023-09-28T12:05:00Z', user: 'KO' },
      { id: 2, type: 'invoice_sent', invoiceId: '1023494-2304', description: 'Sent invoice 00239434/Olaniyi Ojo Adewale to customer', timestamp: '2023-09-28T12:10:00Z', user: 'KO' },
      { id: 3, type: 'payment_confirmed', invoiceId: '1023494-2304', description: 'Payment confirmed for $503,000.00', timestamp: '2023-09-28T15:20:00Z', user: 'KO' },
      { id: 4, type: 'invoice_created', invoiceId: '1023495-2305', description: 'Created invoice for Jane Smith', timestamp: '2023-09-28T16:00:00Z', user: 'KO' },
    ]
  };
  
  // Utility functions
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };
  
  const generateInvoiceNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4);
    return `${timestamp}-${random}`;
  };
  
  // Error handling utility
  class ApiError extends Error {
    constructor(message, status = 500, code = 'UNKNOWN_ERROR') {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.code = code;
    }
  }
  
  // Simulate network conditions
  const simulateNetworkConditions = () => {
    const random = Math.random();
    
    // 5% chance of network error
    if (random < 0.05) {
      throw new ApiError('Network connection failed', 0, 'NETWORK_ERROR');
    }
    
    // 3% chance of server error
    if (random < 0.08) {
      throw new ApiError('Internal server error', 500, 'SERVER_ERROR');
    }
    
    // 2% chance of timeout
    if (random < 0.10) {
      throw new ApiError('Request timeout', 408, 'TIMEOUT_ERROR');
    }
  };
  

  class ApiService {
    constructor() {
      this.baseURL = 'https://api.invoice-app.com/v1'; // Mock URL
      this.timeout = 5000;
    }
  
    // Generic API call method
    async apiCall(method, endpoint, data = null, options = {}) {
      try {
        // Simulate network delay
        await delay(500 + Math.random() * 1000);
        
        // Simulate network conditions
        simulateNetworkConditions();
        
        
        switch (endpoint) {
          case '/invoices':
            if (method === 'GET') return this.getInvoices();
            if (method === 'POST') return this.createInvoice(data);
            break;
          case '/invoices/stats':
            if (method === 'GET') return this.getInvoiceStats();
            break;
          case '/customers':
            if (method === 'GET') return this.getCustomers();
            if (method === 'POST') return this.createCustomer(data);
            break;
          case '/activities':
            if (method === 'GET') return this.getActivities();
            break;
          default:
            if (endpoint.startsWith('/invoices/') && method === 'GET') {
              const id = endpoint.split('/')[2];
              return this.getInvoice(id);
            }
            if (endpoint.startsWith('/invoices/') && method === 'PUT') {
              const id = endpoint.split('/')[2];
              return this.updateInvoice(id, data);
            }
            if (endpoint.startsWith('/invoices/') && method === 'DELETE') {
              const id = endpoint.split('/')[2];
              return this.deleteInvoice(id);
            }
            throw new ApiError(`Endpoint not found: ${endpoint}`, 404, 'NOT_FOUND');
        }
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }
        throw new ApiError('Unexpected error occurred', 500, 'UNEXPECTED_ERROR');
      }
    }
  
    // Invoice API methods
    async getInvoices() {
      return {
        success: true,
        data: mockDatabase.invoices,
        pagination: {
          page: 1,
          pageSize: 10,
          total: mockDatabase.invoices.length,
          totalPages: 1
        }
      };
    }
  
    async getInvoice(id) {
      const invoice = mockDatabase.invoices.find(inv => inv.id === id);
      if (!invoice) {
        throw new ApiError('Invoice not found', 404, 'INVOICE_NOT_FOUND');
      }
      return {
        success: true,
        data: invoice
      };
    }
  
    async createInvoice(invoiceData) {
      const newInvoice = {
        id: generateInvoiceNumber(),
        invoiceNo: generateId(),
        ...invoiceData,
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockDatabase.invoices.unshift(newInvoice);
      
      // Add activity
      this.addActivity('invoice_created', newInvoice.id, `Created invoice ${newInvoice.id}`);
      
      return {
        success: true,
        data: newInvoice,
        message: 'Invoice created successfully'
      };
    }
  
    async updateInvoice(id, updateData) {
      const index = mockDatabase.invoices.findIndex(inv => inv.id === id);
      if (index === -1) {
        throw new ApiError('Invoice not found', 404, 'INVOICE_NOT_FOUND');
      }
      
      mockDatabase.invoices[index] = {
        ...mockDatabase.invoices[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      // Add activity
      this.addActivity('invoice_updated', id, `Updated invoice ${id}`);
      
      return {
        success: true,
        data: mockDatabase.invoices[index],
        message: 'Invoice updated successfully'
      };
    }
  
    async deleteInvoice(id) {
      const index = mockDatabase.invoices.findIndex(inv => inv.id === id);
      if (index === -1) {
        throw new ApiError('Invoice not found', 404, 'INVOICE_NOT_FOUND');
      }
      
      mockDatabase.invoices.splice(index, 1);
      
      // Add activity
      this.addActivity('invoice_deleted', id, `Deleted invoice ${id}`);
      
      return {
        success: true,
        message: 'Invoice deleted successfully'
      };
    }
  
    async getInvoiceStats() {
      const invoices = mockDatabase.invoices;
      
      const stats = {
        totalPaid: { value: 0, count: 0 },
        totalOverdue: { value: 0, count: 0 },
        totalDraft: { value: 0, count: 0 },
        totalUnpaid: { value: 0, count: 0 }
      };
      
      invoices.forEach(invoice => {
        switch (invoice.status) {
          case 'PAID':
            stats.totalPaid.value += invoice.total;
            stats.totalPaid.count++;
            break;
          case 'OVERDUE':
            stats.totalOverdue.value += invoice.total;
            stats.totalOverdue.count++;
            break;
          case 'DRAFT':
            stats.totalDraft.value += invoice.total;
            stats.totalDraft.count++;
            break;
          case 'PENDING_PAYMENT':
          case 'SENT':
            stats.totalUnpaid.value += invoice.total;
            stats.totalUnpaid.count++;
            break;
        }
      });
      
      return {
        success: true,
        data: stats
      };
    }
  
    // Customer API methods
    async getCustomers() {
      return {
        success: true,
        data: mockDatabase.customers
      };
    }
  
    async createCustomer(customerData) {
      const newCustomer = {
        id: `cust_${generateId()}`,
        ...customerData,
        createdAt: new Date().toISOString()
      };
      
      mockDatabase.customers.push(newCustomer);
      
      return {
        success: true,
        data: newCustomer,
        message: 'Customer created successfully'
      };
    }
  
    // Activity API methods
    async getActivities() {
      return {
        success: true,
        data: mockDatabase.activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      };
    }
  
    addActivity(type, invoiceId, description) {
      const activity = {
        id: mockDatabase.activities.length + 1,
        type,
        invoiceId,
        description,
        timestamp: new Date().toISOString(),
        user: 'KO'
      };
      
      mockDatabase.activities.unshift(activity);
      return activity;
    }
  }
  
  // Create API service instance
  const apiService = new ApiService();
  
  // Exported API functions
  export const invoiceAPI = {
    // Get all invoices
    getInvoices: () => apiService.apiCall('GET', '/invoices'),
    
    // Get single invoice
    getInvoice: (id) => apiService.apiCall('GET', `/invoices/${id}`),
    
    // Create new invoice
    createInvoice: (data) => apiService.apiCall('POST', '/invoices', data),
    
    // Update invoice
    updateInvoice: (id, data) => apiService.apiCall('PUT', `/invoices/${id}`, data),
    
    // Delete invoice
    deleteInvoice: (id) => apiService.apiCall('DELETE', `/invoices/${id}`),
    
    // Get invoice statistics
    getStats: () => apiService.apiCall('GET', '/invoices/stats'),
    
    // Send invoice
    sendInvoice: (id) => apiService.apiCall('POST', `/invoices/${id}/send`),
    
    // Mark as paid
    markAsPaid: (id, amount) => apiService.apiCall('POST', `/invoices/${id}/payment`, { amount })
  };
  
  export const customerAPI = {
    // Get all customers
    getCustomers: () => apiService.apiCall('GET', '/customers'),
    
    // Create customer
    createCustomer: (data) => apiService.apiCall('POST', '/customers', data)
  };
  
  export const activityAPI = {
    // Get activities
    getActivities: () => apiService.apiCall('GET', '/activities')
  };
  
  // Error handler utility
  export const handleApiError = (error) => {
    console.error('API Error:', error);
    
    const errorMessages = {
      'NETWORK_ERROR': 'Network connection failed. Please check your internet connection.',
      'SERVER_ERROR': 'Server error occurred. Please try again later.',
      'TIMEOUT_ERROR': 'Request timed out. Please try again.',
      'NOT_FOUND': 'The requested resource was not found.',
      'INVOICE_NOT_FOUND': 'Invoice not found.',
      'VALIDATION_ERROR': 'Please check your input and try again.',
      'UNAUTHORIZED': 'You are not authorized to perform this action.',
      'UNEXPECTED_ERROR': 'An unexpected error occurred. Please try again.'
    };
    
    return {
      message: errorMessages[error.code] || error.message || 'An error occurred',
      code: error.code || 'UNKNOWN_ERROR',
      status: error.status || 500
    };
  };
  
  // Loading state manager
  export const createLoadingManager = () => {
    const loadingStates = new Map();
    
    return {
      setLoading: (key, isLoading) => {
        loadingStates.set(key, isLoading);
      },
      
      isLoading: (key) => {
        return loadingStates.get(key) || false;
      },
      
      isAnyLoading: () => {
        return Array.from(loadingStates.values()).some(isLoading => isLoading);
      }
    };
  };