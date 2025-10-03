import { useError } from '../context/ErrorContext';

export const useNotification = () => {
  const { addError } = useError();

  const addSuccess = ({ message, code }) => {
    addError({ message, code, type: 'success' });
  };

  const addNotification = ({ message, code, type = 'info' }) => {
    addError({ message, code, type });
  };

  return { addSuccess, addNotification };
};

export default useNotification;

