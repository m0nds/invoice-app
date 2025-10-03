import { useState, useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';

// Custom hook for activities
export const useActivities = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const { setLoading } = useLoading();

  const fetchActivities = async () => {
    setLoading('activities', true);
    setError(null);
    try {
      // Simulate API call
      const mockResponse = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: [
              { user: 'KO', action: 'Invoice creation', time: 'Yesterday, 12:05 PM', description: 'Created invoice 00239434/Olaniyi Ojo Adewale' },
              { user: 'KO', action: 'Invoice creation', time: 'Yesterday, 12:05 PM', description: 'Created invoice 00239434/Olaniyi Ojo Adewale' },
              { user: 'KO', action: 'Payment Confirmed', time: 'Yesterday, 11:30 AM', description: 'Payment confirmed for invoice #1023494' },
              { user: 'KO', action: 'Invoice sent', time: 'Yesterday, 10:15 AM', description: 'Invoice sent to customer' },
            ]
          });
        }, 400);
      });

      if (mockResponse.success) {
        setActivities(mockResponse.data);
      }
    } catch (error) {
      setError('Failed to fetch activities');
      console.error('Activities fetch error:', error);
    } finally {
      setLoading('activities', false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return {
    activities,
    error,
    fetchActivities
  };
};
