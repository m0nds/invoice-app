import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase
vi.mock('../config/firebase', () => ({
  firebaseAuth: {
    signup: vi.fn().mockResolvedValue({ success: true, user: { id: 'test-user', email: 'test@example.com' } }),
    signin: vi.fn().mockResolvedValue({ success: true, user: { id: 'test-user', email: 'test@example.com' } }),
    signout: vi.fn().mockResolvedValue({ success: true }),
    onAuthStateChange: vi.fn().mockReturnValue(() => {}),
    getCurrentUser: vi.fn().mockReturnValue({ id: 'test-user', email: 'test@example.com' })
  },
  auth: {
    currentUser: { id: 'test-user', email: 'test@example.com' }
  }
}));

// Mock Socket.IO
vi.mock('../config/socket', () => ({
  default: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    isSocketConnected: vi.fn().mockReturnValue(true),
    isMockMode: vi.fn().mockReturnValue(true)
  },
  SOCKET_EVENTS: {
    NOTIFICATION: 'notification',
    INVOICE_CREATED: 'invoice_created',
    INVOICE_PAID: 'invoice_paid'
  }
}));

// Mock PDF generation
vi.mock('../utils/invoiceUtils', async () => {
  const actual = await vi.importActual('../utils/invoiceUtils');
  return {
    ...actual,
    generateInvoicePDF: vi.fn().mockResolvedValue({ 
      success: true, 
      fileName: 'test-invoice.pdf' 
    }),
    generateShareableLink: vi.fn().mockReturnValue({ 
      success: true, 
      url: 'http://localhost:3000/invoice/test-123' 
    })
  };
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Set up global mocks safely
if (typeof global !== 'undefined') {
  global.localStorage = localStorageMock;
  global.confirm = vi.fn().mockReturnValue(true);
  global.alert = vi.fn();
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
  global.console = {
    ...console,
    log: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
} else if (typeof globalThis !== 'undefined') {
  globalThis.localStorage = localStorageMock;
  globalThis.confirm = vi.fn().mockReturnValue(true);
  globalThis.alert = vi.fn();
  globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
  globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
  globalThis.console = {
    ...console,
    log: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
}
