import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Listen to global events from outside React (e.g., api interceptor)
  useEffect(() => {
    const handleGlobalToast = (event) => {
      const { type, message, duration } = event.detail;
      addToast(message, type, duration);
    };

    window.addEventListener('global-toast', handleGlobalToast);
    return () => window.removeEventListener('global-toast', handleGlobalToast);
  }, [addToast]);

  const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
  const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
  const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);
  const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto shadow-lg"
            >
              <ToastItem toast={toast} onRemove={() => removeToast(toast.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onRemove }) => {
  const { message, type } = toast;
  
  const getStyle = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-white',
          border: 'border-green-500',
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          text: 'text-gray-800'
        };
      case 'error':
        return {
          bg: 'bg-white',
          border: 'border-red-500',
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          text: 'text-gray-800'
        };
      case 'warning':
        return {
          bg: 'bg-white',
          border: 'border-yellow-500',
          icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
          text: 'text-gray-800'
        };
      case 'info':
      default:
        return {
          bg: 'bg-white',
          border: 'border-blue-500',
          icon: <Info className="w-5 h-5 text-blue-500" />,
          text: 'text-gray-800'
        };
    }
  };

  const style = getStyle();

  return (
    <div className={`${style.bg} border-l-4 ${style.border} rounded-r-lg p-4 flex items-start gap-3 w-full shadow-md`}>
      <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
      <div className={`flex-1 ${style.text} text-sm font-medium`}>{message}</div>
      <button 
        onClick={onRemove}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
