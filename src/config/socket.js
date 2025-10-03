import { io } from 'socket.io-client';

// Socket.IO server URL from environment or default
const SOCKET_URL = import.meta.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.mockMode = true; // Set to false when you have a real socket server
    this.mockInterval = null; // Track mock interval for cleanup
    this.welcomeSent = false; // Track if welcome message has been sent
  }

  // Initialize socket connection
  connect(userId) {
    if (this.mockMode) {
      // Mock connection for demo purposes
      this.isConnected = true;
      this.simulateMockEvents();
      return;
    }

    try {
      this.socket = io(SOCKET_URL, {
        auth: {
          userId: userId
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.isConnected = false;
      });

    } catch (error) {
      console.error('Socket initialization error:', error);
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.mockMode) {
      this.isConnected = false;
      // Clear mock interval
      if (this.mockInterval) {
        clearInterval(this.mockInterval);
        this.mockInterval = null;
      }
      // Don't reset welcomeSent - keep it for the session
      return;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Subscribe to events
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    if (!this.mockMode && this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Unsubscribe from events
  off(event, callback) {
    if (!this.mockMode && this.socket) {
      this.socket.off(event, callback);
    }

    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit events
  emit(event, data) {
    if (this.mockMode) {
      // Simulate server acknowledgment
      setTimeout(() => {
        this.triggerMockEvent(event + '_success', data);
      }, 500);
      return;
    }

    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('⚠️ Socket not connected. Cannot emit:', event);
    }
  }

  // Trigger mock events for listeners
  triggerMockEvent(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  // Simulate real-time events in mock mode
  simulateMockEvents() {
    if (!this.mockMode) return;

    // Clear any existing intervals
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
    }

    // Simulate invoice-related notifications every 5 minutes (much less spam)
    this.mockInterval = setInterval(() => {
      if (!this.isConnected) {
        clearInterval(this.mockInterval);
        return;
      }

      const mockEvents = [
        { 
          type: 'invoice_created', 
          message: 'New invoice created',
          data: {
            id: 'INV-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            customerName: ['John Doe', 'Jane Smith', 'Acme Corp', 'Tech Solutions'][Math.floor(Math.random() * 4)],
            amount: '$' + (Math.random() * 10000).toFixed(2)
          }
        },
        { 
          type: 'invoice_paid', 
          message: 'Invoice payment received',
          data: {
            id: 'INV-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            amount: '$' + (Math.random() * 5000).toFixed(2),
            customerName: ['John Doe', 'Jane Smith', 'Acme Corp'][Math.floor(Math.random() * 3)]
          }
        },
        { 
          type: 'invoice_sent', 
          message: 'Invoice sent to customer',
          data: {
            id: 'INV-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            customerEmail: 'customer@example.com',
            customerName: ['John Doe', 'Jane Smith'][Math.floor(Math.random() * 2)]
          }
        }
      ];

      const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      this.triggerMockEvent('notification', randomEvent);
    }, 300000); // Every 5 minutes (much less frequent)

    // Trigger one welcome event after 3 seconds for demo (only once per session)
    if (!this.welcomeSent) {
      setTimeout(() => {
        if (this.isConnected && !this.welcomeSent) {
          this.welcomeSent = true; // Mark as sent
          const welcomeEvent = {
            type: 'invoice_created',
            message: 'Welcome! Real-time updates are active',
            data: {
              id: 'INV-WELCOME',
              customerName: 'Demo Customer',
              amount: '$1,234.56'
            }
          };
          this.triggerMockEvent('notification', welcomeEvent);
        }
      }, 3000);
    }
  }

  // Check connection status
  isSocketConnected() {
    return this.isConnected;
  }

  // Get mock mode status
  isMockMode() {
    return this.mockMode;
  }

  // Set mock mode (for switching between mock and real server)
  setMockMode(enabled) {
    this.mockMode = enabled;
    console.log(enabled ? '🔴 Mock mode enabled' : '✅ Real socket mode enabled');
  }

  // Reset welcome message flag (for fresh sessions)
  resetWelcome() {
    this.welcomeSent = false;
  }
}

// Create singleton instance
const socketService = new SocketService();

// Socket event types
export const SOCKET_EVENTS = {
  // Incoming events (from server)
  INVOICE_CREATED: 'invoice_created',
  INVOICE_UPDATED: 'invoice_updated',
  INVOICE_DELETED: 'invoice_deleted',
  INVOICE_PAID: 'invoice_paid',
  INVOICE_SENT: 'invoice_sent',
  NOTIFICATION: 'notification',
  USER_ACTIVITY: 'user_activity',
  
  // Outgoing events (to server)
  CREATE_INVOICE: 'create_invoice',
  UPDATE_INVOICE: 'update_invoice',
  DELETE_INVOICE: 'delete_invoice',
  SEND_INVOICE: 'send_invoice',
  MARK_AS_PAID: 'mark_as_paid'
};

export default socketService;