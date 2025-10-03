import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useNotification from './useNotification';
import socketService, { SOCKET_EVENTS } from '../config/socket';

const useRealTimeNotifications = () => {
  const { addSuccess, addNotification } = useNotification();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [seenNotifications, setSeenNotifications] = useState(new Set());

  useEffect(() => {
    if (!user) {
      // Disconnect socket when no user
      socketService.disconnect();
      return;
    }

    // Ensure socket connects when user is available
    const userKey = user?.id || user?.email || 'guest';
    try {
      socketService.connect(userKey);
    } catch (e) {
      console.warn('Socket connection failed:', e);
    }

    const handleNotification = (data) => {
      // Create unique key for deduplication
      const notificationKey = `${data?.type}-${data?.data?.id || data?.message}`;
      
      // Skip if we've already seen this notification
      if (seenNotifications.has(notificationKey)) {
        console.log('Skipping duplicate notification:', notificationKey);
        return;
      }
      
      // Add to seen notifications
      setSeenNotifications(prev => new Set([...prev, notificationKey]));

      const notif = {
        message: data?.message || 'New activity detected',
        type: data?.type || 'info',
        data: data?.data
      };

      // Limit to 5 notifications max
      setNotifications(prev => [notif, ...prev].slice(0, 5));

      // Only show toast for important events, not all notifications
      if (data?.type === 'invoice_paid') {
        addSuccess({
          message: `💰 ${data.message} - ${data.data?.amount || ''}`,
          code: 'REALTIME_PAYMENT'
        });
      } else if (data?.type === 'invoice_created') {
        // Special handling for welcome message - make it green and only show once
        if (data.message?.includes('Welcome! Real-time updates are active')) {
          addSuccess({
            message: `✅ ${data.message}`,
            code: 'REALTIME_WELCOME'
          });
        }
        // Don't show toast for regular invoice creation to reduce spam
      } else if (data?.type === 'invoice_sent') {
        // Don't show toast for invoice sent to reduce spam
      }
    };

    // Only listen to the main notification event to avoid duplicates
    socketService.on(SOCKET_EVENTS.NOTIFICATION, handleNotification);

    return () => {
      socketService.off(SOCKET_EVENTS.NOTIFICATION, handleNotification);
      try {
        socketService.disconnect();
      } catch (e) {
        console.warn('Socket disconnect error:', e);
      }
    };
  }, [user, addSuccess, addNotification]); // Removed seenNotifications from dependencies

  return {
    notifications,
    isConnected: socketService.isSocketConnected(),
  };
};

export default useRealTimeNotifications;

