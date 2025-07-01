import { toast } from 'react-hot-toast';

interface FireToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  button?: string;
  action?: () => void;
  duration?: number;
}

const toastMap = {
  success: toast.success,
  error: toast.error,
  info: toast, // fallback to `toast()` for generic/info
};

const fireToast = (
  type: FireToastProps['type'],
  message: FireToastProps['message'],
  duration?: FireToastProps['duration']
) => {
  toastMap[type](message, { ...(duration && { duration }) });
};

export default fireToast;
